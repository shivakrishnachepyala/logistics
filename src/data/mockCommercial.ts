import type {
  Customer,
  Staff,
  Invoice,
  PaymentRecord,
  BranchRecord,
  AppSettings,
} from '../types/commercial';

// 1. Initial Customers Dataset
export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-1001',
    name: 'Sharma Textiles & Garments',
    type: 'Corporate',
    contactPerson: 'Ramesh Sharma',
    email: 'ramesh.sharma@sharmatextiles.in',
    phone: '+91 98110 44291',
    billingAddress: 'Shop No. 44, Katra Neel, Chandni Chowk',
    city: 'New Delhi',
    state: 'Delhi',
    gstin: '07AAACS1102K1Z5',
    totalShipments: 18,
    outstandingBalance: 0,
    accountStatus: 'active',
    createdAt: '2026-01-15',
  },
  {
    id: 'CUST-1002',
    name: 'Gupta Cloth Emporium',
    type: 'Corporate',
    contactPerson: 'Amit Gupta',
    email: 'amit.gupta@guptacloth.com',
    phone: '+91 94140 88210',
    billingAddress: 'Shop No. 12, Johari Bazar',
    city: 'Jaipur',
    state: 'Rajasthan',
    gstin: '08AAACG4928R1ZK',
    totalShipments: 14,
    outstandingBalance: 15400,
    accountStatus: 'active',
    createdAt: '2026-02-20',
  },
  {
    id: 'CUST-1003',
    name: 'Chakan Precision Castings Ltd.',
    type: 'Corporate',
    contactPerson: 'Nitin Deshmukh',
    email: 'nitin@chakanauto.in',
    phone: '+91 98220 88410',
    billingAddress: 'Plot 31, MIDC Chakan Phase 2',
    city: 'Pune',
    state: 'Maharashtra',
    gstin: '27AAACN9912D1Z0',
    totalShipments: 22,
    outstandingBalance: 0,
    accountStatus: 'active',
    createdAt: '2026-01-10',
  },
  {
    id: 'CUST-1004',
    name: 'Agarwal Hardware & Machinery',
    type: 'Corporate',
    contactPerson: 'Radheshyam Agarwal',
    email: 'radheshyam@agarwalmachinery.com',
    phone: '+91 94250 11980',
    billingAddress: 'Shop 55, Siyaganj Market',
    city: 'Indore',
    state: 'Madhya Pradesh',
    gstin: '23AAACA8820J1ZY',
    totalShipments: 9,
    outstandingBalance: 34500,
    accountStatus: 'active',
    createdAt: '2026-03-05',
  },
  {
    id: 'CUST-1005',
    name: 'Serena Silk & Synthetic Fabrics',
    type: 'Business Partner',
    contactPerson: 'Bhavna Mehta',
    email: 'bhavna@serenastextiles.in',
    phone: '+91 98250 44109',
    billingAddress: 'Mill Complex 4, Ring Road Market',
    city: 'Surat',
    state: 'Gujarat',
    gstin: '24AAACS9914M1Z8',
    totalShipments: 31,
    outstandingBalance: 0,
    accountStatus: 'active',
    createdAt: '2025-11-12',
  },
  {
    id: 'CUST-1006',
    name: 'Bhiwandi Fabric Wholesale Guild',
    type: 'Business Partner',
    contactPerson: 'Rajesh Patel',
    email: 'rajesh.patel@bhiwanditrade.org',
    phone: '+91 98200 77142',
    billingAddress: 'Warehouse Block 12, Mankoli Naka',
    city: 'Bhiwandi / Mumbai',
    state: 'Maharashtra',
    gstin: '27AAACB4412P1ZL',
    totalShipments: 26,
    outstandingBalance: 48000,
    accountStatus: 'active',
    createdAt: '2025-12-01',
  },
  {
    id: 'CUST-1007',
    name: 'Dr. K. S. Ramanathan',
    type: 'Individual',
    contactPerson: 'Dr. K. S. Ramanathan',
    email: 'ramanathan.ks@chennaiclinic.org',
    phone: '+91 94440 22108',
    billingAddress: '42 Karpagam Avenue, R.A. Puram',
    city: 'Chennai',
    state: 'Tamil Nadu',
    totalShipments: 3,
    outstandingBalance: 0,
    accountStatus: 'active',
    createdAt: '2026-04-18',
  },
  {
    id: 'CUST-1008',
    name: 'MedGenome Biopharma Labs',
    type: 'Corporate',
    contactPerson: 'Dr. Ananya Sen',
    email: 'ananya.sen@medgenome.bio',
    phone: '+91 98450 66201',
    billingAddress: 'Helix Biotech Park, Phase 1, Electronic City',
    city: 'Bengaluru',
    state: 'Karnataka',
    gstin: '29AAACM4401L1Z9',
    totalShipments: 12,
    outstandingBalance: 8200,
    accountStatus: 'active',
    createdAt: '2026-02-14',
  },
];

