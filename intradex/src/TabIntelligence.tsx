import React, { useState } from 'react';
import { Globe, ShieldAlert, FileSearch, HelpCircle, CheckCircle, Newspaper, BookOpen } from 'lucide-react';
import { SPICE_PROFILES } from './knowledgeBase';

export default function TabIntelligence() {
  const [selectedTopic, setSelectedTopic] = useState<'EU' | 'US' | 'ANZ' | 'GCC'>('EU');
  const [selectedHS, setSelectedHS] = useState('0906.11');

  const hsCodeInformation: { [code: string]: { description: string; generalTariff: string; permitNeeded: string } } = {
    '0906.11': {
      description: 'Cinnamon (Cinnamomum zeylanicum Blume) - Neither crushed nor ground (Whole/Quills)',
      generalTariff: 'EU: 0% | US: 0% | India: 30% | UAE: 5%',
      permitNeeded: 'Phitosanitary Certificate and Origin Declaration.'
    },
    '0906.20': {
      description: 'Cinnamon and cinnamon-tree flowers - Crushed or ground (Cassia Powder)',
      generalTariff: 'EU: 0% | US: 0% | India: 30% | China: 15%',
      permitNeeded: 'Phitosanitary Certificate, Aflatoxin analysis, Origin Declaration.'
    },
    '0904.11': {
      description: 'Pepper of the genus Piper - Neither crushed nor ground (Black/White Pepper Whole)',
      generalTariff: 'EU: 0% | US: 0% | Australia: 0% | Japan: 3%',
      permitNeeded: 'Phitosanitary Certificate, Salmonella clean testing analysis.'
    },
    '0907.10': {
      description: 'Cloves (Whole fruit, cloves and stems) - Neither crushed nor ground',
      generalTariff: 'EU: 0% | US: 0% | UAE: 5% | China: 20%',
      permitNeeded: 'Origin Declaration, Fumigation Certificate, Phitosanitary Certificate.'
    },
    '0908.11': {
      description: 'Nutmeg - Neither crushed nor ground (ABCD/FAQ Whole Nuts)',
      generalTariff: 'EU: 0% | US: 0% | India: 70% | Vietnam: 5%',
      permitNeeded: 'Aflatoxin Certificate (Mycotoxins Max 10ppb), Phitosanitary seal.'
    }
  };

  const marketBriefs = {
    EU: {
      title: 'European Union (TRACES NT & EU Regulations)',
      authority: 'European Food Safety Authority (EFSA)',
      rules: [
        'TRACES NT Registry: Importing buyers must have a validated TRACES NT account with an active CHED-D document issued.',
        'Aflatoxin Limits: Strict maximum ceiling of 5 ppb for B1 Aflatoxin, 10 ppb for Total Aflatoxin content.',
        'Coumarin warning: Cassia (Cinnamon) imports must specify Coumarin content. Maximum allowable limits in baked goods is 50 mg/kg.',
        'Pesticide Residue Limits: Strict compliance with EU MRL (Maximum Residue Limits) databases. No traces of Chlorpyrifos allowed.'
      ],
      alertIcon: '⚠️ EU Customs random quarantine inspection covers 20% of spice cargo lines originating from Southeast Asia.'
    },
    US: {
      title: 'United States (FDA Import Audits)',
      authority: 'U.S. Food and Drug Administration & Customs (CBP)',
      rules: [
        'Import Alert 99-19: Automatic Detention Without Physical Examination (DWPE) triggered for spices suspect of Salmonella contamination.',
        'ASTA Cleanliness standards: Adherence to American Spice Trade Association purity charts (zero filth, hair, or rodent droppings).',
        'Prior Notice: Exporters must file a food facility registration Prior Notice with FDA before vessel arrival.',
        'FSMA Compliance: Importers must audit the Indonesian supplier under Foreign Supplier Verification Programs (FSVP).'
      ],
      alertIcon: '⚠️ FDA inspectors look closely at whole pepper and vanilla shipments for mold/extraneous matter.'
    },
    ANZ: {
      title: 'Australia & New Zealand (Biosecurity Permits)',
      authority: 'Australian Dept of Agriculture, Fisheries and Forestry (DAFF) & MPI NZ',
      rules: [
        'BICON Registry Check: Specific import permit rules must be researched via the BICON database before loading containers.',
        'Mandatory Fumigation: All raw woody agricultural items (e.g., Cassia bark) must undergo certified Methyl Bromide treatment.',
        'Moisture limits: Cargo must be stored under 12% relative moisture. Any moisture content above this triggers automatic vacuum-purity tests.',
        'Packing material restrictions: No raw wooden crates or untreated pallets allowed. Standard IPPC ISPM-15 treatment stamps mandatory.'
      ],
      alertIcon: '⚠️ Biosecurity inspections are incredibly thorough. Soil or seeds on packing bags will prompt immediate container destruction.'
    },
    GCC: {
      title: 'Gulf Cooperation Council (Halal & GSO Customs)',
      authority: 'SFDA (Saudi Food & Drug Authority) & GCC GSO Standards',
      rules: [
        'GSO Food Standards: All whole spices must have custom microbiological testing validating low aerobic plate counts.',
        'Mandatory Halal Certification: Food processing facility must carry active BPJPH (Indonesian Halal Authority) or GCC-approved certificates.',
        'Labeling requirements: Exporter must provide clean Arabic translation labels showing product country of origin (Indonesia), expiry parameters, and brand.',
        'Pesticide declaration: Exporters must present an explicit pesticide checklist showing zero synthetic organophosphate residues.'
      ],
      alertIcon: '⚠️ Shipments into Saudi Arabia, Dubai, or Qatar are carefully checked for Arabic print compliance and Halal seals.'
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ── BANNER ── */}
      <div className="bg-[#161b27] border border-[#2d3748] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#D4A017]" />
            Regulatory Trade Intelligence
          </h2>
          <p className="text-xs text-[#94a3b8] mt-1">Cross-border customs HS code classifications, biosecurity parameters, and chemical residue maximum levels.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* HS Code lookup left */}
        <div className="lg:col-span-5 bg-[#161b27] border border-[#2d3748] p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-[#2d3748] pb-3">
            <FileSearch className="w-4 h-4 text-blue-500" />
            HS Code Directory Search
          </h3>
          
          <div>
            <label className="block text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">Select Target Harmonized Code</label>
            <select
              value={selectedHS}
              onChange={(e) => setSelectedHS(e.target.value)}
              className="bg-[#1e2636] border border-[#2d3748] rounded-xl px-4 py-2 text-xs text-[#e6eaf0] focus:ring-1 focus:ring-[#2563eb] focus:outline-none w-full font-mono"
            >
              {Object.keys(hsCodeInformation).map((code) => (
                <option key={code} value={code}>{code} — {hsCodeInformation[code].description.substring(0, 30)}...</option>
              ))}
            </select>
          </div>

          <div className="bg-[#1e2636] p-4 rounded-xl space-y-3 text-xs leading-relaxed">
            <div>
              <p className="text-gray-400 font-bold uppercase text-[10px]">Tariff Code Description:</p>
              <p className="text-white font-medium mt-1">{hsCodeInformation[selectedHS].description}</p>
            </div>
            
            <div className="border-t border-[#2d3748] pt-2.5">
              <p className="text-[#D4A017] font-bold uppercase text-[10px]">Estimated Duty Tariffs:</p>
              <p className="text-white font-mono mt-1">{hsCodeInformation[selectedHS].generalTariff}</p>
            </div>

            <div className="border-t border-[#2d3748] pt-2.5">
              <p className="text-gray-400 font-bold uppercase text-[10px]">Required Permits:</p>
              <p className="text-[#bfdbfe] mt-1">{hsCodeInformation[selectedHS].permitNeeded}</p>
            </div>
          </div>
        </div>

        {/* Global Import Briefs Right */}
        <div className="lg:col-span-7 bg-[#161b27] border border-[#2d3748] p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="flex justify-between items-center border-b border-[#2d3748] pb-3">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Inbound Sanitary Market Briefs
              </h3>
              
              <div className="flex bg-[#1e2636] rounded p-1 gap-1">
                {(['EU', 'US', 'ANZ', 'GCC'] as const).map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedTopic(region)}
                    className={`px-3 py-1 rounded text-xs font-bold transition ${
                      selectedTopic === region ? 'bg-[#2563eb] text-white' : 'text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Brief Content */}
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-black text-white">{marketBriefs[selectedTopic].title}</h4>
                <p className="text-xs text-gray-400 mt-0.5">Primary Oversight entity: <strong className="text-gray-300 font-mono">{marketBriefs[selectedTopic].authority}</strong></p>
              </div>

              <div className="space-y-3">
                {marketBriefs[selectedTopic].rules.map((rule, idx) => (
                  <div key={idx} className="bg-[#1e2636]/60 p-3 rounded-xl border border-[#2d3748] text-xs flex gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-gray-300 leading-normal">{rule}</span>
                  </div>
                ))}
              </div>

              {/* Custom border highlight warning card */}
              <div className="bg-[#450a0a]/30 border-l-4 border-red-500 p-3 rounded text-xs text-red-300 font-medium">
                {marketBriefs[selectedTopic].alertIcon}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
