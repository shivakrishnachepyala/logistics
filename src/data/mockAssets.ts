import type {
  Vehicle,
  FleetDriver,
  MaintenanceRecord,
  Warehouse,
  StorageLocation,
  InventoryItem,
  InventoryTransaction,
} from '../types/assets';

// 1. Initial Vehicles Dataset
export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'VEH-101',
    plateNumber: 'RJ-14-GA-8820',
    makeModel: 'Eicher Pro 2049 (14 Ft Closed Container)',
    type: 'Container Trucks',
    capacityKg: 6500,
    capacityCbm: 24.5,
    assignedDriverId: 'DRV-104',
    assignedDriverName: 'Mukesh Yadav',
    currentLocation: 'NH-48 Express Highway near Kotputli',
    status: 'in_transit',
    fuelLevelPercent: 78,
    odometerKm: 42180,
    lastServiceDate: '2026-09-12',
    nextServiceDue: '2026-12-12',
    insuranceExpiry: '2027-05-18',
    pucExpiry: '2027-02-14',
  },
  {
    id: 'VEH-102',
    plateNumber: 'DL-01-AB-2041',
    makeModel: 'Tata 407 Gold LCV (6-Wheeler)',
    type: 'Light Commercial Vehicles',
    capacityKg: 4500,
    capacityCbm: 16.0,
    assignedDriverId: 'DRV-208',
    assignedDriverName: 'Balwinder Singh',
    currentLocation: 'Delhi Central Parcel Hub, Okhla',
    status: 'available',
    fuelLevelPercent: 92,
    odometerKm: 28450,
    lastServiceDate: '2026-08-25',
    nextServiceDue: '2026-11-25',
    insuranceExpiry: '2027-04-10',
    pucExpiry: '2027-01-20',
  },
  {
    id: 'VEH-103',
    plateNumber: 'MH-04-AZ-4109',
    makeModel: 'Ashok Leyland Dost Plus (Pick-up Van)',
    type: 'Light Commercial Vehicles',
    capacityKg: 2200,
    capacityCbm: 8.5,
    assignedDriverId: 'DRV-312',
    assignedDriverName: 'Suresh Patil',
    currentLocation: 'Bhiwandi Warehousing Hub, Mumbai',
    status: 'available',
    fuelLevelPercent: 65,
    odometerKm: 34120,
    lastServiceDate: '2026-09-01',
    nextServiceDue: '2026-12-01',
    insuranceExpiry: '2027-06-30',
    pucExpiry: '2027-03-15',
  },
  {
    id: 'VEH-104',
    plateNumber: 'TN-09-BK-7701',
    makeModel: 'BharatBenz 1617R Medium Truck',
    type: 'Heavy Trucks',
    capacityKg: 10500,
    capacityCbm: 38.0,
    assignedDriverId: 'DRV-405',
    assignedDriverName: 'Ranganathan Pillai',
    currentLocation: 'Hosur Toll Plaza approaching Electronic City',
    status: 'in_transit',
    fuelLevelPercent: 54,
    odometerKm: 76800,
    lastServiceDate: '2026-07-20',
    nextServiceDue: '2026-10-20',
    insuranceExpiry: '2027-03-14',
    pucExpiry: '2026-12-28',
  },
  {
    id: 'VEH-105',
    plateNumber: 'PB-10-CZ-9912',
    makeModel: 'Tata LPT 1918 Heavy Multi-Axle',
    type: 'Heavy Trucks',
    capacityKg: 18500,
    capacityCbm: 52.0,
    assignedDriverId: 'DRV-519',
    assignedDriverName: 'Gurmeet Sandhu',
    currentLocation: 'Kanpur Bypass Service Depot',
    status: 'maintenance',
    fuelLevelPercent: 35,
    odometerKm: 112400,
    lastServiceDate: '2026-10-18',
    nextServiceDue: '2026-10-24',
    insuranceExpiry: '2027-01-22',
    pucExpiry: '2026-11-30',
  },
  {
    id: 'VEH-106',
    plateNumber: 'RJ-14-TR-5510',
    makeModel: 'BharatBenz 5528TT 40Ft Multi-Axle Trailer',
    type: 'Trailers',
    capacityKg: 38000,
    capacityCbm: 85.0,
    assignedDriverId: 'DRV-602',
    assignedDriverName: 'Arjun Meena',
    currentLocation: 'Jaipur Vishwakarma Delivery Centre',
    status: 'available',
    fuelLevelPercent: 88,
    odometerKm: 64200,
    lastServiceDate: '2026-08-15',
    nextServiceDue: '2026-11-15',
    insuranceExpiry: '2027-07-19',
    pucExpiry: '2027-04-12',
  },
  {
    id: 'VEH-107',
    plateNumber: 'GJ-05-RF-7721',
    makeModel: 'Mahindra Furio 14 Reefer (-20°C to +15°C)',
    type: 'Refrigerated Trucks',
    capacityKg: 8200,
    capacityCbm: 30.0,
    assignedDriverId: 'DRV-710',
    assignedDriverName: 'Vikram Deshmukh',
    currentLocation: 'Surat Textile & Agro Hub',
    status: 'available',
    fuelLevelPercent: 95,
    odometerKm: 19800,
    lastServiceDate: '2026-09-28',
    nextServiceDue: '2026-12-28',
    insuranceExpiry: '2027-08-04',
    pucExpiry: '2027-05-10',
  },
  {
    id: 'VEH-108',
    plateNumber: 'MH-12-TK-9081',
    makeModel: 'BharatBenz 2823R Liquid Cargo Tanker (18KL)',
    type: 'Tankers',
    capacityKg: 18000,
    capacityCbm: 18.0,
    assignedDriverId: 'DRV-814',
    assignedDriverName: 'Santosh Jadhav',
    currentLocation: 'Pune Expressway towards Panvel',
    status: 'in_transit',
    fuelLevelPercent: 62,
    odometerKm: 48900,
    lastServiceDate: '2026-08-10',
    nextServiceDue: '2026-11-10',
    insuranceExpiry: '2027-02-28',
    pucExpiry: '2026-12-15',
  },
];

