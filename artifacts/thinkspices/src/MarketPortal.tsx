import React, { useState, useEffect } from "react";
import { 
  COMMODITIES, 
  Commodity, 
  HARVEST_CALENDAR, 
  MONTHS 
} from "./mockData";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { 
  Calendar, 
  TrendingUp, 
  Info, 
  CheckCircle2,
  X,
  RefreshCw,
  Sliders,
  DollarSign,
  Activity,
  AlertTriangle
} from "lucide-react";
import { fetchFXRates, FxResult } from "./fx";
import { stripMarkdown } from "./stripMarkdown";

export const MarketPortal: React.FC = () => {
  const [selectedCommId, setSelectedCommId] = useState("nutmeg");
  const [fxRates, setFxRates] = useState<FxResult | null>(null);
  const [isRefreshingFx, setIsRefreshingFx] = useState(false);
  
  // High fidelity regional commodity map state
  const [selectedRegion, setSelectedRegion] = useState("Maluku");
  
  // Interactive Modal state for harvest details
  const [harvestModal, setHarvestModal] = useState<{
    isOpen: boolean;
    commodityName: string;
    month: string;
    status: string;
  } | null>(null);

  const selectedComm = COMMODITIES.find(c => c.id === selectedCommId) || COMMODITIES[0];

  // Load FX rates on mount and set auto refresh
  useEffect(() => {
    fetchFXRates().then(setFxRates);
    const interval = setInterval(() => {
      fetchFXRates().then(setFxRates);
    }, 60 * 60 * 1000); // 1 hour
    return () => clearInterval(interval);
  }, []);

  const handleManualFxRefresh = async () => {
    setIsRefreshingFx(true);
    const rates = await fetchFXRates();
    setFxRates(rates);
    setTimeout(() => setIsRefreshingFx(false), 500);
  };

  const getHarvestStatusInfo = (code: string) => {
    switch (code) {
      case "P": return { label: "Peak Harvest Rate", color: "text-[#27AE60] bg-[#27AE60]/10 border-[#27AE60]/20", dotColor: "bg-[#27AE60]" };
      case "M": return { label: "Mid Harvest Transition", color: "text-[#F39C12] bg-[#F39C12]/10 border-[#F39C12]/20", dotColor: "bg-[#F39C12]" };
      case "O": return { label: "Off Season Cycle", color: "text-text-secondary bg-bg-tertiary border-border-default", dotColor: "bg-border-default" };
      case "R": return { label: "Restricted Sourcing Window", color: "text-accent-red bg-accent-red/10 border-accent-red/20", dotColor: "bg-accent-red" };
      default: return { label: "Unknown Code", color: "", dotColor: "" };
    }
  };

  const getHarvestCellColor = (code: string) => {
    switch (code) {
      case "P": return "bg-[#27AE60] text-white font-bold";
      case "M": return "bg-[#F39C12] text-white font-bold";
      case "O": return "bg-bg-tertiary text-text-muted border border-border-default/40";
      case "R": return "bg-[#E74C3C] text-white font-bold animate-pulse";
      default: return "";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "HIGH RESERVE": return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/25";
      case "MED RESERVE": return "bg-amber-500/10 text-amber-600 border border-amber-500/25";
      case "LOW RESERVE": return "bg-orange-500/10 text-orange-600 border border-orange-500/25";
      case "CRITICAL": return "bg-red-500/10 text-red-600 border border-red-500/25 animate-pulse";
      default: return "bg-bg-tertiary text-text-neutral";
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      
      {/* Page Header */}
      <div className="pb-5 border-b border-border-default flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent-gold font-bold block">
            ● MARKET INTELLIGENCE HUB
          </span>
          <h2 className="font-display font-bold text-2xl text-text-primary uppercase tracking-tight">
            MARKET DATA
          </h2>
          <span className="text-xs text-text-secondary font-mono tracking-tight block">
            Harvest Outlook · Indicative FOB Prices · Supply Availability
          </span>
        </div>
        
        {/* Short Status Banner */}
        <div className="font-mono text-[10px] bg-bg-secondary border border-border-default rounded px-3 py-1.5 flex items-center gap-2 text-text-secondary self-start md:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse"></span>
          <span>JAKARTA HUB: ACTIVE &amp; DISPATCHING</span>
        </div>
      </div>

      {/* ==============================================
          SECTION A — HARVEST OUTLOOK
          ============================================== */}
      <section className="bg-bg-secondary border border-border-default rounded-xl p-5 sm:p-6 space-y-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-accent-gold">
            <Calendar size={18} />
            <h3 className="font-display font-bold text-md uppercase tracking-tight text-text-primary">
              HARVEST OUTLOOK
            </h3>
          </div>
          <p className="font-sans text-xs text-text-secondary leading-relaxed">
            Indonesian archipelago agricultural peak maturity and off-season mapping across 9 priority spice commodities.
          </p>
        </div>

        {/* Calendar Grid Container */}
        <div className="overflow-x-auto border border-border-default/60 rounded-xl bg-bg-primary/25 p-2">
          <table className="w-full text-left font-mono text-[10px] select-none min-w-[700px]">
            <thead>
              <tr className="border-b border-border-default/60 h-10 text-text-secondary">
                <th className="py-2 px-3 font-medium uppercase min-w-[150px]">COMMODITY</th>
                {MONTHS.map(m => (
                  <th key={m} className="py-2 text-center uppercase font-medium">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMMODITIES.map(c => (
                <tr key={c.id} className="border-b border-border-default/40 h-10 hover:bg-bg-tertiary/20 transition-colors">
                  <td className="py-2 px-3 font-bold text-text-primary uppercase tracking-wide">
                    {c.name}
                  </td>
                  {MONTHS.map((m, idx) => {
                    const code = HARVEST_CALENDAR[c.id]?.[idx] || "O";
                    return (
                      <td key={m} className="p-0.5">
                        <button
                          onClick={() => {
                            setHarvestModal({
                              isOpen: true,
                              commodityName: c.name,
                              month: m,
                              status: code
                            });
                          }}
                          className={`w-full py-2.5 rounded text-[10px] text-center font-bold tracking-wider outline-none hover:opacity-85 transition-opacity ${getHarvestCellColor(code)} cursor-pointer`}
                          title={`Inspect ${c.name} - ${m}`}
                        >
                          {code}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend block below grid */}
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 text-[10px] font-mono border-t border-border-default/50 pt-4 text-text-secondary justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#27AE60] inline-block"></span> 🟢 P: Peak Harvest
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#F39C12] inline-block"></span> 🟡 M: Mid Harvest Season
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-bg-tertiary inline-block border border-border-default"></span> ⬜ O: Off Season Yields
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#E74C3C] inline-block"></span> 🔴 R: Restricted Supply Sourcing
            </span>
          </div>
          <span className="text-text-muted italic">*Click on cells to audit localized cooperative sourcing data forecasts.</span>
        </div>
      </section>

      {/* ==============================================
          SECTION B — INDICATIVE FOB PRICES
          ============================================== */}
      <section className="bg-bg-secondary border border-border-default rounded-xl p-5 sm:p-6 space-y-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-accent-gold">
            <TrendingUp size={18} />
            <h3 className="font-display font-bold text-md uppercase tracking-tight text-text-primary">
              INDICATIVE FOB PRICES
            </h3>
          </div>
          <p className="font-sans text-xs text-text-secondary leading-relaxed">
            6-month dry contract FOB benchmark index per commodity variety. Free-On-Board Indonesian sea ports.
          </p>
        </div>

        {/* Commodity selectors row */}
        <div className="flex flex-wrap gap-1 bg-bg-primary/50 p-1 border border-border-default/60 rounded-lg">
          {COMMODITIES.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCommId(c.id)}
              className={`px-3 py-1.5 rounded text-[10px] font-mono tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedCommId === c.id 
                  ? "bg-bg-secondary border border-accent-gold text-accent-gold font-bold shadow-sm" 
                  : "border border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/30"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.colorCode }}></span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart Container */}
          <div className="lg:col-span-8 border border-border-default/60 rounded-xl p-4 bg-bg-primary/10 flex flex-col justify-between space-y-4">
            <div className="flex flex-col">
              <span className="font-mono text-[9px] uppercase tracking-wider text-accent-gold font-bold">
                {selectedComm.name} HISTORICAL 6-MONTH PRICE CHART (USD / KG)
              </span>
              <span className="text-[10px] text-text-secondary mt-0.5 font-mono">
                FOB Commodity variety baseline benchmark index
              </span>
            </div>

            <div className="h-60 w-full text-xs font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedComm.fobPriceHistory} margin={{ top: 10, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" />
                  <XAxis dataKey="month" stroke="var(--color-text-muted)" />
                  <YAxis stroke="var(--color-text-muted)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "var(--color-bg-secondary)", borderColor: "var(--color-accent-gold)", borderRadius: "6px" }}
                    labelStyle={{ color: "var(--color-text-primary)", fontWeight: "bold" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="var(--color-accent-gold)" 
                    strokeWidth={2.5} 
                    activeDot={{ r: 6 }}
                    dot={{ fill: "var(--color-accent-gold)", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 bg-bg-tertiary/70 border border-border-default/60 rounded-lg flex justify-between items-center flex-wrap gap-2 text-[10px] font-mono">
              <span className="text-text-secondary font-bold uppercase">CURRENT INDICATIVE EXPORT RANGE:</span>
              <span className="text-text-primary font-bold">
                FOB Spot Avg: <span className="text-accent-gold">${selectedComm.avgFobBenchmark.toLocaleString()}/MT</span>
                <span className="text-text-muted font-normal"> (${(selectedComm.avgFobBenchmark/1000).toFixed(2)}/KG)</span>
              </span>
            </div>
          </div>

          {/* Currency Panel & Exchange updates */}
          <div className="lg:col-span-4 border border-border-default/60 rounded-xl p-4 bg-bg-primary/10 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary font-bold block">
                  B2B FX RATIO TICKER
                </span>
                <button
                  onClick={handleManualFxRefresh}
                  disabled={isRefreshingFx}
                  className="p-1 rounded border border-border-default bg-bg-secondary hover:bg-bg-tertiary text-text-secondary hover:text-accent-gold transition-colors flex items-center justify-center cursor-pointer"
                  title="Force re-fetch hourly index"
                >
                  <RefreshCw size={10} className={isRefreshingFx ? "animate-spin" : ""} />
                </button>
              </div>

              <div className="space-y-2.5 font-mono">
                <div className="flex items-center justify-between p-2.5 bg-bg-secondary border border-border-default rounded">
                  <span className="text-[10px] text-text-secondary block">USD / IDR</span>
                  <div className="text-right">
                    <span className="text-accent-gold font-bold text-xs select-all">
                      {fxRates ? fxRates.IDR.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "17,623.50"}
                    </span>
                    <span className="block text-[8px] text-accent-green leading-none font-bold mt-0.5">
                      {fxRates?.IDR_change || "+0.32%"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-bg-secondary border border-border-default rounded">
                  <span className="text-[10px] text-text-secondary block">EUR / IDR</span>
                  <div className="text-right">
                    <span className="text-text-primary font-bold text-xs">
                      {fxRates ? (fxRates.IDR / fxRates.EUR).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "19,156.20"}
                    </span>
                    <span className="block text-[8px] text-accent-red leading-none font-bold mt-0.5">
                      {fxRates?.EUR_change || "-0.11%"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-bg-secondary border border-border-default rounded">
                  <span className="text-[10px] text-text-secondary block">SGD / IDR</span>
                  <div className="text-right">
                    <span className="text-text-primary font-bold text-xs">
                      {fxRates ? (fxRates.IDR / fxRates.SGD).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "13,150.40"}
                    </span>
                    <span className="block text-[8px] text-accent-green leading-none font-bold mt-0.5">
                      {fxRates?.SGD_change || "+0.08%"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Source verification badge */}
              <div className="flex items-center justify-between">
                <span className="block text-[8px] text-text-muted">
                  PROVIDER: {fxRates?.source === "LIVE" ? "SWIFT FEED LIVE" : "CACHED BANK REPO"}
                </span>
                <span className={`px-1 rounded text-[8px] font-bold ${
                  fxRates?.source === "LIVE" ? "bg-accent-green/10 text-accent-green" : "bg-accent-amber/10 text-accent-amber"
                }`}>
                  ● {fxRates?.source || "LIVE"}
                </span>
              </div>
            </div>

            <div className="space-y-2 border-t border-border-default/50 pt-3">
              <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary font-bold block">
                RESERVE QUORUM LEVEL
              </span>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded ${getStatusBadgeColor(selectedComm.supplyStatus)}`}>
                  {selectedComm.supplyStatus}
                </span>
                <span className="font-mono text-[9px] text-text-muted">
                  {selectedComm.supplyIndex}% aggregate index
                </span>
              </div>
              <p className="font-sans text-[10px] text-text-secondary leading-normal italic">
                "{selectedComm.advisoryText}"
              </p>
            </div>
          </div>
        </div>

        <p className="font-sans text-[10px] text-text-muted leading-relaxed max-w-2xl">
          Rates sourced from commercial SWIFT data aggregators. Updated hourly. For contract locking, always verify with your bank's telegraphic transfer rate.
        </p>
      </section>

      {/* ==============================================
          SECTION B.5 — INTERACTIVE ARCHIPELAGO REGIONAL MAP
          ============================================== */}
      <section className="bg-bg-secondary border border-border-default rounded-xl p-5 sm:p-6 space-y-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-accent-gold">
            <span className="font-mono text-base">🗺️</span>
            <h3 className="font-display font-bold text-md uppercase tracking-tight text-text-primary">
              ARCHIPELAGO REGIONAL COMMODITY MAP
            </h3>
          </div>
          <p className="font-sans text-xs text-text-secondary leading-relaxed">
            Click on active sourcing co-ordinates across the major island chains to audit local cultivation telemetry, average moisture index ranges, and harbor customs clearance metrics.
          </p>
        </div>

        {/* map visualizer */}
        {(() => {
          const regionsData: Record<string, {
            name: string;
            majorSpices: string[];
            moistureAverage: string;
            essentialOilAvg: string;
            customsClearanceSpeed: string;
            activeCooperatives: number;
            harvestWindow: string;
          }> = {
            Sumatra: {
              name: "Sumatran Highlands",
              majorSpices: ["Korintje Cinnamon", "Lampung Black Pepper"],
              moistureAverage: "11.2% (Dry grade standard)",
              essentialOilAvg: "2.8% - 3.4% Cinnamaldehyde Density",
              customsClearanceSpeed: "3.2 Days via Padang Port Corridor",
              activeCooperatives: 48,
              harvestWindow: "April - September"
            },
            Java: {
              name: "Java Maritime Corridor",
              majorSpices: ["Blended Commodity Lots", "Jakarta Trade Logistics"],
              moistureAverage: "12.0% (Warehoused lots)",
              essentialOilAvg: "Standard commercial grade",
              customsClearanceSpeed: "2.5 Days via Tanjung Priok terminal",
              activeCooperatives: 15,
              harvestWindow: "Year-Round Consolidated Logistics"
            },
            Sulawesi: {
              name: "Sulawesi Volcanic Ridges",
              majorSpices: ["Toraja cloves", "Sulawesi nutmeg"],
              moistureAverage: "10.8% (Air-dried standard)",
              essentialOilAvg: "18.5% - 21.0% Eugenol density",
              customsClearanceSpeed: "4.1 Days via Makassar seaport gateway",
              activeCooperatives: 32,
              harvestWindow: "July - October"
            },
            Maluku: {
              name: "Banda Sea islands (Maluku)",
              majorSpices: ["Banda Sea Nutmeg", "Ambon Gold Cloves"],
              moistureAverage: "9.5% (Optimal sun-dried standard)",
              essentialOilAvg: "≥ 12.0% volatile oil index",
              customsClearanceSpeed: "2.8 Days direct marine vessel handover",
              activeCooperatives: 62,
              harvestWindow: "June - December"
            },
            Papua: {
              name: "West Papua Valleys",
              majorSpices: ["Papua Wild Nutmeg", "Jayapura Mace"],
              moistureAverage: "13.4% (Thick shell standard)",
              essentialOilAvg: "8.5% volatile density",
              customsClearanceSpeed: "5.0 Days (Coastal barge shuttle lines)",
              activeCooperatives: 27,
              harvestWindow: "August - January"
            }
          };

          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 bg-bg-primary/30 border border-border-default/60 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden min-h-[300px]">
                {/* Ambient map labels */}
                <span className="block text-[8px] font-mono text-text-muted absolute top-3 left-4">
                  INDONESIAN ARCHIPELAGO SOURCING CENTERS GPS: 0.7893° S, 113.9213° E
                </span>

                {/* SVG MAP */}
                <svg viewBox="0 0 800 320" className="w-full h-auto select-none" id="indonesia-svg-vector-map">
                  {/* Equator Line */}
                  <line x1="10" y1="140" x2="790" y2="140" stroke="var(--color-accent-gold)" strokeWidth="0.5" strokeDasharray="5 5" className="opacity-25" />
                  <text x="20" y="132" fill="var(--color-accent-gold)" className="font-mono text-[8.5px] opacity-30 uppercase">EQUATORIAL BELT 0° 00' 00"</text>

                  {/* Sumatra Island Shape */}
                  <g 
                    onClick={() => setSelectedRegion("Sumatra")}
                    className={`cursor-pointer transition-all duration-300 hover:opacity-100 ${selectedRegion === "Sumatra" ? "text-accent-gold opacity-100 fill-accent-gold/20" : "text-[#8A8165]/40 opacity-75 fill-transparent hover:text-accent-gold hover:opacity-90"}`}
                  >
                    <path d="M50,80 L140,160 L170,190 L150,205 L110,180 L30,95 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <circle cx="100" cy="130" r="5" className="fill-accent-gold animate-pulse text-accent-gold" />
                    <text x="112" y="134" className="font-mono text-[9.5px] font-bold" fill="var(--color-text-primary)">SUMATRA</text>
                  </g>

                  {/* Java Island Shape */}
                  <g 
                    onClick={() => setSelectedRegion("Java")}
                    className={`cursor-pointer transition-all duration-300 hover:opacity-100 ${selectedRegion === "Java" ? "text-accent-gold opacity-100 fill-accent-gold/20" : "text-[#8A8165]/40 opacity-75 fill-transparent hover:text-accent-gold hover:opacity-90"}`}
                  >
                    <path d="M175,205 L230,210 L350,215 L360,225 L190,218 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <circle cx="220" cy="211" r="5" className="fill-accent-gold text-accent-gold" />
                    <text x="230" y="226" className="font-mono text-[9.5px] font-bold" fill="var(--color-text-primary)">JAVA</text>
                  </g>

                  {/* Sulawesi Island Shape */}
                  <g 
                    onClick={() => setSelectedRegion("Sulawesi")}
                    className={`cursor-pointer transition-all duration-300 hover:opacity-100 ${selectedRegion === "Sulawesi" ? "text-accent-gold opacity-100 fill-accent-gold/20" : "text-[#8A8165]/40 opacity-75 fill-transparent hover:text-accent-gold hover:opacity-90"}`}
                  >
                    <path d="M370,110 L390,110 L400,140 L450,140 L420,160 L435,200 L405,180 L385,200 L395,160 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <circle cx="410" cy="150" r="5" className="fill-accent-gold text-accent-gold" />
                    <text x="420" y="154" className="font-mono text-[9.5px] font-bold" fill="var(--color-text-primary)">SULAWESI</text>
                  </g>

                  {/* Maluku Islands Group */}
                  <g 
                    onClick={() => setSelectedRegion("Maluku")}
                    className={`cursor-pointer transition-all duration-300 hover:opacity-100 ${selectedRegion === "Maluku" ? "text-accent-gold opacity-100" : "text-[#8A8165]/40 opacity-75 hover:text-accent-gold hover:opacity-90"}`}
                  >
                    <circle cx="500" cy="120" r="4" stroke="currentColor" strokeWidth="1.5" className="fill-transparent" />
                    <circle cx="530" cy="140" r="4.5" stroke="currentColor" strokeWidth="1.5" className="fill-transparent" />
                    <circle cx="515" cy="165" r="5" className="fill-accent-gold stroke-accent-gold text-accent-gold animate-pulse" />
                    <circle cx="545" cy="175" r="4.2" stroke="currentColor" strokeWidth="1.5" className="fill-transparent" />
                    <text x="535" y="160" className="font-mono text-[9.5px] font-bold shadow-sm" fill="var(--color-text-primary)">MALUKU (BANDA)</text>
                  </g>

                  {/* Papua Island Segment */}
                  <g 
                    onClick={() => setSelectedRegion("Papua")}
                    className={`cursor-pointer transition-all duration-300 hover:opacity-100 ${selectedRegion === "Papua" ? "text-accent-gold opacity-100 fill-accent-gold/20" : "text-[#8A8165]/40 opacity-75 fill-transparent hover:text-accent-gold hover:opacity-90"}`}
                  >
                    <path d="M600,135 L620,100 L665,140 L730,135 L750,205 L640,210 L600,165 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <circle cx="640" cy="150" r="5" className="fill-accent-gold text-accent-gold" />
                    <text x="650" y="154" className="font-mono text-[9.5px] font-bold" fill="var(--color-text-primary)">PAPUA</text>
                  </g>

                  {/* Kalimantan Background reference shape only */}
                  <g className="text-border-default opacity-20 fill-transparent stroke-[1]">
                    <path d="M250,95 L340,75 L370,115 L350,180 L270,180 L240,135 Z" stroke="currentColor" strokeDasharray="4 4" />
                    <text x="270" y="130" className="font-mono text-[9px] tracking-widest text-text-muted">KALIMANTAN</text>
                  </g>
                </svg>
              </div>

              {/* Right Detail Panel for Selected Map coordinates */}
              <div className="lg:col-span-5 bg-bg-primary/20 border border-border-default/60 rounded-xl p-5 space-y-4 font-mono text-xs shadow-sm select-text">
                <div className="space-y-1 pb-2 border-b border-border-default/50">
                  <span className="text-[9px] uppercase tracking-widest text-accent-gold font-bold">
                    ✦ SELECTED ROUTING COORDINATES:
                  </span>
                  <h4 className="font-display font-bold text-base text-text-primary uppercase tracking-tight">
                    {regionsData[selectedRegion].name} Snap
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-text-secondary uppercase text-[8.5px] tracking-wider text-text-muted">Major Cultivated Spices:</span>
                    <span className="text-text-primary font-bold">
                      {regionsData[selectedRegion].majorSpices.join(", ")}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-0.5">
                    <span className="text-text-secondary uppercase text-[8.5px] tracking-wider text-text-muted">Avg. Spot Moisture Index:</span>
                    <span className="text-text-primary font-bold">{regionsData[selectedRegion].moistureAverage}</span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-text-secondary uppercase text-[8.5px] tracking-wider text-text-muted">Compound Oil Density (Volatile):</span>
                    <span className="text-accent-gold font-bold">{regionsData[selectedRegion].essentialOilAvg}</span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-text-secondary uppercase text-[8.5px] tracking-wider text-text-muted">Port Customs Dispatch Velocity:</span>
                    <span className="text-[#27AE60] font-bold">{regionsData[selectedRegion].customsClearanceSpeed}</span>
                  </div>

                  <div className="flex justify-between items-center bg-bg-primary/40 border border-border-default/40 p-2 rounded">
                    <span className="text-text-secondary uppercase text-[8.5px] text-text-muted">Registered Cooperatives:</span>
                    <span className="text-text-primary font-bold text-xs">{regionsData[selectedRegion].activeCooperatives} Coops</span>
                  </div>

                  <div className="flex justify-between items-center bg-bg-primary/40 border border-border-default/40 p-2 rounded">
                    <span className="text-text-secondary uppercase text-[8.5px] text-text-muted">Peak Sourcing Cycle:</span>
                    <span className="text-accent-gold font-bold text-xs">{regionsData[selectedRegion].harvestWindow}</span>
                  </div>
                </div>

                <div className="pt-1.5">
                  <span className="text-[10px] text-text-muted italic leading-relaxed block">
                    * Interactive Archipelago Sourcing: Select regional nodes on the map to audit telemetry indicators directly.
                  </span>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ==============================================
          SECTION C — SUPPLY AVAILABILITY
          ============================================== */}
      <section className="bg-bg-secondary border border-border-default rounded-xl p-5 sm:p-6 space-y-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-accent-gold">
            <Sliders size={18} />
            <h3 className="font-display font-bold text-md uppercase tracking-tight text-text-primary">
              SUPPLY AVAILABILITY INDEX
            </h3>
          </div>
          <p className="font-sans text-xs text-text-secondary leading-relaxed">
            Aggregate reserve scores based on Indonesian peak maturity cycles and local sea transport pipeline liquidity.
          </p>
        </div>

        {/* 3-Column Cargo Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {COMMODITIES.map(c => {
            // Circle calculations helper
            const radius = 18;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (c.supplyIndex / 100) * circumference;

            return (
              <div 
                key={c.id} 
                className="border border-border-default/60 rounded-xl p-4 bg-bg-primary/10 flex flex-col justify-between space-y-4 hover:border-accent-gold/40 transition-colors"
                style={{ borderLeft: `3px solid ${c.colorCode}` }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-mono font-bold text-xs text-text-primary tracking-wide uppercase">
                      {c.name}
                    </h4>
                    <span className="font-mono text-[8px] text-text-muted block mt-0.5">
                      {c.family}
                    </span>
                  </div>
                  
                  {/* Donut gauge */}
                  <div className="relative flex items-center justify-center shrink-0">
                    <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 44 44">
                      {/* Grey background ring */}
                      <circle
                        className="text-bg-tertiary"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="22"
                        cy="22"
                      />
                      {/* Active gold ring */}
                      <circle
                        className="text-accent-gold"
                        strokeWidth="3.5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="22"
                        cy="22"
                      />
                    </svg>
                    <span className="absolute font-mono text-[9px] font-bold text-text-primary">
                      {c.supplyIndex}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-border-default/40"></div>

                {/* Substats block */}
                <div className="space-y-1.5 font-mono text-[9.5px]">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary uppercase">Reserve Status:</span>
                    <span className={`px-1.5 py-0.5 font-bold rounded text-[8.5px] ${getStatusBadgeColor(c.supplyStatus)}`}>
                      {c.supplyStatus}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary uppercase block max-w-[120px] truncate">Harvest Status:</span>
                    <span className="text-text-primary font-bold uppercase truncate max-w-[110px]">
                      {c.supplyIndex >= 70 ? "Peak Abundant" : c.supplyIndex >= 50 ? "Stable Transition" : "Low Reserve"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary uppercase">Logistic Liquidity:</span>
                    <span className="text-accent-gold font-bold text-[8.5px] uppercase text-right truncate max-w-[120px]" title={c.logisticsLiquidity}>
                      {c.logisticsLiquidity}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* Harvest Interactive Modal display */}
      {harvestModal && harvestModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-[2px] animate-fade-in">
          <div className="bg-bg-secondary border border-accent-gold rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setHarvestModal(null)}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary cursor-pointer p-1 rounded hover:bg-bg-tertiary"
            >
              <X size={16} />
            </button>

            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase text-accent-gold font-bold">
                ● HARVEST REGIONAL FORECAST
              </span>
              <h4 className="font-display font-semibold text-sm text-text-primary uppercase">
                {harvestModal.commodityName} / {harvestModal.month} UNIT
              </h4>
            </div>

            <div className="h-[1px] bg-border-default"></div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Selected Period:</span>
                <span className="text-text-primary font-bold">{harvestModal.month}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Sourcing Status:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getHarvestStatusInfo(harvestModal.status).color}`}>
                  {getHarvestStatusInfo(harvestModal.status).label}
                </span>
              </div>
            </div>

            <p className="font-sans text-[11px] text-text-secondary leading-relaxed pt-2">
              {harvestModal.status === "P" ? (
                "Peak biological maturity reached on-shore. Cooperatives have active dry cargo container lots dried to under 12% moisture averages. Maximum bargaining power rests with the buyer."
              ) : harvestModal.status === "M" ? (
                "Medium transitions active. Volatile essential oil concentrations are stable. Standard cargo escrows are available under average monthly indices smoothly."
              ) : harvestModal.status === "R" ? (
                "⚠️ restricted supply period. Harvest reserves are low due to local maritime quarantine or seasonal monsoon blocks. Procurements during this cycle may incur premium cargo fees."
              ) : (
                "Low active harvest. Shippers are drawing down stock. Ensure certified warehouses are checked before drafting forward trade purchase orders."
              )}
            </p>

            <button
              onClick={() => setHarvestModal(null)}
              className="w-full py-2.5 bg-accent-gold hover:bg-accent-gold-soft text-bg-primary font-bold font-mono text-xs uppercase tracking-wider rounded transition-all mt-4 cursor-pointer"
            >
              Close Record
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
