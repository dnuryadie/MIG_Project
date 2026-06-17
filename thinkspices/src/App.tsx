import React, { useState, useEffect } from "react";
import { Leaf, Mail, MapPin, Globe } from "lucide-react";
import { EcosystemBar } from "./EcosystemBar";
import { Header } from "./Header";
import { Sidebar, ActiveTab } from "./Sidebar";
import { Dashboard } from "./Dashboard";
import { SourcingWizard } from "./SourcingWizard";
import { ApplicationMatcher } from "./ApplicationMatcher";
import { OriginCompare } from "./OriginCompare";
import { MarketPortal } from "./MarketPortal";
import { VerifiedSuppliers } from "./VerifiedSuppliers";
import { SpecSourcingScore } from "./SpecSourcingScore";
import { SourcingLibrary } from "./SourcingLibrary";
import { TechnicalRfqPortal } from "./TechnicalRfqPortal";
import { LogisticsHandoff } from "./LogisticsHandoff";
import { TradeGlossary } from "./TradeGlossary";
import { AISourcingPanel } from "./AISourcingPanel";
import { AuthModal } from "./AuthModal";
import { UserProfileView } from "./UserProfileView";
import { LandingPage } from "./LandingPage";
import { COMMODITIES, Commodity, Variety, EXPORTERS } from "./mockData";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab | "user-profile">("dashboard");
  const [currentCommodity, setCurrentCommodity] = useState<Commodity | null>(COMMODITIES[0]);
  const [currentVariety, setCurrentVariety] = useState<Variety | null>(COMMODITIES[0].varieties[0]);
  const [productForm, setProductForm] = useState<string | null>("WHOLE");
  const [rfqDraft, setRfqDraft] = useState<any>(null);
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // State from Dashboard quick brief input to match engine
  const [matcherInput, setMatcherInput] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [aiInitialMessage, setAiInitialMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(current => current === msg ? null : current);
    }, 4500);
  };

  // Sync index theme on root element mount and updates
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  }, [isDarkMode]);

  // Force start our journey from the login page as requested by the user
  useEffect(() => {
    localStorage.removeItem("thinkspices_user");
    setCurrentUser(null);
  }, []);

  const handleSelectCommodity = (commodity: Commodity) => {
    setCurrentCommodity(commodity);
    if (commodity.varieties && commodity.varieties.length > 0) {
      setCurrentVariety(commodity.varieties[0]);
    }
  };

  const handleSelectVariety = (variety: Variety) => {
    setCurrentVariety(variety);
  };

  const handleSelectProductForm = (form: string) => {
    setProductForm(form);
  };

  const handleSelectExporterDirect = (exporterId: string) => {
    const exporter = EXPORTERS.find(e => e.id === exporterId);
    if (!exporter) return;
    
    // Find matching commodity
    const mainComName = exporter.primaryCommodities[0];
    const matchComm = COMMODITIES.find(c => c.name === mainComName);
    if (matchComm) {
      setCurrentCommodity(matchComm);
      if (matchComm.varieties && matchComm.varieties.length > 0) {
        setCurrentVariety(matchComm.varieties[0]);
      }
    }
    setActiveTab("discovery-wizard");
  };

  const handleSaveRfqDraft = (draft: any) => {
    setRfqDraft(draft);
    if (currentUser) {
      const isDuplicate = currentUser.savedRfqs?.some((r: any) => r.id === draft.id);
      if (!isDuplicate) {
        const newRfq = {
          id: draft.id || `RFQ-${Math.floor(1000 + Math.random() * 9000).toString()}`,
          timestamp: new Date().toISOString(),
          commodityName: currentCommodity ? currentCommodity.name : "SPICE",
          varietyName: currentVariety ? currentVariety.name : "STANDARD",
          productForm: productForm || "WHOLE",
          volume: parseFloat(draft.volume) || 5.0,
          targetPrice: parseFloat(draft.targetPrice) || 8.50,
          destinationPort: draft.destinationPort || "Rotterdam, Netherlands",
          exporterName: EXPORTERS.find(e => e.id === draft.selectedExporterId)?.name || "PT ARCHIPELAGO SPICES INDONESIA",
          notes: draft.notes || ""
        };
        const updatedUser = {
          ...currentUser,
          savedRfqs: [newRfq, ...(currentUser.savedRfqs || [])]
        };
        localStorage.setItem("thinkspices_user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("thinkspices_user");
    localStorage.removeItem("thinkspices_mock_user");
    sessionStorage.clear();
    setCurrentUser(null);
    setActiveTab("dashboard");
    // Ensure 100% complete session sign out by hard-reloading the browser tab context
    window.location.reload();
  };

  if (!currentUser) {
    return (
      <>
        <EcosystemBar current="thinkspices" />
        <div className="pt-10">
          <LandingPage 
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              localStorage.setItem("thinkspices_user", JSON.stringify(user));
            }} 
          />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-200">
      <EcosystemBar current="thinkspices" />

      {/* Top Header layout portal */}
      <Header
        currentCommodity={currentCommodity}
        currentVarietyId={currentVariety ? currentVariety.id : null}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
        onOpenAiAssistant={() => setIsAiPanelOpen(prev => !prev)}
        onOpenAdvisor={() => triggerToast("Initiating Premium Sourcing Advisor Session... Connecting with Senior Agricultural Specialist at MIG Jakarta Hub...")}
        isAiOpen={isAiPanelOpen}
        currentUser={currentUser}
        onOpenAuthModal={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
        onNavigateToProfile={() => { setActiveTab("user-profile"); setIsMobileMenuOpen(false); }}
        onLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
      />

      {/* Main Sidebar navigator */}
      <Sidebar
        activeTab={activeTab as ActiveTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          // Auto scroll to main top content area during navigation
          window.scrollTo(0, 0);
        }}
        onOpenAiAssistant={() => setIsAiPanelOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main viewport frame */}
      <main className="lg:pl-60 pl-0 pt-24 min-h-screen flex flex-col justify-between">
        
        <div className="py-8 px-4 sm:px-10 max-w-6xl w-full mx-auto flex-1">
          {activeTab === "user-profile" && (
            <UserProfileView 
              user={currentUser}
              onLogout={handleLogout}
              onSelectSavedRfq={(rfq) => {
                // Find and load commodity variety
                const matchedComm = COMMODITIES.find(c => c.name === rfq.commodityName);
                if (matchedComm) {
                  setCurrentCommodity(matchedComm);
                  const matchedVar = matchedComm.varieties.find(v => v.name === rfq.varietyName);
                  if (matchedVar) {
                    setCurrentVariety(matchedVar);
                  }
                }
                setProductForm(rfq.productForm);
                setRfqDraft({
                  id: rfq.id,
                  volume: String(rfq.volume),
                  targetPrice: String(rfq.targetPrice),
                  destinationPort: rfq.destinationPort,
                  selectedExporterId: EXPORTERS.find(e => e.name === rfq.exporterName)?.id || "pt-archipelago",
                  companyName: currentUser?.companyName || "",
                  email: currentUser?.email || "",
                  notes: rfq.notes || "",
                  certsRequired: []
                });
                setActiveTab("logistics-handoff");
                window.scrollTo(0, 0);
              }}
            />
          )}

          {activeTab === "dashboard" && (
            <Dashboard 
              onChangeTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo(0, 0);
              }}
              onSetMatcherInput={setMatcherInput}
              currentUser={currentUser}
              onAskAi={(message) => {
                setAiInitialMessage(message);
                setIsAiPanelOpen(true);
              }}
            />
          )}

          {activeTab === "discovery-wizard" && (
            <SourcingWizard
              currentCommodity={currentCommodity}
              currentVariety={currentVariety}
              onSelectCommodity={handleSelectCommodity}
              onSelectVariety={handleSelectVariety}
              onSelectProductForm={handleSelectProductForm}
              onSetRfqDraft={handleSaveRfqDraft}
              onChangeTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo(0, 0);
              }}
              productForm={productForm}
            />
          )}

          {activeTab === "app-matcher" && (
            <ApplicationMatcher />
          )}

          {activeTab === "origin-compare" && (
            <OriginCompare />
          )}

          {activeTab === "market" && (
            <MarketPortal />
          )}

          {activeTab === "glossary" && (
            <TradeGlossary />
          )}

          {activeTab === "verified-suppliers" && (
            <VerifiedSuppliers 
              onSelectExporter={handleSelectExporterDirect}
              onGoToTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo(0,0);
              }}
            />
          )}

          {activeTab === "sourcing-score" && (
            <SpecSourcingScore 
              onGoToTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo(0,0);
              }}
            />
          )}

          {activeTab === "rfq-portal" && (
            <TechnicalRfqPortal
              initialCommodity={currentCommodity}
              initialVariety={currentVariety}
              initialProductForm={productForm}
              onSelectCommodity={handleSelectCommodity}
              onSelectVariety={handleSelectVariety}
              onSelectProductForm={handleSelectProductForm}
              onSetRfqDraft={handleSaveRfqDraft}
              onChangeTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo(0, 0);
              }}
              currentUser={currentUser}
            />
          )}

          {activeTab === "sourcing-library" && (
            <SourcingLibrary />
          )}

          {activeTab === "logistics-handoff" && (
            <LogisticsHandoff 
              rfqDraft={rfqDraft}
              onChangeTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo(0, 0);
              }}
            />
          )}
        </div>

        {/* ── MIG ECOSYSTEM FOOTER ── */}
        <footer className="border-t border-border-default bg-bg-tertiary mt-auto">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12">

            {/* Top grid: brand + 4 link columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">

              {/* Brand column */}
              <div className="col-span-2 md:col-span-3 lg:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-500 rounded-card flex items-center justify-center mig-shadow-sm">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-black text-text-primary tracking-tight font-display">THINKSPICES™</span>
                </div>
                <p className="text-[13px] text-text-secondary leading-relaxed mb-3">
                  AI-powered buyer intelligence platform. Discover suppliers, access market data, and generate qualified RFQs for the global spice trade.
                </p>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-text-muted bg-bg-primary border border-border-default px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-gold inline-block gold-terminal-dot" />
                  MIG Ecosystem · V1.0-PRIME
                </span>
              </div>

              {/* Products */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-primary mb-4 font-display">Products</h4>
                <ul className="space-y-2.5">
                  {['Sourcing Wizard', 'Market Portal', 'Verified Suppliers', 'RFQ Portal', 'AI Sourcing Panel'].map(link => (
                    <li key={link}>
                      <a href="#" className="text-[13px] text-text-secondary hover:text-accent-gold transition-colors duration-150">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-primary mb-4 font-display">Resources</h4>
                <ul className="space-y-2.5">
                  {['Trade Glossary', 'Sourcing Library', 'Origin Compare', 'Market Intelligence', 'Spec Scoring'].map(link => (
                    <li key={link}>
                      <a href="#" className="text-[13px] text-text-secondary hover:text-accent-gold transition-colors duration-150">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-primary mb-4 font-display">Company</h4>
                <ul className="space-y-2.5">
                  {['About MIG', 'InTradeX Platform', 'Privacy Policy', 'Terms of Service', 'Careers'].map(link => (
                    <li key={link}>
                      <a href="#" className="text-[13px] text-text-secondary hover:text-accent-gold transition-colors duration-150">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-primary mb-4 font-display">Contact</h4>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-text-muted mt-0.5 shrink-0" />
                    <span className="text-[13px] text-text-secondary">Jakarta, Indonesia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Mail className="w-3.5 h-3.5 text-text-muted mt-0.5 shrink-0" />
                    <a href="mailto:info@thinkspices.com" className="text-[13px] text-text-secondary hover:text-accent-gold transition-colors duration-150">info@thinkspices.com</a>
                  </li>
                  <li className="flex items-start gap-2">
                    <Globe className="w-3.5 h-3.5 text-text-muted mt-0.5 shrink-0" />
                    <a href="#" className="text-[13px] text-text-secondary hover:text-accent-gold transition-colors duration-150">www.mig.co.id</a>
                  </li>
                </ul>
              </div>

            </div>

            {/* Compliance disclaimer */}
            <div className="border-t border-border-default/60 pt-6 mb-5">
              <p className="text-[10px] font-mono text-text-muted leading-relaxed uppercase max-w-4xl">
                In compliance with Trade Architecture rules. ThinkSpices™ is a strategic intelligence platform
                dedicated purely to Indonesian botanical specifications, supplier verification, and qualified RFQ generation.
                Logistics deployment, container tracking, freight bookings (FOB/CIF), bill of lading (B/L) assignments,
                and marine cargo insurance guarantees are handled exclusively in the InTradeX™ Transport Platform.
              </p>
            </div>

            {/* Bottom bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] font-mono text-text-muted">
              <span>© 2026 THINKSPICES™ — Magastu Indoprime Group (MIG). All Rights Reserved.</span>
              <span className="text-text-muted/70">SNI Compliant · BARANTIN Quarantine Accredited · InTradeX Unified Carrier System</span>
            </div>

          </div>
        </footer>

      </main>

      {/* Slide-out AI Sourcing Portal Overlay panel */}
      <AISourcingPanel
        isOpen={isAiPanelOpen}
        onClose={() => {
          setIsAiPanelOpen(false);
          setAiInitialMessage(null);
        }}
        currentCommodity={currentCommodity}
        currentVariety={currentVariety}
        currentStep={activeTab === "discovery-wizard" ? 4 : 1}
        rfqDraft={rfqDraft}
        aiInitialMessage={aiInitialMessage}
        onClearInitialMessage={() => setAiInitialMessage(null)}
        onPrefillAndNavigateToRfq={(rfqData) => {
          setRfqDraft(rfqData);
          setIsAiPanelOpen(false);
          setAiInitialMessage(null);
          setActiveTab("rfq-portal");
          window.scrollTo(0, 0);
        }}
      />

      {/* User authentication portal */}
      {isAuthModalOpen && (
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsAuthModalOpen(false);
          }}
        />
      )}

      {/* Toast Notification HUD */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-bg-secondary border border-accent-gold text-text-primary px-5 py-3 rounded-lg shadow-2xl font-mono text-[10.5px] max-w-sm flex items-center gap-3 animate-fade-in">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse shrink-0" />
          <span className="leading-relaxed">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
