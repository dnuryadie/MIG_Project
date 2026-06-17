import React, { useState } from 'react';
import { CheckCircle, Package, FileText, Trash2, ArrowRight, Clock, BarChart2, Shield } from 'lucide-react';

interface RfqHandoff {
  version: string;
  source: string;
  timestamp: string;
  rfqId: string;
  commodityName: string;
  varietyName: string;
  productForm: string;
  intradexCommodityKey: string;
  defaultPackaging: string;
  volumeMT: number;
  volumeKg: number;
  targetPriceUsdPerKg: number;
  destinationPort: string;
  destinationCountry: string;
  loadingPort: string;
  exporterName: string;
  buyerCompany: string;
  buyerEmail: string;
  certsRequired: string[];
  sourcingConfidenceScore: number;
  rfqReadinessScore: number;
  notes: string;
}

interface RfqInboxProps {
  handoff: RfqHandoff | null;
  onLoadToPricing: (params: {
    commodity: string;
    volume: number;
    packType: string;
    country: string;
    destinationPort: string;
    exchangeRate: number;
  }) => void;
  onGoToDocs: () => void;
  onDismiss: () => void;
}

export default function RfqInbox({ handoff, onLoadToPricing, onGoToDocs, onDismiss }: RfqInboxProps) {
  const [loadedToPricing, setLoadedToPricing] = useState(false);

  const handleLoadToPricing = () => {
    if (!handoff) return;
    onLoadToPricing({
      commodity:       handoff.intradexCommodityKey,
      volume:          handoff.volumeKg,
      packType:        handoff.defaultPackaging,
      country:         handoff.destinationCountry,
      destinationPort: handoff.destinationPort,
      exchangeRate:    16500,
    });
    setLoadedToPricing(true);
  };

  const receivedAt = handoff
    ? new Date(handoff.timestamp).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
    : '';

  // ── EMPTY STATE ──
  if (!handoff) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-5">
        <div className="w-16 h-16 bg-[#1e2636] border border-[#334155] rounded-2xl flex items-center justify-center">
          <Package className="w-8 h-8 text-slate-600" />
        </div>
        <div>
          <h3 className="font-extrabold text-white text-lg mb-1">No Pending RFQ</h3>
          <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
            When a buyer finalises an RFQ in <span className="text-amber-400 font-semibold">ThinkSpices™</span> and sends it here,
            it will appear in this inbox ready to price and document.
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2 text-xs font-mono text-slate-500">
          <div className="px-3 py-1.5 bg-[#1e2636] border border-[#334155] rounded-full text-amber-400">ThinkSpices™</div>
          <ArrowRight className="w-3.5 h-3.5" />
          <div className="px-3 py-1.5 bg-[#1e2636] border border-emerald-900 rounded-full text-emerald-400">RFQ Inbox</div>
          <ArrowRight className="w-3.5 h-3.5" />
          <div className="px-3 py-1.5 bg-[#1e2636] border border-[#334155] rounded-full">Incoterms</div>
          <ArrowRight className="w-3.5 h-3.5" />
          <div className="px-3 py-1.5 bg-[#1e2636] border border-[#334155] rounded-full">Documents</div>
        </div>
      </div>
    );
  }

  // ── ACTIVE HANDOFF ──
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
              Incoming RFQ from ThinkSpices™ · Demand Generation Layer
            </span>
          </div>
          <h2 className="font-extrabold text-xl text-white tracking-tight">RFQ Inbox</h2>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 bg-[#1e2636] border border-[#334155] px-3 py-1.5 rounded-full">
          <Clock className="w-3.5 h-3.5" />
          Received {receivedAt}
        </div>
      </div>

      {/* RFQ ID + source badge */}
      <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-center">
            <span className="font-black text-sm text-amber-400 font-display">TS</span>
          </div>
          <div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Handoff ID</p>
            <p className="font-black text-emerald-400 text-base tracking-wide font-display">{handoff.rfqId}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 bg-emerald-900/40 border border-emerald-800 text-emerald-400 text-[10px] font-mono font-bold rounded-full">
            ✓ Sourcing Confidence: {handoff.sourcingConfidenceScore}/100
          </span>
          <span className="px-2.5 py-1 bg-blue-900/40 border border-blue-800 text-blue-400 text-[10px] font-mono font-bold rounded-full">
            ✓ RFQ Readiness: {handoff.rfqReadinessScore}/100
          </span>
        </div>
      </div>

      {/* Main data grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Commodity card */}
        <div className="bg-[#161b27] border border-[#2d3748] rounded-xl p-5 space-y-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-amber-400" /> Commodity Details
          </h4>
          <div className="space-y-2.5 font-mono text-[12px]">
            {[
              { label: 'Commodity',     value: handoff.commodityName },
              { label: 'Variety',       value: handoff.varietyName },
              { label: 'Product Form',  value: handoff.productForm },
              { label: 'InTradeX Key',  value: handoff.intradexCommodityKey,  cls: 'text-emerald-400 font-bold' },
              { label: 'Packaging',     value: handoff.defaultPackaging,       cls: 'text-blue-400' },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center border-b border-[#1e293b] pb-2 last:border-0 last:pb-0">
                <span className="text-slate-500 text-[10px] uppercase tracking-wider">{row.label}</span>
                <span className={row.cls || 'text-white'}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Volume & pricing card */}
        <div className="bg-[#161b27] border border-[#2d3748] rounded-xl p-5 space-y-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
            <BarChart2 className="w-3.5 h-3.5 text-blue-400" /> Volume & Pricing
          </h4>
          <div className="space-y-2.5 font-mono text-[12px]">
            {[
              { label: 'Volume (MT)',    value: `${handoff.volumeMT} MT` },
              { label: 'Volume (kg)',    value: `${handoff.volumeKg.toLocaleString()} kg`,          cls: 'text-emerald-400 font-bold' },
              { label: 'Target Price',  value: `USD ${handoff.targetPriceUsdPerKg.toFixed(2)}/kg` },
              { label: 'Est. FOB Value',value: `USD ${(handoff.targetPriceUsdPerKg * handoff.volumeKg).toLocaleString()}` },
              { label: 'Loading Port',  value: handoff.loadingPort },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center border-b border-[#1e293b] pb-2 last:border-0 last:pb-0">
                <span className="text-slate-500 text-[10px] uppercase tracking-wider">{row.label}</span>
                <span className={row.cls || 'text-white'}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logistics card */}
        <div className="bg-[#161b27] border border-[#2d3748] rounded-xl p-5 space-y-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
            <ArrowRight className="w-3.5 h-3.5 text-indigo-400" /> Logistics
          </h4>
          <div className="space-y-2.5 font-mono text-[12px]">
            {[
              { label: 'Destination Port',    value: handoff.destinationPort },
              { label: 'Destination Country', value: handoff.destinationCountry },
              { label: 'Exporter',            value: handoff.exporterName },
              { label: 'Buyer Company',       value: handoff.buyerCompany || '—' },
              { label: 'Buyer Email',         value: handoff.buyerEmail   || '—' },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-start border-b border-[#1e293b] pb-2 last:border-0 last:pb-0 gap-3">
                <span className="text-slate-500 text-[10px] uppercase tracking-wider shrink-0">{row.label}</span>
                <span className="text-white text-right max-w-[220px] break-words">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance & certs card */}
        <div className="bg-[#161b27] border border-[#2d3748] rounded-xl p-5 space-y-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" /> Compliance Requirements
          </h4>
          {handoff.certsRequired && handoff.certsRequired.length > 0 ? (
            <div className="space-y-2">
              {handoff.certsRequired.map((cert: string) => (
                <div key={cert} className="flex items-center gap-2 font-mono text-[12px] text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 font-mono text-[11px]">No specific certifications requested.</p>
          )}
          {handoff.notes && (
            <div className="border-t border-[#1e293b] pt-3">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Buyer Notes</p>
              <p className="text-slate-300 text-[12px] font-mono leading-relaxed">{handoff.notes}</p>
            </div>
          )}
        </div>

      </div>

      {/* Score bar */}
      <div className="bg-[#161b27] border border-[#2d3748] rounded-xl p-5">
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-4">ThinkSpices Quality Scores</p>
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: 'Sourcing Confidence', score: handoff.sourcingConfidenceScore, color: 'bg-amber-500' },
            { label: 'RFQ Readiness',       score: handoff.rfqReadinessScore,       color: 'bg-emerald-500' },
          ].map(({ label, score, color }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-mono text-slate-400">{label}</span>
                <span className="text-[13px] font-black text-white">{score}<span className="text-slate-500 font-normal">/100</span></span>
              </div>
              <div className="w-full bg-[#1e293b] rounded-full h-2">
                <div className={`${color} h-2 rounded-full transition-all duration-700`} style={{ width: `${score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">

        <button
          onClick={handleLoadToPricing}
          disabled={loadedToPricing}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-indigo-400 text-white font-bold py-3.5 px-4 rounded-xl transition text-sm shadow-lg"
        >
          <BarChart2 className="w-4 h-4 shrink-0" />
          {loadedToPricing ? '✓ Loaded to Pricing' : 'Load into Pricing Engine'}
        </button>

        <button
          onClick={onGoToDocs}
          className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl transition text-sm shadow-lg"
        >
          <FileText className="w-4 h-4 shrink-0" />
          Generate Documents
        </button>

        <button
          onClick={onDismiss}
          className="flex items-center justify-center gap-2 bg-[#1e2636] hover:bg-[#263347] border border-[#334155] text-slate-400 hover:text-white font-bold py-3.5 px-4 rounded-xl transition text-sm"
        >
          <Trash2 className="w-4 h-4 shrink-0" />
          Dismiss RFQ
        </button>

      </div>

      {/* Footer note */}
      <p className="text-center font-mono text-[10px] text-slate-600">
        MIG Ecosystem Bridge · Handoff ID: {handoff.rfqId} · Source: ThinkSpices™ Demand Generation Layer
      </p>

    </div>
  );
}
