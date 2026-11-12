/**
 * AsyncStorage 薄封装：带版本号的 JSON 读写
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const VERSION_PREFIX = 'v1:';

export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(VERSION_PREFIX + key);
    if (raw === null) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function saveJSON(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(VERSION_PREFIX + key, JSON.stringify(value));
}
