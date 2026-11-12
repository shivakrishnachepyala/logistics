import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStoredShipments, getDrivers } from '../data/mockShipments';
import type { Shipment, DriverInfo } from '../types';
import { StatusCounterCards } from '../components/dashboard/StatusCounterCards';
import { ShipmentTable } from '../components/dashboard/ShipmentTable';
import { FleetList } from '../components/dashboard/FleetList';
import { PerformanceChart } from '../components/dashboard/PerformanceChart';
import { IndustrialIcon } from '../components/common/IndustrialIcon';
import { useTranslation } from '../context/LanguageContext';
import { useEnterprise, BRANCH_NAMES } from '../context/EnterpriseContext';

export const DashboardPage: React.FC = () => {
  const { lang, t } = useTranslation();
  const { role, branch, branchLabel } = useEnterprise();
  const [shipments, setShipments] = useState<Shipment[]>(() => getStoredShipments());
  const [drivers, setDrivers] = useState<DriverInfo[]>(() => getDrivers());
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');

  useEffect(() => {
    const handleStorageUpdate = () => {
      setShipments(getStoredShipments());
      setDrivers(getDrivers());
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('freightline_storage_update', handleStorageUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('freightline_storage_update', handleStorageUpdate);
    };
  }, []);

  // Filter shipments based on active branch selection
  const branchFilteredShipments = shipments.filter(s => {
    if (branch === 'all') return true;
    const branchCode = branch.toLowerCase();
    return (
      s.originHubCode.toLowerCase().includes(branchCode) ||
      s.destinationHubCode.toLowerCase().includes(branchCode) ||
      s.originHub.toLowerCase().includes(branchCode) ||
      s.destinationHub.toLowerCase().includes(branchCode)
    );
  });

  // Role-specific adaptations
  const displayShipments = role === 'driver'
    ? branchFilteredShipments.filter(s => s.assignedDriver?.id === 'DRV-104' || s.status === 'in-transit')
    : branchFilteredShipments;

  return (
    <div className="flex-1 py-6 sm:py-8 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Enterprise Role & Branch Context Banner */}
        <div className="bg-asphalt text-paper p-3.5 border-[2px] border-asphalt stamp-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="bg-orange text-white px-2 py-0.5 font-heading font-black text-xs uppercase tracking-wider">
              {role.toUpperCase()} MODE
            </span>
            <span className="text-yellow font-bold">
              {BRANCH_NAMES[branch]?.city || branchLabel}
            </span>
            <span className="text-steel hidden md:inline">|</span>
            <span className="text-paper/80 hidden md:inline">
              {role === 'driver' && (lang === 'hi' ? 'ड्राइवर रन: केवल सौंपी गई डिलीवरी' : 'Assigned Route Manifest for Driver Mukesh Yadav')}
              {role === 'customer' && (lang === 'hi' ? 'व्यापारी पोर्टल: आपके बुक किए गए पार्सल' : 'Trader & Shopkeeper Consignment Portal')}
              {role === 'dispatcher' && (lang === 'hi' ? 'हब डिस्पैच कंसोल: रूट व गाड़ियां' : 'Hub Dispatch Operations Console')}
              {role === 'admin' && (lang === 'hi' ? 'मुख्यालय नियंत्रण: सभी शाखाएं व राजस्व' : 'Headquarters Enterprise Command Center')}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-steel">
            <span>{lang === 'hi' ? 'सक्रिय रिकॉर्ड:' : 'VISIBLE:'} <strong className="text-yellow">{displayShipments.length}</strong> / {shipments.length}</span>
            <button
              onClick={() => {
                setShipments(getStoredShipments());
              }}
              className="text-yellow hover:text-white underline font-bold uppercase"
            >
              {lang === 'hi' ? 'रीलोड' : 'SYNC'}
            </button>
          </div>
        </div>

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-asphalt pb-4">
          <div>
            <div className="font-heading font-black text-xs text-orange tracking-widest uppercase mb-1">
              {t('dash.sub')}
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl uppercase text-asphalt leading-none">
              {t('dash.title')}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShipments(getStoredShipments());
              }}
              className="btn-industrial bg-chalk text-asphalt text-xs px-3.5 py-2.5 border-[1.5px] border-asphalt hover:bg-paper flex items-center gap-1.5 min-h-[44px]"
              title="Refresh parcel list"
            >
              <IndustrialIcon name="gauge" size={14} />
              <span>{lang === 'hi' ? 'ताज़ा करें' : 'REFRESH LIST'}</span>
            </button>
            <Link
              to="/create"
              className="btn-industrial bg-orange text-white text-xs px-4 py-2.5 border-[1.5px] border-asphalt hover:bg-orange-hover flex items-center gap-1.5 stamp-sm min-h-[44px]"
            >
              <IndustrialIcon name="plus" size={14} />
              <span>{t('nav.newShipment')}</span>
            </Link>
          </div>
        </div>

        {/* 1. Status Metric Counter Cards */}
        <div>
          <StatusCounterCards
            shipments={displayShipments}
            activeFilter={activeStatusFilter}
            onSelectFilter={(f) => setActiveStatusFilter(f)}
          />
        </div>

        {/* 2. Main Filterable Shipments Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="font-heading font-black text-sm uppercase tracking-wider text-asphalt flex items-center gap-2">
              <IndustrialIcon name="box" size={16} className="text-orange" />
              <span>
                {role === 'driver' 
                  ? (lang === 'hi' ? 'ड्राइवर डिलीवरी सूची' : 'DRIVER RUN DELIVERIES')
                  : role === 'customer'
                    ? (lang === 'hi' ? 'मेरे बुक किए गए पार्सल' : 'MY BOOKED CONSIGNMENTS')
                    : (lang === 'hi' ? 'मेरे सभी पार्सल की सूची' : 'ALL PARCELS IN MY ACCOUNT')}
              </span>
            </div>
            <div className="font-mono text-xs text-steel font-bold">
              {lang === 'hi' ? 'रीयल-टाइम स्थिति' : 'REAL-TIME STATUS'}
            </div>
          </div>
          <ShipmentTable
            shipments={displayShipments}
            activeFilter={activeStatusFilter}
            onFilterChange={(f) => setActiveStatusFilter(f)}
          />
        </div>

        {/* 3. Bottom Two Column: Performance Analytics & Fleet Roster */}
        {role !== 'customer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Performance & Velocity Chart - 7 cols */}
            <div className="lg:col-span-7">
              <PerformanceChart />
            </div>

            {/* Fleet Drivers Telematics - 5 cols */}
            <div className="lg:col-span-5">
              <FleetList drivers={drivers} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
