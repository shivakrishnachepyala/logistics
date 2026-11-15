import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppIcon } from '../common/AppIcon';

const ROUTE_LABELS: Record<string, { group: string; label: string }> = {
  // Manager Routes
  '/manager/dashboard': { group: 'Operations', label: 'Executive Dashboard' },
  '/manager/shipments': { group: 'Operations', label: 'Shipment Management' },
  '/manager/create': { group: 'Operations', label: 'Book New Consignment' },
  '/manager/transport-assignment': { group: 'Operations', label: 'Transportation Assignment' },
  '/manager/tracking': { group: 'Operations', label: 'Live Tracking Workspace' },
  '/manager/fleet': { group: 'Assets', label: 'Fleet Management' },
  '/manager/warehouses': { group: 'Assets', label: 'Warehouse Management' },
  '/manager/inventory': { group: 'Assets', label: 'Inventory Management' },
  '/manager/customers': { group: 'Commercial', label: 'Customers & Staff' },
  '/manager/billing': { group: 'Commercial', label: 'Payments & Billing' },
  '/manager/analytics': { group: 'System', label: 'Reports & Analytics' },
  '/manager/branches': { group: 'System', label: 'Branch Management' },
  '/manager/settings': { group: 'System', label: 'Settings' },

  // Backward-compatible fallback routes
  '/dashboard': { group: 'Operations', label: 'Executive Dashboard' },
  '/shipments': { group: 'Operations', label: 'Shipment Management' },
  '/create': { group: 'Operations', label: 'Book New Consignment' },
  '/transport-assignment': { group: 'Operations', label: 'Transportation Assignment' },
  '/tracking': { group: 'Operations', label: 'Live Tracking Workspace' },
  '/fleet': { group: 'Assets', label: 'Fleet Management' },
  '/warehouses': { group: 'Assets', label: 'Warehouse Management' },
  '/inventory': { group: 'Assets', label: 'Inventory Management' },
  '/customers': { group: 'Commercial', label: 'Customers & Staff' },
  '/billing': { group: 'Commercial', label: 'Payments & Billing' },
  '/analytics': { group: 'System', label: 'Reports & Analytics' },
  '/branches': { group: 'System', label: 'Branch Management' },
  '/settings': { group: 'System', label: 'Settings' },
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Handle dynamic routes like /manager/shipment/:id or /shipment/:id
  let current = ROUTE_LABELS[pathname];
  let customId: string | null = null;

  if (!current && pathname.startsWith('/manager/shipment/')) {
    customId = pathname.replace('/manager/shipment/', '');
    current = { group: 'Operations', label: `Consignment ${customId}` };
  } else if (!current && pathname.startsWith('/shipment/')) {
    customId = pathname.replace('/shipment/', '');
    current = { group: 'Operations', label: `Consignment ${customId}` };
  }

  if (!current) {
    current = { group: 'Operations', label: 'Workspace' };
  }

  return (
    <nav className="flex items-center text-xs font-medium text-slate-500 mb-2 gap-1.5" aria-label="Breadcrumb">
      <Link
        to="/manager/dashboard"
        className="hover:text-slate-900 transition-colors flex items-center gap-1 text-slate-500"
      >
        <AppIcon name="dashboard" size={14} className="text-slate-400" />
        <span>Operations</span>
      </Link>

      <span className="text-slate-300">/</span>

      {current.group !== 'Operations' && (
        <>
          <span className="text-slate-500">{current.group}</span>
          <span className="text-slate-300">/</span>
        </>
      )}

      <span className="text-slate-900 font-semibold">{current.label}</span>
    </nav>
  );
};

export default Breadcrumbs;
