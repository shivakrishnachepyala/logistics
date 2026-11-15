import type {
  CustomerAccount,
  SavedAddress,
  BookingRecord,
  CustomerRegistrationInput,
  CustomerLoginInput,
  CustomerProfileUpdateInput,
} from '../types/customer';

// Browser-safe SHA-256 password hashing helper
export async function hashPassword(plainText: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(plainText);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.warn('SubtleCrypto error, falling back', e);
    }
  }
  // Fallback hash simulation for environments without subtle crypto
  let hash = 0;
  for (let i = 0; i < plainText.length; i++) {
    const char = plainText.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'sim_hash_' + Math.abs(hash).toString(16);
}

// Pre-calculated SHA-256 for "Demo@123"
const DEMO_PASSWORD_HASH = 'ff96673205dc722320598ebf8f88325b2ac56922d5a2164b5765868274bc0d73';

// Storage keys
const CUSTOMERS_KEY = 'freightline_customer_accounts_v1';
const ADDRESSES_KEY = 'freightline_customer_addresses_v1';
const BOOKINGS_KEY = 'freightline_customer_bookings_v1';
const SESSION_KEY = 'freightline_customer_session_v1';

// Initial pre-seeded customer accounts
export const INITIAL_CUSTOMERS: CustomerAccount[] = [
  {
    id: 'CUST-001',
    fullName: 'Ramesh Sharma',
    email: 'customer@freightline.in',
    mobile: '9811044291',
    passwordHash: DEMO_PASSWORD_HASH,
    company: 'Sharma Textiles & Garments',
    gst: '07AAACS1102K1Z5',
    createdAt: '2026-09-15T10:00:00Z',
    defaultSenderAddressId: 'ADDR-001',
  },
  {
    id: 'CUST-002',
    fullName: 'Priya Patel',
    email: 'priya@freightline.in',
    mobile: '9825011942',
    passwordHash: DEMO_PASSWORD_HASH,
    company: 'Patel Silk & Jacquard Mills',
    gst: '24AAACP8820L1Z9',
    createdAt: '2026-10-01T14:30:00Z',
    defaultSenderAddressId: 'ADDR-101',
  },
];

