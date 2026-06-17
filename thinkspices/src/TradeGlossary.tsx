import React, { useState } from "react";
import { Search, Info, HelpCircle, ChevronRight, BookOpen } from "lucide-react";

export interface GlossaryEntry {
  term: string;
  category: "Trade Terms" | "Port & Logistics" | "Certifications" | "Regulatory" | "Botanical";
  definition: string;
  related?: string[];
}

const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    term: "RFQ (Request for Quotation)",
    category: "Trade Terms",
    definition: "A formal trade document issued by a buyer to one or more suppliers, specifying the commodity, grade, volume, target price, delivery port, and required certifications. In the context of ThinkSpices™, an RFQ is generated after botanical specifications are confirmed and is routed to a verified Indonesian exporter for pricing response.",
    related: ["FOB", "Escrow", "MOQ"]
  },
  {
    term: "FOB (Free On Board)",
    category: "Trade Terms",
    definition: "An international trade term (Incoterm) indicating that the seller is responsible for delivering goods to the named Indonesian export port and loading them onto the vessel. Risk and cost transfer to the buyer once goods are on board. ThinkSpices™ prices are quoted FOB Indonesian sea ports (Tanjung Perak, Belawan, Ambon, etc.).",
    related: ["CIF", "Port of Loading", "Bill of Lading"]
  },
  {
    term: "CIF (Cost, Insurance & Freight)",
    category: "Trade Terms",
    definition: "An Incoterm where the seller covers cost of goods, marine insurance, and freight to the buyer's destination port. The risk transfers to the buyer upon loading at origin port, but the seller pays for freight and insurance. Common for first-time buyer contracts.",
    related: ["FOB", "InTradeX™"]
  },
  {
    term: "MOQ (Minimum Order Quantity)",
    category: "Trade Terms",
    definition: "The smallest volume a verified exporter will accept per contract. MOQs on ThinkSpices™ are expressed in Metric Tons (MT). For whole nutmeg, typical MOQ is 1–3 MT. For extracts and oleoresins, MOQ may be as low as 0.25 MT.",
    related: ["RFQ", "Product Form"]
  },
  {
    term: "SNI (Standar Nasional Indonesia)",
    category: "Regulatory",
    definition: "Indonesia's National Standard system, administered by the Badan Standardisasi Nasional (BSN). For spice exports, SNI codes define maximum moisture content, volatile oil minimums, physical grade classifications, and foreign matter limits. Key SNI codes: SNI 01-0006 (Nutmeg), SNI 01-0004 (Cloves), SNI 01-0005 (Cassia Cinnamon).",
    related: ["BARANTIN", "Moisture Content", "Grade Classification"]
  },
  {
    term: "BARANTIN (Badan Karantina Indonesia)",
    category: "Regulatory",
    definition: "The Indonesian Quarantine Authority (Badan Karantina Indonesia). BARANTIN issues Phytosanitary Certificates confirming that exported agricultural commodities are free from quarantine pests, soil contamination, and living organisms. A BARANTIN certificate is compulsory for all bulk spice container exports.",
    related: ["Phytosanitary Certificate", "SNI"]
  },
  {
    term: "Phytosanitary Certificate",
    category: "Certifications",
    definition: "An official document issued by BARANTIN certifying that a shipment of agricultural goods has been inspected and is free from regulated pests and diseases. Required by importing countries (USA, EU, Japan, Australia) as a condition for customs clearance of Indonesian spice cargo.",
    related: ["BARANTIN", "HACCP", "FDA"]
  },
  {
    term: "HALAL Certification",
    category: "Certifications",
    definition: "Certification issued by MUI (Majelis Ulama Indonesia) or recognized international halal bodies, confirming that the product and its processing method comply with Islamic law. Essential for markets in the Middle East, Malaysia, and increasingly required by EU and US retailers for food-grade spice imports.",
    related: ["HACCP", "ISO 22000"]
  },
  {
    term: "HACCP (Hazard Analysis Critical Control Points)",
    category: "Certifications",
    definition: "An internationally recognized food safety management system that identifies and controls biological, chemical, and physical hazards in food production and export. HACCP certification is required by most EU and USA food-grade importers and is a standard requirement on ThinkSpices™ verified exporter listings.",
    related: ["ISO 22000", "FDA", "HALAL"]
  },
  {
    term: "GI (Geographical Indication)",
    category: "Certifications",
    definition: "A mark used on products that have a specific geographical origin and possess qualities or a reputation due to that origin. Example: 'GI Protected Banda Nutmeg' certifies that the nutmeg originates exclusively from the Banda Islands, Maluku — protecting its premium market position against cheaper substitutes.",
    related: ["Banda Nutmeg", "Origin Verification"]
  },
  {
    term: "Volatile Oil Content",
    category: "Botanical",
    definition: "The percentage of essential oils naturally occurring in a dried spice, typically expressed as % v/w (volume per weight). Higher volatile oil content generally indicates higher potency, aroma intensity, and market value. For Banda Nutmeg, premium grade requires minimum 8–10% volatile oil. For Korintje Cinnamon, the standard is minimum 1% volatile oil (cinnamaldehyde-rich).",
    related: ["Myristicin", "Cinnamaldehyde", "SNI"]
  },
  {
    term: "Myristicin",
    category: "Botanical",
    definition: "The primary active chemical compound in nutmeg (Myristica fragrans), responsible for its characteristic warm, spicy aroma. Also has pharmaceutical applications. Banda Nutmeg typically carries Myristicin ≥ 10%, while Papua Nutmeg (Myristica argentea) carries lower Myristicin but higher Safrole content.",
    related: ["Volatile Oil", "Banda Nutmeg", "Papua Nutmeg"]
  },
  {
    term: "Safrole",
    category: "Botanical",
    definition: "A natural organic compound found in Papua Nutmeg (Myristica argentea) and certain cinnamon varieties. While valued in industrial fragrance applications, Safrole content is regulated in food-grade exports to EU and USA markets. Buyers must verify Safrole limits comply with destination country regulations.",
    related: ["Papua Nutmeg", "Volatile Oil", "EU Compliance"]
  },
  {
    term: "Korintje",
    category: "Botanical",
    definition: "The internationally recognized trade name for Indonesian Cassia Cinnamon (Cinnamomum burmannii) sourced from the highlands of West Sumatra. Korintje is the dominant cinnamon variety exported from Indonesia and is the standard 'cinnamon' sold in US and European retail markets. Distinguished by its thick, rough bark quills and robust, sweet cinnamon flavor. Do not confuse with Ceylon Cinnamon (Sri Lanka) or Vietnamese Cassia.",
    related: ["Cassia", "Cinnamaldehyde", "Padang"]
  },
  {
    term: "Tanjung Perak Port",
    category: "Port & Logistics",
    definition: "Indonesia's second largest seaport, located in Surabaya, East Java. Major export hub for East Java spice production including Java pepper, cloves from Maluku, and processed nutmeg. Container berths handle FCL (Full Container Load) and LCL (Less Container Load) dry cargo. IATA/Port code: IDTPK.",
    related: ["FOB", "FCL", "Container Booking"]
  },
  {
    term: "Belawan Port",
    category: "Port & Logistics",
    definition: "Primary export port for Sumatran commodities, located near Medan, North Sumatra. Key export point for Sumatran pepper, cinnamon (Korintje), and ginger. Managed by Pelindo I. Port code: IDBWN.",
    related: ["FOB", "Korintje Cinnamon", "Sumatra"]
  },
  {
    term: "Ambon Port",
    category: "Port & Logistics",
    definition: "The main port of Ambon Island, Maluku province. Primary loading port for Banda Nutmeg, Maluku Cloves, and Banda Mace. Smaller container capacity — most large-volume shipments trans-ship via Surabaya (Tanjung Perak). Port code: IDAMQ.",
    related: ["Banda Nutmeg", "Banda Islands", "FOB"]
  },
  {
    term: "Tanjung Priok Port",
    category: "Port & Logistics",
    definition: "Indonesia's largest and busiest container port, located in Jakarta, West Java. Handles the majority of Indonesian non-oil export volume. Primary gateway for Java-based spice aggregators and re-exporters. Port code: IDJKT.",
    related: ["FOB", "InTradeX™", "Container Booking"]
  },
  {
    term: "Bill of Lading (B/L)",
    category: "Port & Logistics",
    definition: "A legal document issued by a shipping carrier to a shipper as a contract of carriage. The B/L serves as evidence of title to the goods and is required for customs clearance at the destination port. In ThinkSpices™ trade architecture, B/L generation and management is exclusively handled by InTradeX™ after RFQ handoff.",
    related: ["InTradeX™", "FOB", "Customs Clearance"]
  },
  {
    term: "Escrow (Trade Escrow)",
    category: "Trade Terms",
    definition: "A financial arrangement where a third party holds and regulates payment of funds required for two parties in a transaction. In ThinkSpices™ trade framework, escrow protects both buyer and seller — payment is released only upon verified delivery and quality confirmation at the destination port.",
    related: ["RFQ", "InTradeX™", "FOB"]
  },
  {
    term: "Form A / Form D (Certificate of Origin)",
    category: "Trade Terms",
    definition: "Indonesian Certificate of Origin documents used to claim preferential tariff rates. Form A is used under the Generalized System of Preferences (GSP) for exports to USA, EU, Japan. Form D is used under ASEAN Free Trade Area (AFTA) agreements. Buyers can request these from verified exporters to reduce import duty at destination.",
    related: ["Preferential Tariff", "GSP", "Exporter"]
  }
];

