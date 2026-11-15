// Fleet Management Types
export type VehicleType =
  | 'Heavy Trucks'
  | 'Light Commercial Vehicles'
  | 'Trailers'
  | 'Container Trucks'
  | 'Refrigerated Trucks'
  | 'Tankers';

export type VehicleStatus = 'available' | 'in_transit' | 'maintenance' | 'off_duty';

export interface Vehicle {
  id: string; // e.g. VEH-101
  plateNumber: string; // e.g. RJ-14-GA-8820
  makeModel: string; // e.g. Eicher Pro 2049
  type: VehicleType;
  capacityKg: number;
  capacityCbm: number;
  assignedDriverId?: string;
  assignedDriverName?: string;
  currentLocation: string;
  status: VehicleStatus;
  fuelLevelPercent: number;
  odometerKm: number;
  lastServiceDate: string;
  nextServiceDue: string;
  insuranceExpiry: string;
  pucExpiry: string;
}

export type DriverStatus = 'available' | 'on_route' | 'off_duty' | 'leave';

export interface FleetDriver {
  id: string; // e.g. DRV-104
  name: string;
  phone: string;
  email?: string;
  licenseNumber: string; // e.g. DL-04201889201
  licenseType: string; // e.g. Heavy Transport Commercial (HMV)
  licenseExpiry: string;
  assignedVehiclePlate?: string;
  status: DriverStatus;
  currentLocation: string;
  rating: number;
  shiftHoursLogged: number;
  experienceYears: number;
}

export interface MaintenanceRecord {
  id: string; // e.g. MNT-2026-091
  vehicleId: string;
  vehiclePlate: string;
  serviceDate: string;
  maintenanceType: string; // Routine Oil, Brake Overhaul, etc.
  costInr: number;
  serviceCenter: string;
  nextServiceDate: string;
  status: 'completed' | 'in_progress' | 'scheduled';
  technicianNotes?: string;
}

// Warehouse Management Types
export type WarehouseStatus = 'active' | 'maintenance' | 'full' | 'closed';

export interface StorageLocation {
  id: string; // e.g. LOC-DEL-Z1-R04-B02
  warehouseId: string;
  zone: string;
  section: string;
  rack: string;
  bin: string;
  type: string;
  capacityUnits: number;
  occupiedUnits: number;
  currentSku?: string;
  status: 'available' | 'partial' | 'full' | 'maintenance';
}

export interface WarehouseActivity {
  id: string;
  timestamp: string;
  event: string;
  user: string;
}

export interface Warehouse {
  id: string; // e.g. WH-DEL-01
  name: string;
  branchId: string; // e.g. DEL-CENTRAL, MH-MUMBAI
  city: string;
  state: string;
  address: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  totalCapacitySqFt: number;
  totalCapacityCbm: number;
  occupiedCapacityCbm: number;
  operationalStatus: WarehouseStatus;
  dockCount: number;
  temperatureControlled: boolean;
  tempRange?: string;
  zones: string[];
  recentActivity: WarehouseActivity[];
}

// Inventory Management Types
export type InventoryCategory =
  | 'Automotive Parts'
  | 'Textiles & Garments'
  | 'Industrial Machinery'
  | 'Electronics & Tech'
  | 'Pharmaceuticals'
  | 'Chemicals & Liquids'
  | 'FMCG & Food';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstocked';

export interface InventoryItem {
  id: string; // SKU e.g. SKU-AUTO-4091
  name: string;
  category: InventoryCategory;
  warehouseId: string;
  warehouseName: string;
  locationCode: string; // Zone A / R-04 / B-12
  quantity: number;
  unitOfMeasure: 'Boxes' | 'Units' | 'Pallets' | 'Kg' | 'Litres' | 'Rolls';
  minThreshold: number; // Reorder alert trigger
  unitCostInr: number;
  totalValueInr: number; // quantity * unitCostInr
  status: StockStatus;
  supplier: string;
  lastRestocked: string;
  barcode?: string;
}

export interface InventoryTransaction {
  id: string; // e.g. TRX-2026-8812
  sku: string;
  itemName: string;
  warehouseId: string;
  type: 'stock_in' | 'stock_out' | 'transfer' | 'adjustment';
  quantity: number;
  reference: string; // Consignment ID, PO, or Transfer ID
  timestamp: string;
  performedBy: string;
  notes?: string;
}
