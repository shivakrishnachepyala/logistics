import React from 'react';
import { Link } from 'react-router-dom';
import { AppIcon, type IconName } from '../components/common/AppIcon';

export interface ModuleConfig {
  title: string;
  category: 'OPERATIONS' | 'ASSETS' | 'COMMERCIAL' | 'SYSTEM';
  icon: IconName;
  phase: string;
  description: string;
  capabilities: string[];
}

const MODULES: Record<string, ModuleConfig> = {
  'transport-assignment': {
    title: 'Transportation Assignment',
    category: 'OPERATIONS',
    icon: 'transport',
    phase: 'Phase 2: Core Logistics Workflows',
    description: 'Centralized multimodal dispatch console supporting Road, Rail, Air, and Sea carrier allocations.',
    capabilities: [
      'Multimodal dispatch assignment (Road trucking, Rail intermodal, Air cargo, and Ocean container shipping).',
      'Carrier and 3PL partner selection (Fleet vs. Contract logistics partners).',
      'Vehicle, train rake, flight AWB, and vessel container reference pairing.',
      'Driver roster allocation with license validation and active shift logging.',
      'Instant status transition to Dispatched & In-Transit with tracking link generation.',
    ],
  },
  'tracking': {
    title: 'Live Tracking Workspace',
    category: 'OPERATIONS',
    icon: 'tracking',
    phase: 'Phase 2: Core Logistics Workflows',
    description: 'Real-time operational radar workspace featuring an interactive map, vehicle telemetry, and geofence tracking.',
    capabilities: [
      'Full-canvas interactive map with real-time consignment coordinates.',
      'Mode filters for Road, Rail, Air, and Sea cargo in motion.',
      'Geofence alerts, waypoint arrival stamps, and route deviation flags.',
      'Driver telemetry and live speed monitoring.',
      'Direct consignment inspector side-panel with checkpoint histories.',
    ],
  },
  'fleet': {
    title: 'Fleet Management',
    category: 'ASSETS',
    icon: 'fleet',
    phase: 'Phase 3: Asset & Inventory Workspaces',
    description: 'Comprehensive asset registry tracking trucks, trailers, GPS units, and professional driver rosters.',
    capabilities: [
      'Vehicle registry with registration plates, vehicle types, and payload capacities.',
      'Driver management with commercial license numbers, phone contacts, and shift logs.',
      'Preventative maintenance scheduling and fitness/insurance expiry trackers.',
      'Odometer and fuel log monitoring.',
    ],
  },
  'warehouses': {
    title: 'Warehouse Management',
    category: 'ASSETS',
    icon: 'warehouse',
    phase: 'Phase 3: Asset & Inventory Workspaces',
    description: 'Regional sorting hubs, storage zones, dock bay scheduling, and throughput monitoring.',
    capabilities: [
      'Regional facility directory across Delhi, Jaipur, Surat, Mumbai, and Chennai hubs.',
      'Zone utilization tracking (Inbound staging, high-density racking, cold storage, and cross-dock bays).',
      'Arrival and loading bay dock schedule manager.',
      'Daily hub processing capacity and throughput statistics.',
    ],
  },
  'inventory': {
    title: 'Inventory Management',
    category: 'ASSETS',
    icon: 'inventory',
    phase: 'Phase 3: Asset & Inventory Workspaces',
    description: 'Master SKU catalogue, storage locations, stock levels, and warehouse movement transactions.',
    capabilities: [
      'Master SKU catalogue with item descriptions, dimensions, and weights.',
      'Real-time stock on hand distributed across regional warehouses.',
      'Storage bin and pallet rack location mapping.',
      'Inward receiving and outward dispatch transaction logging.',
    ],
  },
  'customers': {
    title: 'Customers & Staff',
    category: 'COMMERCIAL',
    icon: 'customers',
    phase: 'Phase 4: Commercial & Settings',
    description: 'Corporate client accounts, consignor/consignee address book, and internal staff access roles.',
    capabilities: [
      'B2B client and enterprise shipper account profiles.',
      'Consignor and consignee verified address book.',
      'Staff directory for dispatchers, drivers, warehouse clerks, and administrators.',
      'Role-based access permissions and credential management.',
    ],
  },
  'billing': {
    title: 'Payments & Billing',
    category: 'COMMERCIAL',
    icon: 'billing',
    phase: 'Phase 4: Commercial & Settings',
    description: 'Freight invoicing, cash-on-delivery reconciliation, outstanding payments, and GST compliance.',
    capabilities: [
      'Commercial invoice and freight bill generation.',
      'Cash-on-delivery (COD) collection and reconciliation status.',
      'Tax breakdown with GST / e-way bill references.',
      'Payment receipts and customer ledger accounts.',
    ],
  },
  'analytics': {
    title: 'Reports & Analytics',
    category: 'SYSTEM',
    icon: 'analytics',
    phase: 'Phase 4: Commercial & Settings',
    description: 'Operational SLAs, lane velocity, carrier reliability rankings, and financial performance reports.',
    capabilities: [
      'On-time delivery SLA compliance graphs and trendlines.',
      'Lane velocity benchmarks (e.g. Delhi-Jaipur vs. Surat-Mumbai).',
      'Carrier reliability and fleet utilization metrics.',
      'Freight tonnage and revenue distribution breakdowns.',
    ],
  },
  'branches': {
    title: 'Branch Management',
    category: 'SYSTEM',
    icon: 'branches',
    phase: 'Phase 4: Commercial & Settings',
    description: 'Logistics network configuration, regional hub coordinators, and geographic service coverage.',
    capabilities: [
      'Hub profile management with facility addresses and emergency lines.',
      'Branch manager allocations and dispatch jurisdiction.',
      'Regional PIN code coverage zones and geofenced service borders.',
      'Hub-to-hub transit schedule definitions.',
    ],
  },
  'settings': {
    title: 'Settings & Integrations',
    category: 'SYSTEM',
    icon: 'settings',
    phase: 'Phase 4: Commercial & Settings',
    description: 'System-wide preferences, carrier API integrations, automated notifications, and audit logs.',
    capabilities: [
      'Organization profile and corporate tax details.',
      'SMS, WhatsApp, and email notification trigger rules.',
      'Carrier telematics and GPS API gateway configurations.',
      'Security audit logs and system event history.',
    ],
  },
};

