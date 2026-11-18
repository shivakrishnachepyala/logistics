import React, { useState, useEffect, useMemo } from 'react';
import {
  getCustomers,
  saveCustomer,
  deleteCustomer,
  getStaff,
  saveStaff,
  deleteStaff,
  getInvoices,
  getBranches,
} from '../data/mockCommercial';
import { getStoredShipments } from '../data/mockShipments';
import type {
  Customer,
  Staff,
  CustomerType,
  CustomerStatus,
  StaffRole,
  EmploymentStatus,
  Invoice,
} from '../types/commercial';
import type { Shipment } from '../types';
import { AppIcon } from '../components/common/AppIcon';
import { useEnterprise } from '../context/EnterpriseContext';

const CUSTOMER_TYPES: CustomerType[] = ['Corporate', 'Individual', 'Business Partner'];
const CUSTOMER_STATUSES: CustomerStatus[] = ['active', 'suspended', 'pending'];

const STAFF_ROLES: StaffRole[] = [
  'Administrator',
  'Operations Manager',
  'Dispatcher',
  'Fleet Manager',
  'Warehouse Supervisor',
  'Finance Officer',
  'Customer Support',
];
const EMPLOYMENT_STATUSES: EmploymentStatus[] = ['active', 'on_leave', 'terminated'];

const DEPARTMENTS = [
  'Fleet Operations',
  'Warehousing & Sorting',
  'Dispatch & Logistics',
  'Finance & Accounts',
  'General Administration',
];

