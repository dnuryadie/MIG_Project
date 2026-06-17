import React, { useState } from "react";
import { 
  Target, 
  Cpu, 
  TrendingUp, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  AlertCircle, 
  Users, 
  ArrowUpRight, 
  Layers
} from "lucide-react";
import { ActiveTab } from "./Sidebar";
import { COMMODITIES, EXPORTERS } from "./mockData";
import { stripMarkdown } from "./stripMarkdown";

interface DashboardProps {
  onChangeTab: (tab: ActiveTab) => void;
  onSetMatcherInput: (input: string) => void;
  currentUser?: any;
  onAskAi: (message: string) => void;
}

const Divider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-1 h-3.5 rounded-full bg-accent-gold/70 shrink-0" />
    <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted font-bold whitespace-nowrap">{label}</span>
    <div className="flex-1 h-px bg-border-default/50" />
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({
  onChangeTab,
  onSetMatcherInput,
  currentUser,
  onAskAi
}) => {
  const [quickSearchInput, setQuickSearchInput] = useState("");

  const sampleShortcuts = [
    { text: "I manufacture halal spiced meat sausages", placeholder: "sausage" },
    { text: "I need raw extraction for pharmaceutical capsules", placeholder: "extract" },
    { text: "I create organic luxury woody fragrance lines", placeholder: "fragrance" },
    { text: "I manufacture instant curry noodles for European markets", placeholder: "curry" }
  ];

  const handleShortcutClick = (text: string) => {
    onSetMatcherInput(text);
    onChangeTab("app-matcher");
  };

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearchInput.trim()) return;
    onSetMatcherInput(quickSearchInput);
    onChangeTab("app-matcher");
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = currentUser?.name === "Website Administrator" ? "Administrator" : (currentUser?.name?.split(" ")[0] || "Buyer");
  const isFirstLogin = currentUser?.isNew === true || !localStorage.getItem("thinkspices_has_sourced");

  const mockRFQs = [
    { id: "RFQ-5592", commodity: "BANDA NUTMEG", volume: "5 MT", date: "2026-06-12", status: "In Review", badge: "text-amber-600 bg-amber-500/10 border-amber-500/25" },
    { id: "RFQ-5481", commodity: "KORINTJE CINNAMON", volume: "10 MT", date: "2026-06-08", status: "Price Offered", badge: "text-emerald-600 bg-emerald-500/10 border-emerald-500/25" },
    { id: "RFQ-5310", commodity: "LAMPUNG BLACK PEPPER", volume: "15 MT", date: "2026-05-24", status: "Confirmed", badge: "text-blue-600 bg-blue-500/10 border-blue-500/25" }
  ];

  const recommendations = [...COMMODITIES]
    .sort((a, b) => b.supplyIndex - a.supplyIndex)
    .slice(0, 3);

  const marketAlerts = [
    { text: "Banda Nutmeg FOB rose +2.4% this week", type: "trend" },
    { text: "Korintje Cinnamon: HIGH RESERVE — ideal spot contract window", type: "opportunity" },
    { text: "Papua Nutmeg MOQ reduced by Banda Growers Coop (now 2 MT)", type: "update" }
  ];

  return (
    <div className="space-y-7 animate-fade-in pb-12">

      {/* ── KPI CARDS ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3" id="kpi-cards-strip">
        {[
          { label: 'Spot Volume Traded', value: '12,450 MT', change: '+18.4%', up: true, sub: 'Indonesian exporters Q2', bar: 'bg-emerald-500' },
          { label: 'Verified Cooperatives', value: '184 Coops', change: '● ACTIVE', up: true, sub: 'Sumatra · Maluku · Sulawesi', bar: 'bg-accent-gold' },
          { label: 'Export Clearance', value: '3.4 Days', change: '−1.2d faster', up: true, sub: 'Custody handover index', bar: 'bg-blue-500' },
          { label: 'Indexed FOB Budget', value: '$8.40/kg', change: '+0.8%', up: false, sub: 'Blended B2B benchmark', bar: 'bg-purple-400' },
        ].map(card => (
          <div key={card.label} className="relative bg-bg-secondary border border-border-default rounded-xl p-4 hover:border-accent-gold/20 transition-colors shadow-sm overflow-hidden">
            <div className={`absolute inset-y-0 left-0 w-[3px] rounded-l-xl ${card.bar}`} />
            <p className="font-mono text-[9px] uppercase tracking-widest text-text-muted font-medium pl-3 mb-1.5 truncate">{card.label}</p>
            <p className="font-display text-xl font-bold text-text-primary tracking-tight pl-3 leading-none mb-1.5">{card.value}</p>
            <div className="pl-3 flex items-center gap-2">
              <span className={`font-mono text-[9px] font-bold ${card.up ? 'text-emerald-500' : 'text-accent-red'}`}>{card.change}</span>
            </div>
            <p className="font-mono text-[8px] text-text-muted/60 pl-3 mt-1 truncate">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ── HERO GREETING ─────────────────────────────────────────────── */}
      {!currentUser ? (
        <div className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/30 text-accent-gold font-mono text-[9px] font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
            ARCHIPELAGO AGRICULTURAL TRADE HUB
          </div>
          <h1 className="font-display font-bold text-[38px] sm:text-[48px] text-text-primary tracking-tight leading-[1.1] uppercase">
            WHAT BRINGS YOU HERE TODAY <span className="text-accent-gold font-mono inline-block font-bold gold-terminal-dot text-lg">·</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl font-normal">
            ThinkSpices™ connects global food manufacturers and pharmaceutical procurement teams with verified Indonesian spice cultivators. Map exact chemical markers, compute spot FOB benchmarks, and formulate export-ready RFQs.
          </p>
        </div>
      ) : isFirstLogin ? (
        <div className="bg-bg-secondary border border-border-default rounded-xl p-6 sm:p-8 space-y-5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-60 h-60 bg-accent-gold/4 rounded-full filter blur-3xl pointer-events-none" />
          <div className="space-y-2 relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/30 text-accent-gold font-mono text-[9px] font-bold tracking-widest uppercase">
              ● WELCOME TO THINKSPICES™
            </div>
            <h1 className="font-display font-bold text-[30px] sm:text-[38px] text-text-primary tracking-tight leading-tight uppercase">
              YOUR SOURCING TERMINAL IS READY <span className="text-accent-gold font-mono inline-block font-bold animate-pulse text-lg">·</span>
            </h1>
          </div>
          <p className="font-sans text-sm text-text-secondary leading-relaxed max-w-2xl relative">
            Welcome aboard, <strong className="text-text-primary font-semibold">{firstName}</strong>.<br />
            You're now connected to Indonesia's verified spice intelligence network. Let's find your first commodity, inspect active trade requirements, and draft premium technical RFQs today.
          </p>
          <div className="flex flex-wrap gap-3 pt-1 relative">
            <button
              onClick={() => {
                localStorage.setItem("thinkspices_has_sourced", "true");
                onChangeTab("discovery-wizard");
              }}
              className="px-5 py-2.5 bg-accent-gold hover:bg-accent-gold-soft text-bg-primary font-bold font-mono text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              Start Sourcing Wizard <ChevronRight size={13} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-bg-secondary border border-border-default rounded-xl p-6 sm:p-8 space-y-4 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/4 rounded-full filter blur-3xl pointer-events-none" />
          <div className="space-y-1 relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-accent-gold/10 border border-accent-gold/30 text-accent-gold font-mono text-[9px] font-bold tracking-widest uppercase">
              ● WELCOME BACK TO YOUR SOURCING TERMINAL
            </div>
            <h1 className="font-display font-bold text-[26px] sm:text-[32px] text-text-primary tracking-tight leading-tight uppercase">
              READY TO SOURCE YOUR NEXT INDONESIAN SPICE?
            </h1>
          </div>
          <div className="space-y-2 relative">
            <p className="font-sans text-sm text-text-secondary font-medium">
              {greeting}, <span className="text-accent-gold font-bold">{firstName}</span>. Your procurement desk is active.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono text-text-muted">
              {[
                { icon: <Clock size={10} className="text-accent-gold" />, label: <><strong>3</strong>&nbsp;open RFQs</> },
                { icon: <Users size={10} className="text-emerald-500" />, label: <><strong>2</strong>&nbsp;new exporter responses</> },
                { icon: null, label: <span className="text-emerald-500 font-bold">● JAKARTA MARKET: OPEN</span> },
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-bg-primary border border-border-default rounded-full px-2.5 py-1">
                  {item.icon}{item.label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5 pt-1 relative">
            <button
              onClick={() => onChangeTab("rfq-portal")}
              className="px-4 py-2 bg-bg-primary hover:bg-bg-input text-text-primary border border-border-default hover:border-accent-gold font-bold font-mono text-[11px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              Resume Last Session <ChevronRight size={12} />
            </button>
            <button
              onClick={() => onChangeTab("discovery-wizard")}
              className="px-4 py-2 bg-accent-gold hover:bg-accent-gold-soft text-bg-primary font-bold font-mono text-[11px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              New Sourcing Wizard <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* ── AI SOURCING PROMPT ────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-accent-gold/10 via-accent-gold/4 to-transparent border border-accent-gold/25 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm" id="premium-ai-prompt-bar">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-accent-gold animate-pulse shrink-0" />
          <h4 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-text-primary">
            AI SOURCING INTELLIGENCE
          </h4>
          <span className="font-mono text-[8px] text-accent-gold bg-accent-gold/10 border border-accent-gold/20 px-2 py-0.5 rounded-full font-bold tracking-widest uppercase">BETA</span>
        </div>
        <p className="font-sans text-xs text-text-secondary leading-relaxed max-w-2xl">
          Describe your requirements — commodity, volume, grade, application — to automatically initiate the Guided Sourcing Workflow and receive an AI-matched variety profile.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const input = form.elements.namedItem("aiQuery") as HTMLInputElement;
            if (input && input.value.trim()) {
              onAskAi(input.value.trim());
              input.value = "";
            }
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <input
            type="text"
            name="aiQuery"
            required
            placeholder='e.g., "I need 5 MT of organic nutmeg for EU market"'
            className="flex-1 px-4 py-2.5 bg-bg-input border border-border-default hover:border-text-muted focus:border-accent-gold outline-none rounded-lg text-xs text-text-primary font-mono placeholder-text-muted/50 transition-colors shadow-inner"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-accent-gold hover:bg-accent-gold-soft text-bg-primary font-bold font-mono text-xs rounded-lg transition-all uppercase shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            ASK AI <ChevronRight size={13} />
          </button>
        </form>
      </div>

      {/* ── SOURCING PIPELINES ────────────────────────────────────────── */}
      <div className="space-y-4">
        <Divider label="EXPORT SOURCING PIPELINES" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Match Engine */}
          <div
            onClick={() => onChangeTab("app-matcher")}
            className="border border-accent-gold/35 bg-accent-gold/5 hover:bg-accent-gold/8 rounded-xl p-5 transition-all duration-200 cursor-pointer hover:scale-[1.005] group relative overflow-hidden flex flex-col"
            id="entry-card-ai"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent-gold/6 rounded-full filter blur-xl pointer-events-none" />
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-accent-gold/20 border border-accent-gold/35 flex items-center justify-center text-accent-gold shrink-0">
                <Cpu size={17} className="animate-pulse" />
              </div>
              <span className="font-mono text-[8px] font-bold uppercase py-0.5 px-2 bg-accent-gold text-bg-primary rounded-full tracking-wider shrink-0">
                RECOMMENDED
              </span>
            </div>
            <h2 className="font-display font-bold text-[13px] text-text-primary uppercase tracking-tight mb-2">
              HELP ME FIND THE RIGHT SPICE
            </h2>
            <p className="text-text-secondary text-[11px] leading-relaxed mb-4 flex-1">
              Describe your product formulation and let our AI match engine identify the ideal Indonesian variety, certifications profile, and FOB budgets.
            </p>
            <span className="flex items-center gap-1 font-mono font-bold text-[10.5px] text-accent-gold group-hover:gap-1.5 transition-all">
              START MATCH ENGINE <ChevronRight size={11} />
            </span>
          </div>

          {/* Wizard */}
          <div
            onClick={() => onChangeTab("discovery-wizard")}
            className="border border-border-default hover:border-accent-gold/30 bg-bg-secondary rounded-xl p-5 transition-all duration-200 cursor-pointer hover:scale-[1.005] group flex flex-col"
            id="entry-card-wizard"
          >
            <div className="w-9 h-9 rounded-lg bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold mb-4">
              <Target size={17} />
            </div>
            <h2 className="font-display font-bold text-[13px] text-text-primary uppercase tracking-tight mb-2">
              I KNOW WHAT I NEED
            </h2>
            <p className="text-text-secondary text-[11px] leading-relaxed mb-4 flex-1">
              Configure moisture indices, active essential concentrations, SNI guidelines, and exporter escrows via our structured 7-step pipeline.
            </p>
            <span className="flex items-center gap-1 font-mono font-bold text-[10.5px] text-accent-gold group-hover:gap-1.5 transition-all">
              CONFIGURE SPECS <ChevronRight size={11} />
            </span>
          </div>

          {/* Market Hub */}
          <div
            onClick={() => onChangeTab("market")}
            className="border border-border-default hover:border-accent-gold/30 bg-bg-secondary rounded-xl p-5 transition-all duration-200 cursor-pointer hover:scale-[1.005] group flex flex-col"
            id="entry-card-market"
          >
            <div className="w-9 h-9 rounded-lg bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold mb-4">
              <TrendingUp size={17} />
            </div>
            <h2 className="font-display font-bold text-[13px] text-text-primary uppercase tracking-tight mb-2">
              I'M RESEARCHING THE MARKET
            </h2>
            <p className="text-text-secondary text-[11px] leading-relaxed mb-4 flex-1">
              Live indicator rates, harvest seasons, supply indices, and FX matrices — all on one screen.
            </p>
            <span className="flex items-center gap-1 font-mono font-bold text-[10.5px] text-accent-gold group-hover:gap-1.5 transition-all">
              VIEW MARKET HUB <ChevronRight size={11} />
            </span>
          </div>

        </div>
      </div>

      {/* ── INTELLIGENCE WIDGETS (always visible) ────────────────────── */}
      <div className="space-y-4">
        <Divider label="MARKET INTELLIGENCE & SOURCING SIGNALS" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Widget 1: Buyer Activity Summary */}
          <div className="bg-bg-secondary border border-border-default rounded-xl p-5 space-y-4 hover:border-accent-gold/20 transition-colors shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target size={13} className="text-accent-gold shrink-0" />
                <h4 className="font-display font-bold text-[11px] uppercase tracking-tight text-text-primary">Buyer Activity Summary</h4>
              </div>
              <span className="font-mono text-[8px] text-emerald-600 bg-emerald-500/8 px-2 py-0.5 border border-emerald-500/20 rounded-full font-bold uppercase tracking-wide shrink-0">
                5-Day Streak 🔥
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Recent Drafts', value: '2 Saved', cls: 'text-text-primary' },
                { label: 'Pending Bids', value: '1 In Review', cls: 'text-accent-gold' },
                { label: 'Completed', value: '4 Settled', cls: 'text-emerald-500' },
              ].map(s => (
                <div key={s.label} className="bg-bg-primary/60 border border-border-default/60 rounded-lg p-2.5 text-center">
                  <p className="font-mono text-[8px] uppercase tracking-wider text-text-muted mb-1">{s.label}</p>
                  <p className={`font-mono text-[11px] font-bold ${s.cls}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="pt-1 border-t border-border-default/50 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] uppercase text-text-muted">Q2 Sourcing Goal</span>
                <span className="font-mono text-[9px] font-bold text-text-primary">75% · 15 / 20 MT</span>
              </div>
              <div className="w-full bg-bg-tertiary h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-accent-gold to-accent-gold-soft h-full w-[75%] rounded-full" />
              </div>
            </div>
          </div>

          {/* Widget 2: Commodity Spot Watchlist */}
          <div className="bg-bg-secondary border border-border-default rounded-xl p-5 space-y-3 hover:border-accent-gold/20 transition-colors shadow-sm">
            <div className="flex items-center gap-2">
              <TrendingUp size={13} className="text-accent-gold shrink-0" />
              <h4 className="font-display font-bold text-[11px] uppercase tracking-tight text-text-primary">Commodity Spot Watchlist</h4>
            </div>
            <div className="space-y-0">
              {[
                { name: 'Nutmeg (FOB)', price: '$9,200/MT', change: '+2.4%', up: true },
                { name: 'Cinnamon (FOB)', price: '$4,300/MT', change: '−0.5%', up: false },
                { name: 'Black Pepper', price: '$5,500/MT', change: '+1.2%', up: true },
                { name: 'Clove (FOB)', price: '$7,800/MT', change: '0.0%', up: null },
              ].map((item, i) => (
                <div key={item.name} className={`flex items-center justify-between py-2 ${i < 3 ? 'border-b border-border-default/40' : ''}`}>
                  <span className="font-mono text-[9.5px] font-semibold text-text-secondary uppercase">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] font-bold text-text-primary tabular-nums">{item.price}</span>
                    <span className={`font-mono text-[8.5px] font-bold w-[42px] text-right tabular-nums ${item.up === true ? 'text-emerald-500' : item.up === false ? 'text-accent-red' : 'text-text-muted'}`}>
                      {item.change} {item.up === true ? '▲' : item.up === false ? '▼' : '▬'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 3: Archipelago Sourcing Snapshot */}
          <div className="bg-bg-secondary border border-border-default rounded-xl p-5 space-y-4 hover:border-accent-gold/20 transition-colors shadow-sm">
            <div className="flex items-center gap-2">
              <Layers size={13} className="text-accent-gold shrink-0" />
              <h4 className="font-display font-bold text-[11px] uppercase tracking-tight text-text-primary">Archipelago Sourcing Snapshot</h4>
            </div>
            <div className="space-y-0">
              {[
                { label: 'Sunda Sea Terminal Logs', value: '14% Clearance Rise', cls: 'text-emerald-500 font-bold' },
                { label: 'Barantin Customs Status', value: 'ACTIVE / EXPORT CERT', badge: true },
                { label: 'MIG Intel Server Uptime', value: '99.98% (Desk L1)', cls: 'text-text-primary font-semibold' },
              ].map((row, i, arr) => (
                <div key={row.label} className={`flex items-center justify-between py-2 ${i < arr.length - 1 ? 'border-b border-border-default/40' : ''}`}>
                  <span className="font-mono text-[9px] uppercase text-text-muted">{row.label}</span>
                  {row.badge ? (
                    <span className="text-emerald-600 bg-emerald-500/8 px-2 py-0.5 border border-emerald-500/20 rounded-full font-mono text-[8px] font-bold">
                      {row.value}
                    </span>
                  ) : (
                    <span className={`font-mono text-[10px] ${row.cls}`}>{row.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Widget 4: AI Spot Alerts */}
          <div className="bg-bg-secondary border border-border-default rounded-xl p-5 space-y-4 hover:border-accent-gold/20 transition-colors shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle size={13} className="text-accent-gold animate-pulse shrink-0" />
              <h4 className="font-display font-bold text-[11px] uppercase tracking-tight text-text-primary">AI Spot Alerts & Anomalies</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5 p-3 bg-bg-primary/40 border-l-2 border-accent-gold/50 rounded-r-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-gold mt-1.5 shrink-0 animate-pulse" />
                <p className="text-text-secondary text-[11px] leading-normal font-sans">
                  <strong className="text-accent-gold font-mono text-[9px] uppercase font-bold block mb-0.5">⚠️ Monsoon Warning — Maluku Shipping</strong>
                  Maluku shipping lanes showing high wind warnings; delay risk moderate. Consolidating shipments at Padang is advised.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── PROCUREMENT WORKSPACE (conditional: logged-in only) ───────── */}
      {currentUser && (
        <div className="space-y-4">
          <Divider label="PROCUREMENT WORKSPACE DESK" />

          {/* RFQ Tracker + Market Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            <div className="lg:col-span-8 bg-bg-secondary border border-border-default rounded-xl p-5 space-y-4 hover:border-accent-gold/20 transition-colors shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-accent-gold shrink-0" />
                  <h4 className="font-display font-bold text-[11px] uppercase tracking-tight text-text-primary">Active RFQ Tracker</h4>
                </div>
                <button
                  onClick={() => onChangeTab("rfq-portal")}
                  className="font-mono text-[9px] text-accent-gold hover:text-accent-gold-soft flex items-center gap-0.5 transition-colors"
                >
                  Manage All <ChevronRight size={10} />
                </button>
              </div>

              <div className="rounded-lg border border-border-default/50 overflow-hidden overflow-x-auto">
                <table className="w-full text-left font-mono min-w-[400px]">
                  <thead>
                    <tr className="bg-bg-primary/70 text-text-muted border-b border-border-default/60">
                      <th className="px-3 py-2 font-medium text-[9px] uppercase tracking-wider">ID</th>
                      <th className="px-3 py-2 font-medium text-[9px] uppercase tracking-wider">Commodity</th>
                      <th className="px-3 py-2 font-medium text-[9px] uppercase tracking-wider">Volume</th>
                      <th className="px-3 py-2 font-medium text-[9px] uppercase tracking-wider hidden sm:table-cell">Filed</th>
                      <th className="px-3 py-2 font-medium text-[9px] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRFQs.map((rfq, i) => (
                      <tr key={rfq.id} className={`border-b border-border-default/25 last:border-0 hover:bg-bg-primary/20 transition-colors ${i % 2 === 1 ? 'bg-bg-primary/8' : ''}`}>
                        <td className="px-3 py-2.5 text-[10px] font-bold text-accent-gold select-all">{rfq.id}</td>
                        <td className="px-3 py-2.5 text-[10.5px] text-text-primary font-semibold uppercase">{rfq.commodity}</td>
                        <td className="px-3 py-2.5 text-[10px] text-text-secondary">{rfq.volume}</td>
                        <td className="px-3 py-2.5 text-[10px] text-text-muted hidden sm:table-cell">{rfq.date}</td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold border ${rfq.badge}`}>{rfq.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-4 bg-bg-secondary border border-border-default rounded-xl p-5 space-y-4 hover:border-accent-gold/20 transition-colors shadow-sm flex flex-col">
              <div className="flex items-center gap-2">
                <AlertCircle size={13} className="text-accent-gold shrink-0" />
                <h4 className="font-display font-bold text-[11px] uppercase tracking-tight text-text-primary">Market Alerts</h4>
              </div>
              <div className="space-y-2 flex-1">
                {marketAlerts.map((alert, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 bg-bg-primary/40 border-l-2 border-accent-gold/40 rounded-r-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-gold mt-1.5 shrink-0 block" />
                    <p className="text-text-secondary text-[10.5px] leading-relaxed font-sans">
                      {stripMarkdown(alert.text)}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onChangeTab("market")}
                className="w-full py-2 bg-bg-primary hover:bg-bg-input border border-border-default hover:border-accent-gold/30 transition-colors text-text-muted hover:text-accent-gold font-mono text-[9px] font-bold uppercase rounded-lg cursor-pointer"
              >
                Live Exchange Grid →
              </button>
            </div>

          </div>

          {/* Recommendations + Exporters */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <div className="bg-bg-secondary border border-border-default rounded-xl p-5 space-y-4 hover:border-accent-gold/20 transition-colors shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-accent-gold shrink-0" />
                <h4 className="font-display font-bold text-[11px] uppercase tracking-tight text-text-primary">Sourcing Spot Recommendations</h4>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {recommendations.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSetMatcherInput(`Show complete technical report for ${c.name}`);
                      onChangeTab("app-matcher");
                    }}
                    className="p-3 bg-bg-primary/20 border border-border-default hover:border-accent-gold/30 rounded-lg transition-colors cursor-pointer group flex flex-col"
                  >
                    <span className="font-mono text-[8.5px] text-accent-gold font-bold uppercase block mb-0.5">{c.name}</span>
                    <span className="font-sans text-[9px] text-text-muted truncate block mb-3">{c.family}</span>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-mono text-[8px] text-emerald-500 bg-emerald-500/8 px-1.5 py-0.5 border border-emerald-500/20 rounded-full">
                        {c.supplyIndex}%
                      </span>
                      <ArrowUpRight size={10} className="text-text-muted group-hover:text-accent-gold transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-bg-secondary border border-border-default rounded-xl p-5 space-y-4 hover:border-accent-gold/20 transition-colors shadow-sm">
              <div className="flex items-center gap-2">
                <Users size={13} className="text-accent-gold shrink-0" />
                <h4 className="font-display font-bold text-[11px] uppercase tracking-tight text-text-primary">Verified Shipper Accounts</h4>
              </div>
              <div className="space-y-2.5">
                {EXPORTERS.slice(0, 2).map(exp => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between p-3 bg-bg-primary/40 border border-border-default hover:border-accent-gold/15 rounded-lg transition-colors"
                  >
                    <div className="min-w-0 mr-3">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <strong className="text-text-primary font-bold text-[10.5px] truncate uppercase">{exp.name}</strong>
                        <span className="font-mono text-[8px] font-bold bg-emerald-500/8 text-emerald-500 border border-emerald-500/20 rounded-full px-1.5 py-0.5 shrink-0">
                          EQI {exp.eqi}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-text-muted truncate block">{exp.hub}</span>
                    </div>
                    <button
                      onClick={() => {
                        onSetMatcherInput(`Draft a contract with ${exp.name} for nutmeg or cinnamon cargo`);
                        onChangeTab("app-matcher");
                      }}
                      className="px-3 py-1.5 bg-accent-gold hover:bg-accent-gold-soft text-bg-primary text-[9px] font-bold font-mono uppercase rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      Re-Source
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── QUICK MATCHER ─────────────────────────────────────────────── */}
      <div className="bg-bg-secondary border border-border-default rounded-xl p-6 sm:p-7 space-y-5 relative overflow-hidden" id="quick-matcher-tray">
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent-gold/3 rounded-full filter blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 relative">
          <div className="w-8 h-8 rounded-lg bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold shrink-0">
            <Sparkles size={13} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-[13px] text-text-primary uppercase tracking-wider">
              QUICK LAUNCH: DESCRIBE MY APPLICATION
            </h3>
            <p className="font-mono text-[9px] text-text-muted mt-0.5">
              Describe your use-case and the Sourcing Engine maps botanical variety scores automatically
            </p>
          </div>
        </div>

        <form onSubmit={handleQuickSearchSubmit} className="flex flex-col sm:flex-row gap-2.5 relative">
          <input
            type="text"
            value={quickSearchInput}
            onChange={(e) => setQuickSearchInput(e.target.value)}
            placeholder="e.g., I manufacture premium organic sausages for Middle East export..."
            className="flex-1 px-4 py-2.5 bg-bg-input border border-border-default hover:border-text-muted focus:border-accent-gold outline-none rounded-lg text-xs text-text-primary font-mono placeholder-text-muted/50 transition-colors"
            id="quick-describe-input"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-accent-gold hover:bg-accent-gold-soft text-bg-primary font-bold font-mono text-xs rounded-lg transition-colors uppercase shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Match Varieties <ChevronRight size={13} />
          </button>
        </form>

        <div className="space-y-2 relative">
          <span className="block font-mono text-[9px] text-text-muted tracking-wider uppercase">
            DEMONSTRATIVE USE-CASES:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sampleShortcuts.map((s, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleShortcutClick(s.text)}
                className="flex items-center justify-between p-2.5 bg-bg-primary hover:bg-bg-input border border-border-default hover:border-accent-gold/25 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <span className="font-mono text-[10.5px] text-text-secondary group-hover:text-text-primary truncate transition-colors">{s.text}</span>
                <ChevronRight size={10} className="text-text-muted/40 group-hover:text-accent-gold shrink-0 ml-2 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── COMPLIANCE FOOTER ─────────────────────────────────────────── */}
      <div className="border border-border-default/50 bg-bg-secondary/30 rounded-lg px-4 py-3 font-mono text-[9.5px] text-text-muted flex flex-col md:flex-row md:items-center justify-between gap-2">
        <span className="font-bold text-text-muted/70 shrink-0">● THINKSPICES™ INTELLIGENCE PLATFORM BOUNDS</span>
        <span className="md:text-right max-w-xl leading-relaxed">
          In compliance with regional trade protocols, ThinkSpices™ covers botanical specifications, verified exporter archives, and technical RFQs. Ocean freight and vessel logistics are exclusively handled by InTradeX™.
        </span>
      </div>

    </div>
  );
};
