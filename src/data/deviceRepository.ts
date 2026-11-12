/**
 * 设备仓储接口：上层只依赖此抽象，本地实现可替换为云端同步实现
 */

import type { Device, DeviceDraft } from '../domain/device';

export interface DeviceRepository {
  getAll(): Promise<Device[]>;
  save(draft: DeviceDraft, id?: string): Promise<Device>;
  remove(id: string): Promise<void>;
}