// 2. Initial Staff Dataset
export const INITIAL_STAFF: Staff[] = [
  {
    id: 'STF-201',
    fullName: 'Sunil Kumar Saxena',
    email: 'sunil.saxena@veltrax.in',
    phone: '+91 98110 44210',
    designation: 'Operations Manager',
    department: 'Operations',
    assignedBranch: 'DEL-CENTRAL',
    joiningDate: '2022-04-15',
    employmentStatus: 'active',
    emergencyContact: '+91 98110 99420',
  },
  {
    id: 'STF-202',
    fullName: 'Kavita Iyer',
    email: 'kavita.iyer@veltrax.in',
    phone: '+91 98110 66401',
    designation: 'Dispatcher',
    department: 'Operations',
    assignedBranch: 'DEL-CENTRAL',
    joiningDate: '2023-01-10',
    employmentStatus: 'active',
    emergencyContact: '+91 98110 33201',
  },
  {
    id: 'STF-203',
    fullName: 'Pradeep Kulkarni',
    email: 'pradeep.k@veltrax.in',
    phone: '+91 98200 88402',
    designation: 'Warehouse Supervisor',
    department: 'Warehouse',
    assignedBranch: 'MH-MUMBAI',
    joiningDate: '2021-08-20',
    employmentStatus: 'active',
    emergencyContact: '+91 98200 11980',
  },
  {
    id: 'STF-204',
    fullName: 'Harish Rawat',
    email: 'harish.rawat@veltrax.in',
    phone: '+91 98110 33490',
    designation: 'Fleet Manager',
    department: 'Fleet & Transport',
    assignedBranch: 'DEL-CENTRAL',
    joiningDate: '2022-11-01',
    employmentStatus: 'active',
  },
  {
    id: 'STF-205',
    fullName: 'S. Vijayaraghavan',
    email: 'vijayaraghavan@veltrax.in',
    phone: '+91 94440 66201',
    designation: 'Operations Manager',
    department: 'Operations',
    assignedBranch: 'TN-CHENNAI',
    joiningDate: '2020-03-15',
    employmentStatus: 'active',
  },
  {
    id: 'STF-206',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@veltrax.in',
    phone: '+91 98110 77142',
    designation: 'Finance Officer',
    department: 'Finance & Accounts',
    assignedBranch: 'DEL-CENTRAL',
    joiningDate: '2023-06-12',
    employmentStatus: 'active',
  },
  {
    id: 'STF-207',
    fullName: 'Bhavin Patel',
    email: 'bhavin.patel@veltrax.in',
    phone: '+91 98250 33190',
    designation: 'Warehouse Supervisor',
    department: 'Warehouse',
    assignedBranch: 'GJ-SURAT',
    joiningDate: '2022-09-18',
    employmentStatus: 'active',
  },
  {
    id: 'STF-208',
    fullName: 'Anil Deshmukh',
    email: 'anil.deshmukh@veltrax.in',
    phone: '+91 98200 99401',
    designation: 'Customer Support',
    department: 'Customer Support',
    assignedBranch: 'MH-MUMBAI',
    joiningDate: '2024-02-01',
    employmentStatus: 'active',
  },
  {
    id: 'STF-209',
    fullName: 'Girish Hegde',
    email: 'girish.hegde@veltrax.in',
    phone: '+91 98450 11980',
    designation: 'Fleet Manager',
    department: 'Fleet & Transport',
    assignedBranch: 'KA-BLR',
    joiningDate: '2021-05-10',
    employmentStatus: 'active',
  },
  {
    id: 'STF-210',
    fullName: 'Mahesh Meena',
    email: 'mahesh.meena@veltrax.in',
    phone: '+91 94140 77120',
    designation: 'Warehouse Supervisor',
    department: 'Warehouse',
    assignedBranch: 'JPR-MAIN',
    joiningDate: '2022-07-25',
    employmentStatus: 'active',
  },
];

