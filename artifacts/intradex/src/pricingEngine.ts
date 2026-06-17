import { FOBInputs, FOBOutputs, CIFInputs, CIFOutputs, DDPInputs, DDPOutputs } from './types';

// ==============================================================================
// PACKAGING MASTER DATA & TARE WEIGHTS
// ==============================================================================
export interface PackagingDetail {
  weight: number;
  price_per_unit: number;
  tare_weight: number;
  type: string;
}

export const PACKAGING_MASTER: Record<string, Record<string, PackagingDetail>> = {
  "Cassia Whole": {
    "PP Woven Bag 25 Kg": { "weight": 25.0, "price_per_unit": 7500, "tare_weight": 0.20, "type": "Bag" },
    "PP Woven Bag 50 Kg": { "weight": 50.0, "price_per_unit": 12000, "tare_weight": 0.35, "type": "Bag" }
  },
  "Cassia Powder": {
    "Kraft Paper Bag 20 Kg": { "weight": 20.0, "price_per_unit": 11000, "tare_weight": 0.25, "type": "Bag" },
    "Kraft Paper Bag 25 Kg": { "weight": 25.0, "price_per_unit": 12500, "tare_weight": 0.30, "type": "Bag" }
  },
  "Black Pepper": {
    "PP Woven Bag 25 Kg": { "weight": 25.0, "price_per_unit": 7500, "tare_weight": 0.30, "type": "Bag" }
  },
  "White Pepper": {
    "PP Woven Bag 25 Kg": { "weight": 25.0, "price_per_unit": 7500, "tare_weight": 0.30, "type": "Bag" }
  },
  "Clove": {
    "PP Woven Bag 25 Kg": { "weight": 25.0, "price_per_unit": 7500, "tare_weight": 0.30, "type": "Bag" },
    "PP Woven Bag 50 Kg": { "weight": 50.0, "price_per_unit": 12000, "tare_weight": 0.35, "type": "Bag" }
  },
  "Nutmeg": {
    "PP Woven Bag 25 Kg": { "weight": 25.0, "price_per_unit": 7500, "tare_weight": 0.30, "type": "Bag" },
    "PP Woven Bag 50 Kg": { "weight": 50.0, "price_per_unit": 12000, "tare_weight": 0.35, "type": "Bag" }
  },
  "Vanilla": {
    "Vacuum Bag + Carton 5 Kg": { "weight": 5.0, "price_per_unit": 25000, "tare_weight": 0.50, "type": "Carton" },
    "Vacuum Bag + Carton 10 Kg": { "weight": 10.0, "price_per_unit": 35000, "tare_weight": 0.80, "type": "Carton" }
  },
  "Patchouli Oil": {
    "HDPE Drum 25 Kg": { "weight": 25.0, "price_per_unit": 85000, "tare_weight": 1.80, "type": "Drum" },
    "Steel Drum 180 Kg": { "weight": 180.0, "price_per_unit": 350000, "tare_weight": 18.00, "type": "Drum" }
  }
};

export const PACKAGING_DIMENSIONS: Record<string, { l: number; w: number; h: number; unit: string }> = {
  "PP Woven Bag 25 Kg":        { "l": 60, "w": 40, "h": 20, "unit": "cm" },
  "PP Woven Bag 50 Kg":        { "l": 75, "w": 50, "h": 25, "unit": "cm" },
  "Kraft Paper Bag 20 Kg":     { "l": 55, "w": 38, "h": 18, "unit": "cm" },
  "Kraft Paper Bag 25 Kg":     { "l": 60, "w": 40, "h": 20, "unit": "cm" },
  "Vacuum Bag + Carton 5 Kg":  { "l": 30, "w": 22, "h": 12, "unit": "cm" },
  "Vacuum Bag + Carton 10 Kg": { "l": 40, "w": 28, "h": 16, "unit": "cm" },
  "HDPE Drum 25 Kg":           { "l": 35, "w": 35, "h": 45, "unit": "cm" },
  "Steel Drum 180 Kg":         { "l": 59, "w": 59, "h": 88, "unit": "cm" }
};

// ==============================================================================
// FOB MASTER DATA (IDR Cost per Kg)
// ==============================================================================
export interface FOBCommodityMetric {
  hsCode: string;
  origin: string;
  rawMaterialIdr: number;
  processingIdr: number;
  packagingIdr: number;
  portHandlingIdr: number;
  marginPercent: number;
}

