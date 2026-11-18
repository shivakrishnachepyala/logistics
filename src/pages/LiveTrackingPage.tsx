import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getStoredShipments } from '../data/mockShipments';
import type { Shipment, ServiceMode, Checkpoint } from '../types';
import { AppIcon } from '../components/common/AppIcon';
import { useEnterprise } from '../context/EnterpriseContext';

// Standardized Hub Coordinates on the 800x850 SVG Indian Map Canvas
const HUB_COORDINATES: Record<string, { x: number; y: number; name: string; state: string }> = {
  'DEL-CENTRAL': { x: 265, y: 238, name: 'Delhi NCR Hub', state: 'Delhi' },
  'JPR-MAIN': { x: 223, y: 286, name: 'Jaipur Delivery Centre', state: 'Rajasthan' },
  'GJ-SURAT': { x: 138, y: 448, name: 'Surat Cargo Terminal', state: 'Gujarat' },
  'MH-MUMBAI': { x: 141, y: 511, name: 'Mumbai JNPT Port Hub', state: 'Maharashtra' },
  'MH-PUNE': { x: 167, y: 523, name: 'Pune Chakan Hub', state: 'Maharashtra' },
  'MP-INDORE': { x: 225, y: 404, name: 'Indore Siyaganj Centre', state: 'Madhya Pradesh' },
  'TN-CHENNAI': { x: 350, y: 677, name: 'Chennai Ocean & Air Port', state: 'Tamil Nadu' },
  'KA-BLR': { x: 274, y: 680, name: 'Bengaluru Logistics Park', state: 'Karnataka' },
  'WB-KOL': { x: 582, y: 409, name: 'Kolkata Shalimar Siding', state: 'West Bengal' },
  'TS-HYD': { x: 300, y: 556, name: 'Hyderabad Begumpet Cargo', state: 'Telangana' },
};

