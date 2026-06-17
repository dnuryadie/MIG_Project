import {
  Leaf, TrendingUp, TrendingDown, Package, FileText, Ship, Users, Activity,
  ArrowRight, CheckCircle, Clock, AlertCircle, BarChart3, Globe2, RefreshCw,
  DollarSign, Zap, Shield
} from 'lucide-react';
import { SUPPLIER_CATALOG } from '@workspace/supplier-catalog';

const now = new Date();
const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const fmtTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const KPI_CARDS = [
  {
    label: 'Active RFQs',
    value: '47',
    sub: '+8 this week',
    trend: 'up',
    icon: FileText,
    color: 'amber',
    source: 'ThinkSpices',
  },
  {
    label: 'Verified Suppliers',
    value: String(SUPPLIER_CATALOG.filter(s => s.isVerified).length),
    sub: 'MIG-accredited exporters',
    trend: 'up',
    icon: Shield,
    color: 'emerald',
    source: 'ThinkSpices',
  },
  {
    label: 'Market Opportunities',
    value: '23',
    sub: 'Favorable conditions',
    trend: 'up',
    icon: TrendingUp,
    color: 'blue',
    source: 'Both Platforms',
  },
  {
    label: 'Export Transactions',
    value: '156',
    sub: 'This month',
    trend: 'up',
    icon: Package,
    color: 'indigo',
    source: 'InTradeX',
  },
  {
    label: 'Active Shipments',
    value: '34',
    sub: '3 need attention',
    trend: 'neutral',
    icon: Ship,
    color: 'violet',
    source: 'InTradeX',
  },
];

