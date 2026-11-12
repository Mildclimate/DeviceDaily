/**
 * 设备领域模型
 */

export const DEVICE_TYPES = [
  'phone',
  'computer',
  'tablet',
  'watch',
  'audio',
  'camera',
  'game',
  'car',
  'other',
] as const;

export type DeviceType = (typeof DEVICE_TYPES)[number];

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  /** 购入价格 */
  price: number;
  /** 购入日期 YYYY-MM-DD */
  purchaseDate: string;
  /** 期望日均成本（元/天），未设置为 null */
  targetDailyCost: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface DeviceDraft {
  name: string;
  type: DeviceType;
  price: number;
  purchaseDate: string;
  targetDailyCost: number | null;
}

/** 各设备类型对应的 emoji 图标 */
export const DEVICE_ICONS: Record<DeviceType, string> = {
  phone: '📱',
  computer: '💻',
  tablet: '🖥️',
  watch: '⌚',
  audio: '🎧',
  camera: '📷',
  game: '🎮',
  car: '🚗',
  other: '📦',
};