export const COMMODITY_FOB_MASTER: Record<string, FOBCommodityMetric> = {
  "Black Pepper (Whole)": {
    "hsCode": "0904.11",
    "origin": "Lampung, Indonesia",
    "rawMaterialIdr": 65000,
    "processingIdr": 8000,
    "packagingIdr": 2500,
    "portHandlingIdr": 2000,
    "marginPercent": 20
  },
  "White Pepper (Whole)": {
    "hsCode": "0904.12",
    "origin": "Bangka Belitung, Indonesia",
    "rawMaterialIdr": 85000,
    "processingIdr": 10000,
    "packagingIdr": 2500,
    "portHandlingIdr": 2000,
    "marginPercent": 20
  },
  "Cassia Whole": {
    "hsCode": "0906.11",
    "origin": "Kerinci, Indonesia",
    "rawMaterialIdr": 42000,
    "processingIdr": 5000,
    "packagingIdr": 2500,
    "portHandlingIdr": 2000,
    "marginPercent": 20
  },
  "Cassia Powder": {
    "hsCode": "0906.20",
    "origin": "Kerinci, Indonesia",
    "rawMaterialIdr": 42000,
    "processingIdr": 12000,
    "packagingIdr": 6000,
    "portHandlingIdr": 2000,
    "marginPercent": 25
  },
  "Clove": {
    "hsCode": "0907.10",
    "origin": "North Maluku, Indonesia",
    "rawMaterialIdr": 95000,
    "processingIdr": 7000,
    "packagingIdr": 2500,
    "portHandlingIdr": 2000,
    "marginPercent": 20
  },
  "Nutmeg": {
    "hsCode": "0908.11",
    "origin": "North Maluku, Indonesia",
    "rawMaterialIdr": 110000,
    "processingIdr": 7000,
    "packagingIdr": 2500,
    "portHandlingIdr": 2000,
    "marginPercent": 20
  },
  "Vanilla": {
    "hsCode": "0905.10",
    "origin": "Papua, Indonesia",
    "rawMaterialIdr": 750000,
    "processingIdr": 25000,
    "packagingIdr": 35000,
    "portHandlingIdr": 3000,
    "marginPercent": 25
  },
  "Patchouli Oil": {
    "hsCode": "3301.29",
    "origin": "Aceh, Indonesia",
    "rawMaterialIdr": 850000,
    "processingIdr": 30000,
    "packagingIdr": 85000,
    "portHandlingIdr": 3000,
    "marginPercent": 25
  }
};

export const DOMESTIC_FREIGHT_COST_IDR: Record<string, number> = {
  "Belawan Port (Medan)": 3500,
  "Tanjung Priok Port (Jakarta)": 4500,
  "Tanjung Perak Port (Surabaya)": 5000,
  "Makassar Port (Sulawesi)": 5500
};

export const DOCUMENTATION_FIXED_IDR = 2500000; // IDR 2,500,000 flat fee per shipment

// ==============================================================================
// CIF MASTER DATA (Destination Ports & Preset Freight USD/Kg)
// ==============================================================================
export interface PortPreset {
  region: string;
  base_freight_usd_per_kg: number;
}

export const DESTINATION_PORT_PRESETS: Record<string, PortPreset> = {
  "Hamburg, Germany":         { "region": "Europe",        "base_freight_usd_per_kg": 0.18 },
  "Rotterdam, Netherlands":   { "region": "Europe",        "base_freight_usd_per_kg": 0.17 },
  "Antwerp, Belgium":         { "region": "Europe",        "base_freight_usd_per_kg": 0.17 },
  "Felixstowe, UK":           { "region": "Europe",        "base_freight_usd_per_kg": 0.19 },
  "New York, USA":            { "region": "North America", "base_freight_usd_per_kg": 0.20 },
  "Los Angeles, USA":         { "region": "North America", "base_freight_usd_per_kg": 0.16 },
  "Houston, USA":             { "region": "North America", "base_freight_usd_per_kg": 0.21 },
  "Jebel Ali, UAE":           { "region": "Middle East",   "base_freight_usd_per_kg": 0.10 },
  "Dammam, Saudi Arabia":     { "region": "Middle East",   "base_freight_usd_per_kg": 0.11 },
  "Tokyo, Japan":             { "region": "Asia Pacific",  "base_freight_usd_per_kg": 0.09 },
  "Busan, South Korea":       { "region": "Asia Pacific",  "base_freight_usd_per_kg": 0.08 },
  "Sydney, Australia":        { "region": "Asia Pacific",  "base_freight_usd_per_kg": 0.12 },
  "Singapore":                { "region": "Asia Pacific",  "base_freight_usd_per_kg": 0.06 },
  "Shanghai, China":          { "region": "Asia Pacific",  "base_freight_usd_per_kg": 0.07 },
  "Mumbai, India":            { "region": "South Asia",    "base_freight_usd_per_kg": 0.08 },
  "Colombo, Sri Lanka":       { "region": "South Asia",    "base_freight_usd_per_kg": 0.07 },
  "Custom / Other":           { "region": "Custom",        "base_freight_usd_per_kg": 0.00 }
};

