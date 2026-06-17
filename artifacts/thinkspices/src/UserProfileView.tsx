import React, { useState } from "react";
import { User, Building, Award, Calendar, FileText, CheckCircle, ExternalLink, ShieldCheck, MapPin, Layers, Coins, LogOut } from "lucide-react";

interface UserProfileViewProps {
  user: any;
  onLogout: () => void;
  onSelectSavedRfq: (rfq: any) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  onLogout,
  onSelectSavedRfq
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="bg-bg-secondary border border-border-default rounded-xl p-8 text-center space-y-4 max-w-xl mx-auto">
        <h3 className="font-display font-bold text-base text-text-primary uppercase">No Active Sourcing Profile Found</h3>
        <p className="text-xs text-text-secondary">
          Configure secure B2B partner authorizations or sign in via our strategic buyer gate inside the header to trace pricing histories or review formulated RFQs.
        </p>
      </div>
    );
  }

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      
      {/* Page Header section */}
      <div className="space-y-1">
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#A09880] block font-semibold">
          SECURE AUDITED ACCOUNT DESK
        </span>
        <h2 className="font-display font-bold text-xl text-text-primary uppercase tracking-tight">
          BUYER PROFILE & TECHNICAL CORES
        </h2>
      </div>

      {/* Bento Grid Top Section - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Cell 1: Personal Corporate Identity card */}
        <div className="bg-bg-secondary border border-border-default rounded-xl p-6 flex flex-col justify-between shadow-bento h-56 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-gold/5 rounded-full filter blur-xl"></div>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-accent-gold font-bold block mb-3">
              ● PRO-INTEL CREDENTIAL CODE
            </span>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center text-accent-gold font-display font-bold text-base">
                {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-text-primary tracking-wide">
                  {user.name}
                </h3>
                <span className="font-mono text-[10px] text-text-secondary block">
                  {user.email}
                </span>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-text-muted font-mono text-[10px]">
              <Building size={12} className="text-text-secondary" />
              <span>{user.companyName}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border-default/50 flex items-center justify-between">
            <span className="font-mono text-[9px] text-text-muted uppercase">Verification Node ID:</span>
            <button 
              onClick={() => handleCopyId(`MIG-TS-${user.name ? user.name.slice(0,3).toUpperCase() : "BUY"}-2026`)}
              className="font-mono text-[10px] text-accent-gold hover:underline"
            >
              {copiedId ? "Copied CODE!" : `MIG-TS-${user.name ? user.name.slice(0,3).toUpperCase() : "BUY"}-2026`}
            </button>
          </div>
        </div>

        {/* Cell 2: Account Level & Premium tiers card */}
        <div className={`border rounded-xl p-6 flex flex-col justify-between shadow-bento h-56 relative overflow-hidden ${
          user.membershipTier === "ENTERPRISE" 
            ? "border-accent-purple/40 bg-accent-purple/5"
            : user.membershipTier === "PRO"
            ? "border-accent-gold/40 bg-accent-gold/5"
            : "border-border-default bg-bg-secondary"
        }`}>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary font-bold block mb-2">
              B2B MEMBERSHIP PERMITS
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <h4 className={`font-display font-bold text-2xl tracking-tighter ${
                user.membershipTier === "ENTERPRISE" ? "text-accent-purple" : "text-accent-gold"
              }`}>
                {user.membershipTier} BUYER
              </h4>
              <span className="font-mono text-[10px] text-text-muted uppercase">license active</span>
            </div>
            
            <p className="text-[11px] text-text-secondary mt-2 leading-relaxed">
              Provides direct priority access to verified exporter cooperatives, bulk FOB benchmark price series, and SNI code audits.
            </p>
          </div>

          <div className="w-full">
            <button 
              onClick={onLogout}
              className="w-full py-2 px-3 bg-accent-red/10 hover:bg-accent-red text-accent-red hover:text-white border border-accent-red/30 hover:border-accent-red transition-all rounded text-center font-mono text-[9.5px] font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut size={12} />
              <span>Sign Out Securely</span>
            </button>
          </div>
        </div>

        {/* Cell 3: Technical Score Metrics card */}
        <div className="bg-bg-tertiary border border-border-default rounded-xl p-6 flex flex-col justify-between shadow-bento h-56">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted font-bold block mb-2">
              SOURCING TERMINAL INTEL
            </span>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <span className="font-mono text-[17px] font-bold text-text-primary block">
                  {user.savedRfqs ? user.savedRfqs.length : 0}
                </span>
                <span className="font-mono text-[9px] text-text-muted uppercase block">Formulated RFQs</span>
              </div>
              <div>
                <span className="font-mono text-[17px] font-bold text-accent-green block">94%</span>
                <span className="font-mono text-[9px] text-text-muted uppercase block">Avg Spec Match</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border-default/50 font-mono text-[9px] text-text-secondary space-y-1">
            <div className="flex justify-between">
              <span>ACTIVE SYSTEM STATE:</span>
              <span className="text-accent-green font-bold">DECRYPTED</span>
            </div>
            <div className="flex justify-between">
              <span>LOGISTICS DEPLOY:</span>
              <span className="text-accent-blue font-bold">READY TO HANDOFF</span>
            </div>
          </div>
        </div>

      </div>

      {/* RFQ History Card Panel */}
      <div className="bg-bg-secondary border border-border-default rounded-xl p-6 space-y-4 shadow-bento">
        <div className="flex justify-between items-center pb-3 border-b border-border-default/50">
          <div>
            <h3 className="font-display font-bold text-md text-text-primary uppercase tracking-tight">
              Sourcing RFQ Archives
            </h3>
            <p className="font-mono text-[9px] text-text-muted uppercase mt-0.5">
              Secure audited specifications submitted to PT Exporters
            </p>
          </div>
          <span className="font-mono text-[10px] text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded font-bold">
            {user.savedRfqs ? user.savedRfqs.length : 0} ARCHIVED FILINGS
          </span>
        </div>

        {user.savedRfqs && user.savedRfqs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-border-default text-text-secondary text-[10px] uppercase h-10">
                  <th className="font-bold py-2">RFQ Code</th>
                  <th className="font-bold py-2">Date Filings</th>
                  <th className="font-bold py-2">Commodity / Variety</th>
                  <th className="font-bold py-2">Format</th>
                  <th className="font-bold py-2 text-right">Volume</th>
                  <th className="font-bold py-2 text-right">Target FOB</th>
                  <th className="font-bold py-2">Destination Port</th>
                  <th className="font-bold py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {user.savedRfqs.map((rfq: any) => (
                  <tr key={rfq.id} className="border-b border-border-default/50 hover:bg-bg-tertiary/60 transition-colors h-12">
                    <td className="py-2.5 font-bold text-accent-gold">{rfq.id}</td>
                    <td className="py-2.5 text-text-secondary text-[11px]">
                      {new Date(rfq.timestamp).toLocaleDateString([], { month: "short", day: "2-digit", year: "numeric" })}
                    </td>
                    <td className="py-2.5">
                      <span className="text-text-primary uppercase block font-bold">{rfq.commodityName}</span>
                      <span className="text-[10px] text-text-secondary italic block">{rfq.varietyName}</span>
                    </td>
                    <td className="py-2.5">
                      <span className="px-1.5 py-0.5 bg-bg-primary border border-border-default text-text-secondary rounded text-[9px] uppercase font-bold">
                        {rfq.productForm}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-bold text-text-primary">{rfq.volume} MT</td>
                    <td className="py-2.5 text-right font-bold text-accent-gold">${rfq.targetPrice}/kg</td>
                    <td className="py-2.5 text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={10} className="text-text-muted shrink-0" />
                        <span className="truncate max-w-[120px]" title={rfq.destinationPort}>{rfq.destinationPort}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-center">
                      <button
                        onClick={() => onSelectSavedRfq(rfq)}
                        className="p-1 px-2.5 bg-accent-gold/10 hover:bg-accent-gold border border-accent-gold/30 hover:border-accent-gold hover:text-bg-primary text-accent-gold font-bold text-[10px] rounded transition-all"
                      >
                        Inspect RFQ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <FileText size={24} className="text-text-muted mx-auto" />
            <h4 className="font-mono text-xs font-bold text-text-secondary">NO CONTRACT FILES FORMULATED YET</h4>
            <p className="text-[11px] text-text-muted max-w-sm mx-auto">
              Initiate a 7-step Sourcing Discovery journey or formulate custom specs in our sandbox to archive standard-compliant RFQs.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