// Initial pre-seeded saved addresses
export const INITIAL_ADDRESSES: SavedAddress[] = [
  // Ramesh Sharma's addresses
  {
    id: 'ADDR-001',
    customerId: 'CUST-001',
    type: 'sender',
    label: 'Main Shop (Chandni Chowk)',
    name: 'Ramesh Sharma',
    company: 'Sharma Textiles & Garments',
    mobile: '9811044291',
    email: 'ramesh.sharma@sharmatextiles.in',
    houseNo: 'Shop No. 44',
    area: 'Katra Neel, Chandni Chowk',
    landmark: 'Near Town Hall',
    address: 'Shop No. 44, Katra Neel, Chandni Chowk',
    city: 'Delhi',
    state: 'Delhi',
    postalCode: '110006',
    isDefault: true,
    createdAt: '2026-09-15T10:05:00Z',
  },
  {
    id: 'ADDR-002',
    customerId: 'CUST-001',
    type: 'receiver',
    label: 'Gupta Cloth Emporium (Jaipur)',
    name: 'Amit Gupta',
    company: 'Gupta Cloth Emporium',
    mobile: '9414088210',
    email: 'amit.gupta@guptacloth.com',
    houseNo: 'Shop No. 12',
    area: 'Johari Bazar',
    landmark: 'Opposite Sanganeri Gate',
    address: 'Shop No. 12, Johari Bazar',
    city: 'Jaipur',
    state: 'Rajasthan',
    postalCode: '302001',
    isDefault: false,
    createdAt: '2026-09-16T11:20:00Z',
  },
  {
    id: 'ADDR-003',
    customerId: 'CUST-001',
    type: 'receiver',
    label: 'Deccan Garments Hub (Bengaluru)',
    name: 'K. Ramanathan',
    company: 'Deccan Garment Distributors',
    mobile: '9845022194',
    email: 'ramanathan@deccangarments.in',
    houseNo: 'Shed 14, Phase 2',
    area: 'Peenya Industrial Area',
    landmark: 'Near Metro Pillar 210',
    address: 'Shed 14, Phase 2, Peenya Industrial Area',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560058',
    isDefault: false,
    createdAt: '2026-09-20T16:45:00Z',
  },
  // Priya Patel's addresses
  {
    id: 'ADDR-101',
    customerId: 'CUST-002',
    type: 'sender',
    label: 'Mill Office & Dispatch (Surat)',
    name: 'Priya Patel',
    company: 'Patel Silk & Jacquard Mills',
    mobile: '9825011942',
    email: 'priya@freightline.in',
    houseNo: 'Plot 104',
    area: 'Ring Road Textile Market',
    landmark: 'Near Millennium Market',
    address: 'Plot 104, Ring Road Textile Market',
    city: 'Surat',
    state: 'Gujarat',
    postalCode: '395002',
    isDefault: true,
    createdAt: '2026-10-01T14:35:00Z',
  },
  {
    id: 'ADDR-102',
    customerId: 'CUST-002',
    type: 'receiver',
    label: 'Shah Brothers Saree Palace (Mumbai)',
    name: 'Suresh Shah',
    company: 'Shah Brothers Saree Palace',
    mobile: '9820133410',
    email: 'suresh@shahbrothers.in',
    houseNo: 'Shop 88',
    area: 'Mangaldas Market, Kalbadevi',
    landmark: 'Near Crawford Market',
    address: 'Shop 88, Mangaldas Market, Kalbadevi',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400002',
    isDefault: false,
    createdAt: '2026-10-02T09:15:00Z',
  },
];

// Initial pre-seeded booking records
export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    bookingId: 'BKG-2026-8829',
    trackingId: 'FLX-8829-JPR',
    customerId: 'CUST-001',
    bookingDate: '2026-10-19T06:00:00Z',
    originCity: 'Delhi',
    destinationCity: 'Jaipur',
    originState: 'Delhi',
    destinationState: 'Rajasthan',
    cargoDescription: 'Cotton shirts, sarees & dress materials',
    cargoCategory: 'Box / Carton (Clothes & Garments)',
    weightKg: 45,
    quantity: 12,
    paymentMethod: 'cod',
    totalAmount: 906,
    status: 'dispatched',
    notes: 'Urgent festival inventory for Johari Bazar retail shop',
  },
  {
    bookingId: 'BKG-2026-3109',
    trackingId: 'FLX-3109-BLR',
    customerId: 'CUST-001',
    bookingDate: '2026-10-18T09:30:00Z',
    originCity: 'Chennai',
    destinationCity: 'Bengaluru',
    originState: 'Tamil Nadu',
    destinationState: 'Karnataka',
    cargoDescription: 'Industrial woven yarn and embroidery reels',
    cargoCategory: 'Textile Rolls & Yarn Bales',
    weightKg: 80,
    quantity: 8,
    paymentMethod: 'upi',
    totalAmount: 1450,
    status: 'dispatched',
    notes: 'Direct factory transfer to Peenya unit',
  },
  {
    bookingId: 'BKG-2026-4012',
    trackingId: 'FLX-4012-MUM',
    customerId: 'CUST-002',
    bookingDate: '2026-10-17T08:00:00Z',
    originCity: 'Surat',
    destinationCity: 'Mumbai',
    originState: 'Gujarat',
    destinationState: 'Maharashtra',
    cargoDescription: 'Jacquard woven designer sarees',
    cargoCategory: 'Box / Carton (Clothes & Garments)',
    weightKg: 28,
    quantity: 15,
    paymentMethod: 'upi',
    totalAmount: 720,
    status: 'delivered',
    notes: 'Delivered successfully at Crawford Market',
  },
];

