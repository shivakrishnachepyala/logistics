import type { IconName } from '../components/common/AppIcon';

export interface NavItem {
  name: string;
  href: string;
  icon: IconName;
  badge?: string;
  badgeColor?: 'orange' | 'blue' | 'slate';
  description?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAVIGATION_GROUPS: NavGroup[] = [
  {
    label: 'OPERATIONS',
    items: [
      {
        name: 'Dashboard',
        href: '/manager/dashboard',
        icon: 'dashboard',
        description: 'Operations overview and KPIs',
      },
      {
        name: 'Shipments',
        href: '/manager/shipments',
        icon: 'shipments',
        badge: '8',
        badgeColor: 'blue',
        description: 'Master consignment grid',
      },
      {
        name: 'Transportation Assignment',
        href: '/manager/transport-assignment',
        icon: 'transport',
        badge: 'New',
        badgeColor: 'orange',
        description: 'Multimodal Road, Rail, Air & Sea dispatch',
      },
      {
        name: 'Live Tracking',
        href: '/manager/tracking',
        icon: 'tracking',
        description: 'Fleet and cargo radar workspace',
      },
    ],
  },
  {
    label: 'ASSETS',
    items: [
      {
        name: 'Fleet Management',
        href: '/manager/fleet',
        icon: 'fleet',
        description: 'Vehicles, drivers, and maintenance',
      },
      {
        name: 'Warehouse Management',
        href: '/manager/warehouses',
        icon: 'warehouse',
        description: 'Regional hubs and storage zones',
      },
      {
        name: 'Inventory Management',
        href: '/manager/inventory',
        icon: 'inventory',
        description: 'SKU catalogue and pallet storage',
      },
    ],
  },
  {
    label: 'COMMERCIAL',
    items: [
      {
        name: 'Customers & Staff',
        href: '/manager/customers',
        icon: 'customers',
        description: 'B2B accounts and team roles',
      },
      {
        name: 'Payments & Billing',
        href: '/manager/billing',
        icon: 'billing',
        description: 'Invoices, freight charges, and COD',
      },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      {
        name: 'Reports & Analytics',
        href: '/manager/analytics',
        icon: 'analytics',
        description: 'SLA benchmarks and lane velocity',
      },
      {
        name: 'Branch Management',
        href: '/manager/branches',
        icon: 'branches',
        description: 'Terminal facilities and hubs',
      },
      {
        name: 'Settings',
        href: '/manager/settings',
        icon: 'settings',
        description: 'System preferences and API keys',
      },
    ],
  },
];
