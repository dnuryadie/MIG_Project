import React, { useState } from "react";
import { EXPORTERS, Exporter, COMMODITIES } from "./mockData";
import { Users, Filter, Award, ShieldCheck, HelpCircle, MapPin, Search } from "lucide-react";

interface VerifiedSuppliersProps {
  onSelectExporter: (exporterId: string) => void;
  onGoToTab: (tab: any) => void;
}

export const VerifiedSuppliers: React.FC<VerifiedSuppliersProps> = ({
  onSelectExporter,
  onGoToTab
}) => {
  const [filterCommodity, setFilterCommodity] = useState("all");
  const [filterCert, setFilterCert] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [minEqi, setMinEqi] = useState<number>(80);
  const [searchQuery, setSearchQuery] = useState("");

  const allCerts = ["HACCP", "USDA Organic", "EU Organic", "US-FDA Listed", "KOSHER", "Halal", "ISO 22000", "Fairtrade International", "Rainforest Alliance", "GI Protected Banda Nutmeg"];
  const regions = ["Semarang", "Banda", "Padang", "Surabaya"];

  const filteredExporters = EXPORTERS.filter((exp) => {
    // 1. Commodity Filter
    if (filterCommodity !== "all" && !exp.primaryCommodities.includes(filterCommodity.toUpperCase())) {
      return false;
    }
    // 2. Cert Filter
    if (filterCert !== "all" && !exp.certifications.includes(filterCert)) {
      return false;
    }
    // 3. Region Filter
    if (filterRegion !== "all" && !exp.hub.toLowerCase().includes(filterRegion.toLowerCase())) {
      return false;
    }
    // 4. EQI Filter
    if (exp.eqi < minEqi) {
      return false;
    }
    // 5. Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchesName = exp.name.toLowerCase().includes(q);
      const matchesHub = exp.hub.toLowerCase().includes(q);
      if (!matchesName && !matchesHub) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in block select-text">
      {/* Header zone */}
      <div className="pb-4 border-b border-border-default/60 space-y-1">
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#B37D1E] font-bold block">
          ● VERIFIED INDONESIAN EXPORTER RECORDS
        </span>
        <h2 className="font-display font-bold text-xl text-text-primary uppercase tracking-tight">
          AUTHORIZED EXPORTERS DIRECTORY
        </h2>
        <p className="font-sans text-xs sm:text-sm text-text-secondary">
          Direct access directory of verified agricultural cooperatives and shipping ventures audited under global Trade Architecture parameters.
        </p>
      </div>

      {/* Advanced Filter bar */}
      <div className="bg-bg-secondary border border-border-default rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-text-primary font-mono text-xs font-bold uppercase mb-2">
          <Filter size={14} className="text-accent-gold" />
          <span>FILTER CONTROLLER PARAMETERS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Commodity */}
          <div className="space-y-1">
            <label className="block font-mono text-[9px] text-[#A09880] uppercase">Filter by Spice Family</label>
            <select
              value={filterCommodity}
              onChange={(e) => setFilterCommodity(e.target.value)}
              className="w-full bg-bg-input border border-border-default rounded text-[11px] font-mono text-text-primary px-2.5 py-1.5 focus:outline-none focus:border-accent-gold cursor-pointer"
            >
              <option value="all">ALL FAMILIES</option>
              {COMMODITIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Certification */}
          <div className="space-y-1">
            <label className="block font-mono text-[9px] text-[#A09880] uppercase">Required Certification</label>
            <select
              value={filterCert}
              onChange={(e) => setFilterCert(e.target.value)}
              className="w-full bg-bg-input border border-border-default rounded text-[11px] font-mono text-text-primary px-2.5 py-1.5 focus:outline-none focus:border-accent-gold cursor-pointer"
            >
              <option value="all">ALL CERTIFICATIONS</option>
              {allCerts.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Origin Hub */}
          <div className="space-y-1">
            <label className="block font-mono text-[9px] text-[#A09880] uppercase">Origin Harbor Hub</label>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="w-full bg-bg-input border border-border-default rounded text-[11px] font-mono text-text-primary px-2.5 py-1.5 focus:outline-none focus:border-accent-gold cursor-pointer"
            >
              <option value="all">ALL HARBORS</option>
              {regions.map(r => (
                <option key={r} value={r}>{r} Ports</option>
              ))}
            </select>
          </div>

          {/* EQi Range */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[9px] text-[#A09880] uppercase">
              <span>Min Exporter EQI™</span>
              <span className="text-accent-gold font-bold">{minEqi}/100</span>
            </div>
            <input
              type="range"
              min="80"
              max="95"
              step="1"
              value={minEqi}
              onChange={(e) => setMinEqi(parseInt(e.target.value))}
              className="w-full h-1 bg-border-default rounded-lg appearance-none cursor-pointer accent-accent-gold"
            />
          </div>

        </div>

        {/* Text search */}
        <div className="relative pt-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audited shipping cooperatives or private labels..."
            className="w-full bg-bg-input border border-border-default rounded text-xs font-mono text-text-primary px-8.5 py-2.5 focus:outline-none focus:border-accent-gold"
          />
          <Search size={14} className="absolute left-3 top-4 text-text-muted" />
        </div>
      </div>

      {/* Exporters Catalogue Results */}
      <div className="space-y-4">
        {filteredExporters.length === 0 ? (
          <div className="border border-border-default bg-bg-secondary p-8 text-center rounded-xl font-mono text-xs text-text-muted">
            NO VERIFIED COOPERATIVES MATCH THE CONFIGURED COMPLIANCE CODES. <br />
            TRY RELAXING THE EXPORTER QUALITY INDEX (EQI™) MINIMUM THRESHOLD.
          </div>
        ) : (
          filteredExporters.map((exp) => (
            <div 
              key={exp.id}
              className="border border-border-default bg-bg-secondary hover:bg-bg-tertiary/70 rounded-xl p-5 sm:p-6 transition-all duration-150 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-sm"
            >
              {/* Left Column: Details */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-display font-semibold text-sm text-text-primary uppercase tracking-wide">
                    {exp.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 bg-[#2ECC71]/15 text-accent-green px-2 py-0.5 rounded text-[9px] font-mono tracking-wider font-bold border border-[#2ECC71]/10 shrink-0">
                    <ShieldCheck size={11} /> ✓ EXPORT VERIFIED
                  </span>
                  <span className="font-mono text-xs bg-bg-primary px-2.5 py-0.5 rounded border border-border-default shrink-0">
                    EQI™ Score: <strong className="text-accent-gold font-extrabold">{exp.eqi}</strong>
                  </span>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] font-mono text-text-secondary pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-text-muted" />
                    <span>{exp.hub}</span>
                  </div>
                  <div>
                    <span>Export Experience: <strong className="text-text-primary">{exp.experienceYears} Years</strong></span>
                  </div>
                  <div>
                    <span>Primary MOQ Limit: <strong className="text-text-primary">{exp.moq} MT</strong></span>
                  </div>
                  <div>
                    <span>Secured Escrows: <strong className="text-accent-gold-soft font-bold text-[9px]">{exp.contractType}</strong></span>
                  </div>
                </div>

                {/* Primary commodities and export markets */}
                <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-[10px] font-mono text-text-muted pt-1">
                  <div>
                    <span className="text-[8px] uppercase block">PREMIUM COMMODITIES:</span>
                    <span className="text-text-primary">{exp.primaryCommodities.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase block">EXPORT CHANNELS ESTABLISHED:</span>
                    <span className="text-text-primary">{exp.exportMarkets.join(", ")}</span>
                  </div>
                </div>

                {/* Certs list */}
                <div className="flex flex-wrap gap-1 pt-1.5">
                  {exp.certifications.map((c, idx) => (
                    <span key={idx} className="bg-bg-primary border border-border-default text-text-secondary text-[9px] font-mono px-2 py-0.5 rounded">
                      {c}
                    </span>
                  ))}
                </div>

                {/* PRIORITY 6 & 7 — SUPPLIER INTELLIGENCE CO-OPERATIVE LAYERS */}
                {(() => {
                  const intelAdvisory = exp.name.toLowerCase().includes("banda") || exp.hub.toLowerCase().includes("banda")
                    ? {
                        risk: "NEGLIGIBLE — Sovereign co-backed cooperative lots in deepsea temperature-controlled silos.",
                        negotiation: "Strict cooperative pricing floors. Request volume-based packaging customization (>10 MT) to waive marine export fees.",
                        dispatch: "99.2% on-time dispatch rate from Maluku ports."
                      }
                    : exp.name.toLowerCase().includes("padang") || exp.hub.toLowerCase().includes("padang")
                    ? {
                        risk: "MEDIUM RISK — Sumatran monsoon rainfall may delay highway transit. Include wet moisture density penalties.",
                        negotiation: "Insist on strict 11.5% maximum moisture benchmarks. Escrow 10% of total payment value state-locked until SGS pre-loading certificates clear.",
                        dispatch: "96.5% dispatch reliability index during peak rainy season."
                      }
                    : exp.name.toLowerCase().includes("java") || exp.hub.toLowerCase().includes("semarang")
                    ? {
                        risk: "LOW RISK — Audited modern consolidated warehouse facilities with electronic humidity sensors.",
                        negotiation: "High active stock inventory. High likelihood of securing -3.5% below market spot clearance for orders with immediate T/T cash payouts.",
                        dispatch: "98.4% container port transit velocity."
                      }
                    : {
                        risk: "LOW RISK — Audited standard private label dispatchers with fully bonded storage facilities.",
                        negotiation: "FOB Semarang. Request free-of-charge custom grade-sorting on high-volume spot lots (>12 MT).",
                        dispatch: "98.1% shipment boarding reliability profile."
                      };

                  return (
                    <div className="mt-3 p-3 bg-bg-primary/50 border border-border-default rounded-lg grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] font-mono animate-fade-in select-text">
                      <div className="space-y-1">
                        <span className="block text-[8px] tracking-wider text-accent-red font-bold uppercase">📊 B2B RISK LEVEL</span>
                        <p className="text-text-secondary leading-relaxed font-sans">{intelAdvisory.risk}</p>
                      </div>
                      <div className="space-y-1 border-t md:border-t-0 md:border-l border-border-default/40 pt-2 md:pt-0 md:pl-3">
                        <span className="block text-[8px] tracking-wider text-accent-gold font-bold uppercase">✦ NEGOTIATION INTEL</span>
                        <p className="text-text-secondary leading-relaxed font-sans">{intelAdvisory.negotiation}</p>
                      </div>
                      <div className="space-y-1 border-t md:border-t-0 md:border-l border-border-default/40 pt-2 md:pt-0 md:pl-3">
                        <span className="block text-[8px] tracking-wider text-accent-green font-bold uppercase">⚓ DISPATCH RELIABILITY</span>
                        <p className="text-text-secondary leading-relaxed font-sans">{intelAdvisory.dispatch}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Right Column: Score indicators and CTA button */}
              <div className="shrink-0 flex flex-row lg:flex-col items-end gap-4 w-full lg:w-auto border-t lg:border-t-0 border-border-default/40 pt-4 lg:pt-0 justify-between">
                
                {/* Visual EQI Breakdown bars */}
                <div className="space-y-1 w-full lg:w-32 hidden md:block">
                  <span className="block font-mono text-[8px] text-text-muted text-right uppercase">
                    EQI™ BREAKDOWN:
                  </span>
                  <div className="flex items-center justify-between text-[9px] font-mono text-text-muted">
                    <span>Certs:</span> <span className="text-text-primary font-bold">{exp.eqiBreakdown.certifications}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-text-muted">
                    <span>Fulfill:</span> <span className="text-text-primary font-bold">{exp.eqiBreakdown.fulfillment}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-text-muted">
                    <span>Satisfy:</span> <span className="text-text-primary font-bold">{exp.eqiBreakdown.satisfaction}%</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectExporter(exp.id);
                    onGoToTab("discovery-wizard");
                  }}
                  className="px-4 py-2.5 bg-accent-gold hover:bg-accent-gold-soft text-bg-primary font-bold font-mono text-xs uppercase rounded transition-all flex items-center gap-1 shrink-0 shadow-md ml-auto"
                >
                  <span>SOURCE COMMODITY</span>
                  <span>→</span>
                </button>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
