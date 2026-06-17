import { useState } from 'react';
import { Shield, MapPin, Star, Package, Globe2, ChevronDown, ChevronUp, CheckCircle, ExternalLink } from 'lucide-react';
import { SUPPLIER_CATALOG, getSuppliersByProduct, type SupplierProfile } from '@workspace/supplier-catalog';

const ALL_PRODUCTS = Array.from(
  new Set(SUPPLIER_CATALOG.flatMap((s) => s.products))
).sort();

function EqiBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] text-[#64748b] w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-[#1e2636] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[9px] font-bold text-[#94a3b8] w-6 text-right">{value}</span>
    </div>
  );
}

function SupplierCard({ supplier }: { supplier: SupplierProfile }) {
  const [expanded, setExpanded] = useState(false);

  const eqiColor =
    supplier.eqi >= 93 ? 'text-emerald-400' :
    supplier.eqi >= 87 ? 'text-blue-400' :
    'text-amber-400';

  return (
    <div className="bg-[#161b27] border border-[#2d3748] rounded-2xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-[11px] font-black text-[#e6eaf0] uppercase tracking-tight leading-tight">{supplier.name}</h3>
                {supplier.isVerified && (
                  <span className="flex items-center gap-0.5 text-[8px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded-full shrink-0">
                    <CheckCircle className="w-2.5 h-2.5" /> MIG VERIFIED
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-[#64748b] shrink-0" />
                <span className="text-[10px] text-[#94a3b8]">{supplier.origin}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Package className="w-3 h-3 text-[#64748b] shrink-0" />
                <span className="text-[10px] text-[#94a3b8]">Hub: {supplier.hub}</span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className={`text-2xl font-black font-mono ${eqiColor}`}>{supplier.eqi}</div>
            <div className="text-[8px] text-[#64748b] font-semibold uppercase tracking-wider">EQI™</div>
            <div className="text-[9px] text-[#94a3b8] mt-0.5">{supplier.experienceYears}y exp.</div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {supplier.products.map((p) => (
            <span key={p} className="text-[8px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-full uppercase">
              {p}
            </span>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="bg-[#1e2636] rounded-lg p-2 text-center">
            <div className="text-sm font-black text-white font-mono">{supplier.capacityMtPerYear.toLocaleString()}</div>
            <div className="text-[8px] text-[#64748b]">MT/year cap.</div>
          </div>
          <div className="bg-[#1e2636] rounded-lg p-2 text-center">
            <div className="text-sm font-black text-white font-mono">{supplier.moq}</div>
            <div className="text-[8px] text-[#64748b]">MT min. order</div>
          </div>
          <div className="bg-[#1e2636] rounded-lg p-2 text-center">
            <div className="text-sm font-black text-white font-mono">{supplier.certifications.length}</div>
            <div className="text-[8px] text-[#64748b]">Certifications</div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#2d3748]">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-2 flex items-center justify-between text-[10px] font-semibold text-[#94a3b8] hover:text-white hover:bg-[#1e2636] transition-colors"
        >
          <span>Full Profile</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {expanded && (
          <div className="px-4 pb-4 space-y-4 border-t border-[#2d3748] pt-3">
            <div>
              <h4 className="text-[9px] font-bold text-[#D4A017] uppercase tracking-wider mb-2">EQI™ Breakdown</h4>
              <div className="space-y-1.5">
                <EqiBar value={supplier.eqiBreakdown.experience} label="Experience" />
                <EqiBar value={supplier.eqiBreakdown.certifications} label="Certifications" />
                <EqiBar value={supplier.eqiBreakdown.fulfillment} label="Fulfillment" />
                <EqiBar value={supplier.eqiBreakdown.satisfaction} label="Satisfaction" />
                <EqiBar value={supplier.eqiBreakdown.compliance} label="Compliance" />
              </div>
            </div>

            <div>
              <h4 className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Certifications</h4>
              <div className="flex flex-wrap gap-1">
                {supplier.certifications.map((c) => (
                  <span key={c} className="text-[8px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2 flex items-center gap-1">
                <Globe2 className="w-3 h-3" /> Export Markets
              </h4>
              <div className="flex flex-wrap gap-1">
                {supplier.exportMarkets.map((m) => (
                  <span key={m} className="text-[8px] font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-full">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#1e2636] rounded-xl p-3 border border-[#2d3748]">
              <div className="text-[9px] text-[#64748b] uppercase font-bold tracking-wider mb-1">Contract Type</div>
              <div className="text-[10px] text-[#D4A017] font-bold">{supplier.contractType}</div>
            </div>

            <div className="text-[9px] text-[#64748b] italic">
              Sourced via ThinkSpices™ Verified Supplier Network · Data synced from MIG ecosystem
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface SupplierNetworkPanelProps {
  defaultCommodity?: string;
}

export default function SupplierNetworkPanel({ defaultCommodity }: SupplierNetworkPanelProps) {
  const [filter, setFilter] = useState<string>(defaultCommodity || 'ALL');

  const displayed =
    filter === 'ALL' ? SUPPLIER_CATALOG : getSuppliersByProduct(filter);

  return (
    <div className="space-y-5">
      <div className="bg-[#161b27] border border-[#2d3748] rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-indigo-400" />
              <h3 className="font-extrabold text-white text-base uppercase tracking-tight">Verified Supplier Network</h3>
            </div>
            <p className="text-[10px] text-[#94a3b8] leading-relaxed">
              MIG-verified Indonesian spice exporters sourced via ThinkSpices™. Profiles are shared across both platforms — one record, no duplicates.
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-indigo-400">{SUPPLIER_CATALOG.filter(s => s.isVerified).length}</div>
            <div className="text-[8px] text-[#64748b] uppercase tracking-wider font-bold">Verified</div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[9px] font-bold text-[#64748b] uppercase tracking-wider">Filter by product:</span>
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded-full text-[9px] font-bold transition-colors ${
              filter === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-[#1e2636] text-[#94a3b8] border border-[#2d3748] hover:text-white'
            }`}
          >
            ALL ({SUPPLIER_CATALOG.length})
          </button>
          {ALL_PRODUCTS.map((p) => {
            const count = getSuppliersByProduct(p).length;
            return (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`px-2.5 py-1 rounded-full text-[9px] font-bold transition-colors ${
                  filter === p
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#1e2636] text-[#94a3b8] border border-[#2d3748] hover:text-white'
                }`}
              >
                {p} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {displayed.length === 0 ? (
        <div className="bg-[#161b27] border border-[#2d3748] rounded-2xl p-8 text-center">
          <Star className="w-8 h-8 text-[#64748b] mx-auto mb-2" />
          <p className="text-[#94a3b8] text-sm">No verified suppliers match this commodity.</p>
          <p className="text-[#64748b] text-xs mt-1">Discover more via ThinkSpices™</p>
          <a href="/thinkspices/" className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Open ThinkSpices <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {displayed.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] text-[#64748b] border-t border-[#2d3748] pt-3">
        <span>Showing {displayed.length} of {SUPPLIER_CATALOG.length} suppliers · @workspace/supplier-catalog</span>
        <a href="/thinkspices/" className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
          Browse all in ThinkSpices™ <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
