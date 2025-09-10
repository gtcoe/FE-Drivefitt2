import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import fs from "fs";
import path from "path";

// Extend jsPDF interface to include our custom property
interface ExtendedJsPDF extends jsPDF {
  lastAutoTable?: { finalY: number };
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  membershipType: string;
  paymentId: string;
  orderId: string;
}

export function generateInvoicePDF(data: InvoiceData): ExtendedJsPDF {
  const doc = new jsPDF() as ExtendedJsPDF;

  // Set document properties
  doc.setProperties({
    title: `Invoice - ${data.invoiceNumber}`,
    subject: "Drive FITT Membership Invoice",
    author: "Drive FITT",
    creator: "Drive FITT System",
  });

  // Company Logo (Top Left)
  // Define logo placement constants so we can position text reliably even if image fails
  const logoX = 20;
  const logoY = 23;
  const logoW = 40;
  const logoH = 12;
  try {
    // Read the logo image file and convert to base64
    const logoPath = path.join(
      process.cwd(),
      "public",
      "images",
      "logo-invoice2.jpg"
    );
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = logoBuffer.toString("base64");
    const logoDataUrl = `data:image/jpeg;base64,${logoBase64}`;

    // Add the logo image (fixed size)
    doc.addImage(logoDataUrl, "JPEG", logoX, logoY, logoW, logoH); // x, y, width, height
    console.log("✅ Logo image loaded successfully");
  } catch (error) {
    console.warn("Could not load logo image, falling back to text:", error);
    // Fallback to text if image fails to load
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Drive FITT", 20, 30);
  }

  // Company Information (existing block) - start below the logo
  const headerStartY = logoY + logoH + 10; // start below the logo
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const companyBlockStartY = headerStartY;
  doc.text("NM/Block-2/R2 LG", 20, companyBlockStartY);
  doc.text("11-18,46-57,UG 06-17,46-57", 20, companyBlockStartY + 4);
  doc.text("M3M 65th Avenue Sector-65", 20, companyBlockStartY + 8);
  doc.text("Gurgaon Haryana - 122022", 20, companyBlockStartY + 12);
  // IDs block
  const idsStartY = companyBlockStartY + 20;
  doc.text("GSTIN: 06AACCZ3846N1ZS", 20, idsStartY);
  doc.text("CIN: U93110DL2024FTC429911", 20, idsStartY + 4);
  doc.text("Phone: 9871836565", 20, idsStartY + 8);
  doc.text("Email: info@drivefitt.club", 20, idsStartY + 12);

  // Invoice Header (Top Right)
  // Right-aligned voucher block
  const pageWidth = (
    doc as unknown as { internal: { pageSize: { getWidth: () => number } } }
  ).internal.pageSize.getWidth();
  const rightMargin = 20;
  const rightX = pageWidth - rightMargin;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("RECEIPT VOUCHER", rightX, idsStartY - 3, { align: "right" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Receipt Number: ${data.invoiceNumber}`, rightX, idsStartY + 3, {
    align: "right",
  });
  doc.text(`Date: ${data.invoiceDate}`, rightX, idsStartY + 7, {
    align: "right",
  });
  doc.text(`Customer Name: ${data.customerName}`, rightX, idsStartY + 11, {
    align: "right",
  });
  doc.text(`Customer Number: ${data.customerPhone}`, rightX, idsStartY + 15, {
    align: "right",
  });
  doc.text(`Customer Email: ${data.customerEmail}`, rightX, idsStartY + 19, {
    align: "right",
  });

  // Itemized Details Table
  const tableY = idsStartY + 29;

  // Table headers
  const headers = [["Description", "Quantity", "Rate (Rs.)", "Amount (Rs.)"]];

  // Calculate GST values
  const subtotal = 846.61; // Before GST
  const gstAmount = 152.39; // 18% GST
  const totalAmount = 999.0;

  // Table data
  const tableData = [
    [
      "Pre-booking advance with respect to membership at Drive FITT Club",
      "1",
      "846.61",
      "846.61",
    ],
    ["Subtotal (before GST)", "", "", subtotal.toFixed(2)],
    ["GST @18% (IGST/CGST+SGST)", "", "", gstAmount.toFixed(2)],
    ["Total Amount (Rs.)", "", "", totalAmount.toFixed(2)],
  ];

  // Create table
  autoTable(doc, {
    head: headers,
    body: tableData,
    startY: tableY,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 2,
      lineWidth: 0.3,
      lineColor: [180, 180, 180],
    },
    headStyles: {
      fillColor: [128, 128, 128],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 10,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 70, halign: "left" }, // Description - wider for text
      1: { cellWidth: 30, halign: "center" }, // Quantity - compact
      2: { cellWidth: 30, halign: "center" }, // Rate - compact
      3: { cellWidth: 35, halign: "center" }, // Amount - compact
    },
    margin: { left: 20, right: 20 },
    didDrawPage: function (data: unknown) {
      // Store the final Y position of the table
      (doc as jsPDF & { lastAutoTable?: unknown }).lastAutoTable = data;
    },
  });

  // Amount in Words - positioned below table with minimal spacing
  const tableEndY = doc.lastAutoTable?.finalY || 150;
  const amountWordsY = tableEndY + 8; // Reduced space below table

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const amountWordsText = "Amount in Words:";
  doc.text(amountWordsText, 20, amountWordsY);
  const amountWordsWidth = doc.getTextWidth(amountWordsText);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    "  Nine Hundred Ninety-Nine Rupees Only.",
    20 + amountWordsWidth,
    amountWordsY
  );

  // Payment Terms - positioned below amount in words with minimal spacing
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const paymentTermsText = "Payment Terms:";
  doc.text(paymentTermsText, 20, amountWordsY + 10);
  const paymentTermsWidth = doc.getTextWidth(paymentTermsText);
  doc.setFont("helvetica", "normal");
  doc.text("  Immediate", 20 + paymentTermsWidth, amountWordsY + 10);

  // Footer note (as requested)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    "*This receipt voucher is computer-generated; no signature is required. Terms and Conditions apply.",
    105,
    amountWordsY + 115,
    {
      align: "center",
    }
  );
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(
    "24-7 Cricket Group India Private Limited",
    105,
    amountWordsY + 135,
    {
      align: "center",
    }
  );
  doc.setFont("helvetica", "normal");
  doc.text(
    "Registered Address: 5th Floor, DLF Centre, Savitri Cinema Complex, Greater Kailash-2, New Delhi - 110048",
    105,
    amountWordsY + 141,
    { align: "center" }
  );

  return doc;
}

export function generateInvoiceBuffer(data: InvoiceData): Buffer {
  const doc = generateInvoicePDF(data);
  const pdfBuffer = doc.output("arraybuffer");
  return Buffer.from(pdfBuffer);
}
