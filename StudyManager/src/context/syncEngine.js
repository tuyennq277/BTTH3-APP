import {request} from '../api/client';
import * as outbox from '../storage/outbox';
import {acceptRecord, hydrateQuery} from './queryStore';

let active = null;
const same = (a, b) => Object.keys(b).every(key => JSON.stringify(a[key]) === JSON.stringify(b[key]));

/** FIFO; stop at the first error. Stable POST IDs make retry after a lost response idempotent. */
export function flushOutbox({isOnline, onChange = () => {}, onConflict = () => {}}) {
  if (active) {return active;}
  active = (async () => {
    let synced = 0, conflicts = 0;
    while (isOnline()) {
      const action = (await outbox.getAll())[0];
      if (!action) {break;}
      const resource = action.url.split('/')[1];
      const recordUrl = action.method === 'POST' ? `${action.url}/${encodeURIComponent(action.body.id)}` : action.url;
      let current = null;
      try {
        current = await request('GET', recordUrl);
      } catch (error) {
        if (!(action.method === 'POST' && error.status === 404)) {throw error;}
      }
      let record;
      if (current && same(current, action.body)) {
        record = current;
      } else if (current && new Date(current.updatedAt).getTime() > new Date(action.body.updatedAt).getTime()) {
        record = current;
        conflicts += 1;
        onConflict(current);
      } else {
        record = await request(action.method === 'POST' && current ? 'PATCH' : action.method,
          action.method === 'POST' && current ? recordUrl : action.url, action.body);
        synced += 1;
      }
      if (record === current && same(current || {}, action.body)) {synced += 1;}
      await hydrateQuery(resource === 'students' ? 'student' : resource);
      await hydrateQuery(`${resource}/${record.id}`);
      await acceptRecord(resource, record);
      await outbox.remove(action.id);
      await onChange();
    }
    return {synced, conflicts};
  })();
  const operation = active;
  operation.finally(() => {active = null;}).catch(() => {});
  return operation;
}
