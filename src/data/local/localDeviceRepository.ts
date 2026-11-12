/**
 * 本地设备仓储：AsyncStorage + JSON 整包存储
 */

import type { Device, DeviceDraft } from '../../domain/device';
import { loadJSON, saveJSON } from '../../core/storage';
import type { DeviceRepository } from '../deviceRepository';

const STORAGE_KEY = 'devices';

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export class LocalDeviceRepository implements DeviceRepository {
  async getAll(): Promise<Device[]> {
    return loadJSON<Device[]>(STORAGE_KEY, []);
  }

  async save(draft: DeviceDraft, id?: string): Promise<Device> {
    const devices = await this.getAll();
    const now = Date.now();
    if (id) {
      const index = devices.findIndex(d => d.id === id);
      if (index < 0) {
        throw new Error(`Device not found: ${id}`);
      }
      const updated: Device = { ...devices[index], ...draft, id, updatedAt: now };
      devices[index] = updated;
      await saveJSON(STORAGE_KEY, devices);
      return updated;
    }
    const created: Device = { ...draft, id: newId(), createdAt: now, updatedAt: now };
    await saveJSON(STORAGE_KEY, [created, ...devices]);
    return created;
  }

  async remove(id: string): Promise<void> {
    const devices = await this.getAll();
    await saveJSON(
      STORAGE_KEY,
      devices.filter(d => d.id !== id),
    );
  }
}
