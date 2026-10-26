import {Platform} from 'react-native';

// Điện thoại thật: đặt EXPO_PUBLIC_API_URL trong .env.local rồi khởi động lại Expo.
export const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000')).replace(/\/$/, '');
export const TIMEOUT = 10000;
// Cache quá TTL vẫn dùng được khi offline; GET luôn làm mới khi mở màn hình.
export const CACHE_TTL = 5 * 60 * 1000;
export const CURRENT_SEMESTER = 'HK1 2026-2027';
export const SYNC_RETRY_MS = 15000;