// 2. Initial Fleet Drivers Dataset
export const INITIAL_FLEET_DRIVERS: FleetDriver[] = [
  {
    id: 'DRV-104',
    name: 'Mukesh Yadav',
    phone: '+91 98110 99420',
    email: 'mukesh.yadav@freightline.in',
    licenseNumber: 'DL-04201889201',
    licenseType: 'HMV Commercial Heavy Transport',
    licenseExpiry: '2029-08-14',
    assignedVehiclePlate: 'RJ-14-GA-8820',
    status: 'on_route',
    currentLocation: 'NH-48 Express Highway near Kotputli',
    rating: 4.95,
    shiftHoursLogged: 4.5,
    experienceYears: 12,
  },
  {
    id: 'DRV-208',
    name: 'Balwinder Singh',
    phone: '+91 98140 22109',
    email: 'balwinder.singh@freightline.in',
    licenseNumber: 'PB-10201509124',
    licenseType: 'Heavy Commercial + Hazardous Endorsement',
    licenseExpiry: '2028-11-20',
    assignedVehiclePlate: 'DL-01-AB-2041',
    status: 'available',
    currentLocation: 'Chandni Chowk Parcel Centre, Delhi',
    rating: 4.92,
    shiftHoursLogged: 2.0,
    experienceYears: 15,
  },
  {
    id: 'DRV-312',
    name: 'Suresh Patil',
    phone: '+91 98200 44119',
    email: 'suresh.patil@freightline.in',
    licenseNumber: 'MH-04201977209',
    licenseType: 'Medium Goods Transport (MGV)',
    licenseExpiry: '2030-04-18',
    assignedVehiclePlate: 'MH-04-AZ-4109',
    status: 'available',
    currentLocation: 'Bhiwandi Warehousing Hub, Mumbai',
    rating: 4.98,
    shiftHoursLogged: 3.5,
    experienceYears: 9,
  },
  {
    id: 'DRV-405',
    name: 'Ranganathan Pillai',
    phone: '+91 94440 88201',
    email: 'ranganathan.p@freightline.in',
    licenseNumber: 'TN-09201655421',
    licenseType: 'Heavy Commercial Goods Vehicle (HGV)',
    licenseExpiry: '2029-02-10',
    assignedVehiclePlate: 'TN-09-BK-7701',
    status: 'on_route',
    currentLocation: 'Hosur Toll Plaza approaching Electronic City',
    rating: 4.91,
    shiftHoursLogged: 5.2,
    experienceYears: 14,
  },
  {
    id: 'DRV-519',
    name: 'Gurmeet Sandhu',
    phone: '+91 98720 11980',
    email: 'gurmeet.sandhu@freightline.in',
    licenseNumber: 'PB-10201433100',
    licenseType: 'Heavy Multi-Axle Vehicle (HMAV)',
    licenseExpiry: '2027-10-15',
    assignedVehiclePlate: 'PB-10-CZ-9912',
    status: 'off_duty',
    currentLocation: 'Kanpur Bypass Service Depot',
    rating: 4.88,
    shiftHoursLogged: 7.5,
    experienceYears: 16,
  },
  {
    id: 'DRV-602',
    name: 'Arjun Meena',
    phone: '+91 94140 33419',
    email: 'arjun.meena@freightline.in',
    licenseNumber: 'RJ-14201760211',
    licenseType: 'Heavy Trailer Articulated Commercial',
    licenseExpiry: '2029-06-25',
    assignedVehiclePlate: 'RJ-14-TR-5510',
    status: 'available',
    currentLocation: 'Jaipur Delivery Centre',
    rating: 4.94,
    shiftHoursLogged: 1.5,
    experienceYears: 10,
  },
  {
    id: 'DRV-710',
    name: 'Vikram Deshmukh',
    phone: '+91 98220 77123',
    email: 'vikram.d@freightline.in',
    licenseNumber: 'MH-12201871044',
    licenseType: 'Refrigerated Transport Certified (HMV)',
    licenseExpiry: '2030-01-12',
    assignedVehiclePlate: 'GJ-05-RF-7721',
    status: 'available',
    currentLocation: 'Surat Cargo Terminal',
    rating: 4.96,
    shiftHoursLogged: 2.0,
    experienceYears: 11,
  },
  {
    id: 'DRV-814',
    name: 'Santosh Jadhav',
    phone: '+91 98230 99401',
    email: 'santosh.j@freightline.in',
    licenseNumber: 'MH-14201681490',
    licenseType: 'Petrochemical Tanker Endorsed (HMV)',
    licenseExpiry: '2028-09-30',
    assignedVehiclePlate: 'MH-12-TK-9081',
    status: 'on_route',
    currentLocation: 'Pune Expressway',
    rating: 4.89,
    shiftHoursLogged: 4.0,
    experienceYears: 13,
  },
];

