export interface SpiceProfileDetail {
  hsCode: string;
  origin: string;
  producingRegions: string[];
  grades: { name: string; specs: string[] }[];
  packaging: string[];
  loadingDensity: string;
  requirements: string[];
}

export interface RegulatoryStandardDetail {
  authority: string;
  description: string;
  requirements: string[];
  buyerQuestions: string[];
}

export const SPICE_PROFILES: Record<string, SpiceProfileDetail> = {
  "Cinnamon/Cassia": {
    hsCode: "0906.11 (Whole) / 0906.20 (Powder)",
    origin: "Kerinci (Jambi) & West Sumatra, Indonesia",
    producingRegions: ["Kerinci", "West Sumatra", "Java"],
    grades: [
      { name: "Vera AA (Premium)", specs: ["Moisture: Max 13.5%", "Volatile Oil: Min 2.5%", "Perfect quills"] },
      { name: "Vera A", specs: ["Moisture: Max 14.0%", "Good quills"] },
      { name: "KB / KA (Broken)", specs: ["Moisture: Max 14.0%", "Foreign Matter: Max 1.0%"] }
    ],
    packaging: ["Carton Box 20-25 Kg (Premium Quills)", "PP Woven Bag 25-50 Kg (Broken)"],
    loadingDensity: "10-12 MT per 20ft GP / 22-24 MT per 40ft GP",
    requirements: [
      "Phytosanitary Certificate issued by Barantin (Agricultural Quarantine)",
      "Coumarin Warning: Cassia naturally contains high coumarin. Verify limits for direct consumption in the EU.",
      "MRL (Maximum Residue Levels) for pesticides compliance."
    ]
  },
  "Clove": {
    hsCode: "0907.10 (Whole) / 0907.20 (Powder)",
    origin: "North Maluku, North Sulawesi, East Java, Sumatra",
    producingRegions: ["Maluku Islands", "North Sulawesi", "Java", "Sumatra"],
    grades: [
      { name: "Lal Pari (Hand-Picked Premium)", specs: ["Moisture: 11% - 12.5%", "Foreign Matter: Max 0.5%", "Headless/Khoker: Max 1% - 2%"] },
      { name: "Grade CG1 (Commercial)", specs: ["Moisture: Max 12.5%", "Foreign Matter: Max 1.0%", "Khoker: Max 5.0%"] },
      { name: "Clove Stems FAQ", specs: ["Moisture: Max 14.0%", "Foreign Matter: Max 2.0%", "Mainly used for Essential Oil/Eugenol distillation"] }
    ],
    packaging: ["PP Woven Bag 25-50 Kg", "Double-layered Gunny Bag 50 Kg"],
    loadingDensity: "10-12 MT per 20ft GP / 22-24 MT per 40ft GP",
    requirements: [
      "Aflatoxin levels check (must fall below EU limits of 5 μg/kg B1, 10 μg/kg total)",
      "Must be free of scale, weeds, or active insect infestations"
    ]
  },
  "Nutmeg & Mace": {
    hsCode: "0908.11 (Whole Nutmeg) / 0908.21 (Mace)",
    origin: "Banda Islands (Maluku), North Sulawesi (Siau), Aceh, Papua",
    producingRegions: ["Banda Islands", "Siau Island", "Aceh", "Papua"],
    grades: [
      { name: "ABCD (Premium Whole)", specs: ["Moisture: Max 10% - 12%", "Mouldy: Max 5%", "Insect damage: Max 5%"] },
      { name: "Shriveled (Keriput/FAQ)", specs: ["Shrunken kernels", "Ideal for powder grinding"] },
      { name: "BWP (Broken, Wormy, Punky)", specs: ["Distillation grade", "Used exclusively for essential oil extraction"] },
      { name: "Mace (Fuli - Whole/Broken)", specs: ["Moisture: Max 10%", "Volatile oil: Min 7%"] }
    ],
    packaging: ["PP Woven Bag 25-50 Kg (Nutmeg)", "Double-layer gunny 50 Kg", "Carton Box with PE Liners 10-25 Kg (Mace)"],
    loadingDensity: "Nutmeg: 10-12 MT (20ft) / Mace: 8-10 MT (20ft)",
    requirements: [
      "AFLATOXIN TESTING COMPULSORY: Extremely high-risk commodity. EU/Japan ports scan every shipment.",
      "Steam Sterilization is highly recommended over ETO (Prohibited in EU)."
    ]
  },
  "Black & White Pepper": {
    hsCode: "0904.11 (Black) / 0904.12 (White)",
    origin: "Lampung (Black) & Bangka Belitung (White/Muntok)",
    producingRegions: ["Lampung", "Bangka Belitung", "West Kalimantan"],
    grades: [
      { name: "Lampung Black Pepper FAQ", specs: ["Moisture: Max 13%", "Foreign Matter: Max 1.0%", "Light Berries: Max 8.0%", "Density: Min 500-550 g/L"] },
      { name: "Muntok White Pepper FAQ", specs: ["Moisture: Max 13.5%", "Foreign Matter: Max 1.0%", "Light Berries: Max 2.0%", "Density: Min 550-600 g/L"] },
      { name: "ASTA Premium Grade", specs: ["Foreign Matter: Max 0.5%", "Super-cleaned and processed", "Low bio-count (microbiological)"] }
    ],
    packaging: ["PP Woven Bag 25-50 Kg", "Multi-wall Kraft Paper Bag 25 Kg"],
    loadingDensity: "13-15 MT per 20ft GP / 25-27 MT per 40ft GP",
    requirements: [
      "Salmonella Inspection: Essential for US and EU markets.",
      "Fumigation: Often required to meet biosecurity standards."
    ]
  },
  "Patchouli Oil": {
    hsCode: "3301.29 (Essential Oils)",
    origin: "Aceh, North Sumatra, Central/South Sulawesi, West Java",
    producingRegions: ["Aceh", "North Sumatra", "Sulawesi", "West Java"],
    grades: [
      { name: "Premium Export (High PA)", specs: ["Patchouli Alcohol (PA): Min 30% - 35%", "Specific Gravity: 0.950 - 0.975", "Acid Value: Max 5.0", "Iron (Fe): Max 25 ppm"] },
      { name: "Standard Grade (Industrial)", specs: ["Patchouli Alcohol: 28% - 30%", "Suitable for cosmetics and soaps"] }
    ],
    packaging: ["HDPE Drums 25-50 Kg", "Brand New Steel Drums 180 Kg"],
    loadingDensity: "14-16 MT per 20ft GP (Drum configured)",
    requirements: [
      "Certificate of Analysis (COA) containing gas chromatography-mass spectrometry (GC-MS) report.",
      "Safety Data Sheet (SDS) required for international freight forwarding."
    ]
  },
  "Vanilla Beans": {
    hsCode: "0905.10 (Vanilla Beans)",
    origin: "Java, Bali, Sulawesi, Papua, Indonesia",
    producingRegions: ["Bali", "Java", "Sulawesi", "Papua"],
    grades: [
      { name: "Gourmet Grade A (Black)", specs: ["Length: 15-20 cm", "Moisture: 25-30%", "Vanillin: 1.6% - 2.2%", "No splits, supple and plump"] },
      { name: "Extract Grade B", specs: ["Length: 12-15 cm", "Moisture: 18-23%", "Vanillin: Min 1.5%", "Ideal for cosmetics and industrial baking extracts"] }
    ],
    packaging: ["Vacuum-sealed PE Bags 1-5 Kg", "Export Cardboard Master Cases"],
    loadingDensity: "Shipped primarily via Air Freight due to lightweight, high-value ratio",
    requirements: [
      "Rigid moisture monitoring. Over-moisture causes mold, low-moisture reduces weight/premium pricing.",
      "Phytosanitary certification by Agricultural Quarantine."
    ]
  }
};

