import React from 'react';
import type { DriverInfo } from '../../types';
import { IndustrialIcon } from '../common/IndustrialIcon';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';

interface FleetListProps {
  drivers: DriverInfo[];
}

export const FleetList: React.FC<FleetListProps> = ({ drivers }) => {
  const { lang } = useTranslation();

  const getStatusBadge = (status: DriverInfo['status']) => {
    switch (status) {
      case 'on_route':
        return (
          <span className="bg-yellow-soft text-asphalt border border-yellow font-heading font-bold text-[10px] px-1.5 py-0.5 uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-yellow rounded-full animate-pulse"></span>
            {lang === 'hi' ? 'सड़क पर (चल रहा है)' : 'ON ROUTE'}
          </span>
        );
      case 'available':
        return (
          <span className="bg-teal-soft text-teal border border-teal font-heading font-bold text-[10px] px-1.5 py-0.5 uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-teal rounded-full"></span>
            {lang === 'hi' ? 'सेंटर पर तैयार' : 'READY AT CENTRE'}
          </span>
        );
      case 'maintenance':
        return (
          <span className="bg-orange-soft text-orange border border-orange font-heading font-bold text-[10px] px-1.5 py-0.5 uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-orange rounded-full"></span>
            {lang === 'hi' ? 'सर्विस पर' : 'IN SERVICE'}
          </span>
        );
      default:
        return (
          <span className="bg-[#EAECEE] text-steel font-heading font-bold text-[10px] px-1.5 py-0.5 uppercase">
            {lang === 'hi' ? 'स्टैंडबाय' : 'STANDBY'}
          </span>
        );
    }
  };

  return (
    <div className="bg-chalk border-[1.5px] border-asphalt stamp">
      {/* Header */}
      <div className="bg-asphalt text-paper p-3 flex items-center justify-between border-b border-asphalt">
        <div className="flex items-center gap-2">
          <IndustrialIcon name="truck" size={16} className="text-yellow" />
          <h2 className="font-heading font-black text-sm uppercase tracking-wider text-paper">
            {lang === 'hi' ? 'हमारी गाड़ियां और चालक' : 'OUR VEHICLES & DRIVERS'}
          </h2>
        </div>
        <div className="font-mono text-xs text-yellow font-bold">
          {drivers.filter(d => d.status === 'on_route').length} / {drivers.length} {lang === 'hi' ? 'गाड़ियां रास्ते में' : 'VEHICLES ON ROAD'}
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="divide-y divide-steel-border">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="p-3.5 hover:bg-paper transition-colors duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            {/* Operator Identification */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-asphalt text-paper border border-asphalt flex items-center justify-center font-heading font-black text-sm shrink-0 stamp-sm">
                {driver.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-asphalt uppercase tracking-wide">
                    {driver.name}
                  </span>
                  {getStatusBadge(driver.status)}
                </div>
                <div className="font-mono text-[11px] text-steel flex flex-wrap items-center gap-x-3 mt-0.5">
                  <span>{lang === 'hi' ? 'लाइसेंस:' : 'BADGE:'} <strong className="text-asphalt">{driver.badgeNumber}</strong></span>
                  <span>{lang === 'hi' ? 'नंबर प्लेट:' : 'PLATE:'} <strong className="text-asphalt font-bold text-orange">{driver.vehiclePlate}</strong></span>
                </div>
              </div>
            </div>

            {/* Vehicle & Telematics */}
            <div className="font-body text-xs sm:text-right">
              <div className="font-semibold text-asphalt">{driver.vehicleType}</div>
              <div className="font-mono text-[10px] text-steel mt-0.5 flex sm:justify-end items-center gap-2">
                <span>{lang === 'hi' ? 'वर्तमान स्थान:' : 'LOCATION:'} <strong className="text-asphalt">{driver.currentLocation}</strong></span>
              </div>
            </div>

            {/* Actions / Contact */}
            <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-dashed border-steel-border">
              {driver.currentShipmentId ? (
                <Link
                  to={`/track?id=${driver.currentShipmentId}`}
                  className="btn-industrial bg-paper text-asphalt text-[11px] px-2.5 py-1.5 border border-asphalt hover:bg-chalk flex items-center gap-1"
                >
                  <IndustrialIcon name="box" size={12} />
                  <span>{driver.currentShipmentId}</span>
                </Link>
              ) : (
                <span className="font-mono text-[10px] text-steel italic">
                  {lang === 'hi' ? 'सेंटर पर मौजूद' : 'READY AT CENTRE'}
                </span>
              )}
              <a
                href={`tel:${driver.phone}`}
                className="bg-asphalt text-paper px-2.5 py-1.5 border border-asphalt hover:bg-orange hover:text-white transition-colors flex items-center gap-1.5 font-heading font-bold text-[11px] uppercase min-h-[36px]"
                title={`Call ${driver.phone}`}
              >
                <IndustrialIcon name="phone" size={12} />
                <span>{lang === 'hi' ? 'फोन करें' : 'CALL'}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
