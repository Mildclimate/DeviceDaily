/**
 * 日均成本算法单元测试
 */

import dayjs from 'dayjs';
import type { Device } from '../device';
import {
  amortizeProgress,
  dailyCost,
  daysSince,
  daysToTarget,
  summarize,
  targetDate,
} from '../pricing';

const base: Device = {
  id: 'd1',
  name: 'iPhone',
  type: 'phone',
  price: 7300,
  purchaseDate: '2026-01-01',
  targetDailyCost: 10,
  createdAt: 0,
  updatedAt: 0,
};

describe('daysSince', () => {
  it('购入当天记为第 1 天', () => {
    expect(daysSince('2026-01-01', new Date('2026-01-01'))).toBe(1);
  });

  it('跨天累计', () => {
    expect(daysSince('2026-01-01', new Date('2026-01-31'))).toBe(31);
  });

  it('非法/未来日期兜底为 1', () => {
    expect(daysSince('2026-02-01', new Date('2026-01-01'))).toBe(1);
  });
});

describe('dailyCost', () => {
  it('随天数递减', () => {
    const day10 = dailyCost(base, new Date('2026-01-10'));
    const day20 = dailyCost(base, new Date('2026-01-20'));
    expect(day10).toBeCloseTo(7300 / 10);
    expect(day20).toBeCloseTo(7300 / 20);
    expect(day20).toBeLessThan(day10);
  });
});

describe('目标达标', () => {
  it('达标所需天数为价格除以目标日均价向上取整', () => {
    // 7300 / 10 = 730 天，购入日为第 1 天，故 +729 天
    expect(dayjs(targetDate(base)).format('YYYY-MM-DD')).toBe('2027-12-31');
  });

  it('距达标天数随时间减少，达标后为非正数', () => {
    expect(daysToTarget(base, new Date('2026-01-01'))).toBe(729);
    const before = daysToTarget(base, new Date('2027-12-30'));
    const after = daysToTarget(base, new Date('2027-12-31'));
    expect(before).toBe(1);
    expect(after).toBe(0);
  });

  it('未设置目标时返回 null', () => {
    const noTarget = { ...base, targetDailyCost: null };
    expect(targetDate(noTarget)).toBeNull();
    expect(daysToTarget(noTarget)).toBeNull();
    expect(amortizeProgress(noTarget)).toBeNull();
  });

  it('进度 0~1 封顶', () => {
    expect(amortizeProgress(base, new Date('2026-01-01'))).toBeCloseTo(1 / 730);
    expect(amortizeProgress(base, new Date('2030-01-01'))).toBe(1);
  });
});

describe('summarize', () => {
  it('汇总投入、日均与达标数', () => {
    const now = new Date('2026-01-11');
    // 1 月 11 日为购入后第 11 天
    const car: Device = {
      ...base,
      id: 'd2',
      price: 100,
      purchaseDate: '2026-01-01',
      targetDailyCost: 20, // 100/20=5 天，已达标
    };
    const s = summarize([base, car], now);
    expect(s.count).toBe(2);
    expect(s.totalPrice).toBe(7400);
    expect(s.totalDailyCost).toBeCloseTo(7300 / 11 + 100 / 11);
    expect(s.achievedCount).toBe(1);
  });
});
