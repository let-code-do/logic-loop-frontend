import { IOState } from '../src/IOState.js';
import * as RungModule from '../src/Rung.js';

const { Rung } = RungModule;

class MockContact {
  state: boolean;
  constructor(state: boolean) { this.state = state; }
  read(ioState: IOState): boolean { return this.state; }
}

class MockCoil {
  lastValue: boolean = false;
  write(value: boolean, ioState: IOState): void { this.lastValue = value; }
}

describe('Rung logic evaluation', () => {
  it('should evaluate TRUE when all contacts are TRUE', () => {
    const contacts = [new MockContact(true), new MockContact(true)];
    const coil = new MockCoil();
    const rung = new Rung(contacts as any, coil as any);
    const ioState = new IOState();

    rung.evaluate(ioState);
    expect(coil.lastValue).toBe(true);
  });

  it('should evaluate FALSE when any contact is FALSE', () => {
    const contacts = [new MockContact(true), new MockContact(false)];
    const coil = new MockCoil();
    const rung = new Rung(contacts as any, coil as any);
    const ioState = new IOState();

    rung.evaluate(ioState);
    expect(coil.lastValue).toBe(false);
  });

  it('should evaluate TRUE for empty contacts (default behavior of reduce with true)', () => {
    const contacts: any[] = [];
    const coil = new MockCoil();
    const rung = new Rung(contacts, coil as any);
    const ioState = new IOState();

    rung.evaluate(ioState);
    expect(coil.lastValue).toBe(true);
  });
});
