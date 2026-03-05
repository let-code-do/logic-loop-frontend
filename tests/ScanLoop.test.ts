import { ScanLoopManager } from '../src/ScanLoopManager.js';
import { IOState } from '../src/IOState.js';
import { ExternalIO } from '../src/ExternalIO.js';
import * as RungModule from '../src/Rung.js';
import { DeviceMemory } from '../src/DeviceMemory.js';

const { Rung } = RungModule;

class MemoryContact {
  name: string;
  constructor(name: string) { this.name = name; }
  read(ioState: IOState): boolean {
    const dev = ioState.inputs[this.name];
    return dev ? dev.readBit(0) === 1 : false;
  }
}

class MemoryCoil {
  name: string;
  constructor(name: string) { this.name = name; }
  write(value: boolean, ioState: IOState): void {
    const dev = ioState.outputs[this.name];
    if (dev) {
      dev.writeBit(0, value ? 1 : 0);
    }
  }
}

describe('ScanLoop Integration', () => {
  it('should process a full scan cycle correctly', () => {
    const manager = new ScanLoopManager();
    const ioState = new IOState();
    const externalIO = new ExternalIO();

    // Setup memory
    const inputMem = new DeviceMemory('O', 'S', 'G', 'IN1', 'B', 0, 1);
    const outputMem = new DeviceMemory('O', 'S', 'G', 'OUT1', 'B', 0, 1);

    ioState.inputs['IN1'] = inputMem;
    ioState.outputs['OUT1'] = outputMem;

    // Set external input via queue
    const externalInputMem = new DeviceMemory('O', 'S', 'G', 'IN1', 'B', 0, 1);
    externalInputMem.writeBit(0, 1);
    externalIO.write({ 'IN1': externalInputMem });

    // Setup Rung: IF IN1 THEN OUT1
    const rung = new Rung([new MemoryContact('IN1')] as any, new MemoryCoil('OUT1') as any);

    // Run Scan
    manager.runRungs([rung], ioState, externalIO);

    // Verify results
    expect(ioState.inputs['IN1']?.readBit(0)).toBe(1);
    expect(ioState.outputs['OUT1']?.readBit(0)).toBe(1);
    expect(externalIO.outputLatch['OUT1']?.readBit(0)).toBe(1);
  });
});
