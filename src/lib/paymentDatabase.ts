import { executeQuery } from "./database";

// Create orders table
export const createOrdersTable = async (): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      razorpay_order_id VARCHAR(255) UNIQUE NOT NULL,
      user_id INT NOT NULL,
      membership_type INT NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'INR',
      receipt VARCHAR(255),
      invoice_number VARCHAR(50),
      status ENUM('created', 'attempted', 'paid', 'failed') DEFAULT 'created',
      notes JSON,
      razorpay_create_order_response JSON,
      razorpay_order_status_response JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  await executeQuery(query);
  console.log("Orders table created/verified");
};

// Create payments table
export const createPaymentsTable = async (): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      razorpay_payment_id VARCHAR(255) UNIQUE NOT NULL,
      order_id INT NOT NULL,
      user_id INT NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(3) DEFAULT 'INR',
      method ENUM('card', 'upi', 'netbanking', 'wallet', 'emi') NOT NULL,
      bank VARCHAR(100),
      card_id VARCHAR(255),
      wallet VARCHAR(100),
      vpa VARCHAR(255),
      email VARCHAR(255),
      contact VARCHAR(20),
      status ENUM('created', 'authorized', 'captured', 'failed', 'refunded') DEFAULT 'created',
      error_code VARCHAR(100),
      error_description TEXT,
      captured_at TIMESTAMP NULL,
      refunded_at TIMESTAMP NULL,
      refund_amount DECIMAL(10, 2) NULL,
      refund_status ENUM('pending', 'processed', 'failed') NULL,
      razorpay_payment_response JSON,
      razorpay_capture_response JSON,
      razorpay_refund_response JSON,
      razorpay_payment_status_response JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  await executeQuery(query);
  console.log("Payments table created/verified");
};

