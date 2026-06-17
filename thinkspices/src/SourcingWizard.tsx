import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Info, 
  FileText,
  User,
  MapPin,
  Compass,
  Briefcase
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { 
  Commodity, 
  Variety, 
  Exporter, 
  COMMODITIES, 
  EXPORTERS 
} from "./mockData";
import { ActiveTab } from "./Sidebar";

interface SourcingWizardProps {
  currentCommodity: Commodity | null;
  currentVariety: Variety | null;
  onSelectCommodity: (commodity: Commodity) => void;
  onSelectVariety: (variety: Variety) => void;
  onSelectProductForm: (form: string) => void;
  onSetRfqDraft: (draft: any) => void;
  onChangeTab: (tab: ActiveTab) => void;
  productForm: string | null;
}

export const SourcingWizard: React.FC<SourcingWizardProps> = ({
  currentCommodity,
  currentVariety,
  onSelectCommodity,
  onSelectVariety,
  onSelectProductForm,
  onSetRfqDraft,
  onChangeTab,
  productForm
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [rfqForm, setRfqForm] = useState({
    volume: "",
    targetPrice: "",
    destinationPort: "Rotterdam, Netherlands",
    selectedExporterId: "",
    companyName: "",
    email: "",
    notes: "",
    certsRequired: [] as string[]
  });

  const [scores, setScores] = useState({
    moisture: 20,
    volatile: 18,
    cert: 20,
    supply: 17,
    origin: 19
  });

  const forms = ["WHOLE", "BROKEN", "POWDER", "OIL", "OLEORESIN", "EXTRACT"];

  // Initialize RFQ form defaults when variety is selected
  useEffect(() => {
    if (currentVariety) {
      setRfqForm(prev => ({
        ...prev,
        volume: String(currentVariety.minMOQ),
        targetPrice: String((currentCommodity?.avgFobBenchmark || 5000) / 1000),
        selectedExporterId: EXPORTERS.find(e => e.primaryCommodities.includes(currentCommodity?.name || ""))?.id || ""
      }));
    }
  }, [currentVariety, currentCommodity]);

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Sourcing Confidence Score is computed from: moisture (20) + volatile (20) + certs (20) + supply (20) + origin (20)
  const sourcingConfidenceScore = scores.moisture + scores.volatile + scores.cert + scores.supply + scores.origin;

  // Compute RFQ Readiness Score (20% Botanical Match, 20% Supplier Availability, 20% Price Feas, 20% Cert, 20% Dest)
  const rfqReadinessScore = (() => {
    let score = 30; // base score
    if (currentVariety) score += 15;
    if (productForm) score += 10;
    if (rfqForm.volume && parseFloat(rfqForm.volume) >= (currentVariety?.minMOQ || 1)) score += 15;
    if (rfqForm.targetPrice && parseFloat(rfqForm.targetPrice) >= ((currentCommodity?.avgFobBenchmark || 5000) / 1000) * 0.9) score += 15;
    if (rfqForm.companyName && rfqForm.email) score += 15;
    return Math.min(score, 100);
  })();

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetRfqDraft({
      ...rfqForm,
      commodityId: currentCommodity?.id,
      varietyId: currentVariety?.id,
      productForm: productForm,
      sourcingConfidenceScore,
      rfqReadinessScore
    });
    onChangeTab("logistics-handoff");
  };

  const handleToggleCert = (cert: string) => {
    setRfqForm(prev => ({
      ...prev,
      certsRequired: prev.certsRequired.includes(cert)
        ? prev.certsRequired.filter(c => c !== cert)
        : [...prev.certsRequired, cert]
    }));
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Wizard Header bar */}
      <div className="bg-bg-secondary border border-border-default rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#A09880] block font-semibold">
            SOURCING JOURNEY 1 — STANDARD DISCOVERY
          </span>
          <h2 className="font-display font-bold text-md text-text-primary uppercase tracking-tight">
            STEP {currentStep}: {
              currentStep === 1 ? "SELECT ARCHIPELAGO COMMODITY" :
              currentStep === 2 ? `SELECT UNIQUE VARIETY [${currentCommodity?.name}]` :
              currentStep === 3 ? "SELECT PRODUCT FORMAT" :
              currentStep === 4 ? "BOTANICAL COMPLIANCE INSPECTOR" :
              currentStep === 5 ? "MARKET SNAPSHOT & INDICATIVE BENCHMARKS" :
              currentStep === 6 ? "VERIFIED INDONESIAN EXPORTERS" :
              "TECHNICAL RFQ PORTAL"
            }
          </h2>
        </div>

        {/* Progress dots bar */}
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5 shrink-0">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-2.5 w-2.5 rounded-full border transition-all duration-300 ${
                  i < currentStep 
                    ? "bg-accent-gold border-accent-gold" 
                    : "bg-bg-primary border-border-default"
                }`}
                title={`Step ${i+1}`}
              ></div>
            ))}
          </div>
          <span className="font-mono text-xs text-text-muted shrink-0 text-right">
            Step {currentStep} of 7
          </span>
        </div>
      </div>

      {/* STEP 1: SELECT BOTANICAL COMMODITY */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <p className="text-text-secondary text-xs sm:text-sm">
              Indonesian spice cultivars are heavily localized across specific ecological channels. Select an endemic agricultural category lower down to lock-in quality indices and origin heatmaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="commodities-grid">
            {COMMODITIES.map((c) => {
              const isSelected = currentCommodity?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectCommodity(c);
                    onSelectVariety(c.varieties[0]); // default select first variety
                    handleNext();
                  }}
                  className={`border hover:border-accent-gold bg-bg-secondary hover:bg-bg-tertiary transition-all duration-150 p-5 rounded-xl cursor-pointer hover:scale-[1.01] flex flex-col justify-between group h-36`}
                  style={{ borderLeft: `4px solid ${c.colorCode}` }}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-display font-bold text-sm text-text-primary tracking-wide uppercase transition-colors group-hover:text-accent-gold">
                        {c.name}
                      </h3>
                      <ChevronRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="font-mono text-[9px] text-[#A09880] uppercase tracking-wider block mt-1">
                      {c.family}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-border-default/50 flex justify-between items-baseline">
                    <div className="font-mono text-[10px]">
                      <span className="text-text-muted block text-[8px] uppercase">AVG FOB BENCHMARK:</span>
                      <span className="text-accent-gold font-bold">${c.avgFobBenchmark.toLocaleString()}/MT</span>
                    </div>
                    <div className="font-mono text-[9px] text-text-muted">
                      {c.varietiesCount} Tracked Varieties
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: SELECT UNIQUE VARIETY */}
      {currentStep === 2 && currentCommodity && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h3 className="font-mono text-xs text-[#A09880] uppercase tracking-wider">
              COMMODITY: {currentCommodity.name} — ENDEMIC LAND ACCENTS
            </h3>
            <p className="text-text-secondary text-xs sm:text-sm mt-1">
              Select standard regional variations. Each holds unique volatile oil margins, sensory thresholds, and Minimum Order Quantities (MOQs).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentCommodity.varieties.map((v) => {
              const isSelected = currentVariety?.id === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => onSelectVariety(v)}
                  className={`border transition-all duration-200 p-6 rounded-xl relative flex flex-col justify-between h-80 cursor-pointer ${
                    isSelected 
                      ? "border-accent-gold bg-accent-gold/5" 
                      : "border-border-default bg-bg-secondary hover:bg-bg-tertiary hover:border-text-secondary"
                  }`}
                >
                  <span className="absolute top-4 right-4 bg-bg-primary text-text-secondary border border-border-default font-mono text-[10px] py-0.5 px-2.5 rounded-full uppercase">
                    {v.badge}
                  </span>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display font-bold text-base text-text-primary uppercase tracking-tight">
                        {v.name}
                      </h3>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-accent-gold text-bg-primary flex items-center justify-center">
                          <Check size={11} className="stroke-[3.5]" />
                        </span>
                      )}
                    </div>
                    
                    <span className="font-mono text-[10px] text-accent-gold italic font-bold">
                      {v.botanicalName}
                    </span>

                    <p className="text-text-secondary text-xs mt-3 leading-relaxed max-w-sm">
                      {v.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {v.bestApplications.map((app, idx) => (
                        <span key={idx} className="bg-bg-primary border border-border-default px-2 py-0.5 rounded text-[10px] text-text-secondary font-mono">
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border-default/50 pt-4 mt-6 flex items-center justify-between font-mono">
                    <div>
                      <span className="text-[8px] text-text-muted uppercase block">MIN SOURCING MOQ:</span>
                      <span className="text-text-primary text-xs font-bold">{v.minMOQ} Metric Tons (MT)</span>
                    </div>

                    <span className="text-[11px] font-bold text-accent-gold flex items-center gap-1 group-hover:text-accent-gold-soft">
                      {isSelected ? "Selected" : "Select Variety"}
                      <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={handleBack} className="flex items-center gap-1 font-mono text-xs text-text-secondary hover:text-text-primary">
              <ChevronLeft size={14} /> Back to Spices
            </button>
            <button 
              disabled={!currentVariety}
              onClick={handleNext} 
              className="px-5 py-2.5 bg-accent-gold text-bg-primary font-bold rounded flex items-center gap-1.5 font-mono text-xs disabled:opacity-40"
            >
              Next Step <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SELECT PRODUCT FORM */}
      {currentStep === 3 && currentVariety && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h3 className="font-mono text-xs text-[#A09880] uppercase tracking-wider">
              VARIETY LOCKED: {currentVariety.name} ({currentVariety.botanicalName})
            </h3>
            <p className="text-text-secondary text-xs sm:text-sm mt-1">
              Select product physical form. Technical compounds and logistics packaging parameters adjust based on selection:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {forms.map((f) => {
              const isSelected = productForm === f;
              const computedMOQ = f === "OIL" || f === "OLEORESIN" ? currentVariety.minMOQ * 0.25 : currentVariety.minMOQ;
              
              return (
                <div
                  key={f}
                  onClick={() => onSelectProductForm(f)}
                  className={`border p-5 rounded-xl cursor-pointer hover:border-accent-gold transition-all duration-150 relative ${
                    isSelected 
                      ? "border-accent-gold bg-accent-gold/5" 
                      : "border-border-default bg-bg-secondary hover:bg-bg-tertiary"
                  }`}
                >
                  <h4 className="font-display font-semibold text-xs tracking-wider text-text-primary uppercase mb-1">
                    {f}
                  </h4>
                  <span className="font-mono text-[9px] text-[#A09880] block">
                    MOQ Base Spot Limit: {computedMOQ} MT
                  </span>
                  
                  {isSelected && (
                    <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-accent-gold text-bg-primary flex items-center justify-center">
                      <Check size={10} className="stroke-[3]" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={handleBack} className="flex items-center gap-1 font-mono text-xs text-text-secondary hover:text-text-primary">
              <ChevronLeft size={14} /> Previous: Variety
            </button>
            <button 
              disabled={!productForm}
              onClick={handleNext} 
              className="px-5 py-2.5 bg-accent-gold text-bg-primary font-bold rounded flex items-center gap-1.5 font-mono text-xs disabled:opacity-40"
            >
              Generate Technical Specs <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: INSPECT TECHNICAL COMPLIANCE */}
      {currentStep === 4 && currentVariety && currentCommodity && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <p className="text-text-secondary text-xs sm:text-sm">
              Review Standar Nasional Indonesia (SNI) grades and essential quality compound values before finalizing contract drafting.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Panel: Botanical specifications */}
            <div className="lg:col-span-7 bg-bg-secondary border border-border-default rounded-xl p-5 space-y-4">
              <span className="font-mono text-[9px] uppercase tracking-wider text-accent-gold font-bold block">
                ● ACTIVE VARIETY DATA LOCKED
              </span>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px]">
                  <tbody>
                    <tr className="border-b border-border-default/50 h-10">
                      <td className="text-text-muted uppercase">Botanical Taxonomy</td>
                      <td className="text-accent-gold italic font-bold">{currentVariety.botanicalName}</td>
                    </tr>
                    <tr className="border-b border-border-default/50 h-10">
                      <td className="text-text-muted uppercase">Common Trade Name</td>
                      <td className="text-text-primary font-bold">{currentVariety.name}</td>
                    </tr>
                    <tr className="border-b border-border-default/50 h-10">
                      <td className="text-text-muted uppercase">Origin Region / Port</td>
                      <td className="text-text-primary">{currentVariety.origin}</td>
                    </tr>
                    <tr className="border-b border-border-default/50 h-10">
                      <td className="text-text-muted uppercase">Product Form Selected</td>
                      <td className="text-accent-gold font-bold uppercase">{productForm}</td>
                    </tr>
                    <tr className="border-b border-border-default/50 h-10">
                      <td className="text-text-muted uppercase">Moisture Limits</td>
                      <td className="text-text-primary">{currentVariety.moistureLimit}</td>
                    </tr>
                    <tr className="border-b border-border-default/50 h-10">
                      <td className="text-text-muted uppercase">Volatile Oil / Purity</td>
                      <td className="text-accent-gold-soft">{currentVariety.volatileOil}</td>
                    </tr>
                    <tr className="border-b border-border-default/50 h-10">
                      <td className="text-text-muted uppercase">Active Marker Level</td>
                      <td className="text-text-primary">{currentVariety.activeMarker}</td>
                    </tr>
                    <tr className="border-b border-border-default/50 h-14">
                      <td className="text-text-muted uppercase valign-top pt-3">Aromatic Profile</td>
                      <td className="text-text-primary font-sans leading-relaxed pt-2 text-[12px]">{currentVariety.aromaticProfile}</td>
                    </tr>
                    <tr className="border-b border-border-default/50 h-10">
                      <td className="text-text-muted uppercase">SNI Compliance Code</td>
                      <td className="text-text-primary bg-bg-tertiary px-2 py-0.5 rounded font-bold">{currentVariety.sniCode}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Panel: Sourcing Confidence Score Gauge Donut */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-bg-tertiary border border-border-default rounded-xl p-5 space-y-6">
              
              <div className="text-center space-y-2">
                <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary block">
                  SOURCING CONFIDENCE SCORE™
                </span>
                
                {/* Simulated Donut with pure SVG */}
                <div className="flex justify-center py-2">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        className="stroke-bg-primary fill-none"
                        strokeWidth="10"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        className="stroke-accent-gold fill-none transition-all duration-1000 ease-out"
                        strokeWidth="10"
                        strokeDasharray={377}
                        strokeDashoffset={377 - (377 * sourcingConfidenceScore) / 100}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="font-display font-bold text-3xl text-text-primary">
                        {sourcingConfidenceScore}
                      </span>
                      <span className="font-mono text-[9px] text-text-muted">/ 100</span>
                    </div>
                  </div>
                </div>

                <div className="inline-block bg-accent-gold/10 border border-accent-gold/30 text-accent-gold rounded-full px-3 py-1 font-mono text-[9px] font-bold">
                  PREMIUM GRADE MATCH
                </div>
              </div>

              {/* Point allocation checklist */}
              <div className="space-y-2 text-[11px] font-mono border-t border-border-default/60 pt-4">
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Moisture Specs Check</span>
                  <span className="text-text-primary">{scores.moisture}/20 pts</span>
                </div>
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Volatile Oil Yield</span>
                  <span className="text-text-primary">{scores.volatile}/20 pts</span>
                </div>
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Certifications Suitability</span>
                  <span className="text-text-primary">{scores.cert}/20 pts</span>
                </div>
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Local Supply Outlook</span>
                  <span className="text-text-primary">{scores.supply}/20 pts</span>
                </div>
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Origin Accuracy</span>
                  <span className="text-text-primary">{scores.origin}/20 pts</span>
                </div>
              </div>

              {/* Certified export credentials available */}
              <div className="space-y-2">
                <span className="block font-mono text-[9px] text-text-muted text-left uppercase">
                  Available Export certs for this variety:
                </span>
                <div className="flex flex-wrap gap-1">
                  {currentVariety.certifications.map((c, idx) => (
                    <span key={idx} className="bg-bg-secondary border border-border-default text-text-secondary text-[9px] px-2 py-0.5 rounded font-mono">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={handleBack} className="flex items-center gap-1 font-mono text-xs text-text-secondary hover:text-text-primary">
              <ChevronLeft size={14} /> Back to Product Form
            </button>
            <button 
              onClick={handleNext} 
              className="px-5 py-2.5 bg-accent-gold text-bg-primary font-bold rounded flex items-center gap-1.5 font-mono text-xs"
            >
              View Market Prices & Snaps <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: MARKET SNAPSHOT */}
      {currentStep === 5 && currentVariety && currentCommodity && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h3 className="font-mono text-xs text-[#A09880] uppercase tracking-wider">
              MARKET SPOT INDICATORS — {currentVariety.name}
            </h3>
            <p className="text-text-secondary text-xs sm:text-sm mt-1">
              Verify indicative contract price trends and aggregate on-shore inventory levels prior to committing RFQs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Panel: Historical Chart */}
            <div className="lg:col-span-7 bg-bg-secondary border border-border-default rounded-xl p-5 space-y-4">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-wider text-accent-gold font-bold">
                  FOB PRICE HISTORY (USD/KG)
                </span>
                <span className="font-sans text-xs text-text-muted mt-0.5">
                  6-Months contract indices Free On Board Indonesian export harbors
                </span>
              </div>

              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentCommodity.fobPriceHistory} margin={{ top: 20, right: 20, bottom: 5, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2720" />
                    <XAxis dataKey="month" stroke="#6B6355" />
                    <YAxis stroke="#6B6355" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#111009", borderColor: "#C8922A" }}
                      labelStyle={{ color: "#F0EDE6", fontWeight: "bold" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#C8922A" 
                      strokeWidth={3} 
                      activeDot={{ r: 8 }}
                      dot={{ fill: "#C8922A", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <span className="block font-mono text-[9px] text-text-muted italic">
                *Benchmark indicators represent average industrial contract bulk weights FOB Makassar, Ambon, or Semarang harbors. Gilded culinary grade limits may hold premium pricing.
              </span>
            </div>

            {/* Right Panel: Supply availability */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-bg-tertiary border border-border-default rounded-xl p-5 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary">
                    SUPPLY AVAILABILITY INDEX
                  </span>
                  <span className="font-sans text-[11px] text-text-muted mt-0.5">
                    Calculated from provincial harvest volume tracking & transit liquidity
                  </span>
                </div>

                <div className="flex items-baseline gap-2.5">
                  <span className="font-display font-bold text-4xl text-accent-gold">
                    {currentCommodity.supplyIndex}
                  </span>
                  <span className="text-accent-green font-mono text-xs font-bold uppercase tracking-wider">
                    {currentCommodity.supplyStatus} — ABUNDANT
                  </span>
                </div>

                <div className="space-y-2 border-t border-border-default/60 pt-4 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Harvest Season Status</span>
                    <span className="text-text-primary text-right font-medium">PEAK MATURITY CYCLES</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Logistics Line Fluidity</span>
                    <span className="text-[#3498DB] font-medium">{currentCommodity.logisticsLiquidity}</span>
                  </div>
                </div>
              </div>

              {/* Warning/Advisory component */}
              <div className="p-4 border border-accent-amber/40 bg-accent-amber/5 rounded-lg space-y-2">
                <div className="flex items-center gap-1.5 text-accent-amber font-mono text-[10px] font-bold">
                  <AlertTriangle size={13} />
                  <span>⚠ SOURCING ADVISORY RECOMMENDATION</span>
                </div>
                <p className="text-text-primary font-sans text-xs leading-relaxed font-normal">
                  {currentCommodity.advisoryText}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={handleBack} className="flex items-center gap-1 font-mono text-xs text-text-secondary hover:text-text-primary">
              <ChevronLeft size={14} /> Back to Tech Specs
            </button>
            <button 
              onClick={handleNext} 
              className="px-5 py-2.5 bg-accent-gold text-bg-primary font-bold rounded flex items-center gap-1.5 font-mono text-xs"
            >
              Audited Supplier Database <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: VERIFIED EXPORTERS */}
      {currentStep === 6 && currentVariety && currentCommodity && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h3 className="font-mono text-xs text-[#A09880] uppercase tracking-wider">
              AUDITED PARTNERS FOR: {currentVariety.name}
            </h3>
            <p className="text-text-secondary text-xs sm:text-sm mt-1">
              Direct access database of verified cooperatives and shipping networks licensed under local sea quarantine boards (BARANTIN).
            </p>
          </div>

          <div className="space-y-4">
            {EXPORTERS.filter(exp => exp.primaryCommodities.includes(currentCommodity.name)).map((exp) => (
              <div 
                key={exp.id}
                onClick={() => setRfqForm(prev => ({ ...prev, selectedExporterId: exp.id }))}
                className={`border p-6 rounded-xl transition-all duration-150 relative cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
                  rfqForm.selectedExporterId === exp.id
                    ? "border-accent-gold bg-accent-gold/5"
                    : "border-border-default bg-bg-secondary hover:bg-bg-tertiary"
                }`}
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center flex-wrap gap-2.5">
                    <h4 className="font-display font-semibold text-sm text-text-primary uppercase tracking-wider">
                      {exp.name}
                    </h4>
                    <span className="inline-flex items-center gap-1 bg-[#2ECC71]/15 text-accent-green px-2 py-0.5 rounded text-[9px] font-mono tracking-wider font-bold border border-[#2ECC71]/10">
                      <ShieldCheck size={11} /> ✓ EXPORT VERIFIED
                    </span>
                    <span className="font-mono text-[10px] text-text-muted">
                      EQI™ Score: <strong className="text-accent-gold font-bold">{exp.eqi}/100</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-[11px] text-text-secondary pt-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={11} className="text-text-muted" />
                      <span>{exp.hub}</span>
                    </div>
                    <div>
                      <span>Experience: <strong className="text-text-primary">{exp.experienceYears} Years</strong></span>
                    </div>
                    <div>
                      <span>Primary MOQ: <strong className="text-text-primary">{exp.moq} MT</strong></span>
                    </div>
                    <div className="text-accent-gold font-semibold">
                      <span>{exp.contractType}</span>
                    </div>
                  </div>

                  {/* Certifications row */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.certifications.map((c, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-bg-primary border border-border-default text-text-secondary text-[9px] font-mono rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex flex-row md:flex-col items-end gap-3 w-full md:w-auto border-t md:border-t-0 border-border-default/50 pt-4 md:pt-0">
                  <div className="text-right font-mono text-[10px] hidden md:block">
                    <span className="text-text-muted block text-[8px] uppercase">TOP EXPORT MARKETS:</span>
                    <span className="text-text-primary text-[10px]">{exp.exportMarkets.slice(0, 3).join(", ")}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRfqForm(prev => ({ ...prev, selectedExporterId: exp.id }));
                      handleNext();
                    }}
                    className={`font-mono text-xs font-bold px-4 py-2 rounded shrink-0 flex items-center gap-1 transition-all ${
                      rfqForm.selectedExporterId === exp.id
                        ? "bg-accent-gold text-bg-primary hover:bg-accent-gold-soft"
                        : "border border-border-default hover:border-accent-gold text-text-primary"
                    }`}
                  >
                    <span>SOURCE COMMODITY</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={handleBack} className="flex items-center gap-1 font-mono text-xs text-text-secondary hover:text-text-primary">
              <ChevronLeft size={14} /> Back to Market snapshot
            </button>
            <button 
              disabled={!rfqForm.selectedExporterId}
              onClick={handleNext} 
              className="px-5 py-2.5 bg-accent-gold text-bg-primary font-bold rounded flex items-center gap-1.5 font-mono text-xs disabled:opacity-40"
            >
              Draft Technical RFQ <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: TECHNICAL RFQ PORTAL */}
      {currentStep === 7 && currentVariety && currentCommodity && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h3 className="font-mono text-xs text-[#A09880] uppercase tracking-wider">
              FINAL STEP: FORMULATE EXPORT PROCUREMENT COMPLIANCE CONTRACT
            </h3>
            <p className="text-text-secondary text-xs sm:text-sm mt-1">
              Provide your targeting parameters. Once submitted, parameters lock under general escrow standards and handoff-pass immediately to InTradeX™ Logistics lines.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Panel: Sourcing Spec Summary & scores */}
            <div className="lg:col-span-5 bg-bg-secondary border border-border-default rounded-xl p-5 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="font-mono text-[9px] uppercase tracking-wider text-accent-gold font-bold block">
                  ● BOTANICAL TARGET SPECS SUMMARY
                </span>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <span className="text-text-muted text-[9px] uppercase block">BOTANICAL CATEGORY:</span>
                    <span className="text-text-primary font-bold">[{currentCommodity.name}]</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[9px] uppercase block">VARIETY NAME:</span>
                    <span className="text-text-primary font-bold">{currentVariety.name}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[9px] uppercase block">PRODUCT FORM FORMAT:</span>
                    <span className="text-accent-gold font-bold uppercase">{productForm}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[9px] uppercase block">SNI HIGHWAY STANDARD:</span>
                    <span className="text-text-primary">{currentVariety.sniCode}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[9px] uppercase block">MOISTURE VALUE target limit:</span>
                    <span className="text-text-primary">{currentVariety.moistureLimit}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[9px] uppercase block">SELECTED EXPORTER:</span>
                    <span className="text-accent-gold-soft font-bold">
                      {EXPORTERS.find(e => e.id === rfqForm.selectedExporterId)?.name || "Not Selected"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sourcing confidence and RFQ readiness score circles */}
              <div className="grid grid-cols-2 gap-4 border-t border-border-default/60 pt-6">
                
                {/* Confidence */}
                <div className="flex flex-col items-center text-center space-y-1">
                  <span className="text-[8px] font-mono text-text-muted uppercase">CONFIDENCE</span>
                  <div className="w-14 h-14 rounded-full border-2 border-accent-gold flex items-center justify-center font-display text-sm font-bold text-accent-gold">
                    {sourcingConfidenceScore}%
                  </div>
                  <span className="text-[9px] font-mono text-accent-green uppercase">OPTIMAL</span>
                </div>

                {/* RFQ Readiness */}
                <div className="flex flex-col items-center text-center space-y-1">
                  <span className="text-[8px] font-mono text-text-muted uppercase">RFQ READINESS</span>
                  <div className="w-14 h-14 rounded-full border-2 border-[#3498DB] flex items-center justify-center font-display text-sm font-bold text-[#3498DB]">
                    {rfqReadinessScore}%
                  </div>
                  <span className="text-[9px] font-mono text-text-secondary uppercase">READY FOR EXPORT</span>
                </div>

              </div>
            </div>

            {/* Right Panel: actual form inputs */}
            <div className="lg:col-span-7 bg-bg-secondary border border-border-default rounded-xl p-5 sm:p-6">
              <form onSubmit={handleRfqSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Volume required */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-text-secondary uppercase">
                      VOLUME REQUIRED (METRIC TONS - MT) *
                    </label>
                    <input
                      type="number"
                      required
                      min={currentVariety.minMOQ}
                      value={rfqForm.volume}
                      onChange={(e) => setRfqForm(prev => ({ ...prev, volume: e.target.value }))}
                      className="w-full px-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold text-xs font-mono text-text-primary rounded outline-none"
                    />
                    <span className="block font-mono text-[8px] text-text-muted">
                      Minimum contract limit set at {currentVariety.minMOQ} MT.
                    </span>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-text-secondary uppercase">
                      TARGET PRICE (USD/KG FOB) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={rfqForm.targetPrice}
                      onChange={(e) => setRfqForm(prev => ({ ...prev, targetPrice: e.target.value }))}
                      className="w-full px-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold text-xs font-mono text-text-primary rounded outline-none"
                    />
                    <span className="block font-mono text-[8px] text-text-muted">
                      Indicative spot index averages around ${(currentCommodity.avgFobBenchmark/1000).toFixed(2)}/kg.
                    </span>
                  </div>
                </div>

                {/* Destination port */}
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-text-secondary uppercase">
                    DESTINATION DELIVERY SEA PORT *
                  </label>
                  <input
                    type="text"
                    required
                    value={rfqForm.destinationPort}
                    onChange={(e) => setRfqForm(prev => ({ ...prev, destinationPort: e.target.value }))}
                    className="w-full px-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold text-xs font-mono text-text-primary rounded outline-none"
                  />
                </div>

                {/* Checklist certs */}
                <div className="space-y-1.5 pt-1">
                  <label className="block font-mono text-[10px] text-text-secondary uppercase">
                    CERTIFICATION REQUIREMENTS (MULTI-SELECT)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {currentVariety.certifications.map((c) => {
                      const isChecked = rfqForm.certsRequired.includes(c);
                      return (
                        <label 
                          key={c}
                          className={`flex items-center gap-2 p-2 rounded cursor-pointer border text-[10px] font-mono ${
                            isChecked 
                              ? "bg-accent-gold/15 border-accent-gold/45 text-accent-gold" 
                              : "bg-bg-input border-border-default text-text-secondary"
                          }`}
                        >
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleCert(c)}
                            className="hidden"
                          />
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${isChecked ? "bg-accent-gold border-accent-gold text-bg-primary" : "border-text-muted"}`}>
                            {isChecked && <Check size={10} className="stroke-[3]" />}
                          </div>
                          <span className="truncate">{c}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Buyer Corporate */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-text-secondary uppercase">
                      BUYER COMPANY NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Spices Global Importers Ltd"
                      value={rfqForm.companyName}
                      onChange={(e) => setRfqForm(prev => ({ ...prev, companyName: e.target.value }))}
                      className="w-full px-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold text-xs text-text-primary rounded outline-none"
                    />
                  </div>

                  {/* Buyer Contact e-mail */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-text-secondary uppercase">
                      BUYER CONTACT EMAIL *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. procurement@spicesglobal.com"
                      value={rfqForm.email}
                      onChange={(e) => setRfqForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold text-xs text-text-primary rounded outline-none"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-text-secondary uppercase">
                    ADDITIONAL NOTES / SPEC REMARKS (OPTIONAL)
                  </label>
                  <textarea
                    rows={2}
                    value={rfqForm.notes}
                    onChange={(e) => setRfqForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Enter any grain constraints, container bulk lining options, or pre-quarantine requirements..."
                    className="w-full px-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold text-xs text-text-primary rounded outline-none font-sans"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-accent-gold hover:bg-accent-gold-soft text-bg-primary font-bold text-xs uppercase font-mono tracking-wider rounded transition-all mt-4 flex items-center justify-center gap-1.5 shadow"
                  id="rfq-submit-button"
                >
                  <FileText size={14} />
                  <span>SUBMIT RFQ TO VERIFIED EXPORTER →</span>
                </button>
              </form>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={handleBack} className="flex items-center gap-1 font-mono text-xs text-text-secondary hover:text-text-primary">
              <ChevronLeft size={14} /> Previous: Exporters list
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
