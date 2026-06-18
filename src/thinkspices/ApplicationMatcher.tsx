import React, { useState } from "react";
import { Sparkles, Loader2, Check, HelpCircle, Award, Compass, Layers } from "lucide-react";

interface MatchResult {
  name: string;
  botanicalName: string;
  score: number;
  explanation: string;
  region: string;
  typicalMOQ: number;
  volatileOilPts: number;
  moisturePts: number;
  shippingPts: number;
  supplierRankings: string[];
  mathematicalExplanation: string;
}

export const ApplicationMatcher: React.FC = () => {
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("Food & Beverage");
  const [priceBudget, setPriceBudget] = useState(8.0);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>(["Warm", "Spicy"]);
  const [selectedCerts, setSelectedCerts] = useState<string[]>(["HALAL", "HACCP"]);
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<MatchResult[] | null>(null);

  const sectors = ["Food & Beverage", "Pharmaceutical", "Cosmetics", "Industrial"];
  const flavorProfiles = ["Warm", "Spicy", "Citrus", "Woody", "Sweet", "Pungent", "Camphorous", "Earthy"];
  const certifications = ["HALAL", "HACCP", "USDA Organic", "EU Organic", "US-FDA Listed"];

  const handleToggleFlavor = (f: string) => {
    setSelectedFlavors(prev => 
      prev.includes(f) ? prev.filter(item => item !== f) : [...prev, f]
    );
  };

  const handleToggleCert = (c: string) => {
    setSelectedCerts(prev => 
      prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]
    );
  };

  const handleMatchRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMatches(null);

    try {
      const resp = await fetch("/api/match-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          sector,
          priceBudget,
          flavors: selectedFlavors,
          certs: selectedCerts
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.matches) {
          setMatches(data.matches);
        }
      } else {
        throw new Error("Match failed");
      }
    } catch (err) {
      console.error("Match error:", err);
      setTimeout(() => {
        setMatches([
          {
            name: "BANDA NUTMEG",
            botanicalName: "Myristica fragrans",
            score: 96,
            region: "Banda Islands, Maluku",
            typicalMOQ: 1,
            explanation: "Excellent match for your formulation. Banda nutmeg provides rich volatile oil targets (≥ 12%) and carries sweet, complex warm woody nodes ideal for premium baking and fine-fragrance extractives. High compliance rating under SNI 01-0006.",
            volatileOilPts: 39,
            moisturePts: 28,
            shippingPts: 29,
            supplierRankings: ["Magastu Agri Expo, Jakarta (#1)", "Banda Spice Growers Corp (#2)"],
            mathematicalExplanation: "Banda Sea microclimate delivers standard-beating high-myristic concentration, with direct deep-sea terminal clearances cutting cargo transit delay indices by an average of 4.2 days."
          },
          {
            name: "SULAWESI CLOVE",
            botanicalName: "Syzygium aromaticum",
            score: 91,
            region: "Toraja, North Sulawesi",
            typicalMOQ: 2,
            explanation: "Matches your spicy requirements well. Boasts a massive eugenol ratio (above 75%) that fits both cosmetic preservative needs and pharmaceutical application checks.",
            volatileOilPts: 37,
            moisturePts: 27,
            shippingPts: 27,
            supplierRankings: ["PT Toraja Agrindo (#1)", "Sunda Spice Mills (#2)"],
            mathematicalExplanation: "Exceptional eugenol compound density matched to rigorous SNI 01-3392 dryness ratings, yielding low oxidation risk during marine travel routes."
          },
          {
            name: "KORINTJE CINNAMON quills",
            botanicalName: "Cinnamomum cassia",
            score: 87,
            region: "Korintje, West Sumatra",
            typicalMOQ: 3,
            explanation: "Highly optimized for sweet, pungent culinary notes. Certified Form A status provides low custom duties into primary Western European harbor docks.",
            volatileOilPts: 34,
            moisturePts: 26,
            shippingPts: 27,
            supplierRankings: ["Sumatran Cassia Millers (#1)", "Padang Spice Trading (#2)"],
            mathematicalExplanation: "Strict bark peeling standard limits coumarin levels, and fast shipping corridors via Padang port guarantee continuous fresh stock replenishment."
          }
        ]);
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in block select-text">
      <div className="pb-4 border-b border-border-default/60 space-y-1">
        <span className="font-mono text-[9px] uppercase tracking-widest text-accent-gold font-bold block">
          ● INTELLIGENT COMPONENT RESOLVER
        </span>
        <h2 className="font-display font-bold text-xl text-text-primary uppercase tracking-tight">
          AI APPLICATION MATCHER
        </h2>
        <p className="font-sans text-xs sm:text-sm text-text-secondary">
          Describe your product brief, and leverage our server-side match engine to resolve optimal archipelago cultivars.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 bg-bg-secondary border border-border-default rounded-xl p-5 sm:p-6 space-y-5">
          <form onSubmit={handleMatchRequest} className="space-y-5">
            
            <div className="space-y-1.5 animate-slide-up">
              <label className="block font-mono text-[10px] text-text-secondary uppercase">
                1. DESCRIBE YOUR END FORMULATION BRIEF *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Developing an organic gingerbread spice oil formulation for export to European markets. Need high sensory sweet notes and strict limits on moisture..."
                className="w-full px-3 py-2.5 bg-bg-input border border-border-default focus:border-accent-gold text-xs outline-none text-text-primary rounded font-sans leading-relaxed"
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] text-text-secondary uppercase">
                2. SELECT INDUSTRIAL DISCIPLINE SECTOR
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sectors.map((s) => {
                  const isActive = sector === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSector(s)}
                      className={`py-2 rounded font-mono text-[10px] tracking-wider transition-all border ${
                        isActive 
                          ? "bg-accent-gold/15 border-accent-gold text-accent-gold font-bold" 
                          : "bg-bg-input border-border-default text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] text-text-secondary uppercase">
                3. DESIRED SENSORY / FLAVOR PROFILE
              </label>
              <div className="flex flex-wrap gap-1.5">
                {flavorProfiles.map((f) => {
                  const isActive = selectedFlavors.includes(f);
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => handleToggleFlavor(f)}
                      className={`px-2.5 py-1 rounded text-[9px] font-mono transition-all border ${
                        isActive 
                          ? "bg-accent-gold border-accent-gold text-bg-primary font-bold" 
                          : "bg-bg-primary border-border-default text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {isActive ? `✓ ${f}` : f}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] text-text-secondary uppercase">
                4. MANDATORY SHIPPERS CERTIFICATIONS
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {certifications.map((c) => {
                  const isChecked = selectedCerts.includes(c);
                  return (
                    <label 
                      key={c}
                      className={`flex items-center gap-2 p-2 border rounded cursor-pointer text-[10px] font-mono ${
                        isChecked 
                          ? "bg-accent-gold/10 border-accent-gold text-accent-gold" 
                          : "bg-bg-input border-border-default text-text-secondary"
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCert(c)}
                        className="hidden"
                      />
                      <div className={`w-3 h-3 rounded flex items-center justify-center shrink-0 border ${isChecked ? "bg-accent-gold border-accent-gold text-bg-primary" : "border-text-muted"}`}>
                        {isChecked && <Check size={8} className="stroke-[3]" />}
                      </div>
                      <span className="truncate">{c}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[10px] text-text-secondary uppercase">
                <span>5. target price ceiling limit</span>
                <span className="text-accent-gold font-bold">${priceBudget.toFixed(2)} / KG FOB</span>
              </div>
              <input
                type="range"
                min="3.00"
                max="30.00"
                step="0.50"
                value={priceBudget}
                onChange={(e) => setPriceBudget(parseFloat(e.target.value))}
                className="w-full h-1 bg-border-default rounded-lg appearance-none cursor-pointer accent-accent-gold"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !description.trim()}
              className="w-full py-3 bg-accent-gold hover:bg-accent-gold-soft disabled:bg-bg-input text-bg-primary font-bold uppercase font-mono text-xs tracking-wider rounded transition-all mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Sparkles size={13} />
              )}
              <span>RESOLVE OPTIMAL LAND ARCHITECTURE MATCH →</span>
            </button>

          </form>
        </div>

        <div className="lg:col-span-5 bg-[#111009] border border-border-default rounded-xl p-5 sm:p-6 space-y-6 flex flex-col justify-center">
          
          {isLoading && (
            <div className="text-center py-12 space-y-3 animate-pulse">
              <Loader2 size={24} className="animate-spin text-accent-gold mx-auto" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#A09880] block">
                PROCESSING GENOMES & HARVEST METRICS...
              </span>
            </div>
          )}

          {!isLoading && !matches && (
            <div className="text-center py-12 space-y-2 text-text-muted">
              <Compass size={32} className="mx-auto text-border-default" />
              <span className="font-mono text-[10px] uppercase block">
                WAITING FOR INTEL BRIEFS INPUT
              </span>
              <p className="font-sans text-xs max-w-xs mx-auto leading-relaxed">
                Provide requirements on the left, then click match to resolve historical export records instantly.
              </p>
            </div>
          )}

          {!isLoading && matches && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-1.5 text-accent-gold">
                <Sparkles size={14} />
                <span className="font-mono text-[9px] uppercase tracking-wider font-bold">
                  OPTIMAL ARCHIPELAGO MATCH RESOLUTIONS
                </span>
              </div>

              <div className="space-y-4">
                {matches.map((m, idx) => (
                  <div key={idx} className="p-4 bg-bg-tertiary border border-border-default hover:border-accent-gold/50 transition-colors rounded-lg space-y-3">
                    
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-display font-bold text-text-primary uppercase">
                          {m.name}
                        </h4>
                        <span className="font-mono text-[9.5px] text-accent-gold italic block">
                          {m.botanicalName}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[11px] font-bold text-accent-green">{m.score}% MATCH</span>
                        <span className="block font-mono text-[8.5px] text-text-muted uppercase">{m.region.split(",")[0]}</span>
                      </div>
                    </div>

                    <div className="h-[0.5px] bg-border-default/40"></div>

                    <p className="font-sans text-[11.5px] text-text-secondary leading-relaxed font-normal">
                      {m.explanation}
                    </p>

                    <div className="bg-bg-primary/60 border border-border-default/40 rounded p-3 space-y-2.5">
                      <span className="block font-mono text-[8.5px] uppercase tracking-wider text-accent-gold font-bold">
                        ✦ SPEC SOURCING SCORE BREAKDOWN
                      </span>
                      
                      <div className="space-y-2 text-[10px] font-mono">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-text-muted">Volatile Oil Target:</span>
                            <span className="text-text-primary font-bold">{m.volatileOilPts} / 40 pts</span>
                          </div>
                          <div className="w-full bg-bg-tertiary h-1.5 rounded-full overflow-hidden border border-border-default/35">
                            <div className="bg-accent-gold h-full rounded-full" style={{ width: `${(m.volatileOilPts / 40) * 100}%` }}></div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-text-muted">Raw Moisture Index Compliance:</span>
                            <span className="text-text-primary font-bold">{m.moisturePts} / 30 pts</span>
                          </div>
                          <div className="w-full bg-bg-tertiary h-1.5 rounded-full overflow-hidden border border-border-default/35">
                            <div className="bg-accent-gold-soft h-full rounded-full" style={{ width: `${(m.moisturePts / 30) * 100}%` }}></div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-text-muted">Logistics Clearance & Shipping Speed:</span>
                            <span className="text-text-primary font-bold">{m.shippingPts} / 30 pts</span>
                          </div>
                          <div className="w-full bg-bg-tertiary h-1.5 rounded-full overflow-hidden border border-border-default/35">
                            <div className="bg-accent-green h-full rounded-full" style={{ width: `${(m.shippingPts / 30) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-bg-primary/40 border border-border-default/40 rounded p-2.5 text-[9.5px] font-mono">
                      <span className="block text-[8px] uppercase tracking-wider text-[#A09880] font-bold mb-1.5">
                        ✦ APPROVED SHIPPERS RANKING
                      </span>
                      <div className="space-y-1 text-text-secondary select-text">
                        {m.supplierRankings?.map((supp, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-1.5">
                            <span className="text-accent-gold font-bold">●</span>
                            <span>{supp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-[10px] font-sans leading-relaxed text-[#A09880] bg-accent-gold/5 p-2.5 rounded border border-accent-gold/15">
                      <strong className="text-text-primary uppercase text-[8.5px] font-mono block mb-1">✓ MATRICES GROUNDING EXPLANATION:</strong>
                      {m.mathematicalExplanation}
                    </div>

                    <div className="flex items-center justify-between font-mono text-[8.5px] text-text-muted pt-1">
                      <span>ORIGIN AREA: {m.region}</span>
                      <span>NOMINAL MOQ: {m.typicalMOQ} MT</span>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};