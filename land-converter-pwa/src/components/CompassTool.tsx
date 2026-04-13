import { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';

export function CompassTool() {
  const [heading, setHeading] = useState<number | null>(null);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // webkitCompassHeading is for iOS, alpha is for Android
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
    <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg z-[1000] flex flex-col items-center justify-center border border-gray-200">
      <div 
        className="transition-transform duration-200"
        style={{ transform: `rotate(${-heading}deg)` }}
      >
        <Compass size={28} className="text-[#2E7D32]" />
      </div>
      <span className="text-[10px] font-bold mt-1">{Math.round(heading)}&deg;</span>
    </div>
  );
}
