import {toScale4, calcGpa} from '../src/utils/gpa';
import {validateAssignment} from '../src/utils/validators';
import {applyActions} from '../src/context/optimistic';
import {enqueue, getAll, remove} from '../src/storage/outbox';
import {flushOutbox} from '../src/context/syncEngine';
import {request} from '../src/api/client';
import {acceptRecord} from '../src/context/queryStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../src/api/client', () => ({request: jest.fn()}));
jest.mock('../src/context/queryStore', () => ({acceptRecord: jest.fn(() => Promise.resolve()), hydrateQuery: jest.fn(() => Promise.resolve())}));
jest.mock('@react-native-async-storage/async-storage', () => {
  const memory = new Map();
  return {__esModule: true, default: {
    getItem: jest.fn(key => Promise.resolve(memory.get(key) ?? null)),
    setItem: jest.fn((key, value) => {memory.set(key, value); return Promise.resolve();}),
    removeItem: jest.fn(key => {memory.delete(key); return Promise.resolve();}),
    clear: jest.fn(() => {memory.clear(); return Promise.resolve();}),
  }};
});

const action = (id, url, status, updatedAt) => ({id, method: 'PATCH', url,
  body: {status, updatedAt}, createdAt: updatedAt});
beforeEach(async () => {
  await AsyncStorage.clear();
  request.mockReset(); acceptRecord.mockClear();
});

test('hàng đợi giữ thứ tự khi lưu lại và xóa từng thao tác', async () => {
  await Promise.all([
    enqueue(action('a', '/assignments/1', 'done', '2026-10-26T08:00:00Z')),
    enqueue(action('b', '/assignments/2', 'done', '2026-10-26T08:01:00Z')),
  ]);
  expect((await getAll()).map(item => item.id)).toEqual(['a', 'b']);
  await remove('a');
  expect((await getAll()).map(item => item.id)).toEqual(['b']);
});

test('đồng bộ PATCH lần lượt, cập nhật cache trước khi xóa outbox', async () => {
  await enqueue(action('a', '/assignments/1', 'done', '2026-10-26T08:00:00Z'));
  await enqueue(action('b', '/assignments/2', 'done', '2026-10-26T08:01:00Z'));
  request.mockImplementation(async (method, url, body) => method === 'GET'
    ? {id: url.split('/').at(-1), status: 'todo', updatedAt: '2026-10-20T08:00:00Z'}
    : {id: url.split('/').at(-1), ...body});
  const result = await flushOutbox({isOnline: () => true});
  expect(result.synced).toBe(2);
  expect(request.mock.calls.map(([method, url]) => `${method} ${url}`)).toEqual([
    'GET /assignments/1', 'PATCH /assignments/1', 'GET /assignments/2', 'PATCH /assignments/2',
  ]);
  expect(acceptRecord).toHaveBeenCalledTimes(2);
  expect(await getAll()).toEqual([]);
});

test('xung đột dùng bản ghi server mới hơn và thông báo', async () => {
  await enqueue(action('a', '/assignments/1', 'done', '2026-10-26T08:00:00Z'));
  request.mockResolvedValue({id: '1', status: 'todo', updatedAt: '2026-10-26T09:00:00Z'});
  const onConflict = jest.fn();
  const result = await flushOutbox({isOnline: () => true, onConflict});
  expect(result).toEqual({synced: 0, conflicts: 1});
  expect(request).toHaveBeenCalledTimes(1);
  expect(onConflict).toHaveBeenCalledTimes(1);
  expect(await getAll()).toEqual([]);
});

test('lỗi dừng đồng bộ, giữ thao tác lỗi và các thao tác phía sau', async () => {
  await enqueue(action('a', '/assignments/1', 'done', '2026-10-26T08:00:00Z'));
  await enqueue(action('b', '/assignments/2', 'done', '2026-10-26T08:01:00Z'));
  request.mockRejectedValue({type: 'network', message: 'Mất mạng'});
  await expect(flushOutbox({isOnline: () => true})).rejects.toEqual({type: 'network', message: 'Mất mạng'});
  expect((await getAll()).map(item => item.id)).toEqual(['a', 'b']);
});

test('lớp lạc quan giữ được POST và PATCH offline', () => {
  const rows = [{id: '1', status: 'todo', title: 'Bài cũ'}];
  const actions = [action('a', '/assignments/1', 'done', '2026-10-26T08:00:00Z'),
    {id: 'b', method: 'POST', url: '/assignments', body: {id: 'new', title: 'Bài mới', status: 'todo'}}];
  expect(applyActions('assignments', rows, actions).map(item => [item.id, item.status, item._pending]))
    .toEqual([['1', 'done', true], ['new', 'todo', true]]);
  expect(rows[0].status).toBe('todo');
});

test('GPA theo tín chỉ và loại F khỏi số tín chỉ tích lũy', () => {
  expect([8.5, 8, 7, 6.5, 5.5, 5, 4, 3.9].map(toScale4)).toEqual([4, 3.5, 3, 2.5, 2, 1.5, 1, 0]);
  const result = calcGpa([{courseId: 1, total: 9}, {courseId: 2, total: 3}],
    [{id: 1, credits: 3}, {id: 2, credits: 2}]);
  expect(result.gpa).toBeCloseTo(2.4);
  expect(result.totalCredits).toBe(3);
});

test('form bài tập chặn tiêu đề rỗng và hạn nộp quá khứ', () => {
  expect(validateAssignment({title: ' ', courseId: 'course-1', dueDate: '01/01/2020 10:00'},
    new Date('2026-10-26T00:00:00Z').getTime())).toMatchObject({title: expect.any(String), dueDate: expect.any(String)});
});
