// MarketTracker - Exchange rates and commodity prices
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Activity, Info, Edit3, Check, X } from 'lucide-react';

interface MarketTrackerProps { language?: 'English' | 'Bahasa Indonesia' }

export default function MarketTracker({ language = 'English' }: MarketTrackerProps) {
  const [bufferPercent, setBufferPercent] = useState<number>(5);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<number>(16350);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isEditingRate, setIsEditingRate] = useState<boolean>(false);

  const spicePrices = [
    { name: 'Indonesian Cassia (Vera AA Whole)', baseUsdPerMt: 3650, trend: '+1.4%', isUp: true },
    { name: 'Lampung Black Pepper (ASTA)', baseUsdPerMt: 4820, trend: '+0.8%', isUp: true },
    { name: 'Muntok White Pepper (Premium)', baseUsdPerMt: 6750, trend: '-0.5%', isUp: false },
    { name: 'Indonesian Cloves (Lal Pari FAQ)', baseUsdPerMt: 6900, trend: '+2.4%', isUp: true },
    { name: 'Banda Nutmeg Kernels (ABCD)', baseUsdPerMt: 5400, trend: '-1.2%', isUp: false },
  ];

  return (
    <div className="bg-[#111827] border-2 border-[#1e293b] rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[#2d3748] pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-indigo-950/80 border border-indigo-500/30 rounded-xl"><Activity className="w-5 h-5 text-indigo-400" /></div>
          <div>
            <h3 className="font-extrabold text-sm text-white tracking-wider uppercase">OFFICIAL MACRO INDEX</h3>
            <p className="text-[10px] text-gray-400 font-mono">USD/IDR Exchange Reference</p>
          </div>
        </div>
        <div className="text-3xl font-black text-white">IDR {exchangeRate.toLocaleString()}</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {spicePrices.map((spice, idx) => (
          <div key={idx} className="bg-[#161b27] border border-[#2d3748] rounded-xl p-3 flex items-center gap-3">
            <span className={`p-1 rounded-lg ${spice.isUp ? 'bg-emerald-950/70 text-emerald-400' : 'bg-red-950/70 text-red-400'}`}>
              {spice.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            </span>
            <div className="flex-1">
              <p className="text-[10px] font-black text-white truncate">{spice.name}</p>
              <p className="text-xs text-[#D4A017] font-mono">${spice.baseUsdPerMt.toLocaleString()}/MT</p>
            </div>
            <span className={`text-[10px] font-bold ${spice.isUp ? 'text-emerald-400' : 'text-red-400'}`}>{spice.trend}</span>
          </div>
        ))}
      </div>
    </div>
  );
}