import React, { useState, useEffect, useMemo } from 'react';
import {
  getAppSettings,
  saveAppSettings,
  resetAllSampleData,
  getCustomers,
  getStaff,
  getInvoices,
  getPayments,
  getBranches,
} from '../data/mockCommercial';
import { getStoredShipments } from '../data/mockShipments';
import { getVehicles, getFleetDrivers, getWarehouses, getInventoryItems } from '../data/mockAssets';
import type { AppSettings } from '../types/commercial';
import { AppIcon } from '../components/common/AppIcon';
import { useEnterprise } from '../context/EnterpriseContext';

type SettingsTab = 'general' | 'operations' | 'appearance' | 'profile' | 'data';

export const SettingsPage: React.FC = () => {
  const { branchLabel } = useEnterprise();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // App Settings state
  const [settings, setSettings] = useState<AppSettings>(() => getAppSettings());

  // Real-time record counts for storage console
  const [storageStats, setStorageStats] = useState(() => ({
    shipments: getStoredShipments().length,
    vehicles: getVehicles().length,
    drivers: getFleetDrivers().length,
    warehouses: getWarehouses().length,
    inventory: getInventoryItems().length,
    customers: getCustomers().length,
    staff: getStaff().length,
    invoices: getInvoices().length,
    payments: getPayments().length,
    branches: getBranches().length,
  }));

  // Listen for storage events
  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getAppSettings());
      setStorageStats({
        shipments: getStoredShipments().length,
        vehicles: getVehicles().length,
        drivers: getFleetDrivers().length,
        warehouses: getWarehouses().length,
        inventory: getInventoryItems().length,
        customers: getCustomers().length,
        staff: getStaff().length,
        invoices: getInvoices().length,
        payments: getPayments().length,
        branches: getBranches().length,
      });
    };
    window.addEventListener('freightline_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('freightline_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Total LocalStorage Size in KB calculation
  const totalStorageSizeKb = useMemo(() => {
    if (typeof window === 'undefined') return 0;
    // Referencing storageStats ensures recalculation on storage update
    if (!storageStats) return 0;
    let totalBytes = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key) && key.startsWith('freightline_')) {
        const item = localStorage.getItem(key);
        if (item) totalBytes += item.length * 2;
      }
    }
    return (totalBytes / 1024).toFixed(1);
  }, [storageStats]);

  // Handler: Save Settings
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveAppSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Handler: Reset Sample Data
  const handleConfirmReset = () => {
    resetAllSampleData();
    setShowResetConfirm(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-navy">Platform & Enterprise Settings</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {branchLabel}
            </span>
          </div>
          <p className="text-sm text-secondary mt-1">
            Configure company branding, operational dispatch rules, display preferences, and local data persistence.
          </p>
        </div>

        {/* Save feedback indicator */}
        {saveSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold animate-pulse">
            <AppIcon name="check-circle" size={15} />
            <span>Preferences Saved Successfully</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'general'
              ? 'border-orange text-orange'
              : 'border-transparent text-secondary hover:text-navy'
          }`}
        >
          <AppIcon name="building" size={16} />
          <span>General & Headquarters</span>
        </button>

        <button
          onClick={() => setActiveTab('operations')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'operations'
              ? 'border-orange text-orange'
              : 'border-transparent text-secondary hover:text-navy'
          }`}
        >
          <AppIcon name="truck" size={16} />
          <span>Operational Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'appearance'
              ? 'border-orange text-orange'
              : 'border-transparent text-secondary hover:text-navy'
          }`}
        >
          <AppIcon name="layers" size={16} />
          <span>Appearance & Layout</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'profile'
              ? 'border-orange text-orange'
              : 'border-transparent text-secondary hover:text-navy'
          }`}
        >
          <AppIcon name="user" size={16} />
          <span>Operator Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('data')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'data'
              ? 'border-orange text-orange'
              : 'border-transparent text-secondary hover:text-navy'
          }`}
        >
          <AppIcon name="box" size={16} />
          <span>Data Console ({totalStorageSizeKb} KB)</span>
        </button>
      </div>

      {/* TAB 1: GENERAL SETTINGS */}
      {activeTab === 'general' && (
        <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-navy">Corporate Entity Information</h2>
            <p className="text-xs text-secondary mt-0.5">
              These details appear on generated commercial invoices, tax receipts, and customer manifests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">Company Registered Name</label>
              <input
                type="text"
                required
                value={settings.general.companyName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, companyName: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">Corporate Support Email</label>
              <input
                type="email"
                required
                value={settings.general.contactEmail}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, contactEmail: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">Support Helpline Phone</label>
              <input
                type="text"
                required
                value={settings.general.contactPhone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, contactPhone: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">Default Settlement Currency</label>
              <input
                type="text"
                value={settings.general.defaultCurrency}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, defaultCurrency: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">Operating Timezone</label>
              <input
                type="text"
                value={settings.general.timeZone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, timeZone: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-secondary mb-1">
                Headquarters Registered Address
              </label>
              <textarea
                rows={2}
                value={settings.general.companyAddress}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, companyAddress: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="submit"
              className="px-4 py-2 bg-orange hover:bg-orange-hover text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Save General Settings
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: OPERATIONAL RULES */}
      {activeTab === 'operations' && (
        <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-navy">Consignment & Dispatch Preferences</h2>
            <p className="text-xs text-secondary mt-0.5">
              Default operational states applied during automated booking and dispatch generation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">Default Ingestion Status</label>
              <select
                value={settings.operational.defaultShipmentStatus}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    operational: { ...settings.operational, defaultShipmentStatus: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
              >
                <option value="pending">Pending Dispatch</option>
                <option value="in-transit">In Transit (Instant Auto-Dispatch)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">Default Transport Mode</label>
              <select
                value={settings.operational.defaultTransportMode}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    operational: { ...settings.operational, defaultTransportMode: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
              >
                <option value="heavy_haul">Road Freight (Heavy Haul)</option>
                <option value="intermodal_rail">Intermodal Rail</option>
                <option value="air_express">Air Express</option>
                <option value="ocean_freight">Ocean Freight</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">Consignment ID Prefix</label>
              <input
                type="text"
                value={settings.operational.idPrefix}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    operational: { ...settings.operational, idPrefix: e.target.value.toUpperCase() },
                  })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border space-y-3">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Automated Notification Rules</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={settings.operational.enableWhatsappNotifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      operational: { ...settings.operational, enableWhatsappNotifications: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-orange rounded border-border focus:ring-orange"
                />
                <div>
                  <div className="text-xs font-semibold text-navy">WhatsApp Delivery Milestones</div>
                  <div className="text-[11px] text-secondary">
                    Transmit automated WhatsApp tracking updates to receiver mobile upon milestone check-ins.
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={settings.operational.enableSmsAlerts}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      operational: { ...settings.operational, enableSmsAlerts: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-orange rounded border-border focus:ring-orange"
                />
                <div>
                  <div className="text-xs font-semibold text-navy">SMS Exception & Delay Alerts</div>
                  <div className="text-[11px] text-secondary">
                    Send high-priority SMS notifications when corridor delays or route diversions exceed 4 hours.
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="submit"
              className="px-4 py-2 bg-orange hover:bg-orange-hover text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Save Operational Rules
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: APPEARANCE & LAYOUT */}
      {activeTab === 'appearance' && (
        <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-navy">Interface Styling & Density</h2>
            <p className="text-xs text-secondary mt-0.5">
              Visual configuration of the FreightLine SaaS enterprise workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme preview */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-secondary">Visual Theme</label>
              <div className="p-4 rounded-xl border-2 border-orange bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-navy">Enterprise Light Palette (Approved)</span>
                  <span className="p-1 rounded-full bg-orange text-white">
                    <AppIcon name="check" size={12} />
                  </span>
                </div>
                <p className="text-[11px] text-secondary">
                  High-contrast Navy headers, subtle borders, slate workspace canvas, and industrial orange accents.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <span className="w-6 h-6 rounded bg-[#0F172A] border border-border" title="Navy" />
                  <span className="w-6 h-6 rounded bg-[#1E293B] border border-border" title="Secondary Navy" />
                  <span className="w-6 h-6 rounded bg-[#F97316] border border-border" title="Accent Orange" />
                  <span className="w-6 h-6 rounded bg-[#FFFFFF] border border-border" title="White Cards" />
                  <span className="w-6 h-6 rounded bg-[#F8FAFC] border border-border" title="Slate Canvas" />
                </div>
              </div>
            </div>

            {/* Layout Toggles */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-secondary">Layout Controls</label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={settings.appearance.sidebarDefaultExpanded}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, sidebarDefaultExpanded: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-orange rounded border-border focus:ring-orange"
                />
                <div>
                  <div className="text-xs font-semibold text-navy">Persistent Expanded Sidebar</div>
                  <div className="text-[11px] text-secondary">Keep the full 64px width sidebar menu open by default.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={settings.appearance.compactDensity}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, compactDensity: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-orange rounded border-border focus:ring-orange"
                />
                <div>
                  <div className="text-xs font-semibold text-navy">High-Density Data Grids</div>
                  <div className="text-[11px] text-secondary">Reduce table row padding for denser data scanning on desktop.</div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="submit"
              className="px-4 py-2 bg-orange hover:bg-orange-hover text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Save Appearance Settings
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: OPERATOR PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-navy">Active Operator Credentials</h2>
            <p className="text-xs text-secondary mt-0.5">
              Operator identity displayed on consignment dispatch notes and audit ledger entries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">Display Name</label>
              <input
                type="text"
                required
                value={settings.profile.displayName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profile: { ...settings.profile, displayName: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">Operator Role</label>
              <input
                type="text"
                required
                value={settings.profile.role}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profile: { ...settings.profile, role: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">Operator Work Email</label>
              <input
                type="email"
                required
                value={settings.profile.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profile: { ...settings.profile, email: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">Work Mobile</label>
              <input
                type="text"
                required
                value={settings.profile.phone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    profile: { ...settings.profile, phone: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="submit"
              className="px-4 py-2 bg-orange hover:bg-orange-hover text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Update Profile Credentials
            </button>
          </div>
        </form>
      )}

      {/* TAB 5: DATA CONSOLE & LOCAL STORAGE */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          {/* Storage Overview Card */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-navy flex items-center gap-2">
                  <AppIcon name="box" size={18} className="text-orange" />
                  <span>Browser LocalStorage Data Engine</span>
                </h2>
                <p className="text-xs text-secondary mt-0.5">
                  Complete offline-first simulation. All data lives inside your local web browser session.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-navy border border-border">
                  Storage Used: {totalStorageSizeKb} KB
                </span>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition-colors"
                >
                  Reset Factory Sample Data
                </button>
              </div>
            </div>

            {/* Storage Keys & Counts Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-border">
                <span className="text-secondary block">Shipments</span>
                <span className="text-lg font-bold text-navy mt-1 block">{storageStats.shipments}</span>
                <span className="text-[10px] text-slate-400 font-mono">shipments_v2</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-border">
                <span className="text-secondary block">Vehicles</span>
                <span className="text-lg font-bold text-navy mt-1 block">{storageStats.vehicles}</span>
                <span className="text-[10px] text-slate-400 font-mono">vehicles_v1</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-border">
                <span className="text-secondary block">Drivers</span>
                <span className="text-lg font-bold text-navy mt-1 block">{storageStats.drivers}</span>
                <span className="text-[10px] text-slate-400 font-mono">drivers_v1</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-border">
                <span className="text-secondary block">Warehouses</span>
                <span className="text-lg font-bold text-navy mt-1 block">{storageStats.warehouses}</span>
                <span className="text-[10px] text-slate-400 font-mono">warehouses_v1</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-border">
                <span className="text-secondary block">Inventory SKUs</span>
                <span className="text-lg font-bold text-navy mt-1 block">{storageStats.inventory}</span>
                <span className="text-[10px] text-slate-400 font-mono">inventory_v1</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-border">
                <span className="text-secondary block">Customers</span>
                <span className="text-lg font-bold text-navy mt-1 block">{storageStats.customers}</span>
                <span className="text-[10px] text-slate-400 font-mono">customers_v1</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-border">
                <span className="text-secondary block">Staff Personnel</span>
                <span className="text-lg font-bold text-navy mt-1 block">{storageStats.staff}</span>
                <span className="text-[10px] text-slate-400 font-mono">staff_v1</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-border">
                <span className="text-secondary block">Invoices</span>
                <span className="text-lg font-bold text-navy mt-1 block">{storageStats.invoices}</span>
                <span className="text-[10px] text-slate-400 font-mono">invoices_v1</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-border">
                <span className="text-secondary block">Payments</span>
                <span className="text-lg font-bold text-navy mt-1 block">{storageStats.payments}</span>
                <span className="text-[10px] text-slate-400 font-mono">payments_v1</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-border">
                <span className="text-secondary block">Branch Hubs</span>
                <span className="text-lg font-bold text-navy mt-1 block">{storageStats.branches}</span>
                <span className="text-[10px] text-slate-400 font-mono">branches_v1</span>
              </div>
            </div>

            {/* Informational Architecture Banner */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 text-xs leading-relaxed space-y-1">
              <div className="font-bold flex items-center gap-2">
                <AppIcon name="info" size={16} className="text-blue-600" />
                <span>Zero External Backend Dependency</span>
              </div>
              <p className="text-blue-800">
                FreightLine is running in client-side reactive simulation mode. Changes you make in any module
                are instantly persisted to your web browser and broadcast across tabs via custom window storage events.
                Resetting the sample data restores all initial mock consignments, clients, invoices, and vehicle assets.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESET CONFIRMATION */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-50 border border-rose-200">
                <AppIcon name="alert" size={20} />
              </div>
              <h3 className="text-base font-bold text-navy">Reset All Platform Data?</h3>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              This will clear all custom consignments, invoices, recorded payments, and customer accounts,
              and restore the clean factory sample datasets. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 border border-border text-secondary hover:text-navy hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Yes, Restore Sample Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
