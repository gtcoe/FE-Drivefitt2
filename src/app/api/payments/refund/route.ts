import { NextRequest, NextResponse } from "next/server";
import { createRefund } from "@/lib/razorpayUtils";

export async function POST(request: NextRequest) {
  try {
    const { paymentId, amount, reason, notes } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    console.log("Refund request received:", { paymentId, amount, reason });

    // Create refund using Razorpay API
    const refundResponse = await createRefund(paymentId, amount, {
      reason: reason || "Customer request",
      ...notes,
    });

    if (!refundResponse.success) {
      console.error("Refund creation failed:", refundResponse.error);
      return NextResponse.json(
        {
          error: "Refund creation failed",
          details: refundResponse.error,
        },
        { status: 500 }
      );
    }

    console.log(
      "Refund created successfully:",
      refundResponse.refundDetails?.id
    );

    return NextResponse.json({
      success: true,
      message: "Refund created successfully",
      refundId: refundResponse.refundDetails?.id,
      refundDetails: refundResponse.refundDetails,
    });
  } catch (error) {
    console.error("Refund processing failed:", error);
    return NextResponse.json(
      {
        error: "Refund processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
