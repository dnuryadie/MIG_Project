export type UserRole = 'free' | 'pro';

export interface UserProfile {
  uid: string;
  fullName: string;
  companyName: string;
  country: string;
  email: string;
  username: string;
  role: UserRole;
  registrationDate: string;
}

export interface UpgradeRequest {
  requestId: string;
  userId: string;
  fullName: string;
  companyName: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  notes?: string;
}

export type DocumentType =
  | 'Quotation'
  | 'Proforma Invoice'
  | 'Commercial Invoice'
  | 'Packing List'
  | 'Shipping Instruction'
  | 'Sales Contract';

export interface DocumentRecord {
  documentId: string;
  userId: string;
  documentType: DocumentType;
  createdDate: string;
  fileName: string;
  data: string; // JSON string of specific fields
}

export type CalculationType = 'FOB' | 'CIF' | 'DDP';

export interface CalculationRecord {
  calculationId: string;
  userId: string;
  calculationType: CalculationType;
  commodity: string;
  volumeKg: number;
  createdDate: string;
  inputs: string;  // JSON string
  outputs: string; // JSON string
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface FOBInputs {
  commodity: string;
  volumeKg: number;
  packagingType: string;
  loadingPort: string;
  exchangeRate: number;
}

export interface FOBOutputs {
  commodity: string;
  hsCode: string;
  origin: string;
  loadingPort: string;
  volumeKg: number;
  netWeightKg: number;
  grossWeightKg: number;
  totalUnitsNeeded: number;
  exchangeRate: number;
  marginPercent: number;
  totalCostPerKgIdr: number;
  totalCostPerKgUsd: number;
  fobPricePerKg: number;
  fobTotalUsd: number;
  totalCostUsd: number;
  profitUsd: number;
  breakdownTotal: Record<string, number>;
  documentationFixedIdr: number;
}

export interface CIFInputs {
  destinationPort: string;
  freightUsdPerKg: number;
  insuranceRatePct: number;
}

export interface CIFOutputs {
  commodity: string;
  hsCode: string;
  origin: string;
  loadingPort: string;
  destinationPort: string;
  volumeKg: number;
  netWeightKg: number;
  grossWeightKg: number;
  totalUnitsNeeded: number;
  exchangeRate: number;
  fobTotalUsd: number;
  fobPricePerKg: number;
  freightUsdPerKg: number;
  oceanFreightUsd: number;
  insuranceRatePct: number;
  insuranceUsd: number;
  cifTotalUsd: number;
  cifPricePerKg: number;
}

export interface DDPInputs {
  destinationCountry: string;
  dutyRatePct: number;
  vatRatePct: number;
  inlandFreightUsd: number;
  customsHandlingUsd: number;
}

export interface DDPOutputs {
  commodity: string;
  hsCode: string;
  origin: string;
  loadingPort: string;
  destinationPort: string;
  volumeKg: number;
  netWeightKg: number;
  grossWeightKg: number;
  totalUnitsNeeded: number;
  exchangeRate: number;
  fobTotalUsd: number;
  fobPricePerKg: number;
  oceanFreightUsd: number;
  insuranceUsd: number;
  cifTotalUsd: number;
  cifPricePerKg: number;
  dutyRatePct: number;
  importDutyUsd: number;
  vatRatePct: number;
  vatUsd: number;
  inlandFreightUsd: number;
  customsHandlingUsd: number;
  ddpTotalUsd: number;
  ddpPricePerKg: number;
}
