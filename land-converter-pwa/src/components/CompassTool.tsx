import { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';

export function CompassTool() {
  const [heading, setHeading] = useState<number | null>(null);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const h = (e as any).webkitCompassHeading || (e.alpha ? Math.abs(e.alpha - 360) : null);
      if (h !== null) setHeading(h);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  if (heading === null) return null;

  return (
    // Moved down to top-12 on mobile to avoid overlapping the SAT/MAP toggle
    <div className="absolute top-12 md:top-4 right-2 md:right-4 bg-white/95 px-2 py-1.5 rounded-xl shadow-lg z-[500] flex flex-col items-center justify-center border border-gray-200 min-w-[46px]">
      {/* N label for North */}
      <span className="text-[9px] font-black text-red-600 tracking-widest leading-none">N</span>
      <div 
        className="transition-transform duration-200 my-0.5"
        style={{ transform: `rotate(${-heading}deg)` }}
      >
        <Compass size={24} className="text-[#2E7D32]" />
      </div>
      <span className="text-[9px] font-bold text-gray-600">{Math.round(heading)}&deg;</span>
    </div>
  );
}
