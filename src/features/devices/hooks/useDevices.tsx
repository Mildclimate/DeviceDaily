/**
 * 设备数据共享层：Context 提供，保证列表页与编辑页操作同一份数据
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { Device, DeviceDraft } from '../../../domain/device';
import { deviceRepository } from '../../../data';

interface DevicesContextValue {
  devices: Device[];
  loading: boolean;
  addDevice: (draft: DeviceDraft) => Promise<void>;
  updateDevice: (id: string, draft: DeviceDraft) => Promise<void>;
  removeDevice: (id: string) => Promise<void>;
}

const DevicesContext = createContext<DevicesContextValue | null>(null);

export const DevicesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setDevices(await deviceRepository.getAll());
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addDevice = useCallback(
    async (draft: DeviceDraft) => {
      await deviceRepository.save(draft);
      await reload();
    },
    [reload],
  );

  const updateDevice = useCallback(
    async (id: string, draft: DeviceDraft) => {
      await deviceRepository.save(draft, id);
      await reload();
    },
    [reload],
  );

  const removeDevice = useCallback(
    async (id: string) => {
      await deviceRepository.remove(id);
      await reload();
    },
    [reload],
  );

  return (
    <DevicesContext.Provider
      value={{ devices, loading, addDevice, updateDevice, removeDevice }}
    >
      {children}
    </DevicesContext.Provider>
  );
};

export function useDevices(): DevicesContextValue {
  const ctx = useContext(DevicesContext);
  if (!ctx) {
    throw new Error('useDevices must be used within DevicesProvider');
  }
  return ctx;
}
