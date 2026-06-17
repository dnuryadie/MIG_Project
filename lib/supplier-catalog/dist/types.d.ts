export type VerificationStatus = 'verified' | 'pending' | 'suspended';
export interface EqiBreakdown {
    experience: number;
    certifications: number;
    fulfillment: number;
    satisfaction: number;
    compliance: number;
}
export interface SupplierProfile {
    id: string;
    name: string;
    origin: string;
    hub: string;
    products: string[];
    primaryCommodities: string[];
    capacityMtPerYear: number;
    moq: number;
    certifications: string[];
    verificationStatus: VerificationStatus;
    isVerified: boolean;
    eqi: number;
    eqiBreakdown: EqiBreakdown;
    experienceYears: number;
    exportMarkets: string[];
    contractType: string;
}
//# sourceMappingURL=types.d.ts.map