import { IOState } from './IOState.js';

export class Logger {
  logs: any[] = [];
  record(ioState: IOState, event?: string) {
    this.logs.push({ timestamp: Date.now(), state: JSON.parse(JSON.stringify(ioState)), event });
  }
}
