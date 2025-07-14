export interface ChildProfile {
  id?: string;
  name: string;
  balance: number;
  weeklyAllowance: number;
  lastAllowanceDate: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Transaction {
  id?: string;
  childId: string;
  type: 'allowance' | 'deduction' | 'payout';
  amount: number;
  description: string;
  date: string; // ISO date string
}

export type AddChildFormData = Omit<ChildProfile, 'id' | 'balance' | 'createdAt' | 'updatedAt' | 'lastAllowanceDate'> & {
  initialBalance?: number;
};

export type UpdateChildFormData = Partial<Omit<ChildProfile, 'id' | 'createdAt' | 'updatedAt'>> & {
  balance?: number;
};
