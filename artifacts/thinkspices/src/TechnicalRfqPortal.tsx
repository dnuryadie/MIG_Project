import React, { useState, useEffect } from "react";
import { 
  Check, 
  FileText, 
  ShieldCheck, 
  Layers, 
  MapPin, 
  ChevronRight, 
  Info,
  Building,
  User,
  ExternalLink
} from "lucide-react";
import { 
  Commodity, 
  Variety, 
  Exporter, 
  COMMODITIES, 
  EXPORTERS 
} from "./mockData";
import { useTranslation } from "./translations";

interface TechnicalRfqPortalProps {
  initialCommodity?: Commodity | null;
  initialVariety?: Variety | null;
  initialProductForm?: string | null;
  onSelectCommodity?: (comm: Commodity) => void;
  onSelectVariety?: (variety: Variety) => void;
  onSelectProductForm?: (form: string) => void;
  onSetRfqDraft: (draft: any) => void;
  onChangeTab: (tab: any) => void;
  currentUser: any;
}

export const TechnicalRfqPortal: React.FC<TechnicalRfqPortalProps> = ({
  initialCommodity,
  initialVariety,
  initialProductForm,
  onSelectCommodity,
  onSelectVariety,
  onSelectProductForm,
  onSetRfqDraft,
  onChangeTab,
  currentUser
}) => {
  const { t, language } = useTranslation();

  // Selected state
  const [selectedCommodity, setSelectedCommodity] = useState<Commodity>(
    initialCommodity || COMMODITIES[0]
  );
  
  const [selectedVariety, setSelectedVariety] = useState<Variety>(
    initialVariety || (initialCommodity ? initialCommodity.varieties[0] : COMMODITIES[0].varieties[0])
  );

  const [productForm, setProductForm] = useState<string>(
    initialProductForm || "WHOLE"
  );

  // Form inputs
  const [rfqForm, setRfqForm] = useState({
    volume: "",
    targetPrice: "",
    destinationPort: "Rotterdam, Netherlands",
    selectedExporterId: "",
    companyName: currentUser?.companyName || "",
    email: currentUser?.email || "",
    notes: "",
    certsRequired: [] as string[]
  });

  const forms = ["WHOLE", "BROKEN", "POWDER", "OIL", "OLEORESIN", "EXTRACT"];

  // Sync to parent selection updates if any
  useEffect(() => {
    if (initialCommodity) {
      setSelectedCommodity(initialCommodity);
    }
  }, [initialCommodity]);

  useEffect(() => {
    if (initialVariety) {
      setSelectedVariety(initialVariety);
    }
  }, [initialVariety]);

  useEffect(() => {
    if (initialProductForm) {
      setProductForm(initialProductForm);
    }
  }, [initialProductForm]);

  // Handle commodity change and auto-select first variety
  const handleCommodityChange = (commId: string) => {
    const matched = COMMODITIES.find(c => c.id === commId);
    if (matched) {
      setSelectedCommodity(matched);
      if (onSelectCommodity) {
        onSelectCommodity(matched);
      }
      if (matched.varieties && matched.varieties.length > 0) {
        setSelectedVariety(matched.varieties[0]);
        if (onSelectVariety) {
          onSelectVariety(matched.varieties[0]);
        }
      }
    }
  };

  // Sync pricing & MOQ default parameters when variety or commodity updates
  useEffect(() => {
    if (selectedVariety && selectedCommodity) {
      // Find matching exporters for default
      const defaultExporter = EXPORTERS.find(e => 
        e.primaryCommodities.includes(selectedCommodity.name)
      );

      setRfqForm(prev => ({
        ...prev,
        volume: String(selectedVariety.minMOQ),
        targetPrice: String((selectedCommodity.avgFobBenchmark) / 1000),
        selectedExporterId: defaultExporter ? defaultExporter.id : EXPORTERS[0].id,
        certsRequired: []
      }));
    }
  }, [selectedVariety, selectedCommodity]);

  const handleToggleCert = (cert: string) => {
    setRfqForm(prev => ({
      ...prev,
      certsRequired: prev.certsRequired.includes(cert)
        ? prev.certsRequired.filter(c => c !== cert)
        : [...prev.certsRequired, cert]
    }));
  };

  // Scores
  const sourcingConfidenceScore = (() => {
    let score = 75; // high starting confidence bases
    if (rfqForm.certsRequired.length > 0) score += 10;
    if (rfqForm.selectedExporterId) score += 10;
    return Math.min(score, 100);
  })();

  const rfqReadinessScore = (() => {
    let score = 30; // base score
    if (selectedVariety) score += 15;
    if (productForm) score += 10;
    if (rfqForm.volume && parseFloat(rfqForm.volume) >= (selectedVariety?.minMOQ || 1)) score += 15;
    if (rfqForm.targetPrice && parseFloat(rfqForm.targetPrice) >= ((selectedCommodity?.avgFobBenchmark || 5000) / 1000) * 0.9) score += 15;
    if (rfqForm.companyName && rfqForm.email) score += 15;
    return Math.min(score, 100);
  })();

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetRfqDraft({
      ...rfqForm,
      commodityId: selectedCommodity.id,
      varietyId: selectedVariety.id,
      productForm: productForm,
      sourcingConfidenceScore,
      rfqReadinessScore
    });
    // Safely route to handoff tab without crashing on iframe alert permissions
    onChangeTab("logistics-handoff");
  };

  const filteredExporters = EXPORTERS.filter(e => 
    e.primaryCommodities.some(c => c.toUpperCase() === selectedCommodity.name.toUpperCase())
  );

  return (
    <div className="space-y-8 animate-slide-up" id="technical-rfq-portal-view">
      {/* Standalone Title Area Block - NO sourcing journey header or step indicators as requested by Fix 3 */}
      <div className="border-b border-border-default/60 pb-5">
        <h1 className="font-display font-extrabold text-2xl text-text-primary tracking-tight uppercase flex items-center gap-2">
          <FileText className="text-accent-gold" size={24} />
          <span>{t("rfq-portal") || "TECHNICAL RFQ PORTAL"}</span>
        </h1>
        <p className="text-text-secondary text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          {t("rfq_explanation") || "Provide your targeting parameters. Once submitted, parameters lock under general escrow standards and handoff-pass immediately to InTradeX™ Logistics lines."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Dynamic Spec Inspector & Scores */}
        <div className="lg:col-span-5 bg-bg-secondary border border-border-default rounded-xl p-5 sm:p-6 space-y-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-accent-gold font-bold block bg-accent-gold/5 px-2.5 py-1 rounded inline-block border border-accent-gold/15">
              {t("botanical_summary") || "● BOTANICAL SPECS SUMMARY"}
            </span>

            <div className="space-y-4 pt-2 text-xs font-mono">
              <div className="border-b border-border-default/40 pb-2 flex justify-between items-center">
                <span className="text-text-muted text-[10px] uppercase">{t("bot_category") || "BOTANICAL CATEGORY:"}</span>
                <span className="text-text-primary font-bold">[{selectedCommodity.name}]</span>
              </div>
              <div className="border-b border-border-default/40 pb-2 flex justify-between items-center">
                <span className="text-text-muted text-[10px] uppercase">{t("variety_name") || "VARIETY NAME:"}</span>
                <span className="text-accent-gold font-bold">{selectedVariety.name}</span>
              </div>
              <div className="border-b border-border-default/40 pb-2 flex justify-between items-center">
                <span className="text-text-muted text-[10px] uppercase">{t("product_format") || "PRODUCT FORMAT:"}</span>
                <span className="text-text-primary font-bold uppercase">{productForm}</span>
              </div>
              <div className="border-b border-border-default/40 pb-2 flex justify-between items-center">
                <span className="text-text-muted text-[10px] uppercase">{t("sni_standard") || "SNI HIGHWAY STANDARD:"}</span>
                <span className="text-text-primary font-medium">{selectedVariety.sniCode}</span>
              </div>
              <div className="border-b border-border-default/40 pb-2 flex justify-between items-center">
                <span className="text-text-muted text-[10px] uppercase">{t("moisture_limit") || "MOISTURE LIMIT:"}</span>
                <span className="text-text-primary font-medium">{selectedVariety.moistureLimit}</span>
              </div>
              <div className="border-b border-border-default/40 pb-2 flex justify-between items-center">
                <span className="text-text-muted text-[10px] uppercase">ACTIVE VOLATILE MARKER:</span>
                <span className="text-accent-green font-medium">{selectedVariety.activeMarker || "N/A"}</span>
              </div>
              <div className="pt-1 flex justify-between items-center">
                <span className="text-text-muted text-[10px] uppercase">{t("selected_exporter") || "SELECTED EXPORTER:"}</span>
                <span className="text-accent-gold-soft font-bold text-right truncate max-w-[200px]">
                  {EXPORTERS.find(e => e.id === rfqForm.selectedExporterId)?.name || "Not Selected"}
                </span>
              </div>
            </div>
          </div>

          {/* Meter/Score metrics */}
          <div className="grid grid-cols-2 gap-4 border-t border-border-default/60 pt-6">
            {/* Confidence metric */}
            <div className="flex flex-col items-center text-center space-y-1.5 p-3 bg-bg-primary/50 border border-border-default/40 rounded-lg">
              <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">{t("confidence") || "CONFIDENCE"}</span>
              <div className="w-14 h-14 rounded-full border-2 border-accent-gold flex items-center justify-center font-display text-sm font-bold text-accent-gold shadow-sm bg-accent-gold/5">
                {sourcingConfidenceScore}%
              </div>
              <span className="text-[9px] font-mono text-accent-green uppercase font-bold">{t("clean") || "OPTIMAL"}</span>
            </div>

            {/* RFQ Readiness metric */}
            <div className="flex flex-col items-center text-center space-y-1.5 p-3 bg-bg-primary/50 border border-border-default/40 rounded-lg sub-container">
              <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">{t("rfq_readiness") || "RFQ READINESS"}</span>
              <div className="w-14 h-14 rounded-full border-2 border-[#3498DB] flex items-center justify-center font-display text-sm font-bold text-[#3498DB] shadow-sm bg-[#3498DB]/5">
                {rfqReadinessScore}%
              </div>
              <span className="text-[9px] font-mono text-text-secondary uppercase font-bold">{t("ready_for_export") || "READY FOR EXPORT"}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Standalone Interactive RFQ Configuration Form */}
        <div className="lg:col-span-7 bg-bg-secondary border border-border-default rounded-xl p-5 sm:p-6 shadow-sm">
          <form onSubmit={handleRfqSubmit} className="space-y-5">
            
            {/* STANDALONE SELECTORS - Very useful so user is not stuck! */}
            <div className="p-4 bg-bg-primary/60 border border-border-default/80 rounded-lg space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-border-default/40">
                <Layers size={13} className="text-accent-gold" />
                <span className="font-mono text-[10px] font-bold text-text-primary uppercase tracking-wider">
                  RFQ BOTANICAL COORDINATE SELECTORS
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Select Commodity */}
                <div className="space-y-1">
                  <label className="block font-mono text-[9px] text-text-secondary uppercase">
                    {t("select_commodity_lbl") || "SELECT COMMODITY *"}
                  </label>
                  <select
                    value={selectedCommodity.id}
                    onChange={(e) => handleCommodityChange(e.target.value)}
                    className="w-full px-2 py-1.5 bg-bg-input border border-border-default text-[11px] font-mono text-text-primary rounded outline-none focus:border-accent-gold cursor-pointer"
                  >
                    {COMMODITIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Select Variety */}
                <div className="space-y-1">
                  <label className="block font-mono text-[9px] text-text-secondary uppercase">
                    {t("select_variety_lbl") || "SELECT SPECIFIC VARIETY *"}
                  </label>
                  <select
                    value={selectedVariety.id}
                    onChange={(e) => {
                      const matched = selectedCommodity.varieties.find(v => v.id === e.target.value);
                      if (matched) {
                        setSelectedVariety(matched);
                        if (onSelectVariety) {
                          onSelectVariety(matched);
                        }
                      }
                    }}
                    className="w-full px-2 py-1.5 bg-bg-input border border-border-default text-[11px] font-mono text-text-primary rounded outline-none focus:border-accent-gold cursor-pointer"
                  >
                    {selectedCommodity.varieties.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                {/* Select Product Form */}
                <div className="space-y-1">
                  <label className="block font-mono text-[9px] text-text-secondary uppercase">
                    {t("select_format_lbl") || "SELECT PRODUCT FORMAT *"}
                  </label>
                  <select
                    value={productForm}
                    onChange={(e) => {
                      setProductForm(e.target.value);
                      if (onSelectProductForm) {
                        onSelectProductForm(e.target.value);
                      }
                    }}
                    className="w-full px-2 py-1.5 bg-bg-input border border-border-default text-[11px] font-mono text-text-primary rounded outline-none focus:border-accent-gold cursor-pointer"
                  >
                    {forms.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Exporter Selector & MOQ / Volume input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Select Exporter */}
              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-text-secondary uppercase">
                  {t("select_exporter_lbl") || "SELECT PREFERRED EXPORTER *"}
                </label>
                <select
                  value={rfqForm.selectedExporterId}
                  onChange={(e) => setRfqForm(prev => ({ ...prev, selectedExporterId: e.target.value }))}
                  className="w-full px-3 py-2 bg-bg-input border border-border-default text-xs font-mono text-text-primary rounded outline-none focus:border-accent-gold cursor-pointer h-[34px]"
                >
                  {filteredExporters.length > 0 ? (
                    filteredExporters.map(exp => (
                      <option key={exp.id} value={exp.id}>{exp.name} (EQI: {exp.eqi})</option>
                    ))
                  ) : (
                    EXPORTERS.map(exp => (
                      <option key={exp.id} value={exp.id}>{exp.name} (EQI: {exp.eqi})</option>
                    ))
                  )}
                </select>
              </div>

              {/* Volume */}
              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-text-secondary uppercase">
                  {t("volume_lbl") || "VOLUME REQUIRED (METRIC TONS - MT) *"}
                </label>
                <input
                  type="number"
                  required
                  min={selectedVariety.minMOQ}
                  value={rfqForm.volume}
                  onChange={(e) => setRfqForm(prev => ({ ...prev, volume: e.target.value }))}
                  className="w-full px-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold text-xs font-mono text-text-primary rounded outline-none h-[34px]"
                />
                <span className="block font-mono text-[8px] text-text-muted">
                  {t("min_moq_hint") || "Minimum contract limit set at"} {selectedVariety.minMOQ} MT.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Target Price */}
              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-text-secondary uppercase">
                  {t("target_price_lbl") || "TARGET PRICE (USD/KG FOB) *"}
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={rfqForm.targetPrice}
                  onChange={(e) => setRfqForm(prev => ({ ...prev, targetPrice: e.target.value }))}
                  className="w-full px-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold text-xs font-mono text-text-primary rounded outline-none h-[34px]"
                />
                <span className="block font-mono text-[8px] text-text-muted">
                  {t("indicative_hint") || "Indicative spot index averages around"} ${(selectedCommodity.avgFobBenchmark / 1000).toFixed(2)}/kg.
                </span>
              </div>

              {/* Destination Sea Port */}
              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-text-secondary uppercase">
                  {t("dest_port_lbl") || "DESTINATION DELIVERY SEA PORT *"}
                </label>
                <input
                  type="text"
                  required
                  value={rfqForm.destinationPort}
                  onChange={(e) => setRfqForm(prev => ({ ...prev, destinationPort: e.target.value }))}
                  className="w-full px-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold text-xs font-mono text-text-primary rounded outline-none h-[34px]"
                />
              </div>
            </div>

            {/* Multi select certifications */}
            <div className="space-y-2 pt-1">
              <label className="block font-mono text-[10px] text-text-secondary uppercase">
                {t("certs_lbl") || "CERTIFICATION REQUIREMENTS (MULTI-SELECT)"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="certs-checkboxes-boundary">
                {selectedVariety.certifications.map((c) => {
                  const isChecked = rfqForm.certsRequired.includes(c);
                  return (
                    <label 
                      key={c}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer border text-[10px] font-mono transition-colors ${
                        isChecked 
                          ? "bg-accent-gold/10 border-accent-gold/45 text-accent-gold" 
                          : "bg-bg-input border-border-default text-text-secondary hover:bg-bg-primary"
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

            {/* Buyer Company Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-text-secondary uppercase">
                  {t("buyer_company") || "BUYER COMPANY NAME *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spices Global Importers Ltd"
                  value={rfqForm.companyName}
                  onChange={(e) => setRfqForm(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full px-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold text-xs text-text-primary rounded outline-none h-[34px]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[10px] text-text-secondary uppercase">
                  {t("buyer_email") || "BUYER CONTACT EMAIL *"}
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. procurement@spicesglobal.com"
                  value={rfqForm.email}
                  onChange={(e) => setRfqForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold text-xs text-text-primary rounded outline-none h-[34px]"
                />
              </div>
            </div>

            {/* Additional notes */}
            <div className="space-y-1">
              <label className="block font-mono text-[10px] text-text-secondary uppercase font-semibold">
                {t("additional_notes") || "ADDITIONAL NOTES / SPEC REMARKS (OPTIONAL)"}
              </label>
              <textarea
                rows={3}
                value={rfqForm.notes}
                onChange={(e) => setRfqForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder={t("notes_placeholder") || "Enter any grain constraints, container bulk lining options, or pre-quarantine requirements..."}
                className="w-full px-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold text-xs text-text-primary rounded outline-none font-sans"
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-accent-gold hover:bg-accent-gold-soft text-bg-primary font-bold text-xs uppercase font-mono tracking-widest rounded transition-all mt-4 flex items-center justify-center gap-1.5 shadow cursor-pointer active:scale-[0.99]"
              id="rfq-standalone-submit"
            >
              <FileText size={14} />
              <span>{t("submit_rfq") || "SUBMIT RFQ TO VERIFIED EXPORTER →"}</span>
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};
