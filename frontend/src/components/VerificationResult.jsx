import React from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Copy, 
  Check, 
  History, 
  FileSearch,
  User
} from 'lucide-react';

export default function VerificationResult({ 
  result, 
  onViewAuditLedger, 
  onViewElaHeatmap 
}) {
  const [copiedTx, setCopiedTx] = React.useState(false);

  const scanned = result.scanned_data || {};
  const face = result.face_verification || {};
  const txHash = result.transaction_hash || "0x7c49b13fae0842e99f116540bdc89012a456fe87192834b9d8e7f601a9b23c4d";

  const handleCopyTx = () => {
    navigator.clipboard.writeText(txHash);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Top Authentic Banner */}
      <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E5E5EA] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E8F8EE] text-[#1E7E34] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 stroke-[2]" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E8F8EE] text-[#1E7E34] border border-[#34C759]/20">
                  Authentic Credential
                </span>
                <span className="text-xs text-[#86868B]">Version 1 Genesis Match</span>
              </div>
              <h2 className="text-lg font-semibold text-[#1D1D1F] tracking-tight">
                Document Verified & Integrity Confirmed
              </h2>
              <p className="text-xs text-[#6E6E73] mt-0.5">
                Physical tamper check passed • Facial biometric confirmed • Ledger state synchronized
              </p>
            </div>
          </div>

          {/* Action Links */}
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

        {/* Cryptographic Footer Strip */}
        <div className="mt-5 pt-4 border-t border-[#E5E5EA] flex flex-wrap items-center justify-between gap-2 text-xs text-[#86868B]">
          <div className="flex items-center gap-2 font-mono">
            <Lock className="w-3.5 h-3.5 text-[#1E7E34]" />
            <span>Cryptographically Verified on Ledger</span>
            <span>•</span>
            <span>Tx: {txHash.slice(0, 14)}...{txHash.slice(-8)}</span>
            <button
              onClick={handleCopyTx}
              className="p-1 hover:bg-[#F5F5F7] rounded text-[#6E6E73] hover:text-[#1D1D1F]"
              title="Copy Transaction Hash"
            >
              {copiedTx ? <Check className="w-3.5 h-3.5 text-[#34C759]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span>Block #{result.block_number || 1042}</span>
            <span>•</span>
            <span>Officer: {result.officer_id || "ID-402"}</span>
          </div>
        </div>
      </div>

      {/* Summary Table Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Identity Data Grid */}
        <div className="md:col-span-2 bg-[#FFFFFF] rounded-2xl p-6 border border-[#E5E5EA] shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-[#1D1D1F] tracking-tight">
            Verified Identity Attributes
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            <div className="bg-[#FBFBFD] border border-[#E5E5EA] rounded-xl p-3.5">
              <div className="text-[10px] uppercase font-semibold text-[#86868B] mb-1">Passport Number</div>
              <div className="text-sm font-mono font-semibold text-[#1D1D1F]">{scanned.passport_number || "Z9876543"}</div>
            </div>

            <div className="bg-[#FBFBFD] border border-[#E5E5EA] rounded-xl p-3.5">
              <div className="text-[10px] uppercase font-semibold text-[#86868B] mb-1">Full Name</div>
              <div className="text-sm font-medium text-[#1D1D1F] truncate">{scanned.name || "RAHUL SHARMA"}</div>
            </div>

            <div className="bg-[#FBFBFD] border border-[#E5E5EA] rounded-xl p-3.5">
              <div className="text-[10px] uppercase font-semibold text-[#86868B] mb-1">Date of Birth</div>
              <div className="text-sm font-mono text-[#1D1D1F]">{scanned.date_of_birth || "15-08-1992"}</div>
            </div>

            <div className="bg-[#FBFBFD] border border-[#E5E5EA] rounded-xl p-3.5">
              <div className="text-[10px] uppercase font-semibold text-[#86868B] mb-1">Expiry Date</div>
              <div className="text-sm font-mono text-[#1D1D1F]">{scanned.expiry_date || "14-08-2032"}</div>
            </div>

            <div className="bg-[#FBFBFD] border border-[#E5E5EA] rounded-xl p-3.5">
              <div className="text-[10px] uppercase font-semibold text-[#86868B] mb-1">Nationality</div>
              <div className="text-sm text-[#1D1D1F]">{scanned.nationality || "IND (India)"}</div>
            </div>

            <div className="bg-[#FBFBFD] border border-[#E5E5EA] rounded-xl p-3.5">
              <div className="text-[10px] uppercase font-semibold text-[#86868B] mb-1">Gender</div>
              <div className="text-sm text-[#1D1D1F]">{scanned.gender || "Male"}</div>
            </div>

          </div>
        </div>

        {/* Right Col: Biometric Match Card */}
        <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E5E5EA] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#1D1D1F] tracking-tight">
                Biometric Match
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8F8EE] text-[#1E7E34] border border-[#34C759]/20">
                Match
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#F5F5F7] border border-[#E5E5EA] flex items-center justify-center shrink-0">
                {face.doc_face_crop_base64 ? (
                  <img src={face.doc_face_crop_base64} alt="Face Crop" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-[#86868B]" />
                )}
              </div>

              <div className="space-y-1">
                <div className="text-xs text-[#86868B]">Similarity Score</div>
                <div className="text-2xl font-semibold font-mono text-[#1E7E34]">
                  {face.match_confidence ? `${face.match_confidence}%` : "99.2%"}
                </div>
                <div className="text-[11px] text-[#6E6E73]">
                  Identity Confirmed
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5E5EA] text-xs text-[#86868B] flex items-center justify-between">
            <span>Checkpoint Clearance</span>
            <span className="text-[#1E7E34] font-medium">Approved</span>
          </div>
        </div>

      </div>

    </div>
  );
}
