import React, { useState } from 'react';
import { Send, Sparkles, MessageCircle, Clock, Trash2, ShieldAlert, BadgeInfo } from 'lucide-react';
import { UserProfile, ChatMessage } from './types';

interface TabAIAdvisorProps {
  user: UserProfile;
  onConsultationLogged: (record: any) => void;
  savedConsultations: Array<{ id: string; topic: string; summary: string; date: string; messages: ChatMessage[] }>;
  onDeleteConsultation?: (id: string) => void;
}

// Lightweight Inline Markdown Formatter to parse bold, italic, and inline code correctly
const renderFormattedText = (text: string) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    // Regex matches double asterisks **bold**, single asterisks *italic*, and backticks `code`
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    const segments = line.split(regex);
    const renderedSegments = segments.map((seg, segIdx) => {
      if (seg.startsWith('**') && seg.endsWith('**')) {
        return (
          <strong key={segIdx} className="font-extrabold text-white">
            {seg.slice(2, -2)}
          </strong>
        );
      } else if (seg.startsWith('*') && seg.endsWith('*')) {
        return (
          <em key={segIdx} className="italic text-gray-300">
            {seg.slice(1, -1)}
          </em>
        );
      } else if (seg.startsWith('`') && seg.endsWith('`')) {
        return (
          <code key={segIdx} className="bg-slate-800 text-amber-200 px-1 py-0.5 rounded font-mono text-[10px]">
            {seg.slice(1, -1)}
          </code>
        );
      }
      return seg;
    });

    return (
      <div key={lineIdx} className={lineIdx > 0 ? 'mt-1' : ''}>
        {renderedSegments}
      </div>
    );
  });
};

