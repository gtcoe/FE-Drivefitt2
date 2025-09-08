import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import {
  getOrderByRazorpayId,
  getPaymentByRazorpayId,
  updateOrder,
  updatePayment,
  OrderStatus,
  PaymentStatus,
} from "@/lib/paymentDatabase";
import { validateWebhookEvent } from "@/lib/razorpayUtils";

// Handle payment captured event
const handlePaymentCaptured = async (payment: {
  id: string;
  order_id: string;
}) => {
  try {
    console.log("Payment captured webhook received:", payment.id);

    // Get order by razorpay_order_id
    const order = await getOrderByRazorpayId(payment.order_id);
    if (!order) {
      console.error("Order not found for webhook:", payment.order_id);
      return;
    }

    // Get payment by razorpay_payment_id
    const paymentRecord = await getPaymentByRazorpayId(payment.id);
    if (!paymentRecord) {
      console.error("Payment record not found for webhook:", payment.id);
      return;
    }

    // Update payment status
    await updatePayment(paymentRecord.id!, {
      status: PaymentStatus.CAPTURED,
      captured_at: new Date(),
      razorpay_payment_status_response: payment,
    });

    // Update order status
    await updateOrder(order.id!, {
      status: OrderStatus.PAID,
      razorpay_order_status_response: payment,
    });

    console.log("Payment status updated successfully via webhook");
  } catch (error) {
    console.error("Error handling payment captured:", error);
  }
};

// Handle payment failed event
const handlePaymentFailed = async (payment: {
  id: string;
  order_id: string;
  error_code?: string;
  error_description?: string;
}) => {
  try {
    console.log("Payment failed webhook received:", payment.id);

    // Get order by razorpay_order_id
    const order = await getOrderByRazorpayId(payment.order_id);
    if (!order) {
      console.error("Order not found for webhook:", payment.order_id);
      return;
    }

    // Get payment by razorpay_payment_id
    const paymentRecord = await getPaymentByRazorpayId(payment.id);
    if (!paymentRecord) {
      console.error("Payment record not found for webhook:", payment.id);
      return;
    }

    // Update payment status
    await updatePayment(paymentRecord.id!, {
      status: PaymentStatus.FAILED,
      error_code: payment.error_code,
      error_description: payment.error_description,
      razorpay_payment_status_response: payment,
    });

    // Update order status
    await updateOrder(order.id!, {
      status: OrderStatus.FAILED,
      razorpay_order_status_response: payment,
    });

    console.log("Payment failure recorded successfully via webhook");
  } catch (error) {
    console.error("Error handling payment failed:", error);
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("X-Razorpay-Signature");

    if (!signature) {
      console.error("Missing webhook signature");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(body, signature);

    if (!isValid) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log("Webhook event received:", event.event);

    // Validate webhook event with Razorpay API
    const validation = await validateWebhookEvent(event);
    if (!validation.isValid) {
      console.error("Webhook event validation failed:", validation.error);
      return NextResponse.json(
        { error: "Invalid webhook event" },
        { status: 400 }
      );
    }

    // Handle different webhook events
    switch (event.event) {
      case "payment.captured":
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case "payment.failed":
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      case "order.paid":
        console.log(
          "Order paid event received:",
          event.payload.order.entity.id
        );
        break;
      default:
        console.log("Unhandled webhook event:", event.event);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