const CATEGORIES = ["All", "Trade Terms", "Port & Logistics", "Certifications", "Regulatory", "Botanical"];

export const TradeGlossary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case "Trade Terms":
        return "text-[#c8922a] bg-[#c8922a]/10 border-[#c8922a]/20";
      case "Port & Logistics":
        return "text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20";
      case "Certifications":
        return "text-[#27ae60] bg-[#27ae60]/10 border-[#27ae60]/20";
      case "Regulatory":
        return "text-[#f39c12] bg-[#f39c12]/10 border-[#f39c12]/20";
      case "Botanical":
        return "text-[#1abc9c] bg-[#1abc9c]/10 border-[#1abc9c]/20";
      default:
        return "text-text-secondary bg-bg-tertiary border-border-default";
    }
  };

  const filteredEntries = GLOSSARY_ENTRIES.filter(e => {
    const matchesSearch = 
      e.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header element */}
      <div className="pb-5 border-b border-border-default">
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent-gold font-bold block mb-1">
          ● TRADE INTELLIGENCE REFERENCE
        </span>
        <h2 className="font-display font-bold text-2xl text-text-primary uppercase tracking-tight">
          GLOSSARY &amp; FIELD DEFINITIONS
        </h2>
        <p className="text-xs text-text-secondary font-sans mt-1">
          Indonesian Spice Trade — Standard Terms, Port Codes, and Regulatory Bodies
        </p>
      </div>

      {/* Control Panel: Search & Filters */}
      <div className="bg-bg-secondary border border-border-default rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-text-muted" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 bg-bg-primary border border-border-default rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:border-accent-gold outline-none transition-colors"
            placeholder="Search terms, port names, certifications, regulatory bodies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-accent-gold text-white font-bold shadow-sm"
                  : "bg-bg-primary text-text-secondary border border-border-default hover:text-text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of entries */}
      {filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((e) => {
            const isExpanded = expandedTerm === e.term;

            return (
              <div 
                key={e.term}
                className="bg-bg-secondary border border-border-default rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-xs hover:border-accent-gold/40 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <h4 className="font-mono font-bold text-xs text-accent-gold uppercase tracking-wider select-all">
                      {e.term}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-mono uppercase font-semibold border ${getCategoryTheme(e.category)}`}>
                      {e.category}
                    </span>
                  </div>
                  
                  <p className="font-sans text-[11.5px] text-text-secondary leading-relaxed">
                    {e.definition}
                  </p>
                </div>

                {e.related && e.related.length > 0 && (
                  <div className="border-t border-border-default/40 pt-2.5 flex flex-wrap items-center gap-1.5 text-[9px] font-mono text-text-muted">
                    <span className="uppercase">Related:</span>
                    {e.related.map(r => (
                      <span key={r} className="px-1.5 py-0.5 bg-bg-primary border border-border-default rounded text-[8.5px]">
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-border-default rounded-xl bg-bg-secondary/40 font-mono text-xs text-text-muted space-y-2">
          <HelpCircle className="h-8 w-8 mx-auto text-text-muted/60" />
          <p>No glossary match found for your inquiry.</p>
        </div>
      )}

    </div>
  );
};
