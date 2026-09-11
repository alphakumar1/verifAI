import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function ScanRadarAnimation({ isScanning }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Inspecting document metadata", desc: "Verifying standard camera signatures" },
    { title: "Analyzing image compression", desc: "Running Error Level Analysis (ELA)" },
    { title: "Reading optical document fields", desc: "Extracting passport number and dates via OCR" },
    { title: "Comparing facial features", desc: "Evaluating passenger photo against document crop" },
    { title: "Checking ledger history", desc: "Comparing record against blockchain truth" }
  ];

  useEffect(() => {
    if (!isScanning) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(interval);
  }, [isScanning]);

  if (!isScanning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E5EA] shadow-xl p-8 max-w-md w-full text-center">
        
        {/* Apple Blue Spinner */}
        <div className="w-12 h-12 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-6 h-6 animate-spin stroke-[2.2]" />
        </div>

        <h3 className="text-base font-semibold text-[#1D1D1F] tracking-tight mb-1">
          Screening Document...
        </h3>
        <p className="text-xs text-[#86868B] mb-6">
          Verifying security features, biometrics, and immutable record
        </p>

        {/* Clean Checklist */}
        <div className="space-y-2.5 text-left">
          {steps.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all duration-150 flex items-center gap-3 ${
                  isCurrent
                    ? 'bg-[#F5F5F7] border-[#0071E3]/30'
                    : isDone
                    ? 'bg-[#FBFBFD] border-[#E5E5EA]'
                    : 'bg-transparent border-transparent opacity-40'
                }`}
              >
                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#34C759] stroke-[2.2]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-[#0071E3] animate-spin stroke-[2.2]" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-[#D2D2D7]"></div>
                  )}
                </div>

                <div>
                  <div className={`text-xs font-medium ${isCurrent ? 'text-[#0071E3]' : isDone ? 'text-[#1D1D1F]' : 'text-[#86868B]'}`}>
                    {step.title}
                  </div>
                  <div className="text-[11px] text-[#86868B]">
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
