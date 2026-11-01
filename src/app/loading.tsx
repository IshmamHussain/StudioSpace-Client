import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Pulsing aperture ring */}
        <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
        <div className="w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
        </div>
      </div>
      <p className="mt-4 text-xs font-mono tracking-widest text-studio-500 uppercase">
        Calibrating Studio Optics...
      </p>
    </div>
  );
}

