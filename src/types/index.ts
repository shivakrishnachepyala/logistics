export * from './analytics';

export type UserRole = 'admin' | 'dispatcher' | 'driver' | 'customer';
export type BranchId = 'all' | 'DEL-CENTRAL' | 'JPR-MAIN' | 'GJ-SURAT' | 'MH-MUMBAI' | 'TN-CHENNAI';

export interface ReceiverPreferences {
  landmark?: string;
  preferredSlot?: string;
  instructions?: string;
  updatedAt?: string;
}

export type ShipmentStatus = 'pending' | 'in-transit' | 'delivered' | 'delayed';

export type ServiceMode = 'ocean_freight' | 'air_express' | 'intermodal_rail' | 'heavy_haul';

export interface Checkpoint {
  id: string;
  location: string;
  city: string;
  country: string;
  timestamp: string;
  status: ShipmentStatus;
  facilityCode: string;
  description: string;
  completed: boolean;
  isCurrent?: boolean;
  temperatureCelsius?: number;
  coordinates?: { lat: number; lng: number };
}

export interface PartyDetails {
  name: string;
  company: string;
  houseNo?: string;
  area?: string;
  landmark?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
  contactEmail: string;
  contactPhone: string;
  taxIdOrEori?: string; // GST Number (Only if business, optional)
}

export interface PackageSpecs {
  type: string;
  quantity: number;
  weightKg: number;
  weightGrams?: number;
  volumeCbm: number;
  declaredValueInr?: number;
  declaredValueUsd?: number;
  hazardous: boolean;
  hazmatClass?: string;
  unNumber?: string;
  sealNumber: string;
  temperatureControlled: boolean;
  tempRange?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: 'Bill of Lading' | 'Commercial Invoice' | 'Customs Entry' | 'Dangerous Goods Decl' | 'Proof of Delivery' | 'Inspection Certificate';
  docNumber: string;
  issuedDate: string;
  fileSize: string;
  status: 'verified' | 'draft' | 'pending_signature';
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  event: string;
  terminalCode: string;
  notes?: string;
}

export interface DriverInfo {
  id: string;
  name: string;
  badgeNumber: string;
  phone: string;
  vehiclePlate: string;
  vehicleType: string;
  status: 'on_route' | 'available' | 'maintenance' | 'off_duty';
  currentLocation: string;
  currentShipmentId?: string;
  shiftHoursLogged: number;
  rating: number;
}

export type DelayReasonCode =
  | 'heavy_rain'
  | 'road_blocked'
  | 'festival_rush'
  | 'vehicle_breakdown'
  | 'receiver_unavailable'
  | 'wrong_address'
  | 'other';

export interface DelayHistoryEntry {
  id: string;
  timestamp: string;
  updatedBy: string; // e.g. "Rameshwar Dayal (Operations Desk)"
  reasonCode: DelayReasonCode;
  customerExplanation: string;
  internalNotes?: string; // Private staff-only operational notes, NEVER exposed to customer
  actionTaken?: string;
  revisedEta?: string;
  location?: string;
  status: ShipmentStatus;
}

export interface DelayInfo {
  reason: string;
  reasonHindi?: string;
  reasonCode: DelayReasonCode;
  durationHours: number;
  durationText: string;
  originalEta: string;
  revisedEta: string;
  location: string;
  historyText: string;
  actionOption?: 'change_time' | 'call_us' | 'confirm_address';
  customerExplanation?: string;
  internalNotes?: string; // Internal operational notes (Staff only)
  actionTaken?: string;   // Short explanation of the action being taken
  updatedAt?: string;     // Last update timestamp
  history?: DelayHistoryEntry[];
}

export interface PhotoProof {
  pickupPhotoUrl?: string;
  pickupTimestamp?: string;
  pickupHandedBy?: string;
  deliveryPhotoUrl?: string;
  deliveryTimestamp?: string;
  deliveredTo?: string;
  otpVerified: boolean;
}

export interface DeliveryPromise {
  confidencePercent: number; // e.g. 90
  promisedDay: string; // e.g. "Thursday"
  promisedDate: string; // e.g. "23/10/2026"
  description?: string;
}

export interface PriceBreakdown {
  baseCharge: number;
  fuelCharge: number;
  packingCharge: number;
  pickupCharge: number;
  codFee: number;
  gstAmount: number;
  total: number;
}

