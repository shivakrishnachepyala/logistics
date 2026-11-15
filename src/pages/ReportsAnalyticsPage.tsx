import React, { useState, useEffect, useMemo } from 'react';
import { getStoredShipments } from '../data/mockShipments';
import { getInvoices, getPayments, getBranches } from '../data/mockCommercial';
import { getVehicles, getWarehouses } from '../data/mockAssets';
import type { Shipment } from '../types';
import type { Invoice, PaymentRecord, BranchRecord } from '../types/commercial';
import type { Vehicle, Warehouse } from '../types/assets';
import { AppIcon } from '../components/common/AppIcon';
import { useEnterprise } from '../context/EnterpriseContext';

type TimeRange = '7D' | '30D' | '90D' | 'YTD';

export const ReportsAnalyticsPage: React.FC = () => {
  const { branchLabel } = useEnterprise();

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

  // Filter States
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');

  // Filtered Shipments based on active controls
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

  // Executive Top KPIs
  const executiveKpis = useMemo(() => {
    const totalShipments = filteredShipments.length;
    const delivered = filteredShipments.filter((s) => s.status === 'delivered').length;
    const inTransit = filteredShipments.filter((s) => s.status === 'in-transit').length;
    const delayed = filteredShipments.filter((s) => s.status === 'delayed').length;
    const slaSuccessRate = totalShipments > 0 ? ((delivered / (totalShipments - inTransit || 1)) * 100).toFixed(1) : '96.4';

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
      { name: 'Air Cargo Express', count: air, percent: Math.round((air / total) * 100), color: 'bg-orange', text: 'text-orange' },
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
      if (s.status === 'delayed') corridorMap[key].delayed++;
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
    link.setAttribute('download', `FreightLine_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`);
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
            <h1 className="text-2xl font-bold tracking-tight text-navy">Executive Reports & Analytics</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {branchLabel}
            </span>
          </div>
          <p className="text-sm text-secondary mt-1">
            Enterprise logistics throughput, modal revenue splits, SLA velocity, and national asset utilization.
          </p>
        </div>

        {/* Global Export & Print Buttons */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-border hover:bg-slate-50 text-secondary hover:text-navy text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <AppIcon name="printer" size={15} />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange hover:bg-orange-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <AppIcon name="download" size={15} />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Analytics Control Filters (Timeframe, Branch, Mode) */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Time Range Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(['7D', '30D', '90D', 'YTD'] as TimeRange[]).map((tr) => (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  timeRange === tr
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-secondary hover:text-navy'
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
            {/* Branch Filter */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
            >
              <option value="all">All Operational Hubs</option>
              {branches.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>

            {/* Mode Filter */}
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
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
        {/* Total Consignments */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Consignments</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <AppIcon name="box" size={16} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">{executiveKpis.totalShipments}</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">
            {executiveKpis.delivered} delivered successfully
          </div>
        </div>

        {/* Total Billed Revenue */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Billed Freight</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <AppIcon name="dollar-sign" size={16} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">
            ₹{(executiveKpis.totalRevenue / 1000).toFixed(0)}k
          </div>
          <div className="mt-1 text-[11px] text-secondary">
            ₹{(executiveKpis.totalCollected / 1000).toFixed(0)}k realized
          </div>
        </div>

        {/* SLA Compliance Rate */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-[11px] font-semibold uppercase tracking-wider">On-Time SLA</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <AppIcon name="check-circle" size={16} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">{executiveKpis.slaSuccessRate}%</div>
          <div className="mt-1 text-[11px] text-secondary">Target: 95.0% adherence</div>
        </div>

        {/* Active In-Transit */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-[11px] font-semibold uppercase tracking-wider">In-Transit Freight</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <AppIcon name="truck" size={16} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600">{executiveKpis.inTransit}</div>
          <div className="mt-1 text-[11px] text-secondary">Active on national corridors</div>
        </div>

        {/* Fleet Availability */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Fleet Readiness</span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-navy">
              <AppIcon name="wrench" size={16} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">{executiveKpis.fleetUtilizationRate}%</div>
          <div className="mt-1 text-[11px] text-secondary">{vehicles.length} heavy vehicles</div>
        </div>

        {/* Warehouse Volumetric Occupancy */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Wh. Occupancy</span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-navy">
              <AppIcon name="building" size={16} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">{executiveKpis.whOccupancyRate}%</div>
          <div className="mt-1 text-[11px] text-secondary">{warehouses.length} regional hubs</div>
        </div>

        {/* Exception Consignments */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Delayed Exceptions</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <AppIcon name="alert" size={16} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600">{executiveKpis.delayed}</div>
          <div className="mt-1 text-[11px] text-rose-600">Route congestion / weather</div>
        </div>

        {/* Transit Speed / Velocity */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Transit SLA</span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-navy">
              <AppIcon name="clock" size={16} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">28.4 hrs</div>
          <div className="mt-1 text-[11px] text-secondary">Inter-state delivery turnaround</div>
        </div>
      </div>

      {/* Visual Analytics Grid: Modal Split & Corridor SLA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Multimodal Distribution & Throughput */}
        <div className="lg:col-span-7 bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                <AppIcon name="trending-up" size={16} className="text-orange" />
                <span>Multimodal Freight Distribution & Volume</span>
              </h2>
              <p className="text-xs text-secondary mt-0.5">Share of consignments by mode of transport</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Real-time sync</span>
          </div>

          {/* Modal Percentage Progress Bars */}
          <div className="space-y-4 pt-2">
            {modalDistribution.map((m) => (
              <div key={m.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-navy">{m.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-secondary">{m.count} consignments</span>
                    <span className={`font-bold font-mono ${m.text}`}>{m.percent}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${m.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(4, m.percent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* SVG Throughput Velocity Trend */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-secondary">30-Day Consignment Ingestion Trend</span>
              <span className="text-[11px] text-emerald-600 font-medium">+14.2% MoM growth</span>
            </div>
            <div className="h-32 w-full flex items-end gap-2 pt-4 px-2 bg-slate-50 rounded-lg border border-border">
              {[38, 45, 52, 48, 60, 58, 65, 72, 68, 75, 82, 88, 92, 85, 96].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-navy/80 hover:bg-orange rounded-t transition-all"
                    style={{ height: `${val}%` }}
                    title={`Day ${i + 1}: ${val} units`}
                  />
                  <span className="text-[9px] text-slate-400">{(i + 1) % 4 === 0 ? `D${i + 1}` : ''}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Major Corridor Performance & Exceptions */}
        <div className="lg:col-span-5 bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-navy flex items-center gap-2">
                <AppIcon name="route" size={16} className="text-blue-600" />
                <span>Primary National Corridors</span>
              </h2>
              <p className="text-xs text-secondary mt-0.5">Top throughput lanes & on-time reliability</p>
            </div>
          </div>

          {corridorStats.length === 0 ? (
            <p className="text-xs text-secondary py-6 text-center">No corridor statistics available.</p>
          ) : (
            <div className="divide-y divide-border">
              {corridorStats.map((c) => (
                <div key={c.corridor} className="py-3 first:pt-1 last:pb-1 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-navy">{c.corridor}</div>
                    <div className="text-[11px] text-secondary mt-0.5">
                      {c.total} shipments handled
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-mono font-bold ${
                        c.onTimePercent >= 90 ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
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
          )}

          {/* Root-cause Exception Breakdown */}
          <div className="pt-3 border-t border-border">
            <h3 className="text-xs font-semibold text-secondary mb-2">Delay Root-Cause Attribution</h3>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-slate-50 rounded border border-border">
                <span className="text-secondary block">Monsoon / Weather</span>
                <span className="font-semibold text-navy">42%</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-border">
                <span className="text-secondary block">Highway Congestion</span>
                <span className="font-semibold text-navy">28%</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-border">
                <span className="text-secondary block">Vehicle Maintenance</span>
                <span className="font-semibold text-navy">18%</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-border">
                <span className="text-secondary block">Doc Verification</span>
                <span className="font-semibold text-navy">12%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Infrastructure Utilization Row */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-navy flex items-center gap-2">
              <AppIcon name="building" size={16} className="text-emerald-600" />
              <span>National Warehouse & Terminal Volumetric Capacities</span>
            </h2>
            <p className="text-xs text-secondary mt-0.5">Physical storage utilization across regional logistics hubs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {warehouses.slice(0, 4).map((wh) => {
            const occupancy = Math.round((wh.occupiedCapacityCbm / (wh.totalCapacityCbm || 1)) * 100);
            return (
              <div key={wh.id} className="p-3.5 bg-slate-50/70 border border-border rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-navy truncate max-w-[150px]">{wh.name}</span>
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-white text-slate-700 border border-border">
                    {wh.branchId}
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-secondary">{wh.city}</span>
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
                <div className="flex justify-between text-[11px] text-secondary">
                  <span>{wh.occupiedCapacityCbm.toLocaleString()} m³ utilized</span>
                  <span>{wh.totalCapacityCbm.toLocaleString()} m³ total</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalyticsPage;
