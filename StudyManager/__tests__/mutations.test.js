import {makeAction, mutate} from '../src/context/mutations';
import {getAll} from '../src/storage/outbox';
import {request} from '../src/api/client';
import {getIsOnline} from '../src/hooks/networkStore';
import {acceptRecord} from '../src/context/queryStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../src/api/client', () => ({request: jest.fn()}));
jest.mock('../src/hooks/networkStore', () => ({getIsOnline: jest.fn()}));
jest.mock('../src/context/queryStore', () => ({acceptRecord: jest.fn(() => Promise.resolve())}));
jest.mock('@react-native-async-storage/async-storage', () => {
  const memory = new Map();
  return {__esModule: true, default: {
    getItem: jest.fn(key => Promise.resolve(memory.get(key) ?? null)),
    setItem: jest.fn((key, value) => {memory.set(key, value); return Promise.resolve();}),
    clear: jest.fn(() => {memory.clear(); return Promise.resolve();}),
  }};
});
beforeEach(async () => {await AsyncStorage.clear(); request.mockReset(); acceptRecord.mockClear();});

test('offline PATCH được lưu vào hàng đợi mà không gọi mạng', async () => {
  getIsOnline.mockReturnValue(false);
  const operation = makeAction('PATCH', '/assignments/1', {status: 'done'});
  expect(await mutate(operation)).toEqual({queued: true});
  expect(request).not.toHaveBeenCalled();
  expect((await getAll())[0]).toMatchObject({method: 'PATCH', url: '/assignments/1', body: {status: 'done'}});
});

test('HTTP lỗi trực tuyến hoàn tác vì không thêm vào hàng đợi', async () => {
  getIsOnline.mockReturnValue(true);
  request.mockRejectedValue({type: 'http', status: 500, message: 'Lỗi máy chủ'});
  await expect(mutate(makeAction('PATCH', '/assignments/1', {status: 'done'})))
    .rejects.toMatchObject({type: 'http', status: 500});
  expect(await getAll()).toEqual([]);
});

test('mất mạng giữa thao tác trực tuyến vẫn giữ dữ liệu để gửi lại', async () => {
  getIsOnline.mockReturnValue(true);
  request.mockRejectedValue({type: 'network', message: 'Mất mạng'});
  expect(await mutate(makeAction('POST', '/assignments', {id: 'new', title: 'Bài mới'})))
    .toEqual({queued: true});
  expect((await getAll())[0].body.id).toBe('new');
});

test('trực tuyến thành công cập nhật cache và không tạo outbox', async () => {
  getIsOnline.mockReturnValue(true);
  request.mockResolvedValue({id: '1', status: 'done'});
  expect(await mutate(makeAction('PATCH', '/assignments/1', {status: 'done'})))
    .toMatchObject({queued: false});
  expect(acceptRecord).toHaveBeenCalledWith('assignments', {id: '1', status: 'done'});
  expect(await getAll()).toEqual([]);
});