// 3. Initial Invoices Dataset (Linked to existing sample shipments & customers)
export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-001',
    invoiceNumber: 'INV-2026-001',
    customerId: 'CUST-1001',
    customerName: 'Sharma Textiles & Garments',
    customerEmail: 'ramesh.sharma@sharmatextiles.in',
    customerAddress: 'Shop No. 44, Katra Neel, Chandni Chowk, New Delhi',
    customerGstin: '07AAACS1102K1Z5',
    shipmentId: 'FLX-8829-JPR',
    shipmentRoute: 'Delhi Central Hub → Jaipur Delivery Centre',
    issueDate: '2026-10-15',
    dueDate: '2026-10-30',
    items: [
      { id: 'ITM-1', description: 'Road Cargo Express Freight (35 Cartons, 1,420 kg)', quantity: 1, unitPrice: 11500, amount: 11500 },
      { id: 'ITM-2', description: 'Fuel Surcharge & Highway Tolls', quantity: 1, unitPrice: 1100, amount: 1100 },
      { id: 'ITM-3', description: 'Loading & Pallet Staging Surcharge', quantity: 1, unitPrice: 800, amount: 800 },
    ],
    subtotal: 13400,
    tax: 2412,
    totalAmount: 15812,
    paidAmount: 15812,
    outstandingAmount: 0,
    paymentStatus: 'Paid',
    paymentTerms: 'Net 15 Days',
    notes: 'Paid in full via SBI Corporate UPI transfer.',
  },
  {
    id: 'INV-2026-002',
    invoiceNumber: 'INV-2026-002',
    customerId: 'CUST-1006',
    customerName: 'Bhiwandi Fabric Wholesale Guild',
    customerEmail: 'rajesh.patel@bhiwanditrade.org',
    customerAddress: 'Warehouse Block 12, Mankoli Naka, Bhiwandi / Mumbai',
    customerGstin: '27AAACB4412P1ZL',
    shipmentId: 'FLX-4012-MUM',
    shipmentRoute: 'Surat Cargo Hub → Mumbai Central Godown',
    issueDate: '2026-09-25',
    dueDate: '2026-10-10', // Overdue!
    items: [
      { id: 'ITM-1', description: 'Intermodal Road Freight (Textile Rolls, 4,200 kg)', quantity: 1, unitPrice: 36000, amount: 36000 },
      { id: 'ITM-2', description: 'Container Demurrage & Drayage Allowance', quantity: 1, unitPrice: 4680, amount: 4680 },
    ],
    subtotal: 40680,
    tax: 7320,
    totalAmount: 48000,
    paidAmount: 0,
    outstandingAmount: 48000,
    paymentStatus: 'Overdue',
    paymentTerms: 'Net 15 Days',
    notes: 'Follow up required: Client delayed due to monsoon flood hold.',
  },
  {
    id: 'INV-2026-003',
    invoiceNumber: 'INV-2026-003',
    customerId: 'CUST-1008',
    customerName: 'MedGenome Biopharma Labs',
    customerEmail: 'ananya.sen@medgenome.bio',
    customerAddress: 'Helix Biotech Park, Phase 1, Electronic City, Bengaluru',
    customerGstin: '29AAACM4401L1Z9',
    shipmentId: 'FLX-3109-BLR',
    shipmentRoute: 'Chennai Airport Hub → Bengaluru Cargo Park',
    issueDate: '2026-10-18',
    dueDate: '2026-11-02',
    items: [
      { id: 'ITM-1', description: 'Priority Air Cargo Freight (Flight 6E-8291)', quantity: 1, unitPrice: 21500, amount: 21500 },
      { id: 'ITM-2', description: 'Cold Chain Temperature Monitoring (2-8°C)', quantity: 1, unitPrice: 2400, amount: 2400 },
    ],
    subtotal: 23900,
    tax: 4300,
    totalAmount: 28200,
    paidAmount: 20000,
    outstandingAmount: 8200,
    paymentStatus: 'Partially Paid',
    paymentTerms: 'Net 15 Days',
    notes: 'Partial advance payment received via HDFC NEFT.',
  },
  {
    id: 'INV-2026-004',
    invoiceNumber: 'INV-2026-004',
    customerId: 'CUST-1002',
    customerName: 'Gupta Cloth Emporium',
    customerEmail: 'amit.gupta@guptacloth.com',
    customerAddress: 'Shop No. 12, Johari Bazar, Jaipur',
    customerGstin: '08AAACG4928R1ZK',
    shipmentId: 'FLX-7741-KOL',
    shipmentRoute: 'Delhi ICD Tughlakabad → Kolkata Shalimar Siding',
    issueDate: '2026-10-16',
    dueDate: '2026-10-31',
    items: [
      { id: 'ITM-1', description: 'Rail Intermodal Container Freight (Train 12952)', quantity: 1, unitPrice: 48000, amount: 48000 },
      { id: 'ITM-2', description: 'Rail Siding Terminal & Shunting Fees', quantity: 1, unitPrice: 7420, amount: 7420 },
    ],
    subtotal: 55420,
    tax: 9980,
    totalAmount: 65400,
    paidAmount: 50000,
    outstandingAmount: 15400,
    paymentStatus: 'Partially Paid',
    paymentTerms: 'Net 15 Days',
    notes: 'Advance booking deposit received.',
  },
  {
    id: 'INV-2026-005',
    invoiceNumber: 'INV-2026-005',
    customerId: 'CUST-1004',
    customerName: 'Agarwal Hardware & Machinery',
    customerEmail: 'radheshyam@agarwalmachinery.com',
    customerAddress: 'Shop 55, Siyaganj Market, Indore',
    customerGstin: '23AAACA8820J1ZY',
    shipmentId: 'FLX-1194-IND',
    shipmentRoute: 'Pune Chakan Hub → Indore Siyaganj Centre',
    issueDate: '2026-10-19',
    dueDate: '2026-11-03',
    items: [
      { id: 'ITM-1', description: 'Heavy Commercial Transport (Castings, 1,100 kg)', quantity: 1, unitPrice: 29200, amount: 29200 },
    ],
    subtotal: 29200,
    tax: 5300,
    totalAmount: 34500,
    paidAmount: 0,
    outstandingAmount: 34500,
    paymentStatus: 'Pending',
    paymentTerms: 'COD / Net 15 Days',
    notes: 'Awaiting dispatch confirmation from Pune hub.',
  },
  {
    id: 'INV-2026-006',
    invoiceNumber: 'INV-2026-006',
    customerId: 'CUST-1003',
    customerName: 'Chakan Precision Castings Ltd.',
    customerEmail: 'nitin@chakanauto.in',
    customerAddress: 'Plot 31, MIDC Chakan Phase 2, Pune',
    customerGstin: '27AAACN9912D1Z0',
    issueDate: '2026-10-01',
    dueDate: '2026-10-15',
    items: [
      { id: 'ITM-1', description: 'Dedicated Warehousing Retainer (Zone A High Rack)', quantity: 1, unitPrice: 44000, amount: 44000 },
    ],
    subtotal: 44000,
    tax: 8000,
    totalAmount: 52000,
    paidAmount: 52000,
    outstandingAmount: 0,
    paymentStatus: 'Paid',
    paymentTerms: 'Net 15 Days',
    notes: 'Monthly retainer settled via Corporate NetBanking.',
  },
  {
    id: 'INV-2026-007',
    invoiceNumber: 'INV-2026-007',
    customerId: 'CUST-1005',
    customerName: 'Serena Silk & Synthetic Fabrics',
    customerEmail: 'bhavna@serenastextiles.in',
    customerAddress: 'Mill Complex 4, Ring Road Market, Surat',
    customerGstin: '24AAACS9914M1Z8',
    issueDate: '2026-10-19',
    dueDate: '2026-11-05',
    items: [
      { id: 'ITM-1', description: 'Ocean Container Drayage to Nhava Sheva (2x40Ft)', quantity: 1, unitPrice: 18600, amount: 18600 },
    ],
    subtotal: 18600,
    tax: 3400,
    totalAmount: 22000,
    paidAmount: 0,
    outstandingAmount: 22000,
    paymentStatus: 'Draft',
    paymentTerms: 'Net 15 Days',
    notes: 'Draft quote prepared for upcoming coastal shipment.',
  },
];

