import React from 'react';
import { Shield, RotateCw } from 'lucide-react';

export default function Navbar({ onReset, officerId = "ID-402" }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF] border-b border-[#E5E5EA]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Shield Emblem & Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0071E3]/10 flex items-center justify-center text-[#0071E3] shrink-0">
            <Shield className="w-5 h-5 stroke-[2]" />
          </div>

          <div className="flex items-baseline">
            <h1 className="text-base font-semibold text-[#1D1D1F] tracking-tight">
              Document Screening System
            </h1>
            <span className="text-xs text-[#86868B] ml-2 font-normal hidden sm:inline">
              SSB / Ministry of Home Affairs
            </span>
          </div>
        </div>

        {/* Right: Unified Status Capsule & Reset */}
        <div className="flex items-center gap-3">
          
          {/* Subtle Status Capsule */}
          <div className="bg-[#F5F5F7] border border-[#E5E5EA] rounded-full px-3.5 py-1.5 flex items-center gap-2.5 text-xs text-[#6E6E73]">
            <span className="flex items-center gap-1.5 text-[#1D1D1F] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#34C759]"></span>
              System Ready
            </span>
            <span className="text-[#D2D2D7]">|</span>
            <span>Ledger Connected</span>
            <span className="text-[#D2D2D7]">|</span>
            <span className="font-mono text-[#1D1D1F]">{officerId}</span>
          </div>

          {/* Clean Flat Circular Reset Button */}
          <button
            onClick={onReset}
            title="Reset Terminal"
            className="w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#6E6E73] hover:text-[#1D1D1F] flex items-center justify-center transition-colors"
          >
            <RotateCw className="w-4 h-4 stroke-[1.75]" />
          </button>

        </div>

      </div>
    </header>
  );
}
