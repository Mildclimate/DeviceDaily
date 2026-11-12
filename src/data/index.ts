/**
 * 数据层出口：当前使用本地仓储，未来接入云端时在此切换
 */

import type { DeviceRepository } from './deviceRepository';
import { LocalDeviceRepository } from './local/localDeviceRepository';

export const deviceRepository: DeviceRepository = new LocalDeviceRepository();