export interface ProblemReport {
  id: string;
  shipmentId: string;
  issueType: 'damaged' | 'not_delivered' | 'wrong_parcel' | 'other';
  description: string;
  photoUrl?: string;
  submittedAt: string;
  status: 'received' | 'investigating' | 'resolved';
}

export interface Shipment {
  id: string; // e.g. FLX-8829-DXB or FLX-9921-JPR
  billOfLading: string; // BOL / Receipt number
  bookingRef: string;
  originHub: string;
  originHubCode: string;
  destinationHub: string;
  destinationHubCode: string;
  serviceMode: ServiceMode;
  status: ShipmentStatus;
  progressPercent: number;
  eta: string;
  dispatchedAt: string;
  deliveredAt?: string;
  carrier: string;
  vesselOrFlight?: string;
  sender: PartyDetails;
  receiver: PartyDetails;
  cargo: PackageSpecs;
  checkpoints: Checkpoint[];
  assignedDriver?: DriverInfo;
  documents: DocumentItem[];
  activities: ActivityEvent[];
  customsStatus: 'cleared' | 'in_inspection' | 'pre_approved' | 'action_required';
  priorityLevel: 'standard' | 'expedited' | 'critical_overnight';
  paymentMethod?: 'upi' | 'cod' | 'card' | 'netbanking';
  whatsappUpdates?: boolean;
  deliveryTimeEstimate?: string;
  delayInfo?: DelayInfo;
  deliveryPromise?: DeliveryPromise;
  photoProof?: PhotoProof;
  deliveryOtp?: string; // 4-digit code e.g. "4829"
  receiverPreferences?: ReceiverPreferences;
  priceBreakdown?: PriceBreakdown;
  transportAssignment?: TransportAssignment;
  customerId?: string; // Optional: Link to authenticated customer account (e.g. CUST-001)
  bookingId?: string; // Optional: Customer self-service booking identifier (e.g. BKG-2026-8829)
}

export type TransportMode = 'road' | 'rail' | 'air' | 'sea';
export type CarrierType = 'in_house' | 'third_party';
export type AssignmentStatus = 'assigned' | 'dispatched' | 'in_transit' | 'completed' | 'cancelled';

export interface RoadAssignmentDetails {
  vehicleType: string;
  vehiclePlate: string;
  driverId?: string;
  driverName: string;
  driverPhone: string;
  driverBadge?: string;
  trailerNumber?: string;
  tripManifestId: string; // e-Way bill / Trip manifest number
  odometerStartKm?: number;
}

export interface RailAssignmentDetails {
  railCarrier: string; // e.g., CONCOR, Indian Railways Freight
  trainRakeNo: string; // Train or Rake number
  wagonId: string; // Wagon / Container ID
  rrNumber: string; // Railway Receipt (RR) number
  originTerminal: string; // Rail siding or freight terminal
  destinationTerminal: string;
  fobPoint?: string;
}

export interface AirAssignmentDetails {
  airline: string; // e.g., IndiGo CarGo, Air India Cargo, SpiceXpress, Blue Dart Aviation
  flightNumber: string;
  awbNumber: string; // 11-digit Air Waybill
  originAirport: string; // IATA (e.g. DEL, BOM, BLR)
  destinationAirport: string;
  cargoHoldOrUld: string; // ULD / Palette container
}

export interface SeaAssignmentDetails {
  shippingLine: string; // e.g., Maersk, MSC, CMA CGM, SCI
  vesselName: string;
  voyageNumber: string;
  containerNumber: string; // ISO 6346 container number
  sealNumber: string;
  mblNumber: string; // Master Bill of Lading
  portOfLoading: string; // POL (e.g. JNPT Nhava Sheva, Mundra)
  portOfDischarge: string; // POD (e.g. Chennai Port)
}

export interface TransportAssignment {
  id: string; // e.g. ASN-2026-9021
  shipmentId: string;
  mode: TransportMode;
  carrierType: CarrierType;
  carrierName: string;
  status: AssignmentStatus;
  assignedAt: string;
  dispatchedAt?: string;
  estimatedDelivery?: string;
  notes?: string;
  assignedBy: string;
  roadDetails?: RoadAssignmentDetails;
  railDetails?: RailAssignmentDetails;
  airDetails?: AirAssignmentDetails;
  seaDetails?: SeaAssignmentDetails;
}

export * from './assets';
export * from './commercial';