// 3. Initial Maintenance Records Dataset
export const INITIAL_MAINTENANCE: MaintenanceRecord[] = [
  {
    id: 'MNT-2026-091',
    vehicleId: 'VEH-105',
    vehiclePlate: 'PB-10-CZ-9912',
    serviceDate: '2026-10-18',
    maintenanceType: 'Brake Overhaul & Suspension Retorque',
    costInr: 28400,
    serviceCenter: 'Tata Motors Authorized Commercial Depot, Kanpur Bypass',
    nextServiceDate: '2026-10-24',
    status: 'in_progress',
    technicianNotes: 'Rear air brake booster valve replaced; waiting for differential seal test.',
  },
  {
    id: 'MNT-2026-088',
    vehicleId: 'VEH-101',
    vehiclePlate: 'RJ-14-GA-8820',
    serviceDate: '2026-09-12',
    maintenanceType: 'Routine 40,000 Km Engine Oil & Filter Service',
    costInr: 8500,
    serviceCenter: 'Eicher Commercial Workshop, Okhla Phase 2, Delhi',
    nextServiceDate: '2026-12-12',
    status: 'completed',
    technicianNotes: 'Synthetic engine oil replaced, coolant flushed, fuel water separator cleared.',
  },
  {
    id: 'MNT-2026-085',
    vehicleId: 'VEH-107',
    vehiclePlate: 'GJ-05-RF-7721',
    serviceDate: '2026-09-28',
    maintenanceType: 'Refrigeration Compressor Unit Calibration',
    costInr: 16200,
    serviceCenter: 'Carrier Transicold Service Hub, Surat GIDC',
    nextServiceDate: '2026-12-28',
    status: 'completed',
    technicianNotes: 'R404A refrigerant gas topped up; temperature sensor calibrated to 0.1°C variance.',
  },
  {
    id: 'MNT-2026-081',
    vehicleId: 'VEH-104',
    vehiclePlate: 'TN-09-BK-7701',
    serviceDate: '2026-07-20',
    maintenanceType: 'Front Axle Radial Tyre Replacement (4 Tyres)',
    costInr: 54000,
    serviceCenter: 'Apollo Tyres Fleet Center, Hosur Highway',
    nextServiceDate: '2026-10-20',
    status: 'completed',
    technicianNotes: 'New radial steel-belted tyres installed and laser-aligned.',
  },
  {
    id: 'MNT-2026-074',
    vehicleId: 'VEH-106',
    vehiclePlate: 'RJ-14-TR-5510',
    serviceDate: '2026-08-15',
    maintenanceType: 'Fifth-Wheel Coupling & Kingpin Inspection',
    costInr: 12500,
    serviceCenter: 'Jost India Trailer Service, Jaipur Transport Nagar',
    nextServiceDate: '2026-11-15',
    status: 'completed',
    technicianNotes: 'Kingpin lock tested under 35T hydraulic load; grease lubrication refreshed.',
  },
  {
    id: 'MNT-2026-095',
    vehicleId: 'VEH-102',
    vehiclePlate: 'DL-01-AB-2041',
    serviceDate: '2026-11-05',
    maintenanceType: 'Scheduled 30,000 Km Pre-Winter Inspection',
    costInr: 6500,
    serviceCenter: 'Tata Motors Okhla Logistics Center',
    nextServiceDate: '2026-11-25',
    status: 'scheduled',
    technicianNotes: 'Scheduled preventive battery, alternator, and brake pads assessment.',
  },
];

