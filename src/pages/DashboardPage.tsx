import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getStoredShipments, getDrivers } from '../data/mockShipments';
import type { Shipment, DriverInfo, ServiceMode } from '../types';
import { AppIcon } from '../components/common/AppIcon';
import { useEnterprise, BRANCH_NAMES } from '../context/EnterpriseContext';

export const DashboardPage: React.FC = () => {
  const { branch, branchLabel, role } = useEnterprise();
  const [shipments, setShipments] = useState<Shipment[]>(() => getStoredShipments());
  const [drivers, setDrivers] = useState<DriverInfo[]>(() => getDrivers());
  const [lastSynced, setLastSynced] = useState<string>(() => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    const handleUpdate = () => {
      setShipments(getStoredShipments());
      setDrivers(getDrivers());
      setLastSynced(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('freightline_storage_update', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('freightline_storage_update', handleUpdate);
    };
  }, []);

  // Filter shipments based on active hub selection
  const hubFilteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      if (branch === 'all') return true;
      const code = branch.toLowerCase();
      return (
        s.originHubCode.toLowerCase().includes(code) ||
        s.destinationHubCode.toLowerCase().includes(code) ||
        s.originHub.toLowerCase().includes(code) ||
        s.destinationHub.toLowerCase().includes(code)
      );
    });
  }, [shipments, branch]);

  // Dynamic KPI Metrics derived from live dataset
  const metrics = useMemo(() => {
    const total = hubFilteredShipments.length;
    const inTransit = hubFilteredShipments.filter((s) => s.status === 'in-transit').length;
    const pending = hubFilteredShipments.filter((s) => s.status === 'pending').length;
    const delivered = hubFilteredShipments.filter((s) => s.status === 'delivered').length;
    const delayed = hubFilteredShipments.filter((s) => s.status === 'delayed').length;
    const activeTotal = inTransit + pending + delayed;

    // SLA On-Time %
    const slaResolvedCount = delivered + delayed;
    const onTimeRate = slaResolvedCount > 0
      ? Math.round((delivered / slaResolvedCount) * 100)
      : 96;

    // Freight Tonnage
    const totalWeightKg = hubFilteredShipments.reduce((sum, s) => sum + (s.cargo?.weightKg || 0), 0);
    const tonnage = (totalWeightKg / 1000).toFixed(1);

    // Active fleet units
    const activeDrivers = drivers.filter(d => d.status === 'on_route').length;
    const activeVehicles = Math.max(activeDrivers, inTransit);

    return {
      total,
      activeTotal,
      inTransit,
      pending,
      delivered,
      delayed,
      onTimeRate,
      tonnage,
      activeVehicles
    };
  }, [hubFilteredShipments, drivers]);

  // Modal split distribution (Road, Rail, Air, Sea)
  const modalSplit = useMemo(() => {
    const counts: Record<ServiceMode, number> = {
      heavy_haul: 0,
      intermodal_rail: 0,
      air_express: 0,
      ocean_freight: 0
    };
    hubFilteredShipments.forEach((s) => {
      if (counts[s.serviceMode] !== undefined) {
        counts[s.serviceMode]++;
      } else {
        counts.heavy_haul++;
      }
    });

    const total = hubFilteredShipments.length || 1;
    return [
      { mode: 'heavy_haul' as ServiceMode, label: 'Road Freight', count: counts.heavy_haul, pct: Math.round((counts.heavy_haul / total) * 100), color: '#10B981', icon: 'truck' as const },
      { mode: 'intermodal_rail' as ServiceMode, label: 'Rail Intermodal', count: counts.intermodal_rail, pct: Math.round((counts.intermodal_rail / total) * 100), color: '#8B5CF6', icon: 'train' as const },
      { mode: 'air_express' as ServiceMode, label: 'Air Cargo Express', count: counts.air_express, pct: Math.round((counts.air_express / total) * 100), color: '#0EA5E9', icon: 'plane' as const },
      { mode: 'ocean_freight' as ServiceMode, label: 'Ocean Container', count: counts.ocean_freight, pct: Math.round((counts.ocean_freight / total) * 100), color: '#3B82F6', icon: 'ship' as const }
    ];
  }, [hubFilteredShipments]);

  // 7-day velocity chart data
  const weeklyTrends = useMemo(() => [
    { day: 'Mon', dispatched: 14, delivered: 12 },
    { day: 'Tue', dispatched: 19, delivered: 15 },
    { day: 'Wed', dispatched: 22, delivered: 18 },
    { day: 'Thu', dispatched: 18, delivered: 17 },
    { day: 'Fri', dispatched: 24, delivered: 21 },
    { day: 'Sat', dispatched: 16, delivered: 19 },
    { day: 'Sun', dispatched: 11, delivered: 14 },
  ], []);

  // Extract recent activities from shipments
  const recentActivities = useMemo(() => {
    const allActivities: Array<{
      id: string;
      timestamp: string;
      actor: string;
      role: string;
      event: string;
      terminalCode: string;
      shipmentId: string;
    }> = [];

    hubFilteredShipments.forEach((s) => {
      if (s.activities) {
        s.activities.forEach((a) => {
          allActivities.push({
            id: a.id,
            timestamp: a.timestamp,
            actor: a.actor,
            role: a.role,
            event: a.event,
            terminalCode: a.terminalCode,
            shipmentId: s.id
          });
        });
      }
    });

    return allActivities.slice(0, 6);
  }, [hubFilteredShipments]);

  // Delayed shipments for the critical exception banner
  const delayedShipments = useMemo(() => {
    return hubFilteredShipments.filter((s) => s.status === 'delayed');
  }, [hubFilteredShipments]);

  // Major transit corridors summary
  const corridorHealth = [
    { corridor: 'Delhi (DEL) → Jaipur (JPR)', mode: 'Road / FTL', volume: '14 Consignments', sla: 98, status: 'Optimal' },
    { corridor: 'Surat (GJ) → Mumbai (MH)', mode: 'Intermodal Road', volume: '22 Consignments', sla: 76, status: 'Severe Weather Alert' },
    { corridor: 'Chennai (TN) → Bengaluru (BLR)', mode: 'Air Express', volume: '9 Consignments', sla: 99, status: 'Optimal' },
    { corridor: 'Delhi (DEL) → Kolkata (KOL)', mode: 'Rail Rake', volume: '18 Containers', sla: 92, status: 'Transit Hold' },
  ];

  // Hub network micro-table
  const hubSummaries = [
    { code: 'DEL-CENTRAL', name: 'Delhi Central Parcel Hub', inbound: 42, outbound: 68, active: 110, health: 'Normal' },
    { code: 'JPR-MAIN', name: 'Jaipur Delivery Centre', inbound: 31, outbound: 19, active: 50, health: 'Normal' },
    { code: 'MH-MUMBAI', name: 'Bhiwandi / JNPT Port Hub', inbound: 84, outbound: 95, active: 179, health: 'High Volume' },
    { code: 'GJ-SURAT', name: 'Surat Textile Logistics Hub', inbound: 28, outbound: 52, active: 80, health: 'Caution' },
    { code: 'TN-CHENNAI', name: 'Chennai Air & Ocean Depot', inbound: 36, outbound: 44, active: 80, health: 'Normal' },
    { code: 'KA-BLR', name: 'Bengaluru Tech & Cargo Park', inbound: 49, outbound: 38, active: 87, health: 'Normal' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Executive Operations Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-saas-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 tracking-tight">
              Executive Logistics Command Center
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Telemetry
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 flex items-center gap-2 flex-wrap">
            <span>
              Real-time multi-modal freight monitoring, SLA tracking, and dispatch coordination for{' '}
              <strong className="text-slate-700 font-semibold">{BRANCH_NAMES[branch]?.city || branchLabel}</strong>.
            </span>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-slate-100 text-slate-700 border border-slate-200">
              Role: {role}
            </span>
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <AppIcon name="clock" size={14} className="text-slate-400" />
            <span>Synced: <strong className="text-slate-700 font-mono">{lastSynced}</strong></span>
            <button
              onClick={() => {
                setShipments(getStoredShipments());
                setDrivers(getDrivers());
                setLastSynced(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
              }}
              title="Refresh live data"
              className="text-slate-400 hover:text-orange-600 transition-colors"
            >
              <AppIcon name="refresh" size={13} />
            </button>
          </div>

          <Link
            to="/tracking"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
          >
            <AppIcon name="tracking" size={14} className="text-slate-500" />
            <span>Live Radar</span>
          </Link>

          <Link
            to="/transport-assignment"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
          >
            <AppIcon name="transport" size={14} className="text-slate-500" />
            <span>Assign Transport</span>
          </Link>

          <Link
            to="/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-colors"
          >
            <AppIcon name="plus" size={14} />
            <span>New Consignment</span>
          </Link>
        </div>
      </div>

      {/* 2. Critical Delivery Exceptions / Alert Center (Conditional) */}
      {delayedShipments.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 sm:p-5 text-amber-900 shadow-saas-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <AppIcon name="alert" size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-sm text-amber-950">
                    Active Delivery Exception: {delayedShipments.length} Consignment Affected
                  </h3>
                  <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-amber-200 text-amber-800 uppercase tracking-wide">
                    Action Recommended
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-1 max-w-2xl">
                  Consignment <strong className="font-mono text-amber-950">{delayedShipments[0].id}</strong> ({delayedShipments[0].originHub} → {delayedShipments[0].destinationHub}) is flagged delayed: {delayedShipments[0].delayInfo?.reason || 'Heavy monsoon waterlogging along highway'}. Revised ETA: {delayedShipments[0].delayInfo?.revisedEta || delayedShipments[0].eta}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <Link
                to={`/shipment/${delayedShipments[0].id}`}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Inspect Manifest
              </Link>
              <Link
                to={`/tracking?id=${delayedShipments[0].id}`}
                className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold rounded-lg transition-colors"
              >
                View on Map
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. Operational KPI Metrics Cards (8 Grid Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Active Consignments */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Freight</span>
            <div className="w-7 h-7 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
              <AppIcon name="shipments" size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              {metrics.activeTotal}
            </span>
            <span className="text-[11px] text-slate-500">consignments</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-slate-100 pt-2">
            <span className="text-emerald-600 font-semibold">{metrics.inTransit} in-transit</span>
            <span>•</span>
            <span className="text-slate-400">{metrics.pending} pending</span>
          </div>
        </div>

        {/* Metric 2: In-Transit Now */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">In-Transit Radar</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <AppIcon name="tracking" size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              {metrics.inTransit}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
              Live Telemetry
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            Moving across road, rail, air & sea lanes
          </div>
        </div>

        {/* Metric 3: Pending Fleet Assignment */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Pending Dispatch</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${metrics.pending > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
              <AppIcon name="transport" size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-heading font-black ${metrics.pending > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {metrics.pending}
            </span>
            {metrics.pending > 0 ? (
              <Link to="/transport-assignment" className="text-[11px] text-amber-700 underline font-semibold">
                Needs Carrier
              </Link>
            ) : (
              <span className="text-[11px] text-emerald-600 font-semibold">Queue clear</span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            Awaiting vehicle/driver allocation
          </div>
        </div>

        {/* Metric 4: On-Time SLA Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">On-Time SLA</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <AppIcon name="shield" size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              {metrics.onTimeRate}%
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">Target &gt;95%</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            {metrics.delayed > 0 ? `${metrics.delayed} delay reported` : 'All deliveries on schedule'}
          </div>
        </div>

        {/* Metric 5: Delivered Successfully */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Delivered</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <AppIcon name="check-circle" size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              {metrics.delivered}
            </span>
            <span className="text-[11px] text-slate-500">with OTP verified</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            Full digital proof-of-delivery logged
          </div>
        </div>

        {/* Metric 6: Active Fleet & Drivers */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Fleet En-Route</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <AppIcon name="truck" size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              {metrics.activeVehicles}
            </span>
            <span className="text-[11px] text-slate-500">active units</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            In-house fleet + partner 3PLs
          </div>
        </div>

        {/* Metric 7: Total Tonnage */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Freight Tonnage</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <AppIcon name="ship" size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              {metrics.tonnage}
            </span>
            <span className="text-[11px] text-slate-500">Metric Tonnes</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            Total active manifested weight
          </div>
        </div>

        {/* Metric 8: Active Exceptions */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Transit Exceptions</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${metrics.delayed > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
              <AppIcon name="alert" size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-heading font-black ${metrics.delayed > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {metrics.delayed}
            </span>
            <span className="text-[11px] text-slate-500">alerts</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            {metrics.delayed > 0 ? 'Monitor delay log & ETA' : 'Normal transit conditions'}
          </div>
        </div>
      </div>

      {/* 4. Visual Analytics: Velocity Trends & Multimodal Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Dispatch Velocity & Trend (SVG Chart) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-saas-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                Weekly Freight Volume & Velocity
              </h2>
              <p className="text-xs text-slate-500">
                Daily consignments dispatched vs delivered across all transit hubs
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
              {(['7d', '30d', '90d'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedTimeframe === tf ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                  }`}
                >
                  {tf.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Clean SVG Area & Bar Chart */}
          <div className="h-56 sm:h-64 w-full pt-4">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="deliveredGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="30" y1="20" x2="480" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="65" x2="480" y2="65" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="110" x2="480" y2="110" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="155" x2="480" y2="155" stroke="#E2E8F0" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="20" y="24" fontSize="9" fill="#94A3B8" textAnchor="end">25</text>
              <text x="20" y="69" fontSize="9" fill="#94A3B8" textAnchor="end">20</text>
              <text x="20" y="114" fontSize="9" fill="#94A3B8" textAnchor="end">15</text>
              <text x="20" y="159" fontSize="9" fill="#94A3B8" textAnchor="end">10</text>

              {/* Smooth Dispatched Area Path */}
              <path
                d="M 60 100 Q 125 60 190 35 T 320 70 T 385 25 T 450 120 L 450 155 L 60 155 Z"
                fill="url(#velocityGrad)"
              />
              <path
                d="M 60 100 Q 125 60 190 35 T 320 70 T 385 25 T 450 120"
                fill="none"
                stroke="#F97316"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Delivered Trend Line */}
              <path
                d="M 60 115 Q 125 85 190 65 T 320 80 T 385 45 T 450 100"
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                strokeDasharray="4 2"
                strokeLinecap="round"
              />

              {/* Data points & X Labels */}
              {weeklyTrends.map((d, i) => {
                const x = 60 + i * 65;
                return (
                  <g key={d.day}>
                    <line x1={x} y1="155" x2={x} y2="160" stroke="#94A3B8" strokeWidth="1" />
                    <text x={x} y="174" fontSize="10" fill="#64748B" textAnchor="middle" fontWeight="500">
                      {d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded-full bg-orange-500 inline-block"></span>
                <span className="text-slate-700 font-medium">Dispatches Outbound</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded-full bg-emerald-500 inline-block border-b border-dashed border-emerald-600"></span>
                <span className="text-slate-700 font-medium">Delivered Inbound</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400">Peak Volume: Friday (24 units)</span>
          </div>
        </div>

        {/* Right: Modal Split Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-saas-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                Multi-Modal Freight Share
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">LIVE SPLIT</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Allocation of cargo tonnage across transport modes
            </p>

            {/* Modal Distribution List */}
            <div className="space-y-3.5">
              {modalSplit.map((item) => (
                <div key={item.mode} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <div className="w-6 h-6 rounded flex items-center justify-center text-white" style={{ backgroundColor: item.color }}>
                        <AppIcon name={item.icon} size={13} />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-bold">{item.count}</span>
                      <span className="text-slate-400 text-[11px]">({item.pct}%)</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(item.pct, 4)}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <Link
              to="/transport-assignment"
              className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Manage Multi-Modal Carriers</span>
              <AppIcon name="arrow-right" size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Transit Corridors Health & Operational Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Strategic Freight Corridors */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-saas-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                Transit Corridor SLA & Velocity
              </h2>
              <p className="text-xs text-slate-500">
                Real-time transit performance on key national logistics corridors
              </p>
            </div>
            <Link
              to="/shipments"
              className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <AppIcon name="chevron-right" size={13} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {corridorHealth.map((lane) => (
              <div key={lane.corridor} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-semibold text-slate-800">{lane.corridor}</div>
                  <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                    <span>{lane.mode}</span>
                    <span>•</span>
                    <span>{lane.volume}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="font-heading font-bold text-slate-900">{lane.sla}% On-Time</div>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                        lane.status === 'Optimal'
                          ? 'bg-emerald-50 text-emerald-700'
                          : lane.status === 'Transit Hold'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {lane.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Hub Network Operations Table */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-saas-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                Hub Network Status
              </h2>
              <p className="text-xs text-slate-500">
                Current inbound and outbound container flows by facility
              </p>
            </div>
            <Link
              to="/branches"
              className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
            >
              <span>Hub Directory</span>
              <AppIcon name="chevron-right" size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="pb-2.5">Facility / Hub</th>
                  <th className="pb-2.5 text-center">Inbound</th>
                  <th className="pb-2.5 text-center">Outbound</th>
                  <th className="pb-2.5 text-right">Throughput</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hubSummaries.map((hub) => (
                  <tr key={hub.code} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5">
                      <div className="font-medium text-slate-900">{hub.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{hub.code}</div>
                    </td>
                    <td className="py-2.5 text-center font-mono text-slate-700">{hub.inbound}</td>
                    <td className="py-2.5 text-center font-mono text-slate-700">{hub.outbound}</td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          hub.health === 'Normal'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : hub.health === 'Caution'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {hub.health}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. Live Operational Activity Stream */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-saas-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
            <div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                Live Operations Activity Log
              </h2>
              <p className="text-xs text-slate-500">
                Real-time security events, checkpoint scans, and dispatch confirmations
              </p>
            </div>
          </div>
          <Link
            to="/shipments"
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            All Consignments ({shipments.length})
          </Link>
        </div>

        <div className="space-y-3">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 shadow-xs">
                  <AppIcon name="file-text" size={13} />
                </div>
                <div>
                  <div className="text-slate-800 font-medium leading-relaxed">
                    {act.event}
                  </div>
                  <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                    <span className="font-semibold text-slate-600">{act.actor}</span>
                    <span>({act.role})</span>
                    <span>•</span>
                    <span className="font-mono text-slate-500">{act.terminalCode}</span>
                    <span>•</span>
                    <Link
                      to={`/shipment/${act.shipmentId}`}
                      className="text-orange-600 hover:underline font-mono"
                    >
                      {act.shipmentId}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="text-slate-400 text-[11px] font-mono shrink-0 self-end sm:self-center">
                {act.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
