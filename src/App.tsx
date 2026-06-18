import React, { useState, useEffect, lazy, Suspense } from 'react';

type AppView = 'home' | 'thinkspices' | 'intradex';

const ThinkSpicesApp = lazy(() => import('./thinkspices/App'));
const InTradeXApp = lazy(() => import('./intradex/App'));
const LandingApp = lazy(() => import('./landing/App'));

function getViewFromHash(): AppView {
  const hash = window.location.hash.toLowerCase();
  if (hash.includes('thinkspices')) return 'thinkspices';
  if (hash.includes('intradex')) return 'intradex';
  return 'home';
}

function AppLoader() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center animate-pulse">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="text-center">
          <div className="text-white text-sm font-semibold font-display">MIG Ecosystem</div>
          <div className="text-slate-400 text-xs font-mono mt-1">Loading platform...</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<AppView>(getViewFromHash);

  useEffect(() => {
    const onHash = () => setView(getViewFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Sync data-app on html element for CSS scoping
  useEffect(() => {
    document.documentElement.setAttribute('data-app', view);
  }, [view]);

  // Initialize theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mig-theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (saved === 'light-mode' && view === 'intradex') {
      document.documentElement.classList.add('light-mode');
    }
  }, []);

  return (
    <Suspense fallback={<AppLoader />}>
      {view === 'thinkspices' && <ThinkSpicesApp />}
      {view === 'intradex' && <InTradeXApp />}
      {view === 'home' && <LandingApp />}
    </Suspense>
  );
}
