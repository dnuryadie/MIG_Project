import React, { useState } from 'react';
import { Leaf, Menu, X, Sun, Moon } from 'lucide-react';

type CurrentApp = 'home' | 'thinkspices' | 'intradex';

interface EcosystemBarProps { current: CurrentApp }

const leftNavLinks = [
  { name: 'Home', href: '#home', hashKey: 'home' as CurrentApp | null },
  { name: 'Dashboard', href: '#home', hashKey: null },
  { name: 'Market Intel', href: '#home', hashKey: null },
  { name: 'Resources', href: '#home', hashKey: null },
  { name: 'About MIG', href: '#home', hashKey: null },
];

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('mig-theme');
    if (saved) return saved === 'dark';
    return document.documentElement.classList.contains('dark');
  });
  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) { document.documentElement.classList.add('dark'); document.documentElement.classList.remove('light-mode'); localStorage.setItem('mig-theme', 'dark'); }
    else { document.documentElement.classList.remove('dark'); document.documentElement.classList.add('light-mode'); localStorage.setItem('mig-theme', 'light'); }
  };
  return { isDark, toggle };
}

export function EcosystemBar({ current }: EcosystemBarProps) {
  const [open, setOpen] = useState(false);
  const { isDark, toggle } = useTheme();
  const navigate = (hash: string) => { window.location.hash = hash; setOpen(false); };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-10 bg-slate-900 border-b border-slate-700 flex items-center px-4 sm:px-6 gap-3">
        <button onClick={() => navigate('home')} className="flex items-center gap-1.5 shrink-0 cursor-pointer">
          <div className="w-5 h-5 bg-gradient-to-br from-amber-500 to-orange-500 rounded flex items-center justify-center"><Leaf className="w-3 h-3 text-white" /></div>
          <span className="text-[11px] font-black text-white tracking-widest uppercase hidden sm:block">MIG</span>
        </button>
        <div className="w-px h-5 bg-slate-700 hidden sm:block shrink-0" />
        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {leftNavLinks.map((link) => {
            const isActive = link.hashKey !== null && link.hashKey === current;
            return (
              <button key={link.name} onClick={() => navigate(link.href.replace('#', ''))} className={`px-3 py-1 text-[11px] font-semibold rounded transition flex items-center gap-1.5 cursor-pointer ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}{link.name}
              </button>
            );
          })}
        </nav>
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <button onClick={toggle} className="flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-all" title={isDark ? 'Light' : 'Dark'}>
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <div className="w-px h-5 bg-slate-700 shrink-0" />
          <button onClick={() => navigate('thinkspices')} className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${current === 'thinkspices' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 border border-slate-700'}`}><Leaf className="w-3 h-3" />ThinkSpices</button>
          <button onClick={() => navigate('intradex')} className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${current === 'intradex' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'bg-slate-800 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 border border-slate-700'}`}><span className="w-3.5 h-3.5 bg-indigo-600 rounded text-white text-[8px] font-black flex items-center justify-center">IX</span>InTradeX</button>
        </div>
        <button onClick={() => setOpen(o => !o)} className="md:hidden p-1.5 text-slate-400 hover:text-white rounded transition-colors">{open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}</button>
      </div>
      {open && <div className="fixed top-10 left-0 right-0 z-[59] bg-slate-900 border-b border-slate-700 shadow-xl md:hidden"><div className="px-4 py-3 space-y-1">{leftNavLinks.map((link) => (<button key={link.name} onClick={() => navigate(link.href.replace('#', ''))} className="w-full flex items-center gap-2 px-3 py-3 rounded text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5">{link.name}</button>))}</div></div>}
    </>
  );
}