export const LiveTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlShipmentId = searchParams.get('id');

  const { branch } = useEnterprise();
  const [shipments, setShipments] = useState<Shipment[]>(() => getStoredShipments());
  const [clickedId, setClickedId] = useState<string | null>(null);

  const selectedId = useMemo(() => {
    if (clickedId) return clickedId;
    if (urlShipmentId) return urlShipmentId;
    const initialInTransit = shipments.find(s => s.status === 'in-transit');
    return initialInTransit?.id || shipments[0]?.id || '';
  }, [clickedId, urlShipmentId, shipments]);

  const [activeModeFilter, setActiveModeFilter] = useState<string>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewPreset, setViewPreset] = useState<'all' | 'north' | 'west' | 'south'>('all');

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

  // Filter shipments for sidebar
  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      // Hub filter
      if (branch !== 'all') {
        const code = branch.toLowerCase();
        const matchesHub =
          s.originHubCode.toLowerCase().includes(code) ||
          s.destinationHubCode.toLowerCase().includes(code);
        if (!matchesHub) return false;
      }

      // Mode filter
      if (activeModeFilter !== 'all' && s.serviceMode !== activeModeFilter) return false;

      // Status filter
      if (activeStatusFilter !== 'all' && s.status !== activeStatusFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = s.id.toLowerCase().includes(q);
        const matchBol = s.billOfLading.toLowerCase().includes(q);
        const matchConsignee = s.receiver.name.toLowerCase().includes(q) || s.receiver.company.toLowerCase().includes(q);
        const matchRoute = s.originHub.toLowerCase().includes(q) || s.destinationHub.toLowerCase().includes(q);
        return matchId || matchBol || matchConsignee || matchRoute;
      }
      return true;
    });
  }, [shipments, branch, activeModeFilter, activeStatusFilter, searchQuery]);

  // Selected shipment details
  const selectedShipment = useMemo(() => {
    return shipments.find(s => s.id === selectedId) || filteredShipments[0] || shipments[0];
  }, [shipments, selectedId, filteredShipments]);

  // Get coordinates for active shipment route
  const getCoordinatesForShipment = (shipment: Shipment) => {
    const origin = HUB_COORDINATES[shipment.originHubCode] || { x: 265, y: 238, name: shipment.originHub, state: '' };
    const destination = HUB_COORDINATES[shipment.destinationHubCode] || { x: 223, y: 286, name: shipment.destinationHub, state: '' };

    // Calculate current telemetry position based on progress %
    const t = shipment.progressPercent / 100;
    const currentX = origin.x + (destination.x - origin.x) * t;
    const currentY = origin.y + (destination.y - origin.y) * t;

    return { origin, destination, current: { x: currentX, y: currentY } };
  };

  const getModeInfo = (mode: ServiceMode) => {
    switch (mode) {
      case 'ocean_freight':
        return { label: 'Ocean Container', icon: 'ship' as const, color: '#3B82F6', badge: 'bg-blue-50 text-blue-700' };
      case 'air_express':
        return { label: 'Air Cargo Express', icon: 'plane' as const, color: '#0EA5E9', badge: 'bg-sky-50 text-sky-700' };
      case 'intermodal_rail':
        return { label: 'Rail Intermodal', icon: 'train' as const, color: '#8B5CF6', badge: 'bg-purple-50 text-purple-700' };
      default:
        return { label: 'Road Freight', icon: 'truck' as const, color: '#10B981', badge: 'bg-emerald-50 text-emerald-700' };
    }
  };

  // Viewbox calculation based on preset
  const getViewBox = () => {
    switch (viewPreset) {
      case 'north':
        return '150 150 350 300';
      case 'west':
        return '80 380 300 250';
      case 'south':
        return '180 500 350 300';
      default:
        return '40 80 650 720';
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Operational Radar Header & Simulation Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-saas-sm">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 tracking-tight">
              Live Consignment Radar: "Where Is My Shipment?"
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
              Live Carrier Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulated multimodal telemetry displaying vehicle, train, flight, and container vessel coordinates across national transit corridors.
          </p>
        </div>

        {/* Clear Telemetry Distinction Pill */}
        <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-[11px] text-amber-900 font-medium flex items-center gap-1.5 shrink-0">
          <AppIcon name="info" size={14} className="text-amber-600 shrink-0" />
          <span>Simulated Telemetry / Checkpoint Position (Carrier API Ready)</span>
        </div>
      </div>

      {/* 2. Main Radar Layout: 3 Columns (Sidebar, Interactive Map, Telemetry Detail Drawer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Left Col (4 Cols on LG): Search, Filter & Active Shipments List */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-saas-sm flex flex-col h-[750px] overflow-hidden">
          {/* Search Box */}
          <div className="p-3.5 border-b border-slate-200 space-y-2.5">
            <div className="relative">
              <AppIcon name="search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search consignment ID, LR, city..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Mode Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
              {[
                { key: 'all', label: 'All' },
                { key: 'heavy_haul', label: 'Road', icon: 'truck' as const },
                { key: 'intermodal_rail', label: 'Rail', icon: 'train' as const },
                { key: 'air_express', label: 'Air', icon: 'plane' as const },
                { key: 'ocean_freight', label: 'Sea', icon: 'ship' as const },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setActiveModeFilter(m.key)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                    activeModeFilter === m.key
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {m.icon && <AppIcon name={m.icon} size={11} />}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{filteredShipments.length} consignments plotted</span>
              <div className="flex items-center gap-1">
                {(['all', 'in-transit', 'delayed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setActiveStatusFilter(st)}
                    className={`px-2 py-0.5 rounded capitalize ${
                      activeStatusFilter === st
                        ? 'bg-orange-100 text-orange-700 font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {st === 'all' ? 'All' : st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Shipment Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredShipments.map((s) => {
              const isSelected = selectedShipment?.id === s.id;
              const modeInfo = getModeInfo(s.serviceMode);
              const isDelayed = s.status === 'delayed';

              return (
                <div
                  key={s.id}
                  onClick={() => setClickedId(s.id)}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-orange-50/50 border-l-4 border-l-orange-500'
                      : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {s.id}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${modeInfo.badge}`}>
                        {modeInfo.label.split(' ')[0]}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isDelayed
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : s.status === 'in-transit'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                    <span className="font-mono text-slate-500">{s.originHubCode}</span>
                    <AppIcon name="arrow-right" size={11} className="text-slate-400" />
                    <span className="font-mono text-slate-800 font-semibold">{s.destinationHubCode}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-500 truncate">{s.cargo.weightKg} kg</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[170px] font-mono">
                      {s.carrier}
                    </span>
                    <span className="font-mono text-slate-700 font-semibold">
                      {s.progressPercent}% covered
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full rounded-full ${
                        isDelayed ? 'bg-amber-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${s.progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Col (5 Cols on LG): Interactive SVG Vector Map of India */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-saas-sm flex flex-col h-[750px] overflow-hidden">
          {/* Map Controls Toolbar */}
          <div className="p-3 border-b border-slate-200 flex items-center justify-between gap-2 text-xs bg-slate-50/70">
            <div className="flex items-center gap-1.5 font-heading font-bold text-slate-700">
              <AppIcon name="map-pin" size={14} className="text-orange-500" />
              <span>National Freight Corridor Radar</span>
            </div>

            {/* Quick View Presets */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
              {(['all', 'north', 'west', 'south'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setViewPreset(preset)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    viewPreset === preset
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="flex-1 relative bg-[#F8FAFC] flex items-center justify-center p-2 overflow-hidden select-none">
            <svg
              viewBox={getViewBox()}
              className="w-full h-full max-h-[680px] transition-all duration-500"
            >
              {/* Background Geographic Grids */}
              <defs>
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F1F5F9" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="800" height="850" fill="url(#gridPattern)" />

              {/* Simplified Geometric Indian Mainland Boundary Outline for Geographic Orientation */}
              <path
                d="M 230 140 L 290 120 L 330 170 L 360 220 L 490 220 L 590 350 L 582 409 L 520 480 L 450 560 L 380 640 L 350 677 L 274 740 L 220 730 L 170 650 L 141 511 L 138 448 L 110 390 L 140 320 L 180 260 L 230 140 Z"
                fill="#FFFFFF"
                stroke="#E2E8F0"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Major Freight Corridors (Static Transit Network) */}
              {/* Delhi - Jaipur (NH-48) */}
              <line x1="265" y1="238" x2="223" y2="286" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
              {/* Delhi - Kolkata (Eastern DFC) */}
              <line x1="265" y1="238" x2="582" y2="409" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="3 3" />
              {/* Surat - Mumbai (Western DFC / NH-48) */}
              <line x1="138" y1="448" x2="141" y2="511" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
              {/* Chennai - Bengaluru */}
              <line x1="350" y1="677" x2="274" y2="680" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
              {/* Mumbai - Hyderabad */}
              <line x1="141" y1="511" x2="300" y2="556" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="3 3" />
              {/* Pune - Indore */}
              <line x1="167" y1="523" x2="225" y2="404" stroke="#CBD5E1" strokeWidth="2.5" />

              {/* Active Route Highlighting for ALL active shipments */}
              {shipments.map((s) => {
                const isSelected = selectedShipment?.id === s.id;
                const coords = getCoordinatesForShipment(s);
                const modeInfo = getModeInfo(s.serviceMode);

                return (
                  <g key={`route-${s.id}`}>
                    {/* Active Route Path */}
                    <path
                      d={`M ${coords.origin.x} ${coords.origin.y} Q ${(coords.origin.x + coords.destination.x) / 2 + (isSelected ? 15 : 0)} ${(coords.origin.y + coords.destination.y) / 2 - (isSelected ? 15 : 0)} ${coords.destination.x} ${coords.destination.y}`}
                      fill="none"
                      stroke={isSelected ? '#F97316' : modeInfo.color}
                      strokeWidth={isSelected ? 4 : 2}
                      strokeOpacity={isSelected ? 1 : 0.4}
                      strokeDasharray={isSelected ? 'none' : '4 3'}
                    />

                    {/* Animated Telemetry Pulse Circle on Current Position */}
                    {s.status === 'in-transit' && (
                      <g transform={`translate(${coords.current.x}, ${coords.current.y})`}>
                        <circle
                          r={isSelected ? 14 : 9}
                          fill={modeInfo.color}
                          fillOpacity={0.2}
                          className="animate-ping"
                        />
                        <circle
                          r={isSelected ? 7 : 5}
                          fill={isSelected ? '#F97316' : modeInfo.color}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Major Hub City Nodes */}
              {Object.entries(HUB_COORDINATES).map(([code, hub]) => {
                const isSelectedOrigin = selectedShipment?.originHubCode === code;
                const isSelectedDest = selectedShipment?.destinationHubCode === code;
                const isHighlight = isSelectedOrigin || isSelectedDest;

                return (
                  <g key={code} transform={`translate(${hub.x}, ${hub.y})`} className="cursor-pointer">
                    <circle
                      r={isHighlight ? 7 : 4}
                      fill={isHighlight ? '#0F172A' : '#94A3B8'}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <text
                      y={isHighlight ? -10 : -8}
                      x="0"
                      textAnchor="middle"
                      fontSize={isHighlight ? 11 : 9}
                      fontWeight={isHighlight ? 'bold' : '500'}
                      fill={isHighlight ? '#0F172A' : '#64748B'}
                    >
                      {hub.name.split(' ')[0]} ({code.split('-')[0]})
                    </text>
                  </g>
                );
              })}

              {/* Selected Shipment Marker Overlay with Vehicle Icon */}
              {selectedShipment && (
                (() => {
                  const coords = getCoordinatesForShipment(selectedShipment);

                  return (
                    <g transform={`translate(${coords.current.x}, ${coords.current.y})`}>
                      <rect
                        x="-45"
                        y="-38"
                        width="90"
                        height="26"
                        rx="6"
                        fill="#0F172A"
                        stroke="#F97316"
                        strokeWidth="1.5"
                        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
                      />
                      <text
                        x="0"
                        y="-22"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        fill="#FFFFFF"
                      >
                        {selectedShipment.id}
                      </text>
                      <polygon
                        points="0,-12 -5,-16 5,-16"
                        fill="#0F172A"
                      />
                    </g>
                  );
                })()
              )}
            </svg>

            {/* Radar Canvas Watermark */}
            <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 font-mono pointer-events-none">
              VELTRAX GIS Corridor Engine v2.4 • Dynamic Vector Projection
            </div>
          </div>
        </div>

        {/* Right Col (3 Cols on LG): Selected Shipment Telemetry & Journey Timeline */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-saas-sm flex flex-col h-[750px] overflow-hidden">
          {selectedShipment ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-5">

              {/* Header Box */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-slate-400">{selectedShipment.billOfLading}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      selectedShipment.status === 'delayed'
                        ? 'bg-amber-100 text-amber-800'
                        : selectedShipment.status === 'in-transit'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selectedShipment.status}
                  </span>
                </div>
                <h3 className="font-heading font-black text-lg text-slate-900 tracking-tight">
                  {selectedShipment.id}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 font-medium">
                  <span>{selectedShipment.originHub.split('(')[0]}</span>
                  <AppIcon name="arrow-right" size={12} className="text-slate-400" />
                  <span>{selectedShipment.destinationHub.split('(')[0]}</span>
                </div>
              </div>

              {/* Delay Exception Alert Banner if Delayed */}
              {selectedShipment.status === 'delayed' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-950">
                    <AppIcon name="alert" size={13} className="text-amber-600" />
                    <span>Transit Hold / Weather Exception</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    {selectedShipment.delayInfo?.reason || 'Adverse weather conditions along highway corridor.'}
                  </p>
                  <div className="text-[10px] text-amber-700 font-mono mt-1">
                    Revised ETA: {selectedShipment.delayInfo?.revisedEta || selectedShipment.eta}
                  </div>
                </div>
              )}

              {/* Telemetry Metrics */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] uppercase font-semibold">Active Carrier</span>
                  <span className="font-semibold text-slate-800">{selectedShipment.carrier}</span>
                </div>

                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] uppercase font-semibold">Vehicle / Rake</span>
                  <span className="font-mono text-slate-800 text-[11px]">{selectedShipment.vesselOrFlight || 'Assigned Fleet'}</span>
                </div>

                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] uppercase font-semibold">Reported Telemetry</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Simulated GPS Active
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-500 border-t border-slate-200 pt-2">
                  <span className="text-[11px] uppercase font-semibold">Estimated Arrival</span>
                  <span className="font-bold text-slate-900">{selectedShipment.eta}</span>
                </div>
              </div>

              {/* Progress Bar & Distance */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Corridor Transit Progress</span>
                  <span className="font-mono text-orange-600">{selectedShipment.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${selectedShipment.progressPercent}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Origin Handover</span>
                  <span>Destination Outbound</span>
                </div>
              </div>

              {/* "Where Is My Shipment?" Journey Milestones Stepper */}
              <div className="space-y-3 pt-2">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-700">
                  Journey Waypoints & Telemetry
                </h4>

                <div className="space-y-2 relative pl-4 border-l-2 border-slate-200 ml-2">
                  {selectedShipment.checkpoints.map((cp: Checkpoint, idx: number) => {
                    const isDone = cp.completed;
                    const isCurrent = cp.isCurrent;

                    return (
                      <div key={cp.id || idx} className="relative text-xs">
                        {/* Node circle on border */}
                        <div
                          className={`absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full border-2 bg-white ${
                            isDone
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : isCurrent
                              ? 'border-orange-500 ring-2 ring-orange-200'
                              : 'border-slate-300'
                          }`}
                        ></div>

                        <div className="flex items-center justify-between gap-1">
                          <span className={`font-semibold ${isDone ? 'text-slate-800' : isCurrent ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>
                            {cp.location}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 shrink-0">
                            {cp.timestamp.split(',')[0]}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {cp.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Security Policy Reminder: OTP is NEVER revealed */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-500 flex items-start gap-2">
                <AppIcon name="shield" size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Delivery OTP is strictly sent via private SMS to consignee and is withheld from tracking telemetry.
                </span>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex items-center gap-2">
                <Link
                  to={`/manager/shipment/${selectedShipment.id}`}
                  className="flex-1 py-2 px-3 text-center bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  Inspect Electronic Bilty
                </Link>
                <Link
                  to={`/transport-assignment?shipmentId=${selectedShipment.id}`}
                  className="py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
                  title="Reassign or edit fleet"
                >
                  <AppIcon name="transport" size={14} />
                </Link>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-center text-slate-400 text-xs">
              Select a consignment from the radar list to view live telemetry.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
