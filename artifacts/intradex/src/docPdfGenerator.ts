import { jsPDF } from 'jspdf';
import { DocumentType } from './types';

interface DocPayload {
  docNumber: string;
  issueDate: string;
  validityDays?: number;
  sellerName: string;
  sellerAddress: string;
  sellerCountry: string;
  sellerEmail?: string;
  sellerPhone?: string;
  buyerName: string;
  buyerAddress: string;
  buyerCountry: string;
  buyerEmail?: string;
  buyerPhone?: string;
  commodity: string;
  hsCode: string;
  volumeKg: number;
  pricePerKgUsd: number;
  totalUsd: number;
  packagingType: string;
  totalUnitsNeeded: number;
  loadingPort: string;
  destinationPort?: string;
  paymentTerms: string;
  bankDetails?: string;
  notes?: string;
  
  // Packing list specific
  shippingMark?: string;
  vessel?: string;

  // Shipping instruction specific
  carrier?: string;
  containerType?: string;
  numContainers?: number;
  notifyParty?: string;
  freightPayment?: string;

  // Contract specific
  governingLaw?: string;
  arbitration?: string;
  qualitySpecs?: string;
  deliveryPeriod?: string;
}

export function generateTradeDocumentPDF(
  docType: DocumentType,
  payload: DocPayload
): Blob {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Color Palette
  const PRIMARY_BLUE = [10, 77, 140]; // #0A4D8C
  const SECONDARY_GOLD = [212, 160, 23]; // #D4A017
  const TEXT_DARK = [31, 41, 55]; // #1F2937
  const TEXT_GRAY = [107, 114, 128]; // #6B7280
  const LIGHT_BG = [245, 247, 250]; // #F5F7FA
  const LINE_COLOR = [229, 231, 235]; // #E5E7EB

  // Coordinates Helper
  let y = 14;

  const addHeader = (title: string, sub: string) => {
    // Top banner
    doc.setFillColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
    doc.rect(10, y, 190, 20, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(15);
    doc.text(title.toUpperCase(), 15, y + 13);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(sub, 195, y + 11.5, { align: 'right' });
    
    // Gold Accent Stripe
    y += 20;
    doc.setFillColor(SECONDARY_GOLD[0], SECONDARY_GOLD[1], SECONDARY_GOLD[2]);
    doc.rect(10, y, 190, 1.5, 'F');
    y += 6;
  };

  const drawSectionTitle = (title: string) => {
    doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
    doc.rect(10, y, 190, 6.5, 'F');
    
    doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(title.toUpperCase(), 14, y + 4.5);
    y += 10;
  };

  const drawLine = () => {
    doc.setDrawColor(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2]);
    doc.setLineWidth(0.3);
    doc.line(10, y, 200, y);
    y += 4;
  };

  // --- BUILD DOCUMENT CONTENT ---

  // Page 1
  addHeader(docType, `InTradeX-Pro | PT Magastu Indoprime Group`);

  // Document Metadata Table (2 Columns)
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  
  doc.text(`${docType} Num:`, 12, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(payload.docNumber || 'INTRADEX-MOCK-001', 45, y);

  doc.setFont('Helvetica', 'bold');
  doc.text(`Issue Date:`, 115, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(payload.issueDate, 145, y);

  y += 5;

  doc.setFont('Helvetica', 'bold');
  doc.text(`Incoterm:`, 12, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(`${payload.destinationPort ? 'CIF ' + payload.destinationPort : 'FOB ' + payload.loadingPort}`, 45, y);

  doc.setFont('Helvetica', 'bold');
  doc.text(`Payment Term:`, 115, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(payload.paymentTerms || '100% T/T Advance', 145, y);

  y += 8;
  drawLine();

  // Parties Box side-by-side
  drawSectionTitle('Parties');
  
  // Column 1: Seller
  let col1Y = y;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.text('SELLER / EXPORTER', 12, col1Y);
  col1Y += 4.5;
  doc.setFontSize(9);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(payload.sellerName || 'PT Magastu Indoprime Group (MIG)', 12, col1Y);
  col1Y += 4.5;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(TEXT_GRAY[0], TEXT_GRAY[1], TEXT_GRAY[2]);
  
  const sAddrLines = doc.splitTextToSize(payload.sellerAddress || 'Jakarta, Indonesia', 85);
  doc.text(sAddrLines, 12, col1Y);
  col1Y += (sAddrLines.length * 4);
  doc.text(`Country: ${payload.sellerCountry || 'Indonesia'}`, 12, col1Y);
  col1Y += 4;
  if (payload.sellerEmail) {
    doc.text(`Email: ${payload.sellerEmail}`, 12, col1Y);
    col1Y += 4;
  }
  if (payload.sellerPhone) {
    doc.text(`Phone: ${payload.sellerPhone}`, 12, col1Y);
    col1Y += 4;
  }

  // Column 2: Buyer
  let col2Y = y;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.text('BUYER / CONSIGNEE', 110, col2Y);
  col2Y += 4.5;
  doc.setFontSize(9);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(payload.buyerName || 'Global Trading Corp', 110, col2Y);
  col2Y += 4.5;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(TEXT_GRAY[0], TEXT_GRAY[1], TEXT_GRAY[2]);

  const bAddrLines = doc.splitTextToSize(payload.buyerAddress || 'Hamburg, Germany', 85);
  doc.text(bAddrLines, 110, col2Y);
  col2Y += (bAddrLines.length * 4);
  doc.text(`Country: ${payload.buyerCountry || 'Germany'}`, 110, col2Y);
  col2Y += 4;
  if (payload.buyerEmail) {
    doc.text(`Email: ${payload.buyerEmail}`, 110, col2Y);
    col2Y += 4;
  }
  if (payload.buyerPhone) {
    doc.text(`Phone: ${payload.buyerPhone}`, 110, col2Y);
    col2Y += 4;
  }

  y = Math.max(col1Y, col2Y) + 5;
  drawLine();

  // Shipment / Commodity Details
  drawSectionTitle('Shipment & Commodity Details');
  
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  
  doc.text('Commodity:', 12, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(payload.commodity, 45, y);

  doc.setFont('Helvetica', 'bold');
  doc.text('HS Code:', 115, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(payload.hsCode || '—', 145, y);

  y += 5;

  doc.setFont('Helvetica', 'bold');
  doc.text('Net Weight:', 12, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(`${(payload.volumeKg || 0).toLocaleString()} Kg`, 45, y);

  doc.setFont('Helvetica', 'bold');
  doc.text('Port of Loading:', 115, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(payload.loadingPort || 'Tanjung Priok, Jakarta', 145, y);

  y += 5;

  doc.setFont('Helvetica', 'bold');
  doc.text('Packaging:', 12, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(`${payload.totalUnitsNeeded || 0} unit(s) of ${payload.packagingType || 'PP Woven Bag'}`, 45, y);

  if (payload.destinationPort) {
    doc.setFont('Helvetica', 'bold');
    doc.text('Port of Discharge:', 115, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(payload.destinationPort, 145, y);
  } else if (payload.vessel) {
    doc.setFont('Helvetica', 'bold');
    doc.text('Vessel/Carrier:', 115, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(payload.vessel, 145, y);
  }

  y += 7;
  drawLine();

  // Document Type Specific Data & Pricing Tables
  if (docType === 'Packing List') {
    drawSectionTitle('Weight Specification Details');
    
    // Table Draw header row
    doc.setFillColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
    doc.rect(10, y, 190, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('Package Mark', 13, y + 5);
    doc.text('Quantity', 55, y + 5);
    doc.text('Pack Type', 80, y + 5);
    doc.text('Net Wt (Kg)', 120, y + 5);
    doc.text('Gross Wt (Kg)', 160, y + 5);
    
    y += 7;
    
    // content row
    doc.setFillColor(255, 255, 255);
    doc.rect(10, y, 190, 8, 'F');
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.setFont('Helvetica', 'normal');
    doc.text(payload.shippingMark || 'MIG/SPICE/EXP', 13, y + 5);
    doc.text(`${payload.totalUnitsNeeded} pkgs`, 55, y + 5);
    doc.text(payload.packagingType, 80, y + 5);
    doc.text(`${(payload.volumeKg).toLocaleString()} Kg`, 120, y + 5);
    
    // Estimate gross
    const gross = payload.volumeKg * 1.02; // rough default tare
    doc.text(`${gross.toLocaleString()} Kg`, 160, y + 5);
    
    y += 12;
  } else if (docType === 'Shipping Instruction') {
    drawSectionTitle('Shipping Line & Logistics Mandates');
    
    doc.setFont('Helvetica', 'bold');
    doc.text(`Booking Carrier:`, 12, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(payload.carrier || 'Maersk Indonesian Line', 55, y);

    doc.setFont('Helvetica', 'bold');
    doc.text(`Container Booking:`, 115, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(`${payload.numContainers || 1} x ${payload.containerType || "20' GP"}`, 155, y);

    y += 5;

    doc.setFont('Helvetica', 'bold');
    doc.text(`Freight Payment:`, 12, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(payload.freightPayment || 'Prepaid at Source', 55, y);

    doc.setFont('Helvetica', 'bold');
    doc.text(`Notify Party:`, 115, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(payload.notifyParty || 'Same as Consignee', 155, y);

    y += 8;
  } else if (docType === 'Sales Contract') {
    drawSectionTitle('Governing Statutes & Commercial Clauses');
    
    doc.setFont('Helvetica', 'bold');
    doc.text(`Governing Law:`, 12, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(payload.governingLaw || 'Laws of the Republic of Indonesia', 55, y);
    y += 5;
    
    doc.setFont('Helvetica', 'bold');
    doc.text(`Arbitration Body:`, 12, y);
    doc.setFont('Helvetica', 'normal');
    
    const lines = doc.splitTextToSize(payload.arbitration || 'BANI (Indonesian National Board of Arbitration), Jakarta Seat.', 135);
    doc.text(lines, 55, y);
    y += (lines.length * 4);

    if (payload.qualitySpecs) {
      doc.setFont('Helvetica', 'bold');
      doc.text(`Quality Standard:`, 12, y);
      doc.setFont('Helvetica', 'normal');
      doc.text(payload.qualitySpecs, 55, y);
      y += 5;
    }
    
    y += 3;
  } else {
    // Quotations / Invoices (Price details)
    drawSectionTitle('Commercial Items & Rates');
    
    // Table Draw header row
    doc.setFillColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
    doc.rect(10, y, 190, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('Description', 13, y + 5);
    doc.text('HS Code', 75, y + 5);
    doc.text('Quantity (Kg)', 110, y + 5);
    doc.text('Rate (USD/Kg)', 140, y + 5);
    doc.text('Subtotal (USD)', 170, y + 5);
    
    y += 7;
    
    // content row
    doc.setFillColor(255, 255, 255);
    doc.rect(10, y, 190, 8, 'F');
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.setFont('Helvetica', 'normal');
    doc.text(payload.commodity, 13, y + 5);
    doc.text(payload.hsCode || '—', 75, y + 5);
    doc.text(`${(payload.volumeKg).toLocaleString()} Kg`, 110, y + 5);
    doc.text(`$ ${(payload.pricePerKgUsd || 0).toFixed(4)}`, 140, y + 5);
    doc.text(`$ ${(payload.totalUsd || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 170, y + 5);
    
    y += 8;
    
    // total summary row
    doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
    doc.rect(10, y, 190, 8, 'F');
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
    doc.text('TOTAL DECLARED CONTRACT VALUE (USD):', 13, y + 5);
    
    doc.text(`$ ${(payload.totalUsd || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 170, y + 5);
    y += 12;
  }

  // Legal / Terms Notes Footer
  if (payload.notes || payload.bankDetails) {
    if (y > 230) {
      doc.addPage();
      y = 15;
    }
    drawSectionTitle('Bank Coordinates & Binding Clauses');
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    
    if (payload.bankDetails) {
      doc.setFont('Helvetica', 'bold');
      doc.text('SWIFT BANK INSTRUCTIONS:', 12, y);
      doc.setFont('Helvetica', 'normal');
      y += 4;
      const bankLines = doc.splitTextToSize(payload.bankDetails, 180);
      doc.text(bankLines, 12, y);
      y += (bankLines.length * 4) + 2;
    }

    if (payload.notes) {
      doc.setFont('Helvetica', 'bold');
      doc.text('TERMS & REGULATORY PROVISIONS:', 12, y);
      doc.setFont('Helvetica', 'normal');
      y += 4;
      const notesLines = doc.splitTextToSize(payload.notes, 180);
      doc.text(notesLines, 12, y);
      y += (notesLines.length * 4) + 4;
    }
  }

  // Autograph Signatures (Strictly bounded to bottom of page 1 or page 2)
  if (y > 235) {
    doc.addPage();
    y = 20;
  } else {
    y = 245; // dock to page bottom
  }

  doc.setDrawColor(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2]);
  doc.line(10, y, 200, y);
  y += 4;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(PRIMARY_BLUE[0], PRIMARY_BLUE[1], PRIMARY_BLUE[2]);
  doc.text('AUTHORIZED SIGNATURES AND COMMITTED SEALS', 10, y);
  y += 5.5;

  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.setFontSize(8);
  doc.text('ISSUING EXPORTER REPRESENTATIVE', 15, y);
  doc.text('ACCEPTING BUYER REPRESENTATIVE', 115, y);
  
  y += 15;
  doc.setFont('Helvetica', 'normal');
  doc.text(`Name: ${payload.sellerName || 'PT Magastu Indoprime Group'}`, 15, y);
  doc.text(`Name: ${payload.buyerName || '________________________'}`, 115, y);

  y += 4;
  doc.text(`Date of Signature: ${payload.issueDate}`, 15, y);
  doc.text(`Date of Acceptance: ________________`, 115, y);

  // Return binary PDF stream
  return doc.output('blob');
}
