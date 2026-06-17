import React, { useState } from "react";
import { CheckCircle2, RefreshCw, Undo2, ArrowRight, Send } from "lucide-react";
import { ActiveTab } from "./Sidebar";

interface LogisticsHandoffProps {
  rfqDraft: any;
  onChangeTab: (tab: ActiveTab) => void;
}

/** Maps ThinkSpices commodity name + product form → InTradeX COMMODITY_FOB_MASTER key */
function toIntradexCommodityKey(commodityName: string, productForm: string): string {
  const name = (commodityName || '').toUpperCase();
  const form = (productForm || 'WHOLE').toUpperCase();
  if (name.includes('CASSIA') || name.includes('CINNAMON')) {
    return form.includes('POWDER') ? 'Cassia Powder' : 'Cassia Whole';
  }
  if (name.includes('NUTMEG'))    return 'Nutmeg';
  if (name.includes('CLOVE'))     return 'Clove';
  if (name.includes('VANILLA'))   return 'Vanilla';
  if (name.includes('PATCHOULI')) return 'Patchouli Oil';
  if (name.includes('PEPPER') && name.includes('WHITE')) return 'White Pepper (Whole)';
  if (name.includes('PEPPER'))    return 'Black Pepper (Whole)';
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  return `${cap(commodityName)} ${cap(form)}`.trim();
}

/** Maps product form + commodity to InTradeX default packaging type */
function toDefaultPackaging(commodityName: string, productForm: string): string {
  const name = (commodityName || '').toUpperCase();
  const form = (productForm || 'WHOLE').toUpperCase();
  if (name.includes('VANILLA'))    return 'Vacuum Bag + Carton 5 Kg';
  if (name.includes('PATCHOULI')) return 'HDPE Drum 25 Kg';
  if (form.includes('POWDER'))    return 'Kraft Paper Bag 25 Kg';
  return 'PP Woven Bag 25 Kg';
}

