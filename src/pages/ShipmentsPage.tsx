import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getStoredShipments } from '../data/mockShipments';
import type { Shipment, ShipmentStatus, ServiceMode } from '../types';
import { AppIcon } from '../components/common/AppIcon';
import { useEnterprise } from '../context/EnterpriseContext';
import { UpdateDelayModal } from '../components/tracking/UpdateDelayModal';

type SortField = 'date' | 'id' | 'weight' | 'status' | 'progress';
type SortOrder = 'asc' | 'desc';

export const ShipmentsPage: React.FC = () => {
  const { branch } = useEnterprise();
  const [shipments, setShipments] = useState<Shipment[]>(() => getStoredShipments());
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [activeMode, setActiveMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [delayModalShipment, setDelayModalShipment] = useState<Shipment | null>(null);
  const pageSize = 8;

  useEffect(() => {
    const handleUpdate = () => {
      setShipments(getStoredShipments());
    };
    window.addEventListener('freightline_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('freightline_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Filter shipments based on active hub
  const branchFiltered = useMemo(() => {
    return shipments.filter((s) => {
      if (branch === 'all') return true;
      const branchCode = branch.toLowerCase();
      return (
        s.originHubCode.toLowerCase().includes(branchCode) ||
        s.destinationHubCode.toLowerCase().includes(branchCode) ||
        s.originHub.toLowerCase().includes(branchCode) ||
        s.destinationHub.toLowerCase().includes(branchCode)
      );
    });
  }, [shipments, branch]);

  // Filter by status, mode, and search
  const filteredShipments = useMemo(() => {
    return branchFiltered.filter((s) => {
      if (activeStatus !== 'all' && s.status !== activeStatus) return false;
      if (activeMode !== 'all' && s.serviceMode !== activeMode) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = s.id.toLowerCase().includes(q);
        const matchBol = s.billOfLading.toLowerCase().includes(q);
        const matchOrigin = s.originHub.toLowerCase().includes(q) || s.originHubCode.toLowerCase().includes(q);
        const matchDest = s.destinationHub.toLowerCase().includes(q) || s.destinationHubCode.toLowerCase().includes(q);
        const matchSender = s.sender.name.toLowerCase().includes(q) || s.sender.company.toLowerCase().includes(q);
        const matchReceiver = s.receiver.name.toLowerCase().includes(q) || s.receiver.company.toLowerCase().includes(q);
        const matchCarrier = s.carrier?.toLowerCase().includes(q) || s.vesselOrFlight?.toLowerCase().includes(q);
        return matchId || matchBol || matchOrigin || matchDest || matchSender || matchReceiver || matchCarrier;
      }
      return true;
    });
  }, [branchFiltered, activeStatus, activeMode, searchQuery]);

  // Sort shipments
  const sortedShipments = useMemo(() => {
    return [...filteredShipments].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'id') {
        comparison = a.id.localeCompare(b.id);
      } else if (sortField === 'weight') {
        comparison = (a.cargo?.weightKg || 0) - (b.cargo?.weightKg || 0);
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else if (sortField === 'progress') {
        comparison = a.progressPercent - b.progressPercent;
      } else {
        // Default: date / dispatch time
        comparison = (b.dispatchedAt || '').localeCompare(a.dispatchedAt || '');
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredShipments, sortField, sortOrder]);

  // Paginated slice
  const totalPages = Math.ceil(sortedShipments.length / pageSize) || 1;
  const paginatedShipments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedShipments.slice(start, start + pageSize);
  }, [sortedShipments, currentPage, pageSize]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedShipments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedShipments.map(s => s.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'in-transit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
            In Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Delivered
          </span>
        );
      case 'delayed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Delayed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Pending
          </span>
        );
    }
  };

  const getModeInfo = (mode: ServiceMode) => {
    switch (mode) {
      case 'ocean_freight':
        return { label: 'Sea Freight', badge: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800', icon: 'ship' as const };
      case 'air_express':
        return { label: 'Air Cargo', badge: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800', icon: 'plane' as const };
      case 'intermodal_rail':
        return { label: 'Rail Intermodal', badge: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800', icon: 'train' as const };
      default:
        return { label: 'Road Freight', badge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', icon: 'truck' as const };
    }
  };

  const statusCounts = {
    all: branchFiltered.length,
    'in-transit': branchFiltered.filter((s) => s.status === 'in-transit').length,
    pending: branchFiltered.filter((s) => s.status === 'pending').length,
    delivered: branchFiltered.filter((s) => s.status === 'delivered').length,
    delayed: branchFiltered.filter((s) => s.status === 'delayed').length,
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white tracking-tight">
            Consignment Operations & Manifest
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enterprise consignment register with real-time multimodal carrier telemetry and dispatch status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/transport-assignment"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-saas-sm transition-colors"
          >
            <AppIcon name="transport" size={14} className="text-slate-500 dark:text-slate-400" />
            <span>Dispatch Desk</span>
          </Link>

          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-saas-sm transition-colors"
          >
            <AppIcon name="plus" size={14} />
            <span>New Consignment</span>
          </Link>
        </div>
      </div>

      {/* 2. Status Filter Tabs with Live Badges */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-700 pb-px scrollbar-none">
        {[
          { key: 'all', label: 'All Consignments', count: statusCounts.all },
          { key: 'in-transit', label: 'In Transit', count: statusCounts['in-transit'] },
          { key: 'pending', label: 'Pending Assignment', count: statusCounts.pending },
          { key: 'delayed', label: 'Exceptions / Delayed', count: statusCounts.delayed },
          { key: 'delivered', label: 'Delivered', count: statusCounts.delivered },
        ].map((tab) => {
          const isActive = activeStatus === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveStatus(tab.key);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[11px] ${
                  isActive
                    ? 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Search and Multimodal Filter Bar */}
      <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-saas-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <AppIcon
            name="search"
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search consignment ID, Bilty/LR, consignor, consignee, hub..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <AppIcon name="x" size={14} />
            </button>
          )}
        </div>

        {/* Multimodal Mode Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Mode:</span>
          {[
            { key: 'all', label: 'All Modes' },
            { key: 'heavy_haul', label: 'Road', icon: 'truck' as const },
            { key: 'intermodal_rail', label: 'Rail', icon: 'train' as const },
            { key: 'air_express', label: 'Air', icon: 'plane' as const },
            { key: 'ocean_freight', label: 'Ocean', icon: 'ship' as const },
          ].map((mode) => (
            <button
              key={mode.key}
              onClick={() => {
                setActiveMode(mode.key);
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeMode === mode.key
                  ? 'bg-slate-900 dark:bg-orange-500 text-white font-semibold shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {mode.icon && <AppIcon name={mode.icon} size={12} />}
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Bulk Action Bar (Visible when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-navy-900 text-white px-4 py-2.5 rounded-xl shadow-saas-md flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[10px]">
              {selectedIds.length}
            </span>
            <span>consignments selected for batch operations</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert(`Exporting manifest for ${selectedIds.length} consignments to CSV.`);
              }}
              className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
            >
              Export Manifest CSV
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-slate-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* 5. Enterprise Data Grid Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-700 shadow-saas-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={paginatedShipments.length > 0 && selectedIds.length === paginatedShipments.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-orange-600 focus:ring-orange-500"
                  />
                </th>
                <th
                  onClick={() => toggleSort('id')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Consignment / Bilty</span>
                    <AppIcon name="chevron-down" size={12} className={sortField === 'id' ? 'text-orange-500' : 'text-slate-300'} />
                  </div>
                </th>
                <th className="py-3 px-4">Transport Mode</th>
                <th className="py-3 px-4">Origin & Destination</th>
                <th className="py-3 px-4">Consignor / Consignee</th>
                <th
                  onClick={() => toggleSort('weight')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Cargo Specs</span>
                    <AppIcon name="chevron-down" size={12} className={sortField === 'weight' ? 'text-orange-500' : 'text-slate-300'} />
                  </div>
                </th>
                <th className="py-3 px-4">Carrier / Vehicle</th>
                <th
                  onClick={() => toggleSort('status')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <AppIcon name="chevron-down" size={12} className={sortField === 'status' ? 'text-orange-500' : 'text-slate-300'} />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('progress')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none text-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Progress</span>
                    <AppIcon name="chevron-down" size={12} className={sortField === 'progress' ? 'text-orange-500' : 'text-slate-300'} />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {paginatedShipments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                        <AppIcon name="shipments" size={20} />
                      </div>
                      <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm">No consignments found</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Try modifying your search or clearing active filters.
                      </div>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setActiveStatus('all');
                          setActiveMode('all');
                        }}
                        className="mt-2 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedShipments.map((s) => {
                  const modeInfo = getModeInfo(s.serviceMode);
                  const isSelected = selectedIds.includes(s.id);
                  const isPending = s.status === 'pending';

                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                        isSelected ? 'bg-orange-50/30 dark:bg-orange-950/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(s.id)}
                          className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-orange-600 focus:ring-orange-500"
                        />
                      </td>

                      {/* Consignment ID & Bilty */}
                      <td className="py-3 px-4">
                        <Link
                          to={`/manager/shipment/${s.id}`}
                          className="font-mono font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors block"
                        >
                          {s.id}
                        </Link>
                        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
                          {s.billOfLading}
                        </span>
                      </td>

                      {/* Mode Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${modeInfo.badge}`}
                        >
                          <AppIcon name={modeInfo.icon} size={13} />
                          <span>{modeInfo.label}</span>
                        </span>
                      </td>

                      {/* Origin & Destination */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
                          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 py-0.2 rounded">
                            {s.originHubCode}
                          </span>
                          <AppIcon name="arrow-right" size={11} className="text-slate-400 shrink-0" />
                          <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1 py-0.2 rounded font-semibold">
                            {s.destinationHubCode}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[180px] mt-0.5">
                          {s.originHub.split('(')[0]} → {s.destinationHub.split('(')[0]}
                        </div>
                      </td>

                      {/* Sender & Receiver */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                          {s.receiver.company || s.receiver.name}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[170px]">
                          From: {s.sender.company || s.sender.name}
                        </div>
                      </td>

                      {/* Cargo Specs */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {s.cargo.weightKg.toLocaleString()} kg
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[140px]">
                          {s.cargo.type}
                        </div>
                      </td>

                      {/* Carrier / Vehicle */}
                      <td className="py-3 px-4">
                        {isPending && !s.transportAssignment ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            Unallocated
                          </span>
                        ) : (
                          <div>
                            <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                              {s.carrier}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate max-w-[160px]">
                              {s.vesselOrFlight || 'Fleet Allocated'}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {getStatusBadge(s.status)}
                      </td>

                      {/* Progress */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-block w-16">
                          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono mb-0.5">
                            <span>{s.progressPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                s.status === 'delivered'
                                  ? 'bg-emerald-500'
                                  : s.status === 'delayed'
                                  ? 'bg-amber-500'
                                  : 'bg-orange-500'
                              }`}
                              style={{ width: `${s.progressPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Row Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending ? (
                            <Link
                              to={`/transport-assignment?shipmentId=${s.id}`}
                              className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-[11px] font-semibold transition-colors shadow-xs"
                              title="Assign vehicle / carrier"
                            >
                              Assign
                            </Link>
                          ) : (
                            <Link
                              to={`/tracking?id=${s.id}`}
                              className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40 dark:hover:text-sky-400 rounded transition-colors"
                              title="Live radar tracking"
                            >
                              <AppIcon name="tracking" size={14} />
                            </Link>
                          )}

                          <button
                            type="button"
                            onClick={() => setDelayModalShipment(s)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 dark:hover:text-amber-400 rounded transition-colors"
                            title="Record or update delay advisory"
                          >
                            <AppIcon
                              name="alert"
                              size={14}
                              className={s.status === 'delayed' || s.delayInfo ? "text-amber-600 dark:text-amber-400" : ""}
                            />
                          </button>

                          <Link
                            to={`/manager/shipment/${s.id}`}
                            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                            title="Inspect details & Bilty"
                          >
                            <AppIcon name="external-link" size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 6. Pagination Footer */}
        <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing <strong className="text-slate-700 dark:text-slate-200">{paginatedShipments.length}</strong> of{' '}
            <strong className="text-slate-700 dark:text-slate-200">{sortedShipments.length}</strong> consignments
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium flex items-center gap-1"
            >
              <AppIcon name="chevron-left" size={12} />
              <span>Previous</span>
            </button>

            <span className="font-mono text-xs px-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium flex items-center gap-1"
            >
              <span>Next</span>
              <AppIcon name="chevron-right" size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Manager Delay Update Modal */}
      {delayModalShipment && (
        <UpdateDelayModal
          isOpen={!!delayModalShipment}
          onClose={() => setDelayModalShipment(null)}
          shipment={delayModalShipment}
          onSuccess={() => {
            setShipments(getStoredShipments());
            setDelayModalShipment(null);
          }}
        />
      )}
    </div>
  );
};
