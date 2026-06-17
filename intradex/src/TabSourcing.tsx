import React, { useState, useEffect } from 'react';
import { Package, ShieldAlert, BadgeInfo, Scale, CheckSquare, Container, ExternalLink } from 'lucide-react';
import { SPICE_PROFILES, SpiceProfileDetail } from './knowledgeBase';
import { calculatePackagingCost, SourcingResult, COUNTRY_DUTY_PRESETS, DESTINATION_PORT_PRESETS } from './pricingEngine';

interface TabSourcingProps {
  syncedParams: {
    commodity: string;
    volume: number;
    packType: string;
    country?: string;
    destinationPort?: string;
    exchangeRate?: number;
  } | null;
  onSourcingDataChange: (params: {
    commodity: string;
    volume: number;
    packType: string;
    country: string;
    destinationPort: string;
    exchangeRate: number;
  }) => void;
  onSyncToCalculator: (
    commodity: string,
    volume: number,
    packType: string,
    country: string,
    destinationPort: string,
    exchangeRate: number
  ) => void;
  userRole: 'free' | 'pro';
}

export default function TabSourcing({ 
  syncedParams, 
  onSourcingDataChange, 
  onSyncToCalculator, 
  userRole 
}: TabSourcingProps) {
  const [selectedCommodity, setSelectedCommodity] = useState<string>(
    syncedParams?.commodity || "Cassia Whole"
  );
  const [volume, setVolume] = useState<number | ''>(
    syncedParams?.volume !== undefined ? syncedParams.volume : 5000
  );
  const [selectedPackaging, setSelectedPackaging] = useState<string>(
    syncedParams?.packType || "PP Woven Bag 25 Kg"
  );
  const [exchangeRate, setExchangeRate] = useState<number>(
    syncedParams?.exchangeRate || 16500
  );
  const [destinationCountry, setDestinationCountry] = useState<string>(
    syncedParams?.country || "Germany"
  );
  const [destinationPort, setDestinationPort] = useState<string>(
    syncedParams?.destinationPort || "Hamburg, Germany"
  );

  // Send real-time updates of all Tab 1 parameter entries up to the parent component
  useEffect(() => {
    onSourcingDataChange({
      commodity: selectedCommodity,
      volume: Number(volume) || 0,
      packType: selectedPackaging,
      country: destinationCountry,
      destinationPort: destinationPort,
      exchangeRate: exchangeRate
    });
  }, [selectedCommodity, volume, selectedPackaging, destinationCountry, destinationPort, exchangeRate]);

  // Handle Country Selection & Auto-detect matching Registered Ports
  const handleCountryPresetChange = (country: string) => {
    setDestinationCountry(country);
    let matchedPort = "Custom / Other";
    if (country === "United Kingdom") {
      matchedPort = "Felixstowe, UK";
    } else if (country === "United States") {
      matchedPort = "New York, USA";
    } else if (country === "United Arab Emirates") {
      matchedPort = "Jebel Ali, UAE";
    } else {
      matchedPort = Object.keys(DESTINATION_PORT_PRESETS).find(p => p.toLowerCase().includes(country.toLowerCase())) || "Custom / Other";
    }
    setDestinationPort(matchedPort);
  };

  // Load profiles
  const profilesKeys = Object.keys(SPICE_PROFILES);
  
  // Find matching key
  const matchKey = profilesKeys.find(k => k.toLowerCase().includes(selectedCommodity.toLowerCase())) || "Cinnamon/Cassia";
  const profile: SpiceProfileDetail = SPICE_PROFILES[matchKey];

  // Calculate results dynamically
  let calcResult: SourcingResult | null = null;
  let errorMsg: string | null = null;

  try {
    if (selectedCommodity && volume && selectedPackaging) {
      calcResult = calculatePackagingCost(selectedCommodity, Number(volume), selectedPackaging, exchangeRate);
    }
  } catch (err: any) {
    errorMsg = err.message;
  }

  // Handle auto fill trigger
  const handleTriggerSync = () => {
    if (calcResult) {
      // Map back to matching FOB commodity name
      let fobName = "Cassia Whole";
      if (selectedCommodity === "Black Pepper") fobName = "Black Pepper (Whole)";
      if (selectedCommodity === "White Pepper") fobName = "White Pepper (Whole)";
      if (selectedCommodity === "Clove") fobName = "Clove";
      if (selectedCommodity === "Nutmeg") fobName = "Nutmeg";
      if (selectedCommodity === "Vanilla") fobName = "Vanilla";
      if (selectedCommodity === "Patchouli Oil") fobName = "Patchouli Oil";
      if (selectedCommodity === "Cassia Powder") fobName = "Cassia Powder";

      onSyncToCalculator(fobName, Number(volume), selectedPackaging, destinationCountry, destinationPort, exchangeRate);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ── CARD 1: SELECTION & MATHEMATICS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Parameters Box */}
        <div className="lg:col-span-4 bg-[#161b27] border border-[#2d3748] p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2 text-white">
            <Package className="w-5 h-5 text-blue-500" />
            <h3 className="font-extrabold text-base uppercase tracking-tight">Sourcing Form</h3>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Select Commodity</label>
            <select
              value={selectedCommodity}
              onChange={(e) => {
                const comm = e.target.value;
                setSelectedCommodity(comm);
                // Auto-pick first valid packaging option
                const firstPack = Object.keys(SPICE_PROFILES[comm === "Cinnamon/Cassia" || comm === "Cassia Whole" ? "Cinnamon/Cassia" : comm === "Cassia Powder" ? "Cinnamon/Cassia" : comm === "Black Pepper" ? "Black & White Pepper" : comm === "White Pepper" ? "Black & White Pepper" : comm === "Nutmeg" ? "Nutmeg & Mace" : comm]?.grades ? [] : [])[0];
                if (comm === "Cassia Whole") {
                  setSelectedPackaging("PP Woven Bag 25 Kg");
                } else if (comm === "Cassia Powder") {
                  setSelectedPackaging("Kraft Paper Bag 20 Kg");
                } else if (comm === "Black Pepper") {
                  setSelectedPackaging("PP Woven Bag 25 Kg");
                } else if (comm === "White Pepper") {
                  setSelectedPackaging("PP Woven Bag 25 Kg");
                } else if (comm === "Clove") {
                  setSelectedPackaging("PP Woven Bag 25 Kg");
                } else if (comm === "Nutmeg") {
                  setSelectedPackaging("PP Woven Bag 25 Kg");
                } else if (comm === "Vanilla") {
                  setSelectedPackaging("Vacuum Bag + Carton 5 Kg");
                } else if (comm === "Patchouli Oil") {
                  setSelectedPackaging("HDPE Drum 25 Kg");
                }
              }}
              className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-2 text-xs text-[#e6eaf0] focus:ring-1 focus:ring-[#2563eb] focus:outline-none w-full"
            >
              <option value="Cassia Whole">Indonesian Cassia (Whole)</option>
              <option value="Cassia Powder">Indonesian Cassia (Powder)</option>
              <option value="Black Pepper">Lampung Black Pepper</option>
              <option value="White Pepper">Muntok White Pepper</option>
              <option value="Clove">Indonesian Cloves (Lal Pari)</option>
              <option value="Nutmeg">Banda Nutmeg Kernels</option>
              <option value="Vanilla">Premium Vanilla Beans</option>
              <option value="Patchouli Oil">Sumatran Patchouli Oil</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Target Volume (Kg)</label>
            <input
              type="number"
              min="1"
              value={volume}
              onChange={(e) => setVolume(e.target.value !== '' ? Number(e.target.value) : '')}
              className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-2.5 text-xs text-[#e6eaf0] focus:ring-1 focus:ring-[#2563eb] focus:outline-none w-full"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Select Packaging Unit</label>
            <select
              value={selectedPackaging}
              onChange={(e) => setSelectedPackaging(e.target.value)}
              className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-2.5 text-xs text-[#e6eaf0] focus:ring-1 focus:ring-[#2563eb] focus:outline-none w-full"
            >
              {selectedCommodity === "Cassia Whole" && (
                <>
                  <option value="PP Woven Bag 25 Kg">PP Woven Bag 25 Kg</option>
                  <option value="PP Woven Bag 50 Kg">PP Woven Bag 50 Kg</option>
                </>
              )}
              {selectedCommodity === "Cassia Powder" && (
                <>
                  <option value="Kraft Paper Bag 20 Kg">Kraft Paper Bag 20 Kg</option>
                  <option value="Kraft Paper Bag 25 Kg">Kraft Paper Bag 25 Kg</option>
                </>
              )}
              {selectedCommodity === "Black Pepper" && <option value="PP Woven Bag 25 Kg">PP Woven Bag 25 Kg</option>}
              {selectedCommodity === "White Pepper" && <option value="PP Woven Bag 25 Kg">PP Woven Bag 25 Kg</option>}
              {selectedCommodity === "Clove" && (
                <>
                  <option value="PP Woven Bag 25 Kg">PP Woven Bag 25 Kg</option>
                  <option value="PP Woven Bag 50 Kg">PP Woven Bag 50 Kg</option>
                </>
              )}
              {selectedCommodity === "Nutmeg" && (
                <>
                  <option value="PP Woven Bag 25 Kg">PP Woven Bag 25 Kg</option>
                  <option value="PP Woven Bag 50 Kg">PP Woven Bag 50 Kg</option>
                </>
              )}
              {selectedCommodity === "Vanilla" && (
                <>
                  <option value="Vacuum Bag + Carton 5 Kg">Vacuum Bag + Carton 5 Kg</option>
                  <option value="Vacuum Bag + Carton 10 Kg">Vacuum Bag + Carton 10 Kg</option>
                </>
              )}
              {selectedCommodity === "Patchouli Oil" && (
                <>
                  <option value="HDPE Drum 25 Kg">HDPE Drum 25 Kg</option>
                  <option value="Steel Drum 180 Kg">Steel Drum 180 Kg</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">USD/IDR Exchange Rate</label>
            <input
              type="number"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(Number(e.target.value))}
              className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-2.5 text-xs text-[#e6eaf0] focus:ring-1 focus:ring-[#2563eb] focus:outline-none w-full"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Export Destination Country</label>
            <select
              value={destinationCountry}
              onChange={(e) => handleCountryPresetChange(e.target.value)}
              className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-2.5 text-xs text-[#e6eaf0] focus:ring-1 focus:ring-[#2563eb] focus:outline-none w-full"
            >
              {Object.keys(COUNTRY_DUTY_PRESETS).map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Destination Port</label>
            <select
              value={destinationPort}
              onChange={(e) => setDestinationPort(e.target.value)}
              className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-2.5 text-xs text-[#e6eaf0] focus:ring-1 focus:ring-[#2563eb] focus:outline-none w-full"
            >
              {destinationPort !== "Custom / Other" && (
                <option value={destinationPort}>{destinationPort} (Auto-matched)</option>
              )}
              {Object.keys(DESTINATION_PORT_PRESETS)
                .filter(p => p !== destinationPort)
                .map((port) => (
                  <option key={port} value={port}>
                    {port}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Dynamic Logistics/Mathematics Output */}
        <div className="lg:col-span-8 bg-[#161b27] border border-[#2d3748] p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-extrabold text-white text-base uppercase tracking-tight flex items-center gap-1.5">
              <Scale className="w-5 h-5 text-[#D4A017]" />
              Tare, Bags, & Volume Diagnostics
            </h3>

            {errorMsg && <div className="text-red-400 text-xs p-3 bg-red-950 border border-red-800 rounded-lg">{errorMsg}</div>}

            {calcResult && (
              <div className="space-y-5">
                
                {/* 3 Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative bg-[#1e2636] border border-[#2d3748] p-4 rounded-xl overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-[3px] rounded-l-xl bg-blue-500" />
                    <p className="text-[9px] font-mono text-[#94a3b8] uppercase tracking-wider pl-2">Packages Required</p>
                    <h4 className="text-2xl font-black text-white mt-1.5 font-mono pl-2 leading-none">
                      {calcResult.total_units_needed.toLocaleString()}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-mono pl-2 mt-1">{calcResult.packaging_type}s</p>
                  </div>

                  <div className="relative bg-[#1e2636] border border-[#2d3748] p-4 rounded-xl overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-[3px] rounded-l-xl bg-sky-400" />
                    <p className="text-[9px] font-mono text-[#94a3b8] uppercase tracking-wider pl-2">Net Cargo Weight</p>
                    <h4 className="text-2xl font-black text-white mt-1.5 font-mono pl-2 leading-none">
                      {calcResult.net_weight_kg.toLocaleString()}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-mono pl-2 mt-1">Kg net weight</p>
                  </div>

                  <div className="relative bg-[#1e2636] border border-[#2d3748] p-4 rounded-xl overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-[3px] rounded-l-xl bg-emerald-500" />
                    <p className="text-[9px] font-mono text-[#94a3b8] uppercase tracking-wider pl-2">Estimated Gross Weight</p>
                    <h4 className="text-2xl font-black text-[#16a34a] mt-1.5 font-mono pl-2 leading-none">
                      {calcResult.gross_weight_kg.toLocaleString()}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-mono pl-2 mt-1">+{(calcResult.gross_weight_kg - calcResult.net_weight_kg).toFixed(1)} Kg tare</p>
                  </div>
                </div>

                {/* Packaging costing metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#2d3748]/80 pt-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-mono text-[#94a3b8] uppercase tracking-wider">Total Commercial Packaging Cost</p>
                    <p className="text-2xl font-black text-white font-mono">$ {calcResult.total_packaging_cost_usd.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500 font-mono">≈ IDR {(calcResult.total_units_needed * calcResult.price_per_unit_idr).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-mono text-[#94a3b8] uppercase tracking-wider">Packaging Overhead per Kg</p>
                    <p className="text-2xl font-black text-white font-mono">$ {calcResult.packaging_cost_per_kg_usd.toFixed(4)} <span className="text-xs font-normal text-gray-400">/Kg</span></p>
                    <p className="text-[10px] text-gray-500 font-mono">Total Pack Cost ÷ Net Weight</p>
                  </div>
                </div>

                {/* Sourcing warning */}
                <div className="bg-[#1a1f2e] border border-[#D4A017]/25 border-l-4 border-l-[#D4A017] px-4 py-3 rounded-lg text-xs flex gap-2.5 items-start">
                  <ShieldAlert className="w-4 h-4 text-[#D4A017] shrink-0 mt-0.5" />
                  <p className="text-gray-300 leading-relaxed">
                    <strong className="text-[#D4A017]">B2B Logistics Warning:</strong> Whole spices are highly hydro-sensitive. Ensure moisture levels remain strictly under 13% before sealing in woven bags. Excess relative humidity will prompt quarantine inspection rejections at destination ports.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 mt-2 border-t border-[#2d3748]/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="text-[10px] text-[#94a3b8] font-mono leading-relaxed max-w-xs">
              Syncing pre-fills the FOB, CIF & DDP Calculators with these packaging parameters automatically.
            </p>
            <button
              onClick={handleTriggerSync}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-[0_0_16px_rgba(37,99,235,0.35)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <CheckSquare className="w-4 h-4" />
              Sync Parameters to FOB Calculator
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: BOTANICAL PROFILE & GRADE SPECIFICATIONS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Grade Specifications */}
        <div className="bg-[#161b27] border border-[#2d3748] p-6 rounded-2xl space-y-4">
          <h3 className="font-extrabold text-white text-base uppercase tracking-tight flex items-center gap-1.5">
            <BadgeInfo className="w-5 h-5 text-blue-400" />
            {selectedCommodity} Botanical Standards & Grades
          </h3>
          
          <div className="bg-[#1e2636] p-4 rounded-xl space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-400">Customs HS Code</p>
                <p className="font-bold text-white font-mono mt-0.5">{profile?.hsCode || '—'}</p>
              </div>
              <div>
                <p className="text-gray-400">Core Origin</p>
                <p className="font-bold text-white mt-0.5">{profile?.origin || '—'}</p>
              </div>
            </div>

            <div className="border-t border-[#2d3748] pt-3">
              <h4 className="text-xs font-semibold text-[#D4A017] mb-2 uppercase tracking-wide">Approved Export Grades:</h4>
              <div className="space-y-3">
                {profile?.grades?.map((g, idx) => (
                  <div key={idx} className="bg-[#161b27] p-2.5 rounded-lg border border-[#2d3748] text-xs">
                    <p className="font-bold text-white mb-1">{g.name}</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-gray-400">
                      {g.specs.map((s, sIdx) => <li key={sIdx}>{s}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Biosecurity & Compliance Checklist */}
        <div className="bg-[#161b27] border border-[#2d3748] p-6 rounded-2xl space-y-4">
          <h3 className="font-extrabold text-white text-base uppercase tracking-tight flex items-center gap-1.5">
            <Container className="w-5 h-5 text-indigo-400" />
            Logistic Container Packing Density
          </h3>

          <div className="bg-[#1e2636] p-4 rounded-xl space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-400">Average Packing Density</p>
                <p className="font-bold text-white font-mono mt-0.5">{profile?.loadingDensity || '—'}</p>
              </div>
              <div>
                <p className="text-gray-400">Recommended Pack Types</p>
                <p className="font-bold text-white mt-0.5">{profile?.packaging?.join(', ') || '—'}</p>
              </div>
            </div>

            <div className="border-t border-[#2d3748] pt-3 space-y-2">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wide flex items-center gap-1">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                Critical Compliance Checklist
              </h4>
              <ul className="space-y-2.5 text-xs text-gray-300">
                {profile?.requirements?.map((r, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-[#D4A017] mt-0.5 shrink-0">✦</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
