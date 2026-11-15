import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCustomerAuth } from '../../context/useCustomerAuth';
import { getShipmentsByCustomerId } from '../../data/mockShipments';
import type { Shipment, ShipmentStatus } from '../../types';
import { IndustrialIcon } from '../../components/common/IndustrialIcon';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency } from '../../utils/indiaHelpers';

export const CustomerShipmentsPage: React.FC = () => {
  const { customer } = useCustomerAuth();
  const customerId = customer?.id || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ShipmentStatus>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const rawShipments = useMemo(() => {
    if (!customerId) return [];
    return getShipmentsByCustomerId(customerId);
  }, [customerId]);

  const filteredShipments = useMemo(() => {
    let list = [...rawShipments];

    if (statusFilter !== 'all') {
      list = list.filter(s => s.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(s =>
        s.id.toLowerCase().includes(q) ||
        s.billOfLading.toLowerCase().includes(q) ||
        s.receiver.name.toLowerCase().includes(q) ||
        s.receiver.city.toLowerCase().includes(q) ||
        s.cargo.type.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const timeA = new Date(a.dispatchedAt || 0).getTime();
      const timeB = new Date(b.dispatchedAt || 0).getTime();
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [rawShipments, statusFilter, searchTerm, sortBy]);

  const handleCopy = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 tracking-tight">
            My Shipments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracking directory strictly isolated to your customer account ({customer?.fullName})
          </p>
        </div>

        <Link
          to="/account/book"
          className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-orange-500/20 hover:shadow transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <IndustrialIcon name="plus" size={15} />
          <span>Book Shipment</span>
        </Link>
      </div>

      {/* 2. Search & Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by ID (e.g. FLX-8829-JPR), LR, receiver or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs px-3.5 py-2.5 pl-9 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all"
            />
            <span className="absolute left-3 top-2.5 text-slate-400">
              <IndustrialIcon name="search" size={15} />
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="newest">Newest Dispatch First</option>
              <option value="oldest">Oldest Dispatch First</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar border-t border-slate-100">
          {(
            [
              { id: 'all', label: 'All Shipments' },
              { id: 'in-transit', label: 'In Transit' },
              { id: 'delivered', label: 'Delivered' },
              { id: 'delayed', label: 'Delayed' },
              { id: 'pending', label: 'Pending' },
            ] as const
          ).map((tab) => {
            const count =
              tab.id === 'all'
                ? rawShipments.length
                : rawShipments.filter(s => s.status === tab.id).length;
            const active = statusFilter === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    active ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Shipments List */}
      {filteredShipments.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <IndustrialIcon name="box" size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            No matching shipments found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {searchTerm
              ? `No shipments match "${searchTerm}" for your account.`
              : 'You have no registered shipments with the selected status.'}
          </p>
          {(searchTerm || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 underline"
            >
              Reset all search filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredShipments.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: ID & Route */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono font-bold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
                      {s.id}
                      <button
                        onClick={() => handleCopy(s.id)}
                        className="text-slate-400 hover:text-orange-500 transition-colors"
                        title="Copy Tracking ID"
                      >
                        <IndustrialIcon name="box" size={13} />
                      </button>
                    </span>
                    {copiedId === s.id && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                        Copied!
                      </span>
                    )}

                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-mono">LR: {s.billOfLading}</span>
                    <StatusBadge status={s.status} />
                  </div>

                  {/* Corridor */}
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>{s.sender.city} ({s.originHubCode})</span>
                    <IndustrialIcon name="arrow-right" size={14} className="text-orange-500" />
                    <span>{s.receiver.city} ({s.destinationHubCode})</span>
                  </div>

                  {/* Details line */}
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>
                      <strong className="text-slate-700">Receiver:</strong> {s.receiver.name} ({s.receiver.company || s.receiver.city})
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-700">Cargo:</strong> {s.cargo.type} ({s.cargo.weightKg} kg, {s.cargo.quantity} units)
                    </span>
                    {s.priceBreakdown && (
                      <>
                        <span>•</span>
                        <span>
                          <strong className="text-slate-700">Freight:</strong> {formatCurrency(s.priceBreakdown.total)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Middle: Progress / ETA */}
                <div className="lg:w-56 shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Progress</span>
                    <span className="font-bold text-slate-800">{s.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full transition-all"
                      style={{ width: `${s.progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1.5 truncate">
                    {s.deliveryTimeEstimate || `ETA: ${s.eta}`}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex sm:flex-col lg:flex-row items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedShipment(s)}
                    className="flex-1 sm:flex-initial text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <IndustrialIcon name="file" size={13} />
                    <span>Manifest</span>
                  </button>

                  <Link
                    to={`/track?id=${s.id}`}
                    className="flex-1 sm:flex-initial text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 px-3.5 py-2 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <IndustrialIcon name="search" size={13} />
                    <span>Live Track</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Manifest / Shipment Quick Details Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div>
                <div className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  Shipment Consignment Manifest
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 font-mono">
                  {selectedShipment.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedShipment(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <div className="font-semibold text-slate-500 uppercase text-[10px]">Sender Details</div>
                  <div className="font-bold text-slate-900 mt-1">{selectedShipment.sender.name}</div>
                  <div className="text-slate-600">{selectedShipment.sender.company}</div>
                  <div className="text-slate-500">{selectedShipment.sender.address}, {selectedShipment.sender.city}</div>
                  <div className="text-slate-500 font-mono">{selectedShipment.sender.contactPhone}</div>
                </div>

                <div>
                  <div className="font-semibold text-slate-500 uppercase text-[10px]">Receiver Details</div>
                  <div className="font-bold text-slate-900 mt-1">{selectedShipment.receiver.name}</div>
                  <div className="text-slate-600">{selectedShipment.receiver.company}</div>
                  <div className="text-slate-500">{selectedShipment.receiver.address}, {selectedShipment.receiver.city}</div>
                  <div className="text-slate-500 font-mono">{selectedShipment.receiver.contactPhone}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-white p-3 border border-slate-200 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Service Mode</span>
                  <span className="font-bold text-slate-800 uppercase">{selectedShipment.serviceMode.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Weight / Volume</span>
                  <span className="font-bold text-slate-800">{selectedShipment.cargo.weightKg} kg ({selectedShipment.cargo.quantity} pkgs)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Carrier</span>
                  <span className="font-bold text-slate-800 truncate block">{selectedShipment.carrier}</span>
                </div>
              </div>

              {selectedShipment.checkpoints.length > 0 && (
                <div>
                  <div className="font-semibold text-slate-700 mb-2">Transit Milestones:</div>
                  <div className="space-y-2 border-l-2 border-orange-200 pl-3">
                    {selectedShipment.checkpoints.map((cp, idx) => (
                      <div key={idx} className="relative">
                        <div className={`text-xs font-semibold ${cp.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {cp.location} ({cp.facilityCode})
                        </div>
                        <div className="text-[11px] text-slate-500">{cp.description}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{cp.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedShipment(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <Link
                to={`/track?id=${selectedShipment.id}`}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <IndustrialIcon name="search" size={13} />
                <span>Open Full Tracking</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerShipmentsPage;
