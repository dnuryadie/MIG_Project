// SupplierNetworkPanel
import { useState } from 'react';
import { Shield, MapPin, Star, Package, Globe2, CheckCircle } from 'lucide-react';
import { SUPPLIER_CATALOG, getSuppliersByProduct } from '@workspace/supplier-catalog';

export default function SupplierNetworkPanel() {
  const [filter, setFilter] = useState<string>('ALL');
  const displayed = filter === 'ALL' ? SUPPLIER_CATALOG : getSuppliersByProduct(filter);

  return (
    <div className="space-y-5">
      <div className="bg-[#161b27] border border-[#2d3748] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-indigo-400" />
          <h3 className="font-extrabold text-white text-base uppercase">Verified Supplier Network</h3>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {displayed.slice(0, 6).map((supplier) => (
            <div key={supplier.id} className="bg-[#1e2636] border border-[#2d3748] rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center"><Shield className="w-4 h-4 text-indigo-400" /></div>
                <div>
                  <p className="text-xs font-bold text-white">{supplier.name}</p>
                  <p className="text-[10px] text-slate-400">{supplier.origin}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-lg font-black text-indigo-400">{supplier.eqi}</p>
                  <p className="text-[8px] text-slate-500">EQI</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}