// 4. Initial Warehouses Dataset
export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'WH-DEL-01',
    name: 'Delhi Central Capital Hub & Fulfilment Centre',
    branchId: 'DEL-CENTRAL',
    city: 'New Delhi',
    state: 'Delhi',
    address: 'Plot 44-48, Okhla Industrial Area Phase 1, Near Container Depot',
    managerName: 'Sunil Kumar Saxena',
    managerPhone: '+91 98110 44210',
    managerEmail: 'sunil.saxena@freightline.in',
    totalCapacitySqFt: 85000,
    totalCapacityCbm: 16000,
    occupiedCapacityCbm: 12400,
    operationalStatus: 'active',
    dockCount: 16,
    temperatureControlled: true,
    tempRange: '+2°C to +25°C',
    zones: ['Zone A: High-Rack Pallets', 'Zone B: Cold Storage', 'Zone C: Cross-Dock Staging', 'Zone D: Security Vault'],
    recentActivity: [
      { id: 'ACT-W1', timestamp: '2026-10-19 14:30', event: 'Inbound consignment FLX-8829-JPR staged at Dock 4', user: 'Harish Rawat' },
      { id: 'ACT-W2', timestamp: '2026-10-19 11:15', event: 'Dispatched 35 cartons of Textiles via Vehicle RJ-14-GA-8820', user: 'Mukesh Yadav' },
      { id: 'ACT-W3', timestamp: '2026-10-18 17:00', event: 'Cycle count completed for Zone A (99.8% accuracy)', user: 'Sunil Saxena' },
    ],
  },
  {
    id: 'WH-MUM-01',
    name: 'Mumbai Bhiwandi Logistics & Ocean Gateway',
    branchId: 'MH-MUMBAI',
    city: 'Bhiwandi / Mumbai',
    state: 'Maharashtra',
    address: 'Survey 102/B, Mumbai-Nashik Highway, Mankoli Naka, Bhiwandi',
    managerName: 'Pradeep Kulkarni',
    managerPhone: '+91 98200 88402',
    managerEmail: 'pradeep.k@freightline.in',
    totalCapacitySqFt: 120000,
    totalCapacityCbm: 24000,
    occupiedCapacityCbm: 19800,
    operationalStatus: 'active',
    dockCount: 22,
    temperatureControlled: false,
    zones: ['Zone A: High-Density Racks', 'Zone B: Export Consolidation', 'Zone C: Container Staging', 'Zone D: Hazmat Vault'],
    recentActivity: [
      { id: 'ACT-W4', timestamp: '2026-10-19 15:45', event: 'Received ocean container MSKU-882914-3 from JNPT', user: 'Pradeep Kulkarni' },
      { id: 'ACT-W5', timestamp: '2026-10-19 09:30', event: 'Weather advisory: Heavy monsoon rainfall protocols activated', user: 'Dispatch Desk' },
    ],
  },
  {
    id: 'WH-JPR-01',
    name: 'Jaipur Industrial Distribution Centre',
    branchId: 'JPR-MAIN',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'Road No. 9, Vishwakarma Industrial Area (VKI), Sikar Road',
    managerName: 'Mahesh Meena',
    managerPhone: '+91 94140 77120',
    managerEmail: 'mahesh.meena@freightline.in',
    totalCapacitySqFt: 45000,
    totalCapacityCbm: 8500,
    occupiedCapacityCbm: 4200,
    operationalStatus: 'active',
    dockCount: 8,
    temperatureControlled: false,
    zones: ['Zone A: Pallet Storage', 'Zone B: Regional Dispatch', 'Zone C: Returns & RMA'],
    recentActivity: [
      { id: 'ACT-W6', timestamp: '2026-10-19 13:00', event: 'Dock 2 prepared for inbound Eicher Pro arrival', user: 'Mahesh Meena' },
    ],
  },
  {
    id: 'WH-SURAT-01',
    name: 'Surat Textile & High-Value Cargo Hub',
    branchId: 'GJ-SURAT',
    city: 'Surat',
    state: 'Gujarat',
    address: 'Plot 12-16, Sachin GIDC Industrial Area, Near Diamond Park',
    managerName: 'Bhavin Patel',
    managerPhone: '+91 98250 33190',
    managerEmail: 'bhavin.patel@freightline.in',
    totalCapacitySqFt: 60000,
    totalCapacityCbm: 11000,
    occupiedCapacityCbm: 9400,
    operationalStatus: 'active',
    dockCount: 12,
    temperatureControlled: true,
    tempRange: '+15°C to +25°C',
    zones: ['Zone A: Fabric Rolls Warehouse', 'Zone B: Diamond & Precious Vault', 'Zone C: Cross-Dock'],
    recentActivity: [
      { id: 'ACT-W7', timestamp: '2026-10-19 12:20', event: '350 rolls of dyed cotton fabric scanned into inventory', user: 'Bhavin Patel' },
    ],
  },
  {
    id: 'WH-CHN-01',
    name: 'Chennai Port & Coastal Fulfilment Depot',
    branchId: 'TN-CHENNAI',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Expressway Road, Madhavaram Logistics Complex, Near Port Gate 4',
    managerName: 'S. Vijayaraghavan',
    managerPhone: '+91 94440 66201',
    managerEmail: 'vijayaraghavan@freightline.in',
    totalCapacitySqFt: 75000,
    totalCapacityCbm: 14000,
    occupiedCapacityCbm: 8900,
    operationalStatus: 'active',
    dockCount: 14,
    temperatureControlled: true,
    tempRange: '-20°C to +20°C',
    zones: ['Zone A: Cold Storage Reefer', 'Zone B: Port Clearance Bay', 'Zone C: Air Express Staging'],
    recentActivity: [
      { id: 'ACT-W8', timestamp: '2026-10-19 10:10', event: 'IndiGo CarGo flight 6E-8291 pallets transferred to Reefer Bay', user: 'S. Vijayaraghavan' },
    ],
  },
  {
    id: 'WH-BLR-01',
    name: 'Bengaluru Tech Cargo & Electronic Fulfilment',
    branchId: 'KA-BLR',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: 'Phase 2, Hosur Road, Electronic City Industrial Area',
    managerName: 'Girish Hegde',
    managerPhone: '+91 98450 11980',
    managerEmail: 'girish.hegde@freightline.in',
    totalCapacitySqFt: 90000,
    totalCapacityCbm: 18000,
    occupiedCapacityCbm: 11200,
    operationalStatus: 'active',
    dockCount: 18,
    temperatureControlled: true,
    tempRange: '+18°C to +24°C',
    zones: ['Zone A: ESD Sensitive Electronics', 'Zone B: High-Rack Pallets', 'Zone C: Express Dispatch'],
    recentActivity: [
      { id: 'ACT-W9', timestamp: '2026-10-19 14:00', event: 'Automated conveyor maintenance completed', user: 'Girish Hegde' },
    ],
  },
];

