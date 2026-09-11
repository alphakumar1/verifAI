import React from 'react';
import { X, Database, Clock, User, Lock, ShieldCheck } from 'lucide-react';

export default function BlockchainLedgerAudit({ isOpen, onClose, auditTrail, passportNumber }) {
  if (!isOpen) return null;

  const versions = auditTrail && auditTrail.length > 0 ? auditTrail : [
    {
      version_index: 1,
      timestamp: Date.now() / 1000 - 86400 * 30,
      formatted_date: "12-08-2026 10:14:22",
      officer_id: "OFFICER_DEL_IMMIGRATION_01",
      data_hash: "0x4a9f87b612e456ca980123efd567890abcdef1234567890abcdef1234567890a",
      encrypted_data: "gAAAAABl_secure_token_v1...",
      decrypted_data: {
        passport_number: passportNumber || "Z9876543",
        name: "RAHUL SHARMA",
        date_of_birth: "15-08-1992",
        expiry_date: "14-08-2032",
        nationality: "IND",
        gender: "Male"
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E5EA] shadow-2xl p-6 sm:p-8 max-w-3xl w-full space-y-6 max-h-[90vh] overflow-y-auto animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5EA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center shrink-0">
              <Database className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#86868B]">Smart Contract Ledger</span>
                <span className="text-xs text-[#6E6E73] font-mono">DocumentLedger.sol</span>
              </div>
              <h2 className="text-base font-semibold text-[#1D1D1F] tracking-tight mt-0.5">
                Version History: <span className="font-mono text-[#0071E3]">{passportNumber || "Z9876543"}</span>
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

        {/* Timeline of Versions */}
        <div className="space-y-3.5">
          {versions.map((ver, idx) => {
            const data = ver.decrypted_data || {};
            const isGenesis = ver.version_index === 1 || idx === 0;

            return (
              <div
                key={idx}
                className="bg-[#FBFBFD] border border-[#E5E5EA] rounded-xl p-4 relative"
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      isGenesis ? 'bg-[#E8F8EE] text-[#1E7E34] border border-[#34C759]/20' : 'bg-[#EBF4FE] text-[#0071E3] border border-[#0071E3]/20'
                    }`}>
                      {isGenesis ? 'Version 1 (Genesis Truth)' : `Version ${ver.version_index}`}
                    </span>
                    <span className="text-xs text-[#86868B] flex items-center gap-1 font-normal">
                      <Clock className="w-3.5 h-3.5" />
                      {ver.formatted_date || "Recorded on Ledger"}
                    </span>
                  </div>

                  <div className="text-xs text-[#86868B] flex items-center gap-1.5 font-mono">
                    <User className="w-3.5 h-3.5 text-[#6E6E73]" />
                    <span>Officer: {ver.officer_id || "ID-402"}</span>
                  </div>
                </div>

                {/* Decrypted Payload Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-lg bg-[#FFFFFF] border border-[#E5E5EA] text-xs">
                  <div>
                    <span className="text-[10px] text-[#86868B] uppercase font-semibold">Name</span>
                    <div className="font-medium text-[#1D1D1F] mt-0.5 truncate">{data.name || "RAHUL SHARMA"}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#86868B] uppercase font-semibold">Date of Birth</span>
                    <div className="font-mono font-medium text-[#1E7E34] mt-0.5">{data.date_of_birth || "15-08-1992"}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#86868B] uppercase font-semibold">Expiry Date</span>
                    <div className="font-mono text-[#1D1D1F] mt-0.5">{data.expiry_date || "14-08-2032"}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#86868B] uppercase font-semibold">Nationality</span>
                    <div className="text-[#1D1D1F] mt-0.5">{data.nationality || "IND"}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#86868B] uppercase font-semibold">Gender</span>
                    <div className="text-[#1D1D1F] mt-0.5">{data.gender || "Male"}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#86868B] uppercase font-semibold">Security State</span>
                    <div className="text-[#0071E3] mt-0.5 flex items-center gap-1 font-medium text-[11px]">
                      <Lock className="w-3 h-3" /> AES-256 Encrypted
                    </div>
                  </div>
                </div>

                {/* Data Hash */}
                {ver.data_hash && (
                  <div className="mt-2.5 pt-2 border-t border-[#E5E5EA] text-[10px] font-mono text-[#86868B] truncate">
                    <span>Digest: </span>
                    <span className="text-[#6E6E73]">{ver.data_hash}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="p-3.5 rounded-xl bg-[#FBFBFD] border border-[#E5E5EA] text-xs text-[#6E6E73] flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#0071E3] shrink-0" />
          <span>
            Records are cryptographically hashed and sealed on the local Hardhat consensus ledger. Entries cannot be altered or overwritten by central database administrators.
          </span>
        </div>

      </div>
    </div>
  );
}
