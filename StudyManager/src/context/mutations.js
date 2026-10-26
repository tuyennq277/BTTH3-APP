import {request} from '../api/client';
import * as outbox from '../storage/outbox';
import {acceptRecord} from './queryStore';
import {getIsOnline} from '../hooks/networkStore';

let tail = Promise.resolve();
let sequence = 0;
export const uniqueId = prefix => `${prefix}-${Date.now()}-${++sequence}-${Math.random().toString(36).slice(2, 9)}`;
export function makeAction(method, url, body) {
  const createdAt = new Date().toISOString();
  return {id: uniqueId('action'), method, url, body: {...body, updatedAt: createdAt}, createdAt};
}
export function mutate(action) {
  const operation = tail.then(async () => {
    if (!getIsOnline() || (await outbox.getAll()).length) {
      await outbox.enqueue(action);
      return {queued: true};
    }
    let record;
    try {record = await request(action.method, action.url, action.body);}
    catch (error) {
      if (error.type === 'http') {throw error;}
      // A timeout may occur after the server accepted the request. Reuse the POST id on retry.
      await outbox.enqueue(action);
      return {queued: true};
    }
    try {await acceptRecord(action.url.split('/')[1], record);}
    catch {
      // Server accepted it; retaining the action lets the sync engine recover the cache later.
      await outbox.enqueue(action);
      return {queued: true};
    }
    return {queued: false, record};
  });
  tail = operation.catch(() => {});
  return operation;
}