// 5. Initial Storage Locations (Zones, Sections, Racks, Bins)
export const INITIAL_STORAGE_LOCATIONS: StorageLocation[] = [
  { id: 'LOC-DEL-A1-R01-B01', warehouseId: 'WH-DEL-01', zone: 'Zone A', section: 'Sec 01', rack: 'Rack 01', bin: 'Bin A-01', type: 'High-Rack Pallet', capacityUnits: 100, occupiedUnits: 85, currentSku: 'SKU-AUTO-101', status: 'partial' },
  { id: 'LOC-DEL-A1-R01-B02', warehouseId: 'WH-DEL-01', zone: 'Zone A', section: 'Sec 01', rack: 'Rack 01', bin: 'Bin A-02', type: 'High-Rack Pallet', capacityUnits: 100, occupiedUnits: 100, currentSku: 'SKU-MACH-412', status: 'full' },
  { id: 'LOC-DEL-B1-R02-B01', warehouseId: 'WH-DEL-01', zone: 'Zone B', section: 'Sec 02', rack: 'Rack 02', bin: 'Bin B-01', type: 'Cold Storage Vault', capacityUnits: 50, occupiedUnits: 25, currentSku: 'SKU-PHARM-501', status: 'partial' },
  { id: 'LOC-DEL-C1-R03-B01', warehouseId: 'WH-DEL-01', zone: 'Zone C', section: 'Sec 03', rack: 'Rack 03', bin: 'Bin C-01', type: 'Cross-Dock Staging', capacityUnits: 80, occupiedUnits: 0, status: 'available' },
  { id: 'LOC-MUM-A1-R01-B01', warehouseId: 'WH-MUM-01', zone: 'Zone A', section: 'Sec 01', rack: 'Rack 01', bin: 'Bin A-01', type: 'High-Density Rack', capacityUnits: 150, occupiedUnits: 140, currentSku: 'SKU-AUTO-101', status: 'full' },
  { id: 'LOC-MUM-A2-R02-B02', warehouseId: 'WH-MUM-01', zone: 'Zone A', section: 'Sec 02', rack: 'Rack 02', bin: 'Bin A-02', type: 'High-Density Rack', capacityUnits: 150, occupiedUnits: 40, currentSku: 'SKU-CHEM-608', status: 'partial' },
  { id: 'LOC-SURAT-A1-R01-B01', warehouseId: 'WH-SURAT-01', zone: 'Zone A', section: 'Sec 01', rack: 'Rack 01', bin: 'Bin A-01', type: 'Textile Fabric Racks', capacityUnits: 120, occupiedUnits: 110, currentSku: 'SKU-TEXT-204', status: 'partial' },
  { id: 'LOC-BLR-A1-R01-B01', warehouseId: 'WH-BLR-01', zone: 'Zone A', section: 'Sec 01', rack: 'Rack 01', bin: 'Bin A-01', type: 'ESD Electronics Rack', capacityUnits: 60, occupiedUnits: 18, currentSku: 'SKU-ELEC-309', status: 'partial' },
];

