import type { SupplierProfile } from './types';

export const SUPPLIER_CATALOG: SupplierProfile[] = [
  {
    id: 'exp-1',
    name: 'PT ARCHIPELAGO SPICES INDONESIA',
    origin: 'Central Java & East Kalimantan, Indonesia',
    hub: 'Semarang, Central Java',
    products: ['NUTMEG', 'CINNAMON', 'PEPPER', 'CLOVE', 'TURMERIC', 'CARDAMOM'],
    primaryCommodities: ['NUTMEG', 'CINNAMON', 'PEPPER', 'CLOVE', 'TURMERIC', 'CARDAMOM'],
    capacityMtPerYear: 4800,
    moq: 1.5,
    certifications: ['USDA Organic', 'EU Organic', 'US-FDA Listed', 'HACCP', 'Halal', 'KOSHER', 'ISO 22000'],
    verificationStatus: 'verified',
    isVerified: true,
    eqi: 94,
    eqiBreakdown: {
      experience: 90,
      certifications: 98,
      fulfillment: 95,
      satisfaction: 92,
      compliance: 96,
    },
    experienceYears: 18,
    exportMarkets: ['USA', 'Germany', 'Netherlands', 'Japan', 'Saudi Arabia'],
    contractType: 'FOB/CIF LARGE SCALE CARGO ESCROW',
  },
  {
    id: 'exp-2',
    name: 'BANDA SPICE GROWERS COOPERATIVE',
    origin: 'Banda Neira, Maluku, Indonesia',
    hub: 'Banda Neira, Maluku',
    products: ['NUTMEG', 'CLOVE', 'CARDAMOM'],
    primaryCommodities: ['NUTMEG', 'CLOVE', 'CARDAMOM'],
    capacityMtPerYear: 820,
    moq: 0.5,
    certifications: ['GI Protected Banda Nutmeg', 'Fairtrade International', 'Halal', 'HACCP', 'USDA Organic'],
    verificationStatus: 'verified',
    isVerified: true,
    eqi: 96,
    eqiBreakdown: {
      experience: 100,
      certifications: 92,
      fulfillment: 94,
      satisfaction: 98,
      compliance: 96,
    },
    experienceYears: 25,
    exportMarkets: ['UK', 'France', 'Netherlands', 'USA', 'Singapore'],
    contractType: 'COOP DIRECT FAIRTRADE CONTAINER',
  },
  {
    id: 'exp-3',
    name: 'PT SUMATRA CASSIA VERA PERKASA',
    origin: 'West Sumatra Highlands, Indonesia',
    hub: 'Padang, West Sumatra',
    products: ['CINNAMON', 'PEPPER', 'CARDAMOM', 'GALANGAL'],
    primaryCommodities: ['CINNAMON', 'PEPPER', 'CARDAMOM', 'GALANGAL'],
    capacityMtPerYear: 2200,
    moq: 2,
    certifications: ['HACCP', 'ISO 22000', 'Rainforest Alliance', 'Halal', 'KOSHER'],
    verificationStatus: 'verified',
    isVerified: true,
    eqi: 89,
    eqiBreakdown: {
      experience: 80,
      certifications: 90,
      fulfillment: 92,
      satisfaction: 88,
      compliance: 95,
    },
    experienceYears: 12,
    exportMarkets: ['USA', 'Spain', 'Italy', 'UAE', 'India'],
    contractType: 'DIRECT MOUNTAIN HIGHLAND ESCROW',
  },
  {
    id: 'exp-4',
    name: 'PT PRIMA REMPAH NUSANTARA',
    origin: 'East Java & North Sumatra, Indonesia',
    hub: 'Surabaya, East Java',
    products: ['GINGER', 'TURMERIC', 'GALANGAL', 'PEPPER'],
    primaryCommodities: ['GINGER', 'TURMERIC', 'GALANGAL', 'PEPPER'],
    capacityMtPerYear: 3100,
    moq: 3,
    certifications: ['Halal', 'ISO 22000', 'HACCP', 'US-FDA Listed'],
    verificationStatus: 'verified',
    isVerified: true,
    eqi: 85,
    eqiBreakdown: {
      experience: 70,
      certifications: 88,
      fulfillment: 86,
      satisfaction: 90,
      compliance: 91,
    },
    experienceYears: 9,
    exportMarkets: ['China', 'Vietnam', 'Malaysia', 'Japan', 'South Korea'],
    contractType: 'FOB STANDARD CARGO ESCROW',
  },
  {
    id: 'exp-5',
    name: 'CV PRIANGAN CLOVES',
    origin: 'North Sulawesi & Maluku, Indonesia',
    hub: 'Manado, North Sulawesi',
    products: ['CLOVE', 'NUTMEG', 'VANILLA'],
    primaryCommodities: ['CLOVE', 'NUTMEG', 'VANILLA'],
    capacityMtPerYear: 950,
    moq: 1,
    certifications: ['Halal', 'HACCP', 'Fairtrade International', 'USDA Organic'],
    verificationStatus: 'verified',
    isVerified: true,
    eqi: 87,
    eqiBreakdown: {
      experience: 85,
      certifications: 88,
      fulfillment: 84,
      satisfaction: 90,
      compliance: 88,
    },
    experienceYears: 11,
    exportMarkets: ['Germany', 'UK', 'Netherlands', 'UAE', 'Singapore'],
    contractType: 'FOB DIRECT ISLAND COOPERATIVE',
  },
  {
    id: 'exp-6',
    name: 'PT NUSANTARA SPICES ABADI',
    origin: 'Java, Sumatra & Sulawesi, Indonesia',
    hub: 'Jakarta, DKI Jakarta',
    products: ['PEPPER', 'CLOVE', 'GINGER', 'TURMERIC', 'CINNAMON', 'CARDAMOM'],
    primaryCommodities: ['PEPPER', 'CLOVE', 'GINGER', 'TURMERIC', 'CINNAMON', 'CARDAMOM'],
    capacityMtPerYear: 6500,
    moq: 5,
    certifications: ['US-FDA Listed', 'HACCP', 'Halal', 'ISO 22000', 'KOSHER', 'BRC Global Standard'],
    verificationStatus: 'verified',
    isVerified: true,
    eqi: 91,
    eqiBreakdown: {
      experience: 95,
      certifications: 92,
      fulfillment: 88,
      satisfaction: 89,
      compliance: 91,
    },
    experienceYears: 22,
    exportMarkets: ['USA', 'Canada', 'Australia', 'New Zealand', 'UK', 'Germany'],
    contractType: 'CIF/DDP LARGE VOLUME ANNUAL CONTRACT',
  },
];

export const SUPPLIER_COUNT = SUPPLIER_CATALOG.length;

export const VERIFIED_SUPPLIER_COUNT = SUPPLIER_CATALOG.filter(
  (s) => s.verificationStatus === 'verified'
).length;

export function getSuppliersByProduct(commodity: string): SupplierProfile[] {
  const upper = commodity.toUpperCase();
  return SUPPLIER_CATALOG.filter((s) =>
    s.products.some((p) => p.toUpperCase().includes(upper) || upper.includes(p.toUpperCase()))
  );
}

export function getSupplierById(id: string): SupplierProfile | undefined {
  return SUPPLIER_CATALOG.find((s) => s.id === id);
}
