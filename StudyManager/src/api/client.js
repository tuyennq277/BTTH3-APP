import {BASE_URL, TIMEOUT} from '../config';

/** @returns {Promise<any>} @throws {{type: string, status: number, message: string}} */
export async function request(method, url, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      signal: controller.signal,
      headers: {'Content-Type': 'application/json'},
      ...(body === undefined ? {} : {body: JSON.stringify(body)}),
    });
    if (!response.ok) {
      throw {type: 'http', status: response.status,
        message: response.status === 404 ? 'Không tìm thấy dữ liệu.' : `Máy chủ trả lỗi ${response.status}. Vui lòng thử lại.`};
    }
    return response.status === 204 ? null : await response.json();
  } catch (error) {
    if (error.type) {throw error;}
    throw {
      type: error.name === 'AbortError' ? 'timeout' : 'network', status: 0,
      message: error.name === 'AbortError'
        ? 'Máy chủ phản hồi quá 10 giây. Hãy thử lại.'
        : 'Không kết nối được máy chủ. Hãy kiểm tra mạng và địa chỉ API.',
    };
  } finally {
    clearTimeout(timer);
  }
}