// 6. Initial Inventory Items
export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'SKU-AUTO-101',
    name: 'Precision Water Pump Impellers & Castings',
    category: 'Automotive Parts',
    warehouseId: 'WH-DEL-01',
    warehouseName: 'Delhi Central Capital Hub',
    locationCode: 'Zone A / R-01 / B-01',
    quantity: 240,
    unitOfMeasure: 'Boxes',
    minThreshold: 50,
    unitCostInr: 1250,
    totalValueInr: 300000,
    status: 'in_stock',
    supplier: 'Chakan Precision Castings Ltd.',
    lastRestocked: '2026-10-15',
    barcode: 'FLX-INV-AUTO-101',
  },
  {
    id: 'SKU-TEXT-204',
    name: 'Premium Mercerized Cotton Fabric Rolls (60s Count)',
    category: 'Textiles & Garments',
    warehouseId: 'WH-SURAT-01',
    warehouseName: 'Surat Textile & Cargo Hub',
    locationCode: 'Zone A / R-01 / B-01',
    quantity: 110,
    unitOfMeasure: 'Rolls',
    minThreshold: 30,
    unitCostInr: 3400,
    totalValueInr: 374000,
    status: 'in_stock',
    supplier: 'Surat Weaving & Silk Mills',
    lastRestocked: '2026-10-18',
    barcode: 'FLX-INV-TEXT-204',
  },
  {
    id: 'SKU-ELEC-309',
    name: 'High-Efficiency Micro-Inverter IC Controllers',
    category: 'Electronics & Tech',
    warehouseId: 'WH-BLR-01',
    warehouseName: 'Bengaluru Tech Cargo Park',
    locationCode: 'Zone A / R-01 / B-01',
    quantity: 18,
    unitOfMeasure: 'Units',
    minThreshold: 25,
    unitCostInr: 18500,
    totalValueInr: 333000,
    status: 'low_stock',
    supplier: 'Semicon Technologies Bengaluru',
    lastRestocked: '2026-09-20',
    barcode: 'FLX-INV-ELEC-309',
  },
  {
    id: 'SKU-MACH-412',
    name: 'Industrial Heavy Helical Planetary Gearboxes',
    category: 'Industrial Machinery',
    warehouseId: 'WH-DEL-01',
    warehouseName: 'Delhi Central Capital Hub',
    locationCode: 'Zone A / R-01 / B-02',
    quantity: 45,
    unitOfMeasure: 'Pallets',
    minThreshold: 15,
    unitCostInr: 8900,
    totalValueInr: 400500,
    status: 'in_stock',
    supplier: 'Agarwal Heavy Gear Machinery',
    lastRestocked: '2026-10-12',
    barcode: 'FLX-INV-MACH-412',
  },
  {
    id: 'SKU-PHARM-501',
    name: 'Cold-Chain Biological Vaccines & Peptides (2-8°C)',
    category: 'Pharmaceuticals',
    warehouseId: 'WH-DEL-01',
    warehouseName: 'Delhi Central Capital Hub',
    locationCode: 'Zone B / R-02 / B-01',
    quantity: 850,
    unitOfMeasure: 'Units',
    minThreshold: 200,
    unitCostInr: 650,
    totalValueInr: 552500,
    status: 'in_stock',
    supplier: 'Serum Biopharma Ltd., Pune',
    lastRestocked: '2026-10-17',
    barcode: 'FLX-INV-PHARM-501',
  },
  {
    id: 'SKU-CHEM-608',
    name: 'High-Purity Industrial Epoxy Polymer Resin',
    category: 'Chemicals & Liquids',
    warehouseId: 'WH-MUM-01',
    warehouseName: 'Mumbai Bhiwandi Logistics Gateway',
    locationCode: 'Zone A / R-02 / B-02',
    quantity: 8,
    unitOfMeasure: 'Litres',
    minThreshold: 15,
    unitCostInr: 14200,
    totalValueInr: 113600,
    status: 'low_stock',
    supplier: 'Aarti Chemical Industries, Vapi',
    lastRestocked: '2026-09-14',
    barcode: 'FLX-INV-CHEM-608',
  },
  {
    id: 'SKU-AUTO-715',
    name: 'Dual-Circuit Commercial Air Brake Booster Valves',
    category: 'Automotive Parts',
    warehouseId: 'WH-DEL-01',
    warehouseName: 'Delhi Central Capital Hub',
    locationCode: 'Zone A / R-01 / B-03',
    quantity: 0,
    unitOfMeasure: 'Boxes',
    minThreshold: 30,
    unitCostInr: 2100,
    totalValueInr: 0,
    status: 'out_of_stock',
    supplier: 'Wabco India Auto Components',
    lastRestocked: '2026-08-30',
    barcode: 'FLX-INV-AUTO-715',
  },
  {
    id: 'SKU-FMCG-820',
    name: 'Refined Organic Cold-Pressed Mustard Oil Cans',
    category: 'FMCG & Food',
    warehouseId: 'WH-JPR-01',
    warehouseName: 'Jaipur Industrial Distribution Centre',
    locationCode: 'Zone A / R-01 / B-01',
    quantity: 320,
    unitOfMeasure: 'Boxes',
    minThreshold: 80,
    unitCostInr: 1850,
    totalValueInr: 592000,
    status: 'in_stock',
    supplier: 'Rajasthan Agri Organics Ltd.',
    lastRestocked: '2026-10-16',
    barcode: 'FLX-INV-FMCG-820',
  },
];

// 7. Initial Inventory Transactions
export const INITIAL_INVENTORY_TRANSACTIONS: InventoryTransaction[] = [
  {
    id: 'TRX-2026-8812',
    sku: 'SKU-AUTO-101',
    itemName: 'Precision Water Pump Impellers',
    warehouseId: 'WH-DEL-01',
    type: 'stock_in',
    quantity: 50,
    reference: 'PO-2026-DEL-9912',
    timestamp: '2026-10-19 14:10',
    performedBy: 'Harish Rawat (Store Incharge)',
    notes: 'Received from Chakan plant batch #440',
  },
  {
    id: 'TRX-2026-8809',
    sku: 'SKU-ELEC-309',
    itemName: 'Micro-Inverter IC Controllers',
    warehouseId: 'WH-BLR-01',
    type: 'stock_out',
    quantity: 12,
    reference: 'DISP-FLX-3109-BLR',
    timestamp: '2026-10-19 09:30',
    performedBy: 'Girish Hegde',
    notes: 'Allocated to Express Air Cargo flight 6E-8291',
  },
  {
    id: 'TRX-2026-8798',
    sku: 'SKU-TEXT-204',
    itemName: 'Premium Mercerized Cotton Fabric Rolls',
    warehouseId: 'WH-SURAT-01',
    type: 'stock_in',
    quantity: 40,
    reference: 'PO-GJ-SURAT-4412',
    timestamp: '2026-10-18 16:45',
    performedBy: 'Bhavin Patel',
    notes: 'Inbound consignment cleared quality check',
  },
  {
    id: 'TRX-2026-8785',
    sku: 'SKU-AUTO-715',
    itemName: 'Commercial Air Brake Booster Valves',
    warehouseId: 'WH-DEL-01',
    type: 'stock_out',
    quantity: 30,
    reference: 'SO-MNT-FLEET-105',
    timestamp: '2026-10-18 10:15',
    performedBy: 'Sunil Kumar Saxena',
    notes: 'Issued to Kanpur workshop for vehicle PB-10-CZ-9912 maintenance',
  },
  {
    id: 'TRX-2026-8772',
    sku: 'SKU-CHEM-608',
    itemName: 'High-Purity Industrial Epoxy Polymer Resin',
    warehouseId: 'WH-MUM-01',
    type: 'adjustment',
    quantity: -2,
    reference: 'AUDIT-Q3-ADJ',
    timestamp: '2026-10-17 17:00',
    performedBy: 'Pradeep Kulkarni',
    notes: 'Container seal leakage damage write-off',
  },
];

