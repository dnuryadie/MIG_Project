// RfqInbox - Displays RFQs from ThinkSpices
import React, { useState } from 'react';
import { CheckCircle, Package, FileText, Trash2, ArrowRight, Clock, BarChart2, Shield } from 'lucide-react';

interface RfqHandoff { rfqId: string; commodityName: string; volumeKg: number; destinationPort: string; destinationCountry: string; exporterName: string; sourcingConfidenceScore: number; rfqReadinessScore: number; }
interface RfqInboxProps { handoff: RfqHandoff | null; onLoadToPricing: (params: any) => void; onGoToDocs: () => void; onDismiss: () => void; }

export default function RfqInbox({ handoff, onLoadToPricing, onGoToDocs, onDismiss }: RfqInboxProps) {
  if (!handoff) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-5">
        <div className="w-16 h-16 bg-[#1e2636] border border-[#334155] rounded-2xl flex items-center justify-center"><Package className="w-8 h-8 text-slate-600" /></div>
        <div>
          <h3 className="font-extrabold text-white text-lg">No Pending RFQ</h3>
          <p className="text-slate-400 text-sm max-w-sm">When a buyer finalises an RFQ in ThinkSpices, it will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-[#161b27] border border-[#2d3748] rounded-xl p-5">
        <h4 className="font-bold text-white">RFQ: {handoff.rfqId}</h4>
        <p className="text-sm text-slate-400">Commodity: {handoff.commodityName} | Volume: {handoff.volumeKg.toLocaleString()} Kg</p>
        <p className="text-sm text-slate-400">Destination: {handoff.destinationPort}, {handoff.destinationCountry}</p>
        <div className="flex gap-2 mt-4">
          <button onClick={() => onLoadToPricing({ commodity: handoff.commodityName, volume: handoff.volumeKg, packType: 'PP Woven Bag 25 Kg', country: handoff.destinationCountry, destinationPort: handoff.destinationPort, exchangeRate: 16500 })} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold">Load to Pricing</button>
          <button onClick={onDismiss} className="bg-slate-800 hover:bg-slate-700 text-slate-400 px-4 py-2 rounded-lg text-xs font-bold">Dismiss</button>
        </div>
      </div>
    </div>
  );
}