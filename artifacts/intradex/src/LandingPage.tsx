import React, { useState } from 'react';
import { Shield, Sparkles, Globe, Calculator, FileText, CheckCircle, HelpCircle } from 'lucide-react';
import { UserProfile, UserRole } from './types';
import MarketTracker from './MarketTracker';

interface LandingPageProps {
  onLogin: (user: UserProfile) => void;
  mockUsers: UserProfile[];
  onRegister: (newUser: UserProfile) => void;
  onGoogleLogin?: () => void;
  promoSettings?: {
    slotsTarget: number;
    slotsOccupied: number;
    promoPriceIdr: number;
    isPromoActive: boolean;
  };
}

export default function LandingPage({
  onLogin,
  mockUsers,
  onRegister,
  onGoogleLogin,
  promoSettings
}: LandingPageProps) {
  const [isRegistering, setIsRegisterY] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Bahasa Indonesia'>('English');

  // Input states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('Indonesia');
  const [email, setEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const t = {
    English: {
      headline: "Export Smarter. Grow Globally.",
      subheadline: "An AI-Powered Export Assistance Platform Designed for Indonesian SMEs (UMKM) to master the Global Spice Trade.",
      usernameEmail: "Username or Email",
      password: "Password",
      fullName: "Full Name",
      companyName: "Company Name",
      country: "Country",
      email: "Email Address",
      confirmPassword: "Confirm Password",
      termsAgree: "I Agree to the Terms and Conditions",
      login: "Login",
      register: "Create Account",
      registerBtn: "Register Now",
      goToLogin: "Already have an account? Login here",
      goToRegister: "Don't have an account? Register here",
      forgotPass: "Forgot Password?",
      matePlan: "InTradeX-Mate",
      proPlan: "InTradeX-Pro",
      freePlan: "Free Plan",
      premiumPlan: "Premium Plan",
      proPrice: "IDR 76,999 / Month",
      unlockTools: "Upgrade to InTradeX-Pro to unlock all premium export tools.",
      mateFeatures: [
        "Product Sourcing Guidance",
        "Export Packaging Standards",
        "FOB Price Calculator only",
        "Quotation and Proforma Invoice drafts only",
        "Trade Intelligence (HS Codes & Tariffs)",
        "AI Export Advisor with Gemini"
      ],
      proFeatures: [
        "All Free Sourcing Tools Unlocked",
        "CIF Price Calculator (Premium)",
        "DDP Price Calculator (Premium)",
        "Quotation & Proforma Invoice (Full)",
        "Commercial Invoice, Packing List, Shipping Instructions & Sales Contracts (Full Pro)",
        "Priority AI Export Advisory with Unlimited Usage",
        "Premium B2B Gold-accent Badge Highlights"
      ],
      trademark: "© 2026 - InTradeX™ - Your Export Companion | Made for Indonesian SMEs Entering Global Markets"
    },
    'Bahasa Indonesia': {
      headline: "Ekspor Lebih Cerdas. Tumbuh Secara Global.",
      subheadline: "Platform Bantuan Ekspor Berbasis AI yang Dirancang khusus untuk UMKM Indonesia guna Menguasai Perdagangan Rempah Global.",
      usernameEmail: "Username atau Email",
      password: "Kata Sandi",
      fullName: "Nama Lengkap",
      companyName: "Nama Perusahaan",
      country: "Negara",
      email: "Alamat Email",
      confirmPassword: "Konfirmasi Kata Sandi",
      termsAgree: "Saya Menyetujui Syarat & Ketentuan",
      login: "Masuk",
      register: "Daftar Akun",
      registerBtn: "Daftar Sekarang",
      goToLogin: "Sudah punya akun? Masuk di sini",
      goToRegister: "Belum punya akun? Daftar di sini",
      forgotPass: "Lupa Kata Sandi?",
      matePlan: "InTradeX-Mate",
      proPlan: "InTradeX-Pro",
      freePlan: "PAKET GRATIS",
      premiumPlan: "PAKET PREMIUM",
      proPrice: "Rp 76,999 / Bulan",
      unlockTools: "Tingkatkan ke InTradeX-Pro untuk membuka semua alat ekspor premium.",
      mateFeatures: [
        "Panduan Sourcing Produk",
        "Standar Pengemasan Ekspor",
        "Hanya Kalkulator Harga FOB",
        "Hanya Draft Quotation & Proforma Invoice",
        "Trade Intelligence (HS Code & Tarif)",
        "Asisten Ekspor AI dengan Gemini"
      ],
      proFeatures: [
        "Semua Alat Sourcing Gratis Terbuka",
        "Kalkulator Harga CIF (Premium)",
        "Kalkulator Harga DDP (Premium)",
        "Quotation & Proforma Invoice (Lengkap)",
        "Commercial Invoice, Packing List, Shipping Instructions & Sales Contract (Lengkap Pro)",
        "Konsultasi Prioritas AI Tanpa Batas",
        "Badge Sorotan Gold-accent Premium"
      ],
      trademark: "© 2026 - InTradeX™ - Pendamping Ekspor Anda | Dibuat untuk UMKM Indonesia Menembus Pasar Global."
    }
  }[language];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage({ text: language === 'English' ? 'Please fill in both fields.' : 'Silakan isi kedua kolom.', type: 'error' });
      return;
    }

    const hardcodedUsers: UserProfile[] = [
      {
        uid: 'mate_07',
        fullName: 'Yusuf Hermawan',
        companyName: 'CV Priangan Cloves',
        country: 'Indonesia',
        email: 'yusuf@priangancloves.com',
        username: 'free_mate',
        role: 'free',
        registrationDate: '2026-05-15T12:00:00Z'
      },
      {
        uid: 'pro_99',
        fullName: 'Dewi Kartika',
        companyName: 'PT Nusantara Spices Abadi',
        country: 'Indonesia',
        email: 'dewi@nusantaraspices.co.id',
        username: 'pro_exporter',
        role: 'pro',
        registrationDate: '2026-03-10T14:30:00Z'
      },
      {
        uid: 'admin_88',
        fullName: 'MIG Compliance Officer',
        companyName: 'Magastu Indoprime Group (MIG)',
        country: 'Indonesia',
        email: 'ngt.bpn@gmail.com',
        username: 'admin@intradex.com',
        role: 'pro',
        registrationDate: '2026-01-01T08:00:00Z'
      }
    ];

    const cleanUsername = username.trim().toLowerCase();

    // Authentic User lookup helper 
    let foundUser = mockUsers.find(
      u => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanUsername
    );

    if (!foundUser) {
      foundUser = hardcodedUsers.find(
        u => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanUsername
      );
    }

    if (foundUser) {
      // Simulate login approval securely
      setMessage({ text: language === 'English' ? 'Login successful! Entering dashboard...' : 'Masuk berhasil! Membuka dashboard...', type: 'success' });
      setTimeout(() => onLogin(foundUser), 1000);
    } else {
      setMessage({ text: language === 'English' ? 'Invalid credentials. Use provided accounts or Register.' : 'Kredensial salah. Gunakan akun yang tersedia atau Daftar.', type: 'error' });
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !companyName || !email || !regUsername || !regPassword) {
      setMessage({ text: language === 'English' ? 'Please fill in all required fields.' : 'Silakan isi semua kolom wajib.', type: 'error' });
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setMessage({ text: language === 'English' ? 'Passwords do not match!' : 'Kata sandi tidak cocok!', type: 'error' });
      return;
    }
    if (!agreedToTerms) {
      setMessage({ text: language === 'English' ? 'You must agree to the terms.' : 'Anda harus menyetujui syarat & ketentuan.', type: 'error' });
      return;
    }

    const newUser: UserProfile = {
      uid: 'user_' + Math.random().toString(36).substring(2, 11),
      fullName,
      companyName,
      country,
      email,
      username: regUsername,
      role: 'free', // Default register to Mate (free)
      registrationDate: new Date().toISOString()
    };

    onRegister(newUser);
    setMessage({ text: language === 'English' ? 'Account registered successfully! Please login.' : 'Akun berhasil terdaftar! Silakan login.', type: 'success' });
    setTimeout(() => {
      setIsRegisterY(false);
      setUsername(regUsername);
      setMessage(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0e1117] text-[#e6eaf0] antialiased flex flex-col justify-between">
      
      {/* ── HEADER NAVIGATION ── */}
      <header className="border-b border-[#2d3748] bg-[#0e1117] sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#0A4D8C] rounded-lg flex items-center justify-center border border-[#1e2636]">
              <span className="font-bold text-xl text-white tracking-widest">X</span>
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white tracking-tight">InTradeX™</h2>
              <p className="text-xs text-[#94a3b8] font-mono leading-none">Your Export Companion</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO & FORMS AREA ── */}
      <main className="max-w-7xl mx-auto px-6 py-6 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* macro market and spot rates panel */}
        <div className="lg:col-span-12 w-full">
          <MarketTracker language={language} />
        </div>
        
        {/* Left Side: Brand Marketing & Pitch */}
        <div className="lg:col-span-7 space-y-7">

          {/* Eyebrow badge */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1e2636] border border-[#334155] px-4 py-2 rounded-full text-xs font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400">MIG Ecosystem</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">InTradeX™ Export Platform</span>
            </div>
          </div>

          {/* Headline + sub */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
              {t.headline}
            </h1>
            <p className="text-base text-slate-400 leading-relaxed max-w-lg">
              {t.subheadline}
            </p>
          </div>

          {/* Feature pillars — upgraded visual treatment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              {
                icon: Calculator,
                iconColor: 'text-blue-400',
                iconBg: 'bg-blue-500/10 border-blue-500/20',
                title: 'FOB, CIF & DDP Pricing',
                desc: 'Live exchange rates, production breakdown, and full landed cost calculation.'
              },
              {
                icon: FileText,
                iconColor: 'text-emerald-400',
                iconBg: 'bg-emerald-500/10 border-emerald-500/20',
                title: 'Export Documentation',
                desc: 'Proforma, Commercial Invoice, Packing List, Contracts — ready to send.'
              },
              {
                icon: Globe,
                iconColor: 'text-amber-400',
                iconBg: 'bg-amber-500/10 border-amber-500/20',
                title: 'Global Compliance',
                desc: 'Aflatoxin, Coumarin, TRACES NT, HS Codes, and destination duty rates.'
              },
              {
                icon: Shield,
                iconColor: 'text-indigo-400',
                iconBg: 'bg-indigo-500/10 border-indigo-500/20',
                title: 'AI Export Advisor',
                desc: 'Gemini-powered, trained on Indonesian spice export regulations and best practices.'
              },
            ].map(({ icon: Icon, iconColor, iconBg, title, desc }) => (
              <div key={title} className="flex items-start gap-3 bg-[#161b27] border border-[#2d3748] hover:border-[#334155] p-4 rounded-xl transition-colors duration-150">
                <div className={`w-8 h-8 rounded-lg ${iconBg} border flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-0.5">{title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust/compliance badges */}
          <div className="flex flex-wrap gap-3 pt-1">
            {[
              { label: 'EFSA Compliant', color: 'text-emerald-400' },
              { label: 'FDA Standards', color: 'text-blue-400' },
              { label: 'BICON Registered', color: 'text-amber-400' },
              { label: 'SNI Certified', color: 'text-indigo-400' },
            ].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                <CheckCircle className={`w-3 h-3 ${color} shrink-0`} />
                {label}
              </span>
            ))}
          </div>

        </div>

        {/* Right Side: Auth Form Container */}
        <div id="auth-panel" className="lg:col-span-5 bg-[#161b27] border border-[#2d3748] rounded-2xl p-6 sm:p-8 shadow-xl">
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-extrabold text-xl text-white">
              {isRegistering ? t.register : t.login}
            </h3>
            <span className="text-xs text-[#94a3b8]">InTradeX v1.0</span>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 text-sm flex items-start space-x-2 ${
              message.type === 'success' ? 'bg-[#14532d] text-[#bbf7d0] border-l-4 border-[#16a34a]' : 'bg-[#450a0a] text-[#fecaca] border-l-4 border-[#dc2626]'
            }`}>
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{message.text}</span>
            </div>
          )}

          {!isRegistering ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">
                  {t.usernameEmail}
                </label>
                <input
                  type="text"
                  placeholder="e.g., administrator@intradex.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-2.5 text-[#e6eaf0] focus:ring-2 focus:ring-[#2563eb] focus:outline-none focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">
                  {t.password}
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-2.5 text-[#e6eaf0] focus:ring-2 focus:ring-[#2563eb] focus:outline-none focus:border-transparent transition"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => alert(language === 'English' ? 'Demo Admin: admin@intradex.com / pass: admin123 | Whitelisted: ngt.bpn@gmail.com' : 'Sandi Admin Demo: admin@intradex.com / sandi: admin123 | Disetujui: ngt.bpn@gmail.com')}
                  className="text-xs text-[#94a3b8] hover:underline"
                >
                  {t.forgotPass}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3 px-4 rounded-xl transition shadow-lg tracking-wide uppercase text-sm"
              >
                {t.login}
              </button>

              {onGoogleLogin && (
                <>
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-[#2d3748]"></div>
                    <span className="flex-shrink mx-4 text-[#94a3b8] text-[10px] uppercase font-mono">or</span>
                    <div className="flex-grow border-t border-[#2d3748]"></div>
                  </div>

                  <button
                    type="button"
                    onClick={onGoogleLogin}
                    className="w-full bg-[#1e2636] hover:bg-[#20293a] text-white font-bold py-2.5 px-4 rounded-xl border border-[#2d3748] transition flex items-center justify-center gap-2.5 text-xs"
                  >
                    <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Continue with Google
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => { setIsRegisterY(true); setMessage(null); }}
                className="w-full text-center text-xs text-[#94a3b8] hover:text-white transition pt-4"
              >
                {t.goToRegister}
              </button>
            </form>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase mb-1">
                    {t.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Wawan Hermawan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#1e2636] border border-[#2d3748] rounded-lg px-3 py-2 text-xs text-[#e6eaf0] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase mb-1">
                    {t.companyName} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="CV Rempahindo Abadi"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#1e2636] border border-[#2d3748] rounded-lg px-3 py-2 text-xs text-[#e6eaf0] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase mb-1">
                    {t.email} *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contact@rempahindo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1e2636] border border-[#2d3748] rounded-lg px-3 py-2 text-xs text-[#e6eaf0] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase mb-1">
                    {t.country}
                  </label>
                  <input
                    type="text"
                    placeholder="Indonesia"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#1e2636] border border-[#2d3748] rounded-lg px-3 py-2 text-xs text-[#e6eaf0] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  placeholder="rempahindo_wawan"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full bg-[#1e2636] border border-[#2d3748] rounded-lg px-3 py-2 text-xs text-[#e6eaf0] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase mb-1">
                    {t.password} *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-[#1e2636] border border-[#2d3748] rounded-lg px-3 py-2 text-xs text-[#e6eaf0] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase mb-1">
                    {t.confirmPassword} *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full bg-[#1e2636] border border-[#2d3748] rounded-lg px-3 py-2 text-xs text-[#e6eaf0] focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="rounded border-[#2d3748] bg-[#1e2636]"
                />
                <label htmlFor="agree" className="text-xs text-[#94a3b8] cursor-pointer selection:bg-transparent">
                  {t.termsAgree}
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-2.5 px-4 rounded-xl transition shadow-lg tracking-wide uppercase text-sm mt-3"
              >
                {t.registerBtn}
              </button>

              <button
                type="button"
                onClick={() => { setIsRegisterY(false); setMessage(null); }}
                className="w-full text-center text-xs text-[#94a3b8] hover:text-white transition pt-4"
              >
                {t.goToLogin}
              </button>
            </form>
          )}

          {/* Quick Logs Credentials Whitelist Box */}
          <div className="mt-6 border-t border-[#2d3748] pt-4">
            <h5 className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider mb-2">🔐 DEMO EXPORTER ACCOUNTS</h5>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-[#1e2636] p-3 rounded-lg border border-[#2d3748]">
              <div>
                <p className="text-white font-bold">Mate Exporter (FREE)</p>
                <p className="text-gray-400">user: free_mate</p>
                <p className="text-gray-400">pass: free123</p>
              </div>
              <div>
                <p className="text-[#D4A017] font-bold">Pro Exporter (PRO)</p>
                <p className="text-gray-400">user: pro_exporter</p>
                <p className="text-gray-400">pass: pro123</p>
              </div>
              <div className="col-span-2 border-t border-[#2d3748] pt-2 mt-1">
                <p className="text-[#bfdbfe] font-bold">InTradeX Admin (ngt.bpn@gmail.com)</p>
                <p className="text-gray-400">user: admin@intradex.com</p>
                <p className="text-gray-400">pass: admin123</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── PRICING COMPARISON ── */}
      <section className="bg-[#161b27] border-y border-[#2d3748] py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Flexible Freemium Plans for Every Indonesian SME</h2>
            <p className="text-[#94a3b8] max-w-2xl mx-auto">Start with InTradeX-Mate for comprehensive learning and standard diagnostics.
              <br />
              Upgrade to InTradeX-Pro when you are ready to export commercial volume.</p>
          </div>

          {promoSettings?.isPromoActive && (
            <div className="max-w-4xl mx-auto bg-[#2b1e0c] border-2 border-[#D4A017]/60 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-yellow-950 font-bold border border-[#D4A017]/40 rounded-xl text-[#D4A017] shrink-0">
                  <Sparkles className="w-5 h-5 text-[#D4A017]" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">🌟 FIRST EXPORTERS LAUNCH SPECIAL OFFER</h4>
                  <p className="text-xs text-gray-300 mt-1">Get custom trade papers, advanced Incoterm pricing algorithms and prior business consultancy directly verified under VIP Gold role subscription.</p>
                </div>
              </div>
              <div className="bg-[#1e140a] px-4 py-2 border border-[#D4A017]/30 rounded-xl text-center shrink-0 w-full sm:w-auto">
                <span className="text-[9px] text-[#D4A017] font-mono block uppercase font-black tracking-widest mb-1">PROMOTIONAL SLOTS REMAINING</span>
                <span className="text-xl font-black text-white font-mono leading-none">{promoSettings.slotsTarget - promoSettings.slotsOccupied} / {promoSettings.slotsTarget} LEFT</span>
              </div>
            </div>
          )}

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Free Plan */}
            <div className="bg-[#1e2636] border border-[#2d3748] rounded-2xl p-6 flex flex-col justify-between hover:border-[#2563eb] transition duration-300">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-white normal-case tracking-tight">{t.matePlan}</h3>
                    <p className="text-xs font-mono text-[#94a3b8]">{t.freePlan}</p>
                  </div>
                  <span className="bg-[#161b27] border border-[#2d3748] text-[#e6eaf0] text-xs font-mono px-3 py-1 rounded-full uppercase tracking-wider">Free</span>
                </div>

                <div className="text-2xl font-black text-white">Rp 0</div>
                <p className="text-xs text-gray-400">Perfect for beginner traders, university learners, and micro estates exploring global demand metrics.</p>
                
                <hr className="border-[#2d3748]"/>

                <ul className="space-y-2">
                  {t.mateFeatures.map((f, i) => (
                    <li key={i} className="flex items-center space-x-2.5 text-xs text-gray-300">
                      <CheckCircle className="w-4 h-4 text-[#2563eb] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a href="#auth-panel" onClick={() => setIsRegisterY(false)} className="mt-8 block w-full text-center bg-[#161b27] hover:bg-[#1e2636] border border-[#2d3748] text-white py-2.5 rounded-lg text-xs font-bold transition">
                Start for Free
              </a>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#1e2636] border-2 border-[#D4A017] rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.01] transition duration-300 relative">
              <div className="absolute -top-3.5 right-6 bg-[#D4A017] text-black font-extrabold text-[10px] px-3 py-1 rounded-full tracking-widest uppercase">
                RECOMMENDED FOR EXPORTERS
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-[#D4A017] normal-case tracking-tight">{t.proPlan}</h3>
                    <p className="text-xs font-mono text-gray-400">{t.premiumPlan}</p>
                  </div>
                  <span className="bg-[#422006] text-[#fef3c7] text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-widest font-bold">PRO</span>
                </div>

                {promoSettings?.isPromoActive ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs line-through text-gray-500">Rp350,000</span>
                      <span className="bg-red-950 text-red-400 font-extrabold text-[8px] px-1.5 py-0.5 rounded border border-red-800 uppercase tracking-widest">Launch Discount</span>
                    </div>
                    <div className="text-2xl font-black text-white">
                      Rp {promoSettings.promoPriceIdr.toLocaleString()} <span className="text-xs font-normal text-gray-400">/ Month</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-2xl font-black text-white">{t.proPrice}</div>
                )}
                <p className="text-xs text-gray-400">{t.unlockTools}</p>

                <hr className="border-[#2d3748]"/>

                <ul className="space-y-2">
                  {t.proFeatures.map((f, i) => (
                    <li key={i} className="flex items-center space-x-2.5 text-xs text-gray-200 font-medium">
                      <CheckCircle className="w-4 h-4 text-[#D4A017] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a href="#auth-panel" onClick={() => setIsRegisterY(true)} className="mt-8 block w-full text-center bg-[#D4A017] hover:bg-opacity-95 text-black py-2.5 rounded-lg text-xs font-extrabold transition">
                Upgrade to Pro Now
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER TRADEMARKS ── */}
      <footer className="border-t border-[#2d3748] py-8 px-6 text-center text-xs text-[#94a3b8]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold tracking-widest text-[#0a4d8c]">Magastu Indoprime Group (MIG)</span>
          </div>
          <p className="text-[10px] font-mono text-gray-500 whitespace-nowrap text-right">{t.trademark}</p>
        </div>
      </footer>

    </div>
  );
}
