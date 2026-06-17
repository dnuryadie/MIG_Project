import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, DollarSign, Activity, HelpCircle, Info, Edit3, Check, X, ArrowLeftRight } from 'lucide-react';

interface MarketTrackerProps {
  language?: 'English' | 'Bahasa Indonesia';
}

export default function MarketTracker({ language = 'English' }: MarketTrackerProps) {
  const [bufferPercent, setBufferPercent] = useState<number>(5); // Default +/- 5% toggle option (can select 5% or 10%)
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Dynamic state for exchange rate with standard fallback (internally accepted standard ~16,350)
  const [exchangeRate, setExchangeRate] = useState<number>(16350);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [lastFetched, setLastFetched] = useState<string>('');
  
  // Custom manual price input override state
  const [isEditingRate, setIsEditingRate] = useState<boolean>(false);
  const [tempRateInput, setTempRateInput] = useState<string>('16350');

  // Load live rate from internationally accepted reference source
  const fetchExchangeRate = async () => {
    setIsUpdating(true);
    setApiError(null);
    try {
      // open.er-api.com is a free, CORS-enabled, real-time FX rate API run by ExchangeRate-API
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!response.ok) {
        throw new Error('Reference server returned an error');
      }
      const data = await response.json();
      if (data && data.rates && data.rates.IDR) {
        const liveRate = Math.round(data.rates.IDR * 100) / 100; // Keep decimal precision for authenticity
        // The mid-market standard rate
        setExchangeRate(liveRate);
        setTempRateInput(Math.round(liveRate).toString());
        setIsLive(true);
        setLastFetched(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: any) {
      console.warn('Unable to get real-time feed, utilizing cached commercial reference rate:', err.message);
      setApiError(err.message || 'Network lookup failed');
    } finally {
      setTimeout(() => {
        setIsUpdating(false);
      }, 500);
    }
  };

  // Run on mount
  useEffect(() => {
    fetchExchangeRate();
    // Refresh rate every 5 minutes automatically
    const interval = setInterval(fetchExchangeRate, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Spice daily market data (Base USD per Metric Ton / MT)
  const spicePrices = [
    {
      name: language === 'English' ? 'Indonesian Cassia (Vera AA Whole)' : 'Kayu Manis Cassia (Vera AA)',
      code: 'Cassia AA',
      baseUsdPerMt: 3650,
      trend: '+1.4%',
      isUp: true,
      volatility: 'Low',
    },
    {
      name: language === 'English' ? 'Lampung Black Pepper (ASTA)' : 'Lada Hitam Lampung (ASTA)',
      code: 'Black Pepper',
      baseUsdPerMt: 4820,
      trend: '+0.8%',
      isUp: true,
      volatility: 'Medium',
    },
    {
      name: language === 'English' ? 'Muntok White Pepper (Premium)' : 'Lada Putih Muntok (Premium)',
      code: 'White Pepper',
      baseUsdPerMt: 6750,
      trend: '-0.5%',
      isUp: false,
      volatility: 'Medium',
    },
    {
      name: language === 'English' ? 'Indonesian Cloves (Lal Pari FAQ)' : 'Cengkeh Lal Pari (Premium FAQ)',
      code: 'Clove Lal Pari',
      baseUsdPerMt: 6900,
      trend: '+2.4%',
      isUp: true,
      volatility: 'High',
    },
    {
      name: language === 'English' ? 'Banda Nutmeg Kernels (ABCD)' : 'Biji Pala Banda (ABCD)',
      code: 'Nutmeg ABCD',
      baseUsdPerMt: 5400,
      trend: '-1.2%',
      isUp: false,
      volatility: 'Low',
    },
  ];

  const handleManualRateSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(tempRateInput);
    if (!isNaN(parsed) && parsed > 5000 && parsed < 50000) {
      setExchangeRate(parsed);
      setIsLive(false); // Flagged as custom manual override standard
      setIsEditingRate(false);
    }
  };

  // Calculating simulated bands
  const exchangeRateLower = Math.round(exchangeRate * (1 - bufferPercent / 100));
  const exchangeRateUpper = Math.round(exchangeRate * (1 + bufferPercent / 100));

  // Prevailing daily transaction spreads for buy and sell prices (+/- 0.35% for bank cash flow spread)
  const spreadDelta = Math.round(exchangeRate * 0.0035);
  const sampleBuyRate = Math.round(exchangeRate - spreadDelta);
  const sampleSellRate = Math.round(exchangeRate + spreadDelta);

  return (
    <div id="market-tracker-panel" className="bg-[#111827] border-2 border-[#1e293b] rounded-2xl p-5 shadow-xl space-y-4">
      {/* Panel Title & Controller Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[#2d3748] pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-indigo-950/80 border border-indigo-500/30 rounded-xl">
            <Activity className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white tracking-wider flex items-center gap-1.5 uppercase">
              ✨ {language === 'English' ? 'OFFICIAL MACRO INDEX & SPOT TRACKER' : 'INDEKS MAKRO & PELACAK SPOT RESMI'}
            </h3>
            <p className="text-[10px] text-gray-400 font-mono">
              {language === 'English' ? 'Prevailing Interbank FX Daily Movements' : 'Pergerakan Valas Harian Antar Bank Terkini'}
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
          {/* Buffer Simulator Rate */}
          <div className="flex items-center bg-[#1e2636] border border-[#2d3748] rounded-xl p-1 shrink-0">
            <span className="text-[9px] text-[#94a3b8] font-black uppercase tracking-wider px-2 select-none">
              {language === 'English' ? 'FOB Estimate Buffer' : 'Penyangga FOB'}
            </span>
            <button
              onClick={() => setBufferPercent(5)}
              className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition-all ${
                bufferPercent === 5 
                  ? 'bg-indigo-600 text-white shadow font-extrabold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ±5%
            </button>
            <button
              onClick={() => setBufferPercent(10)}
              className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition-all ${
                bufferPercent === 10 
                  ? 'bg-amber-600 text-white shadow font-extrabold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ±10%
            </button>
          </div>

          <button
            onClick={fetchExchangeRate}
            disabled={isUpdating}
            className={`p-2 bg-[#1e2636] hover:bg-slate-800 border border-[#2d3748] rounded-xl text-gray-400 hover:text-white transition group ${
              isUpdating ? 'opacity-80 cursor-not-allowed' : ''
            }`}
            title={language === 'English' ? "Refresh Interbank Feed" : "Perbarui Kurs Pasar"}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Spot Rate Card (USD/IDR reference & buffer bands) */}
        <div className="lg:col-span-4 bg-[#161b27] border border-[#2d3748] rounded-xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono">
                {language === 'English' ? 'USD/IDR EXCHANGE REFERENCE' : 'NILAI ACUAN KURS USD/IDR'}
              </span>
              {isLive ? (
                <span className="bg-emerald-950/80 text-emerald-400 font-bold text-[8px] px-1.5 py-0.5 rounded border border-emerald-900/50 uppercase font-mono animate-pulse">
                  ● LIVE REFERENCE
                </span>
              ) : (
                <span className="bg-amber-950/85 text-amber-400 font-bold text-[8px] px-1.5 py-0.5 rounded border border-amber-900/50 uppercase font-mono">
                  MANUAL ADJ
                </span>
              )}
            </div>
            
            {/* Display / Edit Rate Mode */}
            {isEditingRate ? (
              <form onSubmit={handleManualRateSave} className="flex items-center gap-1.5 py-1">
                <input
                  type="number"
                  value={tempRateInput}
                  onChange={(e) => setTempRateInput(e.target.value)}
                  className="bg-[#111827] border border-indigo-500 rounded px-2 py-1 text-sm text-white font-mono font-bold w-32 focus:outline-none"
                  min="5000"
                  max="50000"
                />
                <button
                  type="submit"
                  className="p-1 px-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs transition font-extrabold flex items-center"
                  title="Save Rate"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTempRateInput(Math.round(exchangeRate).toString());
                    setIsEditingRate(false);
                  }}
                  className="p-1 px-1.5 bg-slate-800 hover:bg-slate-700 text-gray-400 rounded text-xs transition"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between group">
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-3xl font-black text-white tracking-tight">
                    IDR {exchangeRate.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">/ USD</span>
                </div>
                <button
                  onClick={() => setIsEditingRate(true)}
                  className="p-1.5 bg-slate-800/55 hover:bg-slate-700 border border-[#2d3748] rounded text-gray-400 hover:text-white transition"
                  title="Manually Adjust prevailing daily transaction standard"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Dynamic Prevailing Daily Trading Buy vs Sell Prices */}
            <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 bg-[#111827]/80 rounded-xl border border-[#2d3748]/60">
              <div>
                <span className="block text-[8px] text-indigo-400 uppercase tracking-wider font-extrabold font-mono">
                  💵 {language === 'English' ? 'PREVAILING BUY (BID)' : 'KURS BELI TRANSAKSI'}
                </span>
                <span className="text-xs font-bold text-white font-mono">
                  IDR {sampleBuyRate.toLocaleString()}
                </span>
              </div>
              <div className="border-l border-[#2d3748]/60 pl-2">
                <span className="block text-[8px] text-amber-400 uppercase tracking-wider font-extrabold font-mono">
                  🤝 {language === 'English' ? 'PREVAILING SELL (ASK)' : 'KURS JUAL TRANSAKSI'}
                </span>
                <span className="text-xs font-bold text-white font-mono">
                  IDR {sampleSellRate.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 leading-relaxed mt-2.5">
              {language === 'English' 
                ? 'Benchmark mid-market spot index sourced via internationally accepted references. Spreads are configured for daily commercial trade valuation.' 
                : 'Indeks spot pasar acuan yang bersumber dari referensi internasional terpercaya. Selisih harga dikonfigurasi untuk valuasi perdagangan komersial harian.'}
            </p>
            
            {lastFetched && (
              <div className="text-[8px] text-gray-500 font-mono mt-1 flex items-center justify-between">
                <span>Ref: ER-API Live Feed</span>
                <span>Updated: {lastFetched}</span>
              </div>
            )}
          </div>

          {/* Reference boundary indicators */}
          <div className="bg-[#1e2636]/60 border border-[#2d3748]/50 rounded-xl p-3 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-gray-400 uppercase">
                {language === 'English' ? 'FOB Simulation Limit' : 'Batas Simulasi FOB'} ({bufferPercent}%)
              </span>
              <span className="text-[#D4A017] font-bold">Standard Reference</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-[#111827] px-2.5 py-1.5 rounded-lg border border-red-950">
                <span className="block text-[8px] text-red-00 tracking-wider font-bold uppercase text-red-400">MIN (-{bufferPercent}%)</span>
                <span className="text-xs font-black text-white font-mono">IDR {exchangeRateLower.toLocaleString()}</span>
              </div>
              <div className="bg-[#111827] px-2.5 py-1.5 rounded-lg border border-emerald-950">
                <span className="block text-[8px] text-emerald-400 tracking-wider font-bold uppercase">MAX (+{bufferPercent}%)</span>
                <span className="text-xs font-black text-white font-mono">IDR {exchangeRateUpper.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOB Price Movement Estimate (Commodities tracker) */}
        <div className="lg:col-span-8 bg-[#161b27] border border-[#2d3748] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[10px] text-amber-400 font-bold uppercase tracking-widest font-mono flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-500" />
              {language === 'English' 
                ? `DAILY FOB MARKET PRICE MOVEMENT ESTIMATE (MT)` 
                : `ESTIMASI PERGERAKAN HARGA PASAR FOB HARIAN (MT)`}
            </h4>
            <span className="text-[9px] text-[#94a3b8] font-mono shrink-0">
              {language === 'English' ? 'Estimated Range:' : 'Simulasi Rentang:'} ±{bufferPercent}%
            </span>
          </div>

          {/* Commodity table header */}
          <div className="hidden sm:grid grid-cols-12 gap-2 px-3 pb-1.5 border-b border-[#2d3748]/70">
            <div className="col-span-5">
              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                {language === 'English' ? 'Commodity' : 'Komoditas'}
              </span>
            </div>
            <div className="col-span-2 text-right">
              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                {language === 'English' ? 'Spot / MT' : 'Spot / MT'}
              </span>
            </div>
            <div className="col-span-2 text-right">
              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                {language === 'English' ? 'IDR / Kg' : 'IDR / Kg'}
              </span>
            </div>
            <div className="col-span-3 text-right">
              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                ±{bufferPercent}% {language === 'English' ? 'Range' : 'Rentang'}
              </span>
            </div>
          </div>

          {/* List of species to monitor */}
          <div className="space-y-1.5">
            {spicePrices.map((spice, idx) => {
              const lowerFobUsd = Math.round(spice.baseUsdPerMt * (1 - bufferPercent / 100));
              const upperFobUsd = Math.round(spice.baseUsdPerMt * (1 + bufferPercent / 100));
              
              // Equivalent Rupiah Per Kilogram based on reference exchange rate
              const idrPerKg = Math.round((spice.baseUsdPerMt * exchangeRate) / 1000);
              const lowerIdrPerKg = Math.round((lowerFobUsd * exchangeRate) / 1000);
              const upperIdrPerKg = Math.round((upperFobUsd * exchangeRate) / 1000);

              return (
                <div 
                  key={idx} 
                  className="bg-[#111827] border border-[#2d3748] rounded-xl px-3 py-2.5 flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-2 hover:border-indigo-500/30 transition group"
                >
                  {/* Spice name & trend (5 cols) */}
                  <div className="col-span-5 flex items-center gap-2 min-w-0">
                    <span className={`p-1 rounded-lg shrink-0 ${spice.isUp ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-900/40' : 'bg-red-950/70 text-red-400 border border-red-900/40'}`}>
                      {spice.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    </span>
                    <div className="truncate">
                      <p className="text-[10.5px] font-black text-white truncate uppercase leading-tight">{spice.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[8.5px] text-gray-500 font-mono">{spice.code}</span>
                        <span className={`text-[8.5px] font-extrabold font-mono ${spice.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                          {spice.trend}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Spot price (2 cols) */}
                  <div className="col-span-2 text-left sm:text-right">
                    <span className="text-[11px] font-bold text-[#D4A017] font-mono tabular-nums">${spice.baseUsdPerMt.toLocaleString()}</span>
                  </div>

                  {/* IDR / Kg (2 cols) */}
                  <div className="col-span-2 text-left sm:text-right">
                    <span className="text-[10px] text-gray-400 font-mono tabular-nums">{idrPerKg.toLocaleString()}</span>
                  </div>

                  {/* Fluctuation range (3 cols) */}
                  <div className="col-span-3 text-left sm:text-right">
                    <div className="bg-[#161b27] px-2 py-1 border border-[#2d3748] group-hover:border-indigo-500/25 rounded-lg inline-block sm:block">
                      <span className="text-[9.5px] font-black font-mono text-white tabular-nums">
                        ${lowerFobUsd.toLocaleString()}–${upperFobUsd.toLocaleString()}
                      </span>
                      <span className="block text-[7.5px] text-gray-500 font-mono mt-0.5 tabular-nums">
                        IDR {lowerIdrPerKg.toLocaleString()}k–{upperIdrPerKg.toLocaleString()}k
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
