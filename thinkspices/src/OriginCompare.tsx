import React, { useState } from "react";
import { COMMODITIES, Commodity, Variety } from "./mockData";
import { Scale, Info, Check, HelpCircle, Compass } from "lucide-react";

export const OriginCompare: React.FC = () => {
  // Select first commodity map entries as defaults
  const [commId1, setCommId1] = useState("nutmeg");
  const [varietyId1, setVarietyId1] = useState("banda-nutmeg");

  const [commId2, setCommId2] = useState("nutmeg");
  const [varietyId2, setVarietyId2] = useState("papua-nutmeg");

  const comm1 = COMMODITIES.find(c => c.id === commId1) || COMMODITIES[0];
  const var1 = comm1.varieties.find(v => v.id === varietyId1) || comm1.varieties[0];

  const comm2 = COMMODITIES.find(c => c.id === commId2) || COMMODITIES[0];
  const var2 = comm2.varieties.find(v => v.id === varietyId2) || comm2.varieties[0];

  const handleComm1Change = (id: string) => {
    setCommId1(id);
    const selected = COMMODITIES.find(c => c.id === id) || COMMODITIES[0];
    setVarietyId1(selected.varieties[0]?.id || "");
  };

  const handleComm2Change = (id: string) => {
    setCommId2(id);
    const selected = COMMODITIES.find(c => c.id === id) || COMMODITIES[0];
    setVarietyId2(selected.varieties[0]?.id || "");
  };

  // Compare highlighting helper
  const isDifferent = (val1: any, val2: any) => {
    return String(val1).trim().toLowerCase() !== String(val2).trim().toLowerCase();
  };

  return (
    <div className="space-y-8 animate-fade-in block select-text">
      {/* Header element */}
      <div className="pb-4 border-b border-border-default/60 space-y-1">
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#B37D1E] font-bold block">
          ● SIDE-BY-SIDE SPECS ANALYSIS
        </span>
        <h2 className="font-display font-bold text-xl text-text-primary uppercase tracking-tight">
          ARCHIPELAGO ORIGIN COMPARE
        </h2>
        <p className="font-sans text-xs sm:text-sm text-text-secondary">
          Conduct side-by-side analytical audits of chemical compound profiles and delivery terms across multiple archipelago cultivars.
        </p>
      </div>

      {/* Select selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left selector */}
        <div className="bg-bg-secondary p-5 border border-border-default rounded-xl space-y-4">
          <span className="font-mono text-[9px] uppercase tracking-wider text-accent-gold font-bold block">
            ● REPRESENTATIVE VARIETY A
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-mono text-[9px] text-[#A09880] uppercase">Commodity</label>
              <select
                value={commId1}
                onChange={(e) => handleComm1Change(e.target.value)}
                className="w-full bg-bg-input border border-border-default rounded text-xs font-mono text-text-primary px-2 py-1.5 focus:outline-none focus:border-accent-gold cursor-pointer"
              >
                {COMMODITIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-mono text-[9px] text-[#A09880] uppercase">Cultivar Variety</label>
              <select
                value={varietyId1}
                onChange={(e) => setVarietyId1(e.target.value)}
                className="w-full bg-bg-input border border-border-default rounded text-xs font-mono text-text-primary px-2 py-1.5 focus:outline-none focus:border-accent-gold cursor-pointer"
              >
                {comm1.varieties.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right selector */}
        <div className="bg-bg-secondary p-5 border border-border-default rounded-xl space-y-4">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#3498DB] font-bold block">
            ● REPRESENTATIVE VARIETY B
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-mono text-[9px] text-[#A09880] uppercase">Commodity</label>
              <select
                value={commId2}
                onChange={(e) => handleComm2Change(e.target.value)}
                className="w-full bg-bg-input border border-border-default rounded text-xs font-mono text-text-primary px-2 py-1.5 focus:outline-none focus:border-accent-gold cursor-pointer"
              >
                {COMMODITIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-mono text-[9px] text-[#A09880] uppercase">Cultivar Variety</label>
              <select
                value={varietyId2}
                onChange={(e) => setVarietyId2(e.target.value)}
                className="w-full bg-bg-input border border-border-default rounded text-xs font-mono text-text-primary px-2 py-1.5 focus:outline-none focus:border-accent-gold cursor-pointer"
              >
                {comm2.varieties.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Comparison table matrix */}
      <div className="bg-bg-secondary border border-border-default rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse min-w-[520px]">
          <thead>
            <tr className="border-b border-border-default bg-[#100F0A] h-11 text-text-secondary">
              <th className="p-4 uppercase w-1/4 font-bold text-[10px] text-white">PARAMETER SPECIFICATION</th>
              <th className="p-4 uppercase w-3/8 font-semibold text-[10px] text-accent-gold">VARIETY A: {var1.name}</th>
              <th className="p-4 uppercase w-3/8 font-semibold text-[10px] text-[#3498DB]">VARIETY B: {var2.name}</th>
            </tr>
          </thead>
          <tbody>
            
            {/* Row 1: Botanical Name */}
            <tr className="border-b border-border-default/50 h-11 hover:bg-bg-tertiary/10">
              <td className="p-4 text-text-muted">BOTANICAL TAXONOMY</td>
              <td className="p-4 italic text-text-primary font-bold">{var1.botanicalName}</td>
              <td className="p-4 italic text-text-primary font-bold">{var2.botanicalName}</td>
            </tr>

            {/* Row 2: Region */}
            <tr className={`border-b border-border-default/50 h-11 hover:bg-bg-tertiary/10 ${isDifferent(var1.origin, var2.origin) ? "bg-accent-gold/5" : ""}`}>
              <td className="p-4 text-text-muted">PROVINCIAL ORIGIN</td>
              <td className="p-4 text-text-primary">{var1.origin}</td>
              <td className="p-4 text-text-primary">{var2.origin}</td>
            </tr>

            {/* Row 3: Volatile extract */}
            <tr className={`border-b border-border-default/50 h-11 hover:bg-bg-tertiary/10 ${isDifferent(var1.volatileOil, var2.volatileOil) ? "bg-accent-gold/5" : ""}`}>
              <td className="p-4 text-text-muted">VOLATILE OIL / PURITY</td>
              <td className="p-4 text-accent-gold font-bold">{var1.volatileOil}</td>
              <td className="p-4 text-[#3498DB] font-bold">{var2.volatileOil}</td>
            </tr>

            {/* Row 4: Moisture */}
            <tr className={`border-b border-border-default/50 h-11 hover:bg-bg-tertiary/10 ${isDifferent(var1.moistureLimit, var2.moistureLimit) ? "bg-accent-gold/5" : ""}`}>
              <td className="p-4 text-text-muted">MOISTURE VALUE LIMIT</td>
              <td className="p-4 text-text-primary">{var1.moistureLimit}</td>
              <td className="p-4 text-text-primary">{var2.moistureLimit}</td>
            </tr>

            {/* Row 5: Active compound */}
            <tr className={`border-b border-border-default/50 h-11 hover:bg-bg-tertiary/10 ${isDifferent(var1.activeMarker, var2.activeMarker) ? "bg-accent-gold/5" : ""}`}>
              <td className="p-4 text-text-muted">ACTIVE CHEMICAL MARKER</td>
              <td className="p-4 text-text-primary">{var1.activeMarker}</td>
              <td className="p-4 text-text-primary">{var2.activeMarker}</td>
            </tr>

            {/* Row 6: Minimum ordering MOQ */}
            <tr className={`border-b border-border-default/50 h-11 hover:bg-bg-tertiary/10 ${isDifferent(var1.minMOQ, var2.minMOQ) ? "bg-accent-gold/5" : ""}`}>
              <td className="p-4 text-text-muted">MINIMUM EXPORT MOQ</td>
              <td className="p-4 text-text-primary font-bold">{var1.minMOQ} Metric Tons</td>
              <td className="p-4 text-text-primary font-bold">{var2.minMOQ} Metric Tons</td>
            </tr>

            {/* Row 7: Base Benchmark Avg FOB price */}
            <tr className={`border-b border-border-default/50 h-11 hover:bg-bg-tertiary/10 ${isDifferent(comm1.avgFobBenchmark, comm2.avgFobBenchmark) ? "bg-accent-gold/5" : ""}`}>
              <td className="p-4 text-text-muted">AVG FOB BENCHMARK INDEX</td>
              <td className="p-4 text-accent-gold font-bold">${comm1.avgFobBenchmark.toLocaleString()}/MT</td>
              <td className="p-4 text-[#3498DB] font-bold">${comm2.avgFobBenchmark.toLocaleString()}/MT</td>
            </tr>

            {/* Row 8: Available Trade certs */}
            <tr className="border-b border-border-default/50 h-11 hover:bg-bg-tertiary/10">
              <td className="p-4 text-text-muted">APPROVED EXPORT CERTS</td>
              <td className="p-4">
                <div className="flex flex-wrap gap-1">
                  {var1.certifications.map(c => (
                    <span key={c} className="text-[9px] bg-bg-primary px-1.5 py-0.5 rounded text-text-secondary">{c}</span>
                  ))}
                </div>
              </td>
              <td className="p-4">
                <div className="flex flex-wrap gap-1">
                  {var2.certifications.map(c => (
                    <span key={c} className="text-[9px] bg-bg-primary px-1.5 py-0.5 rounded text-text-secondary">{c}</span>
                  ))}
                </div>
              </td>
            </tr>

            {/* Row 9: Flavor profile list text */}
            <tr className="h-14 hover:bg-bg-tertiary/10">
              <td className="p-4 text-text-muted pt-3">AROMATIC & SENSORY INDEX</td>
              <td className="p-4 text-text-secondary font-sans leading-relaxed text-[11px] pt-3">{var1.aromaticProfile}</td>
              <td className="p-4 text-text-secondary font-sans leading-relaxed text-[11px] pt-3">{var2.aromaticProfile}</td>
            </tr>

          </tbody>
        </table>
      </div>

      <div className="p-4 border border-accent-gold bg-accent-gold/5 rounded-xl flex items-center gap-3">
        <Scale size={18} className="text-accent-gold shrink-0" />
        <p className="font-mono text-[10px] text-[#A09880] uppercase tracking-wide leading-relaxed">
          *HIGHLIGHT LEGEND: ROW VALUES WITH GOLD/AMBER BACKGROUND OVERLAYS REPRESENT SIGNIFICANT CHEMICAL STRENGTH OR TRANSACTION BOUNDARY DISCREPANCIES DETECTED BETWEEN SELECTED ARCHIPELAGO ORIGINS.
        </p>
      </div>

    </div>
  );
};