// 4. Initial Payment Records Dataset (Simulated Payments)
export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'PAY-2026-901',
    invoiceId: 'INV-2026-001',
    customerId: 'CUST-1001',
    customerName: 'Sharma Textiles & Garments',
    paymentDate: '2026-10-18 11:30',
    paymentMethod: 'UPI',
    amount: 15812,
    transactionReference: 'UPI/492100412/SBI',
    paymentStatus: 'completed',
    simulated: true,
    notes: 'Settled via SBI merchant UPI QR.',
  },
  {
    id: 'PAY-2026-902',
    invoiceId: 'INV-2026-003',
    customerId: 'CUST-1008',
    customerName: 'MedGenome Biopharma Labs',
    paymentDate: '2026-10-19 14:15',
    paymentMethod: 'Bank Transfer',
    amount: 20000,
    transactionReference: 'NEFT/HDFC/9921441',
    paymentStatus: 'completed',
    simulated: true,
    notes: 'Part payment received.',
  },
  {
    id: 'PAY-2026-903',
    invoiceId: 'INV-2026-004',
    customerId: 'CUST-1002',
    customerName: 'Gupta Cloth Emporium',
    paymentDate: '2026-10-17 16:40',
    paymentMethod: 'Bank Transfer',
    amount: 50000,
    transactionReference: 'RTGS/ICICI/8812490',
    paymentStatus: 'completed',
    simulated: true,
    notes: 'Initial booking installment.',
  },
  {
    id: 'PAY-2026-904',
    invoiceId: 'INV-2026-006',
    customerId: 'CUST-1003',
    customerName: 'Chakan Precision Castings Ltd.',
    paymentDate: '2026-10-08 10:20',
    paymentMethod: 'Card',
    amount: 52000,
    transactionReference: 'CARD/VISA/4019',
    paymentStatus: 'completed',
    simulated: true,
    notes: 'Corporate Visa credit card transaction.',
  },
];