// 8. Reactive Storage Keys
const VEHICLES_KEY = 'freightline_vehicles_v1';
const DRIVERS_KEY = 'freightline_drivers_v1';
const MAINTENANCE_KEY = 'freightline_maintenance_v1';
const WAREHOUSES_KEY = 'freightline_warehouses_v1';
const LOCATIONS_KEY = 'freightline_locations_v1';
const INVENTORY_KEY = 'freightline_inventory_v1';
const INVENTORY_TX_KEY = 'freightline_inventory_tx_v1';

// Helper to broadcast storage updates
const notifyUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('freightline_storage_update'));
  }
};

// Vehicles CRUD
export const getVehicles = (): Vehicle[] => {
  if (typeof window === 'undefined') return INITIAL_VEHICLES;
  try {
    const raw = localStorage.getItem(VEHICLES_KEY);
    if (!raw) {
      localStorage.setItem(VEHICLES_KEY, JSON.stringify(INITIAL_VEHICLES));
      return INITIAL_VEHICLES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get vehicles', e);
    return INITIAL_VEHICLES;
  }
};

export const saveVehicle = (vehicle: Vehicle): void => {
  if (typeof window === 'undefined') return;
  const current = getVehicles();
  const index = current.findIndex(v => v.id === vehicle.id);
  let updated: Vehicle[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = vehicle;
  } else {
    updated = [vehicle, ...current];
  }
  localStorage.setItem(VEHICLES_KEY, JSON.stringify(updated));
  notifyUpdate();
};

export const deleteVehicle = (id: string): void => {
  if (typeof window === 'undefined') return;
  const current = getVehicles();
  const updated = current.filter(v => v.id !== id);
  localStorage.setItem(VEHICLES_KEY, JSON.stringify(updated));
  notifyUpdate();
};

// Fleet Drivers CRUD
export const getFleetDrivers = (): FleetDriver[] => {
  if (typeof window === 'undefined') return INITIAL_FLEET_DRIVERS;
  try {
    const raw = localStorage.getItem(DRIVERS_KEY);
    if (!raw) {
      localStorage.setItem(DRIVERS_KEY, JSON.stringify(INITIAL_FLEET_DRIVERS));
      return INITIAL_FLEET_DRIVERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get drivers', e);
    return INITIAL_FLEET_DRIVERS;
  }
};

export const saveFleetDriver = (driver: FleetDriver): void => {
  if (typeof window === 'undefined') return;
  const current = getFleetDrivers();
  const index = current.findIndex(d => d.id === driver.id);
  let updated: FleetDriver[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = driver;
  } else {
    updated = [driver, ...current];
  }
  localStorage.setItem(DRIVERS_KEY, JSON.stringify(updated));
  notifyUpdate();
};

export const deleteFleetDriver = (id: string): void => {
  if (typeof window === 'undefined') return;
  const current = getFleetDrivers();
  const updated = current.filter(d => d.id !== id);
  localStorage.setItem(DRIVERS_KEY, JSON.stringify(updated));
  notifyUpdate();
};

// Maintenance Records CRUD
export const getMaintenanceRecords = (): MaintenanceRecord[] => {
  if (typeof window === 'undefined') return INITIAL_MAINTENANCE;
  try {
    const raw = localStorage.getItem(MAINTENANCE_KEY);
    if (!raw) {
      localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(INITIAL_MAINTENANCE));
      return INITIAL_MAINTENANCE;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get maintenance records', e);
    return INITIAL_MAINTENANCE;
  }
};

export const saveMaintenanceRecord = (record: MaintenanceRecord): void => {
  if (typeof window === 'undefined') return;
  const current = getMaintenanceRecords();
  const index = current.findIndex(m => m.id === record.id);
  let updated: MaintenanceRecord[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = record;
  } else {
    updated = [record, ...current];
  }
  localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(updated));
  notifyUpdate();
};

// Warehouses CRUD
export const getWarehouses = (): Warehouse[] => {
  if (typeof window === 'undefined') return INITIAL_WAREHOUSES;
  try {
    const raw = localStorage.getItem(WAREHOUSES_KEY);
    if (!raw) {
      localStorage.setItem(WAREHOUSES_KEY, JSON.stringify(INITIAL_WAREHOUSES));
      return INITIAL_WAREHOUSES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get warehouses', e);
    return INITIAL_WAREHOUSES;
  }
};

export const saveWarehouse = (warehouse: Warehouse): void => {
  if (typeof window === 'undefined') return;
  const current = getWarehouses();
  const index = current.findIndex(w => w.id === warehouse.id);
  let updated: Warehouse[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = warehouse;
  } else {
    updated = [warehouse, ...current];
  }
  localStorage.setItem(WAREHOUSES_KEY, JSON.stringify(updated));
  notifyUpdate();
};

export const deleteWarehouse = (id: string): void => {
  if (typeof window === 'undefined') return;
  const current = getWarehouses();
  const updated = current.filter(w => w.id !== id);
  localStorage.setItem(WAREHOUSES_KEY, JSON.stringify(updated));
  notifyUpdate();
};

// Storage Locations CRUD
export const getStorageLocations = (warehouseId?: string): StorageLocation[] => {
  if (typeof window === 'undefined') return INITIAL_STORAGE_LOCATIONS;
  try {
    const raw = localStorage.getItem(LOCATIONS_KEY);
    const list: StorageLocation[] = raw ? JSON.parse(raw) : INITIAL_STORAGE_LOCATIONS;
    if (!raw) {
      localStorage.setItem(LOCATIONS_KEY, JSON.stringify(INITIAL_STORAGE_LOCATIONS));
    }
    return warehouseId ? list.filter(l => l.warehouseId === warehouseId) : list;
  } catch (e) {
    console.error('Failed to get storage locations', e);
    return INITIAL_STORAGE_LOCATIONS;
  }
};

export const saveStorageLocation = (loc: StorageLocation): void => {
  if (typeof window === 'undefined') return;
  const current = getStorageLocations();
  const index = current.findIndex(l => l.id === loc.id);
  let updated: StorageLocation[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = loc;
  } else {
    updated = [loc, ...current];
  }
  localStorage.setItem(LOCATIONS_KEY, JSON.stringify(updated));
  notifyUpdate();
};

// Inventory CRUD
export const getInventoryItems = (): InventoryItem[] => {
  if (typeof window === 'undefined') return INITIAL_INVENTORY;
  try {
    const raw = localStorage.getItem(INVENTORY_KEY);
    if (!raw) {
      localStorage.setItem(INVENTORY_KEY, JSON.stringify(INITIAL_INVENTORY));
      return INITIAL_INVENTORY;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get inventory', e);
    return INITIAL_INVENTORY;
  }
};

export const saveInventoryItem = (item: InventoryItem): void => {
  if (typeof window === 'undefined') return;
  const current = getInventoryItems();
  const index = current.findIndex(i => i.id === item.id);
  let updated: InventoryItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = item;
  } else {
    updated = [item, ...current];
  }
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(updated));
  notifyUpdate();
};

export const deleteInventoryItem = (id: string): void => {
  if (typeof window === 'undefined') return;
  const current = getInventoryItems();
  const updated = current.filter(i => i.id !== id);
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(updated));
  notifyUpdate();
};

