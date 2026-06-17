import React, { useEffect, useState } from "react";
import { 
  Compass, 
  Cpu, 
  GitCompare, 
  TrendingUp, 
  Users, 
  Sliders, 
  FileText, 
  Bot, 
  BookOpen, 
  ExternalLink,
  ChevronRight,
  HelpCircle,
  LogOut
} from "lucide-react";
import { fetchFXRates, FxResult } from "./fx";
import { useTranslation } from "./translations";

export type ActiveTab = 
  | "dashboard" 
  | "discovery-wizard" 
  | "app-matcher" 
  | "origin-compare" 
  | "market" 
  | "verified-suppliers" 
  | "sourcing-score" 
  | "rfq-portal" 
  | "sourcing-library" 
  | "logistics-handoff"
  | "glossary";

type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<any>
  isAction?: boolean;
  isAi?: boolean;
  isExt?: boolean;
}

interface SidebarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onOpenAiAssistant: () => void;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onChangeTab,
  onOpenAiAssistant,
  isMobileMenuOpen,
  onCloseMobileMenu,
  onLogout
}) => {
  const { t } = useTranslation();
  const [fxData, setFxData] = useState<FxResult | null>(null);

  // Fetch FX rates on mount and configure 1-hour interval
  useEffect(() => {
    fetchFXRates().then(setFxData);
    const interval = setInterval(() => {
      fetchFXRates().then(setFxData);
    }, 60 * 60 * 1000); // 1 hour
    return () => clearInterval(interval);
  }, []);

  const navSections: {header:string; items: NavItem[]}[]=[
    {
      header: t("discover") || "DISCOVER",
      items: [
        { id: "discovery-wizard", label: t("spec_discovery") || "Product Spec Discovery", icon: Compass },
        { id: "app-matcher", label: t("app_matcher") || "Application Matcher", icon: Cpu, isAi: true },
        { id: "origin-compare", label: t("origin_compare") || "Origin Compare", icon: GitCompare }
      ]
    },
    {
      header: t("market_data") || "MARKET DATA",
      items: [
        { id: "market", label: t("market_hub") || "📊 Market Data Hub", icon: TrendingUp }
      ]
    },
    {
      header: t("sourcing") || "SOURCING",
      items: [
        { id: "verified-suppliers", label: t("verified_suppliers") || "Verified Suppliers", icon: Users },
        { id: "sourcing-score", label: t("sourcing_score") || "Spec Sourcing Score", icon: Sliders },
        { id: "rfq-portal", label: t("rfq_portal") || "Technical RFQ Portal", icon: FileText }
      ]
    },
    {
      header: t("intelligence") || "INTELLIGENCE",
      items: [
        { id: "ai-assistant", label: t("ai_assistant") || "AI Sourcing Assistant", icon: Bot, isAction: true },
        { id: "sourcing-library", label: t("sourcing_library") || "Sourcing Library", icon: BookOpen },
        { id: "glossary", label: t("glossary") || "📖 Trade Glossary", icon: HelpCircle },
        { id: "logistics-handoff", label: t("logistics") || "Logistics Separation", icon: ExternalLink, isExt: true }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={onCloseMobileMenu}
          className="fixed inset-0 top-24 bg-black/60 backdrop-blur-[2px] z-20 lg:hidden transition-all duration-300"
        />
      )}

      <aside className={`fixed top-24 left-0 bottom-0 w-60 bg-bg-secondary border-r border-border-default z-30 flex flex-col justify-between select-none transform transition-transform duration-300 lg:translate-x-0 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
      <div className="flex-1 overflow-y-auto py-5 px-3">
        {/* Navigation block */}
        <div className="space-y-6">
          {/* Quick Dashboard link */}
          <div>
            <button
               onClick={() => {
                 onChangeTab("dashboard");
                 onCloseMobileMenu();
               }}
               className={`w-full text-left px-3 py-2 rounded text-xs font-medium uppercase tracking-wider flex items-center justify-between transition-colors border cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-accent-gold/10 border-accent-gold/40 text-accent-gold font-bold"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
              }`}
            >
              <span>{t("general_desk") || "🏛️ SOURCING DESK"}</span>
              <ChevronRight size={12} className={activeTab === "dashboard" ? "rotate-90 text-accent-gold" : "text-text-muted"} />
            </button>
          </div>

          {navSections.map((section) => (
            <div key={section.header} className="space-y-1">
              <h3 className="px-3 text-[10px] uppercase font-display font-semibold tracking-widest text-text-muted">
                {section.header}
              </h3>
              <nav className="space-y-[2px]">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.isAction) {
                          onOpenAiAssistant();
                        } else {
                          onChangeTab(item.id as ActiveTab);
                        }
                        onCloseMobileMenu();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-colors group cursor-pointer ${
                        isActive
                          ? "bg-accent-gold/5 text-accent-gold font-medium border-l-2 border-accent-gold px-[10px]"
                          : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary border-l-2 border-transparent"
                      }`}
                      id={`sidebar-link-${item.id}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon 
                          size={15} 
                          className={isActive ? "text-accent-gold" : "text-text-muted group-hover:text-text-secondary"} 
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      
                      {item.isAi && (
                        <span className="text-[9px] scale-90 px-1 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold rounded font-mono font-bold leading-none py-0.5 animate-pulse">
                          AI
                        </span>
                      )}

                      {item.isExt && (
                        <span className="text-[8px] bg-accent-blue/10 border border-accent-blue/40 text-accent-blue rounded px-1 tracking-wider uppercase font-mono font-bold scale-90">
                          EXT
                        </span>
                      )}

                      {item.id === "ai-assistant" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-gold inline-block"></span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Footer block */}
      <div className="border-t border-border-default p-4 bg-bg-secondary flex flex-col gap-2 shrink-0 font-mono text-[10px]">
        <div className="flex flex-col gap-1 text-text-secondary">
          <div className="flex items-center justify-between">
            <span>USD/IDR FX TICK:</span>
            <span className={`font-semibold ${fxData?.source === "LIVE" ? "text-accent-green" : "text-accent-amber"}`}>
              {fxData ? fxData.IDR.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "17,623.50"}
            </span>
          </div>
          <div className="flex items-center justify-between text-[8px] text-text-muted">
            <span>INDEX FEED:</span>
            <span className={`px-1 py-0.5 rounded font-bold ${
              fxData?.source === "LIVE" 
                ? "bg-accent-blue/10 text-accent-blue border border-accent-blue/30" 
                : "bg-accent-amber/10 text-accent-amber border border-accent-amber/30"
            }`}>
              {fxData?.source === "LIVE" ? "● LIVE" : "● CACHED"}
            </span>
          </div>
        </div>
        <div className="h-[1px] bg-border-default my-1"></div>
        {onLogout && (
          <button 
            onClick={onLogout}
            className="w-full py-1.5 px-3 border border-accent-red/20 bg-accent-red/5 hover:bg-accent-red hover:text-white text-accent-red rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[10.5px] font-bold uppercase"
            id="sidebar-logout-button"
            title="Terminate ThinkSpices B2B Session"
          >
            <LogOut size={12} className="shrink-0" />
            <span>SESSION SIGN OUT</span>
          </button>
        )}
        <div className="h-[1px] bg-border-default my-1"></div>
        <div className="text-text-muted text-[9px] leading-tight flex justify-between items-center wrap gap-1">
          <div>
            ThinkSpices™ B2B Terminal <br />
            <span className="text-accent-gold/75">MIG PRO-INTEL · SECURE ESCR</span>
          </div>
          <span className="text-[8px] text-accent-gold font-bold uppercase tracking-wider bg-accent-gold/10 px-1 py-0.5 rounded">PRIME</span>
        </div>
      </div>
    </aside>
    </>
  );
};
