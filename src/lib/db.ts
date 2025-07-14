import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { ChildProfile, Transaction } from '../types';

export class MySubClassedDexie extends Dexie {
  children!: Table<ChildProfile>;
  transactions!: Table<Transaction>;

  constructor() {
    super('allowanceTracker');
    this.version(2).stores({
      children: '++id, name',
      transactions: '++id, childId, date',
    });
  }
}

export const db = new MySubClassedDexie();
