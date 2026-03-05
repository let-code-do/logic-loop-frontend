export type MemoryArea = "M" | "D" | "B" | "W";

export class DeviceMemory {
  owner: string;
  station: string;
  group: string;
  name: string;
  area: MemoryArea;
  address: number;
  length: number; // Bit 수 또는 Word 수
  data: Uint8Array;
  compressedBits?: boolean; // 1바이트에 8비트 압축 옵션

  constructor(owner: string, station: string, group: string, name: string, area: MemoryArea, address: number, length: number, compressedBits = false) {
    this.owner = owner;
    this.station = station;
    this.group = group;
    this.name = name;
    this.area = area;
    this.address = address;
    this.length = length;
    this.compressedBits = compressedBits;

    if (area === 'B') {
      this.data = new Uint8Array(length <= 1 ? 1 : (compressedBits ? Math.ceil(length / 8) : length));
    } else {
      this.data = new Uint8Array(length * 2);
    }
  }

  readBit(index: number): number {
    if (this.area === 'W') return 0; // Word area doesn't support bit read directly in this simple implementation

    if (this.compressedBits) {
      const byteIndex = Math.floor(index / 8);
      const bitIndex = index % 8;
      const byte = this.data[byteIndex];
      if (byte === undefined) return 0;
      return (byte >> bitIndex) & 1;
    } else {
      const val = this.data[index];
      return val !== undefined ? val : 0;
    }
  }

  writeBit(index: number, value: number) {
    if (this.area === 'W') return;

    if (this.compressedBits) {
      const byteIndex = Math.floor(index / 8);
      const bitIndex = index % 8;
      const byte = this.data[byteIndex];
      if (byte === undefined) return;

      if (value) {
        this.data[byteIndex] = byte | (1 << bitIndex);
      } else {
        this.data[byteIndex] = byte & ~(1 << bitIndex);
      }
    } else {
      this.data[index] = value ? 1 : 0;
    }
  }

  readWord(index: number): number {
    const high = this.data[index * 2];
    const low = this.data[index * 2 + 1];
    if (high === undefined || low === undefined) return 0;
    return (high << 8) | low;
  }

  writeWord(index: number, value: number) {
    this.data[index * 2] = (value >> 8) & 0xFF;
    this.data[index * 2 + 1] = value & 0xFF;
  }
}
