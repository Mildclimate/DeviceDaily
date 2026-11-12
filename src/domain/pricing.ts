/**
 * 日均成本算法（纯函数，无副作用）
 *
 * 核心概念：日均成本 = 价格 / 已使用天数，随时间自然递减；
 * 当日均成本降到目标值时视为「回本达标」。
 */

import dayjs from 'dayjs';
import type { Device } from './device';

/** 已使用天数，购入当天记为第 1 天 */
export function daysSince(purchaseDate: string, now: Date = new Date()): number {
  const diff = dayjs(now).startOf('day').diff(dayjs(purchaseDate).startOf('day'), 'day');
  return Math.max(1, diff + 1);
}

/** 当前日均成本 */
export function dailyCost(device: Device, now: Date = new Date()): number {
  return device.price / daysSince(device.purchaseDate, now);
}

/** 价格完全摊薄（日均成本趋近 0）无意义，达标以目标日均价为准 */
function targetDays(device: Device): number | null {
  if (!device.targetDailyCost || device.targetDailyCost <= 0) {
    return null;
  }
  return Math.ceil(device.price / device.targetDailyCost);
}

/** 预计达标日期，未设置目标则返回 null */
export function targetDate(device: Device): Date | null {
  const days = targetDays(device);
  if (days === null) {
    return null;
  }
  return dayjs(device.purchaseDate)
    .add(days - 1, 'day')
    .toDate();
}

/** 距离达标还剩多少天，负数表示已达标 */
export function daysToTarget(device: Device, now: Date = new Date()): number | null {
  const days = targetDays(device);
  if (days === null) {
    return null;
  }
  return days - daysSince(device.purchaseDate, now);
}

/** 摊薄进度 0~1：已使用天数 / 达标所需天数，未设置目标返回 null */
export function amortizeProgress(device: Device, now: Date = new Date()): number | null {
  const days = targetDays(device);
  if (days === null) {
    return null;
  }
  return Math.min(1, daysSince(device.purchaseDate, now) / days);
}

export interface DeviceSummary {
  count: number;
  /** 总投入 */
  totalPrice: number;
  /** 当前合计日均价（各设备当日日均之和） */
  totalDailyCost: number;
  /** 已达标设备数 */
  achievedCount: number;
}

export function summarize(devices: Device[], now: Date = new Date()): DeviceSummary {
  return devices.reduce<DeviceSummary>(
    (acc, d) => {
      acc.totalPrice += d.price;
      acc.totalDailyCost += dailyCost(d, now);
      const rest = daysToTarget(d, now);
      if (rest !== null && rest <= 0) {
        acc.achievedCount += 1;
      }
      return acc;
    },
    { count: devices.length, totalPrice: 0, totalDailyCost: 0, achievedCount: 0 },
  );
}