export const LogisticsHandoff: React.FC<LogisticsHandoffProps> = ({
  rfqDraft,
  onChangeTab
}) => {
  const [isProcessing, setIsProcessing]       = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [handoffPayload, setHandoffPayload]   = useState<any>(null);

  const handleSendToInTradeX = () => {
    setIsProcessing(true);
    setProcessingStatus('Packaging botanical RFQ payload constraints...');

    const rfqId = `RFQ-${Math.floor(10000 + Math.random() * 90000)}`;
    const volMT = parseFloat(rfqDraft?.volume || '5');

    setTimeout(() => setProcessingStatus('Encrypting specification parameters for MIG ecosystem bridge...'), 1200);
    setTimeout(() => setProcessingStatus('Writing handoff payload to InTradeX execution layer...'), 2400);

    setTimeout(() => {
      const payload = {
        version: '1.0',
        source: 'thinkspices',
        timestamp: new Date().toISOString(),
        rfqId,
        // Commodity identifiers
        commodityName: rfqDraft?.commodityName || 'CASSIA',
        varietyName:   rfqDraft?.varietyName   || 'STANDARD',
        productForm:   rfqDraft?.productForm   || 'WHOLE',
        // InTradeX-ready keys (map directly to COMMODITY_FOB_MASTER / PACKAGING_MASTER)
        intradexCommodityKey: toIntradexCommodityKey(rfqDraft?.commodityName, rfqDraft?.productForm),
        defaultPackaging:     toDefaultPackaging(rfqDraft?.commodityName, rfqDraft?.productForm),
        // Volume & price
        volumeMT:            volMT,
        volumeKg:            volMT * 1000,
        targetPriceUsdPerKg: parseFloat(rfqDraft?.targetPrice || '3'),
        // Logistics
        destinationPort:    rfqDraft?.destinationPort || 'Rotterdam, Netherlands',
        destinationCountry: (rfqDraft?.destinationPort || 'Rotterdam, Netherlands').split(',').pop()?.trim() || 'Netherlands',
        loadingPort:        'Tanjung Priok, Jakarta',
        // Parties
        exporterName: rfqDraft?.exporterName || 'PT ARCHIPELAGO SPICES INDONESIA',
        buyerCompany: rfqDraft?.companyName  || '',
        buyerEmail:   rfqDraft?.email        || '',
        // Compliance & scoring
        certsRequired:           rfqDraft?.certsRequired           || [],
        sourcingConfidenceScore: rfqDraft?.sourcingConfidenceScore || 0,
        rfqReadinessScore:       rfqDraft?.rfqReadinessScore       || 0,
        notes: rfqDraft?.notes || '',
      };

      // ── MIG ECOSYSTEM BRIDGE: write to localStorage for InTradeX to pick up ──
      localStorage.setItem('mig_rfq_handoff', JSON.stringify(payload));

      setHandoffPayload(payload);
      setIsProcessing(false);
      setShowConfirmModal(true);
    }, 3600);
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="font-mono text-[9px] uppercase tracking-widest text-accent-blue bg-accent-blue/10 border border-accent-blue/30 px-3 py-1 rounded inline-block font-bold">
          INTRADEX™ HANDOFF GATEWAY ACTIVE
        </span>
        <h2 className="font-display font-bold text-xl text-text-primary uppercase tracking-tight">
          SEND RFQ TO INTRADEX™
        </h2>
        <p className="font-mono text-[10px] text-text-muted uppercase">
          ThinkSpices™ Demand Layer → InTradeX™ Execution Layer · MIG Ecosystem Bridge
        </p>
      </div>

      {/* RFQ summary bar */}
      {rfqDraft ? (
        <div className="bg-accent-gold/5 border border-accent-gold/25 p-4 rounded-xl max-w-3xl mx-auto flex items-center justify-between font-mono text-xs gap-4">
          <div className="space-y-1">
            <span className="text-accent-gold font-bold">✓ TECHNICAL RFQ CONTRACT READY FOR HANDOFF:</span>
            <span className="block text-text-secondary text-[11px]">
              {rfqDraft.commodityName} {rfqDraft.productForm} · {rfqDraft.volume} MT → {rfqDraft.destinationPort}
              {rfqDraft.sourcingConfidenceScore ? ` · Confidence: ${rfqDraft.sourcingConfidenceScore}/100` : ''}
            </span>
          </div>
          <span className="text-bg-primary bg-accent-gold px-2.5 py-1 text-[10px] font-bold rounded shrink-0">
            DRAFT SECURED
          </span>
        </div>
      ) : (
        <div className="bg-accent-red/5 border border-accent-red/30 p-4 rounded-xl max-w-3xl mx-auto text-center font-mono text-xs text-accent-red">
          ⚠ No RFQ draft found. Complete the Sourcing Wizard or Technical RFQ Portal first.
        </div>
      )}

      {/* Responsibility matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

        {/* ThinkSpices scope */}
        <div className="border border-accent-gold bg-bg-secondary p-6 rounded-xl space-y-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-accent-gold/15 flex items-center justify-center font-display font-bold text-accent-gold">TS</div>
            <div>
              <h3 className="font-display font-semibold text-sm text-text-primary uppercase tracking-wider">THINKSPICES™ SCOPE</h3>
              <span className="font-mono text-[9px] text-text-muted uppercase">DEMAND GENERATION LAYER</span>
            </div>
          </div>
          <p className="text-text-secondary text-xs leading-relaxed">
            Botanical research, SNI quality specifications, volatile oil certifications, supplier audit records, and indicative FOB price indicators — before any cargo commitment.
          </p>
          <div className="space-y-2 font-mono text-xs border-t border-border-default pt-4">
            {[
              'Botanical Spec Verification',
              'Supplier Verification & Audit Records',
              'FOB Benchmark Pricing',
              'RFQ Contract Formulation',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-accent-gold">
                <CheckCircle2 size={12} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border-default/60 pt-3 space-y-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted block">NOT IN SCOPE:</span>
            {['Pricing engine (FOB/CIF/DDP)', 'Export documentation', 'Trade execution'].map(item => (
              <div key={item} className="flex items-center gap-1.5 font-mono text-[11px] text-text-muted">
                <span className="text-accent-red font-bold">✕</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* InTradeX scope */}
        <div className="border border-accent-blue bg-bg-secondary p-6 rounded-xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-accent-blue/15 flex items-center justify-center font-display font-bold text-[#3498DB]">IX</div>
            <div>
              <h3 className="font-display font-semibold text-sm text-text-primary uppercase tracking-wider">INTRADEX™ SCOPE</h3>
              <span className="font-mono text-[9px] text-[#5D99C2] uppercase">TRADE EXECUTION LAYER</span>
            </div>
          </div>
          <p className="text-text-secondary text-xs leading-relaxed">
            Receives the qualified RFQ from ThinkSpices and executes all trade operations: pricing, export documentation, compliance verification, and shipment coordination.
          </p>
          <div className="space-y-2 font-mono text-xs border-t border-border-default pt-4">
            {[
              'Incoterms Pricing Engine (FOB / CIF / DDP)',
              'Export Documentation Suite (6 doc types)',
              'Global Compliance Data',
              'AI Export Advisory',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-[#3498DB]">
                <span className="font-mono font-bold">◈</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border-default/60 pt-3">
            <span className="font-mono text-[9px] uppercase tracking-wider text-accent-blue block mb-1">RECEIVES FROM THINKSPICES:</span>
            <span className="font-mono text-[11px] text-text-secondary">
              Commodity · Volume · Destination · Exporter · Certifications · Scores
            </span>
          </div>
        </div>

      </div>

      {/* Workflow pipeline */}
      <div className="max-w-3xl mx-auto bg-bg-secondary border border-border-default rounded-xl p-5">
        <p className="font-mono text-[9px] uppercase tracking-widest text-text-muted mb-4 text-center">END-TO-END HANDOFF PIPELINE</p>
        <div className="flex items-center justify-between gap-1.5 text-center flex-wrap">
          {[
            { label: 'Sourcing Wizard', sub: 'ThinkSpices', accent: 'border-accent-gold/60 text-accent-gold' },
            { label: 'RFQ Portal', sub: 'ThinkSpices', accent: 'border-accent-gold/60 text-accent-gold' },
            { label: 'MIG Bridge', sub: 'localStorage', accent: 'border-text-muted/40 text-text-muted' },
            { label: 'RFQ Inbox', sub: 'InTradeX', accent: 'border-accent-blue/60 text-[#3498DB]' },
            { label: 'Pricing Engine', sub: 'InTradeX', accent: 'border-accent-blue/60 text-[#3498DB]' },
            { label: 'Documents', sub: 'InTradeX', accent: 'border-accent-blue/60 text-[#3498DB]' },
          ].map((step, i, arr) => (
            <React.Fragment key={step.label}>
              <div className={`border ${step.accent} rounded px-2.5 py-1.5 shrink-0`}>
                <div className="font-mono font-bold text-[10px]">{step.label}</div>
                <div className="font-mono text-[8px] opacity-60">{step.sub}</div>
              </div>
              {i < arr.length - 1 && <ArrowRight size={11} className="text-text-muted shrink-0 hidden sm:block" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col items-center gap-4 pt-2 max-w-md mx-auto">
        <button
          onClick={handleSendToInTradeX}
          disabled={isProcessing || !rfqDraft}
          className="w-full py-3.5 bg-accent-blue hover:bg-opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-bg-primary px-6 rounded font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg border border-accent-blue"
          id="intradex-launch-button"
        >
          {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
          <span>{isProcessing ? 'PREPARING HANDOFF...' : 'SEND RFQ TO INTRADEX™ →'}</span>
        </button>

        <button
          onClick={() => onChangeTab('dashboard')}
          className="w-full py-3 border border-border-default hover:border-text-secondary text-text-secondary hover:text-text-primary rounded font-mono text-xs uppercase transition-colors flex items-center justify-center gap-1.5"
          id="intradex-return-button"
        >
          <Undo2 size={13} />
          <span>Return to Dashboard</span>
        </button>
      </div>

      {/* Processing overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-bg-primary/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in">
          <div className="bg-bg-secondary border border-accent-blue rounded-xl p-8 max-w-sm text-center space-y-4 shadow-2xl">
            <RefreshCw size={24} className="animate-spin text-accent-blue mx-auto" />
            <h4 className="font-display font-bold text-xs text-text-primary uppercase tracking-widest">
              PREPARING ECOSYSTEM TRANSFER
            </h4>
            <p className="font-mono text-[10px] text-text-muted mt-2 tracking-wide leading-relaxed">
              {processingStatus}
            </p>
          </div>
        </div>
      )}

      {/* Handoff success modal */}
      {showConfirmModal && handoffPayload && (
        <div className="fixed inset-0 bg-bg-primary/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in">
          <div className="bg-bg-secondary border border-accent-blue rounded-xl p-8 max-w-lg w-full space-y-6 shadow-2xl">

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-accent-blue/10 text-[#3498DB] flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="font-display font-bold text-sm text-text-primary uppercase tracking-widest">
                RFQ HANDED OFF TO INTRADEX™
              </h4>
              <p className="font-mono text-[9px] text-accent-blue uppercase font-bold">
                MIG Ecosystem Bridge · Transfer Complete
              </p>
            </div>

            <div className="bg-bg-primary border border-border-default/60 rounded p-4 font-mono text-[11px] space-y-2.5 text-text-secondary">
              {[
                { label: 'HANDOFF ID', value: handoffPayload.rfqId, className: 'text-accent-gold font-bold' },
                { label: 'COMMODITY', value: `${handoffPayload.commodityName} ${handoffPayload.productForm} · ${handoffPayload.varietyName}` },
                { label: 'VOLUME', value: `${handoffPayload.volumeMT} MT (${handoffPayload.volumeKg.toLocaleString()} kg)` },
                { label: 'DESTINATION', value: handoffPayload.destinationPort },
                { label: 'EXPORTER', value: handoffPayload.exporterName },
                { label: 'INTRADEX KEY', value: handoffPayload.intradexCommodityKey, className: 'text-accent-blue' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-start gap-3 border-b border-border-default/30 pb-1.5 last:border-0 last:pb-0">
                  <span className="text-text-muted text-[9px] uppercase tracking-wider shrink-0">{row.label}:</span>
                  <span className={`text-right ${row.className || 'text-text-primary'} font-medium`}>{row.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-accent-blue/5 border border-accent-blue/20 rounded p-3">
              <p className="font-mono text-[9px] uppercase tracking-wider text-accent-blue font-bold mb-2">INTRADEX™ WILL PROCESS:</p>
              <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-text-secondary">
                {['FOB/CIF/DDP Pricing', 'Export Documents', 'Compliance Check'].map(cap => (
                  <div key={cap} className="flex items-center gap-1">
                    <span className="text-[#3498DB]">◈</span> {cap}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-text-secondary leading-relaxed text-center font-mono">
              Open <strong>InTradeX™</strong> and navigate to the <strong>RFQ Inbox</strong> tab to load this package directly into the pricing engine and document generator.
            </p>

            <button
              onClick={() => setShowConfirmModal(false)}
              className="w-full py-2.5 bg-accent-blue text-bg-primary hover:bg-opacity-90 font-mono font-bold text-[11px] tracking-widest uppercase rounded cursor-pointer transition-colors shadow border border-accent-blue"
            >
              Acknowledged — Back to Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