// 5. Initial Branches Dataset
export const INITIAL_BRANCHES: BranchRecord[] = [
  {
    id: 'BR-DEL-01',
    name: 'Delhi Central Sorting & National Gateway',
    code: 'DEL-CENTRAL',
    city: 'New Delhi',
    state: 'Delhi',
    address: 'Plot 44-48, Okhla Industrial Area Phase 1, Near ICD Tughlakabad',
    branchManager: 'Sunil Kumar Saxena',
    contactNumber: '+91 98110 44210',
    email: 'delhi.hub@veltrax.in',
    operationalStatus: 'active',
    establishedDate: '2019-03-15',
  },
  {
    id: 'BR-MUM-01',
    name: 'Mumbai Bhiwandi Logistics Gateway',
    code: 'MH-MUMBAI',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Survey 102/B, Mumbai-Nashik Highway, Mankoli Naka, Bhiwandi',
    branchManager: 'Pradeep Kulkarni',
    contactNumber: '+91 98200 88402',
    email: 'mumbai.hub@veltrax.in',
    operationalStatus: 'active',
    establishedDate: '2019-08-20',
  },
  {
    id: 'BR-JPR-01',
    name: 'Jaipur Industrial Distribution Hub',
    code: 'JPR-MAIN',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'Road No. 9, Vishwakarma Industrial Area (VKI), Sikar Road',
    branchManager: 'Mahesh Meena',
    contactNumber: '+91 94140 77120',
    email: 'jaipur.hub@veltrax.in',
    operationalStatus: 'active',
    establishedDate: '2020-01-10',
  },
  {
    id: 'BR-SURAT-01',
    name: 'Surat Textile & Western Cargo Center',
    code: 'GJ-SURAT',
    city: 'Surat',
    state: 'Gujarat',
    address: 'Plot 12-16, Sachin GIDC Industrial Area, Near Diamond Park',
    branchManager: 'Bhavin Patel',
    contactNumber: '+91 98250 33190',
    email: 'surat.hub@veltrax.in',
    operationalStatus: 'active',
    establishedDate: '2020-11-05',
  },
  {
    id: 'BR-CHN-01',
    name: 'Chennai Coastal & Air Express Depot',
    code: 'TN-CHENNAI',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Expressway Road, Madhavaram Logistics Complex, Near Port Gate 4',
    branchManager: 'S. Vijayaraghavan',
    contactNumber: '+91 94440 66201',
    email: 'chennai.hub@veltrax.in',
    operationalStatus: 'active',
    establishedDate: '2021-04-12',
  },
  {
    id: 'BR-BLR-01',
    name: 'Bengaluru Tech & Electronics Park',
    code: 'KA-BLR',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: 'Phase 2, Hosur Road, Electronic City Industrial Area',
    branchManager: 'Girish Hegde',
    contactNumber: '+91 98450 11980',
    email: 'bangalore.hub@veltrax.in',
    operationalStatus: 'active',
    establishedDate: '2021-09-01',
  },
];

