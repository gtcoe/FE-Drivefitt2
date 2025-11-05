import { NextResponse } from "next/server";
import {
  getOrderDetails,
  getOrderPayments,
  verifyPaymentCompletion,
} from "@/lib/razorpayUtils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const paymentId = searchParams.get("paymentId");

    if (!orderId && !paymentId) {
      return NextResponse.json(
        { error: "Either orderId or paymentId is required" },
        { status: 400 }
      );
    }

    const responseData: {
      order?: {
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
      payments?: Array<{
        id: string;
        amount: number;
        currency: string;
        status: string;
        order_id: string;
        method: string;
        created_at: number;
      }>;
      paymentVerification?: {
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
      };
      payment?: {
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
      };
    } = {};

    // Get order details if orderId is provided
    if (orderId) {
      console.log("Fetching order details:", orderId);
      const orderResponse = await getOrderDetails(orderId);

      if (!orderResponse.success) {
        return NextResponse.json(
          {
            error: "Failed to fetch order details",
            details: orderResponse.error,
          },
          { status: 500 }
        );
      }

      responseData.order = orderResponse.orderDetails;

      // Get payments for this order
      const paymentsResponse = await getOrderPayments(orderId);
      if (paymentsResponse.success) {
        responseData.payments = paymentsResponse.payments;
      }
    }

    // Get payment details if paymentId is provided
    if (paymentId) {
      console.log("Fetching payment details:", paymentId);

      if (orderId) {
        // Verify payment completion if both orderId and paymentId are provided
        const verification = await verifyPaymentCompletion(paymentId, orderId);
        responseData.paymentVerification = verification;
      } else {
        // Just get payment details
        const { razorpayApiClient } = await import("@/lib/razorpayApiClient");
        const paymentResponse = await razorpayApiClient.getPayment(paymentId);

        if (!paymentResponse.success) {
          return NextResponse.json(
            {
              error: "Failed to fetch payment details",
              details: paymentResponse.error,
            },
            { status: 500 }
          );
        }

        responseData.payment = paymentResponse.data;
      }
    }

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Failed to fetch payment/order details:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
