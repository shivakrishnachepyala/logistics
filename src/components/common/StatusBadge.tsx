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
      label: lang === 'hi' ? 'भेजने की प्रतीक्षा' : 'Pending Dispatch',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      dot: 'bg-slate-400',
    },
    'in-transit': {
      label: lang === 'hi' ? 'रास्ते में है' : 'In Transit',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
    delivered: {
      label: lang === 'hi' ? 'सफलतापूर्वक पहुंच गया' : 'Delivered Safely',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
    delayed: {
      label: lang === 'hi' ? 'देरी से चल रहा है' : 'Running Late',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
    },
  };

  const current = configs[status] || configs.pending;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-full transition-colors duration-150 ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
    >
      <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
        {showPulse && status === 'in-transit' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${current.dot}`}></span>
      </span>
      <span>{current.label}</span>
    </span>
  );
};