// Create memberships table
export const createMembershipsTable = async (): Promise<void> => {
  const query = `
    CREATE TABLE IF NOT EXISTS memberships (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      order_id INT NOT NULL,
      payment_id INT NOT NULL,
      membership_type INT NOT NULL,
      status ENUM('active', 'expired', 'cancelled', 'suspended') DEFAULT 'active',
      start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      end_date TIMESTAMP NOT NULL,
      cancelled_at TIMESTAMP NULL,
      cancellation_reason TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  await executeQuery(query);
  console.log("Memberships table created/verified");
};

// Insert order
export const insertOrder = async (order: Partial<Order>): Promise<number> => {
  const query = `
    INSERT INTO orders (
      razorpay_order_id, user_id, membership_type, amount, currency,
      receipt, invoice_number, status, notes, razorpay_create_order_response
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await executeQuery(query, [
    order.razorpay_order_id,
    order.user_id,
    order.membership_type,
    order.amount,
    order.currency || "INR",
    order.receipt || null,
    order.invoice_number || null,
    order.status || "created",
    order.notes ? JSON.stringify(order.notes) : null,
    order.razorpay_create_order_response
      ? JSON.stringify(order.razorpay_create_order_response)
      : null,
  ]);

  // Get the inserted ID
  const insertResult = await executeQuery<{ id: number }[]>(
    "SELECT LAST_INSERT_ID() as id",
    []
  );
  return insertResult[0]?.id || 0;
};

// Update order
export const updateOrder = async (
  orderId: number,
  updates: Partial<Order>
): Promise<void> => {
  const query = `
    UPDATE orders SET 
    status = ?, 
    notes = ?, 
    razorpay_order_status_response = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  await executeQuery(query, [
    updates.status || null,
    updates.notes ? JSON.stringify(updates.notes) : null,
    updates.razorpay_order_status_response
      ? JSON.stringify(updates.razorpay_order_status_response)
      : null,
    orderId,
  ]);
};

// Get order by ID
export const getOrderById = async (orderId: number): Promise<Order | null> => {
  const query = `SELECT * FROM orders WHERE id = ?`;
  const result = await executeQuery<Order[]>(query, [orderId]);
  return result.length > 0 ? result[0] : null;
};

// Get order by Razorpay order ID
export const getOrderByRazorpayId = async (
  razorpayOrderId: string
): Promise<Order | null> => {
  const query = `SELECT * FROM orders WHERE razorpay_order_id = ?`;
  const result = await executeQuery<Order[]>(query, [razorpayOrderId]);
  return result.length > 0 ? result[0] : null;
};

// Insert payment
export const insertPayment = async (
  payment: Partial<Payment>
): Promise<number> => {
  const query = `
    INSERT INTO payments (
      razorpay_payment_id, order_id, user_id, amount, currency, method,
      bank, card_id, wallet, vpa, email, contact, status,
      error_code, error_description, captured_at, refunded_at, refund_amount,
      refund_status, razorpay_payment_response, razorpay_capture_response,
      razorpay_refund_response, razorpay_payment_status_response
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await executeQuery(query, [
    payment.razorpay_payment_id,
    payment.order_id,
    payment.user_id,
    payment.amount,
    payment.currency || "INR",
    payment.method,
    payment.bank || null,
    payment.card_id || null,
    payment.wallet || null,
    payment.vpa || null,
    payment.email || null,
    payment.contact || null,
    payment.status || "created",
    payment.error_code || null,
    payment.error_description || null,
    payment.captured_at || null,
    payment.refunded_at || null,
    payment.refund_amount || null,
    payment.refund_status || null,
    payment.razorpay_payment_response
      ? JSON.stringify(payment.razorpay_payment_response)
      : null,
    payment.razorpay_capture_response
      ? JSON.stringify(payment.razorpay_capture_response)
      : null,
    payment.razorpay_refund_response
      ? JSON.stringify(payment.razorpay_refund_response)
      : null,
    payment.razorpay_payment_status_response
      ? JSON.stringify(payment.razorpay_payment_status_response)
      : null,
  ]);

  // Get the inserted ID
  const insertResult = await executeQuery<{ id: number }[]>(
    "SELECT LAST_INSERT_ID() as id",
    []
  );
  return insertResult[0]?.id || 0;
};

// Update payment
export const updatePayment = async (
  paymentId: number,
  updates: Partial<Payment>
): Promise<void> => {
  const query = `
    UPDATE payments SET 
    status = ?, 
    error_code = ?, 
    error_description = ?, 
    captured_at = ?, 
    refunded_at = ?, 
    refund_amount = ?, 
    refund_status = ?,
    razorpay_payment_response = ?,
    razorpay_capture_response = ?,
    razorpay_refund_response = ?,
    razorpay_payment_status_response = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  await executeQuery(query, [
    updates.status || null,
    updates.error_code || null,
    updates.error_description || null,
    updates.captured_at || null,
    updates.refunded_at || null,
    updates.refund_amount || null,
    updates.refund_status || null,
    updates.razorpay_payment_response
      ? JSON.stringify(updates.razorpay_payment_response)
      : null,
    updates.razorpay_capture_response
      ? JSON.stringify(updates.razorpay_capture_response)
      : null,
    updates.razorpay_refund_response
      ? JSON.stringify(updates.razorpay_refund_response)
      : null,
    updates.razorpay_payment_status_response
      ? JSON.stringify(updates.razorpay_payment_status_response)
      : null,
    paymentId,
  ]);
};

// Get payment by ID
export const getPaymentById = async (
  paymentId: number
): Promise<Payment | null> => {
  const query = `SELECT * FROM payments WHERE id = ?`;
  const result = await executeQuery<Payment[]>(query, [paymentId]);
  return result.length > 0 ? result[0] : null;
};

// Get payment by Razorpay payment ID
export const getPaymentByRazorpayId = async (
  razorpayPaymentId: string
): Promise<Payment | null> => {
  const query = `SELECT * FROM payments WHERE razorpay_payment_id = ?`;
  const result = await executeQuery<Payment[]>(query, [razorpayPaymentId]);
  return result.length > 0 ? result[0] : null;
};

// Insert membership
export const insertMembership = async (
  membership: Partial<Membership>
): Promise<number> => {
  const query = `
    INSERT INTO memberships (user_id, order_id, payment_id, membership_type, status, end_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const result = await executeQuery(query, [
    membership.user_id,
    membership.order_id,
    membership.payment_id,
    membership.membership_type,
    membership.status || "active",
    membership.end_date,
  ]);

  // Return the inserted ID directly from the result object (mySQL2, for example, returns insertId)
  return (result as { insertId?: number }).insertId || 0;
};

// Get membership by user_id
export const getMembershipByUserId = async (
  userId: number
): Promise<Membership | null> => {
  const query = `SELECT * FROM memberships WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`;
  const result = await executeQuery<Membership[]>(query, [userId]);
  return result.length > 0 ? result[0] : null;
};

// Initialize payment database tables
export const initializePaymentDatabase = async (): Promise<void> => {
  try {
    await createOrdersTable();
    await createPaymentsTable();
    await createMembershipsTable();
    console.log("Payment database tables initialized successfully");
  } catch (error) {
    console.error("Failed to initialize payment database:", error);
    throw error;
  }
};

// Helper function to generate invoice number
export const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `DF${year}${month}${day}${random}`;
};

// Helper function to calculate expiry date (1 year from now)
export const calculateExpiryDate = (): Date => {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  return expiryDate;
};

// Helper function to map Razorpay payment method to our enum
export const mapPaymentMethod = (razorpayMethod: string): PaymentMethod => {
  const methodMap: Record<string, PaymentMethod> = {
    card: PaymentMethod.CARD,
    upi: PaymentMethod.UPI,
    netbanking: PaymentMethod.NETBANKING,
    wallet: PaymentMethod.WALLET,
    emi: PaymentMethod.EMI,
  };
  return methodMap[razorpayMethod] || PaymentMethod.CARD;
};

// Types for the new structure
export interface Order {
  id?: number;
  razorpay_order_id: string;
  user_id: number;
  membership_type: number;
  amount: number;
  currency: string;
  receipt?: string | null;
  invoice_number?: string | null;
  status: OrderStatus;
  notes?: unknown | null;
  razorpay_create_order_response?: unknown | null;
  razorpay_order_status_response?: unknown | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface Payment {
  id?: number;
  razorpay_payment_id: string;
  order_id: number;
  user_id: number;
  amount: number;
  currency: string;
  method: PaymentMethod;
  bank?: string | null;
  card_id?: string | null;
  wallet?: string | null;
  vpa?: string | null;
  email?: string | null;
  contact?: string | null;
  status: PaymentStatus;
  error_code?: string | null;
  error_description?: string | null;
  captured_at?: Date | null;
  refunded_at?: Date | null;
  refund_amount?: number | null;
  refund_status?: RefundStatus | null;
  razorpay_payment_response?: unknown | null;
  razorpay_capture_response?: unknown | null;
  razorpay_refund_response?: unknown | null;
  razorpay_payment_status_response?: unknown | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface Membership {
  id?: number;
  user_id: number;
  order_id: number;
  payment_id: number;
  membership_type: number;
  status: MembershipStatus;
  start_date?: Date;
  end_date: Date;
  cancelled_at?: Date | null;
  cancellation_reason?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export enum OrderStatus {
  CREATED = "created",
  ATTEMPTED = "attempted",
  PAID = "paid",
  FAILED = "failed",
}

export enum PaymentStatus {
  CREATED = "created",
  AUTHORIZED = "authorized",
  CAPTURED = "captured",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum PaymentMethod {
  CARD = "card",
  UPI = "upi",
  NETBANKING = "netbanking",
  WALLET = "wallet",
  EMI = "emi",
}

export enum MembershipStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
  SUSPENDED = "suspended",
}

export enum RefundStatus {
  PENDING = "pending",
  PROCESSED = "processed",
  FAILED = "failed",
}
