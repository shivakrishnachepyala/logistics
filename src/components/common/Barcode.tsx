import React from 'react';

interface BarcodeProps {
  value: string;
  subtext?: string;
  height?: number;
  className?: string;
}

export const Barcode: React.FC<BarcodeProps> = ({ 
  value, 
  subtext, 
  height = 42, 
  className = '' 
}) => {
  // Deterministic bar widths based on char codes of the value
  const generateBars = (str: string) => {
    const bars: { width: number; isBlack: boolean }[] = [];
    let seed = 0;
    for (let i = 0; i < str.length; i++) {
      seed = (seed * 31 + str.charCodeAt(i)) % 997;
    }
    
    // Add guard bars
    bars.push({ width: 2, isBlack: true });
    bars.push({ width: 1, isBlack: false });
    bars.push({ width: 2, isBlack: true });
    
    // Body bars
    for (let i = 0; i < 28; i++) {
      const val = (seed + i * 37) % 10;
      bars.push({ width: (val % 3) + 1, isBlack: i % 2 === 0 });
    }
    
    // End guard bars
    bars.push({ width: 2, isBlack: true });
    bars.push({ width: 1, isBlack: false });
    bars.push({ width: 2, isBlack: true });
    return bars;
  };

  const bars = generateBars(value);

  return (
    <div className={`inline-flex flex-col items-center bg-white p-2 border border-asphalt rounded-[2px] ${className}`}>
      <div className="flex items-stretch overflow-hidden select-none" style={{ height: `${height}px` }}>
        {bars.map((bar, idx) => (
          <div
            key={idx}
            className={bar.isBlack ? 'bg-asphalt' : 'bg-transparent'}
            style={{ width: `${bar.width * 1.5}px` }}
          />
        ))}
      </div>
      <div className="mt-1 font-mono text-[10px] tracking-[0.2em] uppercase text-asphalt font-semibold">
        *{value}*
      </div>
      {subtext && (
        <div className="text-[9px] font-heading uppercase text-steel tracking-wider">
          {subtext}
        </div>
      )}
    </div>
  );
};
