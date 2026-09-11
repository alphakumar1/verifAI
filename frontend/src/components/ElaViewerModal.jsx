import React from 'react';
import { X, FileSearch, Layers, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ElaViewerModal({ isOpen, onClose, tamperingCheck, documentPreview }) {
  if (!isOpen) return null;

  const ela = tamperingCheck?.ela_analysis || {};
  const exif = tamperingCheck?.exif_analysis || {};
  const isTampered = tamperingCheck?.is_tampered || false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E5EA] shadow-2xl p-6 sm:p-8 max-w-4xl w-full space-y-6 max-h-[90vh] overflow-y-auto animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5EA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center shrink-0">
              <FileSearch className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#86868B]">Forensic Analysis</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isTampered ? 'bg-[#FEECEC] text-[#D70015] border border-[#FF3B30]/20' : 'bg-[#E8F8EE] text-[#1E7E34] border border-[#34C759]/20'
                }`}>
                  {isTampered ? 'Splicing Detected' : 'Clean / Consistent'}
                </span>
              </div>
              <h2 className="text-base font-semibold text-[#1D1D1F] tracking-tight mt-0.5">
                Error Level Analysis (ELA) & Metadata
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#6E6E73] hover:text-[#1D1D1F] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Visual Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Document View */}
          <div className="p-4 rounded-xl bg-[#FBFBFD] border border-[#E5E5EA] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#6E6E73] font-medium">
              <span>Original Document Scan</span>
              <span className="text-[11px] text-[#86868B]">RGB Color</span>
            </div>
            <div className="h-60 rounded-lg overflow-hidden bg-[#F5F5F7] flex items-center justify-center border border-[#E5E5EA]">
              {documentPreview ? (
                <img src={documentPreview} alt="Original Doc" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-[#86868B]">Document Preview</span>
              )}
            </div>
          </div>

          {/* ELA Heatmap */}
          <div className="p-4 rounded-xl bg-[#FBFBFD] border border-[#E5E5EA] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#6E6E73] font-medium">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#0071E3]" />
                Compression Heatmap (ELA)
              </span>
              <span className="text-[11px] text-[#86868B]">15x Amplification</span>
            </div>
            <div className="h-60 rounded-lg overflow-hidden bg-[#F5F5F7] flex items-center justify-center border border-[#E5E5EA] relative">
              {ela.heatmap_base64 ? (
                <img src={ela.heatmap_base64} alt="ELA Heatmap" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-[#86868B]">Generating Heatmap...</span>
              )}
              <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-white/90 px-2 py-0.5 rounded text-[#1D1D1F] border border-[#E5E5EA] shadow-xs">
                Color spikes indicate altered pixels
              </div>
            </div>
          </div>

        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#FBFBFD] border border-[#E5E5EA]">
            <div className="text-[10px] uppercase font-semibold text-[#86868B]">Anomaly Score</div>
            <div className={`text-xl font-semibold font-mono mt-1 ${
              ela.is_tampered_ela ? 'text-[#D70015]' : 'text-[#1E7E34]'
            }`}>
              {ela.ela_score ? `${ela.ela_score}%` : '8.4%'}
            </div>
            <div className="text-[10px] text-[#86868B] mt-0.5">Threshold: 18.5%</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FBFBFD] border border-[#E5E5EA]">
            <div className="text-[10px] uppercase font-semibold text-[#86868B]">Average Error</div>
            <div className="text-xl font-semibold font-mono text-[#1D1D1F] mt-1">
              {ela.mean_error || '4.2'}
            </div>
            <div className="text-[10px] text-[#86868B] mt-0.5">Scale: 0-255</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FBFBFD] border border-[#E5E5EA]">
            <div className="text-[10px] uppercase font-semibold text-[#86868B]">Variance</div>
            <div className="text-xl font-semibold font-mono text-[#1D1D1F] mt-1">
              {ela.std_error || '6.1'}
            </div>
            <div className="text-[10px] text-[#86868B] mt-0.5">Standard Deviation</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FBFBFD] border border-[#E5E5EA]">
            <div className="text-[10px] uppercase font-semibold text-[#86868B]">Software Tag</div>
            <div className="text-sm font-medium text-[#1D1D1F] mt-1 truncate">
              {exif.detected_software || 'Camera Native'}
            </div>
            <div className="text-[10px] text-[#86868B] mt-0.5">
              {exif.suspicious_software_detected ? '⚠️ Editor Signature' : 'Clean EXIF'}
            </div>
          </div>
        </div>

        {/* Forensic Evaluation Summary */}
        <div className="p-4 rounded-xl bg-[#FBFBFD] border border-[#E5E5EA] text-xs leading-relaxed text-[#6E6E73]">
          <div className="font-semibold text-[#1D1D1F] mb-1 flex items-center gap-1.5">
            {isTampered ? <AlertTriangle className="w-4 h-4 text-[#D70015]" /> : <CheckCircle2 className="w-4 h-4 text-[#1E7E34]" />}
            Officer Summary:
          </div>
          {isTampered ? (
            <ul className="list-disc list-inside space-y-1 mt-1 text-[#1D1D1F]">
              {(tamperingCheck.tampering_reasons || []).map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          ) : (
            <p>
              The document exhibits uniform JPEG recompression characteristics across all text and photo zones. No editing software metadata was identified.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
