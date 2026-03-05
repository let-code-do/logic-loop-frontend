import { IOState } from './IOState.js';

export interface Contact {
  read(ioState: IOState): boolean;
}

export interface Coil {
  write(value: boolean, ioState: IOState): void;
}

export class Rung {
  contacts: Contact[];
  coil: Coil;

  constructor(contacts: Contact[], coil: Coil) {
    this.contacts = contacts;
    this.coil = coil;
  }

  evaluate(ioState: IOState) {
    const result = this.contacts.reduce((acc, contact) => acc && contact.read(ioState), true);
    this.coil.write(result, ioState);
  }
}