export const getInventoryTransactions = (): InventoryTransaction[] => {
  if (typeof window === 'undefined') return INITIAL_INVENTORY_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(INVENTORY_TX_KEY);
    if (!raw) {
      localStorage.setItem(INVENTORY_TX_KEY, JSON.stringify(INITIAL_INVENTORY_TRANSACTIONS));
      return INITIAL_INVENTORY_TRANSACTIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get inventory transactions', e);
    return INITIAL_INVENTORY_TRANSACTIONS;
  }
};

export const adjustStock = (
  sku: string,
  delta: number,
  type: 'stock_in' | 'stock_out' | 'transfer' | 'adjustment',
  reference: string,
  notes: string = '',
  performedBy: string = 'Operations Controller'
): InventoryItem | undefined => {
  if (typeof window === 'undefined') return undefined;
  const items = getInventoryItems();
  const idx = items.findIndex(i => i.id === sku);
  if (idx === -1) return undefined;

  const target = items[idx];
  const newQty = Math.max(0, target.quantity + delta);
  let newStatus: InventoryItem['status'] = 'in_stock';
  if (newQty === 0) newStatus = 'out_of_stock';
  else if (newQty <= target.minThreshold) newStatus = 'low_stock';

  const updatedItem: InventoryItem = {
    ...target,
    quantity: newQty,
    totalValueInr: newQty * target.unitCostInr,
    status: newStatus,
    lastRestocked: delta > 0 ? new Date().toISOString().split('T')[0] : target.lastRestocked,
  };

  items[idx] = updatedItem;
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));

  // Log transaction
  const transactions = getInventoryTransactions();
  const newTx: InventoryTransaction = {
    id: `TRX-${Date.now().toString().slice(-6)}`,
    sku: target.id,
    itemName: target.name,
    warehouseId: target.warehouseId,
    type,
    quantity: delta,
    reference,
    timestamp: new Date().toLocaleString('en-IN'),
    performedBy,
    notes,
  };
  transactions.unshift(newTx);
  localStorage.setItem(INVENTORY_TX_KEY, JSON.stringify(transactions));

  notifyUpdate();
  return updatedItem;
};
