import { useContext } from 'react';
import { AllowanceContext } from '../context/AllowanceContext';

export const useAllowance = () => {
  const context = useContext(AllowanceContext);
  if (context === undefined) {
    throw new Error('useAllowance must be used within an AllowanceProvider');
  }
  return context;
};