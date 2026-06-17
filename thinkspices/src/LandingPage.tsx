import React, { useState, useEffect } from "react";
import bannerimg from '../assets/images/thinkspices_banner.png';
import { 
  ShieldCheck, 
  Sparkles, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  CheckCircle, 
  Globe, 
  Building2, 
  ArrowRight,
  RefreshCw,
  Cpu,
  Fingerprint
} from "lucide-react";

interface LandingPageProps {
  onLoginSuccess: (user: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess }) => {
  // State machine for views: "login" | "register" | "verify"
  const [view, setView] = useState<"login" | "register" | "verify">("login");
  
  // Greeting based on user clock
  const [greeting, setGreeting] = useState("HI, GOOD DAY! WELCOME TO");
  const [detectedLocation, setDetectedLocation] = useState("DETECTING SECURE NODE PORTAL...");

  // Form Inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  // Math Captcha state
  const [num1, setNum1] = useState(5);
  const [num2, setNum2] = useState(3);

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCompany, setRegCompany] = useState("");
  const [regTier, setRegTier] = useState<"FREE" | "PRO" | "ADMIN">("FREE");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [enrollmentSuccessMsg, setEnrollmentSuccessMsg] = useState("");
  
  // Pin Verification state
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [sentCode, setSentCode] = useState("4890");

  // Dynamic greeting and timezone/location determination
  useEffect(() => {
    // 1. Timezone-adjusted location greeting
    const hour = new Date().getHours();
    let timeGreeting = "DAY";
    if (hour >= 5 && hour < 12) {
      timeGreeting = "MORNING";
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = "AFTERNOON";
    } else {
      timeGreeting = "EVENING";
    }
    setGreeting(`HI, GOOD ${timeGreeting}! WELCOME TO`);

    // 2. Extract country/city/timezone info for high authentic fidelity
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const hoursOffset = -new Date().getTimezoneOffset() / 60;
      const offsetStr = hoursOffset >= 0 ? `GMT+${hoursOffset}` : `GMT${hoursOffset}`;
      
      let regionFriendly = "Global Desk Router";
      if (tz.includes("Jakarta") || tz.includes("Singapore") || tz.includes("Bangkok")) {
        regionFriendly = "Sunda Islands / Southeast Asia Sourcing Terminal";
      } else if (tz.includes("Europe") || tz.includes("London") || tz.includes("Paris")) {
        regionFriendly = "European Direct-Contract Hub";
      } else if (tz.includes("New_York") || tz.includes("America")) {
        regionFriendly = "North American B2B Procurement Desk";
      } else {
        regionFriendly = `${tz.replace("_", " ")} Network Node`;
      }
      setDetectedLocation(`${regionFriendly} [TLS ENCRYPTED · ${offsetStr}]`);
    } catch (e) {
      setDetectedLocation("SECURE INDONET B2B GATEWAY ACTIVE");
    }

    // Try a lightweight city/IP lookup
    fetch("https://ipapi.co/json/")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data && data.city && data.country_name) {
          setDetectedLocation(
            `RESOLVED Procurement Node: ${data.city.toUpperCase()}, ${data.country_name.toUpperCase()} (IP: ${data.ip || "SECIFIED"})`
          );
        }
      })
      .catch(() => {
        // Fallback silently
      });
  }, []);

  // Captcha Generator
  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 2;
    setNum1(n1);
    setNum2(n2);
    setCaptchaInput("");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // Verify Captcha Math Response
    const sumAnswer = num1 + num2;
    if (parseInt(captchaInput) !== sumAnswer) {
      setLoginError("INCORRECT CAPTCHA ANSWER. Please resolve the mathematical validation first.");
      generateCaptcha();
      return;
    }

    // Verify mock B2B logins
    const u = username.trim().toLowerCase();
    const p = password;

    let tier: "FREE" | "PRO" | "ADMIN" = "FREE";
    let company = "Global Agri Sourcing Ltd";
    let email = `${u}@thinkspices.com`;
    let fullName = "Executive Sourcing Officer";

    if (u === "free_user" && p === "freePassword") {
      tier = "FREE";
      fullName = "Free Sourcing Guest";
      company = "InterContinental Spices Corp";
      email = "free_user@intercontinental.com";
    } else if (u === "pro_user" && p === "proPassword") {
      tier = "PRO";
      fullName = "Pro Executive Buyer";
      company = "Global Food & Fragrances Inc.";
      email = "pro_user@globalff.com";
    } else if (u === "admin_user" && p === "adminPassword") {
      tier = "ADMIN";
      fullName = "Website Administrator";
      company = "Magastu Indoprime Group (MIG)";
      email = "admin_user@thinkspices.com";
    } else {
      // Check if they recently signed up a mock account in this session memory
      const storedAccount = localStorage.getItem("thinkspices_mock_user");
      if (storedAccount) {
        const parsed = JSON.parse(storedAccount);
        if (parsed.username === u && parsed.password === p) {
          tier = parsed.tier;
          fullName = parsed.name;
          company = parsed.company;
          email = parsed.email;
        } else {
          setLoginError("INVALID USERNAME OR PASSWORD. View assigned codes on the right to auto-populate.");
          generateCaptcha();
          return;
        }
      } else {
        setLoginError("INVALID USERNAME OR PASSWORD. View assigned codes on the right to auto-populate.");
        generateCaptcha();
        return;
      }
    }

    // Form validated successfully
    const userSession = {
      name: fullName,
      email: email,
      companyName: company,
      membershipTier: tier,
      savedRfqs: [
        {
          id: "RFQ-5592",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          commodityName: "NUTMEG",
          varietyName: "BANDA NUTMEG",
          productForm: "WHOLE",
          volume: 5.0,
          targetPrice: 9.20,
          destinationPort: "Rotterdam, Netherlands",
          exporterName: "PT ARCHIPELAGO SPICES INDONESIA"
        }
      ]
    };

    setLoggedInUser(userSession);
    setIsSuccessState(true);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    if (!regName || !regEmail || !regCompany || !regPassword) {
      setRegError("All parameters are mandatory to request a B2B account.");
      return;
    }

    const verificationPin = Math.floor(1000 + Math.random() * 9000).toString();
    setSentCode(verificationPin);
    setView("verify");
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError("");

    if (verificationCode === sentCode || verificationCode === "1234") {
      const generatedUsername = regEmail.split("@")[0] + "_user";
      const newMockAccount = {
        name: regName,
        email: regEmail,
        company: regCompany,
        tier: regTier,
        password: regPassword,
        username: generatedUsername
      };

      localStorage.setItem("thinkspices_mock_user", JSON.stringify(newMockAccount));
      
      setUsername(generatedUsername);
      setPassword(regPassword);
      setView("login");
      setEnrollmentSuccessMsg(`B2B ENROLLMENT SUCCESSFUL! Sandbox credentials prepared. Username: ${generatedUsername}, Password: ${regPassword}. Please copy these key parameters for B2B portal login.`);
    } else {
      setVerificationError("Verification PIN does not match. Please verify your mock SMS code.");
    }
  };

  const loadDemoCredentials = (role: "free" | "pro" | "admin") => {
    setLoginError("");
    setEnrollmentSuccessMsg("");
    if (role === "free") {
      setUsername("free_user");
      setPassword("freePassword");
    } else if (role === "pro") {
      setUsername("pro_user");
      setPassword("proPassword");
    } else if (role === "admin") {
      setUsername("admin_user");
      setPassword("adminPassword");
    }
  };

  const handleSocialClick = (platform: string) => {
    setLoginError(`Handshake with ${platform} B2B Identity Gateway established. Port routing is active for mock test.`);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between font-sans select-none pb-2">
      
      {/* ── HERO SECTION ── */}
      <div className="w-full px-4 pt-10 pb-4">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Top row: geo tag + session label */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/30 text-accent-gold font-mono text-[9px] font-bold tracking-widest uppercase">
              <Globe size={11} className="animate-pulse" />
              <span>{detectedLocation}</span>
            </div>
            <span className="font-mono text-[9px] text-text-muted tracking-widest uppercase">
              MIG ECOSYSTEM · THINKSPICES™ V1.0-PRIME
            </span>
          </div>

          {/* Greeting + headline */}
          <div className="text-center space-y-3">
            <p className="font-mono text-[10px] text-text-muted tracking-widest uppercase">
              {greeting}
            </p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary leading-tight tracking-tight">
              Source Verified Indonesian<br />
              <span className="text-accent-gold">Spice Suppliers</span> with Confidence
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xl mx-auto">
              Access harvest outlooks, real-time FOB price indices, and supplier verification data — then generate qualified RFQs in minutes. Built exclusively for professional spice buyers.
            </p>
          </div>

          {/* Capability badges */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Verified Supplier Network', icon: ShieldCheck },
              { label: 'Live FOB Price Data', icon: Globe },
              { label: 'AI-Assisted RFQ Generation', icon: Cpu },
              { label: 'Harvest Intelligence', icon: CheckCircle },
            ].map(({ label, icon: Icon }) => (
              <span key={label} className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 bg-bg-secondary border border-border-default rounded-full text-text-secondary hover:border-accent-gold/50 hover:text-text-primary transition-colors duration-150 cursor-default">
                <Icon size={10} className="text-accent-gold shrink-0" />
                {label}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* ── HERO BANNER IMAGE ── */}
      <div className="relative border-2 border-accent-gold/40 rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto w-11/12 md:w-full group mb-6">
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent z-10" />
        <img
          src={bannerimg}
          alt="ThinkSpices Trade Intelligence Premium Sourcing Solutions Banner"
          className="w-full aspect-[21/9] object-cover filter brightness-[0.9] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-4 left-6 right-6 z-20 flex flex-col sm:flex-row justify-between items-end gap-2 font-mono">
          <div>
            <span className="text-[10px] text-accent-gold font-bold uppercase tracking-widest block mb-0.5">
              MAGASTU INDOPRIME GROUP (MIG)
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase font-display">
              Trade Intelligence & Sourcing Solutions
            </h3>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            {['SNI', 'BARANTIN', 'B2B VERIFIED'].map(tag => (
              <span key={tag} className="text-[8px] font-mono font-bold px-2 py-0.5 bg-white/10 border border-white/20 text-white/80 rounded tracking-widest">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4. ACTIVE CLIENT GATE PANELS & FORMS */}
      <div className="max-w-4xl w-full mx-auto px-4 pb-12 flex-1 flex flex-col justify-center">
        
        {isSuccessState && loggedInUser ? (
          
          /* "YOUR SOURCING HUB IS READY" SUCCESS CONTAINER */
          <div className="bg-bg-secondary border border-accent-green/40 rounded-2xl p-8 max-w-lg mx-auto w-full text-center space-y-6 shadow-2xl animate-scale-up border-t-8 border-t-accent-green">
            <div className="w-16 h-16 rounded-full bg-accent-green/10 border border-accent-green/30 flex items-center justify-center text-accent-green mx-auto">
              <CheckCircle size={36} className="animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-accent-green font-bold uppercase block">
                AUTHENTICATION GRANTED ●
              </span>
              <h3 className="font-display font-black text-2.5xl text-text-primary tracking-tight uppercase">
                YOUR SOURCING HUB IS READY
              </h3>
              <p className="font-mono text-[9px] text-text-secondary tracking-widest uppercase">
                COMMODITY HANDSHAKE SUCCESSFUL
              </p>
            </div>

            <div className="p-4 bg-bg-primary border border-border-default rounded-xl space-y-2.5 text-left font-mono text-[11px] text-text-secondary">
              <div className="flex h-6 justify-between items-center border-b border-border-default/50 pb-1">
                <span>BUYER REPRESENTATIVE:</span>
                <span className="font-bold text-text-primary">{loggedInUser.name}</span>
              </div>
              <div className="flex h-6 justify-between items-center border-b border-border-default/50 pb-1">
                <span>TRADING COMPANY:</span>
                <span className="font-bold text-text-primary">{loggedInUser.companyName}</span>
              </div>
              <div className="flex h-6 justify-between items-center">
                <span>COMPLIANCE LEVEL:</span>
                <span className="font-bold text-accent-gold bg-accent-gold/10 px-2.5 py-0.2 rounded-full border border-accent-gold/25 text-[9px]">
                  {loggedInUser.membershipTier} ACCOUNT
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onLoginSuccess(loggedInUser);
              }}
              className="w-full py-4 bg-accent-gold hover:bg-accent-gold-soft text-bg-primary font-bold font-mono text-xs uppercase tracking-widest rounded-lg transition-transform hover:scale-[1.01] active:scale-95 shadow-lg shadow-accent-gold/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Initialize Trade Workstation</span>
              <ArrowRight size={14} />
            </button>
          </div>

        ) : (
          
          /* CORE B2B LAYOUT HANDSHAKE SYSTEM */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: FORM INTERACTIONS MODULE */}
            <div className="md:col-span-7 bg-bg-secondary border border-border-default rounded-2xl p-6 sm:p-8 space-y-6 shadow-md">
              
              {/* Tab Selector Headers */}
              <div className="flex border-b border-border-default pb-3 justify-between items-center">
                <div className="flex gap-4">
                  <button
                    onClick={() => { setView("login"); setLoginError(""); }}
                    className={`font-display font-bold text-xs sm:text-sm uppercase tracking-wider pb-1 transition-all cursor-pointer ${
                      view === "login" 
                        ? "text-accent-gold border-b-2 border-accent-gold" 
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    B2B Sign In
                  </button>
                  <button
                    onClick={() => { setView("register"); setLoginError(""); }}
                    className={`font-display font-bold text-xs sm:text-sm uppercase tracking-wider pb-1 transition-all cursor-pointer ${
                      view === "register" || view === "verify"
                        ? "text-accent-gold border-b-2 border-accent-gold" 
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    Create Account
                  </button>
                </div>
                
                <span className="font-mono text-[9px] text-text-muted hover:text-accent-gold uppercase select-all">
                  {view === "login" ? "DESK // L-1" : view === "register" ? "DESK // R-1" : "DESK // V-1"}
                </span>
              </div>

              {loginError && (
                <div className="p-3 bg-accent-red/10 border border-accent-red/30 text-accent-red rounded text-[10px] font-mono leading-tight">
                  {loginError}
                </div>
              )}

              {enrollmentSuccessMsg && view === "login" && (
                <div className="p-3 bg-accent-green/10 border border-[#2ECC71]/30 text-accent-green rounded text-[11px] font-mono leading-relaxed">
                  <span className="font-bold block uppercase text-[10px] tracking-wider mb-1">✓ B2B REGISTERED</span>
                  {enrollmentSuccessMsg}
                </div>
              )}

              {/* A. SIGN-IN SECTION */}
              {view === "login" && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono">
                  
                  {/* Social Handshake Symbols block */}
                  <div className="space-y-2">
                    <span className="block text-[8px] uppercase tracking-wider text-text-muted font-bold">
                      RESOLVE CORPORATE HANDSHAKE:
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => handleSocialClick("Google")}
                        className="p-2 border border-border-default bg-bg-primary hover:bg-bg-tertiary rounded flex flex-col items-center justify-center gap-1 hover:border-accent-gold transition-colors cursor-pointer group"
                        title="Sign In with Google"
                      >
                        <svg className="h-4 w-4 text-text-secondary group-hover:text-accent-gold" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M12.24 10.285V13.4h6.887c-.275 1.564-1.88 4.604-6.887 4.604-4.33 0-7.86-3.577-7.86-8s3.53-8 7.86-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.74-.08-1.302-.178-1.859H12.24z"/>
                        </svg>
                        <span className="text-[7.5px] uppercase font-bold text-text-muted group-hover:text-text-primary">Google</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSocialClick("Apple")}
                        className="p-2 border border-border-default bg-bg-primary hover:bg-bg-tertiary rounded flex flex-col items-center justify-center gap-1 hover:border-accent-gold transition-colors cursor-pointer group"
                        title="Sign In with Apple"
                      >
                        <svg className="h-4 w-4 text-text-secondary group-hover:text-accent-gold" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C4.12 16.7 3.88 10.5 7.4 10.2c1.3.1 2.2.8 2.94.8.74 0 1.95-.88 3.55-.7 1.48.16 2.6.75 3.14 1.7-3.04 1.8-2.54 5.86.38 7-.6 1.55-1.4 3.08-2.36 4.28M15.03 7.24c1.1-1.3 1-2.94.32-3.8-1 .12-2.14.74-2.8 1.5-.78.9-.76 2.52.12 3.3.93.08 2-.6 2.36-1"/>
                        </svg>
                        <span className="text-[7.5px] uppercase font-bold text-text-muted group-hover:text-text-primary">Apple</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSocialClick("Enterprise Mail")}
                        className="p-2 border border-border-default bg-bg-primary hover:bg-bg-tertiary rounded flex flex-col items-center justify-center gap-1 hover:border-accent-gold transition-colors cursor-pointer group"
                        title="Sign In with Corporate Active Directory Email"
                      >
                        <Mail className="h-4 w-4 text-text-secondary group-hover:text-accent-gold" />
                        <span className="text-[7.5px] uppercase font-bold text-text-muted group-hover:text-text-primary">Email</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSocialClick("Secure Cell Phone")}
                        className="p-2 border border-border-default bg-bg-primary hover:bg-bg-tertiary rounded flex flex-col items-center justify-center gap-1 hover:border-accent-gold transition-colors cursor-pointer group"
                        title="Sign In with Phone OTP Dispatcher"
                      >
                        <Phone className="h-4 w-4 text-text-secondary group-hover:text-accent-gold" />
                        <span className="text-[7.5px] uppercase font-bold text-text-muted group-hover:text-text-primary">Phone</span>
                      </button>
                    </div>
                  </div>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-border-default/50"></div>
                    <span className="flex-shrink mx-3 text-[8px] text-text-muted uppercase font-bold">OR SECURE RECONCILIATION KEYS</span>
                    <div className="flex-grow border-t border-border-default/50"></div>
                  </div>

                  {/* Username/Email Input */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase font-bold tracking-wider text-text-secondary">
                      Procurement Username / B2b Email *
                    </label>
                    <div className="relative">
                      <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Select or enter credentials code"
                        className="w-full pl-9 pr-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold rounded text-xs text-text-primary focus:outline-none"
                        id="login-username-input"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase font-bold tracking-wider text-text-secondary">
                      Trade Certification Password *
                    </label>
                    <div className="relative">
                      <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold rounded text-xs text-text-primary focus:outline-none"
                        id="login-password-input"
                      />
                    </div>
                  </div>

                  {/* MANDATORY PRE-LOGIN CAPTCHA */}
                  <div className="p-3.5 bg-bg-primary border border-border-default rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-[8.5px] text-text-secondary uppercase">
                      <span className="font-bold flex items-center gap-1 text-accent-gold">
                        <Cpu size={12} />
                        PRE-LOGIN INTERACTIVE CAPTCHA
                      </span>
                      <button
                        type="button"
                        onClick={generateCaptcha}
                        className="text-text-muted hover:text-accent-gold transition-colors flex items-center gap-0.5 cursor-pointer"
                        title="Rotate Math Challenge"
                      >
                        <RefreshCw size={10} />
                        <span>RELOAD</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-bg-secondary border border-border-default px-4 py-2 rounded text-xs text-accent-gold font-bold tracking-widest select-none">
                        {num1} + {num2} = ?
                      </div>
                      <div className="flex-1 relative">
                        <Fingerprint size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="number"
                          required
                          value={captchaInput}
                          onChange={(e) => setCaptchaInput(e.target.value)}
                          placeholder="Sum Answer"
                          className="w-full pl-8 pr-2 py-2 bg-bg-input border border-border-default focus:border-accent-gold rounded text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    <p className="text-[7.5px] text-text-muted uppercase leading-relaxed text-center">
                      Quick security check — please solve the sum below:
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-accent-gold hover:bg-accent-gold-soft text-bg-primary font-bold text-xs uppercase tracking-widest rounded transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Enter Trade Terminal Desk</span>
                    <ArrowRight size={13} />
                  </button>
                </form>
              )}

              {/* B. REGISTRATION SECTION */}
              {view === "register" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 font-mono">
                  
                  {/* Instructions */}
                  <div className="bg-accent-gold/5 border border-accent-gold/25 p-3 rounded text-[9.5px] text-text-secondary leading-normal">
                    <strong className="text-accent-gold uppercase">ACCOUNT CREATION INSTRUCTIONS:</strong> Register your B2B purchasing details below. To authorize verification, you will receive a secure virtual SMS OTP digits screen. Enter the PIN to log in.
                  </div>

                  {regError && (
                    <div className="p-3 bg-accent-red/10 border border-accent-red/30 text-accent-red rounded text-[10px] font-mono leading-tight">
                      {regError}
                    </div>
                  )}

                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase font-bold tracking-wider text-text-secondary">
                      Full Sourcing Representative Name *
                    </label>
                    <div className="relative">
                      <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Liam Sterling"
                        className="w-full pl-9 pr-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold rounded text-xs text-text-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase font-bold tracking-wider text-text-secondary">
                      Corporate Work Email *
                    </label>
                    <div className="relative">
                      <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. liam@globaltrading.com"
                        className="w-full pl-9 pr-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold rounded text-xs text-text-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Company Input */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase font-bold tracking-wider text-text-secondary">
                      Enterprise / Trading Company Name *
                    </label>
                    <div className="relative">
                      <Building2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        required
                        value={regCompany}
                        onChange={(e) => setRegCompany(e.target.value)}
                        placeholder="e.g. Global Trade Alliance Inc."
                        className="w-full pl-9 pr-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold rounded text-xs text-text-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Privilege Tier Request */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase font-bold tracking-wider text-text-secondary">
                      Requested Privilege Access Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["FREE", "PRO", "ADMIN"] as const).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setRegTier(t)}
                          className={`py-1.5 border rounded text-[9px] uppercase transition-all font-bold cursor-pointer ${
                            regTier === t
                              ? "bg-accent-gold text-bg-primary border-accent-gold"
                              : "bg-bg-primary border-border-default text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Password Selection */}
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase font-bold tracking-wider text-text-secondary">
                      Select Access Key / Password *
                    </label>
                    <div className="relative">
                      <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Assign secure password phrase"
                        className="w-full pl-9 pr-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold rounded text-xs text-text-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-accent-gold hover:bg-accent-gold-soft text-bg-primary font-bold text-xs uppercase tracking-widest rounded transition-all cursor-pointer"
                  >
                    Dispatch SECURE PIN Verification Code
                  </button>
                </form>
              )}

              {/* C. REGISTRATION VERIFICATION SCREEN */}
              {view === "verify" && (
                <form onSubmit={handleVerificationSubmit} className="space-y-4 font-mono">
                  <div className="space-y-2 text-center py-2">
                    <ShieldCheck size={32} className="text-accent-gold mx-auto animate-pulse" />
                    <h3 className="text-xs uppercase font-bold text-text-primary tracking-wide">
                      MIG Secure Handshake Verification
                    </h3>
                    <p className="text-[9px] text-text-muted uppercase leading-relaxed max-w-sm mx-auto">
                      A secured registration PIN message has been generated. Input validation numbers below to permit connection (Sandbox Pin: <span className="text-accent-gold font-bold">{sentCode}</span> or use <span className="font-bold text-accent-gold">1234</span>).
                    </p>
                  </div>

                  {verificationError && (
                    <div className="p-2.5 bg-accent-red/10 border border-accent-red/30 text-accent-red rounded text-[9px] text-center uppercase font-bold">
                      {verificationError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase font-bold tracking-wider text-text-secondary text-center">
                      Enter Authorized Digit PIN *
                    </label>
                    <input
                      type="text"
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="e.g. 9852"
                      className="w-32 mx-auto tracking-[0.25em] text-center font-bold text-lg px-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold rounded text-text-primary focus:outline-none block"
                    />
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-accent-green hover:bg-accent-green/90 text-white font-bold text-xs uppercase tracking-widest rounded transition-all cursor-pointer"
                    >
                      Verify and Activate Sandbox Profile
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* COLUMN 2: AUTHORIZED COOPERATOR PORTAL PRE-LOGIN DIRECTORIES */}
            <div className="md:col-span-5 bg-bg-secondary border border-border-default rounded-2xl p-6 space-y-4">
              
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-accent-gold font-mono text-[10px] font-bold uppercase tracking-wider">
                  <Fingerprint size={12} />
                  <span>PRE-LOADED ACCOUNTS</span>
                </div>
                <h4 className="font-display font-semibold text-xs text-text-primary uppercase tracking-normal">
                  Three Categories of B2B Sourcing Tiers
                </h4>
                <p className="font-sans text-[11px] text-text-secondary leading-normal">
                  Select a category card below to automatically fill the login form with test parameters, bypassing physical registration code dispatches:
                </p>
              </div>

              {/* CARD ACCORDION DIRECTORY FOR QUICK CLICKS */}
              <div className="space-y-3 font-mono text-[10px]">
                
                {/* 1. FREE USER */}
                <div 
                  onClick={() => loadDemoCredentials("free")}
                  className="bg-bg-primary/50 border border-border-default hover:border-accent-gold rounded-lg p-3 transition-all cursor-pointer group"
                  title="Click to auto-populate Free User credentials"
                >
                  <div className="flex justify-between items-center mb-1 bg-white/50 px-2 py-0.5 rounded border border-border-default/40">
                    <span className="text-text-primary font-bold uppercase text-[9px]">1. FREE USER</span>
                    <span className="bg-bg-tertiary text-text-muted text-[8px] font-bold border px-1 rounded uppercase tracking-wider h-4 flex items-center">
                      FREE TIER
                    </span>
                  </div>
                  <div className="space-y-1 text-text-secondary text-[9.5px]">
                    <div className="flex justify-between">
                      <span>Username:</span>
                      <strong className="text-accent-gold leading-none">free_user</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Password:</span>
                      <strong className="text-accent-gold leading-none">freePassword</strong>
                    </div>
                  </div>
                </div>

                {/* 2. PRO USER */}
                <div 
                  onClick={() => loadDemoCredentials("pro")}
                  className="bg-bg-primary/50 border border-border-default hover:border-accent-gold rounded-lg p-3 transition-all cursor-pointer group"
                  title="Click to auto-populate Pro User credentials"
                >
                  <div className="flex justify-between items-center mb-1 bg-accent-gold/10 px-2 py-0.5 rounded border border-accent-gold/15">
                    <span className="text-accent-gold font-bold uppercase text-[9px]">2. PRO USER</span>
                    <span className="bg-accent-gold/20 text-accent-gold text-[8px] font-bold border border-accent-gold/30 px-1 rounded uppercase tracking-wider h-4 flex items-center">
                      PRO BUYER
                    </span>
                  </div>
                  <div className="space-y-1 text-text-secondary text-[9.5px]">
                    <div className="flex justify-between">
                      <span>Username:</span>
                      <strong className="text-accent-gold leading-none">pro_user</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Password:</span>
                      <strong className="text-accent-gold leading-none">proPassword</strong>
                    </div>
                  </div>
                </div>

                {/* 3. WEBSITE ADMIN */}
                <div 
                  onClick={() => loadDemoCredentials("admin")}
                  className="bg-bg-primary/50 border border-border-default hover:border-accent-gold rounded-lg p-3 transition-all cursor-pointer group"
                  title="Click to auto-populate Admin credentials"
                >
                  <div className="flex justify-between items-center mb-1 bg-[#EB5757]/10 px-2 py-0.5 rounded border border-[#EB5757]/15">
                    <span className="text-accent-red font-bold uppercase text-[9px]">3. WEBSITE ADMIN</span>
                    <span className="bg-[#EB5757]/20 text-accent-red text-[8px] font-bold border border-[#EB5757]/30 px-1 rounded uppercase tracking-wider h-4 flex items-center">
                      MIG ADMIN
                    </span>
                  </div>
                  <div className="space-y-1 text-text-secondary text-[9.5px]">
                    <div className="flex justify-between">
                      <span>Username:</span>
                      <strong className="text-accent-gold leading-none">admin_user</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Password:</span>
                      <strong className="text-accent-gold leading-none">adminPassword</strong>
                    </div>
                  </div>
                </div>

              </div>

              <div className="rounded-lg p-3 bg-accent-red/10 border border-accent-red/25 text-[9px] font-mono text-text-secondary leading-relaxed space-y-1">
                <span className="font-bold text-accent-red shrink-0 uppercase block">NOTICE: Container Sandbox Warning</span>
                <p className="text-text-secondary">
                  Demo databases reside in isolated container sandbox nodes. High-frequency trade simulations persist in browser session storage only. Always verify your connection credentials.
                </p>
              </div>

              <div className="rounded-lg p-2.5 bg-bg-primary/40 border border-border-default text-[8.5px] font-mono text-text-muted leading-relaxed">
                Tip: Direct-clicking any card auto-populates credentials in the authentication form instantly.
              </div>

            </div>

          </div>
        )}

      </div>

      {/* 5. BRAND COMPLIANT FOOTER (Reads exactly as mandated) */}
      <footer className="w-full py-5 border-t border-border-default/80 px-6 text-center bg-bg-secondary shrink-0 font-mono text-[9.5px] text-text-secondary/90 mt-auto">
        <p className="tracking-wide text-center leading-relaxed">
          © 2026 - ThinkSpices™ is a strategic initiative and is owned by MAGASTU INDOPRIME GROUP (MIG) - All rights reserved.
        </p>
      </footer>

    </div>
  );
};
