import React, { useState, useEffect } from "react";
import { Layers, CheckCircle2, Award, Zap, ShieldCheck } from "lucide-react";

interface SpecSourcingScoreProps {
  onGoToTab: (tab: any) => void;
}

export const SpecSourcingScore: React.FC<SpecSourcingScoreProps> = ({
  onGoToTab
}) => {
  const [moisture, setMoisture] = useState<number>(10);
  const [volatileOil, setVolatileOil] = useState<number>(12);
  const [selectedCerts, setSelectedCerts] = useState<string[]>(["HALAL", "HACCP"]);

  const certOptions = ["HALAL", "HACCP", "USDA Organic", "US-FDA", "KOSHER"];

  const handleToggleCert = (cert: string) => {
    setSelectedCerts(prev => 
      prev.includes(cert) 
        ? prev.filter(c => c !== cert) 
        : [...prev, cert]
    );
  };

  // Reactive score algorithm based on user constraints
  const calculatedScore = (() => {
    let score = 90;

    // Moisture penalty (Ideal is <= 12%)
    if (moisture > 12) {
      score -= (moisture - 12) * 8; // heavy scale drop
    } else {
      score += (12 - moisture) * 1; // minor reward for extreme dryness
    }

    // Volatile oil rewards (Higher is better, premium BANDA is >= 12%)
    if (volatileOil >= 12) {
      score += (volatileOil - 12) * 1.5;
    } else {
      score -= (12 - volatileOil) * 2;
    }

    // Cert achievements bonus
    score += selectedCerts.length * 2.5;

    // Bound between 10 & 100
    return Math.max(10, Math.min(100, Math.round(score)));
  })();

  const getComplianceLabel = (score: number) => {
    if (score >= 90) return "PREMIUM ARCHIPELAGO COMPLIANCE APPROVED";
    if (score >= 75) return "STANDARD EXPORT QUALITY APPROVED";
    return "WARNING: OUTSIDE STANDARD EXPORT BOUNDARIES";
  };

  return (
    <div className="space-y-8 animate-fade-in block select-text">
      {/* Header element */}
      <div className="pb-4 border-b border-border-default/60 space-y-1">
        <span className="font-mono text-[9px] uppercase tracking-widest text-accent-gold font-bold block">
          ● CHEMICAL PARAMETER VERIFIER
        </span>
        <h2 className="font-display font-bold text-xl text-text-primary uppercase tracking-tight">
          SPEC SOURCING SCORE™ CRITERIA PROTOCOL
        </h2>
        <p className="font-sans text-xs sm:text-sm text-text-secondary">
          Assess chemical boundaries and verify custom procurement specifications against Standar Nasional Indonesia (SNI) quality standards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive controls */}
        <div className="lg:col-span-7 bg-bg-secondary border border-border-default rounded-xl p-5 sm:p-6 space-y-6">
          <div className="flex items-center gap-2 text-text-primary font-mono text-xs font-bold uppercase pb-2 border-b border-border-default/50">
            <Zap size={14} className="text-accent-gold" />
            <span>SPEC BOUNDARY SIMULATION SANDBOX</span>
          </div>

          <div className="space-y-6">
            
            {/* Slider 1: Moisture target */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline font-mono text-[11px]">
                <label className="text-text-primary uppercase">1. MOISTURE LEVEL CONSTRAINT TARGET (%)</label>
                <span className="text-accent-gold font-bold text-xs">{moisture}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                step="0.5"
                value={moisture}
                onChange={(e) => setMoisture(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-bg-primary rounded-lg appearance-none cursor-pointer accent-accent-gold"
              />
              <div className="flex justify-between font-mono text-[9px] text-text-muted">
                <span>(DRY CRITERIA TARGETS)</span>
                <span>(SNI target norm: ≤ 12%)</span>
              </div>
            </div>

            {/* Slider 2: Volatile target */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline font-mono text-[11px]">
                <label className="text-text-primary uppercase">2. VOLATILE OIL TARGET YIELD RATIO (%)</label>
                <span className="text-accent-gold font-bold text-xs">{volatileOil}%</span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                step="0.5"
                value={volatileOil}
                onChange={(e) => setVolatileOil(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-bg-primary rounded-lg appearance-none cursor-pointer accent-accent-gold"
              />
              <div className="flex justify-between font-mono text-[9px] text-text-muted">
                <span>(EXTRACT POTENCY TARGETS)</span>
                <span>(Banda nutmeg volatile norm: ≥ 12%)</span>
              </div>
            </div>

            {/* Certifications Checklist Select */}
            <div className="space-y-3 pt-2">
              <label className="block font-mono text-[11px] text-text-primary uppercase">
                3. AUTHORIZED CERTIFICATIONS TARGET CONSTRAINTS
              </label>

              <div className="flex flex-wrap gap-2">
                {certOptions.map(cert => {
                  const isActive = selectedCerts.includes(cert);
                  return (
                    <button
                      key={cert}
                      onClick={() => handleToggleCert(cert)}
                      className={`px-3 py-1.5 rounded text-[10px] font-mono tracking-wider transition-all border ${
                        isActive 
                          ? "bg-accent-gold/15 border-accent-gold text-accent-gold font-bold" 
                          : "bg-bg-primary border-border-default text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {cert}
                    </button>
                  );
                })}
              </div>
              <span className="block font-mono text-[9px] text-text-muted">
                *Multi-select certificates to qualify supplier shipping docks for global ports.
              </span>
            </div>

          </div>
        </div>

        {/* Right Column: Contrast Amber Score panel */}
        <div className="lg:col-span-5 bg-[#FDF6E3] text-[#111009] rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div className="text-center space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#5D5245] block font-bold">
              SIMULATION CONFIDENCE VECTOR
            </span>

            {/* Active gauge donut circle */}
            <div className="flex justify-center py-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    className="stroke-[#E6DFD3] fill-none"
                    strokeWidth="11"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    className="stroke-[#111009] fill-none transition-all duration-300"
                    strokeWidth="11"
                    strokeDasharray={427}
                    strokeDashoffset={427 - (427 * calculatedScore) / 100}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-display font-bold text-4xl text-[#111009]">
                    {calculatedScore}%
                  </span>
                  <span className="font-mono text-[10px] text-[#5D5245]">Sourcing Score</span>
                </div>
              </div>
            </div>

            <div className="inline-block bg-[#111009] text-[#FDF6E3] font-mono text-[10px] px-3.5 py-1.5 rounded uppercase font-bold tracking-wider">
              {calculatedScore >= 90 ? "PREMIUM grade match" : calculatedScore >= 75 ? "commercial match" : "OUTSIDE EXPORT NORM"}
            </div>
          </div>

          <p className="font-sans text-xs text-[#5D5245] leading-relaxed text-center font-medium max-w-sm mx-auto">
            {getComplianceLabel(calculatedScore)}. Sourcing Score balances chemical moisture ratios, extraction ratios, and available trade certification frameworks seamlessly.
          </p>
        </div>

      </div>

      {/* Sourcing reference guidelines display */}
      <div className="space-y-4">
        <h3 className="font-mono text-xs text-[#A09880] uppercase tracking-wider">
          TOP DEFIANT GRADES UNDER SIMULATED SCENARIO
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-bg-secondary border border-border-default hover:border-accent-gold transition-colors p-4 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-display font-medium text-xs text-text-primary uppercase tracking-tight block">Banda Nutmeg Special</span>
              <span className="font-mono text-[9px] text-[#A09880]">Myristica fragrans</span>
            </div>
            <span className="font-mono font-bold text-xs text-accent-gold">91 / 100</span>
          </div>

          <div className="bg-bg-secondary border border-border-default hover:border-accent-gold transition-colors p-4 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-display font-medium text-xs text-text-primary uppercase tracking-tight block">Sulawesi Clove Premium</span>
              <span className="font-mono text-[9px] text-[#A09880]">Syzygium aromaticum</span>
            </div>
            <span className="font-mono font-bold text-xs text-accent-gold">88 / 100</span>
          </div>

          <div className="bg-bg-secondary border border-border-default hover:border-accent-gold transition-colors p-4 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-display font-medium text-xs text-text-primary uppercase tracking-tight block">Emprit White Ginger</span>
              <span className="font-mono text-[9px] text-[#A09880]">Zingiber officinale</span>
            </div>
            <span className="font-mono font-bold text-xs text-accent-gold">87 / 100</span>
          </div>

        </div>
      </div>
    </div>
  );
};
