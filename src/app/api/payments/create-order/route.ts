import { NextRequest, NextResponse } from "next/server";
import { razorpayApiClient } from "@/lib/razorpayApiClient";
import {
  insertOrder,
  generateInvoiceNumber,
  OrderStatus,
} from "@/lib/paymentDatabase";

export async function POST(request: NextRequest) {
  console.log("🎯 Create Order API endpoint called");

  try {
    const {
      amount,
      currency = "INR",
      receipt,
      membership_type,
      user_id,
    } = await request.json();

    console.log("📝 Request body parsed:", {
      amount,
      currency,
      receipt,
      membership_type,
      user_id,
    });

    if (
      !amount ||
      membership_type === undefined ||
      membership_type === null ||
      !user_id
    ) {
      console.error("❌ Validation failed - missing required fields");
      return NextResponse.json(
        { error: "Amount, membership type, and user_id are required" },
        { status: 400 }
      );
    }

    console.log("✅ Order creation request received:", {
      amount,
      membership_type,
      currency,
      user_id,
    });

    // Create order using Razorpay API client
    const orderResponse = await razorpayApiClient.createOrder({
      amount: amount * 100,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        membership_type,
        user_id,
        created_at: new Date().toISOString(),
      },
    });

    if (!orderResponse.success) {
      console.error("Razorpay order creation failed:", orderResponse.error);
      return NextResponse.json(
        {
          error: "Order creation failed",
          details: orderResponse.error || "Unknown error from Razorpay",
        },
        { status: 500 }
      );
    }

    const order = orderResponse.data!;
    console.log("Razorpay order created successfully:", order.id);

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber();
    console.log("Generated invoice number:", invoiceNumber);

    // Save order to database
    let internalOrderId: number = 0;
    try {
      internalOrderId = await insertOrder({
        razorpay_order_id: order.id,
        user_id: user_id,
        membership_type: membership_type,
        amount: amount, // Keep original amount in rupees for database
        currency: order.currency,
        receipt: order.receipt,
        invoice_number: invoiceNumber,
        status: OrderStatus.CREATED,
        razorpay_create_order_response: order,
      });
      console.log("Order saved to database successfully:", internalOrderId);
    } catch (dbError) {
      console.error("Failed to save order to database:", dbError);
      // Don't fail the request if database save fails, as the order was created in Razorpay
    }

    return NextResponse.json({
      orderId: order.id, // Return Razorpay order ID for frontend compatibility
      internalOrderId: internalOrderId, // Return internal auto-increment ID
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      invoiceNumber: invoiceNumber,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      {
        error: "Order creation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
