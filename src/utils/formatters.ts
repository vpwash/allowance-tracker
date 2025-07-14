import { format, parseISO, isThisWeek, isToday, isThisMonth } from 'date-fns';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string, formatStr = 'MMM d, yyyy'): string => {
  return format(parseISO(dateString), formatStr);
};

export const isRecent = (dateString: string): boolean => {
  const date = parseISO(dateString);
  return isThisWeek(date) || isToday(date) || isThisMonth(date);
};

export const calculateTotalDeductions = (deductions: { amount: number }[]): number => {
  return deductions.reduce((total, deduction) => total + deduction.amount, 0);
};

export const validateAmount = (value: string): string => {
  if (!value) return 'Amount is required';
  const amount = parseFloat(value);
  if (isNaN(amount)) return 'Please enter a valid number';
  if (amount <= 0) return 'Amount must be greater than 0';
  return '';
};

export const validateName = (value: string): string => {
  if (!value.trim()) return 'Name is required';
  if (value.length < 2) return 'Name must be at least 2 characters long';
  return '';
};
