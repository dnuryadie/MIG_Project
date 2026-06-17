import React, { useState, useEffect, useRef } from "react";
import { Send, X, Bot, User, Sparkles, AlertCircle } from "lucide-react";
import { Commodity, Variety } from "./mockData";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  isFallback?: boolean;
}

interface AISourcingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentCommodity: Commodity | null;
  currentVariety: Variety | null;
  currentStep: number;
  rfqDraft: any;
  onPrefillAndNavigateToRfq?: (rfqData: any) => void;
  aiInitialMessage?: string | null;
  onClearInitialMessage?: () => void;
}

interface GuidedSourcingFlow {
  active: boolean;
  step: number;
  commodity: string;
  grade: string;
  origin: string;
  certs: string;
  volume: string;
  destination: string;
}

export const AISourcingPanel: React.FC<AISourcingPanelProps> = ({
  isOpen,
  onClose,
  currentCommodity,
  currentVariety,
  currentStep,
  rfqDraft,
  onPrefillAndNavigateToRfq,
  aiInitialMessage,
  onClearInitialMessage
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<"GEMINI" | "FALLBACK">("GEMINI");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [flow, setFlow] = useState<GuidedSourcingFlow>({
    active: false,
    step: 1,
    commodity: "",
    grade: "",
    origin: "",
    certs: "",
    volume: "",
    destination: ""
  });

  // Helper to format LaTeX syntax and markdown headers for smooth rendering inside chat bubbles
  const formatChatText = (rawText: string) => {
    let formatted = rawText;

    // Clean common chemical LaTeX structures in a foolproof string-based way before regex.
    formatted = formatted.replace(/\\text\{C\}_\{11\}\\text\{H\}_\{12\}\\text\{O\}_3/g, "C11H12O3");
    formatted = formatted.replace(/\\text\{C\}_\{10\}\\text\{H\}_\{12\}\\text\{O\}_2/g, "C10H12O2");

    // Replace standard LaTeX blocks like \text{C}_{11}\text{H}_{12}\text{O}_3
    formatted = formatted.replace(/\\text\{([^}]+)\}/g, "$1");
    formatted = formatted.replace(/_\{([^}]+)\}/g, "$1");
    formatted = formatted.replace(/_([a-zA-Z0-9])/g, "$1");
    formatted = formatted.replace(/\$([^$]+)\$/g, "$1");
    formatted = formatted.replace(/\$/g, "");

    // General cleanup of remaining latex formatting terms if any slipped in
    formatted = formatted.replace(/\\mathrm/g, "");
    formatted = formatted.replace(/\\quad/g, " ");

    // Demote high markdown headers to inline text bolding
    formatted = formatted.replace(/^\s*###\s+(.*)$/gm, "\n**$1**\n");
    formatted = formatted.replace(/^\s*##\s+(.*)$/gm, "\n**$1**\n");
    formatted = formatted.replace(/^\s*#\s+(.*)$/gm, "\n**$1**\n");

    return formatted.split("**").map((part, index) => {
      const cleanPart = part.replace(/\*/g, "");
      if (index % 2 === 1) {
        return (
          <strong key={index} className="text-accent-gold font-bold text-shadow-xs">
            {cleanPart}
          </strong>
        );
      }
      return cleanPart;
    });
  };

  // Quick shortcuts contextualized to the active context commodity
  const getShortcuts = () => {
    if (!currentCommodity) {
      return [
        "Compare Banda vs Papua Nutmeg",
        "Volatile oil of Sulawesi Clove",
        "Which cinnamon has low coumarin?",
        "Minimum Order Quantities (MOQs)"
      ];
    }
    const name = currentCommodity.name.toUpperCase();
    if (name === "NUTMEG") {
      return [
        "Compare Banda vs Papua Nutmeg",
        "Volatile oil of Papua Nutmeg",
        "Explain Myristicin testing ranges",
        "What is the MOQ of Banda Nutmeg?"
      ];
    } else if (name === "CINNAMON") {
      return [
        "Korintje vs Padang Cassia differences",
        "Which cinnamon has low coumarin limits?",
        "Explain cinnamaldehyde test requirements",
        "Standard container weight for Cassia"
      ];
    } else if (name === "CLOVE") {
      return [
        "Compare Sulawesi vs Zanzibar Eugenol",
        "Explain SNI 01-3392 moisture values",
        "Volatile oil yield of Manado Clove",
        "What are the typical packaging bags?"
      ];
    } else {
      return [
        `Typical MOQ for Indonesian ${currentCommodity.name}`,
        `Volatile properties of ${currentVariety?.name || currentCommodity.name}`,
        `Explain SNI code compliance limits`,
        `Available certs for ${currentVariety?.name || currentCommodity.name}`
      ];
    }
  };

  // Reset or initialize messages on compile
  useEffect(() => {
    if (isOpen) {
      if (flow.active) return; // Preserve active guided-sourcing session across panel openings

      // Clear messages if starting fresh or populate initial greeting
      const commodityName = currentCommodity ? currentCommodity.name : "spice";
      const varietiesNamesStr = currentCommodity 
        ? currentCommodity.varieties.map(v => `${v.name} (${v.origin}) [MOQ: ${v.minMOQ}MT]`).join(", ")
        : "all Indonesian trade sectors";

      const welcomeMsg = `Welcome to the ThinkSpices™ sourcing terminal. We are currently reviewing Indonesian [${commodityName.toUpperCase()}] origins. We support direct FOB sourcing for ${currentCommodity ? currentCommodity.varieties.length : "9"} distinct botanical varieties:\n\n${varietiesNamesStr}.\n\nHow can I support your technical contract specifications today?`;
      
      setMessages([
        {
          id: "welcome",
          sender: "ai",
          text: welcomeMsg,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, currentCommodity, currentVariety]);

  // Automatically start guided sourcing flow on receiving initial prompt bar queries
  useEffect(() => {
    if (isOpen && aiInitialMessage) {
      const q = aiInitialMessage;
      const qLow = q.toLowerCase();
      
      let parsedCommodity = "";
      if (qLow.includes("nutmeg")) parsedCommodity = "Nutmeg";
      else if (qLow.includes("cinnamon") || qLow.includes("cassia")) parsedCommodity = "Cinnamon";
      else if (qLow.includes("pepper")) parsedCommodity = "Pepper";
      else if (qLow.includes("clove")) parsedCommodity = "Clove";
      
      let parsedCerts = "";
      if (qLow.includes("halal") || qLow.includes("haccp") || qLow.includes("organic") || qLow.includes("fda")) {
        const certsArr: string[] = [];
        if (qLow.includes("halal")) certsArr.push("HALAL");
        if (qLow.includes("haccp")) certsArr.push("HACCP");
        if (qLow.includes("organic")) certsArr.push("Organic");
        if (qLow.includes("fda")) certsArr.push("FDA");
        parsedCerts = certsArr.join(", ");
      }

      let parsedVolume = "";
      const mtMatch = qLow.match(/(\d+(\.\d+)?)\s*(mt|metric|ton)/);
      if (mtMatch) {
        parsedVolume = `${mtMatch[1]} MT`;
      }

      const initialStep = parsedCommodity ? 2 : 1;
      setFlow({
        active: true,
        step: initialStep,
        commodity: parsedCommodity,
        grade: "",
        origin: "",
        certs: parsedCerts,
        volume: parsedVolume,
        destination: ""
      });

      if (onClearInitialMessage) {
        onClearInitialMessage();
      }

      setMessages([
        {
          id: "welcome-guided-query",
          sender: "ai",
          text: `✦ **ThinkSpices™ Guided Sourcing Workflow Activated**\n\nI have parsed your initial reference request details:\n"${q}"\n\n${parsedCommodity ? `• Detected Commodity: **${parsedCommodity}**\n` : ""}${parsedCerts ? `• Detected Certifications: **${parsedCerts}**\n` : ""}${parsedVolume ? `• Detected Volume: **${parsedVolume}**\n` : ""}\nLet's wrap up your technical requirement files.\n\n${parsedCommodity ? `**Step 2**: What grade or volatile oil targets do you require?` : `**Step 1**: Which commodity would you like to source today?`}`,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, aiInitialMessage]);

  const handleGuidedStepSubmit = (value: string) => {
    if (!value.trim() || isLoading) return;

    // Add user message
    const userMsgId = Math.random().toString();
    setMessages(prev => [
      ...prev,
      {
        id: userMsgId,
        sender: "user",
        text: value,
        timestamp: new Date()
      }
    ]);

    setIsLoading(true);

    // Update flow state and advance
    setFlow(prev => {
      const nextFlow = { ...prev };
      const currentStep = prev.step;

      if (currentStep === 1) nextFlow.commodity = value.replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]/g, "").trim();
      else if (currentStep === 2) nextFlow.grade = value.replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]/g, "").trim();
      else if (currentStep === 3) nextFlow.origin = value.replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]/g, "").trim();
      else if (currentStep === 4) nextFlow.certs = value.replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]/g, "").trim();
      else if (currentStep === 5) nextFlow.volume = value.replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]/g, "").trim();
      else if (currentStep === 6) nextFlow.destination = value.replace(/[\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF]/g, "").trim();

      const nextStep = currentStep + 1;
      nextFlow.step = nextStep;

      // AI response delayed timer simulation
      setTimeout(() => {
        let aiText = "";
        if (nextStep === 2) {
          aiText = `Got it: **${value}**. \n\n**Step 2**: What grade or volatile oil targets do you require?`;
        } else if (nextStep === 3) {
          aiText = `Understood: **${value}**.\n\n**Step 3**: What origin preference do you have? (e.g. Banda Islands, Papua, North Sulawesi, Padang Highlands, or no preference)`;
        } else if (nextStep === 4) {
          aiText = `Origin saved: **${value}**.\n\n**Step 4**: What certifications do you need? (e.g. HALAL, HACCP, USDA Organic, FDA Registered, etc.)`;
        } else if (nextStep === 5) {
          aiText = `Certifications recorded: **${value}**.\n\n**Step 5**: What volume in Metric Tons (MT) do you require?`;
        } else if (nextStep === 6) {
          aiText = `Volume recorded: **${value}**.\n\n**Step 6**: What is your destination port? (e.g., Rotterdam, Hamburg, Singapore, New York, Jebel Ali / Dubai)`;
        } else if (nextStep === 7) {
          const isNutmeg = nextFlow.commodity.toLowerCase().includes("nutmeg");
          const botanicalNameStr = isNutmeg 
            ? "Myristica fragrans" 
            : nextFlow.commodity.toLowerCase().includes("cinnamon") 
              ? "Cinnamomum cassia" 
              : "Sourcing Standard";
              
          aiText = `✦ **GUIDED SOURCING COMPLETED**\n\nYour technical sourcing brief has been successfully compiled and verified against current active Indonesian trade laws and SNI benchmarks.\n\n### **SOURCING BRIEF SUMMARY**\n━━━━━━━━━━━━━━━━━━━━━━\n• **Commodity**: ${nextFlow.commodity} (${botanicalNameStr})\n• **Grade**: ${nextFlow.grade}\n• **Origin**: ${nextFlow.origin}\n• **Certs needed**: ${nextFlow.certs}\n• **Volume**: ${nextFlow.volume}\n• **Destination**: ${nextFlow.destination}\n• **Indicative FOB Target**: $9,200–$9,500/MT (Current spot index benchmark)\n\n• **Risk Summary**: **LOW RISK** — Peak harvest season, high reserve margins, ample cargo vessel volume capacity clearances active.\n\n━━━━━━━━━━━━━━━━━━━━━━\n### **RECOMMENDED EXPORTERS**\n1. **Magastu Agri Expo, Jakarta** (EQI: 95, SNI-0006 standard compliant) \n2. **Banda Spice Growers Corp** (EQI: 92, Direct Banda cooperative) \n3. **Sumatran Cassia Millers** (EQI: 89, Direct Korintje quill exporter) \n\nWould you like to draft your final technical RFQ with these parameters?`;
        }

        setMessages(prevMsgs => [
          ...prevMsgs,
          {
            id: Math.random().toString(),
            sender: "ai",
            text: aiText,
            timestamp: new Date()
          }
        ]);
        setIsLoading(false);
      }, 750);

      return nextFlow;
    });
  };

  // Handle message scrolling
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    if (flow.active) {
      handleGuidedStepSubmit(textToSend);
      setInputValue("");
      return;
    }

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
          context: {
            commodity: currentCommodity,
            variety: currentVariety,
            step: currentStep,
            rfqDraft: rfqDraft
          }
        })
      });

      if(!response.ok) throw new Error('Server error: ${response.status}');
      const data = await response.json();
      if (data.isFallback) {
        setAgentStatus("FALLBACK");
      } else {
        setAgentStatus("GEMINI");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "ai",
          text: data.text,
          timestamp: new Date(),
          isFallback: data.isFallback
        }
      ]);
    } catch (err) {
      console.error("AI Sourcing Agent fetch failed:", err);
      // Fallback response
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "ai",
          text: "I'm currently operating in offline mode with limited data access. I can still assist you with SNI codes, MOQ references, and local sourcing specs. For live market data, please reconnect to the server.",
          timestamp: new Date(),
          isFallback: true
        }
      ]);
      setAgentStatus("FALLBACK");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-14 right-0 bottom-0 w-[380px] bg-bg-secondary border-l border-border-default z-40 flex flex-col shadow-2xl transition-all duration-300">
      {/* Header element */}
      <div className="p-4 border-b border-border-default flex items-center justify-between bg-bg-tertiary">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-xs tracking-wider text-accent-gold uppercase">
              AI Sourcing Assistant ✦
            </span>
            <span className={`h-2 w-2 rounded-full ${agentStatus === "GEMINI" ? "bg-accent-gold" : "bg-accent-amber animate-pulse"}`}></span>
          </div>
          <span className="font-mono text-[9px] text-text-muted mt-0.5">
            {agentStatus === "GEMINI" ? "● GEMINI 3.5 ACTIVE" : "⚠️ SECURE LOCAL AGENT"}
          </span>
        </div>
        <button 
          onClick={onClose} 
          className="text-text-muted hover:text-text-primary p-1 rounded hover:bg-bg-primary transition-colors"
          title="Minimize AI Assistant"
        >
          <X size={16} />
        </button>
      </div>

      {/* Context lock label indicator */}
      <div className="bg-bg-primary py-2 px-4 border-b border-border-default flex items-center justify-between text-[10px] font-mono">
        <span className="text-text-secondary">
          CONTEXT INDEX:
        </span>
        <span className="text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px]" id="context-lock-badge">
          {currentCommodity ? `FOCUS LOCKED: ${currentCommodity.name}` : "FREE DESK LOCK"}
        </span>
      </div>

      {/* Stream chat interface container */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === "user";
          return (
            <div 
              key={m.id} 
              className={`flex flex-col max-w-[85%] ${isUser ? "ml-auto items-end" : "mr-auto items-start"}`}
            >
              {/* Message metadata details */}
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-text-muted mb-1">
                {isUser ? (
                  <>
                    <span>{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-text-secondary">PROCUREMENT BUYER</span>
                    <User size={10} className="text-text-secondary" />
                  </>
                ) : (
                  <>
                    <Bot size={10} className="text-accent-gold" />
                    <span className="text-accent-gold">THINKSPICES AI</span>
                    <span>{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </>
                )}
              </div>

              {/* Message text bubble content */}
              <div 
                className={`p-3 rounded text-[13px] leading-relaxed break-words border font-sans select-text ${
                  isUser 
                    ? "bg-accent-gold/10 border-accent-gold/30 text-text-primary rounded-tr-none" 
                    : "bg-bg-tertiary border-border-default text-text-primary rounded-tl-none font-medium"
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {formatChatText(m.text)}
                </div>
                {m.isFallback && (
                  <div className="mt-2 pt-1.5 border-t border-border-default flex items-center gap-1 text-[9px] font-mono text-accent-amber">
                    <AlertCircle size={10} />
                    <span>Reference Standard Database applied</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex flex-col items-start mr-auto max-w-[85%]">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-text-muted mb-1">
              <Bot size={10} className="text-accent-gold animate-spin" />
              <span className="text-accent-gold">PARSING BOTANICAL COMPOUND MATRIX...</span>
            </div>
            <div className="p-3 rounded-lg rounded-tl-none bg-bg-tertiary border border-border-default/50 text-text-muted text-xs font-mono animate-pulse w-full">
              Transmitting active specifications via secured SSL tunnel...
            </div>
          </div>
        )}
      </div>

      {/* Interactive Flow Controls / Sourcing Spec shortcuts */}
      {flow.active && flow.step <= 6 && (
        <div className="p-3 border-t border-border-default bg-bg-tertiary shrink-0">
          <span className="block text-[9px] font-mono font-bold uppercase tracking-widest text-accent-gold mb-2">
            ✦ STEP {flow.step} QUICK ACTION SUGGESTIONS
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
            {flow.step === 1 && [
              "Nutmeg 🌰", "Cinnamon 🪵", "Pepper 🫑", "Clove ✿", "Other Spices ✦"
            ].map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleGuidedStepSubmit(option)}
                className="px-2 py-1.5 bg-bg-primary text-text-primary hover:text-accent-gold border border-border-default hover:border-accent-gold rounded text-[11px] font-mono transition-colors font-semibold grow text-center cursor-pointer shrink-0"
              >
                {option}
              </button>
            ))}
            {flow.step === 2 && [
              "Volatile Oil ≥ 12% ⭐", "Volatile Oil ≥ 10%", "Volatile Oil ≥ 7%", "Standard compliance"
            ].map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleGuidedStepSubmit(option)}
                className="px-2 py-1.5 bg-bg-primary text-text-primary hover:text-accent-gold border border-border-default hover:border-accent-gold rounded text-[11px] font-mono transition-colors font-semibold grow text-center cursor-pointer shrink-0"
              >
                {option}
              </button>
            ))}
            {flow.step === 3 && [
              "Banda Islands 🏖️", "Papua ⛰️", "Sulawesi 🏝️", "Sumatra 🏔️", "No preference"
            ].map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleGuidedStepSubmit(option)}
                className="px-2 py-1.5 bg-bg-primary text-text-primary hover:text-accent-gold border border-border-default hover:border-accent-gold rounded text-[11px] font-mono transition-colors font-semibold grow text-center cursor-pointer shrink-0"
              >
                {option}
              </button>
            ))}
            {flow.step === 4 && [
              "HALAL + HACCP ✅", "USDA Organic 🍃", "FDA Registered 🌐", "No certs required"
            ].map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleGuidedStepSubmit(option)}
                className="px-2 py-1.5 bg-bg-primary text-text-primary hover:text-accent-gold border border-border-default hover:border-accent-gold rounded text-[11px] font-mono transition-colors font-semibold grow text-center cursor-pointer shrink-0"
              >
                {option}
              </button>
            ))}
            {flow.step === 5 && [
              "2 MT", "5 MT", "10 MT", "25 MT", "50+ MT ⚓"
            ].map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleGuidedStepSubmit(option)}
                className="px-2 py-1.5 bg-bg-primary text-text-primary hover:text-accent-gold border border-border-default hover:border-accent-gold rounded text-[11px] font-mono transition-colors font-semibold grow text-center cursor-pointer shrink-0"
              >
                {option}
              </button>
            ))}
            {flow.step === 6 && [
              "Rotterdam Port 🇳🇱", "Singapore Port 🇸🇬", "Jebel Ali Port 🇦🇪", "New York Port 🇺🇸"
            ].map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleGuidedStepSubmit(option)}
                className="px-2 py-1.5 bg-bg-primary text-text-primary hover:text-accent-gold border border-border-default hover:border-accent-gold rounded text-[11px] font-mono transition-colors font-semibold grow text-center cursor-pointer shrink-0"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {flow.active && flow.step === 7 && (
        <div className="p-3 border-t border-border-default bg-bg-tertiary shrink-0 space-y-2">
          <span className="block text-[9px] font-mono font-bold uppercase tracking-widest text-[#27AE60] mb-1">
            ✓ GUIDED CONTRACT SPECIFICATIONS COMPILED
          </span>
          <button
            type="button"
            onClick={() => {
              if (onPrefillAndNavigateToRfq) {
                onPrefillAndNavigateToRfq({
                  commodity: flow.commodity.toUpperCase(),
                  volume: parseFloat(flow.volume) || 5,
                  oilTarget: parseFloat(flow.grade) || 10,
                  origin: flow.origin,
                  certsRequired: flow.certs.split(", ").map(c => c.trim().toUpperCase()),
                  notes: `RFQ auto-generated from ThinkSpices™ Guided AI Sourcing session. Variety/commodity: ${flow.commodity}. Grade target: ${flow.grade}. Port of Destination: ${flow.destination}.`
                });
              }
            }}
            className="w-full py-2.5 bg-[#27AE60] hover:bg-[#2ECC71] text-white font-mono font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1 cursor-pointer hover:shadow-indigo-glow"
          >
            <span>GENERATE FULL RFQ →</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setFlow({
                active: false,
                step: 1,
                commodity: "",
                grade: "",
                origin: "",
                certs: "",
                volume: "",
                destination: ""
              });
              setMessages([]);
            }}
            className="w-full py-1.5 bg-bg-primary border border-border-default hover:border-accent-gold text-text-secondary hover:text-accent-gold font-mono text-[9.5px] uppercase rounded transition-colors cursor-pointer"
          >
            Reset Guided Session
          </button>
        </div>
      )}

      {!flow.active && (
        <div className="p-3 border-t border-border-default bg-bg-tertiary shrink-0 space-y-2.5">
          <button
            type="button"
            onClick={() => {
              setFlow({
                active: true,
                step: 1,
                commodity: "",
                grade: "",
                origin: "",
                certs: "",
                volume: "",
                destination: ""
              });
              setMessages([
                {
                  id: "welcome-guided-fresh",
                  sender: "ai",
                  text: "✦ **ThinkSpices™ Guided Sourcing Workflow Activated**\n\nLet's compile your custom technical specifications block-by-block. \n\n**Step 1**: Which commodity would you like to source today?",
                  timestamp: new Date()
                }
              ]);
            }}
            className="w-full py-2 bg-gradient-to-r from-accent-gold to-accent-gold-soft hover:from-accent-gold-soft hover:to-accent-gold text-bg-primary text-[10px] font-mono font-bold uppercase rounded cursor-pointer transition-all shrink-0 shadow-sm text-center"
          >
            ✦ START AI GUIDED SOURCING
          </button>

          <div>
            <span className="block text-[9px] font-mono font-bold uppercase tracking-widest text-[#968E75] mb-2">
              ⚡ SOURCING SPEC SHORTCUTS
            </span>
            <div className="grid grid-cols-1 gap-1.5 max-h-32 overflow-y-auto">
              {getShortcuts().map((shortcutText, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSendMessage(shortcutText)}
                  disabled={isLoading}
                  className="text-left w-full p-2 bg-bg-primary text-text-secondary hover:text-accent-gold border border-border-default hover:border-accent-gold rounded text-[11px] font-mono transition-colors truncate cursor-pointer shrink-0"
                  title={shortcutText}
                >
                  {shortcutText}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input container */}
      <div className="bg-bg-tertiary border-t border-border-default p-3 shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder={
              flow.active 
                ? `Type your Step ${flow.step} specifications here...` 
                : currentCommodity 
                  ? `Inquire on botanical oil, SNI code, MOQs for ${currentVariety?.name || currentCommodity.name}...`
                  : "Ask about volatile oils, MOQs, testing benchmarks..."
            }
            className="flex-1 px-3 py-2 bg-bg-input border border-border-default rounded text-[12.5px] text-text-primary placeholding focus:outline-none focus:border-accent-gold placeholder-text-muted font-mono"
            id="ai-panel-chat-input"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2 px-3 bg-accent-gold hover:bg-accent-gold-soft disabled:bg-bg-input disabled:text-text-muted text-bg-primary font-bold rounded flex items-center justify-center transition-colors border border-accent-gold"
            id="ai-panel-send-button"
            title="Send inquiry"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};
