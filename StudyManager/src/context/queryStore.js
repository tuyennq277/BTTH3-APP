import {getCache, setCache} from '../storage/cache';
import {CACHE_TTL} from '../config';

const entries = new Map();
let revision = 0;
function entry(key) {
  if (!entries.has(key)) {
    entries.set(key, {snapshot: {data: null, loading: true, refreshing: false, error: null, lastUpdated: null},
      listeners: new Set(), ready: null, request: null, fetcher: null, writes: Promise.resolve()});
  }
  return entries.get(key);
}
export const getSnapshot = key => entry(key).snapshot;
export const subscribeQuery = (key, listener) => {
  const item = entry(key); item.listeners.add(listener);
  return () => item.listeners.delete(listener);
};
function publish(item, values) {
  item.snapshot = {...item.snapshot, ...values};
  item.listeners.forEach(listener => listener());
}
function persist(key, item) {
  const {data, lastUpdated} = item.snapshot;
  const write = item.writes.catch(() => {}).then(() => setCache(key, data, lastUpdated));
  item.writes = write;
  return write;
}
export function hydrateQuery(key) {
  const item = entry(key);
  if (!item.ready) {
    item.ready = (async () => {
      try {
        const cached = await getCache(key);
        if (cached && item.snapshot.data === null) {
          publish(item, {data: cached.data, lastUpdated: cached.savedAt, loading: false});
        }
      } catch {
        publish(item, {error: {message: 'Không đọc được bộ nhớ trên thiết bị.'}});
      }
    })();
  }
  return item.ready;
}
export async function loadQuery(key, fetcher, isOnline) {
  const item = entry(key);
  item.fetcher = fetcher;
  await hydrateQuery(key);
  if (isOnline === null) {return;}
  if (!isOnline) {
    publish(item, {loading: false, refreshing: false,
      error: item.snapshot.data === null ? {message: 'Chưa có dữ liệu lưu trên máy. Kết nối mạng rồi thử lại.'} : null});
    return;
  }
  if (item.request) {return item.request;}
  item.request = (async () => {
    publish(item, {loading: item.snapshot.data === null, refreshing: item.snapshot.data !== null, error: null});
    // A GET started before a successful mutation must not overwrite the newer record.
    const startedAt = revision;
    try {
      const data = await fetcher();
      if (startedAt !== revision) {return;}
      publish(item, {data, lastUpdated: new Date().toISOString(), error: null});
      try {await persist(key, item);} catch {
        publish(item, {error: {message: 'Đã tải dữ liệu nhưng không lưu được cache. Hãy kiểm tra dung lượng thiết bị.'}});
      }
    } catch (error) {publish(item, {error});}
    finally {publish(item, {loading: false, refreshing: false}); item.request = null;}
  })();
  return item.request;
}
export const cacheIsStale = key => !entry(key).snapshot.lastUpdated ||
  Date.now() - new Date(entry(key).snapshot.lastUpdated).getTime() > CACHE_TTL;

// Seed detail cache from a list so a first visit to a detail page also works offline.
export async function seedDetail(key, record, lastUpdated) {
  if (!record) {return;}
  await hydrateQuery(key);
  const item = entry(key);
  if (item.snapshot.data === null) {
    publish(item, {data: record, lastUpdated, loading: false});
    await persist(key, item).catch(() => {});
  }
}
export async function acceptRecord(resource, record) {
  revision += 1;
  const jobs = [];
  for (const [key, item] of entries) {
    if (key === resource) {
      const before = item.snapshot.data;
      if (Array.isArray(before)) {
        const found = before.some(row => String(row.id) === String(record.id));
        const data = found ? before.map(row => String(row.id) === String(record.id) ? {...row, ...record} : row)
          : [...before, record];
        publish(item, {data, lastUpdated: new Date().toISOString()});
        jobs.push(persist(key, item));
      }
    } else if (key === `${resource}/${record.id}` || (resource === 'students' && key === 'student')) {
      publish(item, {data: {...item.snapshot.data, ...record}, lastUpdated: new Date().toISOString()});
      jobs.push(persist(key, item));
    }
  }
  // Commit to cache before deleting the outbox action, including after app restarts.
  await Promise.all(jobs);
}
export async function refreshAll(isOnline = true) {
  await Promise.all([...entries].filter(([, item]) => item.fetcher && item.listeners.size)
    .map(([key, item]) => loadQuery(key, item.fetcher, isOnline)));
}
