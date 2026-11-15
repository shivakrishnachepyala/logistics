import React, { useState } from 'react';
import type {
  CustomerAccount,
  CustomerRegistrationInput,
  CustomerLoginInput,
  CustomerProfileUpdateInput,
} from '../types/customer';
import {
  getCurrentCustomerSession,
  setCurrentCustomerSession,
  clearCustomerSession,
  authenticateCustomer,
  registerCustomer as registerCustomerData,
  updateCustomerProfile,
  findCustomerById,
  INITIAL_CUSTOMERS,
} from '../data/mockCustomers';
import { CustomerAuthContext } from './CustomerAuthTypes';

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pure lazy initializer to avoid cascading renders
  const [customer, setCustomer] = useState<CustomerAccount | null>(() => {
    try {
      return getCurrentCustomerSession();
    } catch {
      return null;
    }
  });
  const [isLoading] = useState(false);

  const login = async (input: CustomerLoginInput) => {
    const res = await authenticateCustomer(input);
    if (res.success && res.customer) {
      setCustomer(res.customer);
      return { success: true };
    }
    return { success: false, error: res.error || 'Login failed.' };
  };

  const loginAsDemo = (demoId: 'CUST-001' | 'CUST-002') => {
    const target = findCustomerById(demoId) || INITIAL_CUSTOMERS.find(c => c.id === demoId);
    if (target) {
      setCurrentCustomerSession(target);
      setCustomer(target);
    }
  };

  const register = async (input: CustomerRegistrationInput) => {
    const res = await registerCustomerData(input);
    if (res.success && res.customer) {
      setCustomer(res.customer);
      return { success: true };
    }
    return { success: false, error: res.error || 'Registration failed.' };
  };

  const logout = () => {
    clearCustomerSession();
    setCustomer(null);
  };

  const updateProfile = (input: CustomerProfileUpdateInput) => {
    if (!customer) return { success: false, error: 'No active session.' };
    const res = updateCustomerProfile(customer.id, input);
    if (res.success && res.customer) {
      setCustomer(res.customer);
      return { success: true };
    }
    return { success: false, error: res.error || 'Update failed.' };
  };

  const refreshCustomer = () => {
    if (customer) {
      const fresh = findCustomerById(customer.id);
      if (fresh) {
        setCustomer(fresh);
      }
    }
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        isLoading,
        login,
        loginAsDemo,
        register,
        logout,
        updateProfile,
        refreshCustomer,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export default CustomerAuthProvider;
