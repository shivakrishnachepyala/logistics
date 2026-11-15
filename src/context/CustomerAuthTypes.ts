import { createContext } from 'react';
import type {
  CustomerAccount,
  CustomerRegistrationInput,
  CustomerLoginInput,
  CustomerProfileUpdateInput,
} from '../types/customer';

export interface CustomerAuthContextType {
  customer: CustomerAccount | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: CustomerLoginInput) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (demoId: 'CUST-001' | 'CUST-002') => void;
  register: (input: CustomerRegistrationInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (input: CustomerProfileUpdateInput) => { success: boolean; error?: string };
  refreshCustomer: () => void;
}

export const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);
