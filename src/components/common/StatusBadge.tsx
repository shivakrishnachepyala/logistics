import React from 'react';
import type { ShipmentStatus } from '../../types';
import { useTranslation } from '../../context/LanguageContext';

interface StatusBadgeProps {
  status: ShipmentStatus;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  showPulse = true,
  className = '' 
}) => {
  const { lang } = useTranslation();

  const configs = {
    pending: {
      label: lang === 'hi' ? 'भेजने की प्रतीक्षा' : 'WAITING TO BE SENT',
      bg: 'bg-[#EAECEE]',
      text: 'text-asphalt',
      border: 'border-steel',
      dot: 'bg-steel',
      stamp: 'border-steel-dark',
    },
    'in-transit': {
      label: lang === 'hi' ? 'रास्ते में है' : 'ON THE WAY',
      bg: 'bg-yellow-soft',
      text: 'text-asphalt',
      border: 'border-yellow',
      dot: 'bg-yellow',
      stamp: 'border-yellow-hover',
    },
    delivered: {
      label: lang === 'hi' ? 'सफलतापूर्वक पहुंच गया' : 'DELIVERED SAFELY',
      bg: 'bg-teal-soft',
      text: 'text-teal',
      border: 'border-teal',
      dot: 'bg-teal',
      stamp: 'border-teal-hover',
    },
    delayed: {
      label: lang === 'hi' ? 'देरी से चल रहा है' : 'RUNNING LATE',
      bg: 'bg-orange-soft',
      text: 'text-orange',
      border: 'border-orange',
      dot: 'bg-orange',
      stamp: 'border-orange-hover',
    },
  };

  const current = configs[status] || configs.pending;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wider font-bold',
    md: 'text-xs px-2.5 py-1 tracking-wider font-bold',
    lg: 'text-sm px-3.5 py-1.5 tracking-widest font-extrabold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-heading uppercase border-[1.5px] rounded-[2px] transition-colors duration-150 ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
      style={{ boxShadow: '1.5px 1.5px 0px #1A1C1E' }}
    >
      <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
        {showPulse && status === 'in-transit' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow opacity-75"></span>
        )}
        {showPulse && status === 'delayed' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${current.dot}`}></span>
      </span>
      <span className="font-bold">{current.label}</span>
    </span>
  );
};
