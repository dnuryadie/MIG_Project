import React, { useState } from "react";
import { X, ShieldCheck, Mail, Lock, Building, User, Award, Key } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [membershipTier, setMembershipTier] = useState<"FREE" | "PRO" | "ENTERPRISE">("PRO");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please fill in all security parameter credentials.");
      return;
    }

    if (isSignUp && (!name.trim() || !companyName.trim())) {
      setErrorMsg("Corporate sign-ups require full B2B verification parameters (Name & Company).");
      return;
    }

    if (isSignUp) {
      // Create new user block
      const newUser = {
        name: name.trim(),
        email: email.trim(),
        companyName: companyName.trim(),
        membershipTier,
        savedRfqs: []
      };
      localStorage.setItem("thinkspices_user", JSON.stringify(newUser));
      onLoginSuccess(newUser);
      onClose();
    } else {
      // Login - check if we can match existing user or seed a new one
      const saved = localStorage.getItem("thinkspices_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email === email) {
          onLoginSuccess(parsed);
          onClose();
          return;
        }
      }

      // If email is alex.mercer@foodcorp.com, log in the pre-defined demo user
      if (email === "alex.mercer@foodcorp.com" || email === "alex@foodcorp.com") {
        const demoUser = {
          name: "Alex Mercer",
          email: "alex.mercer@foodcorp.com",
          companyName: "Global Food Ingredients Corp",
          membershipTier: "PRO" as const,
          savedRfqs: [
            {
              id: "RFQ-6842",
              timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
              commodityName: "NUTMEG",
              varietyName: "BANDA NUTMEG",
              productForm: "WHOLE",
              volume: 5.0,
              targetPrice: 9.20,
              destinationPort: "Rotterdam, Netherlands",
              exporterName: "PT ARCHIPELAGO SPICES INDONESIA"
            },
            {
              id: "RFQ-3105",
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              commodityName: "CLOVE",
              varietyName: "SULAWESI CLOVE",
              productForm: "WHOLE",
              volume: 12.0,
              targetPrice: 7.80,
              destinationPort: "Hamburg, Germany",
              exporterName: "PT PRIMA REMPAH NUSANTARA"
            }
          ]
        };
        localStorage.setItem("thinkspices_user", JSON.stringify(demoUser));
        onLoginSuccess(demoUser);
        onClose();
      } else {
        // Just dynamic login for ease of use
        const dynamicUser = {
          name: email.split("@")[0].toUpperCase(),
          email,
          companyName: "Archipelago Commodities Ltd",
          membershipTier: "FREE" as const,
          savedRfqs: []
        };
        localStorage.setItem("thinkspices_user", JSON.stringify(dynamicUser));
        onLoginSuccess(dynamicUser);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-secondary border border-border-default rounded-xl w-full max-w-md p-6 relative shadow-2xl animate-scale-up" id="auth-modal-dialog">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-1.5 rounded hover:bg-bg-primary transition-colors"
          title="Close security portal"
        >
          <X size={18} />
        </button>

        {/* Brand Banner */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-gold/10 border border-accent-gold/30 rounded-full text-[10px] font-mono text-accent-gold uppercase tracking-wider">
            <ShieldCheck size={12} />
            <span>ThinkSpices™ B2B Secure Gate</span>
          </div>
          <h2 className="font-display font-bold text-lg text-text-primary uppercase tracking-tight">
            {isSignUp ? "Create B2B Sourcing Profile" : "Access Sourcing Terminal"}
          </h2>
          <p className="font-mono text-[9px] text-text-secondary tracking-widest uppercase">
            MIG strategic buyer authorization
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 bg-accent-red/10 border border-accent-red/40 text-accent-red rounded text-xs font-mono" role="alert">
            {errorMsg}
          </div>
        )}

        {/* Main interactive form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isSignUp && (
            <>
              {/* Full Name input */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-text-secondary">
                  Buyer Full Name *
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full pl-9 pr-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold rounded text-xs text-text-primary font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Company Name Input */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-text-secondary">
                  Corporate Company Name *
                </label>
                <div className="relative">
                  <Building size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Global Food Ingredients Corp"
                    className="w-full pl-9 pr-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold rounded text-xs text-text-primary font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Membership Tier selector */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-text-secondary">
                  Desired Membership Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["FREE", "PRO", "ENTERPRISE"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setMembershipTier(t)}
                      className={`py-1.5 rounded font-mono text-[10px] border transition-all ${
                        membershipTier === t
                          ? "bg-accent-gold/10 border-accent-gold text-accent-gold font-bold"
                          : "bg-bg-input border-border-default text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Email parameter */}
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-text-secondary">
              Work Email Address *
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@corporate.com"
                className="w-full pl-9 pr-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold rounded text-xs text-text-primary font-mono focus:outline-none"
              />
            </div>
            {!isSignUp && (
              <span className="text-[9px] font-mono text-text-muted block mt-1">
                Tip: Enter **alex.mercer@foodcorp.com** to load full corporate demo history.
              </span>
            )}
          </div>

          {/* Password secure string */}
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-text-secondary">
              Secure Terminal Token / Password *
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-bg-input border border-border-default focus:border-accent-gold rounded text-xs text-text-primary font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Submit action */}
          <button
            type="submit"
            className="w-full py-2 bg-accent-gold hover:bg-accent-gold-soft text-bg-primary font-bold font-mono text-xs uppercase tracking-wider rounded transition-colors mt-2"
          >
            {isSignUp ? "Formulate Sourcing Profile" : "Access Secured Terminal"}
          </button>
        </form>

        {/* Toggle between states */}
        <div className="mt-4 pt-4 border-t border-border-default/40 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg("");
            }}
            className="text-[10px] font-mono text-text-secondary hover:text-accent-gold transition-colors underline"
          >
            {isSignUp 
              ? "Already verified? Access terminal via SSO" 
              : "New Buyer? Register Corporate profile in Exporter Database"}
          </button>
        </div>

      </div>
    </div>
  );
};
