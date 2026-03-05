import { DeviceMemory } from './DeviceMemory.js';

export interface WriteRequest {
  address: string;
  device: DeviceMemory;
  timestamp: number;
}

export class ExternalIO {
  inputLatch: Record<string, DeviceMemory> = {};
  outputLatch: Record<string, DeviceMemory> = {};
  queue: WriteRequest[] = [];
  timeoutMs: number = 1000;

  read(devices: string[]): { transactionId: string, returnCode: number, values?: Record<string, DeviceMemory>, errors?: string[] } {
    return { transactionId: 'trans_' + Date.now(), returnCode: 0, values: {} };
  }

  write(devices: Record<string, DeviceMemory>): { transactionId: string, returnCode: number, errors?: string[] } {
    const timestamp = Date.now();
    for (const key in devices) {
        const device = devices[key];
        if (device) {
            this.queue.push({ address: key, device, timestamp });
        }
    }
    return { transactionId: 'trans_' + timestamp, returnCode: 0 };
  }

  /**
   * Retrieves the next batch of requests from the queue.
   * Implements Last-Write-Wins for the same address within the batch.
   */
  getQueue(limit: number): Record<string, DeviceMemory> {
    const batch = this.queue.splice(0, limit);
    const result: Record<string, DeviceMemory> = {};

    // Last-Write-Wins logic
    for (const req of batch) {
      result[req.address] = req.device;
    }

    return result;
  }
}
