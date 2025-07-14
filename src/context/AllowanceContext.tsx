import { createContext, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import type { ChildProfile, AddChildFormData, UpdateChildFormData, Transaction } from '../types';

// Temporary type for migration to avoid linting errors with 'any'
interface ChildWithDeductions extends ChildProfile {
  deductions?: { amount: number; reason: string; date: string; id: string }[];
}

interface AllowanceContextType {
  children: ChildProfile[];
  transactions: Transaction[];
  addChild: (childData: AddChildFormData) => Promise<void>;
  updateChild: (id: string, updates: UpdateChildFormData) => Promise<void>;
  removeChild: (id: string) => Promise<void>;
  addDeduction: (childId: string, amount: number, reason: string) => Promise<void>;
  getChild: (id: string) => ChildProfile | undefined;
  updateAllowance: (childId: string, newAllowance: number) => Promise<void>;
  processWeeklyAllowance: () => Promise<void>;
  payChild: (childId: string) => Promise<void>;
}

export const AllowanceContext = createContext<AllowanceContextType | undefined>(undefined);

export const AllowanceProvider: React.FC<{ children: ReactNode }> = ({ children: providerChildren }) => {
  const allChildren = useLiveQuery(() => db.children.toArray(), []);
  const allTransactions = useLiveQuery(() => db.transactions.orderBy('date').reverse().toArray(), []);

  const childrenData = allChildren || [];
  const transactionsData = allTransactions || [];

  const migrateDeductions = useCallback(async () => {
    const childrenToMigrate = await db.table('children').filter(child => {
      const c = child as ChildWithDeductions;
      return Array.isArray(c.deductions) && c.deductions.length > 0;
    }).toArray() as ChildWithDeductions[];

    if (childrenToMigrate.length > 0) {
      const newTransactions: Transaction[] = [];
      for (const child of childrenToMigrate) {
        if (child.deductions) {
          for (const deduction of child.deductions) {
            newTransactions.push({
              id: uuidv4(),
              childId: child.id!,
              type: 'deduction',
              amount: deduction.amount,
              description: deduction.reason,
              date: deduction.date,
            });
          }
        }
      }

      await db.transaction('rw', db.transactions, db.children, async () => {
        if (newTransactions.length > 0) {
          await db.transactions.bulkAdd(newTransactions);
        }
        for (const child of childrenToMigrate) {
          // Use `modify` to remove the `deductions` property from the object.
          await db.children.where({ id: child.id! }).modify(c => {
            delete (c as Partial<ChildWithDeductions>).deductions;
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    migrateDeductions();
  }, [migrateDeductions]);

  const addChild = async (childData: AddChildFormData) => {
    const now = new Date().toISOString();
    const newChild: ChildProfile = {
      id: uuidv4(),
      name: childData.name,
      balance: childData.initialBalance || 0,
      weeklyAllowance: childData.weeklyAllowance,
      lastAllowanceDate: now,
      createdAt: now,
      updatedAt: now,
    };
    await db.children.add(newChild);
  };

  const updateChild = async (id: string, updates: UpdateChildFormData) => {
    await db.children.update(id, { ...updates, updatedAt: new Date().toISOString() });
  };

  const removeChild = async (id: string) => {
    await db.children.delete(id);
    await db.transactions.where('childId').equals(id).delete();
  };

  const addDeduction = async (childId: string, amount: number, reason: string) => {
    const child = await db.children.get(childId);
    if (!child) return;

    const now = new Date().toISOString();
    const newTransaction: Transaction = {
      id: uuidv4(),
      childId,
      type: 'deduction',
      amount,
      description: reason,
      date: now,
    };

    await db.transaction('rw', db.children, db.transactions, async () => {
      await db.children.update(childId, {
        balance: child.balance - amount,
        updatedAt: now,
      });
      await db.transactions.add(newTransaction);
    });
  };

  const updateAllowance = async (childId: string, newAllowance: number) => {
    await updateChild(childId, { weeklyAllowance: newAllowance });
  };

  const processWeeklyAllowance = async () => {
    const now = new Date();
    const today = now.getDay();
    const isSunday = today === 0;

    if (!isSunday) return;

    const todayAtNoon = new Date(now);
    todayAtNoon.setHours(12, 0, 0, 0);

    const lastSunday = new Date(todayAtNoon);
    lastSunday.setDate(todayAtNoon.getDate() - todayAtNoon.getDay());

    const childrenToUpdate = await db.children
      .filter(child => new Date(child.lastAllowanceDate) < lastSunday)
      .toArray();

    for (const child of childrenToUpdate) {
      const newTransaction: Transaction = {
        id: uuidv4(),
        childId: child.id!,
        type: 'allowance',
        amount: child.weeklyAllowance,
        description: 'Weekly allowance',
        date: now.toISOString(),
      };

      await db.transaction('rw', db.children, db.transactions, async () => {
        await db.children.update(child.id!, {
          balance: child.balance + child.weeklyAllowance,
          lastAllowanceDate: lastSunday.toISOString(),
          updatedAt: now.toISOString(),
        });
        await db.transactions.add(newTransaction);
      });
    }
  };

  const payChild = async (childId: string) => {
    const child = await db.children.get(childId);
    if (!child || child.balance === 0) return;

    const now = new Date().toISOString();
    const newTransaction: Transaction = {
      id: uuidv4(),
      childId,
      type: 'payout',
      amount: child.balance,
      description: 'Balance paid out',
      date: now,
    };

    await db.transaction('rw', db.children, db.transactions, async () => {
      await db.children.update(childId, { 
        balance: 0, 
        updatedAt: now 
      });
      await db.transactions.add(newTransaction);
    });
  };

  const getChild = (id: string) => {
    return childrenData.find(child => child.id === id);
  };

  useEffect(() => {
    processWeeklyAllowance();
  }, []);

  return (
    <AllowanceContext.Provider
      value={{
        children: childrenData,
        transactions: transactionsData,
        addChild,
        updateChild,
        removeChild,
        addDeduction,
        getChild,
        updateAllowance,
        processWeeklyAllowance,
        payChild,
      }}
    >
      {providerChildren}
    </AllowanceContext.Provider>
  );
};


