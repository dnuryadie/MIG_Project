export interface Variety {
  id: string;
  name: string;
  botanicalName: string;
  badge: string;
  origin: string;
  description: string;
  bestApplications: string[];
  minMOQ: number; // in Metric Tons (MT)
  moistureLimit: string;
  volatileOil: string;
  activeMarker: string;
  aromaticProfile: string;
  sniCode: string;
  certifications: string[];
}

export interface Commodity {
  id: string;
  name: string;
  family: string;
  avgFobBenchmark: number; // USD per MT
  varietiesCount: number;
  colorCode: string; // for card left border
  varieties: Variety[];
  fobPriceHistory: { month: string; price: number }[]; // in USD/kg (approx avgFobBenchmark / 1000)
  supplyIndex: number; // 0-100
  supplyStatus: 'HIGH RESERVE' | 'MED RESERVE' | 'LOW RESERVE' | 'CRITICAL';
  logisticsLiquidity: string;
  advisoryText: string;
}

export type { SupplierProfile as Exporter } from '@workspace/supplier-catalog';

export const COMMODITIES: Commodity[] = [
  {
    id: "nutmeg",
    name: "NUTMEG",
    family: "Myristicaceae family",
    avgFobBenchmark: 9200,
    varietiesCount: 2,
    colorCode: "#C8922A",
    varieties: [
      {
        id: "banda-nutmeg",
        name: "BANDA NUTMEG",
        botanicalName: "Myristica fragrans",
        badge: "BANDA ISLANDS",
        origin: "Banda Neira, Maluku",
        description: "Harvested from volcanic soils of the historic Banda archipelago. Renowned for rich essential oil concentrations and delicate spice profile.",
        bestApplications: ["Food Industry", "Essential Oils", "Bakery"],
        minMOQ: 1,
        moistureLimit: "≤ 10%",
        volatileOil: "≥ 12.0% (Extra pure)",
        activeMarker: "Myristicin: Min 10%",
        aromaticProfile: "Sweet-aromatic, intensely warm, woody tail notes with trace tropical floral hints.",
        sniCode: "SNI 01-0006 (Banda)",
        certifications: ["FDA Registered", "Halal", "HACCP", "EU Organic", "GI Protected Banda Nutmeg"]
      },
      {
        id: "papua-nutmeg",
        name: "PAPUA NUTMEG",
        botanicalName: "Myristica argentea",
        badge: "FAKFAK",
        origin: "Fakfak, West Papua",
        description: "Wild harvested forest nutmeg matching dense industrial specifications. Exceptionally resilient to long-haul shipping storage.",
        bestApplications: ["Pharmaceutical", "Industrial Fragrance", "Spice Blend Extraction"],
        minMOQ: 3,
        moistureLimit: "≤ 12%",
        volatileOil: "≥ 7.0% (Lower Myristicin, rich Safrole)",
        activeMarker: "Myristicin: Min 6%",
        aromaticProfile: "Distinctly woody, heavy forest pine aroma, robust herbal spiciness with smooth smoky tail notes.",
        sniCode: "SNI 01-0006 (Fakfak)",
        certifications: ["FDA Registered", "Halal", "HACCP", "Rainforest Alliance"]
      }
    ],
    fobPriceHistory: [
      { month: "Jan", price: 8.9 },
      { month: "Feb", price: 9.0 },
      { month: "Mar", price: 9.1 },
      { month: "Apr", price: 9.3 },
      { month: "May", price: 9.2 },
      { month: "Jun", price: 9.2 }
    ],
    supplyIndex: 84,
    supplyStatus: "HIGH RESERVE",
    logisticsLiquidity: "HIGH STENCIL ACTIVE",
    advisoryText: "Abundant raw material reserves currently on shore. Ideal spot contract locks available below quarterly averages."
  },
  {
    id: "cinnamon",
    name: "CINNAMON",
    family: "Lauraceae family",
    avgFobBenchmark: 5120,
    varietiesCount: 2,
    colorCode: "#8B4513",
    varieties: [
      {
        id: "korintje-cinnamon",
        name: "KORINTJE CINNAMON",
        botanicalName: "Cinnamomum burmannii",
        badge: "KORINTJE HIGHLAND",
        origin: "Korintje Highland, West Sumatra",
        description: "Grown at high altitudes around the Gayo and Korintje volcanic mountains. Standardized with low coumarin ratios relative to cassia imports.",
        bestApplications: ["Food & Baking", "Nutraceutical", "Extracts"],
        minMOQ: 2,
        moistureLimit: "≤ 14%",
        volatileOil: "≥ 2.5% (High cinnamaldehyde)",
        activeMarker: "Cinnamaldehyde: Min 60%",
        aromaticProfile: "Highly sweet, sharp traditional cinnamon aroma, warm sweet tail, zero astringency.",
        sniCode: "SNI 01-0005 (Korintje)",
        certifications: ["FDA Registered", "Halal", "HACCP", "USDA Organic", "Rainforest Alliance"]
      },
      {
        id: "padang-cinnamon",
        name: "PADANG CASSIA",
        botanicalName: "Cinnamomum cassia",
        badge: "PADANG WEST",
        origin: "Padang, West Sumatra",
        description: "Classic Indonesian Cassia Vera quills. Perfect for bulk grindings, sticks split-sorting, and high yield botanical extractions.",
        bestApplications: ["Beverage Blends", "Industrial Ground Baking", "Distillery"],
        minMOQ: 1.5,
        moistureLimit: "≤ 14.5%",
        volatileOil: "≥ 1.8% (Warm spice yielding)",
        activeMarker: "Cinnamaldehyde: Min 50%",
        aromaticProfile: "Strongly pungent, sharp earthy cinnamon bark flavor, heavy dry heat finish.",
        sniCode: "SNI 01-0005 (Padang)",
        certifications: ["FDA Registered", "Halal", "HACCP", "KOSHER"]
      }
    ],
    fobPriceHistory: [
      { month: "Jan", price: 4.8 },
      { month: "Feb", price: 4.9 },
      { month: "Mar", price: 5.0 },
      { month: "Apr", price: 5.1 },
      { month: "May", price: 5.1 },
      { month: "Jun", price: 5.2 }
    ],
    supplyIndex: 78,
    supplyStatus: "HIGH RESERVE",
    logisticsLiquidity: "STANDARD PORT CAPACITY",
    advisoryText: "High altitude harvest cycles are peak. Logistics pipelines are highly fluid, optimal spot prices available."
  },
  {
    id: "pepper",
    name: "PEPPER",
    family: "Piperaceae family",
    avgFobBenchmark: 6540,
    varietiesCount: 2,
    colorCode: "#2C2C2C",
    varieties: [
      {
        id: "lampung-black",
        name: "LAMPUNG BLACK PEPPER",
        botanicalName: "Piper nigrum",
        badge: "LAMPUNG SOUTHEAST",
        origin: "Lampung, Sumatra",
        description: "World-class black peppercorns holding high density parameters and pungent piperine concentrations optimized for culinary extraction.",
        bestApplications: ["Food Processing", "Meat Packing", "Culinary Spices"],
        minMOQ: 5,
        moistureLimit: "≤ 12%",
        volatileOil: "≥ 2.0% Volatile (Pungent core)",
        activeMarker: "Piperine: Min 4.5%",
        aromaticProfile: "Earthy, intense, sharp heat bite, rich tobacco undertones, extreme spicy length.",
        sniCode: "SNI 01-0004 (Lampung)",
        certifications: ["FDA Registered", "Halal", "HACCP", "USDA Organic", "ISO 22000"]
      },
      {
        id: "bangka-white",
        name: "BANGKA WHITE PEPPER",
        botanicalName: "Piper nigrum",
        badge: "MUNTOK ISLANDS",
        origin: "Bangka Belitung, Sumatra",
        description: "Bangka 'Muntok White' is internationally prized. Decorticated through clean mountain pipelines, yielding highly clean light profile and extreme pip-heat.",
        bestApplications: ["Premium White Sauces", "Flavor & Fragrance", "Gourmet Wholesale"],
        minMOQ: 2,
        moistureLimit: "≤ 11.5%",
        volatileOil: "≥ 1.5% Volatile (Clean heat)",
        activeMarker: "Piperine: Min 5.0%",
        aromaticProfile: "Clean, extremely bright pungent heat, white cedar accents, mineral-clean tail.",
        sniCode: "SNI 01-0004 (Muntok)",
        certifications: ["FDA Registered", "Halal", "HACCP", "EU Organic", "KOSHER"]
      }
    ],
    fobPriceHistory: [
      { month: "Jan", price: 6.2 },
      { month: "Feb", price: 6.3 },
      { month: "Mar", price: 6.4 },
      { month: "Apr", price: 6.6 },
      { month: "May", price: 6.5 },
      { month: "Jun", price: 6.5 }
    ],
    supplyIndex: 45,
    supplyStatus: "LOW RESERVE",
    logisticsLiquidity: "CONGESTED REGIONAL COOP HUB",
    advisoryText: "Pepper yields have faced unseasonable monsoons. Supply holds lower volumes, securing 6-month buffer contracts highly recommended."
  },
  {
    id: "clove",
    name: "CLOVE",
    family: "Myrtaceae family",
    avgFobBenchmark: 7800,
    varietiesCount: 2,
    colorCode: "#722F37",
    varieties: [
      {
        id: "sulawesi-clove",
        name: "SULAWESI CLOVE",
        botanicalName: "Syzygium aromaticum",
        badge: "MINAHASA CHANNELS",
        origin: "Manado, North Sulawesi",
        description: "Lalangkang mountain clove dried to deep-red perfection. High volatile oil parameters with extensive eugenol markers suitable for pharmaceutical uses.",
        bestApplications: ["Flavorings", "Essential Oils", "Kretek Processing"],
        minMOQ: 2,
        moistureLimit: "≤ 11.5%",
        volatileOil: "≥ 18.0% (Extreme Eugenol concentration)",
        activeMarker: "Eugenol: Min 72%",
        aromaticProfile: "Medicinal sweet, warm peppery heat, lingering cooling eucalyptus & deep wintergreen accents.",
        sniCode: "SNI 01-3392 (Clove)",
        certifications: ["FDA Registered", "Halal", "HACCP", "Fairtrade International", "ISO 22000"]
      },
      {
        id: "zanzibar-clove",
        name: "ZANZIBAR TYPE CLOVE",
        botanicalName: "Syzygium aromaticum",
        badge: "AMBON ARCHIPELAGO",
        origin: "Ambon, Maluku",
        description: "The classic spice island variety with high oil content, whole clean cloves with heads intact. Prized for luxury spice exports and high-end blends.",
        bestApplications: ["Luxury Food Brands", "Industrial Distillations", "Cosmetics"],
        minMOQ: 1,
        moistureLimit: "≤ 12%",
        volatileOil: "≥ 15.5% (High aromatic density)",
        activeMarker: "Eugenol: Min 68%",
        aromaticProfile: "Richly aromatic, strong clove spice, heavy dark chocolate and smoke honey notes.",
        sniCode: "SNI 01-3392 (Zanzibar)",
        certifications: ["FDA Registered", "Halal", "HACCP", "GI Protected", "USDA Organic"]
      }
    ],
    fobPriceHistory: [
      { month: "Jan", price: 7.5 },
      { month: "Feb", price: 7.7 },
      { month: "Mar", price: 7.8 },
      { month: "Apr", price: 7.9 },
      { month: "May", price: 7.8 },
      { month: "Jun", price: 7.8 }
    ],
    supplyIndex: 65,
    supplyStatus: "MED RESERVE",
    logisticsLiquidity: "STANDARD LIQUID FLOWS",
    advisoryText: "Medium supply indicators. Stabilizing sea shipment delays across Makassar routes before peak export periods is advised."
  },
  {
    id: "vanilla",
    name: "VANILLA",
    family: "Orchidaceae family",
    avgFobBenchmark: 195000,
    varietiesCount: 2,
    colorCode: "#D4A017",
    varieties: [
      {
        id: "java-vanilla",
        name: "JAVA VANILLA",
        botanicalName: "Vanilla planifolia",
        badge: "WEST JAVA HIGHLANDS",
        origin: "Garut, West Java",
        description: "Plump, oily Gourmet Grade-A pods cured using proprietary multi-step shade drying. Yields intense sweet, creamy vanillin profiles.",
        bestApplications: ["High-End Confectionery", "Luxury Extracting", "Fragrance"],
        minMOQ: 0.1,
        moistureLimit: "≤ 24%",
        volatileOil: "≥ 1.8% Pure Vanillin Crystals",
        activeMarker: "Vanillin: Min 2.1%",
        aromaticProfile: "Heavy buttery cream, rich cocoa, hints of pipe tobacco and deep dark molasses.",
        sniCode: "SNI 01-3180 (Vanilla)",
        certifications: ["FDA Registered", "Halal", "HACCP", "USDA Organic", "EU Organic", "Fairtrade"]
      },
      {
        id: "bali-vanilla",
        name: "BALI VANILLA",
        botanicalName: "Vanilla tahitensis",
        badge: "KINTAMANI HIGHLANDS",
        origin: "Kintamani, Bali",
        description: "Grown under organic shading next to Balinese coffee fields. Lighter, exquisite tahitensis variety characterized by floral anise notes.",
        bestApplications: ["Artisanal Cosmetics", "Fine Baking", "Cocktail Mixology"],
        minMOQ: 0.05,
        moistureLimit: "≤ 26%",
        volatileOil: "≥ 1.2% Floral Linalool / Helenin",
        activeMarker: "Vanillin: Min 1.5%",
        aromaticProfile: "Intensely floral, cherry-anise woods, sweet marshmallow, subtle stone fruits.",
        sniCode: "SNI 01-3180 (Bali)",
        certifications: ["FDA Registered", "Halal", "HACCP", "USDA Organic", "GI Protected Kintamani"]
      }
    ],
    fobPriceHistory: [
      { month: "Jan", price: 185 },
      { month: "Feb", price: 190 },
      { month: "Mar", price: 192 },
      { month: "Apr", price: 195 },
      { month: "May", price: 195 },
      { month: "Jun", price: 198 }
    ],
    supplyIndex: 35,
    supplyStatus: "LOW RESERVE",
    logisticsLiquidity: "EXPRESS LOGISTICS REQUIRED",
    advisoryText: "Vanilla is under high storage security. Supply indices are low due to heavy global corporate buyer pre-purchasing. Booking escrows early is required."
  },
  {
    id: "ginger",
    name: "GINGER",
    family: "Zingiberaceae family",
    avgFobBenchmark: 3400,
    varietiesCount: 2,
    colorCode: "#E67E22",
    varieties: [
      {
        id: "emprit-ginger",
        name: "EMPRIT GINGER (SMALL-WHITE)",
        botanicalName: "Zingiber officinale var. amarum",
        badge: "JAVA VALLEY",
        origin: "Boyolali, Central Java",
        description: "Small white ginger with high natural gingerol content. Specifically desired for biological supplement extraction and traditional herbal medicine/jamu.",
        bestApplications: ["Herbal Extracts", "Medicinal Tea", "Pharmaceutics"],
        minMOQ: 1,
        moistureLimit: "≤ 10%",
        volatileOil: "≥ 2.5% gingerol / shogaol oil",
        activeMarker: "Gingerol: Min 3.5%",
        aromaticProfile: "Extremely sharp, fiery heat bite, spicy peppery top notes, woody medicinal finish.",
        sniCode: "SNI 01-1310 (Ginger)",
        certifications: ["FDA Registered", "Halal", "HACCP", "USDA Organic", "ISO 22000"]
      },
      {
        id: "gajah-ginger",
        name: "GAJAH GINGER (BIG)",
        botanicalName: "Zingiber officinale var. officinale",
        badge: "HIGHLAND FARMS",
        origin: "Sukabumi, West Java",
        description: "Juicy, large rhizomes with mild fiber and thick skins. Perfect for bulk culinary grinding, preserving, pickling, and beverage syrup industry.",
        bestApplications: ["Food Processing", "Ginger Beverage Industry", "Confectionery"],
        minMOQ: 3,
        moistureLimit: "≤ 10%",
        volatileOil: "≥ 1.5% volatile compounds",
        activeMarker: "Gingerol: Min 1.5%",
        aromaticProfile: "Mildly spicy, pleasantly citrus sweet, subtle earthy base, clean refreshing bite.",
        sniCode: "SNI 01-1310 (Gajah)",
        certifications: ["FDA Registered", "Halal", "HACCP", "Rainforest Alliance"]
      }
    ],
    fobPriceHistory: [
      { month: "Jan", price: 3.1 },
      { month: "Feb", price: 3.2 },
      { month: "Mar", price: 3.3 },
      { month: "Apr", price: 3.4 },
      { month: "May", price: 3.4 },
      { month: "Jun", price: 3.5 }
    ],
    supplyIndex: 88,
    supplyStatus: "HIGH RESERVE",
    logisticsLiquidity: "HIGH PIPELINE FLUIDITY",
    advisoryText: "Bumper crop in Central Java. Exporters are holding ample supply. Bargaining power rests with buying agents."
  },
  {
    id: "turmeric",
    name: "TURMERIC",
    family: "Zingiberaceae / Curcuma",
    avgFobBenchmark: 2800,
    varietiesCount: 2,
    colorCode: "#F1C40F",
    varieties: [
      {
        id: "ponorogo-turmeric",
        name: "PONOROGO TURMERIC",
        botanicalName: "Curcuma longa",
        badge: "EAST JAVA VALLEY",
        origin: "Ponorogo, East Java",
        description: "Highly pigmented orange turmeric with exceptional curcuminoids. Primarily routed to natural food dye mills and pharmaceutical extraction lines.",
        bestApplications: ["Dye Mills", "Pharmaceuticals", "Organic Supplements"],
        minMOQ: 2,
        moistureLimit: "≤ 10%",
        volatileOil: "≥ 5.5% pure Curcumin content",
        activeMarker: "Curcumin: Min 6.0%",
        aromaticProfile: "Earthy, robust musk, warm spice with heavy ginger-curry undertones.",
        sniCode: "SNI 01-2895 (Turmeric)",
        certifications: ["FDA Registered", "Halal", "HACCP", "USDA Organic", "EU Organic"]
      },
      {
        id: "banyuwangi-turmeric",
        name: "BANYUWANGI TURMERIC",
        botanicalName: "Curcuma longa",
        badge: "BANYUWANGI COAST",
        origin: "Banyuwangi, East Java",
        description: "Sun-dried sliced roots holding balanced density and trace chemical purity. Highly suitable for bulk curry powder blend manufacturers.",
        bestApplications: ["Spice Manufacturing", "Food Seasonings", "Feed Additives"],
        minMOQ: 1.5,
        moistureLimit: "≤ 10.5%",
        volatileOil: "≥ 3.8% Curcumin content",
        activeMarker: "Curcumin: Min 4.0%",
        aromaticProfile: "Mellow earthy tone, subtle mustard oil warmth, sweet woody finish.",
        sniCode: "SNI 01-2895 (Banyuwangi)",
        certifications: ["FDA Registered", "Halal", "HACCP", "ISO 22000"]
      }
    ],
    fobPriceHistory: [
      { month: "Jan", price: 2.6 },
      { month: "Feb", price: 2.7 },
      { month: "Mar", price: 2.8 },
      { month: "Apr", price: 2.8 },
      { month: "May", price: 2.9 },
      { month: "Jun", price: 2.9 }
    ],
    supplyIndex: 91,
    supplyStatus: "HIGH RESERVE",
    logisticsLiquidity: "PEAK EXPORT CHANNEL SPEED",
    advisoryText: "Turmeric reserves are abundant across the entire archipelago. Sea logistical terminals at Surabaya port are running with record export clearances."
  },
  {
    id: "cardamom",
    name: "CARDAMOM",
    family: "Zingiberaceae / Elettaria",
    avgFobBenchmark: 22000,
    varietiesCount: 2,
    colorCode: "#27AE60",
    varieties: [
      {
        id: "javanese-cardamom",
        name: "SULAWESI JAVANESE CARDAMOM",
        botanicalName: "Amomum compactum",
        badge: "SULAWESI TRIBUTARY",
        origin: "Toraja, South Sulawesi",
        description: "Indonesian white round cardamom. Grown in mountainous highland coops next to rainforest canopies, ideal for herbal medicine extraction.",
        bestApplications: ["Herbal Medicine", "Aromatherapy", "Flavors"],
        minMOQ: 1,
        moistureLimit: "≤ 12%",
        volatileOil: "≥ 4.0% Volatile (Rich cineole)",
        activeMarker: "Cineole: Min 50%",
        aromaticProfile: "Highly camphoraceous, intense cooling menthol spice, citrus hints, dry sweet pine.",
        sniCode: "SNI 01-3181 (Cardamom)",
        certifications: ["FDA Registered", "Halal", "HACCP", "GI Protected", "Fairtrade"]
      },
      {
        id: "sumatra-cardamom",
        name: "SUMATRA CARDAMOM",
        botanicalName: "Elettaria cardamomum",
        badge: "PADANG HIGHLANDS",
        origin: "Korintje Valley, Sumatra",
        description: "Indonesian green pod cardamom holding high oil densities. Exquisite, clean, sun-dried pods carefully sized and hand-sorted for direct export.",
        bestApplications: ["Premium Confectionery", "Middle East Food Export", "Distilleries"],
        minMOQ: 0.5,
        moistureLimit: "≤ 11.5%",
        volatileOil: "≥ 4.5% Aromatic Essential Oil",
        activeMarker: "Cineole: Min 45%",
        aromaticProfile: "Bright lemon-lime citrus, sweet ginger mint, floral incense finish.",
        sniCode: "SNI 01-3181 (Sumatra)",
        certifications: ["FDA Registered", "Halal", "HACCP", "USDA Organic", "KOSHER"]
      }
    ],
    fobPriceHistory: [
      { month: "Jan", price: 21.0 },
      { month: "Feb", price: 21.5 },
      { month: "Mar", price: 22.0 },
      { month: "Apr", price: 22.4 },
      { month: "May", price: 22.2 },
      { month: "Jun", price: 22.1 }
    ],
    supplyIndex: 52,
    supplyStatus: "MED RESERVE",
    logisticsLiquidity: "STANDARD TRUCKING ACTIVE",
    advisoryText: "White cardamom yields are constant, while green pods hold light stocks. Ensure certification checks are clear in Sumatran depots before maritime dispatch."
  },
  {
    id: "galangal",
    name: "GALANGAL",
    family: "Zingiberaceae / Alpinia",
    avgFobBenchmark: 4100,
    varietiesCount: 2,
    colorCode: "#1ABC9C",
    varieties: [
      {
        id: "java-galangal",
        name: "JAVA GALANGAL",
        botanicalName: "Alpinia galanga",
        badge: "YOGYAKARTA COOPS",
        origin: "Sleman, Yogyakarta",
        description: "Clean sliced sun-dried galangal roots (Laos). Packed with active compound Galangin, a highly potent natural phyto-antioxidant.",
        bestApplications: ["Traditional Medicine / Jamu", "Supplements", "Asian Seasonings"],
        minMOQ: 1,
        moistureLimit: "≤ 11%",
        volatileOil: "≥ 1.5% Volatile Oil (Galangin rich)",
        activeMarker: "Galangin: Min 2.0%",
        aromaticProfile: "Sharp piney wood, heavy citrus, spicy peppery mustard accents, earthy sweet tail.",
        sniCode: "SNI 01-3182 (Galangal)",
        certifications: ["FDA Registered", "Halal", "HACCP", "USDA Organic", "EU Organic"]
      },
      {
        id: "sumatra-galangal",
        name: "SUMATRA GALANGAL",
        botanicalName: "Alpinia galanga",
        badge: "MEDAN INDUSTRIAL",
        origin: "Medan, North Sumatra",
        description: "Standard grade bulk dried sliced galangal. Highly valued by commercial extract processing factories and dry curry packaging ventures.",
        bestApplications: ["Commercial Extractive Mills", "Bulk Spices", "Prepared Pastes"],
        minMOQ: 2,
        moistureLimit: "≤ 11.5%",
        volatileOil: "≥ 1.0% Volatile Compounds",
        activeMarker: "Galangin: Min 1.2%",
        aromaticProfile: "Heavy earthy camphor, dry wood, sharp spicy herbal aroma.",
        sniCode: "SNI 01-3182 (Medan)",
        certifications: ["FDA Registered", "Halal", "HACCP", "ISO 22000"]
      }
    ],
    fobPriceHistory: [
      { month: "Jan", price: 3.9 },
      { month: "Feb", price: 4.0 },
      { month: "Mar", price: 4.1 },
      { month: "Apr", price: 4.2 },
      { month: "May", price: 4.1 },
      { month: "Jun", price: 4.1 }
    ],
    supplyIndex: 82,
    supplyStatus: "HIGH RESERVE",
    logisticsLiquidity: "FLUID SEA FREIGHT JUNCTION",
    advisoryText: "Sufficient inventory held across regional East Java and North Sumatran warehouses. Lead times are highly reliable."
  }
];

