import React from "react";
import { BookOpen, Scale, ShieldCheck, Landmark, FileCheck } from "lucide-react";

export const SourcingLibrary: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in block select-text">
      {/* Header element */}
      <div className="pb-4 border-b border-border-default/60 space-y-1">
        <span className="font-mono text-[9px] uppercase tracking-widest text-accent-gold font-bold block">
          ● ARCHIPELAGO REGULATORY STANDARDS
        </span>
        <h2 className="font-display font-bold text-xl text-text-primary uppercase tracking-tight">
          BOTANICAL SOURCING LIBRARY
        </h2>
        <p className="font-sans text-xs sm:text-sm text-text-secondary">
          Trade frameworks, chemical thresholds, and custom inspection standards applicable to dry agricultural spice imports out of Indonesia.
        </p>
      </div>

      {/* Grid structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1 */}
        <div className="bg-bg-secondary border border-border-default hover:border-accent-gold/40 transition-colors p-6 rounded-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#3498DB]/10 text-[#3498DB] flex items-center justify-center">
              <Scale size={20} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-xs text-text-primary uppercase tracking-wider">
                SNI (STANDAR NASIONAL INDONESIA) COMPLIANCE
              </h3>
              <span className="font-mono text-[9px] text-text-muted">
                REGULATORY CODE: SNI-ARCH-01
              </span>
            </div>
          </div>
          <p className="font-sans text-xs text-text-secondary leading-relaxed font-normal">
            Every batch of dried nutmeg, cassia quills, and cloves processed for container shipping must conform strictly to SNI standards (Standard SNI 01-0004 for cloves moisture limits, SNI 01-0006 for nutmeg sizing limits). Prioritize certifications verifying maximum 12% moisture limits.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-bg-secondary border border-border-default hover:border-accent-gold/40 transition-colors p-6 rounded-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-accent-gold/10 text-accent-gold flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-xs text-text-primary uppercase tracking-wider">
                PHYTOSANITARY CERTIFICATION FOR COLD CARGO
              </h3>
              <span className="font-mono text-[9px] text-text-muted">
                REGULATORY CODE: BARANTIN-PHYTOSAN-40
              </span>
            </div>
          </div>
          <p className="font-sans text-xs text-text-secondary leading-relaxed font-normal">
            Compulsory certificates are administered by the Indonesian Quarantine Authority (BARANTIN). This verification acts as international proof that bulk botanical cargo was fully fumigated against typical storage wood-boring pests and contains zero living insects.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-bg-secondary border border-border-default hover:border-accent-gold/40 transition-colors p-6 rounded-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#2ECC71]/10 text-accent-green flex items-center justify-center">
              <FileCheck size={20} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-xs text-text-primary uppercase tracking-wider">
                EU TYPE / FDA REGISTRATION COUPLING
              </h3>
              <span className="font-mono text-[9px] text-text-muted">
                REGULATORY CODE: EU-FDA-REG-03
              </span>
            </div>
          </div>
          <p className="font-sans text-xs text-text-secondary leading-relaxed font-normal">
            In accordance with global compliance, dry spices shipping to US markets must carry the shipper&apos;s FDA Food Facility Registration Number, while European destinations hold strict maximum limits for aflatoxin residuals and heavy chemical markers.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-bg-secondary border border-border-default hover:border-[#9B59B6]/40 transition-colors p-6 rounded-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#9B59B6]/10 text-[#9B59B6] flex items-center justify-center">
              <Landmark size={20} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-xs text-text-primary uppercase tracking-wider">
                PREFERENTIAL TARIFF ORIGIN (FORM A / FORM D)
              </h3>
              <span className="font-mono text-[9px] text-text-muted">
                REGULATORY CODE: CO-TARI-F7
              </span>
            </div>
          </div>
          <p className="font-sans text-xs text-text-secondary leading-relaxed font-normal">
            Sourcing managers can request Indonesian Certificate of Origin Certificate Form A (under International Generalized System of Preferences GSP) to qualify for extremely favorable preferential tariff custom rates at final destinations.
          </p>
        </div>

      </div>

      {/* Guide Banner */}
      <div className="p-5 border border-border-default bg-bg-secondary rounded-xl flex items-start gap-4 shadow-sm">
        <BookOpen className="text-accent-gold shrink-0 mt-0.5" size={18} />
        <div className="space-y-1">
          <h4 className="font-display font-semibold text-xs text-text-primary uppercase tracking-wider">
            Need Dedicated Custom Testing parameters?
          </h4>
          <p className="font-sans text-xs text-text-secondary leading-relaxed max-w-2xl font-normal">
            ThinkSpices™ regularly updates regulatory thresholds on deep botanical genomes. Use the <strong>AI Sourcing Assistant</strong> at any time to request compound threshold checks for specific regional cooperatives.
          </p>
        </div>
      </div>

    </div>
  );
};