export default function TabAIAdvisor({
  user,
  onConsultationLogged,
  savedConsultations,
  onDeleteConsultation
}: TabAIAdvisorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Welcome, ${user.fullName}! Welcome to the InTradeX AI Export Advisor 🚀

We are here to help SME spice and commodity merchants successfully navigate global agricultural regulations, sanitize trade workflows, and fulfill cross-border audits with ease.

Here is what you can ask me:
1. 🧪 Sanitation & Biosecurity: Limits on Aflatoxins, Coumarin warns (e.g. European Union TRACES NT system), moisture levels, and ASTA cleanliness specs.
2. 📋 Exporter Certifications: Phytosanitary certificates, Halal requirements, Prior Notice, and Certificates of Origin.
3. 📦 Wooden Packaging Protocols: ISPM 15 standards, DAFF (Australia) quarantine codes, and thermal or methyl bromide fumigation specifications.
4. 📈 Tariff & Custom Codes: HS codes for spices, duty rates, and required import documents for target destinations of PT Magastu Indoprime Group clients.

Choose a target market on the control panel to inject context, or click one of the suggested sample questions below to begin!`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dropdown parameters
  const [targetMarket, setTargetMarket] = useState('Europe (EU)');
  const [focusTopic, setFocusTopic] = useState('Biosecurity & Sanitation');

  // Preloaded suggestions
  const suggestions = [
    "What are EFSA's coumarin limits for Indonesian Cassia bark imports?",
    "Can you detail ASTA's cleanliness specifications for Muntok White Pepper?",
    "What are DAFF's fumigation standards for wooden export packaging?",
    "What certificates do I need to send organic cloves to the UAE?"
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Create request package with context injection
      const contextPrompt = `
[Target Market Context: ${targetMarket}]
[Focus Topic Context: ${focusTopic}]
User Question: ${textToSend}
      `.trim();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: contextPrompt,
          history: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to connect to Gemini backend. Make sure GEMINI_API_KEY is configured.');
      }

      const data = await response.json();
      
      // Add AI reply
      const aiReply: ChatMessage = {
        sender: 'ai',
        text: data.reply || 'No response returned from the model.',
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, aiReply]);

      // Save consultation
      onConsultationLogged({
        topic: `${targetMarket} - ${focusTopic}`,
        summary: textToSend.substring(0, 60) + '...',
        messages: [...messages, userMsg, aiReply]
      });

    } catch (err: any) {
      // Fallback response with beautiful error handling
      const failReply: ChatMessage = {
        sender: 'ai',
        text: `⚠️ Simulation Offline / Key Missing:

We detected that the GEMINI_API_KEY is not set in the Secrets settings, or the backend connection was interrupted.

For now, here is the standard compliance handbook compiled by PT Magastu Indoprime Group:

For exporting spices into the ${targetMarket} market regarding ${focusTopic}:

1. Control moisture limits below 12% to prevent Aflatoxin and Ochratoxin development.
2. Obtain an official Aflatoxin Analysis Report (Max 5 ppb B1) from an accredited, certified laboratory.
3. Ensure wooden pallet packagings strictly carry the ISPM-15 hot-treatment or fumigation stamp.

Please configure your GEMINI_API_KEY in the AI Studio Settings menu to unlock fully customizable interactive consulting conversations!`,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, failReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreloaded = (text: string) => {
    handleSendMessage(text);
  };

  const handleLoadPastChat = (past: any) => {
    setMessages(past.messages);
    setTargetMarket(past.topic.split(' - ')[0] || 'Europe (EU)');
    setFocusTopic(past.topic.split(' - ')[1] || 'Biosecurity & Sanitation');
  };

  return (
    <div className="space-y-6">
      
      {/* Disclaimer and Banner */}
      <div className="bg-[#161b27] border border-[#2d3748] p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            AI Global Trade Consultant
          </h2>
          <p className="text-xs text-[#94a3b8] mt-1">
            Retrieval-Augmented advisory engine tuned on biosecurity regulations, Customs and Invoices schemas.
          </p>
        </div>
        
        <span className="bg-blue-950/40 text-blue-300 font-mono text-[9px] border border-blue-900 px-3 py-1.5 rounded-full uppercase font-bold tracking-wider leading-none">
          ⚡ GEMINI 2.5 RAG PIPELINE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column: Context controllers & past logs */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Controllers */}
          <div className="bg-[#161b27] border border-[#2d3748] p-5 rounded-2xl space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider border-b border-[#2d3748] pb-2">Topical Parameters</h4>
            
            <div>
              <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5">Target Destination</label>
              <select
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
                className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-3.5 py-2 text-xs text-[#e6eaf0] focus:outline-none focus:border-[#2563eb] w-full"
              >
                <option value="Europe (EU)">Europe (EU)</option>
                <option value="United States (FDA)">United States (FDA)</option>
                <option value="Australia (DAFF)">Australia (DAFF)</option>
                <option value="Middle East (GCC)">Middle East (GCC)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-1.5">Consultation Chapter</label>
              <select
                value={focusTopic}
                onChange={(e) => setFocusTopic(e.target.value)}
                className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-3.5 py-2 text-xs text-[#e6eaf0] focus:outline-none focus:border-[#2563eb] w-full"
              >
                <option value="Biosecurity & Sanitation">Biosecurity &amp; Sanitation</option>
                <option value="Customs Tariffs & HS Codes">Customs Tariffs &amp; HS Codes</option>
                <option value="Contract Sales Clauses">Sales Contract Clauses</option>
                <option value="Logistical Ocean Freight">Logistical Ocean Freight</option>
              </select>
            </div>
          </div>

          {/* Past consultation history */}
          <div className="bg-[#161b27] border border-[#2d3748] p-5 rounded-2xl flex-grow flex flex-col justify-between min-h-[300px]">
            <div className="space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider border-b border-[#2d3748] pb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                Consultation Logs
              </h4>

              {savedConsultations.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-6 text-center">No active historical sessions cached.</p>
              ) : (
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {savedConsultations.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleLoadPastChat(chat)}
                      className="bg-[#1e2636]/60 hover:bg-[#1e2636] border border-[#2d3748] p-3 rounded-xl cursor-pointer transition flex justify-between items-start gap-2 relative group"
                    >
                      <div className="space-y-1 overflow-hidden">
                        <p className="text-[10px] font-mono font-bold text-[#D4A017] uppercase tracking-wider leading-none mt-0.5">{chat.topic}</p>
                        <p className="text-xs text-white truncate max-w-[180px] font-medium">{chat.summary}</p>
                        <p className="text-[9px] text-gray-500 font-mono leading-none">{new Date(chat.date).toLocaleDateString()}</p>
                      </div>
                      
                      {onDeleteConsultation && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConsultation(chat.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 text-gray-500 rounded transition shrink-0 mt-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#2d3748] text-[10px] font-mono text-gray-500 mt-4 leading-normal flex items-start gap-1">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Advice is calibrated with standard export laws. Confirm final commercial documents officially with PT Magastu compliance officers.</span>
            </div>
          </div>

        </div>

        {/* Right column: Interactive chatbot screen */}
        <div className="lg:col-span-8 bg-[#161b27] border border-[#2d3748] rounded-2xl flex flex-col justify-between min-h-[500px]">
          
          {/* Chat Messages */}
          <div className="p-6 space-y-4 max-h-[480px] overflow-y-auto flex-grow rounded-t-2xl pr-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed space-y-2 border ${
                    m.sender === 'user'
                      ? 'bg-[#2563eb] text-white border-blue-600 rounded-tr-none'
                      : 'bg-[#1e2636] text-[#e6eaf0] border-[#2d3748] rounded-tl-none'
                  }`}
                >
                  <div className="leading-relaxed font-sans">
                    {renderFormattedText(m.text)}
                  </div>
                  <span className="block text-[9px] text-right font-mono text-gray-400 leading-none pt-2">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#1e2636] border border-[#2d3748] p-4 rounded-2xl rounded-tl-none flex items-center space-x-2 text-xs text-[#94a3b8]">
                  <div className="flex space-x-1">
                    <span className="w-2.5 h-2.5 bg-[#D4A017] rounded-full animate-bounce"></span>
                    <span className="w-2.5 h-2.5 bg-[#D4A017] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2.5 h-2.5 bg-[#D4A017] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="font-mono text-[10px] animate-pulse">Gemini consulting RAG documents...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions overlay */}
          {messages.length === 1 && (
            <div className="px-6 py-2 bg-[#0e1117]/40 border-t border-[#2d3748] space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Suggested Inquiries:</p>
              <div className="flex flex-wrap gap-2 pb-1">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectPreloaded(s)}
                    className="bg-[#1e2636] hover:bg-[#2d3748] border border-[#2d3748] text-[#D4A017] text-[10px] px-3.5 py-1.5 rounded-lg text-left transition max-w-full font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input control tray */}
          <div className="p-4 border-t border-[#2d3748] bg-[#0e1117]/35 rounded-b-2xl">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Ask about ${targetMarket} ${focusTopic} (e.g. aflatoxins etc)...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-grow bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#2563eb]"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-gray-800 text-white p-3 rounded-xl transition shadow-lg shrink-0 flex items-center justify-center border border-blue-600"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
