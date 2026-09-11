import React from 'react';
import { 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  History, 
  FileSearch,
  Database
} from 'lucide-react';

export default function TamperingDiffView({ 
  result, 
  onViewAuditLedger, 
  onViewElaHeatmap 
}) {
  const diff = result.diff_details || {};
  const mismatches = diff.mismatches || [];
  const scannedData = diff.tampered_scanned_data || result.scanned_data || {};
  const originalTruth = diff.original_blockchain_data || result.ground_truth_version_1 || {};

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Clean Alert Banner */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E5E5EA] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FEECEC] text-[#D70015] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 stroke-[2]" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FEECEC] text-[#D70015] border border-[#FF3B30]/20">
                  Tampering Detected
                </span>
                <span className="text-xs text-[#86868B]">Ledger Mismatch</span>
              </div>
              <h2 className="text-lg font-semibold text-[#1D1D1F] tracking-tight">
                Scanned document does not match blockchain history
              </h2>
              <p className="text-xs text-[#6E6E73] mt-0.5">
                Central database or physical document attributes conflict with the immutable Version 1 genesis record.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onViewAuditLedger}
              className="px-4 py-2 rounded-full bg-[#F5F5F7] hover:bg-[#E5E5EA] text-xs font-medium text-[#1D1D1F] border border-[#E5E5EA] transition-colors flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5" /> Ledger History
            </button>
            <button
              onClick={onViewElaHeatmap}
              className="px-4 py-2 rounded-full bg-[#F5F5F7] hover:bg-[#E5E5EA] text-xs font-medium text-[#1D1D1F] border border-[#E5E5EA] transition-colors flex items-center gap-1.5"
            >
              <FileSearch className="w-3.5 h-3.5" /> ELA Analysis
            </button>
          </div>

        </div>

        <div className="mt-4 pt-3 border-t border-[#E5E5EA] flex items-center justify-between text-xs text-[#86868B]">
          <span className="text-[#D70015] font-medium">
            {diff.summary || "1 field discrepancy caught by immutable cross-check."}
          </span>
          <span className="font-mono text-[#1D1D1F]">
            Passport ID: {result.passport_number}
          </span>
        </div>
      </div>

      {/* SIDE-BY-SIDE CLEAN DIFF VIEW (DEAD SIMPLE TO UNDERSTAND IN 3 SECONDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Column 1: Scanned Document (Tampered) */}
        <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E5E5EA] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EA]">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-[#D70015] stroke-[2]" />
              <h3 className="text-sm font-semibold text-[#1D1D1F] tracking-tight">
                Scanned Document (Current)
              </h3>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#FEECEC] text-[#D70015] border border-[#FF3B30]/20">
              Unverified / Modified
            </span>
          </div>

          <div className="space-y-2.5">
            
            {/* Passport No */}
            <div className="bg-[#FBFBFD] border border-[#E5E5EA] rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-[#86868B]">Passport Number</span>
              <span className="text-xs font-mono font-medium text-[#1D1D1F]">{scannedData.passport_number || result.passport_number}</span>
            </div>

            {/* Name */}
            <div className="bg-[#FBFBFD] border border-[#E5E5EA] rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-[#86868B]">Full Name</span>
              <span className="text-xs font-medium text-[#1D1D1F]">{scannedData.name || "RAHUL SHARMA"}</span>
            </div>

            {/* Date of Birth (Conflict Highlighted in Soft Red Pill) */}
            <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              mismatches.some(m => m.field.toLowerCase().includes("birth"))
                ? 'bg-[#FEECEC] border-[#FF3B30]/30'
                : 'bg-[#FBFBFD] border-[#E5E5EA]'
            }`}>
              <div>
                <div className="text-[10px] uppercase font-semibold text-[#86868B]">Date of Birth</div>
                <div className={`text-sm font-mono font-semibold mt-0.5 ${
                  mismatches.some(m => m.field.toLowerCase().includes("birth")) ? 'text-[#D70015]' : 'text-[#1D1D1F]'
                }`}>
                  {scannedData.date_of_birth || "01-01-2000"}
                </div>
              </div>
              {mismatches.some(m => m.field.toLowerCase().includes("birth")) && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[#D70015] border border-[#FF3B30]/30 shadow-xs">
                  Modified
                </span>
              )}
            </div>

            {/* Expiry Date */}
            <div className="bg-[#FBFBFD] border border-[#E5E5EA] rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-[#86868B]">Expiry Date</span>
              <span className="text-xs font-mono text-[#1D1D1F]">{scannedData.expiry_date || "14-08-2032"}</span>
            </div>

            {/* Nationality */}
            <div className="bg-[#FBFBFD] border border-[#E5E5EA] rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-[#86868B]">Nationality</span>
              <span className="text-xs text-[#1D1D1F]">{scannedData.nationality || "IND"}</span>
            </div>

          </div>

          <div className="p-3 bg-[#FBFBFD] rounded-xl border border-[#E5E5EA] text-xs text-[#6E6E73]">
            Notice: Current scan carries a fabricated date of birth not present in the government ledger.
          </div>
        </div>

        {/* Column 2: Original Blockchain Record (Genesis Truth) */}
        <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E5E5EA] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EA]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1E7E34] stroke-[2]" />
              <h3 className="text-sm font-semibold text-[#1D1D1F] tracking-tight">
                Original Blockchain Record (Version 1)
              </h3>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#E8F8EE] text-[#1E7E34] border border-[#34C759]/20">
              Immutable Truth
            </span>
          </div>

          <div className="space-y-2.5">
            
            {/* Passport No */}
            <div className="bg-[#FBFBFD] border border-[#E5E5EA] rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-[#86868B]">Passport Number</span>
              <span className="text-xs font-mono font-medium text-[#1D1D1F]">{originalTruth.passport_number || result.passport_number}</span>
            </div>

            {/* Name */}
            <div className="bg-[#FBFBFD] border border-[#E5E5EA] rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-[#86868B]">Full Name</span>
              <span className="text-xs font-medium text-[#1D1D1F]">{originalTruth.name || "RAHUL SHARMA"}</span>
            </div>

            {/* Date of Birth (Genesis Truth in Soft Green Pill) */}
            <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              mismatches.some(m => m.field.toLowerCase().includes("birth"))
                ? 'bg-[#E8F8EE] border-[#34C759]/30'
                : 'bg-[#FBFBFD] border-[#E5E5EA]'
            }`}>
              <div>
                <div className="text-[10px] uppercase font-semibold text-[#86868B]">Original Date of Birth</div>
                <div className={`text-sm font-mono font-semibold mt-0.5 ${
                  mismatches.some(m => m.field.toLowerCase().includes("birth")) ? 'text-[#1E7E34]' : 'text-[#1D1D1F]'
                }`}>
                  {originalTruth.date_of_birth || "15-08-1992"}
                </div>
              </div>
              {mismatches.some(m => m.field.toLowerCase().includes("birth")) && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FFFFFF] text-[#1E7E34] border border-[#34C759]/30 shadow-xs">
                  Genesis Truth
                </span>
              )}
            </div>

            {/* Expiry Date */}
            <div className="bg-[#FBFBFD] border border-[#E5E5EA] rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-[#86868B]">Expiry Date</span>
              <span className="text-xs font-mono text-[#1D1D1F]">{originalTruth.expiry_date || "14-08-2032"}</span>
            </div>

            {/* Nationality */}
            <div className="bg-[#FBFBFD] border border-[#E5E5EA] rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-[#86868B]">Nationality</span>
              <span className="text-xs text-[#1D1D1F]">{originalTruth.nationality || "IND"}</span>
            </div>

          </div>

          <div className="p-3 bg-[#FBFBFD] rounded-xl border border-[#E5E5EA] text-xs text-[#6E6E73] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#0071E3]" />
              Cryptographic seal verified on smart contract
            </span>
            <span className="font-mono text-[#1D1D1F]">Hardhat Node</span>
          </div>
        </div>

      </div>

      {/* Discrepancy Explanation Box */}
      {mismatches.length > 0 && (
        <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E5E5EA] shadow-sm space-y-3">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-[#86868B]">
            Officer Discrepancy Log
          </h4>
          <div className="space-y-2">
            {mismatches.map((m, idx) => (
              <div key={idx} className="p-3 bg-[#FBFBFD] rounded-xl border border-[#E5E5EA] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#1D1D1F]">{m.field}: </span>
                  <span className="text-[#6E6E73]">{m.reason}</span>
                </div>
                <span className="text-xs font-semibold text-[#D70015] bg-[#FEECEC] px-2.5 py-0.5 rounded-full border border-[#FF3B30]/20 shrink-0 ml-3">
                  Flagged
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
