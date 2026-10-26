import AsyncStorage from '@react-native-async-storage/async-storage';
import {OUTBOX_KEY} from './keys';

let tail = Promise.resolve();
const listeners = new Set();
const clone = value => JSON.parse(JSON.stringify(value));
async function read() {
  const raw = await AsyncStorage.getItem(OUTBOX_KEY);
  if (!raw) {return [];}
  const result = JSON.parse(raw);
  if (!Array.isArray(result)) {throw new Error('Hàng đợi không hợp lệ. Không thể ghi đè dữ liệu.');}
  return result;
}
function change(transform) {
  const operation = tail.then(async () => {
    const next = transform(await read());
    await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(next));
    listeners.forEach(listener => listener());
    return clone(next);
  });
  tail = operation.catch(() => {});
  return operation;
}
export const subscribe = listener => {listeners.add(listener); return () => listeners.delete(listener);};
export async function getAll() {await tail; return read();}
export const enqueue = action => change(items => items.some(item => item.id === action.id) ? items : [...items, clone(action)]);
export const remove = id => change(items => items.filter(item => item.id !== id));
