/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import type { UserRole, BranchId } from '../types';

export type { UserRole, BranchId };

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Fleet Admin',
  dispatcher: 'Hub Dispatcher',
  driver: 'Field Driver',
  customer: 'Customer / Consignee',
};

interface EnterpriseContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  branch: BranchId;
  setBranch: (branch: BranchId) => void;
  branchLabel: string;
}

const EnterpriseContext = createContext<EnterpriseContextType>({
  role: 'admin',
  setRole: () => {},
  branch: 'all',
  setBranch: () => {},
  branchLabel: 'All Hubs & Branches',
});

const ROLE_STORAGE_KEY = 'freightline_active_role';
const BRANCH_STORAGE_KEY = 'freightline_active_branch';

export const BRANCH_NAMES: Record<BranchId, { name: string; city: string }> = {
  all: { name: 'All Branches & Hubs', city: 'National Network' },
  'DEL-CENTRAL': { name: 'Delhi Central Sorting Hub', city: 'Delhi / Okhla' },
  'MH-MUMBAI': { name: 'Mumbai Central Godown', city: 'Mumbai / Bhiwandi' },
  'JPR-MAIN': { name: 'Jaipur Delivery Centre', city: 'Jaipur / MI Road' },
  'GJ-SURAT': { name: 'Surat Textile Cargo Hub', city: 'Surat / Ring Road' },
  'KA-BLR': { name: 'Bengaluru Tech & Cargo Park', city: 'Bengaluru / Electronic City' },
  'WB-KOL': { name: 'Kolkata Eastern Gateway', city: 'Kolkata / Dankuni' },
  'HYD': { name: 'Hyderabad Regional Hub', city: 'Hyderabad / Shamshabad' },
  'MAA': { name: 'Chennai Coromandel Coastal Gateway', city: 'Chennai / Madhavaram' },
  'AMD': { name: 'Ahmedabad Sabarmati Intermodal Terminal', city: 'Ahmedabad / Aslali' },
  // Compatibility aliases
  'TN-CHENNAI': { name: 'Chennai Coromandel Coastal Gateway', city: 'Chennai / Madhavaram' },
  'TG-HYDERABAD': { name: 'Hyderabad Regional Hub', city: 'Hyderabad / Shamshabad' },
  'GJ-AHMEDABAD': { name: 'Ahmedabad Sabarmati Intermodal Terminal', city: 'Ahmedabad / Aslali' },
  'WB-KOLKATA': { name: 'Kolkata Eastern Gateway', city: 'Kolkata / Dankuni' },
};

export const EnterpriseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole;
      if (saved && ['admin', 'dispatcher', 'driver', 'customer'].includes(saved)) {
        return saved;
      }
    }
    return 'admin';
  });

  const [branch, setBranchState] = useState<BranchId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(BRANCH_STORAGE_KEY) as BranchId;
      if (saved && Object.keys(BRANCH_NAMES).includes(saved)) {
        return saved;
      }
    }
    return 'all';
  });

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ROLE_STORAGE_KEY, newRole);
      window.dispatchEvent(new Event('freightline_role_update'));
    }
  };

  const setBranch = (newBranch: BranchId) => {
    setBranchState(newBranch);
    if (typeof window !== 'undefined') {
      localStorage.setItem(BRANCH_STORAGE_KEY, newBranch);
      window.dispatchEvent(new Event('freightline_branch_update'));
    }
  };

  const branchLabel = BRANCH_NAMES[branch]?.name || 'All Branches';

  return (
    <EnterpriseContext.Provider value={{ role, setRole, branch, setBranch, branchLabel }}>
      {children}
    </EnterpriseContext.Provider>
  );
};

export const useEnterprise = () => useContext(EnterpriseContext);