// 6. Initial Application Settings
export const INITIAL_SETTINGS: AppSettings = {
  general: {
    companyName: 'VELTRAX Logistics Management System',
    contactEmail: 'operations@veltrax.in',
    contactPhone: '+91 1800 200 4882',
    companyAddress: 'VELTRAX Towers, 14 Barakhamba Road, Connaught Place, New Delhi 110001',
    defaultCurrency: 'INR (₹)',
    timeZone: 'Asia/Kolkata (IST)',
  },
  operational: {
    defaultShipmentStatus: 'pending',
    defaultTransportMode: 'heavy_haul',
    idPrefix: 'FLX-',
    enableWhatsappNotifications: true,
    enableSmsAlerts: true,
  },
  appearance: {
    theme: 'light',
    sidebarDefaultExpanded: true,
    compactDensity: false,
  },
  profile: {
    displayName: 'Fleet Operations Commander',
    email: 'admin@veltrax.in',
    phone: '+91 98110 00000',
    role: 'Fleet Administrator',
  },
};

// 7. Reactive Storage Keys
const CUSTOMERS_KEY = 'freightline_customers_v1';
const STAFF_KEY = 'freightline_staff_v1';
const INVOICES_KEY = 'freightline_invoices_v1';
const PAYMENTS_KEY = 'freightline_payments_v1';
const BRANCHES_KEY = 'freightline_branches_v1';
const SETTINGS_KEY = 'freightline_settings_v1';

const notifyStorageUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('freightline_storage_update'));
  }
};

// Customers CRUD
export const getCustomers = (): Customer[] => {
  if (typeof window === 'undefined') return INITIAL_CUSTOMERS;
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    if (!raw) {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get customers', e);
    return INITIAL_CUSTOMERS;
  }
};

export const saveCustomer = (customer: Customer): void => {
  if (typeof window === 'undefined') return;
  const current = getCustomers();
  const index = current.findIndex(c => c.id === customer.id);
  let updated: Customer[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = customer;
  } else {
    updated = [customer, ...current];
  }
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updated));
  notifyStorageUpdate();
};

export const deleteCustomer = (id: string): void => {
  if (typeof window === 'undefined') return;
  const current = getCustomers();
  const updated = current.filter(c => c.id !== id);
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updated));
  notifyStorageUpdate();
};

