import React, { useState, useEffect, useMemo } from 'react';
import {
  getWarehouses,
  saveWarehouse,
  deleteWarehouse,
  getStorageLocations,
  getInventoryItems,
} from '../data/mockAssets';
import type { Warehouse, StorageLocation, WarehouseStatus } from '../types/assets';
import { AppIcon } from '../components/common/AppIcon';
import { useEnterprise, BRANCH_NAMES } from '../context/EnterpriseContext';

export const WarehouseManagementPage: React.FC = () => {
  const { branch, branchLabel } = useEnterprise();
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => getWarehouses());
  const [locations, setLocations] = useState<StorageLocation[]>(() => getStorageLocations());
  const [inventory, setInventory] = useState(() => getInventoryItems());

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  // Selected Warehouse for Deep Dive Inspection
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>(() => {
    return getWarehouses()[0]?.id || '';
  });

  // Active sub-view in inspection panel: 'overview' | 'locations' | 'inventory' | 'activity'
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'locations' | 'inventory' | 'activity'>('overview');

  // Modal Dialog States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [deletingWarehouseId, setDeletingWarehouseId] = useState<string | null>(null);

  // Form State for Add / Edit
  const [whForm, setWhForm] = useState<Partial<Warehouse>>({
    name: '',
    branchId: 'DEL-CENTRAL',
    city: 'New Delhi',
    state: 'Delhi',
    address: '',
    managerName: '',
    managerPhone: '+91 ',
    managerEmail: '',
    totalCapacitySqFt: 50000,
    totalCapacityCbm: 10000,
    occupiedCapacityCbm: 4000,
    operationalStatus: 'active',
    dockCount: 8,
    temperatureControlled: false,
    tempRange: '',
    zones: ['Zone A: Pallet Bulk', 'Zone B: Staging Area'],
  });

  useEffect(() => {
    const handleUpdate = () => {
      setWarehouses(getWarehouses());
      setLocations(getStorageLocations());
      setInventory(getInventoryItems());
    };
    window.addEventListener('freightline_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('freightline_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Overview KPI Metrics
  const metrics = useMemo(() => {
    const total = warehouses.length;
    const active = warehouses.filter(w => w.operationalStatus === 'active').length;
    const totalSqFt = warehouses.reduce((sum, w) => sum + w.totalCapacitySqFt, 0);
    const totalCbm = warehouses.reduce((sum, w) => sum + w.totalCapacityCbm, 0);
    const occupiedCbm = warehouses.reduce((sum, w) => sum + w.occupiedCapacityCbm, 0);
    const availableCbm = Math.max(0, totalCbm - occupiedCbm);
    const utilizationRate = totalCbm > 0 ? Math.round((occupiedCbm / totalCbm) * 100) : 0;
    return { total, active, totalSqFt, totalCbm, occupiedCbm, availableCbm, utilizationRate };
  }, [warehouses]);

  // Filtered Warehouses
  const filteredWarehouses = useMemo(() => {
    return warehouses.filter((w) => {
      if (branchFilter !== 'all' && w.branchId !== branchFilter) return false;
      if (statusFilter !== 'all' && w.operationalStatus !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = w.id.toLowerCase().includes(q);
        const matchName = w.name.toLowerCase().includes(q);
        const matchCity = w.city.toLowerCase().includes(q);
        const matchMgr = w.managerName.toLowerCase().includes(q);
        return matchId || matchName || matchCity || matchMgr;
      }
      return true;
    });
  }, [warehouses, branchFilter, statusFilter, searchQuery]);

  const paginatedWarehouses = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredWarehouses.slice(start, start + pageSize);
  }, [filteredWarehouses, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredWarehouses.length / pageSize) || 1;

  // Currently inspected warehouse object
  const inspectedWarehouse = useMemo(() => {
    return warehouses.find(w => w.id === selectedWarehouseId) || warehouses[0];
  }, [warehouses, selectedWarehouseId]);

  // Storage locations belonging to selected warehouse
  const warehouseLocations = useMemo(() => {
    if (!inspectedWarehouse) return [];
    return locations.filter(l => l.warehouseId === inspectedWarehouse.id);
  }, [locations, inspectedWarehouse]);

  // Inventory stored in selected warehouse
  const warehouseInventory = useMemo(() => {
    if (!inspectedWarehouse) return [];
    return inventory.filter(i => i.warehouseId === inspectedWarehouse.id);
  }, [inventory, inspectedWarehouse]);

  // Handlers for Add / Edit
  const handleOpenAdd = () => {
    setWhForm({
      name: '',
      branchId: branch !== 'all' ? branch : 'DEL-CENTRAL',
      city: BRANCH_NAMES[branch]?.city || 'New Delhi',
      state: 'Delhi',
      address: '',
      managerName: '',
      managerPhone: '+91 ',
      managerEmail: '',
      totalCapacitySqFt: 60000,
      totalCapacityCbm: 12000,
      occupiedCapacityCbm: 2000,
      operationalStatus: 'active',
      dockCount: 10,
      temperatureControlled: false,
      tempRange: '',
      zones: ['Zone A: Pallet High-Rack', 'Zone B: Cross-Dock Staging'],
    });
    setEditingWarehouse(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (w: Warehouse) => {
    setWhForm({ ...w });
    setEditingWarehouse(w);
    setShowAddModal(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whForm.name || !whForm.city) return;

    const id = editingWarehouse?.id || `WH-${whForm.city?.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const newWh: Warehouse = {
      id,
      name: whForm.name,
      branchId: whForm.branchId || 'DEL-CENTRAL',
      city: whForm.city,
      state: whForm.state || 'Delhi',
      address: whForm.address || `${whForm.city} Logistics Park`,
      managerName: whForm.managerName || 'Operations Officer',
      managerPhone: whForm.managerPhone || '+91 98000 00000',
      managerEmail: whForm.managerEmail || `mgr.${id.toLowerCase()}@veltrax.in`,
      totalCapacitySqFt: Number(whForm.totalCapacitySqFt) || 50000,
      totalCapacityCbm: Number(whForm.totalCapacityCbm) || 10000,
      occupiedCapacityCbm: Number(whForm.occupiedCapacityCbm) || 0,
      operationalStatus: (whForm.operationalStatus as WarehouseStatus) || 'active',
      dockCount: Number(whForm.dockCount) || 8,
      temperatureControlled: Boolean(whForm.temperatureControlled),
      tempRange: whForm.tempRange,
      zones: whForm.zones || ['Zone A: General Goods', 'Zone B: Staging'],
      recentActivity: editingWarehouse?.recentActivity || [
        {
          id: `ACT-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          event: 'Warehouse registered in VELTRAX network',
          user: whForm.managerName || 'Admin',
        },
      ],
    };

    saveWarehouse(newWh);
    setShowAddModal(false);
    setSelectedWarehouseId(newWh.id);
  };

  const handleConfirmDelete = () => {
    if (deletingWarehouseId) {
      deleteWarehouse(deletingWarehouseId);
      setDeletingWarehouseId(null);
      if (selectedWarehouseId === deletingWarehouseId) {
        const remaining = warehouses.filter(w => w.id !== deletingWarehouseId);
        if (remaining.length > 0) setSelectedWarehouseId(remaining[0].id);
      }
    }
  };

  const getStatusBadge = (status: WarehouseStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        );
      case 'full':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            At Capacity
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Maintenance
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Closed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-saas-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 tracking-tight">
              Warehouse & Fulfilment Centres
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-navy-50 text-navy-800 border border-navy-200">
              <AppIcon name="warehouse" size={13} />
              <span>Storage Infrastructure</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Regional warehousing facilities, volumetric capacity utilization, storage zones, and cross-docking bays for{' '}
            <strong className="text-slate-700 font-semibold">{branchLabel}</strong>.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-saas-sm transition-colors"
        >
          <AppIcon name="plus" size={14} />
          <span>Add Warehouse</span>
        </button>
      </div>

      {/* 2. Overview KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Total Hubs</div>
          <div className="text-2xl font-heading font-black text-slate-900">{metrics.total}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">National logistics centers</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Active Hubs</div>
          <div className="text-2xl font-heading font-black text-emerald-600">{metrics.active}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Operational readiness</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Floor Space</div>
          <div className="text-2xl font-heading font-black text-slate-900">{(metrics.totalSqFt / 1000).toFixed(0)}k</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Square Feet Total</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Total Capacity</div>
          <div className="text-2xl font-heading font-black text-slate-900">{metrics.totalCbm.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cubic Metres (CBM)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Occupied</div>
          <div className="text-2xl font-heading font-black text-orange-600">{metrics.occupiedCbm.toLocaleString()}</div>
          <div className="text-[11px] text-orange-700 font-semibold mt-0.5">{metrics.utilizationRate}% Utilized</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Available</div>
          <div className="text-2xl font-heading font-black text-emerald-600">{metrics.availableCbm.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">CBM Spare Headroom</div>
        </div>
      </div>

      {/* 3. Main Split View: Directory on Left (5 Cols), Inspection Console on Right (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Warehouse Directory & Selector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-sm text-slate-900">
                Facility Directory
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                {filteredWarehouses.length} facilities
              </span>
            </div>

            {/* Filter controls */}
            <div className="space-y-2">
              <div className="relative">
                <AppIcon name="search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search hub name, city, manager..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-700 font-medium"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="full">At Capacity</option>
                  <option value="maintenance">Maintenance</option>
                </select>

                <select
                  value={branchFilter}
                  onChange={(e) => {
                    setBranchFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-700 font-medium"
                >
                  <option value="all">All Branches</option>
                  <option value="DEL-CENTRAL">Delhi NCR</option>
                  <option value="MH-MUMBAI">Mumbai</option>
                  <option value="JPR-MAIN">Jaipur</option>
                  <option value="GJ-SURAT">Surat</option>
                  <option value="TN-CHENNAI">Chennai</option>
                  <option value="KA-BLR">Bengaluru</option>
                </select>
              </div>
            </div>

            {/* Warehouse Cards List */}
            <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
              {paginatedWarehouses.map((wh) => {
                const isSelected = inspectedWarehouse?.id === wh.id;
                const utilPct = Math.round((wh.occupiedCapacityCbm / wh.totalCapacityCbm) * 100);

                return (
                  <div
                    key={wh.id}
                    onClick={() => setSelectedWarehouseId(wh.id)}
                    className={`p-3 cursor-pointer rounded-lg transition-all ${
                      isSelected
                        ? 'bg-orange-50/50 border-l-4 border-l-orange-500 shadow-xs'
                        : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] text-orange-600 font-bold">{wh.id}</span>
                          <span className="text-slate-300">•</span>
                          <span className="font-mono text-[10px] text-slate-400">{wh.branchId}</span>
                        </div>
                        <h3 className="font-heading font-bold text-xs text-slate-900 mt-0.5 leading-snug">
                          {wh.name}
                        </h3>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {wh.city}, {wh.state}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {getStatusBadge(wh.operationalStatus)}
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="mt-2.5 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>{wh.occupiedCapacityCbm.toLocaleString()} / {wh.totalCapacityCbm.toLocaleString()} CBM</span>
                        <span className="font-bold text-slate-800">{utilPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            utilPct >= 90 ? 'bg-amber-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${utilPct}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Actions row */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Mgr: {wh.managerName}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(wh);
                          }}
                          className="text-slate-400 hover:text-orange-600 px-1 py-0.5"
                          title="Edit warehouse"
                        >
                          <AppIcon name="edit" size={13} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingWarehouseId(wh.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 px-1 py-0.5"
                          title="Delete warehouse"
                        >
                          <AppIcon name="trash" size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px]">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 disabled:opacity-40 text-xs"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 disabled:opacity-40 text-xs"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Warehouse Deep-Dive Inspection Console (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-saas-sm flex flex-col overflow-hidden">
          {inspectedWarehouse ? (
            <div className="p-5 space-y-5">

              {/* Header Profile */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-orange-600 px-2 py-0.5 rounded bg-orange-50 border border-orange-200">
                      {inspectedWarehouse.id}
                    </span>
                    <span className="font-mono text-xs text-slate-400">{inspectedWarehouse.branchId}</span>
                    {getStatusBadge(inspectedWarehouse.operationalStatus)}
                  </div>
                  <h2 className="font-heading font-black text-lg sm:text-xl text-slate-900 mt-1">
                    {inspectedWarehouse.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {inspectedWarehouse.address}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenEdit(inspectedWarehouse)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors self-start"
                >
                  <AppIcon name="edit" size={13} />
                  <span>Configure Facility</span>
                </button>
              </div>

              {/* Sub-Tabs for Facility Details */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-px text-xs font-semibold">
                {[
                  { key: 'overview', label: 'Facility Specs' },
                  { key: 'locations', label: `Storage Zones & Bins (${warehouseLocations.length})` },
                  { key: 'inventory', label: `Stored Cargo (${warehouseInventory.length})` },
                  { key: 'activity', label: 'Activity Audit Log' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveDetailTab(tab.key as typeof activeDetailTab)}
                    className={`py-2 px-3 border-b-2 transition-all ${
                      activeDetailTab === tab.key
                        ? 'border-orange-500 text-orange-600 font-bold'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: FACILITY OVERVIEW & CAPACITY METER */}
              {activeDetailTab === 'overview' && (
                <div className="space-y-4">
                  {/* Capacity Visualization Box */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold">Volumetric Utilization</span>
                        <div className="font-heading font-bold text-base text-slate-900">
                          {inspectedWarehouse.occupiedCapacityCbm.toLocaleString()} CBM Occupied
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] uppercase font-bold">Total Headroom</span>
                        <div className="font-mono font-bold text-emerald-600">
                          {(inspectedWarehouse.totalCapacityCbm - inspectedWarehouse.occupiedCapacityCbm).toLocaleString()} CBM Free
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.round((inspectedWarehouse.occupiedCapacityCbm / inspectedWarehouse.totalCapacityCbm) * 100)}%`,
                        }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                      <div className="bg-white p-2 rounded-lg border border-slate-100">
                        <div className="text-slate-400 text-[10px]">Utilization</div>
                        <div className="font-bold text-slate-800 font-mono">
                          {Math.round((inspectedWarehouse.occupiedCapacityCbm / inspectedWarehouse.totalCapacityCbm) * 100)}%
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-100">
                        <div className="text-slate-400 text-[10px]">Loading Docks</div>
                        <div className="font-bold text-slate-800 font-mono">{inspectedWarehouse.dockCount} Bays</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-100">
                        <div className="text-slate-400 text-[10px]">Floor Area</div>
                        <div className="font-bold text-slate-800 font-mono">{inspectedWarehouse.totalCapacitySqFt.toLocaleString()} sq ft</div>
                      </div>
                    </div>
                  </div>

                  {/* Facility Specs Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                      <div className="font-heading font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        <AppIcon name="user" size={13} className="text-orange-500" />
                        <span>Facility Manager</span>
                      </div>
                      <div className="font-semibold text-slate-900">{inspectedWarehouse.managerName}</div>
                      <div className="text-slate-500 text-[11px] font-mono">{inspectedWarehouse.managerPhone}</div>
                      <div className="text-slate-500 text-[11px]">{inspectedWarehouse.managerEmail}</div>
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                      <div className="font-heading font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        <AppIcon name="shield" size={13} className="text-sky-500" />
                        <span>Environmental Controls</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inspectedWarehouse.temperatureControlled
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {inspectedWarehouse.temperatureControlled ? 'Cold Chain Certified' : 'Ambient Dry Storage'}
                        </span>
                      </div>
                      {inspectedWarehouse.tempRange && (
                        <div className="text-[11px] font-mono text-slate-600">
                          Active Range: {inspectedWarehouse.tempRange}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Operational Zones Pill List */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Designated Storage Zones
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {inspectedWarehouse.zones.map((z, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5"
                        >
                          <AppIcon name="layers" size={12} className="text-orange-500" />
                          <span>{z}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: STORAGE LOCATIONS (ZONES, SECTIONS, RACKS, BINS) */}
              {activeDetailTab === 'locations' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Configured pallet racks and shelf bins</span>
                    <span className="font-mono">{warehouseLocations.length} locations mapped</span>
                  </div>

                  {warehouseLocations.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-lg text-xs">
                      No rack locations currently mapped for this warehouse. Use the Configure Facility modal to initialize zones.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {warehouseLocations.map((loc) => {
                        const locUtil = Math.round((loc.occupiedUnits / loc.capacityUnits) * 100);
                        return (
                          <div
                            key={loc.id}
                            className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-slate-900">{loc.bin}</span>
                              <span
                                className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                                  loc.status === 'full'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : loc.status === 'partial'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {loc.status}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-500">
                              {loc.zone} • {loc.section} • {loc.rack}
                            </div>

                            {loc.currentSku && (
                              <div className="text-[11px] font-mono font-semibold text-slate-800 bg-white px-2 py-1 rounded border border-slate-100">
                                Stored: {loc.currentSku}
                              </div>
                            )}

                            <div className="space-y-1 pt-1">
                              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                                <span>{loc.occupiedUnits} / {loc.capacityUnits} units</span>
                                <span>{locUtil}%</span>
                              </div>
                              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${locUtil >= 90 ? 'bg-amber-500' : 'bg-orange-500'}`}
                                  style={{ width: `${locUtil}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: STORED CARGO INVENTORY */}
              {activeDetailTab === 'inventory' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Pallets and packages currently staged in this facility</span>
                    <span className="font-mono">{warehouseInventory.length} SKUs present</span>
                  </div>

                  {warehouseInventory.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-lg text-xs">
                      No inventory currently stored in this warehouse.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
                      {warehouseInventory.map((item) => (
                        <div key={item.id} className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-slate-50">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900">{item.id}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-500">{item.category}</span>
                            </div>
                            <div className="font-medium text-slate-800 mt-0.5">{item.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              Location: {item.locationCode}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-slate-900">
                              {item.quantity} {item.unitOfMeasure}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500">
                              ₹{item.totalValueInr.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ACTIVITY AUDIT LOG */}
              {activeDetailTab === 'activity' && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Facility Log & Scans
                  </span>
                  <div className="space-y-2">
                    {inspectedWarehouse.recentActivity.map((act) => (
                      <div
                        key={act.id}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="text-slate-800 font-medium">{act.event}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Logged by {act.user}</div>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 shrink-0">
                          {act.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Select a warehouse facility from the directory to inspect its storage infrastructure.
            </div>
          )}
        </div>

      </div>

      {/* 4. MODAL: ADD / EDIT WAREHOUSE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-saas-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-heading font-bold text-base text-slate-900">
                {editingWarehouse ? 'Edit Warehouse Facility' : 'Register New Regional Warehouse'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <AppIcon name="x" size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Warehouse Name *</label>
                <input
                  type="text"
                  required
                  value={whForm.name}
                  onChange={(e) => setWhForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Pune Chakan Logistics Park"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City / Hub *</label>
                  <input
                    type="text"
                    required
                    value={whForm.city}
                    onChange={(e) => setWhForm(p => ({ ...p, city: e.target.value }))}
                    placeholder="e.g. Pune"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Branch Affiliation</label>
                  <select
                    value={whForm.branchId}
                    onChange={(e) => setWhForm(p => ({ ...p, branchId: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="DEL-CENTRAL">DEL-CENTRAL</option>
                    <option value="MH-MUMBAI">MH-MUMBAI</option>
                    <option value="JPR-MAIN">JPR-MAIN</option>
                    <option value="GJ-SURAT">GJ-SURAT</option>
                    <option value="TN-CHENNAI">TN-CHENNAI</option>
                    <option value="KA-BLR">KA-BLR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Facility Address</label>
                <input
                  type="text"
                  value={whForm.address}
                  onChange={(e) => setWhForm(p => ({ ...p, address: e.target.value }))}
                  placeholder="Plot number, industrial zone, expressway landmark..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Floor Space (Sq Ft)</label>
                  <input
                    type="number"
                    value={whForm.totalCapacitySqFt}
                    onChange={(e) => setWhForm(p => ({ ...p, totalCapacitySqFt: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Volumetric Capacity (CBM)</label>
                  <input
                    type="number"
                    value={whForm.totalCapacityCbm}
                    onChange={(e) => setWhForm(p => ({ ...p, totalCapacityCbm: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Facility Manager Name</label>
                  <input
                    type="text"
                    value={whForm.managerName}
                    onChange={(e) => setWhForm(p => ({ ...p, managerName: e.target.value }))}
                    placeholder="e.g. Sunil Saxena"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Manager Phone</label>
                  <input
                    type="text"
                    value={whForm.managerPhone}
                    onChange={(e) => setWhForm(p => ({ ...p, managerPhone: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Loading Dock Bays</label>
                  <input
                    type="number"
                    value={whForm.dockCount}
                    onChange={(e) => setWhForm(p => ({ ...p, dockCount: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Operational Status</label>
                  <select
                    value={whForm.operationalStatus}
                    onChange={(e) => setWhForm(p => ({ ...p, operationalStatus: e.target.value as WarehouseStatus }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="active">Active</option>
                    <option value="full">At Capacity</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={whForm.temperatureControlled}
                    onChange={(e) => setWhForm(p => ({ ...p, temperatureControlled: e.target.checked }))}
                    className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span>Cold Storage / Climate Controlled Capabilities</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-saas-sm"
                >
                  {editingWarehouse ? 'Update Facility' : 'Register Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: DELETE CONFIRMATION */}
      {deletingWarehouseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-saas-lg max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AppIcon name="alert" size={20} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-slate-900">Decommission Warehouse?</h4>
                <p className="text-xs text-slate-500 mt-0.5">This will remove the facility and its mapped zones.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingWarehouseId(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