interface ModulePlaceholderProps {
  moduleKey: string;
}

export const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({ moduleKey }) => {
  const config = MODULES[moduleKey] || {
    title: 'Operational Workspace',
    category: 'OPERATIONS',
    icon: 'dashboard',
    phase: 'Planned Workspace',
    description: 'This operational workspace is currently under architectural design.',
    capabilities: ['Capability planning in progress.'],
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-saas-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200 shrink-0">
              <AppIcon name={config.icon} size={24} className="text-orange-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {config.category}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/60">
                  {config.phase}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
                {config.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <AppIcon name="dashboard" size={14} />
              <span>Back to Dashboard</span>
            </Link>
            <Link
              to="/shipments"
              className="px-4 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <AppIcon name="shipments" size={14} />
              <span>View Active Shipments</span>
            </Link>
          </div>
        </div>

        {/* Overview Description */}
        <p className="text-sm text-slate-600 mt-4 leading-relaxed max-w-3xl">
          {config.description}
        </p>
      </div>

      {/* Planned Capabilities Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-saas-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          Planned Enterprise Capabilities
        </h2>
        <p className="text-xs text-slate-500">
          This module is part of the approved FreightLine Enterprise LMS Roadmap and will be fully implemented in the upcoming phase:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {config.capabilities.map((cap, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                <AppIcon name="check" size={12} />
              </div>
              <span className="text-xs text-slate-700 leading-relaxed font-medium">
                {cap}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
