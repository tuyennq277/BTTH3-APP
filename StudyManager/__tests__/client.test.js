import {request} from '../src/api/client';
import {BASE_URL} from '../src/config';

afterEach(() => {delete global.fetch;});

test('GET trả JSON và ghép URL từ cấu hình', async () => {
  global.fetch = jest.fn().mockResolvedValue({ok: true, status: 200, json: async () => [{id: 1}]});
  await expect(request('GET', '/courses')).resolves.toEqual([{id: 1}]);
  expect(global.fetch).toHaveBeenCalledWith(`${BASE_URL}/courses`, expect.objectContaining({method: 'GET'}));
});

test('lỗi HTTP được chuẩn hóa', async () => {
  global.fetch = jest.fn().mockResolvedValue({ok: false, status: 404});
  await expect(request('GET', '/courses/missing')).rejects.toMatchObject({type: 'http', status: 404, message: expect.any(String)});
});

test('mất mạng được chuẩn hóa', async () => {
  global.fetch = jest.fn().mockRejectedValue(new TypeError('Network request failed'));
  await expect(request('POST', '/assignments', {title: 'Bài mới'})).rejects.toMatchObject({type: 'network', status: 0});
});
