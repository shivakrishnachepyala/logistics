import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCustomerAuth } from '../../context/useCustomerAuth';
import { getBookingsByCustomerId } from '../../data/mockCustomers';
import { IndustrialIcon } from '../../components/common/IndustrialIcon';
import { formatCurrency } from '../../utils/indiaHelpers';

export const CustomerBookingHistoryPage: React.FC = () => {
  const { customer } = useCustomerAuth();
  const customerId = customer?.id || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'dispatched' | 'delivered' | 'delayed' | 'cancelled'>('all');

  const rawBookings = useMemo(() => {
    if (!customerId) return [];
    return getBookingsByCustomerId(customerId);
  }, [customerId]);

  const filteredBookings = useMemo(() => {
    let list = [...rawBookings];

    if (statusFilter !== 'all') {
      list = list.filter(b => b.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(b =>
        b.bookingId.toLowerCase().includes(q) ||
        b.trackingId.toLowerCase().includes(q) ||
        b.originCity.toLowerCase().includes(q) ||
        b.destinationCity.toLowerCase().includes(q) ||
        b.cargoDescription.toLowerCase().includes(q)
      );
    }

    return list;
  }, [rawBookings, statusFilter, searchTerm]);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 tracking-tight">
            Booking History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete transaction ledger of consignments booked via your self-service account
          </p>
        </div>

        <Link
          to="/account/book"
          className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-orange-500/20 hover:shadow transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <IndustrialIcon name="plus" size={15} />
          <span>New Consignment</span>
        </Link>
      </div>

      {/* 2. Search & Filter Controls */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by Booking ID (e.g. BKG-2026-8829), Tracking ID or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs px-3.5 py-2.5 pl-9 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white dark:focus:bg-slate-900"
          />
          <span className="absolute left-3 top-2.5 text-slate-400">
            <IndustrialIcon name="search" size={15} />
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'all', label: 'All Orders' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'dispatched', label: 'Dispatched' },
              { id: 'delivered', label: 'Delivered' },
            ] as const
          ).map((tab) => {
            const count =
              tab.id === 'all'
                ? rawBookings.length
                : rawBookings.filter(b => b.status === tab.id).length;
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-slate-900 dark:bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    active ? 'bg-slate-700 dark:bg-orange-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Booking History Ledger Table */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xs overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <IndustrialIcon name="clock" size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No booking orders found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              {searchTerm
                ? `No booking records match "${searchTerm}".`
                : 'You have not registered any bookings under this filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Tracking Number</th>
                  <th className="py-3 px-4">Booking Date</th>
                  <th className="py-3 px-4">Origin → Destination</th>
                  <th className="py-3 px-4">Cargo & Weight</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
                {filteredBookings.map((b) => (
                  <tr key={b.bookingId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {b.bookingId}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-orange-600 dark:text-orange-400">{b.trackingId}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {new Date(b.bookingDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {b.originCity} → {b.destinationCity}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{b.cargoDescription}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">
                        {b.weightKg} kg • {b.quantity} pkgs
                      </div>
                    </td>

                    <td className="py-3.5 px-4 uppercase font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                      {b.paymentMethod}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(b.totalAmount)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === 'delivered'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : b.status === 'dispatched'
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                            : b.status === 'cancelled'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/account/receipt/${b.trackingId}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-2.5 py-1 rounded-md transition-colors shadow-2xs"
                          title="View official electronic lorry receipt (e-LR / Bilty)"
                        >
                          <IndustrialIcon name="file" size={12} className="text-orange-500" />
                          <span>e-LR Bilty</span>
                        </Link>

                        <Link
                          to={`/track?id=${b.trackingId}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-md transition-colors"
                        >
                          <IndustrialIcon name="search" size={12} />
                          <span>Track</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerBookingHistoryPage;
