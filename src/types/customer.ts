// FreightLine Customer Portal Type Definitions

export interface CustomerAccount {
  id: string; // e.g. "CUST-001"
  fullName: string;
  email: string;
  mobile: string;
  passwordHash: string; // Client-side SHA-256 hash for demonstration
  company?: string;
  gst?: string;
  createdAt: string;
  defaultSenderAddressId?: string;
}

export type AddressType = 'sender' | 'receiver';

export interface SavedAddress {
  id: string; // e.g. "ADDR-001"
  customerId: string;
  type: AddressType;
  label: string; // e.g. "Primary Warehouse", "Chandni Chowk Shop", "Jaipur Depot"
  name: string;
  company?: string;
  mobile: string;
  email?: string;
  houseNo?: string;
  area?: string;
  landmark?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
  createdAt: string;
}

export type BookingStatus = 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';

export interface BookingRecord {
  bookingId: string; // e.g. "BKG-2026-8829"
  trackingId: string; // e.g. "FLX-8829-JPR"
  customerId: string;
  bookingDate: string; // ISO or formatted date
  originCity: string;
  destinationCity: string;
  originState?: string;
  destinationState?: string;
  cargoDescription: string;
  cargoCategory: string;
  weightKg: number;
  quantity: number;
  paymentMethod: 'upi' | 'cod' | 'card' | 'netbanking';
  totalAmount: number;
  status: BookingStatus;
  notes?: string;
}

export interface CustomerRegistrationInput {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  company?: string;
  gst?: string;
}

export interface CustomerLoginInput {
  email: string;
  password: string;
}

export interface CustomerProfileUpdateInput {
  fullName: string;
  mobile: string;
  company?: string;
  gst?: string;
}
