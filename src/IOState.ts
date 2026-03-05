import { DeviceMemory } from './DeviceMemory.js';
import { ExternalIO } from './ExternalIO.js';

export class IOState {
  inputs: Record<string, DeviceMemory> = {};
  outputs: Record<string, DeviceMemory> = {};
  internal: Record<string, DeviceMemory> = {};

  private lastStates: Record<string, Uint8Array> = {};

  updateInputLatch(inputLatch: Record<string, DeviceMemory>) {
    for (const key in inputLatch) {
      const device = inputLatch[key];
      if (device) {
        this.inputs[key] = device;
      }
    }
  }

  updateOutputLatch(externalIO: ExternalIO) {
    for (const key in this.outputs) {
      const device = this.outputs[key];
      if (device) {
        externalIO.outputLatch[key] = device;
      }
    }
  }

  /**
   * Identifies changed memory values since the last scan.
   */
  getChanges(): Record<string, Uint8Array> {
    const changes: Record<string, Uint8Array> = {};

    const allDevices = { ...this.inputs, ...this.outputs, ...this.internal };

    for (const [key, device] of Object.entries(allDevices)) {
      const currentData = device.data;
      const lastData = this.lastStates[key];

      if (!lastData || !this.compareUint8Arrays(currentData, lastData)) {
        changes[key] = new Uint8Array(currentData);
        this.lastStates[key] = new Uint8Array(currentData);
      }
    }

    return changes;
  }

  private compareUint8Arrays(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
}
