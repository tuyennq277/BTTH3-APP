import AsyncStorage from '@react-native-async-storage/async-storage';
import {cacheKey} from './keys';

export async function getCache(key) {
  const value = await AsyncStorage.getItem(cacheKey(key));
  if (!value) {return null;}
  try {
    const parsed = JSON.parse(value);
    return parsed && 'data' in parsed && parsed.savedAt ? parsed : null;
  } catch {return null;}
}
export async function setCache(key, data, savedAt = new Date().toISOString()) {
  await AsyncStorage.setItem(cacheKey(key), JSON.stringify({data, savedAt}));
  return savedAt;
}
