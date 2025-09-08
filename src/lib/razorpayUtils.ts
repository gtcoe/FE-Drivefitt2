import { razorpayApiClient } from "./razorpayApiClient";

/**
 * Utility functions for Razorpay operations
 */

/**
 * Verify if a payment is actually completed by checking with Razorpay API
 */
export async function verifyPaymentCompletion(
  paymentId: string,
  orderId: string
): Promise<{
  isValid: boolean;
  paymentDetails?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    order_id: string;
    method: string;
    created_at: number;
  };
  error?: string;
}> {
  try {
    const paymentResponse = await razorpayApiClient.getPayment(paymentId);

    if (!paymentResponse.success) {
      return {
        isValid: false,
        error: paymentResponse.error || "Failed to fetch payment details",
      };
    }

    const paymentDetails = paymentResponse.data!;

    // Check if payment is in a completed state
    const isCompleted =
      paymentDetails.status === "captured" ||
      paymentDetails.status === "authorized";

    // Verify order ID matches
    const orderMatches = paymentDetails.order_id === orderId;

    if (!isCompleted) {
      return {
        isValid: false,
        error: `Payment not completed. Status: ${paymentDetails.status}`,
      };
    }

    if (!orderMatches) {
      return {
        isValid: false,
        error: `Order ID mismatch. Expected: ${orderId}, Got: ${paymentDetails.order_id}`,
      };
    }

    return {
      isValid: true,
      paymentDetails,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get order details and verify its status
 */
export async function getOrderDetails(orderId: string): Promise<{
  success: boolean;
  orderDetails?: {
    id: string;
    amount: number;
    amount_due: number;
    amount_paid: number;
    attempts: number;
    created_at: number;
    currency: string;
    entity: string;
    receipt: string;
    status: string;
  };
  error?: string;
}> {
  try {
    const orderResponse = await razorpayApiClient.getOrder(orderId);

    if (!orderResponse.success) {
      return {
        success: false,
        error: orderResponse.error || "Failed to fetch order details",
      };
    }

    return {
      success: true,
      orderDetails: orderResponse.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get all payments for an order
 */
export async function getOrderPayments(orderId: string): Promise<{
  success: boolean;
  payments?: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    order_id: string;
    method: string;
    created_at: number;
  }>;
  error?: string;
}> {
  try {
    const paymentsResponse = await razorpayApiClient.getOrderPayments(orderId);

    if (!paymentsResponse.success) {
      return {
        success: false,
        error: paymentsResponse.error || "Failed to fetch order payments",
      };
    }

    return {
      success: true,
      payments: paymentsResponse.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Capture an authorized payment
 */
export async function captureAuthorizedPayment(
  paymentId: string,
  amount?: number
): Promise<{
  success: boolean;
  paymentDetails?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    order_id: string;
    method: string;
    created_at: number;
  };
  error?: string;
}> {
  try {
    const captureResponse = await razorpayApiClient.capturePayment(
      paymentId,
      amount
    );

    if (!captureResponse.success) {
      return {
        success: false,
        error: captureResponse.error || "Failed to capture payment",
      };
    }

    return {
      success: true,
      paymentDetails: captureResponse.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Create a refund for a payment
 */
export async function createRefund(
  paymentId: string,
  amount?: number,
  notes?: Record<string, string>
): Promise<{
  success: boolean;
  refundDetails?: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    created_at: number;
  };
  error?: string;
}> {
  try {
    const refundResponse = await razorpayApiClient.createRefund(
      paymentId,
      amount,
      notes
    );

    if (!refundResponse.success) {
      return {
        success: false,
        error: refundResponse.error || "Failed to create refund",
      };
    }

    return {
      success: true,
      refundDetails: refundResponse.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Validate webhook event by cross-referencing with API
 */
export async function validateWebhookEvent(event: {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        status: string;
      };
    };
    order: {
      entity: {
        id: string;
        status: string;
      };
    };
  };
}): Promise<{
  isValid: boolean;
  error?: string;
}> {
  try {
    if (
      event.event === "payment.captured" ||
      event.event === "payment.failed"
    ) {
      const payment = event.payload.payment.entity;
      const paymentResponse = await razorpayApiClient.getPayment(payment.id);

      if (!paymentResponse.success) {
        return {
          isValid: false,
          error: "Failed to verify payment details",
        };
      }

      const apiPayment = paymentResponse.data!;

      // Check if the webhook payment status matches API status
      const webhookStatus =
        event.event === "payment.captured" ? "captured" : "failed";
      if (apiPayment.status !== webhookStatus) {
        return {
          isValid: false,
          error: `Status mismatch: webhook=${webhookStatus}, api=${apiPayment.status}`,
        };
      }

      return { isValid: true };
    }

    // For other events, we can add specific validation logic
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
