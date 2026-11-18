import React, { useState, useEffect, useMemo } from 'react';
import {
  getBranches,
  saveBranch,
  deleteBranch,
  getStaff,
} from '../data/mockCommercial';
import { getStoredShipments } from '../data/mockShipments';
import { getWarehouses, getVehicles } from '../data/mockAssets';
import type { BranchRecord, BranchStatus } from '../types/commercial';
import type { Staff } from '../types/commercial';
import type { Warehouse, Vehicle } from '../types/assets';
import type { Shipment } from '../types';
import type { BranchId } from '../types';
import { AppIcon } from '../components/common/AppIcon';
import { useEnterprise } from '../context/EnterpriseContext';

const BRANCH_STATUSES: BranchStatus[] = ['active', 'inactive', 'under_expansion'];

export const BranchManagementPage: React.FC = () => {
  const { branch, setBranch, branchLabel } = useEnterprise();

  // Reactive Datasets
  const [branches, setBranches] = useState<BranchRecord[]>(() => getBranches());
  const [staff, setStaff] = useState<Staff[]>(() => getStaff());
  const [shipments, setShipments] = useState<Shipment[]>(() => getStoredShipments());
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => getWarehouses());
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => getVehicles());

  // Listen for storage events
  useEffect(() => {
    const handleUpdate = () => {
      setBranches(getBranches());
      setStaff(getStaff());
      setShipments(getStoredShipments());
      setWarehouses(getWarehouses());
      setVehicles(getVehicles());
    };
    window.addEventListener('freightline_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('freightline_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Filter & Search
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'code' | 'city' | 'establishedDate'>('code');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 6;

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingBranch, setEditingBranch] = useState<BranchRecord | null>(null);
  const [viewingBranch, setViewingBranch] = useState<BranchRecord | null>(null);
  const [deletingBranchId, setDeletingBranchId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState<Partial<BranchRecord>>(() => ({
    name: '',
    code: '',
    city: '',
    state: '',
    address: '',
    branchManager: '',
    contactNumber: '+91 ',
    email: '',
    operationalStatus: 'active',
    establishedDate: '2026-01-15',
  }));

  // Overview KPIs
  const kpis = useMemo(() => {
    const totalBranches = branches.length;
    const activeGateways = branches.filter((b) => b.operationalStatus === 'active').length;
    const expansionGateways = branches.filter((b) => b.operationalStatus === 'under_expansion').length;
    const totalAssignedStaff = staff.length;
    return { totalBranches, activeGateways, expansionGateways, totalAssignedStaff };
  }, [branches, staff]);

  // Filtered & Sorted Branches
  const filteredBranches = useMemo(() => {
    return branches
      .filter((b) => {
        if (statusFilter !== 'all' && b.operationalStatus !== statusFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const matches =
            b.name.toLowerCase().includes(q) ||
            b.code.toLowerCase().includes(q) ||
            b.city.toLowerCase().includes(q) ||
            b.state.toLowerCase().includes(q) ||
            b.branchManager.toLowerCase().includes(q);
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'name') diff = a.name.localeCompare(b.name);
        else if (sortBy === 'code') diff = a.code.localeCompare(b.code);
        else if (sortBy === 'city') diff = a.city.localeCompare(b.city);
        else if (sortBy === 'establishedDate') {
          diff = new Date(a.establishedDate).getTime() - new Date(b.establishedDate).getTime();
        }
        return sortAsc ? diff : -diff;
      });
  }, [branches, statusFilter, search, sortBy, sortAsc]);

  const paginatedBranches = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredBranches.slice(start, start + pageSize);
  }, [filteredBranches, page]);

  const totalPages = Math.ceil(filteredBranches.length / pageSize) || 1;

  // Helper stats for viewing branch
  const viewingBranchData = useMemo(() => {
    if (!viewingBranch) return null;
    const code = viewingBranch.code;
    const assignedStaff = staff.filter((s) => s.assignedBranch === code);
    const assignedWh = warehouses.filter((w) => w.branchId === code);
    const assignedVeh = vehicles.filter((v) =>
      v.currentLocation.toLowerCase().includes(viewingBranch.city.toLowerCase()) ||
      v.currentLocation.toLowerCase().includes(code.toLowerCase())
    );
    const originShipments = shipments.filter((s) => s.originHubCode === code);
    const destShipments = shipments.filter((s) => s.destinationHubCode === code);

    return {
      assignedStaff,
      assignedWh,
      assignedVeh,
      originShipments,
      destShipments,
    };
  }, [viewingBranch, staff, warehouses, vehicles, shipments]);

  // Handlers
  const handleOpenAdd = () => {
    setForm({
      name: '',
      code: '',
      city: '',
      state: '',
      address: '',
      branchManager: '',
      contactNumber: '+91 ',
      email: '',
      operationalStatus: 'active',
      establishedDate: new Date().toISOString().split('T')[0],
    });
    setEditingBranch(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (b: BranchRecord) => {
    setEditingBranch(b);
    setForm({ ...b });
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code || !form.city) {
      alert('Please fill in required fields: Name, Code, and City.');
      return;
    }

    const payload: BranchRecord = {
      id: editingBranch ? editingBranch.id : `BR-${form.code?.toUpperCase() || 'NEW'}`,
      name: form.name || '',
      code: (form.code || '').toUpperCase().trim(),
      city: form.city || '',
      state: form.state || '',
      address: form.address || '',
      branchManager: form.branchManager || 'Unassigned',
      contactNumber: form.contactNumber || '',
      email: form.email || '',
      operationalStatus: form.operationalStatus || 'active',
      establishedDate: form.establishedDate || new Date().toISOString().split('T')[0],
    };

    saveBranch(payload);
    setShowAddModal(false);
  };

  const handleConfirmDelete = () => {
    if (deletingBranchId) {
      deleteBranch(deletingBranchId);
      setDeletingBranchId(null);
      if (viewingBranch && viewingBranch.id === deletingBranchId) {
        setViewingBranch(null);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-navy">Branch & Gateway Hub Network</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active: {branchLabel}
            </span>
          </div>
          <p className="text-sm text-secondary mt-1">
            Configure regional terminal hubs, assign station managers, and set global operating context.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange hover:bg-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
        >
          <AppIcon name="plus" size={16} />
          <span>Add Regional Hub</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Stations</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <AppIcon name="building" size={18} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">{kpis.totalBranches}</div>
          <div className="mt-1 text-xs text-secondary">National distribution network</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Gateways</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <AppIcon name="check-circle" size={18} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">{kpis.activeGateways}</div>
          <div className="mt-1 text-xs text-secondary">Fully operational sorting facilities</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Under Expansion</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <AppIcon name="wrench" size={18} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700">{kpis.expansionGateways}</div>
          <div className="mt-1 text-xs text-secondary">Capacity upgrading in progress</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Station Personnel</span>
            <span className="p-2 rounded-lg bg-slate-100 text-navy">
              <AppIcon name="customers" size={18} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">{kpis.totalAssignedStaff}</div>
          <div className="mt-1 text-xs text-secondary">Assigned across all branches</div>
        </div>
      </div>

      {/* Filter, Search & Controls */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Bar */}
          <div className="md:col-span-5 relative">
            <input
              type="text"
              placeholder="Search by hub name, code (e.g. DEL-CENTRAL), city, or manager..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 pointer-events-none">
              <AppIcon name="search" size={16} />
            </span>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
            >
              <option value="all">All Operational Statuses</option>
              {BRANCH_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st.replace('_', ' ').charAt(0).toUpperCase() + st.replace('_', ' ').slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-4 flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'code' | 'city' | 'establishedDate')}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
            >
              <option value="code">Sort: Hub Code</option>
              <option value="name">Sort: Hub Name</option>
              <option value="city">Sort: City</option>
              <option value="establishedDate">Sort: Established Date</option>
            </select>
            <button
              type="button"
              title="Toggle Sort Order"
              onClick={() => setSortAsc(!sortAsc)}
              className="p-2 bg-slate-50 border border-border rounded-lg text-secondary hover:text-navy hover:bg-slate-100 transition-colors"
            >
              <AppIcon name={sortAsc ? 'arrow-up' : 'arrow-down'} size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Branches Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-border text-xs uppercase font-semibold text-secondary">
                <th className="py-3 px-4">Station Hub</th>
                <th className="py-3 px-4">Station Code</th>
                <th className="py-3 px-4">Location (City, State)</th>
                <th className="py-3 px-4">Station Manager</th>
                <th className="py-3 px-4">Personnel & Assets</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Active Scope</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedBranches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-secondary">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AppIcon name="building" size={28} className="text-slate-300" />
                      <p className="font-medium text-navy">No branch stations found</p>
                      <p className="text-xs text-secondary">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedBranches.map((b) => {
                  const bStaffCount = staff.filter((s) => s.assignedBranch === b.code).length;
                  const bWhCount = warehouses.filter((w) => w.branchId === b.code).length;
                  const isCurrentActive = branch === b.code;

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-navy">{b.name}</div>
                        <div className="text-xs text-secondary truncate max-w-[240px]">{b.address}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{b.id}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {b.code}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-navy">{b.city}</div>
                        <div className="text-xs text-secondary">{b.state}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-navy">{b.branchManager}</div>
                        <div className="text-xs text-secondary">{b.contactNumber}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 text-xs">
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <AppIcon name="customers" size={13} />
                            {bStaffCount} staff
                          </span>
                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <AppIcon name="building" size={13} />
                            {bWhCount} whs
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            b.operationalStatus === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : b.operationalStatus === 'under_expansion'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {b.operationalStatus.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {isCurrentActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange/10 text-orange border border-orange/20">
                            <AppIcon name="check" size={12} />
                            <span>Active Hub</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setBranch(b.code as BranchId)}
                            className="px-2.5 py-1 text-xs font-medium text-secondary hover:text-navy bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                            title={`Switch global LMS view to ${b.code}`}
                          >
                            Set Active
                          </button>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingBranch(b)}
                            className="p-1.5 text-secondary hover:text-navy hover:bg-slate-100 rounded-md transition-colors"
                            title="View Hub Details & Assets"
                          >
                            <AppIcon name="external-link" size={15} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(b)}
                            className="p-1.5 text-secondary hover:text-navy hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit Hub Details"
                          >
                            <AppIcon name="edit" size={15} />
                          </button>
                          <button
                            onClick={() => setDeletingBranchId(b.id)}
                            className="p-1.5 text-secondary hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Hub"
                          >
                            <AppIcon name="trash" size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredBranches.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-t border-border text-xs text-secondary">
            <div>
              Showing{' '}
              <span className="font-semibold text-navy">
                {Math.min(filteredBranches.length, (page - 1) * pageSize + 1)}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-navy">
                {Math.min(filteredBranches.length, page * pageSize)}
              </span>{' '}
              of <span className="font-semibold text-navy">{filteredBranches.length}</span> hubs
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 border border-border rounded bg-white text-secondary hover:text-navy disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <AppIcon name="chevron-left" size={14} />
              </button>
              <span className="px-2 font-medium text-navy">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 border border-border rounded bg-white text-secondary hover:text-navy disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <AppIcon name="chevron-right" size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT BRANCH */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-slate-50">
              <h2 className="text-lg font-bold text-navy">
                {editingBranch ? `Edit Hub: ${editingBranch.name}` : 'Provision New Regional Logistics Hub'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-secondary hover:text-navy p-1">
                <AppIcon name="x" size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Hub Facility Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name || ''}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                    placeholder="e.g. Bangalore Whitefield Consolidation Hub"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Station Code (Short Code) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.code || ''}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange font-mono uppercase"
                    placeholder="e.g. KA-BLR"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Operational Status</label>
                  <select
                    value={form.operationalStatus || 'active'}
                    onChange={(e) => setForm({ ...form, operationalStatus: e.target.value as BranchStatus })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                  >
                    {BRANCH_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st.replace('_', ' ').charAt(0).toUpperCase() + st.replace('_', ' ').slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city || ''}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                    placeholder="e.g. Bengaluru"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">State / Province</label>
                  <input
                    type="text"
                    value={form.state || ''}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                    placeholder="e.g. Karnataka"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Station Manager Name</label>
                  <input
                    type="text"
                    value={form.branchManager || ''}
                    onChange={(e) => setForm({ ...form, branchManager: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                    placeholder="e.g. K. S. Venkatesh"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={form.contactNumber || ''}
                    onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                    placeholder="+91 80 2841 0021"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={form.email || ''}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                    placeholder="blr.hub@veltrax.in"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Established Date</label>
                  <input
                    type="date"
                    value={form.establishedDate || ''}
                    onChange={(e) => setForm({ ...form, establishedDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-secondary mb-1">Physical Facility Address</label>
                  <textarea
                    rows={2}
                    value={form.address || ''}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                    placeholder="Plot 102, Logistics Park, Near Container Depot, Bangalore 560066"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-border text-secondary hover:text-navy hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange hover:bg-orange-hover text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  {editingBranch ? 'Update Hub Details' : 'Save Regional Hub'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW BRANCH PROFILE & ASSETS */}
      {viewingBranch && viewingBranchData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-navy">{viewingBranch.name}</h2>
                <div className="text-xs text-secondary font-mono">{viewingBranch.code} • {viewingBranch.id}</div>
              </div>
              <button onClick={() => setViewingBranch(null)} className="text-secondary hover:text-navy p-1">
                <AppIcon name="x" size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Station General Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-border text-xs">
                <div>
                  <span className="text-secondary block">Location</span>
                  <span className="font-semibold text-navy">{viewingBranch.city}, {viewingBranch.state}</span>
                </div>
                <div>
                  <span className="text-secondary block">Station Status</span>
                  <span className="font-semibold text-emerald-700 capitalize">
                    {viewingBranch.operationalStatus.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-secondary block">Station Manager</span>
                  <span className="font-semibold text-navy">{viewingBranch.branchManager}</span>
                </div>
                <div>
                  <span className="text-secondary block">Established Date</span>
                  <span className="font-mono text-navy">{viewingBranch.establishedDate}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-secondary block">Contact Phone & Email</span>
                  <span className="font-medium text-navy">{viewingBranch.contactNumber} • {viewingBranch.email}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-secondary block">Address</span>
                  <span className="font-medium text-navy">{viewingBranch.address}</span>
                </div>
              </div>

              {/* Station Warehouses */}
              <div>
                <h3 className="text-sm font-bold text-navy flex items-center gap-2 mb-2">
                  <AppIcon name="building" size={16} />
                  <span>Associated Warehouses ({viewingBranchData.assignedWh.length})</span>
                </h3>
                {viewingBranchData.assignedWh.length === 0 ? (
                  <p className="text-xs text-secondary bg-slate-50 p-3 rounded-lg border border-border">
                    No warehouse facilities allocated directly under this station code.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {viewingBranchData.assignedWh.map((wh) => (
                      <div key={wh.id} className="p-3 bg-slate-50 rounded-lg border border-border">
                        <div className="font-bold text-navy">{wh.name}</div>
                        <div className="text-secondary mt-0.5">{wh.address}</div>
                        <div className="mt-2 text-[11px] font-mono text-slate-600">
                          Capacity: {wh.totalCapacityCbm.toLocaleString()} m³ • {wh.dockCount} loading bays
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Station Staff */}
              <div>
                <h3 className="text-sm font-bold text-navy flex items-center gap-2 mb-2">
                  <AppIcon name="customers" size={16} />
                  <span>Station Personnel Roster ({viewingBranchData.assignedStaff.length})</span>
                </h3>
                {viewingBranchData.assignedStaff.length === 0 ? (
                  <p className="text-xs text-secondary bg-slate-50 p-3 rounded-lg border border-border">
                    No personnel currently assigned to this hub.
                  </p>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-border text-[11px] uppercase font-semibold text-secondary">
                        <tr>
                          <th className="p-2.5">Staff ID</th>
                          <th className="p-2.5">Name</th>
                          <th className="p-2.5">Role</th>
                          <th className="p-2.5">Department</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {viewingBranchData.assignedStaff.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-mono text-slate-500">{s.id}</td>
                            <td className="p-2.5 font-semibold text-navy">{s.fullName}</td>
                            <td className="p-2.5 text-slate-700">{s.designation}</td>
                            <td className="p-2.5 text-slate-600">{s.department}</td>
                            <td className="p-2.5 capitalize text-emerald-700 font-medium">
                              {s.employmentStatus.replace('_', ' ')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Station Corridors */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-border">
                  <span className="text-secondary block font-semibold">Origin Dispatch Throughput</span>
                  <span className="text-lg font-bold text-navy mt-1 block">
                    {viewingBranchData.originShipments.length} consignments
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-border">
                  <span className="text-secondary block font-semibold">Inbound Destination Turnaround</span>
                  <span className="text-lg font-bold text-navy mt-1 block">
                    {viewingBranchData.destShipments.length} consignments
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-slate-50">
              <button
                onClick={() => {
                  setBranch(viewingBranch.code as BranchId);
                  setViewingBranch(null);
                }}
                className="px-4 py-2 bg-orange hover:bg-orange-hover text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Set as Active Global Scope ({viewingBranch.code})
              </button>
              <button
                onClick={() => setViewingBranch(null)}
                className="px-4 py-2 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-navy-light transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION (BRANCH) */}
      {deletingBranchId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-50 border border-rose-200">
                <AppIcon name="alert" size={20} />
              </div>
              <h3 className="text-base font-bold text-navy">Decommission Regional Hub?</h3>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Are you sure you want to decommission branch station ID <strong className="text-navy">{deletingBranchId}</strong>?
              This will remove the facility from the active regional directory.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                onClick={() => setDeletingBranchId(null)}
                className="px-4 py-2 border border-border text-secondary hover:text-navy hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Yes, Decommission Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagementPage;
