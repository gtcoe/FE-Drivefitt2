/*
  Node script to generate a sample invoice PDF using the ORIGINAL invoice template
  implementation in src/utils/invoiceGenerator.ts. No duplication of template logic.
*/

import fs from "fs";
import path from "path";
import {
  generateInvoiceBuffer,
  InvoiceData,
} from "../src/utils/invoiceGenerator";

async function main() {
  const data: InvoiceData = {
    invoiceNumber: `DFTEST-${Date.now()}`,
    invoiceDate: new Date().toLocaleDateString("en-IN"),
    customerName: "Test User",
    customerEmail: "test@example.com",
    customerPhone: "+91 9876543210",
    amount: 999,
    membershipType: "Individual Annual Plan",
    paymentId: "pay_TEST123",
    orderId: "order_TEST123",
  };

  const buffer = generateInvoiceBuffer(data);

  const outDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const filePath = path.join(
    outDir,
    `test-invoice-${new Date().toISOString().replace(/[:.]/g, "-")}.pdf`
  );
  fs.writeFileSync(filePath, buffer);
  // eslint-disable-next-line no-console
  console.log("✔ Sample invoice generated at:", filePath);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to generate sample invoice:", err);
  process.exit(1);
});
