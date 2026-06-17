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
  promoSettings?: {
    slotsTarget: number;
    slotsOccupied: number;
    promoPriceIdr: number;
    isPromoActive: boolean;
  };
  onUpdatePromoSettings?: (settings: any) => void;
}

export default function AdminPanel({
  currentUser,
  users,
  requests,
  documents,
  calculations,
  onApproveRequest,
  onRejectRequest,
  onToggleUserRole,
  promoSettings,
  onUpdatePromoSettings
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'requests' | 'promotions' | 'analytics'>('users');
  const [searchTerm, setSearchTerm] = useState('');

  // Promo local settings
  const [slotsTargetLocal, setSlotsTargetLocal] = useState(promoSettings?.slotsTarget ?? 100);
  const [slotsOccupiedLocal, setSlotsOccupiedLocal] = useState(promoSettings?.slotsOccupied ?? 86);
  const [promoPriceLocal, setPromoPriceLocal] = useState(promoSettings?.promoPriceIdr ?? 76999);
  const [isPromoActiveLocal, setIsPromoActiveLocal] = useState(promoSettings?.isPromoActive ?? true);

  // Sourcing stats
  const totalDocs = documents.length;
  const totalCalcs = calculations.length;
  const totalUsers = users.length;
  const proUsersCount = users.filter(u => u.role === 'pro').length;

  const filteredUsers = users.filter(
    u =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#161b27] border border-[#2d3748] p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-black text-white normal-case tracking-tight whitespace-nowrap">InTradeX™ Control Center</h2>
            <span className="bg-[#422006] text-[#fef3c7] text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider font-extrabold border border-[#D4A017] flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#D4A017]" />
              Super Admin View
            </span>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">Logged in as: <strong className="text-white font-mono">{currentUser.email}</strong> &nbsp;|&nbsp; Master Operator of PT Magastu Indoprime Group</p>
        </div>
        
        {/* Navigation Selector */}
        <div className="flex bg-[#1e2636] border border-[#2d3748] rounded-xl p-1 gap-1 flex-wrap">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'users' ? 'bg-[#2563eb] text-white shadow' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Exporters List ({users.length})
          </button>
          <button
            onClick={() => setActiveSubTab('requests')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 relative ${
              activeSubTab === 'requests' ? 'bg-[#2563eb] text-white shadow' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Upgrade Claims ({requests.filter(r => r.status === 'pending').length})
            {requests.some(r => r.status === 'pending') && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('promotions')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'promotions' ? 'bg-[#2563eb] text-white shadow' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-[#D4A017] fill-[#D4A017]" />
            Launch Promotions 🚀
          </button>
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'analytics' ? 'bg-[#2563eb] text-white shadow' : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            SaaS Analytics
          </button>
        </div>
      </div>

      {/* ── ANALYTICS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#161b27] border border-[#2d3748] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider leading-none">Registered Users</p>
            <h4 className="text-3xl font-black text-white mt-2 font-mono">{totalUsers}</h4>
            <p className="text-[10px] text-gray-400 mt-1">Indonesian UMKM Traders</p>
          </div>
          <div className="p-3 bg-[#1e2636] border border-[#2d3748] rounded-xl text-blue-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#161b27] border border-[#2d3748] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider leading-none">PRO Memberships</p>
            <h4 className="text-3xl font-black text-[#D4A017] mt-2 font-mono">{proUsersCount}</h4>
            <p className="text-[10px] text-yellow-500/80 mt-1">Active Subscribers</p>
          </div>
          <div className="p-3 bg-yellow-950/60 border border-yellow-800/50 rounded-xl text-[#D4A017]">
            <Star className="w-6 h-6 fill-[#D4A017]" />
          </div>
        </div>

        <div className="bg-[#161b27] border border-[#2d3748] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider leading-none">Trade Docs Issued</p>
            <h4 className="text-3xl font-black text-white mt-2 font-mono">{totalDocs}</h4>
            <p className="text-[10px] text-gray-400 mt-1">Invoices, Contracts, Lists</p>
          </div>
          <div className="p-3 bg-[#1e2636] border border-[#2d3748] rounded-xl text-[#16a34a]">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#161b27] border border-[#2d3748] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider leading-none">Incoterm Calculations</p>
            <h4 className="text-3xl font-black text-white mt-2 font-mono">{totalCalcs}</h4>
            <p className="text-[10px] text-gray-400 mt-1">FOB, CIF, and DDP rates</p>
          </div>
          <div className="p-3 bg-[#1e2636] border border-[#2d3748] rounded-xl text-indigo-400">
            <BarChart2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      {activeSubTab === 'users' && (
        <div className="bg-[#161b27] border border-[#2d3748] rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <h3 className="font-extrabold text-lg text-white">EXPORT USER REGISTRY</h3>
            <input
              type="text"
              placeholder="Search exporter name, company, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-2 text-xs text-[#e6eaf0] focus:outline-none focus:border-[#2563eb] w-full sm:max-w-xs"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#e6eaf0] border-collapse">
              <thead>
                <tr className="border-b border-[#2d3748] text-[#94a3b8] uppercase text-[10px] tracking-wider">
                  <th className="pb-3 pt-2 pl-3">Exporter Profile</th>
                  <th className="pb-3 pt-2">Company Name</th>
                  <th className="pb-3 pt-2">Country</th>
                  <th className="pb-3 pt-2">Username / UID</th>
                  <th className="pb-3 pt-2">Access Role</th>
                  <th className="pb-3 pt-2 text-right pr-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3748]">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-[#1e2636]/50">
                    <td className="py-4 pl-3">
                      <p className="font-bold text-white text-sm">{user.fullName}</p>
                      <p className="text-[11px] text-[#94a3b8] font-mono leading-none mt-1">{user.email}</p>
                    </td>
                    <td><span className="font-semibold">{user.companyName}</span></td>
                    <td>{user.country}</td>
                    <td>
                      <p className="font-mono">{user.username}</p>
                      <p className="text-[10px] text-gray-500 font-mono leading-none mt-0.5">{user.uid}</p>
                    </td>
                    <td>
                      {user.role === 'pro' ? (
                        <span className="bg-[#422006] text-[#feec8a] font-extrabold px-2.5 py-0.5 rounded border border-[#D4A017] text-[10px] uppercase font-mono">PRO</span>
                      ) : (
                        <span className="bg-gray-800 text-gray-300 font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono">MATE</span>
                      )}
                    </td>
                    <td className="py-4 text-right pr-3">
                      {user.uid !== currentUser.uid ? (
                        <button
                          onClick={() => onToggleUserRole(user.uid)}
                          className={`px-3 py-1 rounded font-bold text-[10px] uppercase tracking-wide transition ${
                            user.role === 'pro'
                              ? 'bg-red-950 hover:bg-red-900 text-red-300 border border-red-800'
                              : 'bg-yellow-950 hover:bg-yellow-900 text-[#D4A017] border border-yellow-800'
                          }`}
                        >
                          {user.role === 'pro' ? 'Downgrade' : 'Upgrade to PRO'}
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-500 italic pr-3 font-mono">You (Admin)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'requests' && (
        <div className="bg-[#161b27] border border-[#2d3748] rounded-2xl p-6 space-y-4">
          <h3 className="font-extrabold text-lg text-white">MEMBERSHIP UPGRADE TICKETS</h3>
          <p className="text-xs text-[#94a3b8]">Review manual premium requests, cross-reference payment slips, and trigger account promotional layers.</p>

          {requests.length === 0 ? (
            <div className="text-center py-10 bg-[#1e2636]/30 border border-[#2d3748] rounded-xl text-gray-500 italic">
              No upgrade request claim tickets registered in the database.
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req.requestId} className="bg-[#1e2636] border border-[#2d3748] p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-yellow-600/40 transition">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#0f172a] text-blue-400 font-mono text-[10px] border border-[#2d3748] px-2 py-0.5 rounded">ID: {req.requestId}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono ${
                        req.status === 'approved' ? 'bg-[#14532d] text-[#bbf7d0]' : req.status === 'rejected' ? 'bg-[#450a0a] text-[#fecaca]' : 'bg-yellow-950 text-[#fef3c7] animate-pulse border border-yellow-800/40'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-white">{req.fullName}</h4>
                      <p className="text-xs text-gray-400">{req.companyName} &nbsp;·&nbsp; {req.email}</p>
                    </div>

                    {req.notes && (
                      <div className="bg-[#161b27] border border-[#2d3748] px-3 py-2 rounded text-xs leading-relaxed text-[#94a3b8] italic">
                        &quot;{req.notes}&quot;
                      </div>
                    )}
                    
                    <p className="text-[10px] text-gray-500 font-mono leading-none">Claim filed on: {new Date(req.requestDate).toLocaleString()}</p>
                  </div>

                  {req.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onApproveRequest(req.requestId)}
                        className="bg-[#16a34a] hover:bg-[#15803d] text-white p-2 rounded-xl transition flex items-center justify-center border border-[#15803d] text-xs font-bold px-3 gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Approve PRO
                      </button>
                      <button
                        onClick={() => onRejectRequest(req.requestId)}
                        className="bg-[#dc2626] hover:bg-[#b91c1c] text-white p-2 rounded-xl transition flex items-center justify-center border border-[#b91c1c] text-xs font-bold px-3 gap-1"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'promotions' && (
        <div className="bg-[#161b27] border border-[#2d3748] rounded-2xl p-6 space-y-6 animate-fadeIn">
          <div className="border-b border-[#2d3748] pb-3">
            <h3 className="font-extrabold text-lg text-white">LAUNCH PROMOTIONAL TUNING</h3>
            <p className="text-xs text-[#94a3b8]">Optimize the marketing parameters for the first 100 exporters offer, pricing tiers, and urgency alerts.</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (onUpdatePromoSettings) {
              onUpdatePromoSettings({
                slotsTarget: Number(slotsTargetLocal),
                slotsOccupied: Number(slotsOccupiedLocal),
                promoPriceIdr: Number(promoPriceLocal),
                isPromoActive: isPromoActiveLocal
              });
              alert('✅ Launch Promotion parameters updated successfully near real-time across dynamic landing page modules!');
            }
          }} className="space-y-6 max-w-xl">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] uppercase mb-2">Total Slots Target</label>
                <input
                  type="number"
                  value={slotsTargetLocal}
                  onChange={(e) => setSlotsTargetLocal(Number(e.target.value))}
                  className="w-full bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-2.5 text-xs text-[#e6eaf0] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] uppercase mb-2">Occupied Slots Count</label>
                <input
                  type="number"
                  value={slotsOccupiedLocal}
                  onChange={(e) => setSlotsOccupiedLocal(Number(e.target.value))}
                  className="w-full bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-2.5 text-xs text-[#e6eaf0] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] uppercase mb-2">PRO Promotional Price (IDR)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-gray-500 font-mono">Rp</span>
                  <input
                    type="number"
                    value={promoPriceLocal}
                    onChange={(e) => setPromoPriceLocal(Number(e.target.value))}
                    className="w-full bg-[#1e2636] border border-[#2d3748] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#e6eaf0] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] uppercase mb-2">Promotion Active State</label>
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="promo-active-switch"
                    checked={isPromoActiveLocal}
                    onChange={(e) => setIsPromoActiveLocal(e.target.checked)}
                    className="w-4 h-4 bg-[#1e2636] border border-[#2d3748] rounded text-[#2563eb]"
                  />
                  <label htmlFor="promo-active-switch" className="text-xs text-[#e6eaf0] font-bold cursor-pointer select-none">
                    Enable Landing Page Promo Alerts & Counters
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-[#1e2636] border border-[#2d3748] p-4 rounded-xl text-xs space-y-1.5 font-mono">
              <span className="text-[#D4A017] font-bold text-[10px] block uppercase">Live Calculations Indicator</span>
              <p className="text-gray-300">Remaining Slots displayed on Landing Page: <strong className="text-white">{slotsTargetLocal - slotsOccupiedLocal} Slots open</strong></p>
              <p className="text-gray-300">Active Promo Price: <strong className="text-[#16a34a]">IDR {promoPriceLocal.toLocaleString()} / Month</strong></p>
            </div>

            <button
              type="submit"
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-2.5 px-6 rounded-xl transition shadow-lg text-xs uppercase tracking-wide"
            >
              Apply Launch Configurations
            </button>
          </form>
        </div>
      )}

      {activeSubTab === 'analytics' && (
        <div className="bg-[#161b27] border border-[#2d3748] rounded-2xl p-6 space-y-6">
          <div className="border-b border-[#2d3748] pb-3">
            <h3 className="font-extrabold text-lg text-white">SAAS METRICS & AUDITING</h3>
            <p className="text-xs text-[#94a3b8]">Live system logging of operations and transactional activity logs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Last 5 documents generated */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-[#94a3b8] uppercase tracking-wider">Latest Generated Trade Papers ({documents.length})</h4>
              <div className="divide-y divide-[#2d3748] bg-[#1e2636]/40 border border-[#2d3748] rounded-xl p-4 max-h-[300px] overflow-y-auto">
                {documents.length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-4 text-center">No export paper transactions mapped yet.</p>
                ) : (
                  documents.slice(-8).reverse().map((doc, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between items-center gap-2">
                      <div>
                        <p className="text-xs font-semibold text-white">{doc.fileName}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{doc.documentType} &nbsp;·&nbsp; UID: {doc.userId}</p>
                      </div>
                      <span className="text-[10px] text-[#94a3b8] font-mono shrink-0">{new Date(doc.createdDate).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* InTradeX pricing requests audit */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-[#94a3b8] uppercase tracking-wider">Active Cost Calculations Log ({calculations.length})</h4>
              <div className="divide-y divide-[#2d3748] bg-[#1e2636]/40 border border-[#2d3748] rounded-xl p-4 max-h-[300px] overflow-y-auto">
                {calculations.length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-4 text-center">No commercial pricing queries executed yet.</p>
                ) : (
                  calculations.slice(-8).reverse().map((calc, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between items-center gap-2">
                      <div>
                        <p className="text-xs font-bold text-white">{calc.commodity} ({(calc.volumeKg).toLocaleString()} Kg)</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Term: <strong className="text-indigo-400 font-mono">{calc.calculationType}</strong> &nbsp;·&nbsp; Exporter: {calc.userId}</p>
                      </div>
                      <span className="text-[10px] text-[#94a3b8] font-mono shrink-0">{new Date(calc.createdDate).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