// ----------------------------------------------------
// CUSTOMER REPOSITORY METHODS
// ----------------------------------------------------

export function getStoredCustomers(): CustomerAccount[] {
  if (typeof window === 'undefined') return INITIAL_CUSTOMERS;
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    if (!raw) {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load customers from localStorage', e);
    return INITIAL_CUSTOMERS;
  }
}

export function saveCustomer(customer: CustomerAccount): void {
  const current = getStoredCustomers();
  const idx = current.findIndex(c => c.id === customer.id);
  let updated: CustomerAccount[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = customer;
  } else {
    updated = [customer, ...current];
  }
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updated));
}

export function findCustomerByEmail(email: string): CustomerAccount | undefined {
  const customers = getStoredCustomers();
  const cleanEmail = email.trim().toLowerCase();
  return customers.find(c => c.email.toLowerCase() === cleanEmail);
}

export function findCustomerById(id: string): CustomerAccount | undefined {
  const customers = getStoredCustomers();
  return customers.find(c => c.id === id);
}

export async function registerCustomer(input: CustomerRegistrationInput): Promise<{
  success: boolean;
  customer?: CustomerAccount;
  error?: string;
}> {
  const cleanEmail = input.email.trim().toLowerCase();
  const cleanMobile = input.mobile.trim().replace(/\D/g, '');

  if (!input.fullName.trim()) {
    return { success: false, error: 'Full name is required.' };
  }
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (cleanMobile.length < 10) {
    return { success: false, error: 'Mobile number must be at least 10 digits.' };
  }
  if (!input.password || input.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }
  if (input.password !== input.confirmPassword) {
    return { success: false, error: 'Passwords do not match.' };
  }

  const existing = findCustomerByEmail(cleanEmail);
  if (existing) {
    return {
      success: false,
      error: `An account with ${cleanEmail} already exists. Please sign in or use another email.`,
    };
  }

  const passwordHash = await hashPassword(input.password);
  const newId = `CUST-${String(getStoredCustomers().length + 1).padStart(3, '0')}`;

  const newCustomer: CustomerAccount = {
    id: newId,
    fullName: input.fullName.trim(),
    email: cleanEmail,
    mobile: cleanMobile,
    passwordHash,
    company: input.company?.trim() || '',
    gst: input.gst?.trim() || '',
    createdAt: new Date().toISOString(),
  };

  saveCustomer(newCustomer);
  setCurrentCustomerSession(newCustomer);

  return { success: true, customer: newCustomer };
}

export async function authenticateCustomer(input: CustomerLoginInput): Promise<{
  success: boolean;
  customer?: CustomerAccount;
  error?: string;
}> {
  const cleanEmail = input.email.trim().toLowerCase();
  const customer = findCustomerByEmail(cleanEmail);

  if (!customer) {
    return {
      success: false,
      error: 'No customer account found with this email. Please check your spelling or register.',
    };
  }

  const hash = await hashPassword(input.password);
  if (customer.passwordHash !== hash) {
    return {
      success: false,
      error: 'Incorrect password. Please try again or use the demo login buttons.',
    };
  }

  setCurrentCustomerSession(customer);
  return { success: true, customer };
}

export function getCurrentCustomerSession(): CustomerAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const sessionData = JSON.parse(raw);
    // Refresh against stored record to get latest profile updates
    const customer = findCustomerById(sessionData.id);
    return customer || sessionData;
  } catch (e) {
    console.error('Failed to parse customer session', e);
    return null;
  }
}

export function setCurrentCustomerSession(customer: CustomerAccount): void {
  if (typeof window === 'undefined') return;
  // Store session without exposing passwordHash directly in session object if desirable
  const sessionCopy = { ...customer };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionCopy));
}

export function clearCustomerSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

