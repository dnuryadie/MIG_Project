import type { SupplierProfile } from './types.js';
export declare const SUPPLIER_CATALOG: SupplierProfile[];
export declare const SUPPLIER_COUNT: number;
export declare const VERIFIED_SUPPLIER_COUNT: number;
export declare function getSuppliersByProduct(commodity: string): SupplierProfile[];
export declare function getSupplierById(id: string): SupplierProfile | undefined;
//# sourceMappingURL=catalog.d.ts.map