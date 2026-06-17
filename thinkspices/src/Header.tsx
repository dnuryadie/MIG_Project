import React, { useEffect, useState } from "react";
import { Database, Sparkles, Menu, User, Key, LogOut, Globe } from "lucide-react";
import { Commodity, COMMODITIES } from "./mockData";
import { useTranslation, LANGUAGES, LanguageCode } from "./translations";

interface HeaderProps {
  currentCommodity: Commodity | null;
  currentVarietyId: string | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAiAssistant: () => void;
  onOpenAdvisor: () => void;
  isAiOpen: boolean;
  currentUser: any;
  onOpenAuthModal: () => void;
  onNavigateToProfile: () => void;
  onLogout?: () => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCommodity,
  currentVarietyId,
  isDarkMode,
  onToggleDarkMode,
  onOpenAiAssistant,
  onOpenAdvisor,
  isAiOpen,
  currentUser,
  onOpenAuthModal,
  onNavigateToProfile,
  onLogout,
  isMobileMenuOpen,
  onToggleMobileMenu
}) => {
  const { t, language, setLanguage } = useTranslation();
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerTime, setTickerTime] = useState("");

  // Live real-time clock to show very active engagement and up-to-date terminal precision
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toISOString().replace("T", " ").substring(0, 19).replace(/-/g, "/") + " UTC";
      setTickerTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cycle through default commodity listings in the ticker when no commodity selected
  useEffect(() => {
    if (currentCommodity) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % COMMODITIES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentCommodity]);

  const activeVariety = currentCommodity?.varieties.find(v => v.id === currentVarietyId) || currentCommodity?.varieties[0];

  return (
    <header className="fixed top-10 left-0 right-0 h-14 bg-bg-secondary border-b border-border-default z-40 flex items-center justify-between px-4 sm:px-6 transition-colors duration-200">
      
      {/* Left zone: Brand logo content */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile menu toggle */}
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded bg-bg-primary hover:bg-bg-tertiary text-text-secondary hover:text-accent-gold lg:hidden border border-border-default transition-all flex items-center justify-center mr-0.5 cursor-pointer"
          id="mobile-sidebar-toggle"
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={16} />
        </button>

        <div className="w-8 h-8 rounded bg-bg-tertiary border border-accent-gold flex items-center justify-center font-display font-bold text-accent-gold shadow-sm text-xs shrink-0" id="brand-avatar">
          TS
        </div>
        <div className="flex flex-col">
          <span className="font-display font-bold tracking-tight text-accent-gold text-sm sm:text-base leading-none">
            THINKSPICES™
          </span>
          <span className="font-mono text-[8px] sm:text-[9px] text-text-secondary tracking-widest mt-0.5 uppercase">
            Indonesian Buyer Intelligence
          </span>
        </div>
      </div>

      {/* Center zone: Status & Live price ticket running marquee */}
      <div className="ticker-wrapper-container hidden sm:flex items-center bg-bg-primary border border-border-default rounded h-[26px] sm:h-[28px] px-4 mx-4 text-[10px] sm:text-[10.5px] font-mono max-w-[280px] md:max-w-[380px] lg:max-w-[480px] xl:max-w-[580px] overflow-hidden relative">
        <div className="animate-ticker-marquee flex items-center gap-8 shrink-0">
          {/* Main sequence */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1.5 text-accent-green font-bold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-ping inline-block shrink-0"></span>
              LIVE TICKER [ {tickerTime} ] : {t("market_status") || "MARKET STATUS: OPERATIONAL"}
            </span>
            <span className="text-text-muted">|</span>
            <span className="text-accent-gold font-bold">
              BANDA NUTMEG $6,820/MT
            </span>
            <span className="text-text-muted">|</span>
            <span className="text-[#3498DB] font-semibold">
              LAMPUNG BLACK PEPPER $5,450/MT ▲ 1.2%
            </span>
            <span className="text-text-muted">|</span>
            <span className="text-accent-gold font-bold">
              PADANG CASSIA $4,120/MT
            </span>
            <span className="text-text-muted">|</span>
            <span className="text-[#9B59B6] font-semibold">
              SULAWESI CLOVE $7,900/MT ▼ 0.4%
            </span>
            <span className="text-text-muted">|</span>
            <span className="text-accent-green font-bold shrink-0">
              · BARANTIN QUARANTINE ACCREDITED · SNI 2026 ACTIVE ·
            </span>
          </div>

          {/* Duplicated loop sequence for seamless marquee */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1.5 text-accent-green font-bold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-ping inline-block shrink-0"></span>
              LIVE TICKER [ {tickerTime} ] : {t("market_status") || "MARKET STATUS: OPERATIONAL"}
            </span>
            <span className="text-text-muted">|</span>
            <span className="text-accent-gold font-bold">
              BANDA NUTMEG $6,820/MT
            </span>
            <span className="text-text-muted">|</span>
            <span className="text-[#3498DB] font-semibold">
              LAMPUNG BLACK PEPPER $5,450/MT ▲ 1.2%
            </span>
            <span className="text-text-muted">|</span>
            <span className="text-accent-gold font-bold">
              PADANG CASSIA $4,120/MT
            </span>
            <span className="text-text-muted">|</span>
            <span className="text-[#9B59B6] font-semibold">
              SULAWESI CLOVE $7,900/MT ▼ 0.4%
            </span>
            <span className="text-text-muted">|</span>
            <span className="text-accent-green font-bold shrink-0">
              · BARANTIN QUARANTINE ACCREDITED · SNI 2026 ACTIVE ·
            </span>
          </div>
        </div>
      </div>

      {/* Right zone: Action buttons (optimized for screen space) */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        
        {/* Multilanguage Dropdown Selector */}
        <div className="flex items-center gap-1 bg-bg-primary border border-border-default hover:border-accent-gold rounded px-2 py-1 h-[26px] sm:h-[28px] transition-colors" id="miltilingual-header-zone">
          <Globe size={11} className="text-accent-gold shrink-0" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="bg-transparent text-[9.5px] sm:text-[10px] font-mono font-bold text-text-primary focus:text-accent-gold focus:outline-none cursor-pointer border-0 py-0 pr-1 capitalize"
            id="header-language-picker"
            title="Translate Platform Language"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-bg-secondary text-text-primary">
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* DB PILL - Visible on md+ */}
        <div className="hidden md:flex items-center border border-[#2ECC71]/30 bg-[#2ECC71]/5 text-accent-green rounded px-2 py-1 text-[10px] sm:text-[11px] font-mono gap-1 h-[26px] sm:h-[28px]" id="db-verified-pill">
          <Database size={11} className="shrink-0" />
          <span>{t("db_verified") || "DB VERIFIED"}</span>
        </div>

        {/* LIVE AI - Visible always but shorter on narrow mobile */}
        <button
          onClick={onOpenAiAssistant}
          className={`flex items-center gap-1 px-2 px-2.5 sm:px-3 py-1 rounded text-[10px] sm:text-[11px] font-mono transition-all border cursor-pointer h-[26px] sm:h-[28px] ${
            isAiOpen 
              ? "bg-accent-gold/20 border-accent-gold text-accent-gold"
              : "border-accent-gold/40 hover:border-accent-gold text-accent-gold"
          }`}
          id="live-assistant-trigger"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse shrink-0"></span>
          <span className="hidden sm:inline">{t("live_ia") || "⚡ LIVE AI"}</span>
          <span className="sm:hidden">⚡ AI</span>
        </button>

        {/* ADVISOR - Hidden on small viewports to save critical space */}
        <button
          onClick={onOpenAdvisor}
          className="hidden sm:flex items-center gap-1 px-3 py-1 rounded text-[10px] sm:text-[11px] font-mono bg-accent-gold hover:bg-accent-gold-soft text-bg-primary font-bold shadow-sm transition-colors cursor-pointer h-[26px] sm:h-[28px]"
          id="advisor-premium-trigger"
        >
          <Sparkles size={10} className="shrink-0" />
          <span>{t("advisor") || "🎯 ADVISOR"}</span>
        </button>

        {/* User Secure Auth / Profile section - Keep visible always */}
        {currentUser ? (
          <div className="flex items-center gap-1.5" id="user-header-actions">
            <button
              onClick={onNavigateToProfile}
              className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 bg-bg-tertiary hover:bg-bg-primary border border-accent-gold text-accent-gold rounded text-[10px] sm:text-[11px] font-mono transition-all font-bold shadow-sm cursor-pointer h-[26px] sm:h-[28px]"
              id="user-profile-trigger"
              title="Inspect corporate profile & RFQs"
            >
              <User size={11} className="text-accent-gold shrink-0" />
              <span className="max-w-[45px] sm:max-w-[80px] truncate">{currentUser.name.split(" ")[0]}</span>
              <span className="bg-accent-gold/15 text-[8.5px] px-1 rounded uppercase font-bold tracking-wider leading-none py-0.5 shrink-0 hidden sm:inline">
                {currentUser.membershipTier}
              </span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center justify-center p-1 px-2 border border-accent-red/30 bg-accent-red/5 hover:bg-accent-red hover:text-white text-accent-red rounded transition-all cursor-pointer h-[26px] sm:h-[28px]"
                id="header-logout-button"
                title="Sign Out of ThinkSpices session"
              >
                <LogOut size={12} className="shrink-0" />
                <span className="font-mono text-[9px] font-bold tracking-wider ml-1 uppercase">{t("logout") || "LOG OUT"}</span>
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-mono border border-border-default hover:border-accent-gold text-text-secondary hover:text-accent-gold transition-colors cursor-pointer font-semibold h-[26px] sm:h-[28px]"
            id="register-profile-trigger"
            title="Authenticate Corporate Portal"
          >
            <Key size={11} className="shrink-0" />
            <span>{t("login_btn") || "SIGN IN"}</span>
          </button>
        )}
      </div>
    </header>
  );
};
