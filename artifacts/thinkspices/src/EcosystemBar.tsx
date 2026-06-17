import React, { useState } from 'react';
import { Leaf, Menu, X } from 'lucide-react';

type CurrentApp = 'home' | 'thinkspices' | 'intradex';

interface EcosystemBarProps {
  current: CurrentApp;
}

const navLinks = [
  { name: 'Home', href: '/', key: 'home' as CurrentApp },
  { name: 'ThinkSpices', href: '/thinkspices/', key: 'thinkspices' as CurrentApp },
  { name: 'InTradeX', href: '/intradex/', key: 'intradex' as CurrentApp },
  { name: 'Overview', href: '/#ecosystem', key: null },
  { name: 'Resources', href: '/#resources', key: null },
  { name: 'About MIG', href: '/#about', key: null },
];

export function EcosystemBar({ current }: EcosystemBarProps) {
  const [open, setOpen] = useState(false);

  const isActive = (key: CurrentApp | null) => key !== null && key === current;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-10 bg-slate-900 border-b border-slate-700 flex items-center px-4 sm:px-6 gap-3">

        <a href="/" className="flex items-center gap-1.5 shrink-0">
          <div className="w-5 h-5 bg-gradient-to-br from-amber-500 to-orange-500 rounded flex items-center justify-center">
            <Leaf className="w-3 h-3 text-white" />
          </div>
          <span className="text-[11px] font-black text-white tracking-widest uppercase hidden sm:block">MIG</span>
          <span className="text-[11px] text-slate-500 hidden lg:block tracking-wide">Ecosystem</span>
        </a>

        <div className="w-px h-5 bg-slate-700 hidden sm:block shrink-0" />

        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`px-3 py-1 text-[11px] font-semibold rounded transition-all flex items-center gap-1.5 ${
                isActive(link.key)
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive(link.key) && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              )}
              {link.name}
            </a>
          ))}
        </nav>

        <div className="flex-1 md:hidden" />

        <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {current === 'home' ? 'MIG Home' : current === 'thinkspices' ? 'ThinkSpices' : 'InTradeX'}
        </span>

        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-slate-600 font-mono hidden lg:block">Switch to:</span>
          <a
            href="/thinkspices/"
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
              current === 'thinkspices'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 pointer-events-none'
                : 'bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40'
            }`}
          >
            <Leaf className="w-3 h-3" />
            ThinkSpices
          </a>
          <a
            href="/intradex/"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
              current === 'intradex'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 pointer-events-none'
                : 'bg-slate-800 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 border border-slate-700 hover:border-indigo-500/40'
            }`}
          >
            <span className="w-3.5 h-3.5 bg-indigo-600 rounded text-white text-[8px] font-black flex items-center justify-center leading-none">IX</span>
            InTradeX
          </a>
        </div>

        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden p-1.5 text-slate-400 hover:text-white rounded transition-colors"
          aria-label="Toggle ecosystem menu"
        >
          {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {open && (
        <div className="fixed top-10 left-0 right-0 z-[59] bg-slate-900 border-b border-slate-700 shadow-xl md:hidden">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-3 rounded text-sm font-medium transition-colors min-h-[44px] ${
                  isActive(link.key)
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive(link.key) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                )}
                {link.name}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <a
                href="/thinkspices/"
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded text-xs font-bold transition-all min-h-[44px] ${
                  current === 'thinkspices'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                <Leaf className="w-3.5 h-3.5" />
                ThinkSpices
              </a>
              <a
                href="/intradex/"
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded text-xs font-bold transition-all min-h-[44px] ${
                  current === 'intradex'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                <span className="w-4 h-4 bg-indigo-600 rounded text-white text-[9px] font-black flex items-center justify-center">IX</span>
                InTradeX
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