// ==============================================================================
// DDP MASTER DATA (Country Duty / VAT Presets)
// ==============================================================================
export interface CountryDutyPreset {
  duty_rate_pct: number;
  vat_rate_pct: number;
  note: string;
}

export const COUNTRY_DUTY_PRESETS: Record<string, CountryDutyPreset> = {
  "Germany":              { "duty_rate_pct": 0.0,  "vat_rate_pct": 19.0, "note": "EU MFN — most spices 0%" },
  "Netherlands":          { "duty_rate_pct": 0.0,  "vat_rate_pct": 21.0, "note": "EU MFN — most spices 0%" },
  "Belgium":              { "duty_rate_pct": 0.0,  "vat_rate_pct": 21.0, "note": "EU MFN — most spices 0%" },
  "France":               { "duty_rate_pct": 0.0,  "vat_rate_pct": 20.0, "note": "EU MFN — most spices 0%" },
  "United Kingdom":       { "duty_rate_pct": 0.0,  "vat_rate_pct": 0.0,  "note": "UK GSP — most Indonesian spices 0% duty, food VAT is 0%" },
  "United States":        { "duty_rate_pct": 0.0,  "vat_rate_pct": 0.0,  "note": "US — most spices 0% MFN; no federal VAT" },
  "United Arab Emirates": { "duty_rate_pct": 5.0,  "vat_rate_pct": 5.0,  "note": "GCC CET 5% + VAT 5%" },
  "Saudi Arabia":         { "duty_rate_pct": 5.0,  "vat_rate_pct": 15.0, "note": "GCC CET 5% + VAT 15%" },
  "Japan":                { "duty_rate_pct": 3.0,  "vat_rate_pct": 10.0, "note": "Japan MFN ~3% avg for spices + consumption tax 10%" },
  "South Korea":          { "duty_rate_pct": 5.0,  "vat_rate_pct": 10.0, "note": "Korea MFN ~5% + VAT 10%" },
  "Australia":            { "duty_rate_pct": 0.0,  "vat_rate_pct": 10.0, "note": "Australia FTA — spices 0% + GST 10%" },
  "Singapore":            { "duty_rate_pct": 0.0,  "vat_rate_pct": 9.0,  "note": "Singapore — 0% duty + GST 9%" },
  "India":                { "duty_rate_pct": 30.0, "vat_rate_pct": 5.0,  "note": "India — high duty on processed spices; IGST 5%" },
  "China":                { "duty_rate_pct": 10.0, "vat_rate_pct": 9.0,  "note": "China MFN ~10% + VAT 9%" },
  "Custom / Other":       { "duty_rate_pct": 0.0,  "vat_rate_pct": 0.0,  "note": "Enter rates manually below" }
};

// ==============================================================================
// SOURCING & PACKAGING ENGINE
// ==============================================================================
export interface SourcingResult {
  commodity: string;
  selected_packaging: string;
  packaging_type: string;
  weight_per_unit_kg: number;
  price_per_unit_idr: number;
  total_units_needed: number;
  total_packaging_cost_usd: number;
  packaging_cost_per_kg_usd: number;
  net_weight_kg: number;
  gross_weight_kg: number;
  exchange_rate: number;
}