export const CustomersStaffPage: React.FC = () => {
  const { branchLabel } = useEnterprise();
  const [activeTab, setActiveTab] = useState<'customers' | 'staff'>('customers');

  // Datasets from reactive storage
  const [customers, setCustomers] = useState<Customer[]>(() => getCustomers());
  const [staff, setStaff] = useState<Staff[]>(() => getStaff());
  const [invoices, setInvoices] = useState<Invoice[]>(() => getInvoices());
  const [shipments, setShipments] = useState<Shipment[]>(() => getStoredShipments());
  const [branches] = useState(() => getBranches());

  // Listen for storage events
  useEffect(() => {
    const handleUpdate = () => {
      setCustomers(getCustomers());
      setStaff(getStaff());
      setInvoices(getInvoices());
      setShipments(getStoredShipments());
    };
    window.addEventListener('freightline_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('freightline_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Customer Filter & Sort States
  const [customerSearch, setCustomerSearch] = useState<string>('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>('all');
  const [customerStatusFilter, setCustomerStatusFilter] = useState<string>('all');
  const [customerSortBy, setCustomerSortBy] = useState<'name' | 'outstandingBalance' | 'totalShipments' | 'createdAt'>('name');
  const [customerSortAsc, setCustomerSortAsc] = useState<boolean>(true);
  const [customerPage, setCustomerPage] = useState<number>(1);
  const customerPageSize = 6;

  // Staff Filter States
  const [staffSearch, setStaffSearch] = useState<string>('');
  const [staffRoleFilter, setStaffRoleFilter] = useState<string>('all');
  const [staffDeptFilter, setStaffDeptFilter] = useState<string>('all');
  const [staffStatusFilter, setStaffStatusFilter] = useState<string>('all');
  const [staffBranchFilter, setStaffBranchFilter] = useState<string>('all');
  const [staffPage, setStaffPage] = useState<number>(1);
  const staffPageSize = 6;

  // Modal Dialog States - Customers
  const [showAddCustomerModal, setShowAddCustomerModal] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);

  // Modal Dialog States - Staff
  const [showAddStaffModal, setShowAddStaffModal] = useState<boolean>(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [viewingStaff, setViewingStaff] = useState<Staff | null>(null);
  const [deletingStaffId, setDeletingStaffId] = useState<string | null>(null);

  // Customer Form State
  const [custForm, setCustForm] = useState<Partial<Customer>>(() => ({
    name: '',
    contactPerson: '',
    type: 'Corporate',
    email: '',
    phone: '+91 ',
    city: 'New Delhi',
    state: 'Delhi',
    gstin: '',
    billingAddress: '',
    outstandingBalance: 0,
    accountStatus: 'active',
    totalShipments: 0,
  }));

  // Staff Form State
  const [stfForm, setStfForm] = useState<Partial<Staff>>(() => ({
    fullName: '',
    email: '',
    phone: '+91 ',
    designation: 'Operations Manager',
    department: 'Dispatch & Logistics',
    assignedBranch: 'DEL-CENTRAL',
    employmentStatus: 'active',
    joiningDate: '2026-01-15',
    emergencyContact: '',
  }));

  // Filtered & Sorted Customers
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        if (customerTypeFilter !== 'all' && c.type !== customerTypeFilter) return false;
        if (customerStatusFilter !== 'all' && c.accountStatus !== customerStatusFilter) return false;
        if (customerSearch.trim()) {
          const q = customerSearch.toLowerCase().trim();
          const matches =
            c.name.toLowerCase().includes(q) ||
            c.contactPerson.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phone.includes(q) ||
            (c.gstin && c.gstin.toLowerCase().includes(q));
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (customerSortBy === 'name') {
          diff = a.name.localeCompare(b.name);
        } else if (customerSortBy === 'outstandingBalance') {
          diff = a.outstandingBalance - b.outstandingBalance;
        } else if (customerSortBy === 'totalShipments') {
          diff = a.totalShipments - b.totalShipments;
        } else if (customerSortBy === 'createdAt') {
          diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return customerSortAsc ? diff : -diff;
      });
  }, [customers, customerTypeFilter, customerStatusFilter, customerSearch, customerSortBy, customerSortAsc]);

  const paginatedCustomers = useMemo(() => {
    const start = (customerPage - 1) * customerPageSize;
    return filteredCustomers.slice(start, start + customerPageSize);
  }, [filteredCustomers, customerPage]);

  const totalCustomerPages = Math.ceil(filteredCustomers.length / customerPageSize) || 1;

  // Filtered Staff
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      if (staffRoleFilter !== 'all' && s.designation !== staffRoleFilter) return false;
      if (staffDeptFilter !== 'all' && s.department !== staffDeptFilter) return false;
      if (staffStatusFilter !== 'all' && s.employmentStatus !== staffStatusFilter) return false;
      if (staffBranchFilter !== 'all' && s.assignedBranch !== staffBranchFilter) return false;
      if (staffSearch.trim()) {
        const q = staffSearch.toLowerCase().trim();
        const matches =
          s.fullName.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.phone.includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [staff, staffRoleFilter, staffDeptFilter, staffStatusFilter, staffBranchFilter, staffSearch]);

  const paginatedStaff = useMemo(() => {
    const start = (staffPage - 1) * staffPageSize;
    return filteredStaff.slice(start, start + staffPageSize);
  }, [filteredStaff, staffPage]);

  const totalStaffPages = Math.ceil(filteredStaff.length / staffPageSize) || 1;

  // Customer KPIs
  const customerKpis = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.accountStatus === 'active').length;
    const corporate = customers.filter((c) => c.type === 'Corporate').length;
    const totalReceivables = customers.reduce((sum, c) => sum + (c.outstandingBalance || 0), 0);
    return { total, active, corporate, totalReceivables };
  }, [customers]);

  // Staff KPIs
  const staffKpis = useMemo(() => {
    const total = staff.length;
    const active = staff.filter((s) => s.employmentStatus === 'active').length;
    const branchCount = new Set(staff.map((s) => s.assignedBranch)).size;
    const deptCount = new Set(staff.map((s) => s.department)).size;
    return { total, active, branchCount, deptCount };
  }, [staff]);

  // Helper: Get linked shipments for viewing customer
  const linkedCustomerShipments = useMemo(() => {
    if (!viewingCustomer) return [];
    const custName = viewingCustomer.name.toLowerCase();
    const contact = viewingCustomer.contactPerson.toLowerCase();
    return shipments.filter((s) => {
      const senderName = s.sender.name.toLowerCase();
      const senderComp = s.sender.company.toLowerCase();
      const receiverName = s.receiver.name.toLowerCase();
      const receiverComp = s.receiver.company.toLowerCase();
      return (
        senderName.includes(custName) ||
        senderComp.includes(custName) ||
        senderName.includes(contact) ||
        receiverName.includes(custName) ||
        receiverComp.includes(custName) ||
        receiverName.includes(contact)
      );
    });
  }, [viewingCustomer, shipments]);

  // Helper: Get linked invoices for viewing customer
  const linkedCustomerInvoices = useMemo(() => {
    if (!viewingCustomer) return [];
    return invoices.filter((inv) => inv.customerId === viewingCustomer.id);
  }, [viewingCustomer, invoices]);

  // Handlers: Customer CRUD
  const handleOpenAddCustomer = () => {
    setCustForm({
      name: '',
      contactPerson: '',
      type: 'Corporate',
      email: '',
      phone: '+91 ',
      city: 'New Delhi',
      state: 'Delhi',
      gstin: '',
      billingAddress: '',
      outstandingBalance: 0,
      accountStatus: 'active',
      totalShipments: 0,
    });
    setEditingCustomer(null);
    setShowAddCustomerModal(true);
  };

  const handleOpenEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setCustForm({ ...customer });
    setShowAddCustomerModal(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custForm.name || !custForm.email || !custForm.phone) {
      alert('Please fill in required fields: Name, Email, and Phone.');
      return;
    }

    const payload: Customer = {
      id: editingCustomer ? editingCustomer.id : `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: custForm.name || '',
      type: custForm.type || 'Corporate',
      contactPerson: custForm.contactPerson || custForm.name || '',
      email: custForm.email || '',
      phone: custForm.phone || '',
      billingAddress: custForm.billingAddress || '',
      city: custForm.city || 'New Delhi',
      state: custForm.state || 'Delhi',
      gstin: custForm.gstin || '',
      totalShipments: Number(custForm.totalShipments) || 0,
      outstandingBalance: Number(custForm.outstandingBalance) || 0,
      accountStatus: custForm.accountStatus || 'active',
      createdAt: editingCustomer ? editingCustomer.createdAt : new Date().toISOString().split('T')[0],
    };

    saveCustomer(payload);
    setShowAddCustomerModal(false);
  };

  const handleConfirmDeleteCustomer = () => {
    if (deletingCustomerId) {
      deleteCustomer(deletingCustomerId);
      setDeletingCustomerId(null);
      if (viewingCustomer && viewingCustomer.id === deletingCustomerId) {
        setViewingCustomer(null);
      }
    }
  };

  // Handlers: Staff CRUD
  const handleOpenAddStaff = () => {
    setStfForm({
      fullName: '',
      email: '',
      phone: '+91 ',
      designation: 'Operations Manager',
      department: 'Dispatch & Logistics',
      assignedBranch: branches[0]?.code || 'DEL-CENTRAL',
      employmentStatus: 'active',
      joiningDate: new Date().toISOString().split('T')[0],
      emergencyContact: '',
    });
    setEditingStaff(null);
    setShowAddStaffModal(true);
  };

  const handleOpenEditStaff = (member: Staff) => {
    setEditingStaff(member);
    setStfForm({ ...member });
    setShowAddStaffModal(true);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stfForm.fullName || !stfForm.email || !stfForm.phone) {
      alert('Please fill in required fields: Full Name, Email, and Phone.');
      return;
    }

    const payload: Staff = {
      id: editingStaff ? editingStaff.id : `EMP-${Math.floor(100 + Math.random() * 900)}`,
      fullName: stfForm.fullName || '',
      email: stfForm.email || '',
      phone: stfForm.phone || '',
      designation: stfForm.designation || 'Operations Manager',
      department: stfForm.department || 'Dispatch & Logistics',
      assignedBranch: stfForm.assignedBranch || 'DEL-CENTRAL',
      employmentStatus: stfForm.employmentStatus || 'active',
      joiningDate: stfForm.joiningDate || new Date().toISOString().split('T')[0],
      emergencyContact: stfForm.emergencyContact || '',
    };

    saveStaff(payload);
    setShowAddStaffModal(false);
  };

  const handleConfirmDeleteStaff = () => {
    if (deletingStaffId) {
      deleteStaff(deletingStaffId);
      setDeletingStaffId(null);
      if (viewingStaff && viewingStaff.id === deletingStaffId) {
        setViewingStaff(null);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-navy">Commercial Operations & Staffing</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {branchLabel}
            </span>
          </div>
          <p className="text-sm text-secondary mt-1">
            Manage corporate client accounts, billing relationships, and cross-branch logistics personnel.
          </p>
        </div>

        {/* Global Action CTA based on active tab */}
        <div className="flex items-center gap-3">
          {activeTab === 'customers' ? (
            <button
              onClick={handleOpenAddCustomer}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange hover:bg-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              <AppIcon name="plus" size={16} />
              <span>Add Customer</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddStaff}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange hover:bg-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              <AppIcon name="plus" size={16} />
              <span>Add Staff Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'customers'
              ? 'border-orange text-orange'
              : 'border-transparent text-secondary hover:text-navy'
          }`}
        >
          <AppIcon name="customers" size={16} />
          <span>Customers Directory</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
            {customers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'staff'
              ? 'border-orange text-orange'
              : 'border-transparent text-secondary hover:text-navy'
          }`}
        >
          <AppIcon name="briefcase" size={16} />
          <span>Staff & Personnel</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
            {staff.length}
          </span>
        </button>
      </div>

      {/* TAB 1: CUSTOMERS DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          {/* Customer KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-secondary">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Customers</span>
                <span className="p-2 rounded-lg bg-slate-100 text-navy">
                  <AppIcon name="customers" size={18} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-navy">{customerKpis.total}</div>
              <div className="mt-1 text-xs text-secondary">Registered client entities</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-secondary">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Accounts</span>
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <AppIcon name="check-circle" size={18} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-600">{customerKpis.active}</div>
              <div className="mt-1 text-xs text-secondary">In good operational standing</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-secondary">
                <span className="text-xs font-semibold uppercase tracking-wider">Corporate Clients</span>
                <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <AppIcon name="building" size={18} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-blue-600">{customerKpis.corporate}</div>
              <div className="mt-1 text-xs text-secondary">B2B enterprise contracts</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-secondary">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Receivables</span>
                <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <AppIcon name="dollar-sign" size={18} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-amber-700">
                ₹{customerKpis.totalReceivables.toLocaleString('en-IN')}
              </div>
              <div className="mt-1 text-xs text-secondary">Cumulative outstanding balance</div>
            </div>
          </div>

          {/* Filter, Search & Controls */}
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search Bar */}
              <div className="md:col-span-5 relative">
                <input
                  type="text"
                  placeholder="Search by customer name, contact, GSTIN, phone, or email..."
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setCustomerPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                />
                <span className="absolute left-3 top-2.5 text-slate-400 pointer-events-none">
                  <AppIcon name="search" size={16} />
                </span>
              </div>

              {/* Type Filter */}
              <div className="md:col-span-2">
                <select
                  value={customerTypeFilter}
                  onChange={(e) => {
                    setCustomerTypeFilter(e.target.value);
                    setCustomerPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                >
                  <option value="all">All Customer Types</option>
                  {CUSTOMER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="md:col-span-2">
                <select
                  value={customerStatusFilter}
                  onChange={(e) => {
                    setCustomerStatusFilter(e.target.value);
                    setCustomerPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                >
                  <option value="all">All Statuses</option>
                  {CUSTOMER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="md:col-span-3 flex items-center gap-2">
                <select
                  value={customerSortBy}
                  onChange={(e) =>
                    setCustomerSortBy(
                      e.target.value as 'name' | 'outstandingBalance' | 'totalShipments' | 'createdAt'
                    )
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                >
                  <option value="name">Sort: Name (A-Z)</option>
                  <option value="outstandingBalance">Sort: Outstanding Balance</option>
                  <option value="totalShipments">Sort: Total Shipments</option>
                  <option value="createdAt">Sort: Created Date</option>
                </select>
                <button
                  type="button"
                  title="Toggle Sort Order"
                  onClick={() => setCustomerSortAsc(!customerSortAsc)}
                  className="p-2 bg-slate-50 border border-border rounded-lg text-secondary hover:text-navy hover:bg-slate-100 transition-colors"
                >
                  <AppIcon name={customerSortAsc ? 'arrow-up' : 'arrow-down'} size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-border text-xs uppercase font-semibold text-secondary">
                    <th className="py-3 px-4">Client / Company</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Contact Person & Info</th>
                    <th className="py-3 px-4">Tax ID / GSTIN</th>
                    <th className="py-3 px-4 text-center">Shipments</th>
                    <th className="py-3 px-4 text-right">Outstanding</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-secondary">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AppIcon name="search" size={28} className="text-slate-300" />
                          <p className="font-medium text-navy">No customers found</p>
                          <p className="text-xs text-secondary">Try adjusting your filters or search keywords.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedCustomers.map((c) => {
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-navy">{c.name}</div>
                            <div className="text-xs text-secondary">{c.city}, {c.state}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">{c.id}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                c.type === 'Corporate'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : c.type === 'Business Partner'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {c.type}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-medium text-navy">{c.contactPerson}</div>
                            <div className="text-xs text-secondary">{c.phone}</div>
                            <div className="text-xs text-secondary truncate max-w-[180px]">{c.email}</div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                            {c.gstin || '—'}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className="font-semibold text-navy">{c.totalShipments}</span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div
                              className={`font-semibold ${
                                c.outstandingBalance > 0 ? 'text-amber-700' : 'text-slate-500'
                              }`}
                            >
                              ₹{c.outstandingBalance.toLocaleString('en-IN')}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                                c.accountStatus === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : c.accountStatus === 'pending'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {c.accountStatus}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setViewingCustomer(c)}
                                className="p-1.5 text-secondary hover:text-navy hover:bg-slate-100 rounded-md transition-colors"
                                title="View Customer Profile & History"
                              >
                                <AppIcon name="external-link" size={15} />
                              </button>
                              <button
                                onClick={() => handleOpenEditCustomer(c)}
                                className="p-1.5 text-secondary hover:text-navy hover:bg-slate-100 rounded-md transition-colors"
                                title="Edit Customer Details"
                              >
                                <AppIcon name="edit" size={15} />
                              </button>
                              <button
                                onClick={() => setDeletingCustomerId(c.id)}
                                className="p-1.5 text-secondary hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                title="Delete Customer"
                              >
                                <AppIcon name="trash" size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredCustomers.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-t border-border text-xs text-secondary">
                <div>
                  Showing{' '}
                  <span className="font-semibold text-navy">
                    {Math.min(filteredCustomers.length, (customerPage - 1) * customerPageSize + 1)}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold text-navy">
                    {Math.min(filteredCustomers.length, customerPage * customerPageSize)}
                  </span>{' '}
                  of <span className="font-semibold text-navy">{filteredCustomers.length}</span> clients
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={customerPage <= 1}
                    onClick={() => setCustomerPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 border border-border rounded bg-white text-secondary hover:text-navy disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <AppIcon name="chevron-left" size={14} />
                  </button>
                  <span className="px-2 font-medium text-navy">
                    {customerPage} / {totalCustomerPages}
                  </span>
                  <button
                    disabled={customerPage >= totalCustomerPages}
                    onClick={() => setCustomerPage((p) => Math.min(totalCustomerPages, p + 1))}
                    className="p-1.5 border border-border rounded bg-white text-secondary hover:text-navy disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <AppIcon name="chevron-right" size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STAFF & PERSONNEL */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          {/* Staff KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-secondary">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Staff</span>
                <span className="p-2 rounded-lg bg-slate-100 text-navy">
                  <AppIcon name="customers" size={18} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-navy">{staffKpis.total}</div>
              <div className="mt-1 text-xs text-secondary">Workforce roster</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-secondary">
                <span className="text-xs font-semibold uppercase tracking-wider">Active on Duty</span>
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <AppIcon name="check-circle" size={18} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-600">{staffKpis.active}</div>
              <div className="mt-1 text-xs text-secondary">Currently rostered</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-secondary">
                <span className="text-xs font-semibold uppercase tracking-wider">Branches Staffed</span>
                <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <AppIcon name="building" size={18} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-blue-600">{staffKpis.branchCount}</div>
              <div className="mt-1 text-xs text-secondary">Active operational hubs</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-secondary">
                <span className="text-xs font-semibold uppercase tracking-wider">Departments</span>
                <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <AppIcon name="briefcase" size={18} />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-amber-700">{staffKpis.deptCount}</div>
              <div className="mt-1 text-xs text-secondary">Functional units</div>
            </div>
          </div>

          {/* Staff Filter Bar */}
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search */}
              <div className="md:col-span-4 relative">
                <input
                  type="text"
                  placeholder="Search staff by name, ID, email, or phone..."
                  value={staffSearch}
                  onChange={(e) => {
                    setStaffSearch(e.target.value);
                    setStaffPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                />
                <span className="absolute left-3 top-2.5 text-slate-400 pointer-events-none">
                  <AppIcon name="search" size={16} />
                </span>
              </div>

              {/* Role Filter */}
              <div className="md:col-span-3">
                <select
                  value={staffRoleFilter}
                  onChange={(e) => {
                    setStaffRoleFilter(e.target.value);
                    setStaffPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                >
                  <option value="all">All Roles & Designations</option>
                  {STAFF_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              <div className="md:col-span-2">
                <select
                  value={staffDeptFilter}
                  onChange={(e) => {
                    setStaffDeptFilter(e.target.value);
                    setStaffPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                >
                  <option value="all">All Departments</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="md:col-span-2">
                <select
                  value={staffStatusFilter}
                  onChange={(e) => {
                    setStaffStatusFilter(e.target.value);
                    setStaffPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                >
                  <option value="all">All Statuses</option>
                  {EMPLOYMENT_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st.replace('_', ' ').charAt(0).toUpperCase() + st.replace('_', ' ').slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch Filter */}
              <div className="md:col-span-1">
                <select
                  value={staffBranchFilter}
                  onChange={(e) => {
                    setStaffBranchFilter(e.target.value);
                    setStaffPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                >
                  <option value="all">All Hubs</option>
                  {branches.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Staff Table */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-border text-xs uppercase font-semibold text-secondary">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Designation & Dept</th>
                    <th className="py-3 px-4">Assigned Hub</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Joining Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedStaff.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-secondary">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AppIcon name="user" size={28} className="text-slate-300" />
                          <p className="font-medium text-navy">No staff members found</p>
                          <p className="text-xs text-secondary">Try adjusting your filters or search keywords.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedStaff.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-navy">{s.fullName}</div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">{s.id}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-navy">{s.designation}</div>
                          <div className="text-xs text-secondary">{s.department}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-slate-100 text-slate-800 border border-slate-200">
                            {s.assignedBranch}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-navy">{s.phone}</div>
                          <div className="text-xs text-secondary truncate max-w-[170px]">{s.email}</div>
                        </td>

                        <td className="py-3.5 px-4 text-xs text-slate-600 font-mono">
                          {s.joiningDate}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                              s.employmentStatus === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : s.employmentStatus === 'on_leave'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {s.employmentStatus.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setViewingStaff(s)}
                              className="p-1.5 text-secondary hover:text-navy hover:bg-slate-100 rounded-md transition-colors"
                              title="View Staff Profile"
                            >
                              <AppIcon name="external-link" size={15} />
                            </button>
                            <button
                              onClick={() => handleOpenEditStaff(s)}
                              className="p-1.5 text-secondary hover:text-navy hover:bg-slate-100 rounded-md transition-colors"
                              title="Edit Staff Member"
                            >
                              <AppIcon name="edit" size={15} />
                            </button>
                            <button
                              onClick={() => setDeletingStaffId(s.id)}
                              className="p-1.5 text-secondary hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                              title="Delete Record"
                            >
                              <AppIcon name="trash" size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredStaff.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-t border-border text-xs text-secondary">
                <div>
                  Showing{' '}
                  <span className="font-semibold text-navy">
                    {Math.min(filteredStaff.length, (staffPage - 1) * staffPageSize + 1)}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold text-navy">
                    {Math.min(filteredStaff.length, staffPage * staffPageSize)}
                  </span>{' '}
                  of <span className="font-semibold text-navy">{filteredStaff.length}</span> personnel
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={staffPage <= 1}
                    onClick={() => setStaffPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 border border-border rounded bg-white text-secondary hover:text-navy disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <AppIcon name="chevron-left" size={14} />
                  </button>
                  <span className="px-2 font-medium text-navy">
                    {staffPage} / {totalStaffPages}
                  </span>
                  <button
                    disabled={staffPage >= totalStaffPages}
                    onClick={() => setStaffPage((p) => Math.min(totalStaffPages, p + 1))}
                    className="p-1.5 border border-border rounded bg-white text-secondary hover:text-navy disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <AppIcon name="chevron-right" size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CUSTOMER */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-slate-50">
              <h2 className="text-lg font-bold text-navy">
                {editingCustomer ? `Edit Customer: ${editingCustomer.name}` : 'Register New Customer Account'}
              </h2>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="text-secondary hover:text-navy p-1"
              >
                <AppIcon name="x" size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Company / Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={custForm.name || ''}
                    onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                    placeholder="e.g. Sharma Textiles & Garments"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    value={custForm.contactPerson || ''}
                    onChange={(e) => setCustForm({ ...custForm, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                    placeholder="e.g. Ramesh Chandra"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Customer Type</label>
                  <select
                    value={custForm.type || 'Corporate'}
                    onChange={(e) => setCustForm({ ...custForm, type: e.target.value as CustomerType })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                  >
                    {CUSTOMER_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Account Status</label>
                  <select
                    value={custForm.accountStatus || 'active'}
                    onChange={(e) => setCustForm({ ...custForm, accountStatus: e.target.value as CustomerStatus })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                  >
                    {CUSTOMER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={custForm.email || ''}
                    onChange={(e) => setCustForm({ ...custForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                    placeholder="billing@company.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={custForm.phone || ''}
                    onChange={(e) => setCustForm({ ...custForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                    placeholder="+91 98200 12345"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">City</label>
                  <input
                    type="text"
                    value={custForm.city || ''}
                    onChange={(e) => setCustForm({ ...custForm, city: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                    placeholder="e.g. New Delhi"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">State</label>
                  <input
                    type="text"
                    value={custForm.state || ''}
                    onChange={(e) => setCustForm({ ...custForm, state: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                    placeholder="e.g. Delhi"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">GSTIN / Tax ID</label>
                  <input
                    type="text"
                    value={custForm.gstin || ''}
                    onChange={(e) => setCustForm({ ...custForm, gstin: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange font-mono"
                    placeholder="07AAAAA0000A1Z5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Outstanding Balance (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={custForm.outstandingBalance ?? 0}
                    onChange={(e) => setCustForm({ ...custForm, outstandingBalance: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">Billing Address</label>
                <textarea
                  rows={2}
                  value={custForm.billingAddress || ''}
                  onChange={(e) => setCustForm({ ...custForm, billingAddress: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                  placeholder="Plot No. 45, Industrial Area, Phase II, New Delhi 110020"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 border border-border text-secondary hover:text-navy hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange hover:bg-orange-hover text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  {editingCustomer ? 'Update Customer' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW CUSTOMER PROFILE & HISTORY */}
      {viewingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-navy">{viewingCustomer.name}</h2>
                <div className="text-xs text-secondary">{viewingCustomer.contactPerson} • {viewingCustomer.id}</div>
              </div>
              <button onClick={() => setViewingCustomer(null)} className="text-secondary hover:text-navy p-1">
                <AppIcon name="x" size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Profile Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-border text-xs">
                <div>
                  <span className="text-secondary block">Account Type</span>
                  <span className="font-semibold text-navy">{viewingCustomer.type}</span>
                </div>
                <div>
                  <span className="text-secondary block">Status</span>
                  <span className="font-semibold text-emerald-700 capitalize">{viewingCustomer.accountStatus}</span>
                </div>
                <div>
                  <span className="text-secondary block">City & State</span>
                  <span className="font-semibold text-navy">{viewingCustomer.city}, {viewingCustomer.state}</span>
                </div>
                <div>
                  <span className="text-secondary block">Outstanding Balance</span>
                  <span
                    className={`font-semibold ${
                      viewingCustomer.outstandingBalance > 0 ? 'text-amber-700' : 'text-slate-600'
                    }`}
                  >
                    ₹{viewingCustomer.outstandingBalance.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-secondary block">Contact Phone & Email</span>
                  <span className="font-medium text-navy">{viewingCustomer.phone} • {viewingCustomer.email}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-secondary block">GSTIN / Tax ID</span>
                  <span className="font-mono font-medium text-navy">{viewingCustomer.gstin || 'Not registered'}</span>
                </div>
                <div className="col-span-4">
                  <span className="text-secondary block">Billing Address</span>
                  <span className="font-medium text-navy">{viewingCustomer.billingAddress || 'No billing address specified'}</span>
                </div>
              </div>

              {/* Linked Shipments History */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                    <AppIcon name="truck" size={16} />
                    <span>Consignment Activity ({linkedCustomerShipments.length})</span>
                  </h3>
                  <span className="text-xs text-secondary">Cross-referenced with active consignments</span>
                </div>

                {linkedCustomerShipments.length === 0 ? (
                  <p className="text-xs text-secondary bg-slate-50 p-3 rounded-lg border border-border">
                    No active consignments found matching this customer profile.
                  </p>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-border text-[11px] uppercase font-semibold text-secondary">
                        <tr>
                          <th className="p-2.5">Tracking No</th>
                          <th className="p-2.5">Route</th>
                          <th className="p-2.5">Mode</th>
                          <th className="p-2.5">Status</th>
                          <th className="p-2.5 text-right">Carrier</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {linkedCustomerShipments.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-mono font-semibold text-navy">{s.id}</td>
                            <td className="p-2.5 text-slate-700">{s.originHub} → {s.destinationHub}</td>
                            <td className="p-2.5 capitalize">{s.serviceMode.replace('_', ' ')}</td>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-navy capitalize">
                                {s.status}
                              </span>
                            </td>
                            <td className="p-2.5 text-right font-medium text-navy">
                              {s.carrier}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Linked Invoices & Ledger */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                    <AppIcon name="file-text" size={16} />
                    <span>Billing Invoices ({linkedCustomerInvoices.length})</span>
                  </h3>
                  <span className="text-xs text-secondary">Associated invoices & payment states</span>
                </div>

                {linkedCustomerInvoices.length === 0 ? (
                  <p className="text-xs text-secondary bg-slate-50 p-3 rounded-lg border border-border">
                    No billing invoices generated yet for this customer.
                  </p>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-border text-[11px] uppercase font-semibold text-secondary">
                        <tr>
                          <th className="p-2.5">Invoice #</th>
                          <th className="p-2.5">Date</th>
                          <th className="p-2.5 text-right">Total</th>
                          <th className="p-2.5 text-right">Outstanding</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {linkedCustomerInvoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-mono font-semibold text-navy">{inv.invoiceNumber}</td>
                            <td className="p-2.5 text-slate-600">{inv.issueDate}</td>
                            <td className="p-2.5 text-right font-semibold text-navy">₹{inv.totalAmount.toLocaleString('en-IN')}</td>
                            <td className="p-2.5 text-right font-semibold text-amber-700">₹{inv.outstandingAmount.toLocaleString('en-IN')}</td>
                            <td className="p-2.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  inv.paymentStatus === 'Paid'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : inv.paymentStatus === 'Partially Paid'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {inv.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end px-6 py-4 border-t border-border bg-slate-50">
              <button
                onClick={() => setViewingCustomer(null)}
                className="px-4 py-2 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-navy-light transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION (CUSTOMER) */}
      {deletingCustomerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-50 border border-rose-200">
                <AppIcon name="alert" size={20} />
              </div>
              <h3 className="text-base font-bold text-navy">Delete Customer Account?</h3>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Are you sure you want to delete customer ID <strong className="text-navy">{deletingCustomerId}</strong>?
              This will remove the customer profile from localStorage. Associated historical invoices and shipments will remain intact.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                onClick={() => setDeletingCustomerId(null)}
                className="px-4 py-2 border border-border text-secondary hover:text-navy hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteCustomer}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Yes, Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT STAFF */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-slate-50">
              <h2 className="text-lg font-bold text-navy">
                {editingStaff ? `Edit Personnel: ${editingStaff.fullName}` : 'Onboard New Staff Member'}
              </h2>
              <button onClick={() => setShowAddStaffModal(false)} className="text-secondary hover:text-navy p-1">
                <AppIcon name="x" size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={stfForm.fullName || ''}
                    onChange={(e) => setStfForm({ ...stfForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                    placeholder="e.g. Anand Ranganathan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Role / Designation *</label>
                  <select
                    value={stfForm.designation || 'Operations Manager'}
                    onChange={(e) => setStfForm({ ...stfForm, designation: e.target.value as StaffRole })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                  >
                    {STAFF_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Department</label>
                  <select
                    value={stfForm.department || 'Dispatch & Logistics'}
                    onChange={(e) => setStfForm({ ...stfForm, department: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Assigned Operational Hub</label>
                  <select
                    value={stfForm.assignedBranch || 'DEL-CENTRAL'}
                    onChange={(e) => setStfForm({ ...stfForm, assignedBranch: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                  >
                    {branches.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={stfForm.email || ''}
                    onChange={(e) => setStfForm({ ...stfForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                    placeholder="name@veltrax.in"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={stfForm.phone || ''}
                    onChange={(e) => setStfForm({ ...stfForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                    placeholder="+91 98111 22334"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Employment Status</label>
                  <select
                    value={stfForm.employmentStatus || 'active'}
                    onChange={(e) => setStfForm({ ...stfForm, employmentStatus: e.target.value as EmploymentStatus })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                  >
                    {EMPLOYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace('_', ' ').charAt(0).toUpperCase() + s.replace('_', ' ').slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={stfForm.joiningDate || ''}
                    onChange={(e) => setStfForm({ ...stfForm, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-secondary mb-1">Emergency Contact Info</label>
                  <input
                    type="text"
                    value={stfForm.emergencyContact || ''}
                    onChange={(e) => setStfForm({ ...stfForm, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-border rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                    placeholder="e.g. Smt. Radha Ranganathan (Spouse) - +91 98111 99887"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 border border-border text-secondary hover:text-navy hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange hover:bg-orange-hover text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  {editingStaff ? 'Update Personnel' : 'Save Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW STAFF PROFILE */}
      {viewingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-navy">{viewingStaff.fullName}</h3>
                <span className="text-xs text-secondary font-mono">{viewingStaff.id}</span>
              </div>
              <button onClick={() => setViewingStaff(null)} className="text-secondary hover:text-navy p-1">
                <AppIcon name="x" size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-lg border border-border">
                <div>
                  <span className="text-secondary block">Designation</span>
                  <span className="font-semibold text-navy">{viewingStaff.designation}</span>
                </div>
                <div>
                  <span className="text-secondary block">Department</span>
                  <span className="font-semibold text-navy">{viewingStaff.department}</span>
                </div>
                <div>
                  <span className="text-secondary block">Assigned Hub</span>
                  <span className="font-mono font-semibold text-navy">{viewingStaff.assignedBranch}</span>
                </div>
                <div>
                  <span className="text-secondary block">Status</span>
                  <span className="font-semibold text-emerald-700 capitalize">
                    {viewingStaff.employmentStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-secondary block">Contact Phone & Email</span>
                <span className="font-medium text-navy">{viewingStaff.phone} • {viewingStaff.email}</span>
              </div>

              <div>
                <span className="text-secondary block">Date of Joining</span>
                <span className="font-medium text-navy">{viewingStaff.joiningDate}</span>
              </div>

              <div>
                <span className="text-secondary block">Emergency Contact</span>
                <span className="font-medium text-navy">{viewingStaff.emergencyContact || 'Not provided'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-border">
              <button
                onClick={() => setViewingStaff(null)}
                className="px-4 py-2 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-navy-light transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION (STAFF) */}
      {deletingStaffId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-50 border border-rose-200">
                <AppIcon name="alert" size={20} />
              </div>
              <h3 className="text-base font-bold text-navy">Remove Staff Member?</h3>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Are you sure you want to remove staff member ID <strong className="text-navy">{deletingStaffId}</strong>?
              This will remove the employee record from the roster.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                onClick={() => setDeletingStaffId(null)}
                className="px-4 py-2 border border-border text-secondary hover:text-navy hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteStaff}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Yes, Remove Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersStaffPage;
