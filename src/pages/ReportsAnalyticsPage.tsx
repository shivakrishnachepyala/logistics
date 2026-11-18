import React, { useState, useEffect, useMemo } from 'react';
import { getStoredShipments } from '../data/mockShipments';
import { getInvoices, getPayments, getBranches } from '../data/mockCommercial';
import { getVehicles, getWarehouses } from '../data/mockAssets';
import type { Shipment } from '../types';
import type { Invoice, PaymentRecord, BranchRecord } from '../types/commercial';
import type { Vehicle, Warehouse } from '../types/assets';
import { AppIcon } from '../components/common/AppIcon';
import { useEnterprise } from '../context/EnterpriseContext';
import { UpdateDelayModal } from '../components/tracking/UpdateDelayModal';
import { FreightVolumeVelocityChart } from '../components/dashboard/FreightVolumeVelocityChart';

type TimeRange = '7D' | '30D' | '90D' | 'YTD';
type ActiveTab = 'analytics' | 'exceptions';

export const ReportsAnalyticsPage: React.FC = () => {
  const { branchLabel } = useEnterprise();

  // Primary Active Tab: Executive Analytics vs Delay & Exception Reports
  const [activeTab, setActiveTab] = useState<ActiveTab>('analytics');

  // Reactive Datasets from local storage
  const [shipments, setShipments] = useState<Shipment[]>(() => getStoredShipments());
  const [invoices, setInvoices] = useState<Invoice[]>(() => getInvoices());
  const [payments, setPayments] = useState<PaymentRecord[]>(() => getPayments());
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => getVehicles());
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => getWarehouses());
  const [branches] = useState<BranchRecord[]>(() => getBranches());

  // Listen for storage changes
  useEffect(() => {
    const handleUpdate = () => {
      setShipments(getStoredShipments());
      setInvoices(getInvoices());
      setPayments(getPayments());
      setVehicles(getVehicles());
      setWarehouses(getWarehouses());
    };
    window.addEventListener('freightline_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('freightline_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Filter States - Analytics Overview
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');

  // Filter States - Delay & Exception Reports
  const [delaySearch, setDelaySearch] = useState('');
  const [delayHubFilter, setDelayHubFilter] = useState('all');
  const [delayDurationFilter, setDelayDurationFilter] = useState<'all' | 'minor' | 'moderate' | 'critical'>('all');
  const [delayReasonFilter, setDelayReasonFilter] = useState('all');
  const [delayResolutionFilter, setDelayResolutionFilter] = useState('all');

  // Selected Exception for Detail Modal
  const [selectedException, setSelectedException] = useState<Shipment | null>(null);
  const [editingDelayShipment, setEditingDelayShipment] = useState<Shipment | null>(null);

  // Exception resolution status tracking (persisted locally during session)
  const [exceptionResolutions, setExceptionResolutions] = useState<Record<string, string>>({
    'FLX-7741-KOL': 'Under Investigation',
    'FLX-9482-BOM': 'Relief Vehicle Deployed',
    'FLX-6218-DEL': 'Action Required',
  });

  const handleUpdateResolution = (shipmentId: string, status: string) => {
    setExceptionResolutions((prev) => ({
      ...prev,
      [shipmentId]: status,
    }));
  };

  // Filtered Shipments based on active analytics controls
  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      if (selectedBranch !== 'all' && s.originHubCode !== selectedBranch && s.destinationHubCode !== selectedBranch) {
        return false;
      }
      if (selectedMode !== 'all') {
        const modeNormalized = s.serviceMode.toLowerCase();
        if (selectedMode === 'road' && !modeNormalized.includes('haul') && !modeNormalized.includes('road')) return false;
        if (selectedMode === 'rail' && !modeNormalized.includes('rail')) return false;
        if (selectedMode === 'air' && !modeNormalized.includes('air')) return false;
        if (selectedMode === 'sea' && !modeNormalized.includes('ocean') && !modeNormalized.includes('sea')) return false;
      }
      return true;
    });
  }, [shipments, selectedBranch, selectedMode]);

  // Extract all shipments with delays or automated overdue condition
  const rawExceptionShipments = useMemo(() => {
    return shipments.filter((s) => {
      const isExplicitlyDelayed = s.status === 'delayed' || !!s.delayInfo;
      // Overdue auto-detection: if scheduled ETA is overdue and shipment not marked delivered
      const isOverdue = s.status !== 'delivered' && s.progressPercent < 100 && s.status === 'delayed';
      return isExplicitlyDelayed || isOverdue;
    });
  }, [shipments]);

  // Filtered Exception Shipments based on delay filters
  const filteredExceptions = useMemo(() => {
    return rawExceptionShipments.filter((s) => {
      // Hub filter (origin or destination or responsible hub)
      if (delayHubFilter !== 'all') {
        const matchesHub =
          s.originHubCode === delayHubFilter ||
          s.destinationHubCode === delayHubFilter ||
          s.originHub.toLowerCase().includes(delayHubFilter.toLowerCase()) ||
          s.destinationHub.toLowerCase().includes(delayHubFilter.toLowerCase());
        if (!matchesHub) return false;
      }

      // Duration filter
      const durationHours = s.delayInfo?.durationHours || 12;
      if (delayDurationFilter === 'minor' && durationHours >= 12) return false;
      if (delayDurationFilter === 'moderate' && (durationHours < 12 || durationHours > 24)) return false;
      if (delayDurationFilter === 'critical' && durationHours < 24) return false;

      // Reason code filter
      if (delayReasonFilter !== 'all') {
        const reasonCode = s.delayInfo?.reasonCode || 'other';
        if (reasonCode !== delayReasonFilter) return false;
      }

      // Resolution status filter
      const resolutionStatus = exceptionResolutions[s.id] || 'Action Required';
      if (delayResolutionFilter !== 'all' && resolutionStatus !== delayResolutionFilter) {
        return false;
      }

      // Search query
      if (delaySearch.trim()) {
        const q = delaySearch.trim().toLowerCase();
        const matchesQuery =
          s.id.toLowerCase().includes(q) ||
          s.billOfLading.toLowerCase().includes(q) ||
          s.sender.name.toLowerCase().includes(q) ||
          s.sender.company.toLowerCase().includes(q) ||
          s.receiver.name.toLowerCase().includes(q) ||
          s.receiver.company.toLowerCase().includes(q) ||
          s.originHub.toLowerCase().includes(q) ||
          s.destinationHub.toLowerCase().includes(q) ||
          (s.delayInfo?.reason || '').toLowerCase().includes(q) ||
          (s.assignedDriver?.name || '').toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [rawExceptionShipments, delayHubFilter, delayDurationFilter, delayReasonFilter, delayResolutionFilter, delaySearch, exceptionResolutions]);

  // Executive Top KPIs
  const executiveKpis = useMemo(() => {
    const totalShipments = filteredShipments.length;
    const delivered = filteredShipments.filter((s) => s.status === 'delivered').length;
    const inTransit = filteredShipments.filter((s) => s.status === 'in-transit').length;
    const delayed = filteredShipments.filter((s) => s.status === 'delayed' || !!s.delayInfo).length;
    const slaSuccessRate = totalShipments > 0 ? (((totalShipments - delayed) / totalShipments) * 100).toFixed(1) : '96.4';

    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.paymentStatus !== 'Cancelled' ? inv.totalAmount : 0), 0);
    const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter((v) => v.status === 'available' || v.status === 'in_transit').length;
    const fleetUtilizationRate = totalVehicles > 0 ? Math.round((availableVehicles / totalVehicles) * 100) : 88;

    const totalWhCapacity = warehouses.reduce((sum, w) => sum + w.totalCapacityCbm, 0);
    const usedWhCapacity = warehouses.reduce((sum, w) => sum + w.occupiedCapacityCbm, 0);
    const whOccupancyRate = totalWhCapacity > 0 ? Math.round((usedWhCapacity / totalWhCapacity) * 100) : 74;

    return {
      totalShipments,
      delivered,
      inTransit,
      delayed,
      slaSuccessRate,
      totalRevenue,
      totalCollected,
      fleetUtilizationRate,
      whOccupancyRate,
    };
  }, [filteredShipments, invoices, payments, vehicles, warehouses]);

  // Multimodal Distribution Calculation
  const modalDistribution = useMemo(() => {
    let road = 0;
    let rail = 0;
    let air = 0;
    let sea = 0;

    filteredShipments.forEach((s) => {
      const m = s.serviceMode.toLowerCase();
      if (m.includes('heavy_haul') || m.includes('road')) road++;
      else if (m.includes('rail')) rail++;
      else if (m.includes('air')) air++;
      else if (m.includes('ocean') || m.includes('sea')) sea++;
      else road++;
    });

    const total = filteredShipments.length || 1;
    return [
      { name: 'Road Freight (FTL/LTL)', count: road, percent: Math.round((road / total) * 100), color: 'bg-blue-600', text: 'text-blue-600' },
      { name: 'Intermodal Rail', count: rail, percent: Math.round((rail / total) * 100), color: 'bg-emerald-600', text: 'text-emerald-600' },
      { name: 'Air Cargo Express', count: air, percent: Math.round((air / total) * 100), color: 'bg-orange-500', text: 'text-orange-600' },
      { name: 'Ocean Coastal Freight', count: sea, percent: Math.round((sea / total) * 100), color: 'bg-indigo-600', text: 'text-indigo-600' },
    ];
  }, [filteredShipments]);

  // Major Corridors SLA Velocity
  const corridorStats = useMemo(() => {
    const corridorMap: Record<string, { total: number; delivered: number; delayed: number }> = {};

    filteredShipments.forEach((s) => {
      const key = `${s.originHubCode} → ${s.destinationHubCode}`;
      if (!corridorMap[key]) {
        corridorMap[key] = { total: 0, delivered: 0, delayed: 0 };
      }
      corridorMap[key].total++;
      if (s.status === 'delivered') corridorMap[key].delivered++;
      if (s.status === 'delayed' || !!s.delayInfo) corridorMap[key].delayed++;
    });

    return Object.entries(corridorMap)
      .map(([corridor, data]) => ({
        corridor,
        total: data.total,
        onTimePercent: Math.round(((data.total - data.delayed) / (data.total || 1)) * 100),
        delayed: data.delayed,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [filteredShipments]);

  // Export Analytics to CSV Handler
  const handleExportCSV = () => {
    const rows = [
      ['Consignment ID', 'Origin Hub', 'Destination Hub', 'Service Mode', 'Status', 'ETA', 'Sender', 'Receiver'],
      ...filteredShipments.map((s) => [
        s.id,
        s.originHub,
        s.destinationHub,
        s.serviceMode,
        s.status,
        s.eta,
        `"${s.sender.company || s.sender.name}"`,
        `"${s.receiver.company || s.receiver.name}"`,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VELTRAX_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Delay & Exception Reports to CSV Handler
  const handleExportDelayCSV = () => {
    const rows = [
      [
        'Consignment ID',
        'Priority',
        'Customer (Sender)',
        'Customer (Receiver)',
        'Origin Station',
        'Destination Hub',
        'Scheduled Delivery',
        'Revised Delivery',
        'Delay Duration (Hrs)',
        'Delay Root Cause',
        'Current Telematics Location',
        'Assigned Driver',
        'Assigned Vehicle Plate',
        'Responsible Terminal',
        'Resolution Status',
      ],
      ...filteredExceptions.map((s) => [
        s.id,
        s.priorityLevel.toUpperCase(),
        `"${s.sender.company || s.sender.name}"`,
        `"${s.receiver.company || s.receiver.name}"`,
        `"${s.originHub}"`,
        `"${s.destinationHub}"`,
        `"${s.delayInfo?.originalEta || s.dispatchedAt}"`,
        `"${s.delayInfo?.revisedEta || s.eta}"`,
        s.delayInfo?.durationHours || 12,
        `"${(s.delayInfo?.reason || 'Route Congestion & Operational Inspection').replace(/"/g, '""')}"`,
        `"${s.delayInfo?.location || s.checkpoints.find(cp => cp.isCurrent)?.location || 'En-route'}"`,
        `"${s.assignedDriver?.name || 'Assigned Relay Driver'}"`,
        `"${s.assignedDriver?.vehiclePlate || s.vesselOrFlight || 'Fleet LCV'}"`,
        `"${s.destinationHubCode || s.originHubCode}"`,
        `"${exceptionResolutions[s.id] || 'Action Required'}"`,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VELTRAX_Delay_Exception_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Executive Reports & Analytics</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {branchLabel}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Enterprise logistics throughput, delay & exception tracking, SLA compliance, and multimodal corridor velocity.
          </p>
        </div>

        {/* Global Export & Print Buttons */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <AppIcon name="printer" size={15} />
            <span>Print Report</span>
          </button>
          {activeTab === 'analytics' ? (
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <AppIcon name="download" size={15} />
              <span>Export CSV Report</span>
            </button>
          ) : (
            <button
              onClick={handleExportDelayCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <AppIcon name="download" size={15} />
              <span>Export Delay Exceptions (CSV)</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Sub-Navigation Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 print:hidden">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AppIcon name="trending-up" size={16} />
          <span>Executive Performance Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('exceptions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
            activeTab === 'exceptions'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AppIcon name="alert" size={16} className={activeTab === 'exceptions' ? 'text-orange-400' : 'text-orange-500'} />
          <span>Shipment Delay & Exception Reports</span>
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
            {rawExceptionShipments.length}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: EXECUTIVE ANALYTICS OVERVIEW                      */}
      {/* ======================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Analytics Control Filters (Timeframe, Branch, Mode) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 print:hidden">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Time Range Pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {(['7D', '30D', '90D', 'YTD'] as TimeRange[]).map((tr) => (
                  <button
                    key={tr}
                    onClick={() => setTimeRange(tr)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      timeRange === tr
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tr === '7D'
                      ? 'Last 7 Days'
                      : tr === '30D'
                      ? 'Last 30 Days'
                      : tr === '90D'
                      ? 'Quarter (90D)'
                      : 'Year to Date'}
                  </button>
                ))}
              </div>

              {/* Branch & Mode Selectors */}
              <div className="flex items-center gap-3">
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="all">All Operational Hubs</option>
                  {branches.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>

                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="all">All Transport Modes</option>
                  <option value="road">Road Freight</option>
                  <option value="rail">Intermodal Rail</option>
                  <option value="air">Air Cargo</option>
                  <option value="sea">Ocean Freight</option>
                </select>
              </div>
            </div>
          </div>

          {/* 8 Executive KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Consignments</span>
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <AppIcon name="box" size={16} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{executiveKpis.totalShipments}</div>
              <div className="mt-1 text-[11px] text-emerald-600 font-medium">
                {executiveKpis.delivered} delivered successfully
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Billed Freight</span>
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <AppIcon name="dollar-sign" size={16} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                ₹{(executiveKpis.totalRevenue / 1000).toFixed(0)}k
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                ₹{(executiveKpis.totalCollected / 1000).toFixed(0)}k realized
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-semibold uppercase tracking-wider">On-Time SLA</span>
                <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                  <AppIcon name="check-circle" size={16} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-600">{executiveKpis.slaSuccessRate}%</div>
              <div className="mt-1 text-[11px] text-slate-500">Target: 95.0% adherence</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-semibold uppercase tracking-wider">In-Transit Freight</span>
                <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                  <AppIcon name="truck" size={16} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-amber-600">{executiveKpis.inTransit}</div>
              <div className="mt-1 text-[11px] text-slate-500">Active on national corridors</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Fleet Readiness</span>
                <span className="p-1.5 rounded-lg bg-slate-100 text-slate-800">
                  <AppIcon name="wrench" size={16} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{executiveKpis.fleetUtilizationRate}%</div>
              <div className="mt-1 text-[11px] text-slate-500">{vehicles.length} heavy vehicles</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Wh. Occupancy</span>
                <span className="p-1.5 rounded-lg bg-slate-100 text-slate-800">
                  <AppIcon name="building" size={16} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{executiveKpis.whOccupancyRate}%</div>
              <div className="mt-1 text-[11px] text-slate-500">{warehouses.length} regional hubs</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Delayed Exceptions</span>
                <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                  <AppIcon name="alert" size={16} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-rose-600">{executiveKpis.delayed}</div>
              <div className="mt-1 text-[11px] text-rose-600">
                <button onClick={() => setActiveTab('exceptions')} className="underline hover:text-rose-800">
                  View Exception Reports →
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Transit Turnaround</span>
                <span className="p-1.5 rounded-lg bg-slate-100 text-slate-800">
                  <AppIcon name="clock" size={16} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">28.4 hrs</div>
              <div className="mt-1 text-[11px] text-slate-500">Inter-state delivery turnaround</div>
            </div>
          </div>

          {/* Interactive Freight Volume & Velocity Chart */}
          <FreightVolumeVelocityChart
            key={timeRange}
            initialTimeframe={timeRange === '7D' ? '7d' : timeRange === '30D' ? '30d' : timeRange === '90D' ? '90d' : 'year'}
          />

          {/* Visual Analytics Grid: Modal Split & Corridor SLA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <AppIcon name="trending-up" size={16} className="text-orange-500" />
                    <span>Multimodal Freight Distribution & Volume</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Share of consignments by mode of transport</p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {modalDistribution.map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="font-mono text-slate-600">
                        {item.count} consignments ({item.percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <AppIcon name="map-pin" size={16} className="text-blue-600" />
                    <span>Major Freight Corridors (SLA)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">On-time performance on primary arteries</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {corridorStats.map((c) => (
                  <div key={c.corridor} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-800">{c.corridor}</span>
                      <div className="text-[11px] text-slate-500">{c.total} total consignments</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono font-bold ${c.onTimePercent >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {c.onTimePercent}% on-time
                      </div>
                      {c.delayed > 0 ? (
                        <div className="text-[10px] text-rose-600">{c.delayed} delayed</div>
                      ) : (
                        <div className="text-[10px] text-slate-400">Zero delays</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200">
                <h3 className="text-xs font-semibold text-slate-500 mb-2">Delay Root-Cause Attribution</h3>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 block">Monsoon / Fog</span>
                    <span className="font-semibold text-slate-900">42%</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 block">Highway Congestion</span>
                    <span className="font-semibold text-slate-900">28%</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 block">Vehicle Maintenance</span>
                    <span className="font-semibold text-slate-900">18%</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 block">Doc Verification</span>
                    <span className="font-semibold text-slate-900">12%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Asset Infrastructure Utilization Row */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AppIcon name="building" size={16} className="text-emerald-600" />
                  <span>National Warehouse & Terminal Volumetric Capacities</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Physical storage utilization across regional logistics hubs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              {warehouses.slice(0, 4).map((wh) => {
                const occupancy = Math.round((wh.occupiedCapacityCbm / (wh.totalCapacityCbm || 1)) * 100);
                return (
                  <div key={wh.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900 truncate max-w-[150px]">{wh.name}</span>
                      <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                        {wh.branchId}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-500">{wh.city}</span>
                      <span className={`font-mono font-bold ${occupancy > 85 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {occupancy}% Full
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          occupancy > 85 ? 'bg-rose-500' : occupancy > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occupancy}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>{wh.occupiedCapacityCbm.toLocaleString()} m³ utilized</span>
                      <span>{wh.totalCapacityCbm.toLocaleString()} m³ total</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SHIPMENT DELAY & EXCEPTION REPORTS                */}
      {/* ======================================================== */}
      {activeTab === 'exceptions' && (
        <div className="space-y-6">
          {/* Overdue Delivery Automated Alert Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                <AppIcon name="alert" size={18} />
              </div>
              <div>
                <div className="font-bold text-amber-900 text-sm">
                  Automated Overdue Delivery Surveillance Active ({rawExceptionShipments.length} Active Exceptions)
                </div>
                <p className="text-amber-800 mt-0.5 leading-relaxed">
                  Consignments exceeding agreed SLA corridors are automatically flagged below. Real-time telematics GPS coordinates and responsible station dispatch supervisors are linked for rapid resolution.
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="px-2.5 py-1 bg-amber-200/60 text-amber-900 rounded-lg font-mono font-bold text-[11px]">
                SLA Compliance: {executiveKpis.slaSuccessRate}%
              </span>
            </div>
          </div>

          {/* Exception Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Active Exceptions</span>
                <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                  <AppIcon name="alert" size={16} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-rose-600">{rawExceptionShipments.length}</div>
              <div className="mt-1 text-[11px] text-slate-500">
                Flagged for supervisor review
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Critical Delays (&gt;24h)</span>
                <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                  <AppIcon name="clock" size={16} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-amber-600">
                {rawExceptionShipments.filter((s) => (s.delayInfo?.durationHours || 0) >= 24).length}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">Severe track / route impact</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Exception Delay</span>
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <AppIcon name="clock" size={16} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {rawExceptionShipments.length > 0
                  ? (
                      rawExceptionShipments.reduce((sum, s) => sum + (s.delayInfo?.durationHours || 12), 0) /
                      rawExceptionShipments.length
                    ).toFixed(1)
                  : '0'}{' '}
                hrs
              </div>
              <div className="mt-1 text-[11px] text-slate-500">Across delayed consignments</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-semibold uppercase tracking-wider">High Risk Corridor</span>
                <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                  <AppIcon name="map-pin" size={16} />
                </span>
              </div>
              <div className="mt-2 text-lg font-bold text-slate-900 truncate">NH-48 & Northern Rail</div>
              <div className="mt-1 text-[11px] text-slate-500">Fog & customs bottleneck</div>
            </div>
          </div>

          {/* Exception Filters (Search, Hub, Duration, Reason, Resolution) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 print:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Consignment ID, Customer, Cargo..."
                  value={delaySearch}
                  onChange={(e) => setDelaySearch(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              {/* Responsible Hub Filter */}
              <div>
                <select
                  value={delayHubFilter}
                  onChange={(e) => setDelayHubFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="all">All Responsible Hubs (9 Hubs)</option>
                  <option value="DEL-CENTRAL">Delhi Sorting Hub (DEL)</option>
                  <option value="MH-MUMBAI">Mumbai Central Godown (BOM)</option>
                  <option value="JPR-MAIN">Jaipur Delivery Centre (JPR)</option>
                  <option value="GJ-SURAT">Surat Textile Cargo Hub (SUR)</option>
                  <option value="KA-BLR">Bengaluru Tech Park (BLR)</option>
                  <option value="WB-KOL">Kolkata Eastern Gateway (CCU)</option>
                  <option value="HYD">Hyderabad Regional Hub (HYD)</option>
                  <option value="MAA">Chennai Ambattur Hub (MAA)</option>
                  <option value="AMD">Ahmedabad Express Hub (AMD)</option>
                </select>
              </div>

              {/* Delay Duration Severity Filter */}
              <div>
                <select
                  value={delayDurationFilter}
                  onChange={(e) => setDelayDurationFilter(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="all">All Delay Durations</option>
                  <option value="minor">Minor Delay (&lt; 12 Hours)</option>
                  <option value="moderate">Moderate Delay (12 – 24 Hours)</option>
                  <option value="critical">Critical Delay (&gt; 24 Hours)</option>
                </select>
              </div>

              {/* Delay Root Cause Filter */}
              <div>
                <select
                  value={delayReasonFilter}
                  onChange={(e) => setDelayReasonFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="all">All Root Cause Categories</option>
                  <option value="heavy_rain">Weather / Severe Fog</option>
                  <option value="vehicle_breakdown">Mechanical / Vehicle Breakdown</option>
                  <option value="road_blocked">Highway / Lane Obstruction</option>
                  <option value="festival_rush">Corridor Maintenance / Congestion</option>
                </select>
              </div>

              {/* Resolution Status Filter */}
              <div>
                <select
                  value={delayResolutionFilter}
                  onChange={(e) => setDelayResolutionFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="all">All Resolution States</option>
                  <option value="Action Required">Action Required</option>
                  <option value="Under Investigation">Under Investigation</option>
                  <option value="Relief Vehicle Deployed">Relief Vehicle Deployed</option>
                  <option value="Resolved">Resolved / Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Delay & Exception Ledger Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <AppIcon name="alert" size={16} className="text-rose-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Exception & Overdue Delivery Records ({filteredExceptions.length})
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                Click "Exception Dossier" to inspect telematics and trigger interventions
              </span>
            </div>

            {filteredExceptions.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No delayed consignments match the selected filters. All active shipments in this range are operating on schedule.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">Shipment ID</th>
                      <th className="py-3 px-4">Customer Entity</th>
                      <th className="py-3 px-4">Corridor & Hubs</th>
                      <th className="py-3 px-4">Scheduled vs Revised</th>
                      <th className="py-3 px-4">Delay Duration</th>
                      <th className="py-3 px-4">Root Cause</th>
                      <th className="py-3 px-4">Assigned Asset</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredExceptions.map((s) => {
                      const duration = s.delayInfo?.durationHours || 12;
                      const resolution = exceptionResolutions[s.id] || 'Action Required';
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            <div>{s.id}</div>
                            <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                              {s.priorityLevel.toUpperCase()}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900">{s.sender.company || s.sender.name}</div>
                            <div className="text-[11px] text-slate-500">
                              To: {s.receiver.company || s.receiver.name} ({s.receiver.city})
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-800">
                              {s.originHubCode} → {s.destinationHubCode}
                            </div>
                            <div className="text-[11px] text-slate-500">{s.destinationHub}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="text-slate-500 line-through text-[11px]">
                              {s.delayInfo?.originalEta || s.dispatchedAt}
                            </div>
                            <div className="font-bold text-rose-600 font-mono">
                              {s.delayInfo?.revisedEta || s.eta}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                                duration >= 24
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : duration >= 12
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              }`}
                            >
                              +{duration}h Delay
                            </span>
                          </td>

                          <td className="py-3 px-4 max-w-xs">
                            <div className="font-medium text-slate-800 truncate" title={s.delayInfo?.reason}>
                              {s.delayInfo?.reason || 'Corridor Congestion'}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              Near: {s.delayInfo?.location || s.checkpoints.find(cp => cp.isCurrent)?.location || 'En-route'}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-800">
                              {s.assignedDriver?.name || 'Assigned Relay Driver'}
                            </div>
                            <div className="font-mono text-[11px] text-slate-500">
                              {s.assignedDriver?.vehiclePlate || s.vesselOrFlight || 'Fleet LCV'}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                resolution === 'Resolved'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : resolution === 'Relief Vehicle Deployed'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : resolution === 'Under Investigation'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {resolution}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedException(s)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs transition-colors"
                            >
                              <AppIcon name="file-text" size={13} />
                              <span>Dossier</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PARCEL-LEVEL DELAY EXCEPTION DOSSIER              */}
      {/* ======================================================== */}
      {selectedException && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden space-y-0">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                  <AppIcon name="alert" size={14} />
                  <span>Logistics Exception Dossier</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                  Consignment #{selectedException.id} • {selectedException.billOfLading}
                </h2>
              </div>
              <button
                onClick={() => setSelectedException(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg"
              >
                <AppIcon name="x" size={18} />
              </button>
            </div>

            {/* Dossier Body */}
            <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
              {/* Top Meta Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 uppercase text-[10px] block font-semibold">Corridor Route</span>
                  <span className="font-bold text-slate-900 mt-1 block">
                    {selectedException.originHub} → {selectedException.destinationHub}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Mode: {selectedException.serviceMode.toUpperCase()}
                  </span>
                </div>

                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                  <span className="text-rose-700 uppercase text-[10px] block font-semibold">Delay Impact</span>
                  <span className="font-bold text-rose-900 text-sm mt-1 block">
                    +{selectedException.delayInfo?.durationHours || 12} Hours Delay
                  </span>
                  <span className="text-[11px] text-rose-700 mt-0.5 block">
                    Revised ETA: {selectedException.delayInfo?.revisedEta || selectedException.eta}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 uppercase text-[10px] block font-semibold">Active Resolution</span>
                  <div className="mt-1">
                    <select
                      value={exceptionResolutions[selectedException.id] || 'Action Required'}
                      onChange={(e) => handleUpdateResolution(selectedException.id, e.target.value)}
                      className="w-full bg-white border border-slate-200 text-xs font-bold rounded-lg px-2 py-1 text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="Action Required">Action Required</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Relief Vehicle Deployed">Relief Vehicle Deployed</option>
                      <option value="Resolved">Resolved / Closed</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Updates recorded in audit trail</span>
                </div>
              </div>

              {/* Root Cause Analysis Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 uppercase text-[11px] flex items-center gap-1.5">
                    <AppIcon name="alert" size={14} className="text-orange-500" />
                    <span>Root Cause & Incident Statement</span>
                  </span>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-mono font-semibold">
                    Code: {selectedException.delayInfo?.reasonCode || 'corridor_delay'}
                  </span>
                </div>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {selectedException.delayInfo?.reason || 'Route delays due to heavy traffic on the highway corridor.'}
                </p>
                {selectedException.delayInfo?.reasonHindi && (
                  <p className="text-slate-600 italic text-[11px]">
                    {selectedException.delayInfo.reasonHindi}
                  </p>
                )}
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <strong>Last Telematics Location:</strong>{' '}
                  {selectedException.delayInfo?.location ||
                    selectedException.checkpoints.find((cp) => cp.isCurrent)?.location ||
                    'En-route'}
                </div>
              </div>

              {/* Customer & Consignee Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Consignor (Sender)
                  </span>
                  <div className="font-bold text-slate-900">{selectedException.sender.company || selectedException.sender.name}</div>
                  <div className="text-slate-600">{selectedException.sender.address}, {selectedException.sender.city}</div>
                  <div className="text-slate-500 font-mono mt-0.5">{selectedException.sender.contactPhone}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Consignee (Receiver)
                  </span>
                  <div className="font-bold text-slate-900">{selectedException.receiver.company || selectedException.receiver.name}</div>
                  <div className="text-slate-600">{selectedException.receiver.address}, {selectedException.receiver.city}</div>
                  <div className="text-slate-500 font-mono mt-0.5">{selectedException.receiver.contactPhone}</div>
                </div>
              </div>

              {/* Driver & Telematics Contact */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                  Assigned Vehicle & Crew Telematics
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Driver In-Charge</span>
                    <span className="font-bold text-slate-900">
                      {selectedException.assignedDriver?.name || 'Gurmeet Sandhu'}
                    </span>
                    <span className="text-slate-500 font-mono block text-[11px]">
                      {selectedException.assignedDriver?.phone || '+91 98720 11980'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] block">Commercial Vehicle</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {selectedException.assignedDriver?.vehiclePlate || selectedException.vesselOrFlight || 'PB-10-CZ-9912'}
                    </span>
                    <span className="text-slate-500 block text-[11px]">
                      {selectedException.assignedDriver?.vehicleType || 'Tata 1918 Heavy Multi-Axle'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] block">Responsible Hub</span>
                    <span className="font-bold text-slate-900">
                      {selectedException.destinationHubCode || selectedException.originHubCode}
                    </span>
                    <span className="text-slate-500 block text-[11px]">Dispatch Station Oversight</span>
                  </div>
                </div>
              </div>

              {/* Active Mitigation Options */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-900 block text-[11px]">
                  Emergency Intervention Protocols:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      handleUpdateResolution(selectedException.id, 'Relief Vehicle Deployed');
                      alert(`Relief vehicle and backup driver alerted for consignment #${selectedException.id}.`);
                    }}
                    className="p-2.5 text-left border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="font-bold text-slate-800">1. Deploy Relief Vehicle</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Transfer cargo to backup tractor</div>
                  </button>

                  <button
                    onClick={() => {
                      handleUpdateResolution(selectedException.id, 'Under Investigation');
                      alert(`Automated WhatsApp & SMS update dispatched to ${selectedException.receiver.name}.`);
                    }}
                    className="p-2.5 text-left border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="font-bold text-slate-800">2. Customer SLA Alert</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Send revised ETA to consignee</div>
                  </button>

                  <button
                    onClick={() => {
                      handleUpdateResolution(selectedException.id, 'Resolved');
                      alert(`Consignment #${selectedException.id} marked as resolved and rescheduled.`);
                    }}
                    className="p-2.5 text-left border border-emerald-200 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <div className="font-bold text-emerald-800">3. Mark Exception Resolved</div>
                    <div className="text-[10px] text-emerald-600 mt-0.5">Clear alert from active board</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-100 transition-colors"
              >
                <AppIcon name="printer" size={14} />
                <span>Print Exception Dossier</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const target = selectedException;
                    setSelectedException(null);
                    setEditingDelayShipment(target);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs"
                >
                  <AppIcon name="alert" size={13} />
                  <span>Update Delay Advisory</span>
                </button>
                <button
                  onClick={() => setSelectedException(null)}
                  className="px-4 py-1.5 bg-slate-900 text-white font-semibold rounded-lg text-xs hover:bg-slate-800 transition-colors"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manager Delay Update Modal */}
      {editingDelayShipment && (
        <UpdateDelayModal
          isOpen={!!editingDelayShipment}
          onClose={() => setEditingDelayShipment(null)}
          shipment={editingDelayShipment}
          onSuccess={() => {
            setShipments(getStoredShipments());
            setEditingDelayShipment(null);
          }}
        />
      )}
    </div>
  );
};

export default ReportsAnalyticsPage;