// Staff CRUD
export const getStaff = (): Staff[] => {
  if (typeof window === 'undefined') return INITIAL_STAFF;
  try {
    const raw = localStorage.getItem(STAFF_KEY);
    if (!raw) {
      localStorage.setItem(STAFF_KEY, JSON.stringify(INITIAL_STAFF));
      return INITIAL_STAFF;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get staff', e);
    return INITIAL_STAFF;
  }
};

export const saveStaff = (staff: Staff): void => {
  if (typeof window === 'undefined') return;
  const current = getStaff();
  const index = current.findIndex(s => s.id === staff.id);
  let updated: Staff[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = staff;
  } else {
    updated = [staff, ...current];
  }
  localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
  notifyStorageUpdate();
};

export const deleteStaff = (id: string): void => {
  if (typeof window === 'undefined') return;
  const current = getStaff();
  const updated = current.filter(s => s.id !== id);
  localStorage.setItem(STAFF_KEY, JSON.stringify(updated));
  notifyStorageUpdate();
};

// Invoices CRUD
export const getInvoices = (): Invoice[] => {
  if (typeof window === 'undefined') return INITIAL_INVOICES;
  try {
    const raw = localStorage.getItem(INVOICES_KEY);
    if (!raw) {
      localStorage.setItem(INVOICES_KEY, JSON.stringify(INITIAL_INVOICES));
      return INITIAL_INVOICES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get invoices', e);
    return INITIAL_INVOICES;
  }
};

export const saveInvoice = (invoice: Invoice): void => {
  if (typeof window === 'undefined') return;
  const current = getInvoices();
  const index = current.findIndex(i => i.id === invoice.id);
  let updated: Invoice[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = invoice;
  } else {
    updated = [invoice, ...current];
  }
  localStorage.setItem(INVOICES_KEY, JSON.stringify(updated));

  // Also update customer outstanding balance
  updateCustomerBalance(invoice.customerId);

  notifyStorageUpdate();
};

export const deleteInvoice = (id: string): void => {
  if (typeof window === 'undefined') return;
  const current = getInvoices();
  const target = current.find(i => i.id === id);
  const updated = current.filter(i => i.id !== id);
  localStorage.setItem(INVOICES_KEY, JSON.stringify(updated));

  if (target) {
    updateCustomerBalance(target.customerId);
  }
  notifyStorageUpdate();
};

// Payments CRUD and Recalculation
export const getPayments = (): PaymentRecord[] => {
  if (typeof window === 'undefined') return INITIAL_PAYMENTS;
  try {
    const raw = localStorage.getItem(PAYMENTS_KEY);
    if (!raw) {
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify(INITIAL_PAYMENTS));
      return INITIAL_PAYMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get payments', e);
    return INITIAL_PAYMENTS;
  }
};

export const recordPayment = (paymentData: Omit<PaymentRecord, 'id' | 'simulated'>): { success: boolean; message: string; payment?: PaymentRecord } => {
  if (typeof window === 'undefined') return { success: false, message: 'Window unavailable' };

  const invoices = getInvoices();
  const invoiceIdx = invoices.findIndex(i => i.id === paymentData.invoiceId);
  if (invoiceIdx === -1) {
    return { success: false, message: 'Referenced invoice not found' };
  }

  const invoice = invoices[invoiceIdx];
  if (invoice.paymentStatus === 'Cancelled') {
    return { success: false, message: 'Cannot record payment on a cancelled invoice' };
  }
  if (invoice.paymentStatus === 'Paid') {
    return { success: false, message: 'This invoice is already fully paid' };
  }

  const payAmount = Number(paymentData.amount);
  if (payAmount <= 0) {
    return { success: false, message: 'Payment amount must be greater than zero' };
  }
  if (payAmount > invoice.outstandingAmount) {
    return { success: false, message: `Payment exceeds outstanding balance of ₹${invoice.outstandingAmount.toLocaleString()}` };
  }

  const newPaidAmount = invoice.paidAmount + payAmount;
  const newOutstanding = Math.max(0, invoice.totalAmount - newPaidAmount);
  const newStatus = newOutstanding === 0 ? 'Paid' : 'Partially Paid';

  const updatedInvoice: Invoice = {
    ...invoice,
    paidAmount: newPaidAmount,
    outstandingAmount: newOutstanding,
    paymentStatus: newStatus,
  };

  invoices[invoiceIdx] = updatedInvoice;
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));

  // Create payment record
  const paymentId = `PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const newPayment: PaymentRecord = {
    ...paymentData,
    id: paymentId,
    simulated: true,
  };

  const currentPayments = getPayments();
  const updatedPayments = [newPayment, ...currentPayments];
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(updatedPayments));

  // Recalculate customer's balance
  updateCustomerBalance(invoice.customerId);

  notifyStorageUpdate();
  return { success: true, message: `Simulated payment of ₹${payAmount.toLocaleString()} recorded successfully!`, payment: newPayment };
};

// Helper: Recalculate Customer's Total Outstanding Balance from active invoices
const updateCustomerBalance = (customerId: string) => {
  const invoices = getInvoices();
  const customerInvoices = invoices.filter(i => i.customerId === customerId && i.paymentStatus !== 'Cancelled');
  const outstanding = customerInvoices.reduce((sum, inv) => sum + inv.outstandingAmount, 0);

  const customers = getCustomers();
  const cIdx = customers.findIndex(c => c.id === customerId);
  if (cIdx >= 0) {
    customers[cIdx] = {
      ...customers[cIdx],
      outstandingBalance: outstanding,
    };
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  }
};

// Branches CRUD
export const getBranches = (): BranchRecord[] => {
  if (typeof window === 'undefined') return INITIAL_BRANCHES;
  try {
    const raw = localStorage.getItem(BRANCHES_KEY);
    if (!raw) {
      localStorage.setItem(BRANCHES_KEY, JSON.stringify(INITIAL_BRANCHES));
      return INITIAL_BRANCHES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get branches', e);
    return INITIAL_BRANCHES;
  }
};

export const saveBranch = (branch: BranchRecord): void => {
  if (typeof window === 'undefined') return;
  const current = getBranches();
  const index = current.findIndex(b => b.id === branch.id);
  let updated: BranchRecord[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = branch;
  } else {
    updated = [branch, ...current];
  }
  localStorage.setItem(BRANCHES_KEY, JSON.stringify(updated));
  notifyStorageUpdate();
};

export const deleteBranch = (id: string): void => {
  if (typeof window === 'undefined') return;
  const current = getBranches();
  const updated = current.filter(b => b.id !== id);
  localStorage.setItem(BRANCHES_KEY, JSON.stringify(updated));
  notifyStorageUpdate();
};

// App Settings CRUD
export const getAppSettings = (): AppSettings => {
  if (typeof window === 'undefined') return INITIAL_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get settings', e);
    return INITIAL_SETTINGS;
  }
};

export const saveAppSettings = (settings: AppSettings): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  notifyStorageUpdate();
};

// Reset & Restore Sample Datasets
export const resetAllSampleData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CUSTOMERS_KEY);
  localStorage.removeItem(STAFF_KEY);
  localStorage.removeItem(INVOICES_KEY);
  localStorage.removeItem(PAYMENTS_KEY);
  localStorage.removeItem(BRANCHES_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem('freightline_vehicles_v1');
  localStorage.removeItem('freightline_drivers_v1');
  localStorage.removeItem('freightline_maintenance_v1');
  localStorage.removeItem('freightline_warehouses_v1');
  localStorage.removeItem('freightline_locations_v1');
  localStorage.removeItem('freightline_inventory_v1');
  localStorage.removeItem('freightline_inventory_tx_v1');
  localStorage.removeItem('freightline_shipments_data_v4');
  localStorage.removeItem('freightline_transport_assignments_v1');
  localStorage.removeItem('freightline_active_branch');
  localStorage.removeItem('freightline_active_role');
  notifyStorageUpdate();
};
