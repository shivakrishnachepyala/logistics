// Commercial & Administration Types

export type CustomerType = 'Individual' | 'Corporate' | 'Business Partner';
export type CustomerStatus = 'active' | 'suspended' | 'pending';

export interface Customer {
  id: string; // e.g. CUST-1001
  name: string; // Company Name or Individual Name
  type: CustomerType;
  contactPerson: string;
  email: string;
  phone: string;
  billingAddress: string;
  city: string;
  state: string;
  gstin?: string;
  totalShipments: number;
  outstandingBalance: number;
  accountStatus: CustomerStatus;
  createdAt: string;
}

export type StaffRole =
  | 'Administrator'
  | 'Operations Manager'
  | 'Dispatcher'
  | 'Fleet Manager'
  | 'Warehouse Supervisor'
  | 'Finance Officer'
  | 'Customer Support';

export type EmploymentStatus = 'active' | 'on_leave' | 'terminated';

export interface Staff {
  id: string; // e.g. STF-201
  fullName: string;
  email: string;
  phone: string;
  designation: StaffRole;
  department: string;
  assignedBranch: string; // Branch Code e.g. DEL-CENTRAL, MH-MUMBAI
  joiningDate: string;
  employmentStatus: EmploymentStatus;
  emergencyContact?: string;
}

export type InvoiceStatus = 'Draft' | 'Pending' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string; // e.g. INV-2026-001
  invoiceNumber: string; // e.g. INV-2026-001
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerGstin?: string;
  shipmentId?: string; // Optional linked consignment e.g. FLX-8829-JPR
  shipmentRoute?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number; // e.g. 18% GST
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  paymentStatus: InvoiceStatus;
  paymentTerms: string;
  notes?: string;
}

export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'UPI' | 'Card' | 'Other';

export interface PaymentRecord {
  id: string; // e.g. PAY-2026-9041
  invoiceId: string;
  customerId: string;
  customerName: string;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  amount: number;
  transactionReference: string;
  paymentStatus: 'completed' | 'processing' | 'failed';
  simulated: boolean; // Flag marking simulated record
  notes?: string;
}

export type BranchStatus = 'active' | 'inactive' | 'under_expansion';

export interface BranchRecord {
  id: string; // e.g. BR-DEL-01
  name: string;
  code: string; // e.g. DEL-CENTRAL
  city: string;
  state: string;
  address: string;
  branchManager: string;
  contactNumber: string;
  email: string;
  operationalStatus: BranchStatus;
  establishedDate: string;
}

export interface AppSettings {
  general: {
    companyName: string;
    logoUrl?: string;
    contactEmail: string;
    contactPhone: string;
    companyAddress: string;
    defaultCurrency: string;
    timeZone: string;
  };
  operational: {
    defaultShipmentStatus: string;
    defaultTransportMode: string;
    idPrefix: string;
    enableWhatsappNotifications: boolean;
    enableSmsAlerts: boolean;
  };
  appearance: {
    theme: 'light' | 'navy';
    sidebarDefaultExpanded: boolean;
    compactDensity: boolean;
  };
  profile: {
    displayName: string;
    email: string;
    phone: string;
    role: string;
  };
}