export function updateCustomerProfile(
  id: string,
  input: CustomerProfileUpdateInput
): { success: boolean; customer?: CustomerAccount; error?: string } {
  const customer = findCustomerById(id);
  if (!customer) {
    return { success: false, error: 'Customer not found.' };
  }

  const updated: CustomerAccount = {
    ...customer,
    fullName: input.fullName.trim() || customer.fullName,
    mobile: input.mobile.trim() || customer.mobile,
    company: input.company !== undefined ? input.company.trim() : customer.company,
    gst: input.gst !== undefined ? input.gst.trim() : customer.gst,
  };

  saveCustomer(updated);
  setCurrentCustomerSession(updated);
  return { success: true, customer: updated };
}

// ----------------------------------------------------
// SAVED ADDRESSES REPOSITORY METHODS
// ----------------------------------------------------

export function getStoredAddresses(): SavedAddress[] {
  if (typeof window === 'undefined') return INITIAL_ADDRESSES;
  try {
    const raw = localStorage.getItem(ADDRESSES_KEY);
    if (!raw) {
      localStorage.setItem(ADDRESSES_KEY, JSON.stringify(INITIAL_ADDRESSES));
      return INITIAL_ADDRESSES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved addresses', e);
    return INITIAL_ADDRESSES;
  }
}

export function getAddressesByCustomerId(customerId: string): SavedAddress[] {
  const all = getStoredAddresses();
  return all.filter(a => a.customerId === customerId);
}

export function saveAddress(address: SavedAddress): void {
  const current = getStoredAddresses();
  const idx = current.findIndex(a => a.id === address.id);
  let updated: SavedAddress[];

  // If this address is set as default sender, clear other default senders for this customer
  if (address.type === 'sender' && address.isDefault) {
    current.forEach(a => {
      if (a.customerId === address.customerId && a.type === 'sender' && a.id !== address.id) {
        a.isDefault = false;
      }
    });
  }

  if (idx >= 0) {
    updated = [...current];
    updated[idx] = address;
  } else {
    updated = [address, ...current];
  }
  localStorage.setItem(ADDRESSES_KEY, JSON.stringify(updated));

  // If sender default, link to customer record
  if (address.type === 'sender' && address.isDefault) {
    const customer = findCustomerById(address.customerId);
    if (customer) {
      saveCustomer({ ...customer, defaultSenderAddressId: address.id });
    }
  }
}

export function deleteAddress(addressId: string, customerId: string): boolean {
  const current = getStoredAddresses();
  const filtered = current.filter(a => !(a.id === addressId && a.customerId === customerId));
  if (filtered.length === current.length) return false;
  localStorage.setItem(ADDRESSES_KEY, JSON.stringify(filtered));
  return true;
}

export function setDefaultSenderAddress(addressId: string, customerId: string): void {
  const current = getStoredAddresses();
  current.forEach(a => {
    if (a.customerId === customerId && a.type === 'sender') {
      a.isDefault = a.id === addressId;
    }
  });
  localStorage.setItem(ADDRESSES_KEY, JSON.stringify(current));

  const customer = findCustomerById(customerId);
  if (customer) {
    saveCustomer({ ...customer, defaultSenderAddressId: addressId });
  }
}

// ----------------------------------------------------
// BOOKING HISTORY REPOSITORY METHODS
// ----------------------------------------------------

export function getStoredBookings(): BookingRecord[] {
  if (typeof window === 'undefined') return INITIAL_BOOKINGS;
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load bookings from localStorage', e);
    return INITIAL_BOOKINGS;
  }
}

export function getBookingsByCustomerId(customerId: string): BookingRecord[] {
  const all = getStoredBookings();
  return all
    .filter(b => b.customerId === customerId)
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
}

export function saveBooking(booking: BookingRecord): void {
  const current = getStoredBookings();
  const idx = current.findIndex(b => b.bookingId === booking.bookingId);
  let updated: BookingRecord[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = booking;
  } else {
    updated = [booking, ...current];
  }
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
}
