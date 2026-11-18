import React, { useState, useEffect, useMemo } from 'react';
import {
  getInvoices,
  saveInvoice,
  deleteInvoice,
  getPayments,
  recordPayment,
  getCustomers,
  getAppSettings,
} from '../data/mockCommercial';
import { getStoredShipments } from '../data/mockShipments';
import type {
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  PaymentRecord,
  PaymentMethod,
  Customer,
} from '../types/commercial';
import type { Shipment } from '../types';
import { AppIcon } from '../components/common/AppIcon';
import { useEnterprise } from '../context/EnterpriseContext';

const INVOICE_STATUSES: InvoiceStatus[] = [
  'Draft',
  'Pending',
  'Partially Paid',
  'Paid',
  'Overdue',
  'Cancelled',
];

const PAYMENT_METHODS: PaymentMethod[] = [
  'Bank Transfer',
  'UPI',
  'Card',
  'Cash',
  'Other',
];

const generateInvoiceId = (): string => {
  return `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
};

const generateTxnRef = (): string => {
  return `NEFT/${Math.floor(1000000 + Math.random() * 9000000)}`;
};

export const PaymentsBillingPage: React.FC = () => {
  const { branchLabel } = useEnterprise();
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');

  // Datasets from reactive storage
  const [invoices, setInvoices] = useState<Invoice[]>(() => getInvoices());
  const [payments, setPayments] = useState<PaymentRecord[]>(() => getPayments());
  const [customers, setCustomers] = useState<Customer[]>(() => getCustomers());
  const [shipments] = useState<Shipment[]>(() => getStoredShipments());
  const [appSettings] = useState(() => getAppSettings());

  // Listen for storage events
  useEffect(() => {
    const handleUpdate = () => {
      setInvoices(getInvoices());
      setPayments(getPayments());
      setCustomers(getCustomers());
    };
    window.addEventListener('freightline_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('freightline_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Invoice Filters & Sort
  const [invSearch, setInvSearch] = useState<string>('');
  const [invStatusFilter, setInvStatusFilter] = useState<string>('all');
  const [invSortBy, setInvSortBy] = useState<'issueDate' | 'totalAmount' | 'outstandingAmount' | 'invoiceNumber'>('issueDate');
  const [invSortAsc, setInvSortAsc] = useState<boolean>(false);
  const [invPage, setInvPage] = useState<number>(1);
  const invPageSize = 6;

  // Payments Filters
  const [paySearch, setPaySearch] = useState<string>('');
  const [payMethodFilter, setPayMethodFilter] = useState<string>('all');
  const [payPage, setPayPage] = useState<number>(1);
  const payPageSize = 6;

  // Modal Dialog States
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<string | null>(null);

  // Form State for Invoice Creation
  const [formCustomerId, setFormCustomerId] = useState<string>('');
  const [formShipmentId, setFormShipmentId] = useState<string>('');
  const [formIssueDate, setFormIssueDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [formDueDate, setFormDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [formPaymentTerms, setFormPaymentTerms] = useState<string>('Net 15 Days');
  const [formNotes, setFormNotes] = useState<string>('');
  const [formItems, setFormItems] = useState<InvoiceItem[]>(() => [
    {
      id: 'item-1',
      description: 'Full Truckload Freight Transit Service',
      quantity: 1,
      unitPrice: 35000,
      amount: 35000,
    },
  ]);

  // Form State for Payment Recording
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Bank Transfer');
  const [payRef, setPayRef] = useState<string>('');
  const [payNotes, setPayNotes] = useState<string>('');

  // Financial KPIs
  const kpis = useMemo(() => {
    const totalBilled = invoices.reduce((sum, inv) => sum + (inv.paymentStatus !== 'Cancelled' ? inv.totalAmount : 0), 0);
    const totalReceived = invoices.reduce((sum, inv) => sum + (inv.paymentStatus !== 'Cancelled' ? inv.paidAmount : 0), 0);
    const totalOutstanding = invoices.reduce((sum, inv) => sum + (inv.paymentStatus !== 'Cancelled' ? inv.outstandingAmount : 0), 0);
    const overdueInvoices = invoices.filter((inv) => inv.paymentStatus === 'Overdue');
    const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.outstandingAmount, 0);

    return {
      totalBilled,
      totalReceived,
      totalOutstanding,
      overdueCount: overdueInvoices.length,
      overdueAmount,
      totalCount: invoices.length,
    };
  }, [invoices]);

  // Filtered & Sorted Invoices
  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((inv) => {
        if (invStatusFilter !== 'all' && inv.paymentStatus !== invStatusFilter) return false;
        if (invSearch.trim()) {
          const q = invSearch.toLowerCase().trim();
          const matches =
            inv.invoiceNumber.toLowerCase().includes(q) ||
            inv.customerName.toLowerCase().includes(q) ||
            (inv.shipmentId && inv.shipmentId.toLowerCase().includes(q)) ||
            (inv.customerGstin && inv.customerGstin.toLowerCase().includes(q));
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (invSortBy === 'issueDate') {
          diff = new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
        } else if (invSortBy === 'totalAmount') {
          diff = a.totalAmount - b.totalAmount;
        } else if (invSortBy === 'outstandingAmount') {
          diff = a.outstandingAmount - b.outstandingAmount;
        } else if (invSortBy === 'invoiceNumber') {
          diff = a.invoiceNumber.localeCompare(b.invoiceNumber);
        }
        return invSortAsc ? diff : -diff;
      });
  }, [invoices, invStatusFilter, invSearch, invSortBy, invSortAsc]);

  const paginatedInvoices = useMemo(() => {
    const start = (invPage - 1) * invPageSize;
    return filteredInvoices.slice(start, start + invPageSize);
  }, [filteredInvoices, invPage]);

  const totalInvPages = Math.ceil(filteredInvoices.length / invPageSize) || 1;

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (payMethodFilter !== 'all' && p.paymentMethod !== payMethodFilter) return false;
      if (paySearch.trim()) {
        const q = paySearch.toLowerCase().trim();
        const matches =
          p.id.toLowerCase().includes(q) ||
          p.invoiceId.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q) ||
          p.transactionReference.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [payments, payMethodFilter, paySearch]);

  const paginatedPayments = useMemo(() => {
    const start = (payPage - 1) * payPageSize;
    return filteredPayments.slice(start, start + payPageSize);
  }, [filteredPayments, payPage]);

  const totalPayPages = Math.ceil(filteredPayments.length / payPageSize) || 1;

  // Create Invoice Line Item Handlers
  const handleAddItem = () => {
    setFormItems([
      ...formItems,
      {
        id: `item-${Date.now()}`,
        description: 'Transportation / Handling Fee',
        quantity: 1,
        unitPrice: 5000,
        amount: 5000,
      },
    ]);
  };

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = [...formItems];
    const item = { ...updated[index] };
    if (field === 'quantity') {
      item.quantity = Number(value) || 0;
      item.amount = item.quantity * item.unitPrice;
    } else if (field === 'unitPrice') {
      item.unitPrice = Number(value) || 0;
      item.amount = item.quantity * item.unitPrice;
    } else if (field === 'description') {
      item.description = String(value);
    }
    updated[index] = item;
    setFormItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (formItems.length <= 1) return;
    setFormItems(formItems.filter((_, i) => i !== index));
  };

  const formSubtotal = formItems.reduce((sum, item) => sum + item.amount, 0);
  const formTax = Math.round(formSubtotal * 0.18); // 18% GST
  const formTotal = formSubtotal + formTax;

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === formCustomerId);
    if (!cust) {
      alert('Please select a customer for this invoice.');
      return;
    }

    const newInvId = generateInvoiceId();
    const newInvoice: Invoice = {
      id: newInvId,
      invoiceNumber: newInvId,
      customerId: cust.id,
      customerName: cust.name,
      customerEmail: cust.email,
      customerAddress: cust.billingAddress || `${cust.city}, ${cust.state}`,
      customerGstin: cust.gstin,
      shipmentId: formShipmentId || undefined,
      issueDate: formIssueDate,
      dueDate: formDueDate,
      items: formItems,
      subtotal: formSubtotal,
      tax: formTax,
      totalAmount: formTotal,
      paidAmount: 0,
      outstandingAmount: formTotal,
      paymentStatus: 'Pending',
      paymentTerms: formPaymentTerms,
      notes: formNotes,
    };

    saveInvoice(newInvoice);
    setShowCreateModal(false);

    // Reset Form
    setFormCustomerId('');
    setFormShipmentId('');
    setFormItems([
      {
        id: 'item-1',
        description: 'Full Truckload Freight Transit Service',
        quantity: 1,
        unitPrice: 35000,
        amount: 35000,
      },
    ]);
  };

  // Open Payment Modal
  const handleOpenRecordPayment = (inv: Invoice) => {
    setPayingInvoice(inv);
    setPayAmount(inv.outstandingAmount);
    setPayMethod('Bank Transfer');
    setPayRef(generateTxnRef());
    setPayNotes(`Payment against invoice ${inv.invoiceNumber}`);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;
    if (payAmount <= 0) {
      alert('Payment amount must be greater than zero.');
      return;
    }
    if (payAmount > payingInvoice.outstandingAmount) {
      alert('Payment amount cannot exceed the invoice outstanding amount.');
      return;
    }

    recordPayment({
      invoiceId: payingInvoice.id,
      customerId: payingInvoice.customerId,
      customerName: payingInvoice.customerName,
      paymentDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      paymentMethod: payMethod,
      amount: payAmount,
      transactionReference: payRef || `SIM-TXN-${Date.now()}`,
      paymentStatus: 'completed',
      notes: payNotes,
    });

    setPayingInvoice(null);
  };

  const handleConfirmDeleteInvoice = () => {
    if (deletingInvoiceId) {
      deleteInvoice(deletingInvoiceId);
      setDeletingInvoiceId(null);
      if (viewingInvoice && viewingInvoice.id === deletingInvoiceId) {
        setViewingInvoice(null);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-navy">Billing & Commercial Settlement</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {branchLabel}
            </span>
          </div>
          <p className="text-sm text-secondary mt-1">
            Manage commercial freight invoicing, tax schedules (GST), payment allocations, and customer receipts.
          </p>
        </div>

        {/* Global Action CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (customers.length > 0) {
                setFormCustomerId(customers[0].id);
              }
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange hover:bg-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            <AppIcon name="plus" size={16} />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Financial Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Billed Revenue</span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <AppIcon name="credit-card" size={18} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-navy">
            ₹{kpis.totalBilled.toLocaleString('en-IN')}
          </div>
          <div className="mt-1 text-xs text-secondary">{kpis.totalCount} commercial invoices issued</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Settled / Collected</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <AppIcon name="check-circle" size={18} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">
            ₹{kpis.totalReceived.toLocaleString('en-IN')}
          </div>
          <div className="mt-1 text-xs text-secondary">
            {kpis.totalBilled > 0 ? ((kpis.totalReceived / kpis.totalBilled) * 100).toFixed(1) : 0}% recovery rate
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Outstanding Receivables</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <AppIcon name="dollar-sign" size={18} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700">
            ₹{kpis.totalOutstanding.toLocaleString('en-IN')}
          </div>
          <div className="mt-1 text-xs text-secondary">Pending collection balance</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-semibold uppercase tracking-wider">Overdue Invoices</span>
            <span className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <AppIcon name="alert" size={18} />
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600">{kpis.overdueCount}</div>
          <div className="mt-1 text-xs text-rose-600 font-medium">
            ₹{kpis.overdueAmount.toLocaleString('en-IN')} overdue
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'invoices'
              ? 'border-orange text-orange'
              : 'border-transparent text-secondary hover:text-navy'
          }`}
        >
          <AppIcon name="file-text" size={16} />
          <span>Invoices Directory</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
            {invoices.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'payments'
              ? 'border-orange text-orange'
              : 'border-transparent text-secondary hover:text-navy'
          }`}
        >
          <AppIcon name="credit-card" size={16} />
          <span>Payment Transactions Ledger</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
            {payments.length}
          </span>
        </button>
      </div>

      {/* TAB 1: INVOICES MANAGEMENT */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          {/* Filter, Search & Controls */}
          <div className="bg-card dark:bg-[#1E293B] border border-border dark:border-slate-700/80 rounded-xl p-4 shadow-sm space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search Bar */}
              <div className="md:col-span-5 relative">
                <input
                  type="text"
                  placeholder="Search by invoice number, customer name, shipment ID, or GSTIN..."
                  value={invSearch}
                  onChange={(e) => {
                    setInvSearch(e.target.value);
                    setInvPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-navy dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                />
                <span className="absolute left-3 top-2.5 text-slate-400 pointer-events-none">
                  <AppIcon name="search" size={16} />
                </span>
              </div>

              {/* Status Filter */}
              <div className="md:col-span-3">
                <select
                  value={invStatusFilter}
                  onChange={(e) => {
                    setInvStatusFilter(e.target.value);
                    setInvPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-navy dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange cursor-pointer"
                >
                  <option value="all" className="dark:bg-slate-800 dark:text-slate-100">All Payment Statuses</option>
                  {INVOICE_STATUSES.map((s) => (
                    <option key={s} value={s} className="dark:bg-slate-800 dark:text-slate-100">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="md:col-span-4 flex items-center gap-2">
                <select
                  value={invSortBy}
                  onChange={(e) =>
                    setInvSortBy(
                      e.target.value as 'issueDate' | 'totalAmount' | 'outstandingAmount' | 'invoiceNumber'
                    )
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-navy dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange cursor-pointer"
                >
                  <option value="issueDate" className="dark:bg-slate-800 dark:text-slate-100">Sort: Issue Date</option>
                  <option value="totalAmount" className="dark:bg-slate-800 dark:text-slate-100">Sort: Total Amount</option>
                  <option value="outstandingAmount" className="dark:bg-slate-800 dark:text-slate-100">Sort: Outstanding Balance</option>
                  <option value="invoiceNumber" className="dark:bg-slate-800 dark:text-slate-100">Sort: Invoice Number</option>
                </select>
                <button
                  type="button"
                  title="Toggle Sort Order"
                  onClick={() => setInvSortAsc(!invSortAsc)}
                  className="p-2 bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-secondary hover:text-navy dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <AppIcon name={invSortAsc ? 'arrow-up' : 'arrow-down'} size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-card dark:bg-[#1E293B] border border-border dark:border-slate-700/80 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-border dark:border-slate-700 text-xs uppercase font-semibold text-secondary dark:text-slate-400">
                    <th className="py-3 px-4">Invoice # & Date</th>
                    <th className="py-3 px-4">Customer Entity</th>
                    <th className="py-3 px-4">Linked Consignment</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4 text-right">Total Amount</th>
                    <th className="py-3 px-4 text-right">Outstanding</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-secondary">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AppIcon name="file-text" size={28} className="text-slate-300" />
                          <p className="font-medium text-navy">No invoices found</p>
                          <p className="text-xs text-secondary">Try adjusting your filters or search keywords.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold font-mono text-navy dark:text-slate-100">{inv.invoiceNumber}</div>
                          <div className="text-xs text-secondary dark:text-slate-400">{inv.issueDate}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-navy dark:text-slate-100">{inv.customerName}</div>
                          <div className="text-xs text-secondary dark:text-slate-400 font-mono">{inv.customerGstin || 'No GSTIN'}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          {inv.shipmentId ? (
                            <span className="inline-flex items-center gap-1 font-mono text-xs text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/60">
                              <AppIcon name="truck" size={12} />
                              {inv.shipmentId}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-500">Direct Invoice</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-xs font-mono text-slate-600 dark:text-slate-400">
                          {inv.dueDate}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="font-semibold text-navy dark:text-slate-100">
                            ₹{inv.totalAmount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-secondary dark:text-slate-400">
                            Tax: ₹{inv.tax.toLocaleString('en-IN')}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div
                            className={`font-semibold ${
                              inv.outstandingAmount > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            ₹{inv.outstandingAmount.toLocaleString('en-IN')}
                          </div>
                          {inv.paidAmount > 0 && (
                            <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                              Paid: ₹{inv.paidAmount.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                              inv.paymentStatus === 'Paid'
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                                : inv.paymentStatus === 'Partially Paid'
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60'
                                : inv.paymentStatus === 'Overdue'
                                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
                                : inv.paymentStatus === 'Draft'
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60'
                            }`}
                          >
                            {inv.paymentStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View / Print Invoice */}
                            <button
                              onClick={() => setViewingInvoice(inv)}
                              className="p-1.5 text-secondary hover:text-navy dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                              title="View & Print Official Invoice"
                            >
                              <AppIcon name="printer" size={15} />
                            </button>

                            {/* Record Payment (if outstanding > 0) */}
                            {inv.outstandingAmount > 0 && inv.paymentStatus !== 'Cancelled' && (
                              <button
                                onClick={() => handleOpenRecordPayment(inv)}
                                className="p-1.5 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-md transition-colors"
                                title="Record Simulated Settlement"
                              >
                                <AppIcon name="credit-card" size={15} />
                              </button>
                            )}

                            {/* Delete Invoice */}
                            <button
                              onClick={() => setDeletingInvoiceId(inv.id)}
                              className="p-1.5 text-secondary hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors"
                              title="Delete Invoice"
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
            {filteredInvoices.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-border dark:border-slate-700 text-xs text-secondary dark:text-slate-400">
                <div>
                  Showing{' '}
                  <span className="font-semibold text-navy dark:text-white">
                    {Math.min(filteredInvoices.length, (invPage - 1) * invPageSize + 1)}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold text-navy dark:text-white">
                    {Math.min(filteredInvoices.length, invPage * invPageSize)}
                  </span>{' '}
                  of <span className="font-semibold text-navy dark:text-white">{filteredInvoices.length}</span> invoices
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={invPage <= 1}
                    onClick={() => setInvPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 border border-border dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-secondary dark:text-slate-300 hover:text-navy dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <AppIcon name="chevron-left" size={14} />
                  </button>
                  <span className="px-2 font-medium text-navy dark:text-white">
                    {invPage} / {totalInvPages}
                  </span>
                  <button
                    disabled={invPage >= totalInvPages}
                    onClick={() => setInvPage((p) => Math.min(totalInvPages, p + 1))}
                    className="p-1.5 border border-border dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-secondary dark:text-slate-300 hover:text-navy dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <AppIcon name="chevron-right" size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENT TRANSACTIONS LEDGER */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Payment Controls */}
          <div className="bg-card dark:bg-[#1E293B] border border-border dark:border-slate-700/80 rounded-xl p-4 shadow-sm space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search */}
              <div className="md:col-span-8 relative">
                <input
                  type="text"
                  placeholder="Search ledger by transaction reference, receipt number, invoice ID, or client..."
                  value={paySearch}
                  onChange={(e) => {
                    setPaySearch(e.target.value);
                    setPayPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-navy dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                />
                <span className="absolute left-3 top-2.5 text-slate-400 pointer-events-none">
                  <AppIcon name="search" size={16} />
                </span>
              </div>

              {/* Method Filter */}
              <div className="md:col-span-4">
                <select
                  value={payMethodFilter}
                  onChange={(e) => {
                    setPayMethodFilter(e.target.value);
                    setPayPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-navy dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange cursor-pointer"
                >
                  <option value="all" className="dark:bg-slate-800 dark:text-slate-100">All Payment Channels</option>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m} className="dark:bg-slate-800 dark:text-slate-100">
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-card dark:bg-[#1E293B] border border-border dark:border-slate-700/80 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-border dark:border-slate-700 text-xs uppercase font-semibold text-secondary dark:text-slate-400">
                    <th className="py-3 px-4">Receipt # & Date</th>
                    <th className="py-3 px-4">Invoice Reference</th>
                    <th className="py-3 px-4">Customer Entity</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Transaction UTR / Ref</th>
                    <th className="py-3 px-4 text-right">Amount Received</th>
                    <th className="py-3 px-4 text-center">Audit Nature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-slate-700/80">
                  {paginatedPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-secondary dark:text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AppIcon name="credit-card" size={28} className="text-slate-300 dark:text-slate-600" />
                          <p className="font-medium text-navy dark:text-slate-200">No transactions recorded</p>
                          <p className="text-xs text-secondary dark:text-slate-400">Record a payment from the Invoices Directory.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold font-mono text-navy dark:text-slate-100">{p.id}</div>
                          <div className="text-xs text-secondary dark:text-slate-400">{p.paymentDate}</div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-xs font-semibold text-blue-700 dark:text-blue-400">
                          {p.invoiceId}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-navy dark:text-slate-100">{p.customerName}</div>
                          <div className="text-xs text-slate-400 dark:text-slate-500">{p.customerId}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                            {p.paymentMethod}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                          {p.transactionReference}
                        </td>

                        <td className="py-3.5 px-4 text-right font-bold text-emerald-700 dark:text-emerald-400">
                          ₹{p.amount.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                            Simulated Record
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredPayments.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-border dark:border-slate-700 text-xs text-secondary dark:text-slate-400">
                <div>
                  Showing{' '}
                  <span className="font-semibold text-navy dark:text-white">
                    {Math.min(filteredPayments.length, (payPage - 1) * payPageSize + 1)}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold text-navy dark:text-white">
                    {Math.min(filteredPayments.length, payPage * payPageSize)}
                  </span>{' '}
                  of <span className="font-semibold text-navy dark:text-white">{filteredPayments.length}</span> records
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={payPage <= 1}
                    onClick={() => setPayPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 border border-border dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-secondary dark:text-slate-300 hover:text-navy dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <AppIcon name="chevron-left" size={14} />
                  </button>
                  <span className="px-2 font-medium text-navy dark:text-white">
                    {payPage} / {totalPayPages}
                  </span>
                  <button
                    disabled={payPage >= totalPayPages}
                    onClick={() => setPayPage((p) => Math.min(totalPayPages, p + 1))}
                    className="p-1.5 border border-border dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-secondary dark:text-slate-300 hover:text-navy dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <AppIcon name="chevron-right" size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CREATE INVOICE */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90">
              <h2 className="text-lg font-bold text-navy dark:text-white">Issue Commercial Freight Invoice</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-secondary hover:text-navy dark:text-slate-400 dark:hover:text-white p-1">
                <AppIcon name="x" size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Header Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary dark:text-slate-300 mb-1">
                    Select Customer Account *
                  </label>
                  <select
                    required
                    value={formCustomerId}
                    onChange={(e) => setFormCustomerId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-navy dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange cursor-pointer"
                  >
                    <option value="" className="dark:bg-slate-800 dark:text-slate-100">-- Choose Customer --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id} className="dark:bg-slate-800 dark:text-slate-100">
                        {c.name} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary dark:text-slate-300 mb-1">
                    Link Consignment / Shipment (Optional)
                  </label>
                  <select
                    value={formShipmentId}
                    onChange={(e) => setFormShipmentId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-navy dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange font-mono cursor-pointer"
                  >
                    <option value="" className="dark:bg-slate-800 dark:text-slate-100">-- No Direct Consignment Link --</option>
                    {shipments.map((s) => (
                      <option key={s.id} value={s.id} className="dark:bg-slate-800 dark:text-slate-100">
                        {s.id} ({s.originHub} → {s.destinationHub})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary dark:text-slate-300 mb-1">Invoice Issue Date</label>
                  <input
                    type="date"
                    required
                    value={formIssueDate}
                    onChange={(e) => setFormIssueDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-navy dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary dark:text-slate-300 mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-navy dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                  />
                </div>
              </div>

              {/* Line Items Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-navy dark:text-white">Itemized Freight & Logistics Services</h3>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-navy dark:text-slate-100 text-xs font-semibold rounded-md transition-colors"
                  >
                    <AppIcon name="plus" size={14} />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2 border border-border dark:border-slate-700 rounded-lg p-3 bg-slate-50/50 dark:bg-slate-800/40">
                  {formItems.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-6">
                        <input
                          type="text"
                          required
                          placeholder="Description of freight service"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-border dark:border-slate-700 rounded text-navy dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-orange"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-border dark:border-slate-700 rounded text-navy dark:text-slate-100 focus:outline-none focus:border-orange text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="0"
                          step="100"
                          required
                          placeholder="Rate"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(index, 'unitPrice', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-border dark:border-slate-700 rounded text-navy dark:text-slate-100 focus:outline-none focus:border-orange text-right"
                        />
                      </div>
                      <div className="col-span-1 text-right font-semibold text-xs text-navy dark:text-slate-100">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          disabled={formItems.length <= 1}
                          className="p-1 text-secondary hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <AppIcon name="trash" size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal & GST Calculation */}
                <div className="mt-3 flex justify-end">
                  <div className="w-64 space-y-1.5 text-xs">
                    <div className="flex justify-between text-secondary dark:text-slate-400">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-navy dark:text-slate-100">₹{formSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-secondary dark:text-slate-400">
                      <span>GST (18%):</span>
                      <span className="font-semibold text-navy dark:text-slate-100">₹{formTax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between border-t border-border dark:border-slate-700 pt-1.5 text-sm font-bold text-navy dark:text-white">
                      <span>Invoice Total:</span>
                      <span className="text-orange">₹{formTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary dark:text-slate-300 mb-1">Payment Terms</label>
                  <select
                    value={formPaymentTerms}
                    onChange={(e) => setFormPaymentTerms(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-navy dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange cursor-pointer"
                  >
                    <option value="Immediate on Receipt" className="dark:bg-slate-800 dark:text-slate-100">Immediate on Receipt</option>
                    <option value="Net 15 Days" className="dark:bg-slate-800 dark:text-slate-100">Net 15 Days</option>
                    <option value="Net 30 Days" className="dark:bg-slate-800 dark:text-slate-100">Net 30 Days</option>
                    <option value="Net 45 Days" className="dark:bg-slate-800 dark:text-slate-100">Net 45 Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary dark:text-slate-300 mb-1">Invoice Notes / Remarks</label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="e.g. Standard GST invoice for interstate freight haul"
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-navy dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-border dark:border-slate-700 text-secondary dark:text-slate-300 hover:text-navy dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange hover:bg-orange-hover text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW & PRINT INVOICE */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden print:border-none print:shadow-none print:m-0 print:max-w-full">
            {/* Header actions (hidden when printing) */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 print:hidden">
              <div className="flex items-center gap-2">
                <AppIcon name="file-text" size={18} className="text-orange" />
                <h3 className="font-bold text-navy dark:text-white">Official Tax Invoice – {viewingInvoice.invoiceNumber}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy dark:bg-slate-700 text-white text-xs font-semibold rounded-lg hover:bg-navy-light dark:hover:bg-slate-600 transition-colors"
                >
                  <AppIcon name="printer" size={14} />
                  <span>Print / Save PDF</span>
                </button>
                <button onClick={() => setViewingInvoice(null)} className="text-secondary hover:text-navy dark:text-slate-400 dark:hover:text-white p-1">
                  <AppIcon name="x" size={18} />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="p-8 space-y-6 bg-white dark:bg-slate-900 text-navy dark:text-slate-100 print:bg-white print:text-black" id="printable-invoice">
              {/* Branding & Invoice Metas */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border dark:border-slate-700 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange flex items-center justify-center text-white font-black text-base shadow-sm">
                      V
                    </div>
                    <span className="font-black text-xl tracking-tight text-navy dark:text-white">
                      {appSettings.general.companyName}
                    </span>
                  </div>
                  <div className="text-xs text-secondary dark:text-slate-400 mt-2 space-y-0.5">
                    <div>{appSettings.general.companyAddress}</div>
                    <div>Email: {appSettings.general.contactEmail} • Tel: {appSettings.general.contactPhone}</div>
                    <div className="font-mono">GSTIN: 07AAACF8829F1Z4</div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono font-bold text-navy dark:text-slate-200 uppercase tracking-wider">
                    TAX INVOICE
                  </div>
                  <div className="text-sm font-bold font-mono text-navy dark:text-white mt-1">
                    #{viewingInvoice.invoiceNumber}
                  </div>
                  <div className="text-xs text-secondary dark:text-slate-400">Issue Date: {viewingInvoice.issueDate}</div>
                  <div className="text-xs text-secondary dark:text-slate-400">Due Date: {viewingInvoice.dueDate}</div>
                  <div className="pt-1">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                        viewingInvoice.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                          : viewingInvoice.paymentStatus === 'Partially Paid'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
                      }`}
                    >
                      Status: {viewingInvoice.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bill To & Dispatch Details */}
              <div className="grid grid-cols-2 gap-6 text-xs">
                <div>
                  <span className="uppercase tracking-wider font-semibold text-secondary dark:text-slate-400 block mb-1">
                    Billed To (Client Entity):
                  </span>
                  <div className="font-bold text-sm text-navy dark:text-white">{viewingInvoice.customerName}</div>
                  <div className="text-secondary dark:text-slate-400 mt-1">{viewingInvoice.customerAddress}</div>
                  <div className="text-secondary dark:text-slate-400 font-mono mt-1">
                    GSTIN: {viewingInvoice.customerGstin || 'Unregistered / Consumer'}
                  </div>
                  <div className="text-secondary dark:text-slate-400">{viewingInvoice.customerEmail}</div>
                </div>

                <div className="text-right">
                  <span className="uppercase tracking-wider font-semibold text-secondary dark:text-slate-400 block mb-1">
                    Consignment Dispatch Reference:
                  </span>
                  <div className="font-mono font-bold text-navy dark:text-white">
                    {viewingInvoice.shipmentId || 'Direct Service Billing'}
                  </div>
                  {viewingInvoice.shipmentRoute && (
                    <div className="text-secondary dark:text-slate-400 mt-0.5">Route: {viewingInvoice.shipmentRoute}</div>
                  )}
                  <div className="text-secondary dark:text-slate-400 mt-1">Terms: {viewingInvoice.paymentTerms}</div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-border dark:border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-border dark:border-slate-700 font-semibold uppercase text-secondary dark:text-slate-300">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Service Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                      <th className="py-2.5 px-3 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-slate-700">
                    {viewingInvoice.items.map((item, idx) => (
                      <tr key={item.id} className="dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 text-secondary dark:text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-medium text-navy dark:text-slate-200">{item.description}</td>
                        <td className="py-2.5 px-3 text-center dark:text-slate-300">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono dark:text-slate-300">
                          {item.unitPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-navy dark:text-white">
                          {item.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Calculations */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-secondary dark:text-slate-400">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold text-navy dark:text-slate-100">
                      ₹{viewingInvoice.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-secondary dark:text-slate-400">
                    <span>GST (18%):</span>
                    <span className="font-mono font-semibold text-navy dark:text-slate-100">
                      ₹{viewingInvoice.tax.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border dark:border-slate-700 pt-1.5 text-sm font-bold text-navy dark:text-white">
                    <span>Grand Total:</span>
                    <span className="font-mono text-orange">
                      ₹{viewingInvoice.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-secondary dark:text-slate-400 pt-0.5">
                    <span>Amount Paid:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      ₹{viewingInvoice.paidAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border dark:border-slate-700 pt-1 font-bold text-xs text-amber-700 dark:text-amber-400">
                    <span>Balance Due:</span>
                    <span className="font-mono">
                      ₹{viewingInvoice.outstandingAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Bank & Terms */}
              <div className="border-t border-border dark:border-slate-700 pt-4 text-[11px] text-secondary dark:text-slate-400 grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-navy dark:text-slate-200 block mb-0.5">Bank Settlement Details:</span>
                  <div>Beneficiary: VELTRAX Logistics Private Limited</div>
                  <div>Bank: State Bank of India • Branch: Connaught Place</div>
                  <div className="font-mono">A/C: 40918820019 • IFSC: SBIN0000691</div>
                  <div className="font-mono">UPI VPA: veltrax.corp@sbi</div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-navy dark:text-slate-200 block mb-0.5">Authorized Signatory:</span>
                  <div className="italic text-slate-400 dark:text-slate-500 mt-4">Digitally Generated Invoice • No Physical Signature Required</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RECORD SIMULATED PAYMENT */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-base font-bold text-navy dark:text-white">Record Commercial Settlement</h3>
                <span className="text-xs text-secondary dark:text-slate-400">
                  Invoice #{payingInvoice.invoiceNumber} • Outstanding: ₹{payingInvoice.outstandingAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <button onClick={() => setPayingInvoice(null)} className="text-secondary hover:text-navy dark:text-slate-400 dark:hover:text-white p-1">
                <AppIcon name="x" size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-secondary dark:text-slate-300 mb-1">
                  Payment Amount to Settle (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  max={payingInvoice.outstandingAmount}
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-navy dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange font-semibold"
                />
                <span className="text-[11px] text-secondary dark:text-slate-400 mt-1 block">
                  Supports partial settlement. Maximum payable: ₹{payingInvoice.outstandingAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-secondary dark:text-slate-300 mb-1">Payment Method *</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-navy dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange cursor-pointer"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m} className="dark:bg-slate-800 dark:text-slate-100">
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-secondary dark:text-slate-300 mb-1">
                  Bank UTR / Transaction Reference *
                </label>
                <input
                  type="text"
                  required
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-navy dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange font-mono"
                  placeholder="e.g. NEFT/12345678/HDFC"
                />
              </div>

              <div>
                <label className="block font-semibold text-secondary dark:text-slate-300 mb-1">Remarks / Audit Note</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg text-navy dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
                />
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                <strong>Simulated Client Ledger:</strong> This transaction will update the local invoice balance,
                recalculate customer credit usage, and append a verified mock transaction to the ledger.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2 border border-border dark:border-slate-700 text-secondary dark:text-slate-300 hover:text-navy dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Record Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION (INVOICE) */}
      {deletingInvoiceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60">
                <AppIcon name="alert" size={20} />
              </div>
              <h3 className="text-base font-bold text-navy dark:text-white">Cancel & Remove Invoice?</h3>
            </div>
            <p className="text-xs text-secondary dark:text-slate-300 leading-relaxed">
              Are you sure you want to remove invoice <strong className="text-navy dark:text-white">{deletingInvoiceId}</strong>?
              This record will be permanently deleted from local storage.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border dark:border-slate-700">
              <button
                onClick={() => setDeletingInvoiceId(null)}
                className="px-4 py-2 border border-border dark:border-slate-700 text-secondary dark:text-slate-300 hover:text-navy dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteInvoice}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Yes, Delete Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsBillingPage;
