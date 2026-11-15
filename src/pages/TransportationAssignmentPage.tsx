import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getStoredShipments, getDrivers, getTransportAssignments, saveTransportAssignment } from '../data/mockShipments';
import type {
  Shipment,
  DriverInfo,
  TransportMode,
  CarrierType,
  TransportAssignment,
  RoadAssignmentDetails,
  RailAssignmentDetails,
  AirAssignmentDetails,
  SeaAssignmentDetails,
} from '../types';
import { AppIcon } from '../components/common/AppIcon';
import { useEnterprise } from '../context/EnterpriseContext';

export const TransportationAssignmentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedShipmentId = searchParams.get('shipmentId');

  const { branchLabel } = useEnterprise();
  const [shipments, setShipments] = useState<Shipment[]>(() => getStoredShipments());
  const [drivers] = useState<DriverInfo[]>(() => getDrivers());
  const [assignments, setAssignments] = useState<TransportAssignment[]>(() => getTransportAssignments());

  // Form State
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(() => {
    if (preselectedShipmentId) return preselectedShipmentId;
    const initialPending = getStoredShipments().find(s => s.status === 'pending');
    return initialPending?.id || (getStoredShipments()[0]?.id || '');
  });

  const [activeMode, setActiveMode] = useState<TransportMode>('road');
  const [carrierType, setCarrierType] = useState<CarrierType>('in_house');
  const [carrierName, setCarrierName] = useState<string>('FreightLine Express Road Fleet');
  const [notes, setNotes] = useState<string>('');
  const [assignedBy, setAssignedBy] = useState<string>('Fleet Operations Desk');
  const [autoDispatch, setAutoDispatch] = useState<boolean>(true);

  // Success message toast
  const [successToast, setSuccessToast] = useState<{ message: string; assignmentId: string } | null>(null);

  // Mode Specific Form Fields
  // Road
  const [roadVehicleType, setRoadVehicleType] = useState<string>('Eicher Pro 2049 (14 Ft Closed Container)');
  const [roadPlate, setRoadPlate] = useState<string>('RJ-14-GA-8820');
  const [roadDriverId, setRoadDriverId] = useState<string>('DRV-104');
  const [roadDriverName, setRoadDriverName] = useState<string>('Mukesh Yadav');
  const [roadDriverPhone, setRoadDriverPhone] = useState<string>('+91 98110 99420');
  const [roadManifestId, setRoadManifestId] = useState<string>(() => 'MNF-991240');

  // Rail
  const [railCarrier, setRailCarrier] = useState<string>('CONCOR (Container Corporation of India)');
  const [railTrainNo, setRailTrainNo] = useState<string>('Rake-CC-9412 (Train 12952)');
  const [railWagonId, setRailWagonId] = useState<string>('CR-WGN-77142');
  const [railRrNumber, setRailRrNumber] = useState<string>(() => 'RR-NR-904128');
  const [railOriginTerminal, setRailOriginTerminal] = useState<string>('ICD Tughlakabad (TKD), Delhi');
  const [railDestTerminal, setRailDestTerminal] = useState<string>('Shalimar Goods Siding (SHM), Kolkata');

  // Air
  const [airAirline, setAirAirline] = useState<string>('IndiGo CarGo');
  const [airFlightNo, setAirFlightNo] = useState<string>('6E-8291');
  const [airAwbNumber, setAirAwbNumber] = useState<string>('312-99418290');
  const [airOriginAirport, setAirOriginAirport] = useState<string>('DEL - Indira Gandhi Intl, New Delhi');
  const [airDestAirport, setAirDestAirport] = useState<string>('BLR - Kempegowda Intl, Bengaluru');
  const [airUldTag, setAirUldTag] = useState<string>('ULD-AKE-49120');

  // Sea
  const [seaShippingLine, setSeaShippingLine] = useState<string>('Maersk Line India');
  const [seaVesselName, setSeaVesselName] = useState<string>('MV Maersk Chennai');
  const [seaVoyageNo, setSeaVoyageNo] = useState<string>('VOY-2026-E12');
  const [seaContainerNo, setSeaContainerNo] = useState<string>('MSKU-882914-3');
  const [seaSealNo, setSeaSealNo] = useState<string>(() => 'SEAL-IN-49201');
  const [seaMblNo, setSeaMblNo] = useState<string>('MAEU-9921405');
  const [seaPol, setSeaPol] = useState<string>('INBOM - JNPT Nhava Sheva Port, Mumbai');
  const [seaPod, setSeaPod] = useState<string>('INMAA - Chennai International Port');

  useEffect(() => {
    const handleUpdate = () => {
      setShipments(getStoredShipments());
      setAssignments(getTransportAssignments());
    };
    window.addEventListener('freightline_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('freightline_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Sync selected shipment details when user changes selection
  const selectedShipment = useMemo(() => {
    return shipments.find(s => s.id === selectedShipmentId) || shipments[0];
  }, [shipments, selectedShipmentId]);

  const handleSelectShipment = (shipmentId: string) => {
    setSelectedShipmentId(shipmentId);
    const target = shipments.find(s => s.id === shipmentId);
    if (!target) return;
    if (target.serviceMode === 'intermodal_rail') {
      setActiveMode('rail');
      setCarrierType('third_party');
      setCarrierName('CONCOR (Container Corporation of India)');
    } else if (target.serviceMode === 'air_express') {
      setActiveMode('air');
      setCarrierType('third_party');
      setCarrierName('IndiGo CarGo Express');
    } else if (target.serviceMode === 'ocean_freight') {
      setActiveMode('sea');
      setCarrierType('third_party');
      setCarrierName('Maersk Coastal Shipping');
    } else {
      setActiveMode('road');
      setCarrierType('in_house');
      setCarrierName('FreightLine Express Road Fleet');
    }
  };

  // When driver picker is changed, update driver info
  const handleDriverChange = (driverId: string) => {
    setRoadDriverId(driverId);
    const d = drivers.find(item => item.id === driverId);
    if (d) {
      setRoadDriverName(d.name);
      setRoadDriverPhone(d.phone);
      setRoadPlate(d.vehiclePlate);
      setRoadVehicleType(d.vehicleType);
    }
  };

  // Submit and save transportation assignment
  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;

    const assignmentId = `ASN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleString('en-IN');

    let roadDetails: RoadAssignmentDetails | undefined;
    let railDetails: RailAssignmentDetails | undefined;
    let airDetails: AirAssignmentDetails | undefined;
    let seaDetails: SeaAssignmentDetails | undefined;

    if (activeMode === 'road') {
      roadDetails = {
        vehicleType: roadVehicleType,
        vehiclePlate: roadPlate,
        driverId: roadDriverId,
        driverName: roadDriverName,
        driverPhone: roadDriverPhone,
        tripManifestId: roadManifestId,
      };
    } else if (activeMode === 'rail') {
      railDetails = {
        railCarrier,
        trainRakeNo: railTrainNo,
        wagonId: railWagonId,
        rrNumber: railRrNumber,
        originTerminal: railOriginTerminal,
        destinationTerminal: railDestTerminal,
      };
    } else if (activeMode === 'air') {
      airDetails = {
        airline: airAirline,
        flightNumber: airFlightNo,
        awbNumber: airAwbNumber,
        originAirport: airOriginAirport,
        destinationAirport: airDestAirport,
        cargoHoldOrUld: airUldTag,
      };
    } else if (activeMode === 'sea') {
      seaDetails = {
        shippingLine: seaShippingLine,
        vesselName: seaVesselName,
        voyageNumber: seaVoyageNo,
        containerNumber: seaContainerNo,
        sealNumber: seaSealNo,
        mblNumber: seaMblNo,
        portOfLoading: seaPol,
        portOfDischarge: seaPod,
      };
    }

    const newAssignment: TransportAssignment = {
      id: assignmentId,
      shipmentId: selectedShipment.id,
      mode: activeMode,
      carrierType,
      carrierName,
      status: autoDispatch ? 'in_transit' : 'assigned',
      assignedAt: nowStr,
      dispatchedAt: autoDispatch ? nowStr : undefined,
      estimatedDelivery: selectedShipment.eta,
      notes,
      assignedBy,
      roadDetails,
      railDetails,
      airDetails,
      seaDetails,
    };

    saveTransportAssignment(newAssignment, autoDispatch);
    setSuccessToast({
      message: `Consignment ${selectedShipment.id} successfully allocated to ${carrierName} via ${activeMode.toUpperCase()} mode!`,
      assignmentId,
    });

    // Refresh states
    setShipments(getStoredShipments());
    setAssignments(getTransportAssignments());

    // Auto dismiss toast after 6s
    setTimeout(() => {
      setSuccessToast(null);
    }, 6000);
  };

  // Filter assignments based on branch if needed
  const displayAssignments = useMemo(() => {
    return assignments;
  }, [assignments]);

  const pendingShipments = shipments.filter(s => s.status === 'pending');

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-saas-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 tracking-tight">
              Multimodal Transportation Assignment
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              Dispatch Desk
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Allocate and dispatch consignments across Road, Rail Intermodal, Air Cargo, and Ocean Container lines for <strong className="text-slate-700 font-semibold">{branchLabel}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600">
            Pending Queue:{' '}
            <strong className="text-orange-600 font-bold">{pendingShipments.length}</strong> consignments
          </div>
          <Link
            to="/shipments"
            className="px-3.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            All Shipments
          </Link>
        </div>
      </div>

      {/* 2. Success Alert Toast */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900 shadow-saas-sm flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <AppIcon name="check" size={15} />
            </div>
            <div className="text-xs sm:text-sm">
              <span className="font-bold">{successToast.message}</span>
              <span className="font-mono text-emerald-700 ml-2">[{successToast.assignmentId}]</span>
            </div>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-950 p-1"
          >
            <AppIcon name="x" size={14} />
          </button>
        </div>
      )}

      {/* 3. Main Two-Column Dispatch Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Multimodal Assignment Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleDispatchSubmit} className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-saas-sm space-y-6">

            {/* Step A: Shipment Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Select Consignment to Dispatch
              </label>
              <select
                value={selectedShipmentId}
                onChange={(e) => handleSelectShipment(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {shipments.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id} ({s.billOfLading}) — {s.originHubCode} → {s.destinationHubCode} | {s.cargo.weightKg} kg | Status: {s.status.toUpperCase()}
                  </option>
                ))}
              </select>

              {/* Selected Shipment Summary Card */}
              {selectedShipment && (
                <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">Origin Hub</div>
                    <div className="font-semibold text-slate-800">{selectedShipment.originHubCode}</div>
                    <div className="text-[11px] text-slate-500 truncate">{selectedShipment.originHub}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">Destination Hub</div>
                    <div className="font-semibold text-slate-800">{selectedShipment.destinationHubCode}</div>
                    <div className="text-[11px] text-slate-500 truncate">{selectedShipment.destinationHub}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">Cargo Spec</div>
                    <div className="font-semibold text-slate-800">{selectedShipment.cargo.weightKg} kg</div>
                    <div className="text-[11px] text-slate-500 truncate">{selectedShipment.cargo.type}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">Current State</div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-0.5 ${
                        selectedShipment.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : selectedShipment.status === 'in-transit'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {selectedShipment.status}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Step B: Transportation Mode Switcher (Road, Rail, Air, Sea) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                2. Select Transportation Mode
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  {
                    mode: 'road' as TransportMode,
                    title: 'Road Freight',
                    sub: 'FTL / LCV / Heavy Haul',
                    icon: 'truck' as const,
                    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
                  },
                  {
                    mode: 'rail' as TransportMode,
                    title: 'Rail Intermodal',
                    sub: 'Container Rake / Siding',
                    icon: 'train' as const,
                    color: 'text-purple-600 bg-purple-50 border-purple-200',
                  },
                  {
                    mode: 'air' as TransportMode,
                    title: 'Air Cargo',
                    sub: 'Express Flight / ULD',
                    icon: 'plane' as const,
                    color: 'text-sky-600 bg-sky-50 border-sky-200',
                  },
                  {
                    mode: 'sea' as TransportMode,
                    title: 'Ocean Container',
                    sub: 'FCL / LCL Vessel',
                    icon: 'ship' as const,
                    color: 'text-blue-600 bg-blue-50 border-blue-200',
                  },
                ].map((item) => {
                  const isSelected = activeMode === item.mode;
                  return (
                    <button
                      type="button"
                      key={item.mode}
                      onClick={() => {
                        setActiveMode(item.mode);
                        if (item.mode === 'road') {
                          setCarrierName('FreightLine Express Road Fleet');
                          setCarrierType('in_house');
                        } else if (item.mode === 'rail') {
                          setCarrierName('CONCOR (Container Corporation of India)');
                          setCarrierType('third_party');
                        } else if (item.mode === 'air') {
                          setCarrierName('IndiGo CarGo Express');
                          setCarrierType('third_party');
                        } else {
                          setCarrierName('Maersk Coastal Shipping');
                          setCarrierType('third_party');
                        }
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${item.color}`}>
                        <AppIcon name={item.icon} size={18} />
                      </div>
                      <div className="font-heading font-bold text-xs text-slate-900">{item.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step C: Carrier Type & Entity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Carrier Sourcing Type
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setCarrierType('in_house');
                      setCarrierName(activeMode === 'road' ? 'FreightLine Express Road Fleet' : 'FreightLine Intermodal Division');
                    }}
                    className={`py-1.5 rounded-md font-semibold transition-colors ${
                      carrierType === 'in_house'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    In-House Fleet
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCarrierType('third_party');
                      if (activeMode === 'road') setCarrierName('TCI Freight Logistics (3PL)');
                      else if (activeMode === 'rail') setCarrierName('CONCOR India');
                      else if (activeMode === 'air') setCarrierName('IndiGo CarGo Express');
                      else setCarrierName('Maersk Line');
                    }}
                    className={`py-1.5 rounded-md font-semibold transition-colors ${
                      carrierType === 'third_party'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Third-Party 3PL
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Carrier / Partner Entity Name
                </label>
                <input
                  type="text"
                  value={carrierName}
                  onChange={(e) => setCarrierName(e.target.value)}
                  required
                  placeholder="e.g. FreightLine Road Express / CONCOR / IndiGo"
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Step D: Dynamic Mode-Specific Fieldsets */}

            {/* D1. ROAD FREIGHT FIELDS */}
            {activeMode === 'road' && (
              <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 text-emerald-800 font-heading font-bold text-xs uppercase tracking-wider">
                  <AppIcon name="truck" size={16} />
                  <span>Road Fleet & Driver Manifest Specifications</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Assign Company Driver
                    </label>
                    <select
                      value={roadDriverId}
                      onChange={(e) => handleDriverChange(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:ring-2 focus:ring-orange-500"
                    >
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.badgeNumber}) — {d.vehiclePlate} [{d.status.toUpperCase()}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Vehicle Registration Plate
                    </label>
                    <input
                      type="text"
                      value={roadPlate}
                      onChange={(e) => setRoadPlate(e.target.value)}
                      required
                      placeholder="e.g. RJ-14-GA-8820"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Vehicle Specifications
                    </label>
                    <input
                      type="text"
                      value={roadVehicleType}
                      onChange={(e) => setRoadVehicleType(e.target.value)}
                      required
                      placeholder="e.g. Eicher Pro 2049 (14 Ft Container)"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Driver Contact Mobile
                    </label>
                    <input
                      type="text"
                      value={roadDriverPhone}
                      onChange={(e) => setRoadDriverPhone(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Trip Manifest ID / e-Way Bill Reference
                    </label>
                    <input
                      type="text"
                      value={roadManifestId}
                      onChange={(e) => setRoadManifestId(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* D2. RAIL FREIGHT FIELDS */}
            {activeMode === 'rail' && (
              <div className="bg-purple-50/40 border border-purple-100 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 text-purple-800 font-heading font-bold text-xs uppercase tracking-wider">
                  <AppIcon name="train" size={16} />
                  <span>Intermodal Rail Siding & Rake Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Railway Carrier / Operator
                    </label>
                    <input
                      type="text"
                      value={railCarrier}
                      onChange={(e) => setRailCarrier(e.target.value)}
                      required
                      placeholder="e.g. CONCOR / Indian Railways Freight"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Train / Rake Number
                    </label>
                    <input
                      type="text"
                      value={railTrainNo}
                      onChange={(e) => setRailTrainNo(e.target.value)}
                      required
                      placeholder="e.g. Rake-CC-9412 (Train 12952)"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Wagon / Flatbed ID
                    </label>
                    <input
                      type="text"
                      value={railWagonId}
                      onChange={(e) => setRailWagonId(e.target.value)}
                      required
                      placeholder="e.g. CR-WGN-77142"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Railway Receipt (RR) Number
                    </label>
                    <input
                      type="text"
                      value={railRrNumber}
                      onChange={(e) => setRailRrNumber(e.target.value)}
                      required
                      placeholder="e.g. RR-NR-2026-904128"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Origin Rail Siding / Terminal
                    </label>
                    <input
                      type="text"
                      value={railOriginTerminal}
                      onChange={(e) => setRailOriginTerminal(e.target.value)}
                      required
                      placeholder="e.g. ICD Tughlakabad (TKD)"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Destination Rail Siding
                    </label>
                    <input
                      type="text"
                      value={railDestTerminal}
                      onChange={(e) => setRailDestTerminal(e.target.value)}
                      required
                      placeholder="e.g. Shalimar Goods Siding, Kolkata"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* D3. AIR CARGO FIELDS */}
            {activeMode === 'air' && (
              <div className="bg-sky-50/40 border border-sky-100 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 text-sky-800 font-heading font-bold text-xs uppercase tracking-wider">
                  <AppIcon name="plane" size={16} />
                  <span>Air Cargo Flight & Air Waybill (AWB) Specifications</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Cargo Airline
                    </label>
                    <input
                      type="text"
                      value={airAirline}
                      onChange={(e) => setAirAirline(e.target.value)}
                      required
                      placeholder="e.g. IndiGo CarGo / Air India Cargo"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Flight Number
                    </label>
                    <input
                      type="text"
                      value={airFlightNo}
                      onChange={(e) => setAirFlightNo(e.target.value)}
                      required
                      placeholder="e.g. 6E-8291"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Air Waybill (AWB) Number (11-Digit)
                    </label>
                    <input
                      type="text"
                      value={airAwbNumber}
                      onChange={(e) => setAirAwbNumber(e.target.value)}
                      required
                      placeholder="e.g. 312-99418290"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      ULD Container / Palette Tag
                    </label>
                    <input
                      type="text"
                      value={airUldTag}
                      onChange={(e) => setAirUldTag(e.target.value)}
                      required
                      placeholder="e.g. ULD-AKE-49120"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Departure Airport (Origin)
                    </label>
                    <input
                      type="text"
                      value={airOriginAirport}
                      onChange={(e) => setAirOriginAirport(e.target.value)}
                      required
                      placeholder="e.g. DEL - Indira Gandhi Intl"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Arrival Airport (Destination)
                    </label>
                    <input
                      type="text"
                      value={airDestAirport}
                      onChange={(e) => setAirDestAirport(e.target.value)}
                      required
                      placeholder="e.g. BLR - Kempegowda Intl"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* D4. OCEAN SHIPPING FIELDS */}
            {activeMode === 'sea' && (
              <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 text-blue-800 font-heading font-bold text-xs uppercase tracking-wider">
                  <AppIcon name="ship" size={16} />
                  <span>Ocean Freight Vessel & Container Manifest</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Shipping Line / Carrier
                    </label>
                    <input
                      type="text"
                      value={seaShippingLine}
                      onChange={(e) => setSeaShippingLine(e.target.value)}
                      required
                      placeholder="e.g. Maersk Line India"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Vessel Name & Voyage Number
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={seaVesselName}
                        onChange={(e) => setSeaVesselName(e.target.value)}
                        required
                        placeholder="Vessel Name"
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        type="text"
                        value={seaVoyageNo}
                        onChange={(e) => setSeaVoyageNo(e.target.value)}
                        required
                        placeholder="Voyage No"
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Container Number (ISO 6346)
                    </label>
                    <input
                      type="text"
                      value={seaContainerNo}
                      onChange={(e) => setSeaContainerNo(e.target.value)}
                      required
                      placeholder="e.g. MSKU-882914-3"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Seal Number
                    </label>
                    <input
                      type="text"
                      value={seaSealNo}
                      onChange={(e) => setSeaSealNo(e.target.value)}
                      required
                      placeholder="e.g. SEAL-IN-49201"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Master Bill of Lading (MBL)
                    </label>
                    <input
                      type="text"
                      value={seaMblNo}
                      onChange={(e) => setSeaMblNo(e.target.value)}
                      required
                      placeholder="e.g. MAEU-9921405"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Port of Loading (POL) → Discharge (POD)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={seaPol}
                        onChange={(e) => setSeaPol(e.target.value)}
                        required
                        placeholder="POL (e.g. JNPT)"
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        type="text"
                        value={seaPod}
                        onChange={(e) => setSeaPod(e.target.value)}
                        required
                        placeholder="POD (e.g. Chennai)"
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step E: Dispatch Controls & CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Authorizing Dispatch Officer
                </label>
                <input
                  type="text"
                  value={assignedBy}
                  onChange={(e) => setAssignedBy(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operational Handling Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Fragile textile cartons, maintain upright"
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={autoDispatch}
                  onChange={(e) => setAutoDispatch(e.target.checked)}
                  className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
                <span>Automatically transition consignment status to <strong>IN-TRANSIT</strong></span>
              </label>

              <button
                type="submit"
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-lg shadow-saas-sm hover:shadow-saas-md transition-all flex items-center justify-center gap-2"
              >
                <AppIcon name="check" size={15} />
                <span>Confirm & Dispatch Assignment</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Dispatch Summary & Driver Telemetry */}
        <div className="space-y-6">
          {/* Driver Availability Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-saas-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Hub Fleet Resources
              </h3>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {drivers.filter(d => d.status === 'available').length} Available
              </span>
            </div>

            <div className="space-y-2.5">
              {drivers.map((drv) => (
                <div
                  key={drv.id}
                  onClick={() => {
                    if (activeMode === 'road') {
                      handleDriverChange(drv.id);
                    }
                  }}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    activeMode === 'road' && roadDriverId === drv.id
                      ? 'border-orange-500 bg-orange-50/20'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{drv.name}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                        drv.status === 'available'
                          ? 'bg-emerald-50 text-emerald-700'
                          : drv.status === 'on_route'
                          ? 'bg-sky-50 text-sky-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {drv.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {drv.vehiclePlate} • {drv.vehicleType.split('(')[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Guide */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
            <div className="font-heading font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <AppIcon name="shield" size={14} className="text-orange-500" />
              <span>Multi-Modal Dispatch Compliance</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Assigning a carrier updates the official electronic consignment record, records the transaction in the system audit stream, and updates live telemetry coordinates for tracking.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Assignment History & Operational Audit Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-saas-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading font-bold text-sm sm:text-base text-slate-900">
              Recent Dispatches & Carrier Assignments
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Audit log of multimodal transport allocations and route manifests
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {displayAssignments.length} Assignments Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Assignment ID</th>
                <th className="py-3 px-4">Consignment</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Carrier / Operator</th>
                <th className="py-3 px-4">Vehicle / Train / Flight / Vessel</th>
                <th className="py-3 px-4">Dispatched At</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayAssignments.map((asn) => {
                let refDisplay = '-';
                if (asn.mode === 'road' && asn.roadDetails) {
                  refDisplay = `${asn.roadDetails.vehiclePlate} (${asn.roadDetails.driverName})`;
                } else if (asn.mode === 'rail' && asn.railDetails) {
                  refDisplay = `${asn.railDetails.trainRakeNo} / RR: ${asn.railDetails.rrNumber}`;
                } else if (asn.mode === 'air' && asn.airDetails) {
                  refDisplay = `Flight ${asn.airDetails.flightNumber} / AWB ${asn.airDetails.awbNumber}`;
                } else if (asn.mode === 'sea' && asn.seaDetails) {
                  refDisplay = `${asn.seaDetails.vesselName} / ${asn.seaDetails.containerNumber}`;
                }

                return (
                  <tr key={asn.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {asn.id}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-orange-600">
                      <Link to={`/shipment/${asn.shipmentId}`} className="hover:underline">
                        {asn.shipmentId}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold uppercase text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        <AppIcon name={asn.mode === 'road' ? 'truck' : asn.mode === 'rail' ? 'train' : asn.mode === 'air' ? 'plane' : 'ship'} size={12} />
                        <span>{asn.mode}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {asn.carrierName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                      {refDisplay}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {asn.dispatchedAt || asn.assignedAt}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          asn.status === 'in_transit'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : asn.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {asn.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/tracking?id=${asn.shipmentId}`}
                          className="text-xs font-semibold text-sky-600 hover:text-sky-700"
                        >
                          Track
                        </Link>
                        <span>•</span>
                        <Link
                          to={`/shipment/${asn.shipmentId}`}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                        >
                          Manifest
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
