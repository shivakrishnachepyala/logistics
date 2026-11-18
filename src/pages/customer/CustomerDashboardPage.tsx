import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../../context/useCustomerAuth';
import { getShipmentsByCustomerId } from '../../data/mockShipments';
import { getBookingsByCustomerId, getAddressesByCustomerId } from '../../data/mockCustomers';
import { IndustrialIcon } from '../../components/common/IndustrialIcon';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency } from '../../utils/indiaHelpers';
import type { Shipment } from '../../types';

export const CustomerDashboardPage: React.FC = () => {
  const { customer } = useCustomerAuth();
  const navigate = useNavigate();
  const [quickTrackId, setQuickTrackId] = useState('');
  const customerId = customer?.id || '';
  const [shipments, setShipments] = useState<Shipment[]>(() => customerId ? getShipmentsByCustomerId(customerId) : []);

  useEffect(() => {
    const handleUpdate = () => {
      if (customerId) setShipments(getShipmentsByCustomerId(customerId));
    };
    handleUpdate();
    window.addEventListener('freightline_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('freightline_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [customerId]);

  const bookings = useMemo(() => {
    if (!customerId) return [];
    return getBookingsByCustomerId(customerId);
  }, [customerId]);

  const addresses = useMemo(() => {
    if (!customerId) return [];
    return getAddressesByCustomerId(customerId);
  }, [customerId]);

  // Metric computations
  const totalCount = shipments.length;
  const inTransitCount = shipments.filter(s => s.status === 'in-transit').length;
  const deliveredCount = shipments.filter(s => s.status === 'delivered').length;
  const pendingCount = shipments.filter(s => s.status === 'pending').length;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTrackId.trim()) return;
    navigate(`/track?id=${encodeURIComponent(quickTrackId.trim().toUpperCase())}`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800">
              Verified Customer Account
            </span>
            <span className="text-xs text-slate-400">ID: {customer?.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 tracking-tight">
            Welcome back, {customer?.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {customer?.company ? `${customer.company} • ` : ''}
            Manage your dispatch orders, live deliveries and freight bookings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/account/book"
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-orange-500/20 hover:shadow transition-all flex items-center gap-2"
          >
            <IndustrialIcon name="plus" size={15} />
            <span>Book New Shipment</span>
          </Link>
          <Link
            to="/account/addresses"
            className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <IndustrialIcon name="pin" size={14} />
            <span>Address Book ({addresses.length})</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Shipments */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Shipments</span>
            <span className="p-1.5 bg-slate-100 text-slate-600 rounded-lg">
              <IndustrialIcon name="box" size={16} />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across all domestic routes
          </div>
        </div>

        {/* Metric 2: Active In-Transit */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-blue-600 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>In-Transit Active</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <IndustrialIcon name="truck" size={16} />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-blue-600">
            {inTransitCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            En route with live GPS
          </div>
        </div>

        {/* Metric 3: Delivered */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Delivered</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <IndustrialIcon name="check" size={16} />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-emerald-600">
            {deliveredCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Proof of delivery confirmed
          </div>
        </div>

        {/* Metric 4: Pending Bookings */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-amber-600 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Pending Manifests</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <IndustrialIcon name="clock" size={16} />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-amber-600">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Awaiting hub dispatch
          </div>
        </div>
      </div>

      {/* 3. Quick Actions & Live Tracking Search Bar */}
      <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-navy-900 text-white rounded-2xl p-5 sm:p-6 shadow-saas-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-5">
            <div className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
              Quick Parcel Lookup
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Track Any Waybill or Consignment
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Enter any LR / Consignment number to inspect real-time line-haul status
            </p>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g. FLX-8829-JPR or BKG-..."
                  value={quickTrackId}
                  onChange={(e) => setQuickTrackId(e.target.value)}
                  className="w-full bg-slate-800 text-white placeholder:text-slate-400 text-xs font-mono px-3.5 py-3 rounded-xl border border-slate-700 uppercase focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <span className="absolute right-3 top-3 text-slate-400">
                  <IndustrialIcon name="barcode" size={16} />
                </span>
              </div>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
              >
                <IndustrialIcon name="search" size={14} />
                <span>Track Now</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Active Delay Advisory Banner if customer has a delayed shipment */}
      {shipments.filter(s => s.status === 'delayed').map(delayedShipment => (
        <div
          key={delayedShipment.id}
          className="bg-amber-50 border-2 border-amber-400/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <IndustrialIcon name="alert" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-white font-mono">
                  DELIVERY DELAYED
                </span>
                <span className="font-mono text-xs font-bold text-slate-800">
                  {delayedShipment.id}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-600 font-medium">
                  {delayedShipment.sender.city} → {delayedShipment.receiver.city}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {delayedShipment.delayInfo?.customerExplanation || delayedShipment.delayInfo?.reason || 'Unexpected transportation disruption along the delivery route.'}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span><strong>Revised Delivery:</strong> <span className="text-amber-800 font-bold">{delayedShipment.delayInfo?.revisedEta || 'New delivery estimate pending'}</span></span>
                <span>•</span>
                <span><strong>Location:</strong> {delayedShipment.delayInfo?.location || `${delayedShipment.originHub} → ${delayedShipment.destinationHub}`}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <Link
              to="/account/shipments"
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>View Advisory Details</span>
              <IndustrialIcon name="arrow-right" size={12} />
            </Link>
          </div>
        </div>
      ))}

      {/* 4. Active Shipments Directory (Customer-Isolated) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-heading font-bold text-slate-900 tracking-tight">
              My Active Shipments
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Shipments associated with your customer ID ({customer?.id})
            </p>
          </div>
          <Link
            to="/account/shipments"
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>View All ({shipments.length})</span>
            <IndustrialIcon name="arrow-right" size={12} />
          </Link>
        </div>

        {shipments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <IndustrialIcon name="box" size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">No Shipments Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              You haven't booked any shipments under this account yet. Use our instant booking system to dispatch your first parcel.
            </p>
            <Link
              to="/account/book"
              className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              <IndustrialIcon name="plus" size={14} />
              <span>Book Shipment</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Tracking ID & LR</th>
                  <th className="py-3 px-4">Corridor / Route</th>
                  <th className="py-3 px-4">Receiver</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Progress / ETA</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {shipments.slice(0, 5).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">{s.id}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{s.billOfLading}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">
                        {s.sender.city} → {s.receiver.city}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                        {s.cargo.type} ({s.cargo.weightKg} kg)
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{s.receiver.name}</div>
                      <div className="text-[11px] text-slate-500">{s.receiver.company || s.receiver.city}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={s.status} />
                      {(s.status === 'delayed' || s.delayInfo) && (
                        <Link
                          to="/account/shipments"
                          className="text-[10px] text-amber-700 font-semibold block mt-1 hover:underline"
                        >
                          Advisory Notice →
                        </Link>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-orange-500 h-full rounded-full"
                            style={{ width: `${s.progressPercent}%` }}
                          ></div>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-600">
                          {s.progressPercent}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {s.deliveryTimeEstimate || s.eta}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/account/receipt/${s.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-2 py-1 rounded-md transition-colors shadow-2xs"
                          title="View official electronic lorry receipt"
                        >
                          <IndustrialIcon name="file" size={11} className="text-orange-500" />
                          <span>e-LR</span>
                        </Link>

                        <Link
                          to={`/track?id=${s.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded-md transition-colors"
                        >
                          <IndustrialIcon name="search" size={11} />
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

      {/* 5. Recent Booking History Preview */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-heading font-bold text-slate-900 tracking-tight">
              Recent Booking Orders
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Self-service orders created from your account
            </p>
          </div>
          <Link
            to="/account/history"
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>All Orders ({bookings.length})</span>
            <IndustrialIcon name="arrow-right" size={12} />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No past booking records registered.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {bookings.slice(0, 3).map((b) => (
              <div
                key={b.bookingId}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white hover:border-orange-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{b.bookingId}</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                      {b.status}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    {b.originCity} → {b.destinationCity}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {b.cargoDescription}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <div className="font-bold text-slate-900">{formatCurrency(b.totalAmount)}</div>
                  <Link
                    to={`/track?id=${b.trackingId}`}
                    className="text-orange-600 hover:text-orange-700 font-semibold text-[11px] flex items-center gap-1"
                  >
                    <span>Track {b.trackingId}</span>
                    <IndustrialIcon name="arrow-right" size={10} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
