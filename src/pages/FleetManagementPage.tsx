import React, { useState, useEffect, useMemo } from 'react';
import {
  getVehicles,
  saveVehicle,
  deleteVehicle,
  getFleetDrivers,
  saveFleetDriver,
  deleteFleetDriver,
  getMaintenanceRecords,
  saveMaintenanceRecord,
} from '../data/mockAssets';
import type { Vehicle, FleetDriver, MaintenanceRecord, VehicleType, VehicleStatus, DriverStatus } from '../types/assets';
import { AppIcon } from '../components/common/AppIcon';
import { useEnterprise } from '../context/EnterpriseContext';

const VEHICLE_TYPES: VehicleType[] = [
  'Heavy Trucks',
  'Light Commercial Vehicles',
  'Trailers',
  'Container Trucks',
  'Refrigerated Trucks',
  'Tankers',
];

export const FleetManagementPage: React.FC = () => {
  const { branchLabel } = useEnterprise();
  const [activeTab, setActiveTab] = useState<'vehicles' | 'drivers' | 'maintenance'>('vehicles');

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => getVehicles());
  const [drivers, setDrivers] = useState<FleetDriver[]>(() => getFleetDrivers());
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(() => getMaintenanceRecords());

  // Search & Filters for Vehicles
  const [vehicleSearch, setVehicleSearch] = useState<string>('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('all');
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState<string>('all');
  const [vehicleSortField, setVehicleSortField] = useState<'plateNumber' | 'capacityKg' | 'status' | 'lastServiceDate'>('plateNumber');
  const [vehicleSortAsc, setVehicleSortAsc] = useState<boolean>(true);
  const [vehiclePage, setVehiclePage] = useState<number>(1);
  const pageSize = 6;

  // Search & Filters for Drivers
  const [driverSearch, setDriverSearch] = useState<string>('');
  const [driverStatusFilter, setDriverStatusFilter] = useState<string>('all');

  // Search & Filters for Maintenance
  const [maintSearch, setMaintSearch] = useState<string>('');
  const [maintStatusFilter, setMaintStatusFilter] = useState<string>('all');

  // Modal Dialog States
  const [showAddVehicleModal, setShowAddVehicleModal] = useState<boolean>(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);

  const [showAddDriverModal, setShowAddDriverModal] = useState<boolean>(false);
  const [editingDriver, setEditingDriver] = useState<FleetDriver | null>(null);
  const [viewingDriver, setViewingDriver] = useState<FleetDriver | null>(null);
  const [deletingDriverId, setDeletingDriverId] = useState<string | null>(null);

  const [showAddMaintModal, setShowAddMaintModal] = useState<boolean>(false);

  // Form State for Vehicle Add/Edit
  const [vehForm, setVehForm] = useState<Partial<Vehicle>>(() => ({
    plateNumber: '',
    makeModel: '',
    type: 'Heavy Trucks',
    capacityKg: 10000,
    capacityCbm: 35,
    assignedDriverName: '',
    currentLocation: '',
    status: 'available',
    fuelLevelPercent: 85,
    odometerKm: 30000,
    lastServiceDate: '2026-10-15',
    nextServiceDue: '2026-12-31',
    insuranceExpiry: '2027-06-30',
    pucExpiry: '2027-01-30',
  }));

  // Form State for Driver Add/Edit
  const [drvForm, setDrvForm] = useState<Partial<FleetDriver>>({
    name: '',
    phone: '+91 ',
    email: '',
    licenseNumber: '',
    licenseType: 'HMV Commercial Heavy Transport',
    licenseExpiry: '2029-12-31',
    assignedVehiclePlate: '',
    status: 'available',
    currentLocation: 'Hub Yard',
    rating: 4.9,
    shiftHoursLogged: 0,
    experienceYears: 5,
  });

  // Form State for Maintenance Add
  const [maintForm, setMaintForm] = useState<Partial<MaintenanceRecord>>(() => ({
    vehiclePlate: '',
    serviceDate: '2026-10-15',
    maintenanceType: 'Routine Oil & Inspection',
    costInr: 8000,
    serviceCenter: '',
    nextServiceDate: '2026-12-31',
    status: 'completed',
    technicianNotes: '',
  }));

  // Reactive listeners for storage updates
  useEffect(() => {
    const handleUpdate = () => {
      setVehicles(getVehicles());
      setDrivers(getFleetDrivers());
      setMaintenanceRecords(getMaintenanceRecords());
    };
    window.addEventListener('freightline_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('freightline_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Fleet Overview KPI metrics
  const kpis = useMemo(() => {
    const totalVehicles = vehicles.length;
    const available = vehicles.filter(v => v.status === 'available').length;
    const inTransit = vehicles.filter(v => v.status === 'in_transit').length;
    const maintenance = vehicles.filter(v => v.status === 'maintenance').length;
    const activeDrivers = drivers.filter(d => d.status === 'on_route' || d.status === 'available').length;
    return { totalVehicles, available, inTransit, maintenance, activeDrivers };
  }, [vehicles, drivers]);

  // Filtered & Sorted Vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      if (vehicleTypeFilter !== 'all' && v.type !== vehicleTypeFilter) return false;
      if (vehicleStatusFilter !== 'all' && v.status !== vehicleStatusFilter) return false;
      if (vehicleSearch.trim()) {
        const q = vehicleSearch.toLowerCase().trim();
        const matchPlate = v.plateNumber.toLowerCase().includes(q);
        const matchModel = v.makeModel.toLowerCase().includes(q);
        const matchLoc = v.currentLocation.toLowerCase().includes(q);
        const matchDrv = (v.assignedDriverName || '').toLowerCase().includes(q);
        return matchPlate || matchModel || matchLoc || matchDrv;
      }
      return true;
    }).sort((a, b) => {
      let cmp = 0;
      if (vehicleSortField === 'plateNumber') cmp = a.plateNumber.localeCompare(b.plateNumber);
      else if (vehicleSortField === 'capacityKg') cmp = a.capacityKg - b.capacityKg;
      else if (vehicleSortField === 'status') cmp = a.status.localeCompare(b.status);
      else cmp = a.lastServiceDate.localeCompare(b.lastServiceDate);
      return vehicleSortAsc ? cmp : -cmp;
    });
  }, [vehicles, vehicleTypeFilter, vehicleStatusFilter, vehicleSearch, vehicleSortField, vehicleSortAsc]);

  const paginatedVehicles = useMemo(() => {
    const start = (vehiclePage - 1) * pageSize;
    return filteredVehicles.slice(start, start + pageSize);
  }, [filteredVehicles, vehiclePage]);

  const totalVehiclePages = Math.ceil(filteredVehicles.length / pageSize) || 1;

  // Filtered Drivers
  const filteredDrivers = useMemo(() => {
    return drivers.filter(d => {
      if (driverStatusFilter !== 'all' && d.status !== driverStatusFilter) return false;
      if (driverSearch.trim()) {
        const q = driverSearch.toLowerCase().trim();
        const matchName = d.name.toLowerCase().includes(q);
        const matchPhone = d.phone.toLowerCase().includes(q);
        const matchLic = d.licenseNumber.toLowerCase().includes(q);
        const matchPlate = (d.assignedVehiclePlate || '').toLowerCase().includes(q);
        return matchName || matchPhone || matchLic || matchPlate;
      }
      return true;
    });
  }, [drivers, driverStatusFilter, driverSearch]);

  // Filtered Maintenance Records
  const filteredMaintenance = useMemo(() => {
    return maintenanceRecords.filter(m => {
      if (maintStatusFilter !== 'all' && m.status !== maintStatusFilter) return false;
      if (maintSearch.trim()) {
        const q = maintSearch.toLowerCase().trim();
        const matchPlate = m.vehiclePlate.toLowerCase().includes(q);
        const matchType = m.maintenanceType.toLowerCase().includes(q);
        const matchCenter = m.serviceCenter.toLowerCase().includes(q);
        return matchPlate || matchType || matchCenter;
      }
      return true;
    });
  }, [maintenanceRecords, maintStatusFilter, maintSearch]);

  // Handlers for Vehicle Actions
  const handleOpenAddVehicle = () => {
    setVehForm({
      plateNumber: '',
      makeModel: '',
      type: 'Heavy Trucks',
      capacityKg: 10000,
      capacityCbm: 35,
      assignedDriverName: '',
      currentLocation: `${branchLabel} Depot`,
      status: 'available',
      fuelLevelPercent: 90,
      odometerKm: 25000,
      lastServiceDate: new Date().toISOString().split('T')[0],
      nextServiceDue: '2026-12-31',
      insuranceExpiry: '2027-06-30',
      pucExpiry: '2027-01-30',
    });
    setEditingVehicle(null);
    setShowAddVehicleModal(true);
  };

  const handleOpenEditVehicle = (v: Vehicle) => {
    setVehForm({ ...v });
    setEditingVehicle(v);
    setShowAddVehicleModal(true);
  };

  const handleSaveVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehForm.plateNumber || !vehForm.makeModel) return;

    const vehicleId = editingVehicle?.id || `VEH-${Math.floor(100 + Math.random() * 900)}`;
    const newVehicle: Vehicle = {
      id: vehicleId,
      plateNumber: vehForm.plateNumber.toUpperCase(),
      makeModel: vehForm.makeModel,
      type: (vehForm.type as VehicleType) || 'Heavy Trucks',
      capacityKg: Number(vehForm.capacityKg) || 10000,
      capacityCbm: Number(vehForm.capacityCbm) || 35,
      assignedDriverName: vehForm.assignedDriverName || undefined,
      currentLocation: vehForm.currentLocation || `${branchLabel} Depot`,
      status: (vehForm.status as VehicleStatus) || 'available',
      fuelLevelPercent: Number(vehForm.fuelLevelPercent) || 85,
      odometerKm: Number(vehForm.odometerKm) || 30000,
      lastServiceDate: vehForm.lastServiceDate || new Date().toISOString().split('T')[0],
      nextServiceDue: vehForm.nextServiceDue || '2026-12-31',
      insuranceExpiry: vehForm.insuranceExpiry || '2027-06-30',
      pucExpiry: vehForm.pucExpiry || '2027-01-30',
    };

    saveVehicle(newVehicle);
    setShowAddVehicleModal(false);
    setEditingVehicle(null);
  };

  const handleConfirmDeleteVehicle = () => {
    if (deletingVehicleId) {
      deleteVehicle(deletingVehicleId);
      setDeletingVehicleId(null);
    }
  };

  // Handlers for Driver Actions
  const handleOpenAddDriver = () => {
    setDrvForm({
      name: '',
      phone: '+91 ',
      email: '',
      licenseNumber: '',
      licenseType: 'HMV Commercial Heavy Transport',
      licenseExpiry: '2029-12-31',
      assignedVehiclePlate: '',
      status: 'available',
      currentLocation: `${branchLabel} Hub`,
      rating: 4.9,
      shiftHoursLogged: 0,
      experienceYears: 5,
    });
    setEditingDriver(null);
    setShowAddDriverModal(true);
  };

  const handleOpenEditDriver = (d: FleetDriver) => {
    setDrvForm({ ...d });
    setEditingDriver(d);
    setShowAddDriverModal(true);
  };

  const handleSaveDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drvForm.name || !drvForm.phone || !drvForm.licenseNumber) return;

    const driverId = editingDriver?.id || `DRV-${Math.floor(100 + Math.random() * 900)}`;
    const newDriver: FleetDriver = {
      id: driverId,
      name: drvForm.name,
      phone: drvForm.phone,
      email: drvForm.email || undefined,
      licenseNumber: drvForm.licenseNumber.toUpperCase(),
      licenseType: drvForm.licenseType || 'HMV Commercial Heavy Transport',
      licenseExpiry: drvForm.licenseExpiry || '2029-12-31',
      assignedVehiclePlate: drvForm.assignedVehiclePlate || undefined,
      status: (drvForm.status as DriverStatus) || 'available',
      currentLocation: drvForm.currentLocation || `${branchLabel} Hub`,
      rating: Number(drvForm.rating) || 4.9,
      shiftHoursLogged: Number(drvForm.shiftHoursLogged) || 0,
      experienceYears: Number(drvForm.experienceYears) || 5,
    };

    saveFleetDriver(newDriver);
    setShowAddDriverModal(false);
    setEditingDriver(null);
  };

  const handleConfirmDeleteDriver = () => {
    if (deletingDriverId) {
      deleteFleetDriver(deletingDriverId);
      setDeletingDriverId(null);
    }
  };

  // Handlers for Maintenance Actions
  const handleSaveMaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintForm.vehiclePlate || !maintForm.maintenanceType) return;

    const recordId = `MNT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const targetVeh = vehicles.find(v => v.plateNumber === maintForm.vehiclePlate);
    const newRecord: MaintenanceRecord = {
      id: recordId,
      vehicleId: targetVeh?.id || 'VEH-EXT',
      vehiclePlate: maintForm.vehiclePlate.toUpperCase(),
      serviceDate: maintForm.serviceDate || new Date().toISOString().split('T')[0],
      maintenanceType: maintForm.maintenanceType || 'Routine Oil & Inspection',
      costInr: Number(maintForm.costInr) || 8000,
      serviceCenter: maintForm.serviceCenter || 'VELTRAX Authorized Fleet Depot',
      nextServiceDate: maintForm.nextServiceDate || '2026-12-31',
      status: (maintForm.status as MaintenanceRecord['status']) || 'completed',
      technicianNotes: maintForm.technicianNotes,
    };

    saveMaintenanceRecord(newRecord);

    // If status is in_progress, also set vehicle status to maintenance
    if (targetVeh && newRecord.status === 'in_progress') {
      saveVehicle({ ...targetVeh, status: 'maintenance' });
    }

    setShowAddMaintModal(false);
  };

  // Status Badge Helper
  const getVehicleStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Available
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
            In Transit
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Under Maintenance
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Off Duty
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
              Fleet & Resource Management
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-navy-50 text-navy-800 border border-navy-200">
              <AppIcon name="fleet" size={13} />
              <span>Commercial Fleet</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time fleet operations, commercial driver assignments, telematics, and maintenance scheduling for{' '}
            <strong className="text-slate-700 font-semibold">{branchLabel}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === 'vehicles' && (
            <button
              onClick={handleOpenAddVehicle}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-saas-sm transition-colors"
            >
              <AppIcon name="plus" size={14} />
              <span>Add Vehicle</span>
            </button>
          )}

          {activeTab === 'drivers' && (
            <button
              onClick={handleOpenAddDriver}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-saas-sm transition-colors"
            >
              <AppIcon name="plus" size={14} />
              <span>Add Driver</span>
            </button>
          )}

          {activeTab === 'maintenance' && (
            <button
              onClick={() => {
                setMaintForm({
                  vehiclePlate: vehicles[0]?.plateNumber || '',
                  serviceDate: new Date().toISOString().split('T')[0],
                  maintenanceType: 'Routine Oil & Inspection',
                  costInr: 8500,
                  serviceCenter: 'Authorized Commercial Depot',
                  nextServiceDate: '2026-12-31',
                  status: 'completed',
                  technicianNotes: '',
                });
                setShowAddMaintModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-saas-sm transition-colors"
            >
              <AppIcon name="wrench" size={14} />
              <span>Log Service Record</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Fleet Overview KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Vehicles */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Fleet</span>
            <div className="w-7 h-7 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center">
              <AppIcon name="truck" size={15} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
            {kpis.totalVehicles}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Commercial active assets</div>
        </div>

        {/* Available */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Available</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <AppIcon name="check-circle" size={15} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-emerald-600">
            {kpis.available}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-semibold">Ready for dispatch</div>
        </div>

        {/* In-Transit */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">In-Transit</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <AppIcon name="tracking" size={15} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-sky-600">
            {kpis.inTransit}
          </div>
          <div className="mt-1 text-[11px] text-sky-700 font-semibold">Active highway run</div>
        </div>

        {/* Maintenance */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Maintenance</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AppIcon name="wrench" size={15} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-amber-600">
            {kpis.maintenance}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Service workshop queue</div>
        </div>

        {/* Active Drivers */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Licensed Drivers</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <AppIcon name="user" size={15} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
            {kpis.activeDrivers}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">HMV certified drivers</div>
        </div>
      </div>

      {/* 3. Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        {[
          { key: 'vehicles', label: 'Vehicles Fleet', count: vehicles.length, icon: 'truck' as const },
          { key: 'drivers', label: 'Drivers Directory', count: drivers.length, icon: 'user' as const },
          { key: 'maintenance', label: 'Maintenance Logs', count: maintenanceRecords.length, icon: 'wrench' as const },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                isActive
                  ? 'border-orange-500 text-orange-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <AppIcon name={tab.icon} size={14} />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[11px] ${isActive ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. TAB CONTENT: VEHICLES MANAGEMENT */}
      {activeTab === 'vehicles' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <AppIcon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={vehicleSearch}
                onChange={(e) => {
                  setVehicleSearch(e.target.value);
                  setVehiclePage(1);
                }}
                placeholder="Search registration plate, model, driver, location..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Type Filter */}
              <select
                value={vehicleTypeFilter}
                onChange={(e) => {
                  setVehicleTypeFilter(e.target.value);
                  setVehiclePage(1);
                }}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Vehicle Types</option>
                {VEHICLE_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={vehicleStatusFilter}
                onChange={(e) => {
                  setVehicleStatusFilter(e.target.value);
                  setVehiclePage(1);
                }}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="in_transit">In Transit</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="off_duty">Off Duty</option>
              </select>
            </div>
          </div>

          {/* Vehicles Data Grid Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-saas-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th
                      onClick={() => {
                        setVehicleSortField('plateNumber');
                        setVehicleSortAsc(prev => !prev);
                      }}
                      className="py-3 px-4 cursor-pointer hover:text-slate-900 select-none"
                    >
                      Registration / Model
                    </th>
                    <th className="py-3 px-4">Type</th>
                    <th
                      onClick={() => {
                        setVehicleSortField('capacityKg');
                        setVehicleSortAsc(prev => !prev);
                      }}
                      className="py-3 px-4 cursor-pointer hover:text-slate-900 select-none"
                    >
                      Capacity
                    </th>
                    <th className="py-3 px-4">Assigned Driver</th>
                    <th className="py-3 px-4">Current Location</th>
                    <th
                      onClick={() => {
                        setVehicleSortField('status');
                        setVehicleSortAsc(prev => !prev);
                      }}
                      className="py-3 px-4 cursor-pointer hover:text-slate-900 select-none"
                    >
                      Status
                    </th>
                    <th
                      onClick={() => {
                        setVehicleSortField('lastServiceDate');
                        setVehicleSortAsc(prev => !prev);
                      }}
                      className="py-3 px-4 cursor-pointer hover:text-slate-900 select-none"
                    >
                      Last Service
                    </th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {paginatedVehicles.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">
                        No vehicles found matching current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedVehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setViewingVehicle(v)}
                            className="font-mono font-bold text-slate-900 hover:text-orange-600 text-left block"
                          >
                            {v.plateNumber}
                          </button>
                          <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                            {v.makeModel}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {v.type}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">
                            {(v.capacityKg / 1000).toFixed(1)} MT ({v.capacityKg.toLocaleString()} kg)
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {v.capacityCbm} CBM
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {v.assignedDriverName ? (
                            <span className="font-medium text-slate-800 flex items-center gap-1">
                              <AppIcon name="user" size={12} className="text-slate-400" />
                              <span>{v.assignedDriverName}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="text-slate-700 font-medium truncate max-w-[180px]">
                            {v.currentLocation}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Odo: {v.odometerKm.toLocaleString()} km
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {getVehicleStatusBadge(v.status)}
                        </td>

                        <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                          {v.lastServiceDate}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setViewingVehicle(v)}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                              title="View full specs"
                            >
                              <AppIcon name="external-link" size={14} />
                            </button>
                            <button
                              onClick={() => handleOpenEditVehicle(v)}
                              className="p-1 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded"
                              title="Edit vehicle"
                            >
                              <AppIcon name="edit" size={14} />
                            </button>
                            <button
                              onClick={() => setDeletingVehicleId(v.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete vehicle"
                            >
                              <AppIcon name="trash" size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing <strong className="text-slate-700">{paginatedVehicles.length}</strong> of{' '}
                <strong className="text-slate-700">{filteredVehicles.length}</strong> vehicles
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVehiclePage(p => Math.max(1, p - 1))}
                  disabled={vehiclePage === 1}
                  className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-600 disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="font-mono text-xs">
                  {vehiclePage} / {totalVehiclePages}
                </span>
                <button
                  onClick={() => setVehiclePage(p => Math.min(totalVehiclePages, p + 1))}
                  disabled={vehiclePage === totalVehiclePages}
                  className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-600 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: DRIVERS DIRECTORY */}
      {activeTab === 'drivers' && (
        <div className="space-y-4">
          {/* Driver Search & Filter */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <AppIcon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={driverSearch}
                onChange={(e) => setDriverSearch(e.target.value)}
                placeholder="Search driver name, phone, licence number..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <select
              value={driverStatusFilter}
              onChange={(e) => setDriverStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Driver Statuses</option>
              <option value="available">Available</option>
              <option value="on_route">On Route</option>
              <option value="off_duty">Off Duty</option>
              <option value="leave">On Leave</option>
            </select>
          </div>

          {/* Drivers Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredDrivers.map((d) => (
              <div
                key={d.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-heading font-bold text-sm text-slate-900">
                        {d.name}
                      </h3>
                      <span className="font-mono text-[10px] text-slate-400">
                        {d.id}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        d.status === 'available'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : d.status === 'on_route'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {d.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Phone:</span>
                      <span className="font-mono font-medium text-slate-800">{d.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Licence:</span>
                      <span className="font-mono text-[11px] text-slate-700">{d.licenseNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Assigned:</span>
                      <span className="font-mono font-semibold text-slate-900">
                        {d.assignedVehiclePlate || 'None'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Rating:</span>
                      <span className="font-bold text-amber-600">★ {d.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {d.experienceYears} yrs exp
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingDriver(d)}
                      className="px-2 py-1 text-slate-600 hover:bg-slate-100 rounded text-xs font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleOpenEditDriver(d)}
                      className="px-2 py-1 text-orange-600 hover:bg-orange-50 rounded text-xs font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingDriverId(d.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <AppIcon name="trash" size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: MAINTENANCE MANAGEMENT */}
      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <AppIcon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={maintSearch}
                onChange={(e) => setMaintSearch(e.target.value)}
                placeholder="Search maintenance record, vehicle plate, workshop..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <select
              value={maintStatusFilter}
              onChange={(e) => setMaintStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Service Statuses</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          {/* Maintenance Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-saas-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Record ID</th>
                    <th className="py-3 px-4">Vehicle Plate</th>
                    <th className="py-3 px-4">Service Type</th>
                    <th className="py-3 px-4">Service Center</th>
                    <th className="py-3 px-4">Cost</th>
                    <th className="py-3 px-4">Service Date</th>
                    <th className="py-3 px-4">Next Due</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMaintenance.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {m.id}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-orange-600">
                        {m.vehiclePlate}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {m.maintenanceType}
                        {m.technicianNotes && (
                          <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                            {m.technicianNotes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 truncate max-w-[200px]">
                        {m.serviceCenter}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        ₹{m.costInr.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {m.serviceDate}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {m.nextServiceDate}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            m.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : m.status === 'in_progress'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {m.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: ADD / EDIT VEHICLE */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-saas-lg max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-heading font-bold text-base text-slate-900">
                {editingVehicle ? 'Edit Fleet Vehicle' : 'Add New Commercial Vehicle'}
              </h3>
              <button
                onClick={() => setShowAddVehicleModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <AppIcon name="x" size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveVehicleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration Plate Number *</label>
                  <input
                    type="text"
                    required
                    value={vehForm.plateNumber}
                    onChange={(e) => setVehForm(prev => ({ ...prev, plateNumber: e.target.value }))}
                    placeholder="e.g. DL-01-AB-8820"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono uppercase text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Make & Model *</label>
                  <input
                    type="text"
                    required
                    value={vehForm.makeModel}
                    onChange={(e) => setVehForm(prev => ({ ...prev, makeModel: e.target.value }))}
                    placeholder="e.g. Tata LPT 1918 Heavy Multi-Axle"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vehicle Classification *</label>
                  <select
                    value={vehForm.type}
                    onChange={(e) => setVehForm(prev => ({ ...prev, type: e.target.value as VehicleType }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                  >
                    {VEHICLE_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payload Capacity (Kg) *</label>
                  <input
                    type="number"
                    required
                    value={vehForm.capacityKg}
                    onChange={(e) => setVehForm(prev => ({ ...prev, capacityKg: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Volumetric Capacity (CBM)</label>
                  <input
                    type="number"
                    value={vehForm.capacityCbm}
                    onChange={(e) => setVehForm(prev => ({ ...prev, capacityCbm: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Driver</label>
                  <input
                    type="text"
                    value={vehForm.assignedDriverName || ''}
                    onChange={(e) => setVehForm(prev => ({ ...prev, assignedDriverName: e.target.value }))}
                    placeholder="e.g. Mukesh Yadav"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Base / Depot Location</label>
                  <input
                    type="text"
                    value={vehForm.currentLocation}
                    onChange={(e) => setVehForm(prev => ({ ...prev, currentLocation: e.target.value }))}
                    placeholder="e.g. Okhla Central Depot"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Operational Status</label>
                  <select
                    value={vehForm.status}
                    onChange={(e) => setVehForm(prev => ({ ...prev, status: e.target.value as VehicleStatus }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="available">Available</option>
                    <option value="in_transit">In Transit</option>
                    <option value="maintenance">Under Maintenance</option>
                    <option value="off_duty">Off Duty</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-saas-sm transition-colors"
                >
                  {editingVehicle ? 'Update Vehicle' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL: VIEW VEHICLE DETAILS */}
      {viewingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-saas-lg max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-xs text-orange-600 font-bold">{viewingVehicle.id}</span>
                <h3 className="font-heading font-black text-lg text-slate-900">{viewingVehicle.plateNumber}</h3>
              </div>
              <button
                onClick={() => setViewingVehicle(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <AppIcon name="x" size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Model</span>
                  <div className="font-medium text-slate-900">{viewingVehicle.makeModel}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Type</span>
                  <div className="font-medium text-slate-900">{viewingVehicle.type}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Payload Capacity</span>
                  <div className="font-medium text-slate-900">{viewingVehicle.capacityKg.toLocaleString()} kg ({viewingVehicle.capacityCbm} CBM)</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Current State</span>
                  <div>{getVehicleStatusBadge(viewingVehicle.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2">
                <div>
                  <span className="text-slate-400 text-[10px]">Assigned Driver:</span>
                  <div className="font-semibold text-slate-800">{viewingVehicle.assignedDriverName || 'None'}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Odometer:</span>
                  <div className="font-mono font-semibold text-slate-800">{viewingVehicle.odometerKm.toLocaleString()} km</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Insurance Expiry:</span>
                  <div className="font-mono text-slate-700">{viewingVehicle.insuranceExpiry}</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">PUC Certificate:</span>
                  <div className="font-mono text-slate-700">{viewingVehicle.pucExpiry}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewingVehicle(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL: DELETE CONFIRMATION */}
      {deletingVehicleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-saas-lg max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AppIcon name="alert" size={20} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-slate-900">Delete Fleet Vehicle?</h4>
                <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingVehicleId(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteVehicle}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. MODAL: ADD / EDIT DRIVER */}
      {showAddDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-saas-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-heading font-bold text-base text-slate-900">
                {editingDriver ? 'Edit Driver Record' : 'Register Commercial Driver'}
              </h3>
              <button onClick={() => setShowAddDriverModal(false)} className="text-slate-400 hover:text-slate-600">
                <AppIcon name="x" size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveDriverSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Driver Full Name *</label>
                <input
                  type="text"
                  required
                  value={drvForm.name}
                  onChange={(e) => setDrvForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Mukesh Yadav"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={drvForm.phone}
                    onChange={(e) => setDrvForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Licence Number *</label>
                  <input
                    type="text"
                    required
                    value={drvForm.licenseNumber}
                    onChange={(e) => setDrvForm(p => ({ ...p, licenseNumber: e.target.value }))}
                    placeholder="DL-04201889201"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono uppercase text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Licence Type</label>
                  <input
                    type="text"
                    value={drvForm.licenseType}
                    onChange={(e) => setDrvForm(p => ({ ...p, licenseType: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Licence Expiry</label>
                  <input
                    type="date"
                    value={drvForm.licenseExpiry}
                    onChange={(e) => setDrvForm(p => ({ ...p, licenseExpiry: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Vehicle</label>
                  <input
                    type="text"
                    value={drvForm.assignedVehiclePlate || ''}
                    onChange={(e) => setDrvForm(p => ({ ...p, assignedVehiclePlate: e.target.value }))}
                    placeholder="e.g. RJ-14-GA-8820"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono uppercase text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Availability</label>
                  <select
                    value={drvForm.status}
                    onChange={(e) => setDrvForm(p => ({ ...p, status: e.target.value as DriverStatus }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="available">Available</option>
                    <option value="on_route">On Route</option>
                    <option value="off_duty">Off Duty</option>
                    <option value="leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddDriverModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-saas-sm"
                >
                  {editingDriver ? 'Save Driver' : 'Add Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. MODAL: VIEW DRIVER DETAILS */}
      {viewingDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-saas-lg max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-xs text-orange-600 font-bold">{viewingDriver.id}</span>
                <h3 className="font-heading font-black text-lg text-slate-900">{viewingDriver.name}</h3>
              </div>
              <button onClick={() => setViewingDriver(null)} className="text-slate-400 hover:text-slate-600">
                <AppIcon name="x" size={16} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Mobile Phone:</span>
                <span className="font-mono font-semibold text-slate-800">{viewingDriver.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Commercial Licence:</span>
                <span className="font-mono text-slate-800">{viewingDriver.licenseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Licence Expiry:</span>
                <span className="font-mono text-slate-800">{viewingDriver.licenseExpiry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Vehicle:</span>
                <span className="font-mono font-bold text-slate-900">{viewingDriver.assignedVehiclePlate || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Experience:</span>
                <span className="font-medium text-slate-800">{viewingDriver.experienceYears} Years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Safety Rating:</span>
                <span className="font-bold text-amber-600">★ {viewingDriver.rating} / 5.0</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewingDriver(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 12. MODAL: LOG MAINTENANCE RECORD */}
      {showAddMaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-saas-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Log Maintenance & Inspection
              </h3>
              <button onClick={() => setShowAddMaintModal(false)} className="text-slate-400 hover:text-slate-600">
                <AppIcon name="x" size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveMaintSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Vehicle Plate *</label>
                <select
                  required
                  value={maintForm.vehiclePlate}
                  onChange={(e) => setMaintForm(p => ({ ...p, vehiclePlate: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:ring-2 focus:ring-orange-500"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.plateNumber}>
                      {v.plateNumber} ({v.makeModel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Maintenance / Service Type *</label>
                <input
                  type="text"
                  required
                  value={maintForm.maintenanceType}
                  onChange={(e) => setMaintForm(p => ({ ...p, maintenanceType: e.target.value }))}
                  placeholder="e.g. Brake Overhaul & Hydraulic Check"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Service Cost (₹)</label>
                  <input
                    type="number"
                    value={maintForm.costInr}
                    onChange={(e) => setMaintForm(p => ({ ...p, costInr: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Service Status</label>
                  <select
                    value={maintForm.status}
                    onChange={(e) => setMaintForm(p => ({ ...p, status: e.target.value as MaintenanceRecord['status'] }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="completed">Completed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Authorized Workshop / Center</label>
                <input
                  type="text"
                  value={maintForm.serviceCenter}
                  onChange={(e) => setMaintForm(p => ({ ...p, serviceCenter: e.target.value }))}
                  placeholder="e.g. Tata Motors Authorized Okhla Workshop"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technician Notes</label>
                <textarea
                  value={maintForm.technicianNotes}
                  onChange={(e) => setMaintForm(p => ({ ...p, technicianNotes: e.target.value }))}
                  rows={2}
                  placeholder="Parts replaced, pressure checks, test drive observations..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddMaintModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-saas-sm"
                >
                  Log Maintenance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 13. MODAL: DELETE DRIVER CONFIRMATION */}
      {deletingDriverId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-saas-lg max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AppIcon name="alert" size={20} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-slate-900">Remove Driver Record?</h4>
                <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingDriverId(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteDriver}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
