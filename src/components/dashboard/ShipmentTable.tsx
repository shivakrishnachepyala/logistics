import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Shipment } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { IndustrialIcon } from '../common/IndustrialIcon';
import { useTranslation } from '../../context/LanguageContext';

interface ShipmentTableProps {
  shipments: Shipment[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({
  shipments,
  activeFilter,
  onFilterChange,
}) => {
  const { lang, t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const modeIcons: Record<string, any> = {
    ocean_freight: 'truck',
    air_express: 'plane',
    intermodal_rail: 'train',
    heavy_haul: 'truck',
  };
  // Filter shipments
  const filteredShipments = shipments.filter((s) => {
    if (activeFilter !== 'all' && s.status !== activeFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = s.id.toLowerCase().includes(q);
      const matchBol = s.billOfLading.toLowerCase().includes(q);
      const matchOrigin = s.originHub.toLowerCase().includes(q);
      const matchDest = s.destinationHub.toLowerCase().includes(q);
      const matchSender = s.sender.company.toLowerCase().includes(q) || s.sender.name.toLowerCase().includes(q);
      const matchReceiver = s.receiver.company.toLowerCase().includes(q) || s.receiver.name.toLowerCase().includes(q);
      const matchCargo = s.cargo.type.toLowerCase().includes(q);
      return matchId || matchBol || matchOrigin || matchDest || matchSender || matchReceiver || matchCargo;
    }
    return true;
  });

  return (
    <div className="bg-chalk border-[1.5px] border-asphalt stamp">
      {/* Table Control Bar */}
      <div className="p-4 bg-paper border-b border-asphalt flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder={t('dash.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-chalk text-asphalt text-xs font-mono px-3 py-2.5 border-[1.5px] border-asphalt rounded-[2px] placeholder:text-steel focus:outline-none focus:bg-white uppercase min-h-[44px]"
          />
          <span className="absolute right-3 top-3 text-steel pointer-events-none">
            <IndustrialIcon name="search" size={16} />
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status buttons */}
          <div className="flex items-center border border-asphalt rounded-[2px] overflow-hidden text-xs font-heading font-bold uppercase bg-chalk">
            {[
              { id: 'all', label: lang === 'hi' ? 'सभी पार्सल' : 'ALL PARCELS' },
              { id: 'in-transit', label: lang === 'hi' ? 'रास्ते में' : 'ON THE WAY' },
              { id: 'delivered', label: lang === 'hi' ? 'पहुंच गए' : 'DELIVERED' },
              { id: 'delayed', label: lang === 'hi' ? 'देरी से' : 'RUNNING LATE' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => onFilterChange(btn.id)}
                className={`px-3 py-2 transition-colors duration-150 border-r last:border-r-0 border-asphalt min-h-[44px] ${
                  activeFilter === btn.id
                    ? 'bg-asphalt text-paper'
                    : 'text-asphalt hover:bg-paper'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <Link
            to="/create"
            className="btn-industrial bg-orange text-white text-xs px-4 py-2 border-[1.5px] border-asphalt hover:bg-orange-hover flex items-center gap-1.5 shrink-0 min-h-[44px] stamp-sm"
          >
            <IndustrialIcon name="plus" size={14} />
            <span>{t('nav.bookNow')}</span>
          </Link>
        </div>
      </div>

      {/* Main Table Responsive Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-asphalt text-paper font-heading text-xs uppercase tracking-wider border-b border-asphalt">
              <th className="py-3 px-4">{t('dash.colId')}</th>
              <th className="py-3 px-4">{t('dash.colRoute')}</th>
              <th className="py-3 px-4">{t('dash.colItem')}</th>
              <th className="py-3 px-4">{t('dash.colWeight')}</th>
              <th className="py-3 px-4">{t('dash.colStatus')}</th>
              <th className="py-3 px-4">{t('dash.colDate')}</th>
              <th className="py-3 px-4 text-right">{t('dash.colActions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel-border font-body text-xs">
            {filteredShipments.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-steel font-mono">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <IndustrialIcon name="alert" size={24} className="text-orange" />
                    <span className="font-heading font-bold text-base text-asphalt uppercase">
                      {t('dash.empty')}
                    </span>
                    <span className="text-xs">
                      {lang === 'hi' ? 'खोज शब्द बदलकर या दूसरा बटन चुनकर देखें।' : 'Try clearing your search or choosing a different filter.'}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredShipments.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-paper transition-colors duration-150 group"
                >
                  {/* Parcel ID & LR */}
                  <td className="py-3.5 px-4 font-mono">
                    <Link
                      to={`/shipment/${s.id}`}
                      className="font-bold text-asphalt text-sm hover:text-orange flex items-center gap-1.5 transition-colors"
                    >
                      <span>{s.id}</span>
                      <span className="text-steel group-hover:text-orange text-xs">↗</span>
                    </Link>
                    <div className="text-[11px] text-steel mt-0.5 font-bold">
                      {lang === 'hi' ? 'रसीद:' : 'LR:'} {s.billOfLading}
                    </div>
                  </td>

                  {/* Route (From ➔ To) */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-asphalt">
                      <span className="bg-[#EAE5D9] px-1.5 py-0.5 border border-steel">{s.sender.city}</span>
                      <span className="text-orange font-bold">➔</span>
                      <span className="bg-[#EAE5D9] px-1.5 py-0.5 border border-steel">{s.receiver.city}</span>
                    </div>
                    <div className="text-[11px] text-steel truncate max-w-[200px] mt-0.5 font-body">
                      {s.receiver.company || s.receiver.name}
                    </div>
                  </td>

                  {/* Parcel Item & Category */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 font-heading font-bold uppercase text-xs text-asphalt">
                      <IndustrialIcon name={modeIcons[s.serviceMode]} size={14} className="text-steel" />
                      <span>{s.cargo.type}</span>
                    </div>
                    <div className="text-[11px] text-steel font-mono">
                      {s.cargo.quantity} {lang === 'hi' ? 'कार्टन / बंडल' : 'Cartons / Bundles'}
                    </div>
                  </td>

                  {/* Gross Weight */}
                  <td className="py-3.5 px-4 font-mono text-xs">
                    <div className="font-bold text-asphalt">
                      {s.cargo.weightKg.toLocaleString('en-IN')} KG
                    </div>
                    <div className="text-[10px] text-steel">
                      {s.paymentMethod === 'cod' ? 'COD' : 'PAID'}
                    </div>
                  </td>

                  {/* Status chip */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={s.status} size="sm" />
                    <div className="font-mono text-[10px] text-steel mt-1">
                      {lang === 'hi' ? 'सफर:' : 'TRANSIT:'} {s.progressPercent}%
                    </div>
                  </td>

                  {/* Expected Arrival */}
                  <td className="py-3.5 px-4 font-mono text-xs">
                    <div className="text-asphalt font-semibold">
                      {s.deliveryTimeEstimate || s.eta.slice(0, 10)}
                    </div>
                    <div className="text-[10px] text-steel">
                      {s.vesselOrFlight || s.carrier}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        to={`/track?id=${s.id}`}
                        className="btn-industrial bg-chalk text-asphalt text-xs px-3 py-1.5 border border-asphalt hover:bg-paper min-h-[36px] flex items-center gap-1"
                        title="Live GPS Track"
                      >
                        <IndustrialIcon name="search" size={12} />
                        <span>{lang === 'hi' ? 'ट्रैक' : 'TRACK'}</span>
                      </Link>
                      <Link
                        to={`/shipment/${s.id}`}
                        className="btn-industrial bg-asphalt text-paper text-xs px-3 py-1.5 border border-asphalt hover:bg-orange hover:border-orange min-h-[36px] flex items-center gap-1"
                        title="View Parcel Receipt"
                      >
                        <IndustrialIcon name="file" size={12} />
                        <span>{lang === 'hi' ? 'रसीद' : 'RECEIPT'}</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Meta */}
      <div className="p-3 bg-paper border-t border-asphalt flex flex-wrap items-center justify-between font-mono text-xs text-steel">
        <div>
          {lang === 'hi'
            ? `दिखाए जा रहे हैं: ${filteredShipments.length} / ${shipments.length} पार्सल`
            : `SHOWING ${filteredShipments.length} OF ${shipments.length} ACTIVE PARCELS`}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-asphalt font-bold">ALL TIMESTAMPS IST (+5:30)</span>
        </div>
      </div>
    </div>
  );
};