export function calculatePackagingCost(
  commodity: string,
  target_weight_kg: number,
  packaging_name: string,
  exchange_rate = 16500
): SourcingResult {
  const packs = PACKAGING_MASTER[commodity];
  if (!packs) {
    throw new Error(`Commodity '${commodity}' not found in database.`);
  }

  const p_name = packaging_name || Object.keys(packs)[0];
  const pack_info = packs[p_name];
  if (!pack_info) {
    throw new Error(`Packaging type '${packaging_name}' not found for ${commodity}.`);
  }

  const weight_per_unit = pack_info.weight;
  const price_per_unit = pack_info.price_per_unit;
  const tare_weight = pack_info.tare_weight;

  // Round up the total bags/drums needed
  const total_units_needed = Math.ceil(target_weight_kg / weight_per_unit);
  const total_packaging_cost_idr = total_units_needed * price_per_unit;

  const total_tare_weight = total_units_needed * tare_weight;
  const gross_weight_estimate = target_weight_kg + total_tare_weight;

  const total_packaging_cost_usd = total_packaging_cost_idr / exchange_rate;
  const packaging_cost_per_kg_usd = total_packaging_cost_usd / target_weight_kg;

  return {
    commodity,
    selected_packaging: p_name,
    packaging_type: pack_info.type,
    weight_per_unit_kg: weight_per_unit,
    price_per_unit_idr: price_per_unit,
    total_units_needed,
    total_packaging_cost_usd: parseFloat(total_packaging_cost_usd.toFixed(2)),
    packaging_cost_per_kg_usd: parseFloat(packaging_cost_per_kg_usd.toFixed(4)),
    net_weight_kg: target_weight_kg,
    gross_weight_kg: parseFloat(gross_weight_estimate.toFixed(2)),
    exchange_rate
  };
}

// ==============================================================================
// FOB PRICING ENGINE
// ==============================================================================
export function calculateFobPrice(inputs: FOBInputs): FOBOutputs {
  const { commodity, volumeKg, packagingType, loadingPort, exchangeRate } = inputs;
  
  // Find mapped commodity profile
  // Since keys in COMMODITY_FOB_MASTER might be detailed (e.g. "Black Pepper (Whole)" vs "Black Pepper")
  const masterKey = Object.keys(COMMODITY_FOB_MASTER).find(k => 
    k.toLowerCase().includes(commodity.toLowerCase())
  ) || "Cassia Whole";

  const data = COMMODITY_FOB_MASTER[masterKey];
  const freightIdrPerKg = DOMESTIC_FREIGHT_COST_IDR[loadingPort] || 4500;

  const { rawMaterialIdr, processingIdr, packagingIdr, portHandlingIdr, marginPercent } = data;

  const variableCostPerKgIdr =
    rawMaterialIdr +
    processingIdr +
    packagingIdr +
    freightIdrPerKg +
    portHandlingIdr;

  const documentationPerKgIdr = DOCUMENTATION_FIXED_IDR / volumeKg;
  const totalCostPerKgIdr = variableCostPerKgIdr + documentationPerKgIdr;
  const totalCostPerKgUsd = totalCostPerKgIdr / exchangeRate;

  const marginDecimal = marginPercent / 100;
  const fobPricePerKg = totalCostPerKgUsd / (1 - marginDecimal);

  const totalCostUsd = totalCostPerKgUsd * volumeKg;
  const fobTotalUsd = fobPricePerKg * volumeKg;
  const profitUsd = fobTotalUsd - totalCostUsd;

  // Calculate packaging counts & gross weight
  // Look up tare details
  let tarePerUnit = 0.3;
  let packCapacity = 25;

  const pack_opt = PACKAGING_MASTER[commodity] || PACKAGING_MASTER["Cassia Whole"];
  if (pack_opt && pack_opt[packagingType]) {
    tarePerUnit = pack_opt[packagingType].tare_weight;
    packCapacity = pack_opt[packagingType].weight;
  }

  const totalUnitsNeeded = Math.ceil(volumeKg / packCapacity);
  const grossWeightKg = volumeKg + (totalUnitsNeeded * tarePerUnit);

  const breakdownTotal = {
    raw_material_idr: rawMaterialIdr * volumeKg,
    processing_idr: processingIdr * volumeKg,
    packaging_idr: packagingIdr * volumeKg,
    domestic_freight_idr: freightIdrPerKg * volumeKg,
    documentation_idr: DOCUMENTATION_FIXED_IDR,
    port_handling_idr: portHandlingIdr * volumeKg
  };

  return {
    commodity: masterKey,
    hsCode: data.hsCode,
    origin: data.origin,
    loadingPort,
    volumeKg,
    netWeightKg: volumeKg,
    grossWeightKg: parseFloat(grossWeightKg.toFixed(2)),
    totalUnitsNeeded,
    exchangeRate,
    marginPercent,
    totalCostPerKgIdr: parseFloat(totalCostPerKgIdr.toFixed(2)),
    totalCostPerKgUsd: parseFloat(totalCostPerKgUsd.toFixed(4)),
    fobPricePerKg: parseFloat(fobPricePerKg.toFixed(4)),
    fobTotalUsd: parseFloat(fobTotalUsd.toFixed(2)),
    totalCostUsd: parseFloat(totalCostUsd.toFixed(2)),
    profitUsd: parseFloat(profitUsd.toFixed(2)),
    breakdownTotal,
    documentationFixedIdr: DOCUMENTATION_FIXED_IDR
  };
}

