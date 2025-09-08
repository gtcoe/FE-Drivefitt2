interface RazorpayApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

interface CreateOrderRequest {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
  partial_payment?: boolean;
  first_payment_min_amount?: number;
}

interface CreateOrderResponse {
  id: string;
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: string;
  notes?: Record<string, string>;
  offer_id?: string | null;
  receipt: string;
  status: string;
}

interface PaymentDetails {
  id: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  method: string;
  description?: string;
  vpa?: string;
  email?: string;
  contact?: string;
  notes?: Record<string, string>;
  fee?: number;
  tax?: number;
  error_code?: string;
  error_description?: string;
  created_at: number;
}

class RazorpayApiClient {
  private baseUrl: string;
  private keyId: string;
  private keySecret: string;
  private authHeader: string;

  constructor() {
    this.baseUrl = "https://api.razorpay.com/v1";
    this.keyId = process.env.RAZORPAY_KEY_ID || "";
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    // Create Basic Auth header
    this.authHeader = `Basic cnpwX2xpdmVfUkJjQ2Ziek4zNWVXeDQ6ZjBkQWY0OXdPc2Nwb1paelE1SEp6a1VF`;
  }

  private async makeRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    data?: unknown
  ): Promise<RazorpayApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log("🌐 Making HTTP request:", { method, url, hasData: !!data });

      const options: RequestInit = {
        method,
        headers: {
          Authorization: this.authHeader,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      if (data && (method === "POST" || method === "PUT")) {
        options.body = JSON.stringify(data);
        console.log("📤 Request body:", data);
      }

      console.log("⏳ Sending request to Razorpay...");
      const response = await fetch(url, options);
      console.log("📥 Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      const responseData = await response.json();
      console.log("📋 Response data:", responseData);

      if (!response.ok) {
        return {
          success: false,
          error:
            responseData.error?.description ||
            `HTTP ${response.status}: ${response.statusText}`,
          statusCode: response.status,
        };
      }

      return {
        success: true,
        data: responseData,
        statusCode: response.status,
      };
    } catch (error) {
      console.error("Razorpay API request failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async createOrder(
    orderData: CreateOrderRequest
  ): Promise<RazorpayApiResponse<CreateOrderResponse>> {
    console.log("🚀 createOrder called with:", orderData);

    // Validate required fields
    if (!orderData.amount || orderData.amount < 10) {
      console.error("❌ Amount validation failed:", orderData.amount);
      return {
        success: false,
        error: "Amount must be at least 10 paise (₹0.10)",
      };
    }

    // Ensure amount is in paise (multiply by 100 if it looks like rupees)
    const amount = Math.round(orderData.amount * 100);
    console.log("💰 Amount conversion:", {
      original: orderData.amount,
      converted: amount,
    });

    const requestData = {
      amount: 100,
      currency: orderData.currency || "INR",
      receipt: orderData.receipt || `receipt_${Date.now()}`,
      notes: orderData.notes || {},
      ...(orderData.partial_payment !== undefined && {
        partial_payment: orderData.partial_payment,
      }),
      ...(orderData.first_payment_min_amount && {
        first_payment_min_amount: orderData.first_payment_min_amount,
      }),
    };

    console.log("🔍 Razorpay API Request Data:", requestData);
    console.log("🔑 Using credentials:", {
      keyId: this.keyId,
      hasSecret: !!this.keySecret,
      baseUrl: this.baseUrl,
    });

    return this.makeRequest<CreateOrderResponse>(
      "/orders",
      "POST",
      requestData
    );
  }

  async getOrder(
    orderId: string
  ): Promise<RazorpayApiResponse<CreateOrderResponse>> {
    if (!orderId) {
      return {
        success: false,
        error: "Order ID is required",
      };
    }

    return this.makeRequest<CreateOrderResponse>(`/orders/${orderId}`);
  }

  async getPayment(
    paymentId: string
  ): Promise<RazorpayApiResponse<PaymentDetails>> {
    if (!paymentId) {
      return {
        success: false,
        error: "Payment ID is required",
      };
    }

    return this.makeRequest<PaymentDetails>(`/payments/${paymentId}`);
  }

  async getOrderPayments(
    orderId: string
  ): Promise<RazorpayApiResponse<PaymentDetails[]>> {
    if (!orderId) {
      return {
        success: false,
        error: "Order ID is required",
      };
    }

    return this.makeRequest<PaymentDetails[]>(`/orders/${orderId}/payments`);
  }

  async capturePayment(
    paymentId: string,
    amount?: number
  ): Promise<RazorpayApiResponse<PaymentDetails>> {
    if (!paymentId) {
      return {
        success: false,
        error: "Payment ID is required",
      };
    }

    const requestData = amount ? { amount: Math.round(amount * 100) } : {};

    return this.makeRequest<PaymentDetails>(
      `/payments/${paymentId}/capture`,
      "POST",
      requestData
    );
  }

  async createRefund(
    paymentId: string,
    amount?: number,
    notes?: Record<string, string>
  ): Promise<
    RazorpayApiResponse<{
      id: string;
      amount: number;
      currency: string;
      status: string;
      created_at: number;
    }>
  > {
    if (!paymentId) {
      return {
        success: false,
        error: "Payment ID is required",
      };
    }

    const requestData = {
      ...(amount && { amount: Math.round(amount * 100) }),
      ...(notes && { notes }),
    };

    return this.makeRequest(
      `/payments/${paymentId}/refund`,
      "POST",
      requestData
    );
  }
}

// Export singleton instance
export const razorpayApiClient = new RazorpayApiClient();

// Export types for use in other files
export type {
  RazorpayApiResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  PaymentDetails,
};
