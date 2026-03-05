import React from 'react';
import { cn } from '../utils/cn';
import logoImage from './logo.png';

export function Logo({ className = "" }) {
  return (
    <div className={cn("relative flex flex-col items-center justify-center select-none py-2 px-4", className)}>
      <img 
        src={logoImage} 
        alt="خلية طقطق" 
        className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto object-contain transform hover:scale-105 transition-transform duration-300 drop-shadow-2xl"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
