import React from 'react';
import { cn } from '../utils/cn';

export function PillButton({ children, onClick, tone = "purple", className = "" }) {
  const toneClass =
    tone === "orange"
      ? "bg-orange-500 hover:bg-orange-600 text-white"
      : tone === "green"
        ? "bg-green-500 hover:bg-green-600 text-white"
        : tone === "red"
          ? "bg-[#e83525] hover:bg-red-600 text-white"
          : tone === "blue"
            ? "bg-[#1d64ba] hover:bg-blue-600 text-white"
            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200";
  return (
    <button
      onClick={onClick}
      className={cn(`rounded-2xl px-5 py-3 font-black transition active:scale-[0.95] ${toneClass}`, className)}
    >
      {children}
    </button>
  );
}
