import React from 'react';

interface IconProps {
  name: 
    | 'truck' 
    | 'ship' 
    | 'plane' 
    | 'train' 
    | 'container' 
    | 'box' 
    | 'barcode' 
    | 'check' 
    | 'clock' 
    | 'alert' 
    | 'pin' 
    | 'file' 
    | 'search' 
    | 'arrow-right' 
    | 'arrow-left'
    | 'shield' 
    | 'user' 
    | 'phone' 
    | 'weight' 
    | 'gauge' 
    | 'chevron-down' 
    | 'chevron-right' 
    | 'printer' 
    | 'download' 
    | 'filter' 
    | 'plus'
    | 'compass'
    | 'thermometer'
    | 'calendar'
    | 'camera'
    | 'mic'
    | 'lock'
    | 'help'
    | 'refresh';
  className?: string;
  size?: number;
}

export const IndustrialIcon: React.FC<IconProps> = ({ name, className = 'w-4 h-4', size = 18 }) => {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'square' as const,
    strokeLinejoin: 'miter' as const,
    className: `inline-block shrink-0 ${className}`,
  };

  switch (name) {
    case 'truck':
      return (
        <svg {...commonProps}>
          <rect x="2" y="6" width="13" height="11" />
          <polygon points="15 8 20 8 22 12 22 17 15 17 15 8" />
          <circle cx="6" cy="18" r="2" fill="currentColor" />
          <circle cx="18" cy="18" r="2" fill="currentColor" />
        </svg>
      );
    case 'ship':
      return (
        <svg {...commonProps}>
          <polygon points="2 18 5 13 19 13 22 18 2 18" />
          <line x1="12" y1="5" x2="12" y2="13" />
          <line x1="8" y1="8" x2="16" y2="8" />
          <line x1="4" y1="21" x2="20" y2="21" strokeDasharray="2 2" />
        </svg>
      );
    case 'plane':
      return (
        <svg {...commonProps}>
          <polygon points="12 2 15 9 22 11 22 13 14 13 14 19 17 21 17 22 12 21 7 22 7 21 10 19 10 13 2 13 2 11 9 9 12 2" />
        </svg>
      );
    case 'train':
      return (
        <svg {...commonProps}>
          <rect x="4" y="3" width="16" height="15" />
          <line x1="4" y1="11" x2="20" y2="11" />
          <circle cx="8" cy="15" r="1.5" fill="currentColor" />
          <circle cx="16" cy="15" r="1.5" fill="currentColor" />
          <line x1="4" y1="21" x2="8" y2="18" />
          <line x1="20" y1="21" x2="16" y2="18" />
          <line x1="10" y1="3" x2="14" y2="3" />
        </svg>
      );
    case 'container':
      return (
        <svg {...commonProps}>
          <rect x="2" y="5" width="20" height="14" />
          <line x1="6" y1="5" x2="6" y2="19" />
          <line x1="10" y1="5" x2="10" y2="19" />
          <line x1="14" y1="5" x2="14" y2="19" />
          <line x1="18" y1="5" x2="18" y2="19" />
        </svg>
      );
    case 'box':
      return (
        <svg {...commonProps}>
          <polygon points="12 2 22 7.5 22 17.5 12 23 2 17.5 2 7.5 12 2" />
          <line x1="12" y1="12" x2="12" y2="23" />
          <line x1="2" y1="7.5" x2="12" y2="12" />
          <line x1="22" y1="7.5" x2="12" y2="12" />
        </svg>
      );
    case 'barcode':
      return (
        <svg {...commonProps}>
          <line x1="3" y1="5" x2="3" y2="19" />
          <line x1="6" y1="5" x2="6" y2="19" />
          <line x1="8" y1="5" x2="8" y2="19" />
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="15" y1="5" x2="15" y2="19" />
          <line x1="19" y1="5" x2="19" y2="19" />
          <line x1="21" y1="5" x2="21" y2="19" />
        </svg>
      );
    case 'check':
      return (
        <svg {...commonProps}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 16 14" />
        </svg>
      );
    case 'alert':
      return (
        <svg {...commonProps}>
          <polygon points="12 3 22 20 2 20 12 3" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
        </svg>
      );
    case 'pin':
      return (
        <svg {...commonProps}>
          <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 13 6 13s6-8.5 6-13c0-3.314-2.686-6-6-6z" />
          <circle cx="12" cy="8" r="2" fill="currentColor" />
        </svg>
      );
    case 'file':
      return (
        <svg {...commonProps}>
          <polygon points="14 2 14 8 20 8" />
          <polygon points="14 2 4 2 4 22 20 22 20 8 14 2" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="14" y2="17" />
        </svg>
      );
    case 'search':
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16" y2="16" />
        </svg>
      );
    case 'arrow-right':
      return (
        <svg {...commonProps}>
          <line x1="4" y1="12" x2="20" y2="12" />
          <polyline points="14 6 20 12 14 18" />
        </svg>
      );
    case 'arrow-left':
      return (
        <svg {...commonProps}>
          <line x1="20" y1="12" x2="4" y2="12" />
          <polyline points="10 6 4 12 10 18" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...commonProps}>
          <polygon points="12 2 20 5 20 11 12 21 4 11 4 5 12 2" />
        </svg>
      );
    case 'user':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...commonProps}>
          <rect x="5" y="2" width="14" height="20" />
          <line x1="10" y1="19" x2="14" y2="19" />
        </svg>
      );
    case 'weight':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="5" r="3" />
          <polygon points="4 21 8 8 16 8 20 21 4 21" />
        </svg>
      );
    case 'gauge':
      return (
        <svg {...commonProps}>
          <path d="M4 14a8 8 0 1 1 16 0" />
          <line x1="12" y1="14" x2="15" y2="10" />
        </svg>
      );
    case 'chevron-down':
      return (
        <svg {...commonProps}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      );
    case 'chevron-right':
      return (
        <svg {...commonProps}>
          <polyline points="9 6 15 12 9 18" />
        </svg>
      );
    case 'printer':
      return (
        <svg {...commonProps}>
          <polyline points="6 9 6 3 18 3 18 9" />
          <rect x="4" y="9" width="16" height="9" />
          <rect x="6" y="15" width="12" height="6" />
        </svg>
      );
    case 'download':
      return (
        <svg {...commonProps}>
          <line x1="12" y1="4" x2="12" y2="16" />
          <polyline points="7 11 12 16 17 11" />
          <line x1="4" y1="20" x2="20" y2="20" />
        </svg>
      );
    case 'filter':
      return (
        <svg {...commonProps}>
          <polygon points="2 4 22 4 14 12 14 19 10 21 10 12 2 4" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...commonProps}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    case 'compass':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <polygon points="12 7 14 12 12 17 10 12 12 7" fill="currentColor" />
        </svg>
      );
    case 'thermometer':
      return (
        <svg {...commonProps}>
          <rect x="10" y="2" width="4" height="14" />
          <circle cx="12" cy="18" r="4" fill="currentColor" />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...commonProps}>
          <rect x="3" y="4" width="18" height="17" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="9" x2="21" y2="9" />
        </svg>
      );
    case 'camera':
      return (
        <svg {...commonProps}>
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );
    case 'mic':
      return (
        <svg {...commonProps}>
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...commonProps}>
          <rect x="3" y="11" width="18" height="11" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case 'help':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
        </svg>
      );
    case 'refresh':
      return (
        <svg {...commonProps}>
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
      );
    default:
      return null;
  }
};
