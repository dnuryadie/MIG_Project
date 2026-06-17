import React, { useState, useRef, useEffect } from 'react';
import { FileText, Lock, Download, Printer, ArrowRight, Save, CircleCheck } from 'lucide-react';
import { UserProfile, DocumentType, DocumentRecord } from './types';
import { generateTradeDocumentPDF } from './docPdfGenerator';

interface TabExportDocsProps {
  user: UserProfile;
  syncedParams?: {
    commodity: string;
    volume: number;
    packType: string;
    country: string;
    destinationPort: string;
    exchangeRate: number;
  } | null;
  activeCalculation: any; // FOBOutputs or similar
  onSaveDocument: (docRecord: any) => void;
}

export default function TabExportDocs({ user, syncedParams, activeCalculation, onSaveDocument }: TabExportDocsProps) {
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('Quotation');

  // Input states
  const [docNumber, setDocNumber] = useState(`MIG-QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [validityDays, setValidityDays] = useState(30);

  // Seller detail
  const [sellerName, setSellerName] = useState('PT Magastu Indoprime Group (MIG)');
  const [sellerAddress, setSellerAddress] = useState('Gedung Menara MIG, Lantai 12, Jl. Sudirman No. 45, Jakarta Selatan');
  const [sellerCountry, setSellerCountry] = useState('Indonesia');
  const [sellerEmail, setSellerEmail] = useState('trade@magastu.com');
  const [sellerPhone, setSellerPhone] = useState('+62 21 5555 8899');

  // Buyer detail
  const [buyerName, setBuyerName] = useState('Global Spice Trading GmbH');
  const [buyerAddress, setBuyerAddress] = useState('Hafenstrasse 18, Block G, Hamburg');
  const [buyerCountry, setBuyerCountry] = useState('Germany');
  const [buyerEmail, setBuyerEmail] = useState('procurement@globalspicetrading.de');
  const [buyerPhone, setBuyerPhone] = useState('+49 40 8899 7711');

  // Specifics
  const [paymentTerms, setPaymentTerms] = useState('30% T/T Advance, 70% against Bill of Lading (B/L) copy');
  const [bankDetails, setBankDetails] = useState('Bank Name: Bank Mandiri (Persero) Tbk\nAccount Name: PT Magastu Indoprime Group\nAccount Number: 122-00-112233-9\nSWIFT Code: BMRIIDJA\nBank address: Sudirman Cabang, Jakarta.');
  const [notes, setNotes] = useState('1. This quotation is subject to final volume confirmation.\n2. Exporter will issue Phytosanitary and Halal Certificate upon final container seal.');

  // Packing list specific
  const [shippingMark, setShippingMark] = useState('MIG/SPICE/EXP - HAMBURG');
  const [vessel, setVessel] = useState('MV Spice Route V-102');

  // Shipping instruction specific
  const [carrier, setCarrier] = useState('Maersk Shipping Indonesia');
  const [containerType, setContainerType] = useState("20' GP (General Cargo)");
  const [numContainers, setNumContainers] = useState(1);
  const [notifyParty, setNotifyParty] = useState('Same as Consignee Address');
  const [freightPayment, setFreightPayment] = useState('Prepaid');

  // Sales contract specific
  const [governingLaw, setGoverningLaw] = useState('Laws of the Republic of Indonesia');
  const [arbitration, setArbitration] = useState('BANI (Indonesian National Board of Arbitration), Jakarta Seat. English language proceedings.');
  const [qualitySpecs, setQualitySpecs] = useState('Standard FAQ Grade: Moisture Max 13.5%, Purities Min 99%, No weed/insect infestation.');
  const [deliveryPeriod, setDeliveryPeriod] = useState('Inside 30 calendar days upon 30% deposit clearance.');

  // Check locking conditions
  const isLocked = user.role === 'free' && ['Commercial Invoice', 'Packing List', 'Shipping Instruction', 'Sales Contract'].includes(selectedDocType);

  // Dynamically auto-fill fields once from Tab 1 Sourcing data to prevent typing twice
  useEffect(() => {
    if (syncedParams) {
      setBuyerCountry(syncedParams.country);
      
      const portName = syncedParams.destinationPort.split(',')[0].toUpperCase();
      setShippingMark(`MIG/SPICE/EXP - ${portName}`);
      
      if (syncedParams.country === 'Germany') {
        setBuyerName('Global Spice Trading GmbH');
        setBuyerAddress('Hafenstrasse 18, Block G, Hamburg');
        setBuyerEmail('procurement@globalspicetrading.de');
        setBuyerPhone('+49 40 8899 7711');
      } else if (syncedParams.country === 'United States') {
        setBuyerName('AmeriSpices Import Corp');
        setBuyerAddress('742 Broadway Ave, Suite 400, New York, NY');
        setBuyerEmail('imports@amerispices.com');
        setBuyerPhone('+1 212 555 0199');
      } else {
        setBuyerName(`${syncedParams.country} Spice Import Partners`);
        setBuyerAddress(`Spices Central Terminal, ${syncedParams.destinationPort}`);
        setBuyerEmail(`trade@${syncedParams.country.toLowerCase().replace(/\s+/g, '')}imports.com`);
        setBuyerPhone('+31 20 6543 2100');
      }
    }
  }, [syncedParams]);

  // Synchronize values from Tab 2 active calculations
  const handlePreFillFromCalc = () => {
    if (!activeCalculation) {
      alert('⚠️ No active costing parameters available! Run a costing estimate first on the Incoterms Tab.');
      return;
    }
    setNotes((prev) => prev + `\n- Cost variables calculated: ${activeCalculation.commodity} for ${(activeCalculation.volumeKg).toLocaleString()} Kg at unit price of $ ${activeCalculation.fobPricePerKg || activeCalculation.cifPricePerKg || 0}/Kg.`);
    alert('✅ Pre-filled document from current active calculation coordinates!');
  };

  const getDocPayload = () => {
    // Dynamically pull values based on active calculation or standard
    const commodity = activeCalculation ? activeCalculation.commodity : 'Indonesian Cassia (Whole)';
    const hsCode = activeCalculation ? activeCalculation.hsCode : '0906.11';
    const volumeKg = activeCalculation ? activeCalculation.volumeKg : 5000;
    const pricePerKgUsd = activeCalculation ? (activeCalculation.fobPricePerKg || activeCalculation.cifPricePerKg || activeCalculation.ddpPricePerKg || 4.25) : 4.25;
    const totalUsd = activeCalculation ? (activeCalculation.fobTotalUsd || activeCalculation.cifTotalUsd || activeCalculation.ddpTotalUsd || (volumeKg * pricePerKgUsd)) : (volumeKg * pricePerKgUsd);
    const packagingType = activeCalculation ? activeCalculation.packagingType || 'PP Woven Bag 25 Kg' : 'PP Woven Bag 25 Kg';
    const totalUnitsNeeded = activeCalculation ? activeCalculation.totalUnitsNeeded || 200 : 200;
    const loadingPort = activeCalculation ? activeCalculation.loadingPort || 'Tanjung Priok, Jakarta' : 'Tanjung Priok, Jakarta';

    return {
      docNumber,
      issueDate,
      validityDays,
      sellerName,
      sellerAddress,
      sellerCountry,
      sellerEmail,
      sellerPhone,
      buyerName,
      buyerAddress,
      buyerCountry,
      buyerEmail,
      buyerPhone,
      commodity,
      hsCode,
      volumeKg,
      pricePerKgUsd,
      totalUsd,
      packagingType,
      totalUnitsNeeded,
      loadingPort,
      destinationPort: activeCalculation?.destinationPort,
      paymentTerms,
      bankDetails,
      notes,
      shippingMark,
      vessel,
      carrier,
      containerType,
      numContainers,
      notifyParty,
      freightPayment,
      governingLaw,
      arbitration,
      qualitySpecs,
      deliveryPeriod
    };
  };

  const handleDownloadPDF = () => {
    try {
      const payload = getDocPayload();
      const pdfBlob = generateTradeDocumentPDF(selectedDocType, payload);
      
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedDocType.replace(' ', '_')}_${docNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      // Save document to database
      onSaveDocument({
        documentType: selectedDocType,
        fileName: `${selectedDocType}_${docNumber}`,
        data: JSON.stringify(payload)
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Tab selection area */}
      <div className="flex flex-wrap bg-[#161b27] border border-[#2d3748] rounded-xl p-1 gap-1">
        {(['Quotation', 'Proforma Invoice', 'Commercial Invoice', 'Packing List', 'Shipping Instruction', 'Sales Contract'] as DocumentType[]).map((type) => {
          const isDocTypeLocked = user.role === 'free' && ['Commercial Invoice', 'Packing List', 'Shipping Instruction', 'Sales Contract'].includes(type);
          return (
            <button
              key={type}
              onClick={() => {
                setSelectedDocType(type);
                // Adjust doc number mapping
                const prefix = type === 'Quotation' ? 'QT' : type === 'Proforma Invoice' ? 'PI' : type === 'Commercial Invoice' ? 'CI' : type === 'Packing List' ? 'PL' : type === 'Shipping Instruction' ? 'SI' : 'SC';
                setDocNumber(`MIG-${prefix}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                selectedDocType === type ? 'bg-[#2563eb] text-white shadow' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {type}
              {isDocTypeLocked && <Lock className="w-3 h-3 text-[#D4A017]" />}
            </button>
          );
        })}
      </div>

      {isLocked ? (
        /* PRO UPGRADE ADVERTISEMENT PANEL */
        <div className="bg-[#161b27] border-2 border-[#D4A017] p-8 rounded-2xl text-center space-y-4 max-w-xl mx-auto shadow-xl my-6">
          <Lock className="w-12 h-12 text-[#D4A017] mx-auto animate-bounce" />
          <h3 className="font-extrabold text-[#D4A017] text-lg uppercase tracking-tight">🔒 InTradeX-Pro Document Locked</h3>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Commercial Invoice dispatching, weight-break packing lists, freight forwarding shipping instructions, and multi-clause international trade sales contracts are strictly reserved for verified <strong>InTradeX-Pro</strong> administrators.
          </p>
          <div className="bg-[#1e2636] p-3 rounded-lg border border-[#2d3748] text-xs font-mono text-gray-400">
            Available under Free Plan: <span className="text-[#16a34a] font-bold">Quotation &amp; Proforma Invoice</span>
          </div>
          <div className="text-[10px] text-gray-500 leading-none pt-2">
            File an upgrade claim form on the homepage panel to initiate account authorization.
          </div>
        </div>
      ) : (
        /* DYNAMIC FORM SHEETS AND PREVIEWS */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Inputs Column Left */}
          <div className="lg:col-span-5 bg-[#161b27] border border-[#2d3748] p-6 rounded-2xl space-y-5 max-h-[750px] overflow-y-auto pr-3">
            <div className="flex justify-between items-center border-b border-[#2d3748] pb-3">
              <h3 className="font-extrabold text-white text-base">Construct {selectedDocType}</h3>
              <button
                onClick={handlePreFillFromCalc}
                className="text-[10px] bg-[#1e2636] text-[#D4A017] border border-yellow-800/40 px-3 py-1.5 rounded-lg font-bold hover:bg-yellow-950 transition flex items-center gap-1"
              >
                Pre-fill Costing Coordinates
              </button>
            </div>

            {/* Document metadata inputs */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[#94a3b8] font-semibold uppercase mb-1">Doc Number</label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="bg-[#1e2636] border border-[#2d3748] rounded px-3 py-2 text-white w-full focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[#94a3b8] font-semibold uppercase mb-1">Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="bg-[#1e2636] border border-[#2d3748] rounded px-3 py-2 text-white w-full focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {selectedDocType === 'Quotation' && (
              <div className="text-xs">
                <label className="block text-[#94a3b8] font-semibold uppercase mb-1">Price Validity (Days)</label>
                <input
                  type="number"
                  value={validityDays}
                  onChange={(e) => setValidityDays(Number(e.target.value))}
                  className="bg-[#1e2636] border border-[#2d3748] rounded px-3 py-2 text-white w-full focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* SELLER / BUYER BOXES */}
            <details open className="group">
              <summary className="text-xs font-bold text-gray-400 group-open:text-white cursor-pointer select-none mb-2 hover:text-white uppercase tracking-wider flex items-center justify-between">
                <span>🏢 Seller &amp; Buyer Entities</span>
                <span className="text-[10px] text-blue-500 tracking-wide">Edit Details</span>
              </summary>
              <div className="space-y-4 pt-1 pl-1 border-l border-gray-800">
                <div className="space-y-2 text-xs">
                  <p className="font-bold text-white border-b border-[#2d3748] pb-1">Seller Coordinates</p>
                  <input
                    type="text"
                    placeholder="Seller Name"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="bg-[#1e2636] border border-[#2d3748] rounded p-2 text-white w-full"
                  />
                  <textarea
                    placeholder="Seller Full Address"
                    rows={2}
                    value={sellerAddress}
                    onChange={(e) => setSellerAddress(e.target.value)}
                    className="bg-[#1e2636] border border-[#2d3748] rounded p-2 text-white w-full"
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <p className="font-bold text-white border-b border-[#2d3748] pb-1">Buyer Coordinates</p>
                  <input
                    type="text"
                    placeholder="Buyer Name"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="bg-[#1e2636] border border-[#2d3748] rounded p-2 text-white w-full"
                  />
                  <textarea
                    placeholder="Buyer Full Address"
                    rows={2}
                    value={buyerAddress}
                    onChange={(e) => setBuyerAddress(e.target.value)}
                    className="bg-[#1e2636] border border-[#2d3748] rounded p-2 text-white w-full"
                  />
                </div>
              </div>
            </details>

            {/* DOCUMENT-SPECIFIC PARAMS */}
            {selectedDocType === 'Packing List' && (
              <div className="space-y-3 text-xs">
                <p className="font-bold text-white uppercase tracking-wider">PL Cargo Parameters</p>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Shipping Marks</label>
                  <input
                    type="text"
                    value={shippingMark}
                    onChange={(e) => setShippingMark(e.target.value)}
                    className="bg-[#1e2636] border border-[#2d3748] rounded p-2 text-white w-full"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Carrying Vessel</label>
                  <input
                    type="text"
                    value={vessel}
                    onChange={(e) => setVessel(e.target.value)}
                    className="bg-[#1e2636] border border-[#2d3748] rounded p-2 text-white w-full"
                  />
                </div>
              </div>
            )}

            {selectedDocType === 'Shipping Instruction' && (
              <div className="space-y-3 text-xs">
                <p className="font-bold text-white uppercase tracking-wider">SI Booking Parameters</p>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Carrying Ocean Carrier</label>
                  <input
                    type="text"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="bg-[#1e2636] border border-[#2d3748] rounded p-2 text-white w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#94a3b8] mb-1">Container Size</label>
                    <input
                      type="text"
                      value={containerType}
                      onChange={(e) => setContainerType(e.target.value)}
                      className="bg-[#1e2636] border border-[#2d3748] rounded p-2 text-white w-full animate-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#94a3b8] mb-1">Container Qty</label>
                    <input
                      type="number"
                      value={numContainers}
                      onChange={(e) => setNumContainers(Number(e.target.value))}
                      className="bg-[#1e2636] border border-[#2d3748] rounded p-2 text-white w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Notify Party</label>
                  <input
                    type="text"
                    value={notifyParty}
                    onChange={(e) => setNotifyParty(e.target.value)}
                    className="bg-[#1e2636] border border-[#2d3748] rounded p-2 text-white w-full"
                  />
                </div>
              </div>
            )}

            {selectedDocType === 'Sales Contract' && (
              <div className="space-y-3 text-xs">
                <p className="font-bold text-white uppercase tracking-wider">Contract legal Terms</p>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Governing Law Jurisdiction</label>
                  <input
                    type="text"
                    value={governingLaw}
                    onChange={(e) => setGoverningLaw(e.target.value)}
                    className="bg-[#1e2636] border border-[#2d3748] rounded p-2 text-white w-full"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Arbitration Protocol</label>
                  <textarea
                    rows={2}
                    value={arbitration}
                    onChange={(e) => setArbitration(e.target.value)}
                    className="bg-[#1e2636] border border-[#2d3748] rounded p-2 text-white w-full"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Quality Specifications Guarantee</label>
                  <textarea
                    rows={2}
                    value={qualitySpecs}
                    onChange={(e) => setQualitySpecs(e.target.value)}
                    className="bg-[#1e2636] border border-[#2d3748] rounded p-2 text-white w-full"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] mb-1">Allowed Delivery Window</label>
                  <input
                    type="text"
                    value={deliveryPeriod}
                    onChange={(e) => setDeliveryPeriod(e.target.value)}
                    className="bg-[#1e2636] border border-[#2d3748] rounded p-2 text-white w-full"
                  />
                </div>
              </div>
            )}

            {/* Standard Bank instructions/commercial declarations */}
            <div className="space-y-3 text-xs border-t border-[#2d3748] pt-4">
              <p className="font-bold text-white uppercase tracking-wider">L/C BANK DETAILS &amp; DISCLOSURES</p>
              <div>
                <label className="block text-[#94a3b8] mb-1">Sellers SWIFT Coordinates</label>
                <textarea
                  rows={3}
                  value={bankDetails}
                  onChange={(e) => setBankDetails(e.target.value)}
                  className="bg-[#1e2636] border border-[#2d3748] rounded p-2 text-white w-full font-mono text-[10px]"
                />
              </div>
              <div>
                <label className="block text-[#94a3b8] mb-1">General Commercial Notes / Disclaimers</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-[#1e2636] border border-[#2d3748] rounded p-2 text-white w-full"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#2d3748] grid grid-cols-2 gap-3">
              <button
                onClick={handleDownloadPDF}
                className="bg-[#16a34a] hover:bg-[#15803d] text-white py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4 shrink-0" />
                Download PDF
              </button>
              <button
                onClick={handleBrowserPrint}
                className="bg-[#1e2636] hover:bg-[#2d3748] border border-[#2d3748] text-white py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4 shrink-0" />
                Print Document
              </button>
            </div>
          </div>

          {/* Visual Document Invoice Sheet Preview Column Right */}
          <div className="lg:col-span-7 bg-[#1c2331] border border-[#2d3748] p-6 sm:p-8 rounded-2xl max-h-[750px] overflow-y-auto pr-3">
            <div id="print-area" className="bg-white rounded-lg p-6 sm:p-8 text-black shadow-inner space-y-6">
              
              {/* PRINT STYLE INJECTOR */}
              <style dangerouslySetInnerHTML={{__html: `
                @media print {
                  body * { visibility: hidden; background: white; color: black; }
                  #print-area, #print-area * { visibility: visible; }
                  #print-area { position: absolute; left: 0; top: 0; width: 210mm; height: 297mm; padding: 20mm; }
                }
              `}}/>

              {/* Title Banner */}
              <div className="border-b-4 border-[#0e1117] pb-4 flex justify-between items-center bg-[#0A4D8C] text-white p-4 rounded">
                <div>
                  <h2 className="text-xl font-bold tracking-widest leading-none uppercase">{selectedDocType}</h2>
                  <p className="text-[10px] font-mono tracking-wide mt-1">InTradeX™ Platform Global B2B Exporter Series</p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-sm border-2 border-white px-2 py-0.5 rounded tracking-wide">MIG</span>
                </div>
              </div>

              {/* Doc Metadata details */}
              <div className="grid grid-cols-2 gap-6 text-xs border-b border-gray-200 pb-4">
                <div>
                  <p className="text-gray-500 font-semibold">DOCUMENT REFERENCE</p>
                  <p className="font-extrabold text-sm font-mono mt-0.5">{docNumber}</p>
                  <p className="text-gray-400 mt-1">Filing date: {issueDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 font-semibold">SHIPPING TERMS</p>
                  <p className="font-bold text-sm mt-0.5">{activeCalculation ? `${activeCalculation.calculationType} ${activeCalculation.loadingPort || activeCalculation.destinationPort || 'Tanjung Priok, ID'}` : 'FOB Port of Jakarta, Indonesia'}</p>
                  <p className="text-gray-400 mt-1">Payment Method: {paymentTerms.substring(0, 30)}...</p>
                </div>
              </div>

              {/* SELLER / BUYER BOXES PREVIEW */}
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-gray-200 pb-4">
                <div>
                  <p className="text-[#0A4D8C] font-extrabold uppercase mb-1">MIG SELLER EXPORTER</p>
                  <p className="font-bold text-[#1f2937]">{sellerName}</p>
                  <p className="text-gray-500 leading-normal mt-1">{sellerAddress}</p>
                  <p className="text-gray-500 font-semibold mt-1">Email: {sellerEmail} | Tel: {sellerPhone}</p>
                </div>
                <div>
                  <p className="text-[#0A4D8C] font-extrabold uppercase mb-1">CONSIGNEE IMPORT BUYER</p>
                  <p className="font-bold text-[#1f2937]">{buyerName}</p>
                  <p className="text-gray-500 leading-normal mt-1">{buyerAddress}</p>
                  <p className="text-gray-500 font-semibold mt-1">Email: {buyerEmail} | Country: {buyerCountry}</p>
                </div>
              </div>

              {/* CARGO & WEIGHT CHART PREVIEW */}
              <div className="space-y-2 text-xs">
                <p className="text-[#0A4D8C] font-extrabold uppercase tracking-wide">EXPORT CARGO CONFIGURATION DETAILS</p>
                <div className="bg-[#f8fafc] border border-gray-200 p-3 rounded-lg grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-gray-400 block uppercase text-[10px]">Commodity Name:</span>
                    <strong className="text-gray-900">{activeCalculation ? activeCalculation.commodity : 'Indonesian Cassia (Whole)'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[10px]">HS Customs Code:</span>
                    <strong className="text-gray-900 font-mono">{activeCalculation ? activeCalculation.hsCode : '0906.11'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[10px]">Cargo Origin:</span>
                    <strong className="text-gray-900">{activeCalculation ? activeCalculation.origin : 'Sumatra, Indonesia'}</strong>
                  </div>

                  <div className="border-t border-gray-200 pt-2">
                    <span className="text-gray-400 block uppercase text-[10px]">Net Shipped Weight:</span>
                    <strong className="text-gray-900 font-mono">{activeCalculation ? (activeCalculation.volumeKg).toLocaleString() : '5,000'} Kg</strong>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <span className="text-gray-400 block uppercase text-[10px]">Est Gross Weight:</span>
                    <strong className="text-[#16a34a] font-mono">{activeCalculation ? (activeCalculation.grossWeightKg || activeCalculation.volumeKg * 1.02).toLocaleString() : '5,100'} Kg</strong>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <span className="text-gray-400 block uppercase text-[10px]">Packaging units count:</span>
                    <strong className="text-gray-900">{activeCalculation ? activeCalculation.totalUnitsNeeded : '200'} unit(s)</strong>
                  </div>
                </div>
              </div>

              {/* COMMODITY VALUE TABLE PREVIEW */}
              {selectedDocType !== 'Packing List' && selectedDocType !== 'Shipping Instruction' && (
                <div className="space-y-2">
                  <div className="bg-[#0A4D8C] text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider flex justify-between">
                    <span>Transaction Cargo Description</span>
                    <span>Subtotal Sum</span>
                  </div>
                  <div className="text-xs space-y-1.5 border-b border-gray-300 pb-2">
                    <div className="flex justify-between items-center text-gray-800">
                      <span>{activeCalculation ? activeCalculation.commodity : 'Indonesian Cassia (Whole)'} &nbsp;·&nbsp; {activeCalculation ? activeCalculation.volumeKg : 5000} Kg @ $ {activeCalculation ? (activeCalculation.fobPricePerKg || activeCalculation.cifPricePerKg || 4.25).toFixed(4) : '4.2500'}/Kg</span>
                      <strong className="font-mono">$ {activeCalculation ? (activeCalculation.fobTotalUsd || activeCalculation.cifTotalUsd || activeCalculation.ddpTotalUsd || 21250).toLocaleString(undefined, {minimumFractionDigits: 2}) : '21,250.00'}</strong>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-[#f8fafc] p-2.5 rounded border border-gray-200 font-bold text-xs text-[#0a4d8c]">
                    <span>DECLARED FOB PORTS INVOICE VALUE SUM (USD):</span>
                    <strong className="font-mono text-sm">$ {activeCalculation ? (activeCalculation.fobTotalUsd || activeCalculation.cifTotalUsd || activeCalculation.ddpTotalUsd || 21250).toLocaleString(undefined, {minimumFractionDigits: 2}) : '21,250.00'}</strong>
                  </div>
                </div>
              )}

              {/* Specific previews */}
              {selectedDocType === 'Packing List' && (
                <div className="text-xs space-y-1 bg-yellow-50/20 border border-yellow-200 p-3 rounded">
                  <p className="font-bold text-yellow-800 text-[10px] uppercase">📦 PACKING LIST LOGISTICAL DETAILS</p>
                  <p className="text-gray-600">Carton Shipping Marks: <strong>{shippingMark}</strong></p>
                  <p className="text-gray-600">Carrying Vessel: <strong>{vessel}</strong> &nbsp;·&nbsp; Packaging Format: <strong>{activeCalculation?.packagingType || 'PP Woven Bag 25 Kg'}</strong></p>
                </div>
              )}

              {selectedDocType === 'Shipping Instruction' && (
                <div className="text-xs space-y-1 bg-indigo-50/20 border border-indigo-200 p-3 rounded">
                  <p className="font-bold text-indigo-800 text-[10px] uppercase">🚢 SHIPPING LINE BOOKINGS DISCLOSURE</p>
                  <p className="text-gray-600">Ocean Carrier: <strong>{carrier}</strong></p>
                  <p className="text-gray-600">Container Size: <strong>{containerType}</strong> &nbsp;·&nbsp; Carriage pay: <strong>{freightPayment}</strong></p>
                </div>
              )}

              {selectedDocType === 'Sales Contract' && (
                <div className="text-xs space-y-1 bg-gray-50 border border-gray-200 p-3 rounded leading-normal">
                  <p className="font-bold text-gray-800 text-[10px] uppercase">📜 SALES CONTRACT LEGAL CLAUSES</p>
                  <p className="text-gray-600">Choice of Governing Law: <strong>{governingLaw}</strong></p>
                  <p className="text-gray-600">Arbitration Forum: <strong>{arbitration}</strong></p>
                  <p className="text-gray-600">Delivery Period Limit: <strong>{deliveryPeriod}</strong></p>
                </div>
              )}

              {/* BANK & CLAUSES VIEW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] leading-relaxed text-gray-500">
                <div>
                  <p className="font-bold text-gray-700">SWIFT TELEGRAPHIC TRANSFER ROUTING:</p>
                  <p className="font-mono whitespace-pre-wrap text-[9px] mt-1 bg-gray-50 p-2 rounded border border-gray-200">{bankDetails}</p>
                </div>
                <div>
                  <p className="font-bold text-gray-700">COMMENTS &amp; GENERAL CONTRACT PROVISIONS:</p>
                  <p className="whitespace-pre-wrap mt-1 bg-gray-50 p-2 rounded border border-gray-200">{notes}</p>
                </div>
              </div>

              {/* AUTOGRAPH SEAL DOCK */}
              <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-6 text-[10px] text-gray-600 uppercase font-semibold">
                <div>
                  <p className="text-[#0a4d8c] font-bold">ISSUING GOVERNMENT EXPORTER SIGNATURE</p>
                  <div className="h-12 border-b border-gray-300 mb-1"></div>
                  <p className="mt-1 font-bold">{sellerName}</p>
                  <p className="text-gray-400">Date: {issueDate}</p>
                </div>
                <div>
                  <p className="text-[#0a4d8c] font-bold">ACCEPTING OVERSEAS BUYER SIGNATURE</p>
                  <div className="h-12 border-b border-gray-300 mb-1"></div>
                  <p className="mt-1 font-bold">{buyerName}</p>
                  <p className="text-gray-400">Date: ________________________</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