export const REGULATORY_STANDARDS: Record<string, RegulatoryStandardDetail> = {
  "European Union (EU)": {
    authority: "EFSA (European Food Safety Authority) & TRACES NT",
    description: "One of the largest, strict spice import markets globally. Mandatory TRACES NT registration.",
    requirements: [
      "Ethylene Oxide (EtO) ban: Absolute prohibition of EtO fumigation. Shipments are strictly turned away if residue is found. Alternatives: Steam Sterilization is standard.",
      "Aflatoxin limit: Maximum 5 μg/kg for Aflatoxin B1 and 10 μg/kg for total Aflatoxin (B1+B2+G1+G2) in Nutmeg, Pepper, and Cloves.",
      "Pesticide residues: Subject to strict EU MRL (Maximum Residue Levels) checks."
    ],
    buyerQuestions: [
      "Is the batch steam-sterilized?",
      "Was Ethylene Oxide (EtO) used?",
      "Can we get laboratory evidence of the Mycotoxin/Aflatoxin levels?",
      "Is your facility registered in TRACES NT?"
    ]
  },
  "United States (USA)": {
    authority: "FDA (Food and Drug Administration) & Customs and Border Protection (CBP)",
    description: "Enforced primarily under FSMA (Food Safety Modernization Act). Emphasizes proactive prevention.",
    requirements: [
      "FDA Facility Registration: The Indonesian processing facility/exporter warehouse MUST be registered with the FDA.",
      "FSMA & Hazard Analysis: Importers must maintain a Foreign Supplier Verification Program (FSVP). Exporters must provide preventative controls (Moisture limits, allergen isolation, pest maps).",
      "Microbiological screening: Rigorous check for Salmonella and E. coli."
    ],
    buyerQuestions: [
      "Is your facility FDA registered?",
      "Do you have a food safety program compliant with FSMA requirements?",
      "Can you provide a COA certifying Salmonella negative?",
      "What is the transit lead time?"
    ]
  },
  "Australia & New Zealand": {
    authority: "DAFF (Australia) & FSANZ (Food Standards Australia New Zealand)",
    description: "Maintains some of the strictest biosecurity quarantine regulations on earth through BICON.",
    requirements: [
      "BICON Database Compliance: Shipments of whole spices are subject to high biosecurity checks for bark fragments, soil, seeds, or active insect larvae.",
      "Mandatory Treatment: Raw whole spices require certified Methyl Bromide fumigation or approved Heat Treatment.",
      "Manufacturer Declarations: Detailed tracking of processing temperature and relative humidity."
    ],
    buyerQuestions: [
      "Is this catalog product BICON compliant?",
      "What certified treatment (Methyl Bromide or Heat) was applied?",
      "Can you provide a Manufacturer Declaration of non-contamination?",
      "What is the tested moisture content limit?"
    ]
  },
  "UAE & GCC (Middle East)": {
    authority: "MOCCAE (UAE Ministry of Climate Change/Environment) & Dubai Municipality",
    description: "Primary gateway for Middle East re-exports. Subject to Gulf Standardization Organization (GSO) rules.",
    requirements: [
      "Halal Certification: Mandatory for processed blends, spice powders with additives, and aromatic extracts. BPJPH/MUI recognized certification is preferred.",
      "Arabic Labeling: Customs require clear retail labels showing product name, net weights, manufacturer details, production + expiry dates, and origin in Arabic.",
      "Local Registration: Product entry must be registered in the e-Food portal of Dubai/Auh Municipalities."
    ],
    buyerQuestions: [
      "Is your product Halal certified by an BPJPH-approved authority?",
      "Can we request labels in Arabic?",
      "Is the item registered in the FIRS/E-Food portal?"
    ]
  }
};

export const STANDARD_DOCUMENTS = {
  "Proforma Invoice (PI)": "Inception document issued by seller outlining the product grade, quantity, estimated lead times, bank details, and pricing clause. Required for buyers to obtain import permits and open Letters of Credit (L/C).",
  "Commercial Invoice (CI)": "The binding accounting and financial claim containing transaction values, final packed volumes, payment terms, and shipper/buyer details used by customs to calculate import tariffs.",
  "Packing List (PL)": "Detailed physical inventory mapping weights, dimensions, package types (bags, drums, cartons), and shipping marks without pricing details. Used by shipping agents and customs inspectors.",
  "Shipping Instruction (SI)": "Instructions compiled by shipper specifying vessel configurations, carrier line, container load types, notify parties, and ETD. Dictates exact parameters on the eventual Bill of Lading (B/L).",
  "Sales Contract (SC)": "Secure, binding multi-party contract detailing terms of international spice arbitration, choice of governing law, product specs, claims liability, and force majeure parameters."
};
