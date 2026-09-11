import React from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';

export default function DemoPresets({ onSelectPreset, isLoading, activePreset }) {
  const tabs = [
    {
      id: 'authentic',
      label: 'Authentic Passport',
      subtitle: 'Normal scan, valid record',
      icon: Check,
      iconColor: 'text-[#34C759]',
    },
    {
      id: 'forgery_mismatch',
      label: 'Altered DOB',
      subtitle: 'Database tampering test',
      icon: AlertTriangle,
      iconColor: 'text-[#FF9500]',
    },
    {
      id: 'photoshop_tampered',
      label: 'Photo Spliced',
      subtitle: 'Photoshop visual tampering',
      icon: X,
      iconColor: 'text-[#FF3B30]',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="text-[11px] font-medium text-[#86868B] uppercase tracking-wider">
        Quick Test Scenarios
      </div>

      {/* Apple-Style Segmented Control */}
      <div className="bg-[#E8E8ED] p-1 rounded-xl inline-flex gap-1 border border-black/[0.04] shadow-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activePreset === tab.id;

          return (
            <button
              key={tab.id}
              disabled={isLoading}
              onClick={() => onSelectPreset(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs transition-all duration-150 flex items-center gap-2 select-none ${
                isSelected
                  ? 'bg-[#FFFFFF] text-[#1D1D1F] font-medium shadow-sm'
                  : 'bg-transparent text-[#6E6E73] hover:text-[#1D1D1F] font-normal'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.iconColor} stroke-[2.2]`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