// ==============================================================================
// CIF PRICING ENGINE
// ==============================================================================
export function calculateCifPrice(fob: FOBOutputs, inputs: CIFInputs): CIFOutputs {
  const { destinationPort, freightUsdPerKg, insuranceRatePct } = inputs;

  const preset = DESTINATION_PORT_PRESETS[destinationPort] || { base_freight_usd_per_kg: 0 };
  const freightRate = freightUsdPerKg !== undefined && freightUsdPerKg !== 0 ? freightUsdPerKg : preset.base_freight_usd_per_kg;

  const oceanFreightUsd = freightRate * fob.volumeKg;
  const insuranceRate = insuranceRatePct / 100;

  // Dynamic formula: CIF = (FOB + Freight) / (1 - Insurance)
  const cifTotalUsd = (fob.fobTotalUsd + oceanFreightUsd) / (1 - insuranceRate);
  const insuranceUsd = cifTotalUsd * insuranceRate;
  const cifPricePerKg = cifTotalUsd / fob.volumeKg;

  return {
    commodity: fob.commodity,
    hsCode: fob.hsCode,
    origin: fob.origin,
    loadingPort: fob.loadingPort,
    destinationPort,
    volumeKg: fob.volumeKg,
    netWeightKg: fob.netWeightKg,
    grossWeightKg: fob.grossWeightKg,
    totalUnitsNeeded: fob.totalUnitsNeeded,
    exchangeRate: fob.exchangeRate,
    fobTotalUsd: fob.fobTotalUsd,
    fobPricePerKg: fob.fobPricePerKg,
    freightUsdPerKg: parseFloat(freightRate.toFixed(4)),
    oceanFreightUsd: parseFloat(oceanFreightUsd.toFixed(2)),
    insuranceRatePct,
    insuranceUsd: parseFloat(insuranceUsd.toFixed(2)),
    cifTotalUsd: parseFloat(cifTotalUsd.toFixed(2)),
    cifPricePerKg: parseFloat(cifPricePerKg.toFixed(4))
  };
}

// ==============================================================================
// DDP PRICING ENGINE
// ==============================================================================
export function calculateDdpPrice(cif: CIFOutputs, inputs: DDPInputs): DDPOutputs {
  const { dutyRatePct, vatRatePct, inlandFreightUsd, customsHandlingUsd } = inputs;

  const importDutyUsd = cif.cifTotalUsd * (dutyRatePct / 100);
  const vatBaseUsd = cif.cifTotalUsd + importDutyUsd;
  const vatUsd = vatBaseUsd * (vatRatePct / 100);

  const ddpTotalUsd = cif.cifTotalUsd + importDutyUsd + vatUsd + inlandFreightUsd + customsHandlingUsd;
  const ddpPricePerKg = ddpTotalUsd / cif.volumeKg;

  return {
    commodity: cif.commodity,
    hsCode: cif.hsCode,
    origin: cif.origin,
    loadingPort: cif.loadingPort,
    destinationPort: cif.destinationPort,
    volumeKg: cif.volumeKg,
    netWeightKg: cif.netWeightKg,
    grossWeightKg: cif.grossWeightKg,
    totalUnitsNeeded: cif.totalUnitsNeeded,
    exchangeRate: cif.exchangeRate,
    fobTotalUsd: cif.fobTotalUsd,
    fobPricePerKg: cif.fobPricePerKg,
    oceanFreightUsd: cif.oceanFreightUsd,
    insuranceUsd: cif.insuranceUsd,
    cifTotalUsd: cif.cifTotalUsd,
    cifPricePerKg: cif.cifPricePerKg,
    dutyRatePct,
    importDutyUsd: parseFloat(importDutyUsd.toFixed(2)),
    vatRatePct,
    vatUsd: parseFloat(vatUsd.toFixed(2)),
    inlandFreightUsd,
    customsHandlingUsd,
    ddpTotalUsd: parseFloat(ddpTotalUsd.toFixed(2)),
    ddpPricePerKg: parseFloat(ddpPricePerKg.toFixed(4))
  };
}