const RECENT_RFQS = [
  { id: 'RFQ-8821', buyer: 'Spice Global BV', commodity: 'Lampung Black Pepper', volume: '20 MT', value: '$109,000', status: 'awaiting_quote', age: '2h ago', priority: 'high' },
  { id: 'RFQ-8820', buyer: 'Atlas Commodities', commodity: 'Banda Nutmeg AA', volume: '5 MT', value: '$34,100', status: 'quoted', age: '5h ago', priority: 'normal' },
  { id: 'RFQ-8819', buyer: 'EuroSpice GmbH', commodity: 'Vera AA Cassia', volume: '50 MT', value: '$182,500', status: 'negotiating', age: '1d ago', priority: 'high' },
  { id: 'RFQ-8818', buyer: 'Tokyo Fine Foods', commodity: 'Sulawesi Clove', volume: '8 MT', value: '$63,200', status: 'awarded', age: '2d ago', priority: 'normal' },
  { id: 'RFQ-8817', buyer: 'Herbal World Ltd', commodity: 'Java Long Pepper', volume: '3 MT', value: '$9,750', status: 'awarded', age: '3d ago', priority: 'low' },
  { id: 'RFQ-8816', buyer: 'Naturex SA', commodity: 'Turmeric Finger Grade A', volume: '30 MT', value: '$42,000', status: 'closed', age: '4d ago', priority: 'normal' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  awaiting_quote: { label: 'Awaiting Quote', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  quoted:         { label: 'Quoted', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  negotiating:    { label: 'Negotiating', color: 'bg-violet-100 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
  awarded:        { label: 'Awarded', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  closed:         { label: 'Closed', color: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
};

const COMMODITY_PRICES = [
  { name: 'Lampung Black Pepper', grade: 'ASTA', spot: 4820, change: +0.8, unit: 'MT', flag: '🇮🇩' },
  { name: 'Banda Nutmeg Kernels', grade: 'ABCD', spot: 6820, change: -1.2, unit: 'MT', flag: '🇮🇩' },
  { name: 'Vera AA Cassia', grade: 'Whole', spot: 3650, change: +1.4, unit: 'MT', flag: '🇮🇩' },
  { name: 'Sulawesi Clove', grade: 'Lal Pari FAQ', spot: 6900, change: +2.4, unit: 'MT', flag: '🇮🇩' },
  { name: 'Muntok White Pepper', grade: 'Premium', spot: 6750, change: -0.5, unit: 'MT', flag: '🇮🇩' },
  { name: 'Java Long Pepper', grade: 'Dried', spot: 3250, change: +0.3, unit: 'MT', flag: '🇮🇩' },
];

const EXPORT_TRANSACTIONS = [
  { id: 'IX-2847', exporter: 'PT Archipelago Spices', destination: 'Hamburg, Germany', commodity: 'Black Pepper', value: '$218,400', incoterm: 'CIF', status: 'in_transit', eta: 'Jun 28' },
  { id: 'IX-2846', exporter: 'CV Priangan Cloves', destination: 'Rotterdam, Netherlands', commodity: 'Clove', value: '$87,300', incoterm: 'FOB', status: 'docs_ready', eta: 'Jul 3' },
  { id: 'IX-2845', exporter: 'PT Nusantara Spices', destination: 'Tokyo, Japan', commodity: 'Nutmeg', value: '$41,820', incoterm: 'DDP', status: 'customs', eta: 'Jun 25' },
  { id: 'IX-2844', exporter: 'Bali Spice Export', destination: 'Los Angeles, USA', commodity: 'Cassia', value: '$126,750', incoterm: 'CIF', status: 'delivered', eta: 'Delivered' },
  { id: 'IX-2843', exporter: 'Aceh Pepper Group', destination: 'Dubai, UAE', commodity: 'White Pepper', value: '$54,000', incoterm: 'FOB', status: 'in_transit', eta: 'Jul 8' },
];

const SHIPMENT_STATUS: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  in_transit: { label: 'In Transit', color: 'text-blue-600 bg-blue-50', icon: Ship },
  docs_ready: { label: 'Docs Ready', color: 'text-amber-600 bg-amber-50', icon: FileText },
  customs:    { label: 'Customs', color: 'text-violet-600 bg-violet-50', icon: Clock },
  delivered:  { label: 'Delivered', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle },
};

const MARKET_OPPORTUNITIES = [
  { commodity: 'Lampung Black Pepper', signal: 'BUY', reason: 'Harvest season begins Aug — pre-season pricing 6% below 12-month avg', urgency: 'high', potential: '+12% margin' },
  { commodity: 'Banda Nutmeg AA', signal: 'WATCH', reason: 'Supply tightening from Maluku. 3 major exporters reporting lower stock.', urgency: 'medium', potential: '+8% margin' },
  { commodity: 'Vera AA Cassia', signal: 'SELL', reason: 'Spot price elevated +14% above 90-day avg. Strong European demand.', urgency: 'high', potential: '+14% margin' },
];

function KpiCard({ card }: { card: typeof KPI_CARDS[0] }) {
  const Icon = card.icon;
  const colorMap: Record<string, string> = {
    amber:  'bg-amber-50 text-amber-600 ring-amber-200',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-200',
    blue:   'bg-blue-50 text-blue-600 ring-blue-200',
    indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-200',
    violet: 'bg-violet-50 text-violet-600 ring-violet-200',
  };
  const badgeColor: Record<string, string> = {
    amber:  'bg-amber-500',
    emerald: 'bg-emerald-500',
    blue:   'bg-blue-500',
    indigo: 'bg-indigo-500',
    violet: 'bg-violet-500',
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3 hover:shadow-lg transition-all duration-200 hover:border-slate-300">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ring-1 ${colorMap[card.color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-full border border-slate-200">
          {card.source}
        </span>
      </div>
      <div>
        <div className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</div>
        <div className="text-sm font-medium text-slate-500 mt-0.5">{card.label}</div>
      </div>
      <div className="flex items-center gap-1.5">
        {card.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
        {card.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
        {card.trend === 'neutral' && <Activity className="w-3.5 h-3.5 text-amber-500" />}
        <span className={`text-xs font-medium ${card.trend === 'up' ? 'text-emerald-600' : card.trend === 'down' ? 'text-red-600' : 'text-amber-600'}`}>
          {card.sub}
        </span>
      </div>
    </div>
  );
}

export function EcosystemDashboard() {
  const lastUpdated = fmtTime(now);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Dashboard Header */}
      <div className="bg-slate-900 border-b border-slate-700 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded flex items-center justify-center">
                  <Leaf className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">MIG Ecosystem</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Ecosystem Overview</h1>
              <p className="text-slate-400 text-sm mt-1">Unified activity across ThinkSpices™ &amp; InTradeX™ · {fmtDate(now)}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-400">Both platforms live</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                <RefreshCw className="w-3 h-3" />
                Updated {lastUpdated}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">

        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {KPI_CARDS.map((card) => (
            <KpiCard key={card.label} card={card} />
          ))}
        </div>

        {/* Platform Status + Market Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Platform Status */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              Platform Status
            </h2>
            <div className="space-y-4">
              {/* ThinkSpices */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-sm text-amber-900">ThinkSpices™</span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    LIVE
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    { label: 'Open RFQs', value: '47' },
                    { label: 'Suppliers', value: '852' },
                    { label: 'AI Sessions', value: '214' },
                    { label: 'Users Online', value: '38' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white/70 rounded-lg px-3 py-2 border border-amber-100">
                      <div className="text-base font-black text-amber-900">{stat.value}</div>
                      <div className="text-[10px] text-amber-700 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <a href="/thinkspices/" className="mt-3 flex items-center gap-1 text-xs text-amber-700 font-semibold hover:text-amber-900 transition-colors">
                  Open ThinkSpices <ArrowRight className="w-3 h-3" />
                </a>
              </div>

              {/* InTradeX */}
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <span className="text-[10px] font-black text-white">IX</span>
                    </div>
                    <span className="font-bold text-sm text-indigo-900">InTradeX™</span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    LIVE
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    { label: 'Transactions', value: '156' },
                    { label: 'In Transit', value: '34' },
                    { label: 'Docs Generated', value: '289' },
                    { label: 'Pro Users', value: '61' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white/70 rounded-lg px-3 py-2 border border-indigo-100">
                      <div className="text-base font-black text-indigo-900">{stat.value}</div>
                      <div className="text-[10px] text-indigo-700 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <a href="/intradex/" className="mt-3 flex items-center gap-1 text-xs text-indigo-700 font-semibold hover:text-indigo-900 transition-colors">
                  Open InTradeX <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Market Opportunities */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Market Opportunities
            </h2>
            <div className="space-y-3">
              {MARKET_OPPORTUNITIES.map((opp) => {
                const signalColor = opp.signal === 'BUY' ? 'bg-emerald-500 text-white' :
                                    opp.signal === 'SELL' ? 'bg-blue-500 text-white' :
                                    'bg-amber-500 text-white';
                const urgencyColor = opp.urgency === 'high' ? 'text-red-500' : 'text-amber-500';
                return (
                  <div key={opp.commodity} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black tracking-wider shrink-0 ${signalColor}`}>
                        {opp.signal}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-sm text-slate-900">{opp.commodity}</span>
                          <span className={`text-[10px] font-bold uppercase ${urgencyColor}`}>
                            {opp.urgency === 'high' ? '● High Priority' : '◐ Watch'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{opp.reason}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {opp.potential}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Commodity Price Snapshot */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                  Live FOB Spot Prices
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">USD/MT</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[400px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Commodity</th>
                      <th className="pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-right">Spot</th>
                      <th className="pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-right">Chg%</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {COMMODITY_PRICES.map((c) => (
                      <tr key={c.name} className="hover:bg-slate-50">
                        <td className="py-2 pr-4">
                          <div className="flex items-center gap-1.5">
                            <span>{c.flag}</span>
                            <div>
                              <div className="text-xs font-semibold text-slate-800">{c.name}</div>
                              <div className="text-[10px] text-slate-400">{c.grade}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 text-right">
                          <span className="text-xs font-bold text-slate-900">${c.spot.toLocaleString()}</span>
                        </td>
                        <td className="py-2 text-right">
                          <span className={`text-xs font-bold flex items-center justify-end gap-0.5 ${c.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {c.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {c.change > 0 ? '+' : ''}{c.change}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Active RFQs Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              Active RFQs — ThinkSpices
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Showing recent 6</span>
              <a href="/thinkspices/" className="text-xs font-semibold text-amber-600 hover:text-amber-800 flex items-center gap-1 transition-colors">
                View all in ThinkSpices <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['RFQ ID', 'Buyer', 'Commodity', 'Volume', 'Est. Value', 'Status', 'Age'].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {RECENT_RFQS.map((rfq) => {
                  const st = STATUS_CONFIG[rfq.status];
                  return (
                    <tr key={rfq.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-xs font-black text-amber-600 font-mono">{rfq.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-slate-800">{rfq.buyer}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-700">{rfq.commodity}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-slate-700">{rfq.volume}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-slate-900">{rfq.value}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${st.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] text-slate-400">{rfq.age}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Transactions + Shipment Status */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Ship className="w-4 h-4 text-indigo-500" />
              Export Transactions &amp; Shipment Status — InTradeX
            </h2>
            <a href="/intradex/" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
              Manage in InTradeX <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[680px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['TX ID', 'Exporter', 'Destination', 'Commodity', 'Value', 'Incoterm', 'Status', 'ETA'].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {EXPORT_TRANSACTIONS.map((tx) => {
                  const st = SHIPMENT_STATUS[tx.status];
                  const Icon = st.icon;
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-xs font-black text-indigo-600 font-mono">{tx.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-slate-800">{tx.exporter}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Globe2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="text-xs text-slate-600">{tx.destination}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-700">{tx.commodity}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-slate-900">{tx.value}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">{tx.incoterm}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold ${st.color}`}>
                          <Icon className="w-3 h-3" />
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold ${tx.eta === 'Delivered' ? 'text-emerald-600' : 'text-slate-700'}`}>{tx.eta}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 pb-6 border-t border-slate-200 text-xs text-slate-400">
          <span className="font-mono">MIG Ecosystem Dashboard · Magastu Indoprime Group · Jakarta, Indonesia</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> BARANTIN Accredited</span>
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-blue-500" /> SNI 2026</span>
            <span className="flex items-center gap-1"><Globe2 className="w-3.5 h-3.5 text-slate-400" /> 45 Countries</span>
          </div>
        </div>

      </div>
    </div>
  );
}
