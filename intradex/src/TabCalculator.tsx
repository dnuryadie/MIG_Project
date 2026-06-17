import React, { useState, useEffect } from 'react';
import { Calculator, Lock, DollarSign, ArrowRightLeft, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';
import { UserProfile, FOBInputs, FOBOutputs, CIFInputs, CIFOutputs, DDPInputs, DDPOutputs } from './types';
import {
  calculateFobPrice,
  calculateCifPrice,
  calculateDdpPrice,
  COMMODITY_FOB_MASTER,
  DOMESTIC_FREIGHT_COST_IDR,
  DESTINATION_PORT_PRESETS,
  COUNTRY_DUTY_PRESETS
} from './pricingEngine';

const DEFAULT_INLAND_FREIGHT_USD = 350;
const DEFAULT_CUSTOMS_HANDLING_USD = 150;

interface TabCalculatorProps {
  user: UserProfile;
  syncedParams: {
    commodity: string;
    volume: number;
    packType: string;
    country?: string;
    destinationPort?: string;
    exchangeRate?: number;
  } | null;
  onCalculationLogged: (record: any) => void;
}

export default function TabCalculator({ user, syncedParams, onCalculationLogged }: TabCalculatorProps) {
  const [fobInputs, setFobInputs] = useState<FOBInputs>({
    commodity: 'Cassia Whole',
    volumeKg: 10000,
    packagingType: 'PP Woven Bag 25 Kg',
    loadingPort: 'Tanjung Priok Port (Jakarta)',
    exchangeRate: 16500
  });

  // Sync inputs if they were filled in Tab 1 Sourcing
  useEffect(() => {
    if (syncedParams) {
      setFobInputs((prev) => ({
        ...prev,
        commodity: syncedParams.commodity,
        volumeKg: syncedParams.volume,
        packagingType: syncedParams.packType,
        exchangeRate: syncedParams.exchangeRate || prev.exchangeRate
      }));

      if (syncedParams.destinationPort) {
        const portPreset = DESTINATION_PORT_PRESETS[syncedParams.destinationPort];
        const baseFreight = portPreset ? portPreset.base_freight_usd_per_kg : 0;
        setCifInputs((prev) => ({
          ...prev,
          destinationPort: syncedParams.destinationPort,
          freightUsdPerKg: baseFreight
        }));
      }

      if (syncedParams.country) {
        const dutyPreset = COUNTRY_DUTY_PRESETS[syncedParams.country];
        if (dutyPreset) {
          setDdpInputs((prev) => ({
            ...prev,
            destinationCountry: syncedParams.country,
            dutyRatePct: dutyPreset.duty_rate_pct,
            vatRatePct: dutyPreset.vat_rate_pct
          }));
        }
      }
    }
  }, [syncedParams]);

  // Results State
  const [fobResult, setFobResult] = useState<FOBOutputs | null>(null);
  
  // CIF State
  const [cifInputs, setCifInputs] = useState<CIFInputs>({
    destinationPort: 'Hamburg, Germany',
    freightUsdPerKg: 0,
    insuranceRatePct: 0.3
  });
  const [cifResult, setCifResult] = useState<CIFOutputs | null>(null);

  // DDP State
  const [ddpInputs, setDdpInputs] = useState<DDPInputs>({
    destinationCountry: 'Germany',
    dutyRatePct: 0,
    vatRatePct: 19.0,
    inlandFreightUsd: DEFAULT_INLAND_FREIGHT_USD,
    customsHandlingUsd: DEFAULT_CUSTOMS_HANDLING_USD
  });
  const [ddpResult, setDdpResult] = useState<DDPOutputs | null>(null);

  const [activeSubTab, setActiveSubTab] = useState<'fob' | 'cif' | 'ddp' | 'comparison'>('fob');

  // Trigger Calculations
  const handleCalculateFOB = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const output = calculateFobPrice(fobInputs);
      setFobResult(output);
      
      // Auto chain to default CIF and DDP outputs if user is PRO
      if (user.role === 'pro') {
        const defaultCif = calculateCifPrice(output, {
          destinationPort: cifInputs.destinationPort,
          freightUsdPerKg: cifInputs.freightUsdPerKg,
          insuranceRatePct: cifInputs.insuranceRatePct
        });
        setCifResult(defaultCif);

        const defaultDdp = calculateDdpPrice(defaultCif, {
          destinationCountry: ddpInputs.destinationCountry,
          dutyRatePct: ddpInputs.dutyRatePct,
          vatRatePct: ddpInputs.vatRatePct,
          inlandFreightUsd: ddpInputs.inlandFreightUsd,
          customsHandlingUsd: ddpInputs.customsHandlingUsd
        });
        setDdpResult(defaultDdp);
      }

      onCalculationLogged({
        calculationType: 'FOB',
        commodity: fobInputs.commodity,
        volumeKg: fobInputs.volumeKg,
        inputs: JSON.stringify(fobInputs),
        outputs: JSON.stringify(output)
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCalculateCIF = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fobResult) {
      alert('Please calculate the FOB value first on the FOB tab!');
      return;
    }
    try {
      const output = calculateCifPrice(fobResult, cifInputs);
      setCifResult(output);

      // Auto chain to default DDP output
      const defaultDdp = calculateDdpPrice(output, {
        destinationCountry: ddpInputs.destinationCountry,
        dutyRatePct: ddpInputs.dutyRatePct,
        vatRatePct: ddpInputs.vatRatePct,
        inlandFreightUsd: ddpInputs.inlandFreightUsd,
        customsHandlingUsd: ddpInputs.customsHandlingUsd
      });
      setDdpResult(defaultDdp);

      onCalculationLogged({
        calculationType: 'CIF',
        commodity: fobInputs.commodity,
        volumeKg: fobInputs.volumeKg,
        inputs: JSON.stringify(cifInputs),
        outputs: JSON.stringify(output)
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCalculateDDP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cifResult) {
      alert('Please calculate the CIF value first on the CIF tab!');
      return;
    }
    try {
      const output = calculateDdpPrice(cifResult, ddpInputs);
      setDdpResult(output);

      onCalculationLogged({
        calculationType: 'DDP',
        commodity: fobInputs.commodity,
        volumeKg: fobInputs.volumeKg,
        inputs: JSON.stringify(ddpInputs),
        outputs: JSON.stringify(output)
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Sync duty presets
  const handleCountryPresetChange = (country: string) => {
    const preset = COUNTRY_DUTY_PRESETS[country];
    if (preset) {
      setDdpInputs((prev) => ({
        ...prev,
        destinationCountry: country,
        dutyRatePct: preset.duty_rate_pct,
        vatRatePct: preset.vat_rate_pct
      }));
    }
  };

  // Compare multi-port rates
  const portsList = Object.keys(DESTINATION_PORT_PRESETS).filter(p => p !== 'Custom / Other');

  return (
    <div className="space-y-6">
      
      {/* Tab Navigation header */}
      <div className="flex bg-[#161b27] border border-[#2d3748] rounded-xl p-1 gap-1">
        <button
          onClick={() => setActiveSubTab('fob')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeSubTab === 'fob' ? 'bg-[#2563eb] text-white' : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          FOB Costing (Free)
        </button>
        
        <button
          onClick={() => setActiveSubTab('cif')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeSubTab === 'cif' ? 'bg-[#2563eb] text-white' : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          CIF Pricing {user.role === 'free' && <Lock className="w-3 h-3 text-[#D4A017]" />}
        </button>

        <button
          onClick={() => setActiveSubTab('ddp')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeSubTab === 'ddp' ? 'bg-[#2563eb] text-white' : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          DDP Cust/VAT {user.role === 'free' && <Lock className="w-3 h-3 text-[#D4A017]" />}
        </button>

        <button
          onClick={() => setActiveSubTab('comparison')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeSubTab === 'comparison' ? 'bg-[#2563eb] text-white' : 'text-[#94a3b8] hover:text-white'
          }`}
        >
          Port Comparison Table {user.role === 'free' && <Lock className="w-3 h-3 text-[#D4A017]" />}
        </button>
      </div>

      {activeSubTab === 'fob' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* FOB Form Left */}
          <form onSubmit={handleCalculateFOB} className="lg:col-span-4 bg-[#161b27] border border-[#2d3748] p-6 rounded-2xl space-y-4">
            <h3 className="font-extrabold text-white text-base uppercase tracking-tight flex items-center gap-1.5">
              <Calculator className="w-5 h-5 text-blue-500" />
              FOB Costing Configuration
            </h3>

            <div>
              <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Spice Commodity</label>
              <select
                value={fobInputs.commodity}
                onChange={(e) => setFobInputs({ ...fobInputs, commodity: e.target.value })}
                className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-2 text-xs text-[#e6eaf0] focus:outline-none focus:border-[#2563eb] w-full"
              >
                <option value="Cassia Whole">Cassia Whole</option>
                <option value="Cassia Powder">Cassia Powder</option>
                <option value="Black Pepper (Whole)">Black Pepper (Whole)</option>
                <option value="White Pepper (Whole)">White Pepper (Whole)</option>
                <option value="Clove">Clove Whole</option>
                <option value="Nutmeg">ABCD Whole Nutmeg</option>
                <option value="Vanilla">Gourmet Vanilla Beans</option>
                <option value="Patchouli Oil">Sumatran Patchouli Oil</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase mb-1">Volume Quantity (Kg)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={fobInputs.volumeKg}
                  onChange={(e) => setFobInputs({ ...fobInputs, volumeKg: Number(e.target.value) })}
                  className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-3 py-2 text-xs text-[#e6eaf0] w-full focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase mb-1">Exchange Rate USD</label>
                <input
                  type="number"
                  required
                  value={fobInputs.exchangeRate}
                  onChange={(e) => setFobInputs({ ...fobInputs, exchangeRate: Number(e.target.value) })}
                  className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-3 py-2 text-xs text-[#e6eaf0] w-full focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Export Loading Port</label>
              <select
                value={fobInputs.loadingPort}
                onChange={(e) => setFobInputs({ ...fobInputs, loadingPort: e.target.value })}
                className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-2 text-xs text-[#e6eaf0] focus:outline-none focus:border-[#2563eb] w-full"
              >
                {Object.keys(DOMESTIC_FREIGHT_COST_IDR).map((port) => (
                  <option key={port} value={port}>{port}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Export Packaging Mode</label>
              <select
                value={fobInputs.packagingType}
                onChange={(e) => setFobInputs({ ...fobInputs, packagingType: e.target.value })}
                className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-2 text-xs text-[#e6eaf0] focus:outline-none focus:border-[#2563eb] w-full"
              >
                <option value="PP Woven Bag 25 Kg">PP Woven Bag 25 Kg</option>
                <option value="PP Woven Bag 50 Kg">PP Woven Bag 50 Kg</option>
                <option value="Kraft Paper Bag 20 Kg">Kraft Paper Bag 20 Kg</option>
                <option value="Kraft Paper Bag 25 Kg">Kraft Paper Bag 25 Kg</option>
                <option value="Vacuum Bag + Carton 5 Kg">Vacuum Bag + Carton 5 Kg</option>
                <option value="Vacuum Bag + Carton 10 Kg">Vacuum Bag + Carton 10 Kg</option>
                <option value="HDPE Drum 25 Kg">HDPE Drum 25 Kg</option>
                <option value="Steel Drum 180 Kg">Steel Drum 180 Kg</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-lg shrink-0 mt-3"
            >
              Calculate Export FOB Value
            </button>
          </form>

          {/* FOB Results Right */}
          <div className="lg:col-span-8 bg-[#161b27] border border-[#2d3748] p-6 rounded-2xl flex flex-col justify-between">
            {fobResult ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-white text-base uppercase tracking-tight">FOB Costs & Exporter Margins</h3>
                    <p className="text-xs text-[#94a3b8]">Commodity Base: <strong className="text-white">{fobResult.commodity} ({fobResult.origin})</strong> &nbsp;|&nbsp; HS Code: <strong className="text-[#D4A017] font-mono">{fobResult.hsCode}</strong></p>
                  </div>
                  <span className="bg-[#14532d] text-[#bbf7d0] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase">FOB SECURE</span>
                </div>

                {/* 3 Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#1e2636] border border-[#2d3748] p-4 rounded-xl">
                    <p className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">FOB PRICE / KG</p>
                    <h4 className="text-2xl font-black text-[#D4A017] mt-1 font-mono">
                      $ {fobResult.fobPricePerKg.toFixed(4)}
                    </h4>
                    <p className="text-[9px] text-gray-500 mt-1">Approx. IDR {(fobResult.fobPricePerKg * fobResult.exchangeRate).toLocaleString()} /Kg</p>
                  </div>

                  <div className="bg-[#1e2636] border border-[#2d3748] p-4 rounded-xl">
                    <p className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">TOTAL CONTRACT FOB</p>
                    <h4 className="text-2xl font-black text-white mt-1 font-mono">
                      $ {fobResult.fobTotalUsd.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </h4>
                  </div>

                  <div className="bg-[#1e2636] border border-[#2d3748] p-4 rounded-xl">
                    <p className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">ESTIMATED PRODUCER PROFIT</p>
                    <h4 className="text-2xl font-black text-[#16a34a] mt-1 font-mono">
                      $ {fobResult.profitUsd.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1">Fixed Profit Margin: {fobResult.marginPercent}%</p>
                  </div>
                </div>

                {/* Detailed cost breakdown table */}
                <div className="border-t border-[#2d3748] pt-4 space-y-2">
                  <h4 className="text-xs font-bold text-[#94a3b8] uppercase tracking-wide">Shipment Production Accounting Breakdown (IDR)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-gray-300">
                      <thead>
                        <tr className="border-b border-[#2d3748] text-gray-400">
                          <th className="pb-1">Cost Parameter Component</th>
                          <th className="pb-1 text-right">Lump-Sum IDR</th>
                          <th className="pb-1 text-right">Equivalent USD</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2d3748]">
                        <tr>
                          <td className="py-2">Raw Spice Materials Cost</td>
                          <td className="py-2 text-right">IDR {fobResult.breakdownTotal.raw_material_idr.toLocaleString()}</td>
                          <td className="py-2 text-right">$ {(fobResult.breakdownTotal.raw_material_idr / fobResult.exchangeRate).toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                        </tr>
                        <tr>
                          <td className="py-2">Local Warehousing &amp; Processing</td>
                          <td className="py-2 text-right">IDR {fobResult.breakdownTotal.processing_idr.toLocaleString()}</td>
                          <td className="py-2 text-right">$ {(fobResult.breakdownTotal.processing_idr / fobResult.exchangeRate).toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                        </tr>
                        <tr>
                          <td className="py-2">Unit Bags / Barrels Custom Packaging</td>
                          <td className="py-2 text-right">IDR {fobResult.breakdownTotal.packaging_idr.toLocaleString()}</td>
                          <td className="py-2 text-right">$ {(fobResult.breakdownTotal.packaging_idr / fobResult.exchangeRate).toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                        </tr>
                        <tr>
                          <td className="py-2">Domestic Road Freight to {fobResult.loadingPort}</td>
                          <td className="py-2 text-right">IDR {fobResult.breakdownTotal.domestic_freight_idr.toLocaleString()}</td>
                          <td className="py-2 text-right">$ {(fobResult.breakdownTotal.domestic_freight_idr / fobResult.exchangeRate).toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                        </tr>
                        <tr>
                          <td className="py-2">Export Customs &amp; PEB Port Handling</td>
                          <td className="py-2 text-right">IDR {fobResult.breakdownTotal.port_handling_idr.toLocaleString()}</td>
                          <td className="py-2 text-right">$ {(fobResult.breakdownTotal.port_handling_idr / fobResult.exchangeRate).toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                        </tr>
                        <tr className="bg-blue-950/20">
                          <td className="py-2 font-mono italic">Export Documentation (Lump-Sum Govt Fees)*</td>
                          <td className="py-2 text-right font-mono">IDR {fobResult.documentationFixedIdr.toLocaleString()}</td>
                          <td className="py-2 text-right font-mono">$ {(fobResult.documentationFixedIdr / fobResult.exchangeRate).toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-gray-500 italic mt-2">
                    * Documentation comprises mandatory SKA/COO, Halal declarations, Fitosanitari, and Government inspections. It behaves as a fixed flat fee per shipment transaction rather than multiplying infinitely per Cargo Kg.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-full text-center py-12 text-gray-500">
                <Calculator className="w-12 h-12 text-gray-700 mb-3" />
                <h4 className="font-bold text-white mb-1">FOB Calculator Standby</h4>
                <p className="text-xs max-w-sm">Please fill out the sourcing parameters and press calculate to load full FOB costs.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🔒 PRO UPGRADE CALLOUT OVER TABS */}
      {user.role === 'free' && activeSubTab !== 'fob' && (
        <div className="bg-[#161b27] border-2 border-[#D4A017] p-8 rounded-2xl text-center space-y-4 max-w-xl mx-auto shadow-xl my-6">
          <Lock className="w-12 h-12 text-[#D4A017] mx-auto animate-bounce" />
          <h3 className="font-extrabold text-[#D4A017] text-lg uppercase tracking-tight">🔒 InTradeX-Pro Premium Tool Locked</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Ocean Freight Forwarding (CIF calculations), Destination Import Taxes/Customs Brokerage audits (DDP pricing), and multi-port competitive matrices are premium modules reserved for <strong>InTradeX-Pro</strong> subscribers (IDR 76,999 / Month).
          </p>
          <div className="bg-[#1e2636] p-3 rounded-lg border border-[#2d3748] text-xs font-mono text-gray-400">
            Current Account Status: <span className="font-bold uppercase text-blue-400">InTradeX-Mate (FREE)</span>
          </div>
          <div className="text-[10px] text-gray-500 leading-none pt-2">
            Click the &quot;Upgrade to Pro&quot; submittal button on the landing index to request administrative unlock.
          </div>
        </div>
      )}

      {/* CIF TAB FOR PRO USERS */}
      {user.role === 'pro' && activeSubTab === 'cif' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={handleCalculateCIF} className="lg:col-span-4 bg-[#161b27] border border-[#2d3748] p-6 rounded-2xl space-y-4">
            <h3 className="font-extrabold text-[#D4A017] text-base uppercase tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-[#D4A017]" />
              CIF Costing Configuration
            </h3>

            <div>
              <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Destination Port</label>
              <select
                value={cifInputs.destinationPort}
                onChange={(e) => {
                  const port = e.target.value;
                  const pr = DESTINATION_PORT_PRESETS[port];
                  setCifInputs({
                    ...cifInputs,
                    destinationPort: port,
                    freightUsdPerKg: pr ? pr.base_freight_usd_per_kg : 0
                  });
                }}
                className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-2 text-xs text-[#e6eaf0] focus:outline-none focus:border-[#2563eb] w-full"
              >
                {Object.keys(DESTINATION_PORT_PRESETS).map((p) => (
                  <option key={p} value={p}>{p} ({DESTINATION_PORT_PRESETS[p].region})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase mb-1">Ocean Freight Rate (USD/Kg)</label>
              <input
                type="number"
                step="0.001"
                required
                value={cifInputs.freightUsdPerKg}
                onChange={(e) => setCifInputs({ ...cifInputs, freightUsdPerKg: Number(e.target.value) })}
                className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-3 py-2 text-xs text-[#e6eaf0] w-full focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase mb-1">Insurance Rate (% of CIF)</label>
              <input
                type="number"
                step="0.01"
                required
                value={cifInputs.insuranceRatePct}
                onChange={(e) => setCifInputs({ ...cifInputs, insuranceRatePct: Number(e.target.value) })}
                className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-3 py-2 text-xs text-[#e6eaf0] w-full focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-lg shrink-0 mt-3"
            >
              Calculate CIF Value
            </button>
          </form>

          {/* CIF RESULTS RIGHT */}
          <div className="lg:col-span-8 bg-[#161b27] border border-[#2d3748] p-6 rounded-2xl flex flex-col justify-between">
            {cifResult ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-[#D4A017] text-base uppercase tracking-tight">Premium CIF Delivery Quotation</h3>
                    <p className="text-xs text-[#94a3b8]">Commodity: <strong className="text-white">{cifResult.commodity}</strong> &nbsp;|&nbsp; Route: <strong className="text-white">Indonesia FOB → {cifResult.destinationPort}</strong></p>
                  </div>
                  <span className="bg-[#422006] text-[#feec8a] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase border border-[#D4A017]">PRO CONTRACT READY</span>
                </div>

                {/* 3 Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#1e2636] border border-[#2d3748] p-4 rounded-xl">
                    <p className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">CIF PRICE/KG (USD)</p>
                    <h4 className="text-2xl font-black text-[#D4A017] mt-1 font-mono">
                      $ {cifResult.cifPricePerKg.toFixed(4)}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1">Preset Ocean Rate: $ {cifResult.freightUsdPerKg.toFixed(3)}/Kg</p>
                  </div>

                  <div className="bg-[#1e2636] border border-[#2d3748] p-4 rounded-xl">
                    <p className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">TOTAL CIF TRANSACTION</p>
                    <h4 className="text-2xl font-black text-white mt-1 font-mono">
                      $ {cifResult.cifTotalUsd.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </h4>
                  </div>

                  <div className="bg-[#1e2636] border border-[#2d3748] p-4 rounded-xl">
                    <p className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">SECURED INSURANCE</p>
                    <h4 className="text-2xl font-black text-[#16a34a] mt-1 font-mono">
                      $ {cifResult.insuranceUsd.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1">Based on standard {cifResult.insuranceRatePct}% ICC marine clause</p>
                  </div>
                </div>

                {/* Logistics dimensions matching */}
                <div className="bg-[#1e2636] border border-[#2d3748] p-4 rounded-xl space-y-2 text-xs">
                  <h4 className="font-bold text-white text-sm">Ocean Freight Billing Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-gray-300">
                    <p>FOB Base Transaction Sum:</p>
                    <p className="text-right text-white font-mono">$ {cifResult.fobTotalUsd.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
                    
                    <p>Ocean Shipping Line Freight Fee:</p>
                    <p className="text-right text-white font-mono">$ {cifResult.oceanFreightUsd.toLocaleString(undefined, {minimumFractionDigits:2})}</p>

                    <p className="font-bold text-[#D4A017]">Final CIF Quote Value (FOB + Freight + Insurance):</p>
                    <p className="text-right text-[#D4A017] font-bold font-mono">$ {cifResult.cifTotalUsd.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-full text-center py-12 text-gray-500">
                <Calculator className="w-12 h-12 text-gray-700 mb-3" />
                <h4 className="font-bold text-white mb-1">CIF Calculator Standby</h4>
                <p className="text-xs max-w-sm">Please hit calculate to load CIF cost.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DDP TAB FOR PRO USERS */}
      {user.role === 'pro' && activeSubTab === 'ddp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={handleCalculateDDP} className="lg:col-span-4 bg-[#161b27] border border-[#2d3748] p-6 rounded-2xl space-y-4">
            <h3 className="font-extrabold text-[#D4A017] text-base uppercase tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-[#D4A017]" />
              DDP Brokerage &amp; Duty Configuration
            </h3>

            <div>
              <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Destination Country</label>
              <select
                value={ddpInputs.destinationCountry}
                onChange={(e) => handleCountryPresetChange(e.target.value)}
                className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-2 text-xs text-[#e6eaf0] focus:outline-none focus:border-[#2563eb] w-full"
              >
                {Object.keys(COUNTRY_DUTY_PRESETS).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase mb-1">Import Duty (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={ddpInputs.dutyRatePct}
                  onChange={(e) => setDdpInputs({ ...ddpInputs, dutyRatePct: Number(e.target.value) })}
                  className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-3 py-2 text-xs text-[#e6eaf0] w-full focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase mb-1">VAT/GST Tax (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={ddpInputs.vatRatePct}
                  onChange={(e) => setDdpInputs({ ...ddpInputs, vatRatePct: Number(e.target.value) })}
                  className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-3 py-2 text-xs text-[#e6eaf0] w-full focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase mb-1">Inland Domestic Carriage (USD)</label>
              <input
                type="number"
                required
                value={ddpInputs.inlandFreightUsd}
                onChange={(e) => setDdpInputs({ ...ddpInputs, inlandFreightUsd: Number(e.target.value) })}
                className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-3 py-2.5 text-xs text-[#e6eaf0] w-full focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase mb-1">Customs Handling &amp; Broker (USD)</label>
              <input
                type="number"
                required
                value={ddpInputs.customsHandlingUsd}
                onChange={(e) => setDdpInputs({ ...ddpInputs, customsHandlingUsd: Number(e.target.value) })}
                className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-3 py-2.5 text-xs text-[#e6eaf0] w-full focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-lg shrink-0 mt-3"
            >
              Calculate Delivered DDP Cost
            </button>
          </form>

          {/* DDP RESULTS RIGHT */}
          <div className="lg:col-span-8 bg-[#161b27] border border-[#2d3748] p-6 rounded-2xl flex flex-col justify-between">
            {ddpResult ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-[#D4A017] text-base uppercase tracking-tight">DDP (Delivered Duty Paid) Audited Costing</h3>
                    <p className="text-xs text-[#94a3b8]">Commodity: <strong className="text-white">{ddpResult.commodity}</strong> &nbsp;|&nbsp; Target Delivery: <strong className="text-white">{ddpResult.destinationPort} (Duty: {ddpResult.dutyRatePct}%, VAT: {ddpResult.vatRatePct}%)</strong></p>
                  </div>
                  <span className="bg-[#422006] text-[#feec8a] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase border border-[#D4A017]">PRO ALL-IN COST LOADED</span>
                </div>

                {/* 3 Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#1e2636] border border-[#2d3748] p-4 rounded-xl">
                    <p className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">ALL-IN DDP / KG (USD)</p>
                    <h4 className="text-2xl font-black text-[#D4A017] mt-1 font-mono">
                      $ {ddpResult.ddpPricePerKg.toFixed(4)}
                    </h4>
                  </div>

                  <div className="bg-[#1e2636] border border-[#2d3748] p-4 rounded-xl">
                    <p className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">TOTAL SHIPPED DDP CONTRACT</p>
                    <h4 className="text-2xl font-black text-white mt-1 font-mono">
                      $ {ddpResult.ddpTotalUsd.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </h4>
                  </div>

                  <div className="bg-[#1e2636] border border-[#2d3748] p-4 rounded-xl">
                    <p className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">DESTINATION GOVERNMENT TAXES</p>
                    <h4 className="text-2xl font-black text-red-400 mt-1 font-mono">
                      $ {(ddpResult.importDutyUsd + ddpResult.vatUsd).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1">Duty: $ {ddpResult.importDutyUsd.toLocaleString()} | VAT: $ {ddpResult.vatUsd.toLocaleString()}</p>
                  </div>
                </div>

                {/* Port breakdown details */}
                <div className="bg-[#1e2636] border border-[#2d3748] p-4 rounded-xl text-xs space-y-2">
                  <h4 className="font-bold text-white text-sm">Post-CIF Destination Charges Log</h4>
                  <div className="grid grid-cols-2 gap-2 text-gray-300">
                    <p>CIF Port Value Base:</p>
                    <p className="text-right text-white font-mono">$ {ddpResult.cifTotalUsd.toLocaleString(undefined, {minimumFractionDigits:2})}</p>

                    <p>Destination Import Duties Paid:</p>
                    <p className="text-right text-white font-mono">$ {ddpResult.importDutyUsd.toLocaleString(undefined, {minimumFractionDigits:2})}</p>

                    <p>Customs Brokerage Handling Fee:</p>
                    <p className="text-right text-white font-mono">$ {ddpResult.customsHandlingUsd?.toLocaleString() || '0'}</p>

                    <p>Inland Delivery Carriage to Buyer Door:</p>
                    <p className="text-right text-white font-mono">$ {ddpResult.inlandFreightUsd?.toLocaleString() || '0'}</p>

                    <p className="font-bold text-[#D4A017] border-t border-gray-700 pt-2">All-In DDP Door Delivery sum:</p>
                    <p className="text-right text-[#D4A017] font-bold font-mono border-t border-gray-700 pt-2">$ {ddpResult.ddpTotalUsd.toLocaleString(undefined, {minimumFractionDigits:2})}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-full text-center py-12 text-gray-500">
                <Calculator className="w-12 h-12 text-gray-700 mb-3" />
                <h4 className="font-bold text-white mb-1">DDP Calculator Standby</h4>
                <p className="text-xs max-w-sm">Please hit calculate to load DDP delivered cost data.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PORT COMPARISON TAB FOR PRO USERS */}
      {user.role === 'pro' && activeSubTab === 'comparison' && (
        <div className="bg-[#161b27] border border-[#2d3748] p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#2d3748]">
            <div>
              <h3 className="font-extrabold text-[#D4A017] text-base uppercase tracking-tight">Global Ocean Freight competitive Pricing Table</h3>
              <p className="text-xs text-[#94a3b8]">Live simulated comparison of shipping rates and delivered parameters based on calculated FOB weight ({fobResult ? fobResult.volumeKg : 10000} Kg).</p>
            </div>
            <span className="bg-[#422006] text-[#feec8a] text-[10px] font-mono px-3 py-1 rounded-full uppercase border border-[#D4A017] font-bold">PRO UNLOCKED</span>
          </div>

          {!fobResult ? (
            <div className="text-center py-12 text-gray-500 italic">
              Please enter and run a standard FOB cost calculation on the first tab to populate the comparison model.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#e6eaf0] border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-gray-400 uppercase text-[9px] tracking-wide">
                    <th className="pb-2 pl-3">Destination Port</th>
                    <th className="pb-2">Region</th>
                    <th className="pb-2 text-right">Freight / Kg</th>
                    <th className="pb-2 text-right">Insurance Fee</th>
                    <th className="pb-2 text-right">Est. CIF Value</th>
                    <th className="pb-2 text-right">Est. CIF Price / Kg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d3748]">
                  {portsList.map((port) => {
                    const preset = DESTINATION_PORT_PRESETS[port];
                    const cifCost = calculateCifPrice(fobResult, {
                      destinationPort: port,
                      freightUsdPerKg: preset.base_freight_usd_per_kg,
                      insuranceRatePct: 0.3
                    });

                    return (
                      <tr key={port} className="bg-[#1e2636]/60 hover:bg-[#1e2636] border border-[#2d3748] rounded-xl transition">
                        <td className="py-3 pl-3 font-semibold text-white">{port}</td>
                        <td className="text-gray-400">{preset.region}</td>
                        <td className="text-right text-gray-300 font-mono">$ {preset.base_freight_usd_per_kg.toFixed(3)}</td>
                        <td className="text-right font-mono text-gray-300">$ {(cifCost.insuranceUsd).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        <td className="text-right font-extrabold text-[#D4A017] font-mono">$ {cifCost.cifTotalUsd.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        <td className="text-right font-mono font-semibold">$ {cifCost.cifPricePerKg.toFixed(4)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
