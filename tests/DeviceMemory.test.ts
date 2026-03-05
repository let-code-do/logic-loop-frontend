import { DeviceMemory } from '../src/DeviceMemory.js';

describe('DeviceMemory', () => {
  it('should initialize correctly for area B', () => {
    const mem = new DeviceMemory('owner', 'station', 'group', 'name', 'B', 0, 10);
    expect(mem.data.length).toBe(10);
  });

  it('should initialize correctly for area W', () => {
    const mem = new DeviceMemory('owner', 'station', 'group', 'name', 'W', 0, 10);
    expect(mem.data.length).toBe(20);
  });

  it('should read and write bits (uncompressed)', () => {
    const mem = new DeviceMemory('owner', 'station', 'group', 'name', 'B', 0, 10);
    mem.writeBit(0, 1);
    expect(mem.readBit(0)).toBe(1);
    mem.writeBit(0, 0);
    expect(mem.readBit(0)).toBe(0);
  });

  it('should read and write bits (compressed)', () => {
    const mem = new DeviceMemory('owner', 'station', 'group', 'name', 'B', 0, 16, true);
    expect(mem.data.length).toBe(2);

    mem.writeBit(0, 1);
    mem.writeBit(8, 1);
    expect(mem.readBit(0)).toBe(1);
    expect(mem.readBit(8)).toBe(1);
    expect(mem.readBit(1)).toBe(0);

    expect(mem.data[0]).toBe(1); // First bit of first byte
    expect(mem.data[1]).toBe(1); // First bit of second byte
  });

  it('should read and write words', () => {
    const mem = new DeviceMemory('owner', 'station', 'group', 'name', 'W', 0, 10);
    mem.writeWord(0, 0x1234);
    expect(mem.readWord(0)).toBe(0x1234);
  });
});
