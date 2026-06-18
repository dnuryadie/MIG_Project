import React, { useState } from 'react';
import { Users, FileText, Check, X, Shield, ArrowDown, ArrowUp, BarChart2, Star } from 'lucide-react';
import { UserProfile, UpgradeRequest, DocumentRecord, CalculationRecord } from './types';

interface AdminPanelProps {
  currentUser: UserProfile;
  users: UserProfile[];
  requests: UpgradeRequest[];
  documents: DocumentRecord[];
  calculations: CalculationRecord[];
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onToggleUserRole: (uid: string) => void;
  promoSettings?: { slotsTarget: number; slotsOccupied: number; promoPriceIdr: number; isPromoActive: boolean };
  onUpdatePromoSettings?: (settings: any) => void;
}

export default function AdminPanel({ currentUser, users, requests, documents, calculations, onApproveRequest, onRejectRequest, onToggleUserRole, promoSettings, onUpdatePromoSettings }: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'requests' | 'promotions' | 'analytics'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [slotsTargetLocal, setSlotsTargetLocal] = useState(promoSettings?.slotsTarget ?? 100);
  const [slotsOccupiedLocal, setSlotsOccupiedLocal] = useState(promoSettings?.slotsOccupied ?? 86);
  const [promoPriceLocal, setPromoPriceLocal] = useState(promoSettings?.promoPriceIdr ?? 76999);
  const [isPromoActiveLocal, setIsPromoActiveLocal] = useState(promoSettings?.isPromoActive ?? true);

  const totalDocs = documents.length;
  const totalCalcs = calculations.length;
  const totalUsers = users.length;
  const proUsersCount = users.filter(u => u.role === 'pro').length;

  const filteredUsers = users.filter(u => u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || u.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()) );

  return (
    <div className="space-y-6">
      {/* Admin header - truncated for brevity */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#161b27] border border-[#2d3748] p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-black text-white normal-case tracking-tight">InTradeX Control Center</h2>
            <span className="bg-[#422006] text-[#fef3c7] text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider font-extrabold border border-[#D4A017] flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#D4A017] />Super Admin View
            </span>
          </div>
        </div>
      </div>
      {/* Grid cards for stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#161b27] border border-[#2d3748] p-5 rounded-2xl flex items-center justify-between">
          <div><p className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">Registered Users</p><h4 className="text-3xl font-black text-white mt-2 font-mono">{totalUsers}</h4></div>
          <div className="p-3 bg-[#1e2636] border border-[#2d3748] rounded-xl text-blue-400"><Users className="w-6 h-6" /></div>
        </div>
        <div className="bg-[#161b27] border border-[#2d3748] p-5 rounded-2xl flex items-center justify-between">
          <div><p className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">PRO Memberships</p><h4 className="text-3xl font-black text-[#D4A017] mt-2 font-mono">{proUsersCount}</h4></div>
          <div className="p-3 bg-yellow-950/60 border border-yellow-800/50 rounded-xl text-[#D4A017]"><Star className="w-6 h-6 fill-[#D4A017]" /></div>
        </div>
        <div className="bg-[#161b27] border border-[#2d3748] p-5 rounded-2xl flex items-center justify-between">
          <div><p className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">Trade Docs Issued</p><h4 className="text-3xl font-black text-white mt-2 font-mono">{totalDocs}</h4></div>
          <div className="p-3 bg-[#1e2636] border border-[#2d3748] rounded-xl text-[#16a34a]"><FileText className="w-6 h-6" /></div>
        </div>
        <div className="bg-[#161b27] border border-[#2d3748] p-5 rounded-2xl flex items-center justify-between">
          <div><p className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">Incoterm Calculations</p><h4 className="text-3xl font-black text-white mt-2 font-mono">{totalCalcs}</h4></div>
          <div className="p-3 bg-[#1e2636] border border-[#2d3748] rounded-xl text-indigo-400"><BarChart2 className="w-6 h-6" /></div>
        </div>
      </div>
    </div>
  );
}