export { SUPPLIER_CATALOG as EXPORTERS } from '@workspace/supplier-catalog';

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Harvesting calendar codes:
// P: Peak Harvest (🟢)
// M: Mid Harvest (🟡)
// O: Off Season (⬜)
// R: Restricted / Low Yield (🔴)
export const HARVEST_CALENDAR: Record<string, string[]> = {
  "nutmeg": ["M", "M", "P", "P", "P", "M", "M", "M", "P", "P", "M", "O"],
  "cinnamon": ["P", "P", "P", "M", "M", "M", "P", "P", "P", "M", "M", "O"],
  "pepper": ["O", "O", "O", "M", "M", "P", "P", "P", "M", "M", "O", "O"],
  "clove": ["O", "O", "O", "O", "M", "M", "P", "P", "M", "M", "O", "O"],
  "vanilla": ["O", "O", "O", "M", "P", "P", "P", "M", "M", "O", "O", "O"],
  "ginger": ["P", "P", "M", "M", "O", "O", "O", "M", "P", "P", "P", "M"],
  "turmeric": ["O", "O", "M", "M", "P", "P", "P", "P", "M", "M", "O", "O"],
  "cardamom": ["M", "M", "P", "P", "M", "M", "M", "M", "P", "P", "M", "M"],
  "galangal": ["P", "P", "P", "M", "M", "O", "O", "O", "M", "P", "P", "P"]
};

export const FX_RATES = {
  usd_idr: 16384.50,
  eur_idr: 17542.20,
  sgd_idr: 12088.40,
  lastUpdated: "2026-06-14T16:29:17-07:00"
};
