import { NextRequest, NextResponse } from "next/server";
import {
  OrderStatus,
  PaymentStatus,
  MembershipStatus,
} from "@/lib/paymentDatabase";
import {
  getOrderByRazorpayId,
  updateOrder,
  insertPayment,
  insertMembership,
  calculateExpiryDate,
  mapPaymentMethod,
} from "@/lib/paymentDatabase";
import { executeQuery } from "@/lib/database";
import { razorpayApiClient } from "@/lib/razorpayApiClient";
import { generateInvoiceBuffer } from "@/utils/invoiceGenerator";
import { sendMembershipSuccessEmail } from "@/utils/brevo";

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Payment verification API called");
    console.log(
      "📋 Request headers:",
      Object.fromEntries(request.headers.entries())
    );

    const { orderId, paymentId, signature, userDetails } = await request.json();

    if (!orderId || !paymentId || !signature || !userDetails) {
      console.error("❌ Missing required parameters:", {
        orderId,
        paymentId,
        signature: !!signature,
        userDetails: !!userDetails,
      });
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    console.log("✅ Payment verification request received:", {
      orderId,
      paymentId,
      hasSignature: !!signature,
      hasUserDetails: !!userDetails,
    });

    // Verify signature first
    // const isValid = verifyPaymentSignature(orderId, paymentId, signature);

    // if (!isValid) {
    //   console.error("Invalid payment signature");
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    // }

    // Additional verification: Fetch payment details from Razorpay API
    const paymentResponse = await razorpayApiClient.getPayment(paymentId);

    if (!paymentResponse.success) {
      console.error(
        "Failed to fetch payment details from Razorpay:",
        paymentResponse.error
      );
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 500 }
      );
    }

    const paymentDetails = paymentResponse.data!;

    // Verify payment status and order ID match
    if (
      paymentDetails.status !== "captured" &&
      paymentDetails.status !== "authorized"
    ) {
      console.error("Payment not in valid state:", paymentDetails.status);
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    if (paymentDetails.order_id !== orderId) {
      console.error("Order ID mismatch:", {
        expected: orderId,
        actual: paymentDetails.order_id,
      });
      return NextResponse.json({ error: "Order ID mismatch" }, { status: 400 });
    }

    console.log("Payment details verified:", {
      paymentId,
      status: paymentDetails.status,
      amount: paymentDetails.amount,
      orderId: paymentDetails.order_id,
    });

    // Get order by razorpay_order_id to get internal order.id
    const order = await getOrderByRazorpayId(orderId);
    if (!order) {
      console.error("Order not found in database:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Create payment record in payments table
    const paymentRecordId = await insertPayment({
      razorpay_payment_id: paymentId,
      order_id: order.id!,
      user_id: order.user_id,
      amount: paymentDetails.amount / 100, // Convert from paise
      currency: paymentDetails.currency,
      method: mapPaymentMethod(paymentDetails.method || "card"),
      bank: (paymentDetails as unknown as { bank?: string }).bank || null,
      card_id:
        (paymentDetails as unknown as { card_id?: string }).card_id || null,
      wallet: (paymentDetails as unknown as { wallet?: string }).wallet || null,
      vpa: (paymentDetails as unknown as { vpa?: string }).vpa || null,
      email: paymentDetails.email || null,
      contact: paymentDetails.contact || null,
      status: PaymentStatus.CAPTURED,
      captured_at: new Date(),
      razorpay_payment_response: paymentDetails,
      razorpay_capture_response: paymentDetails,
    });

    console.log("Payment record created with ID:", paymentRecordId);

    // Update order status
    try {
      await updateOrder(order.id!, {
        status: OrderStatus.PAID,
        razorpay_order_status_response: paymentDetails,
      });
      console.log("Order status updated to paid");
    } catch (dbError) {
      console.error("Failed to update order status:", dbError);
      // Don't fail the entire request if order update fails
    }

    // Create membership record
    let membershipRecordId: number;
    try {
      membershipRecordId = await insertMembership({
        user_id: order.user_id,
        order_id: order.id!,
        payment_id: paymentRecordId,
        membership_type: order.membership_type,
        status: MembershipStatus.ACTIVE,
        end_date: calculateExpiryDate(),
      });
      console.log(
        "Membership record created for user_id:",
        order.user_id,
        "with membership_type:",
        order.membership_type,
        "and ID:",
        membershipRecordId
      );
    } catch (dbError) {
      console.error("Failed to create membership record:", dbError);
      // Don't fail the entire request if membership creation fails
      membershipRecordId = 0;
    }

    console.log("Payment verified successfully:", paymentId);

    // Fetch the newly created membership data to return to frontend
    let membershipData: {
      id: number;
      membershipType: number;
      status: string;
      startDate: string;
      expiresAt: string;
      invoiceNumber?: string;
      orderId: number;
      paymentId: number;
    } | null = null;
    if (membershipRecordId > 0) {
      const membershipQuery = `
        SELECT 
          m.id,
          m.user_id,
          m.order_id,
          m.payment_id,
          m.membership_type,
          m.status,
          m.start_date,
          m.end_date,
          o.invoice_number
        FROM memberships m
        INNER JOIN orders o ON m.order_id = o.id
        WHERE m.id = ?
      `;

      const membershipResult = await executeQuery<
        Array<{
          id: number;
          user_id: number;
          order_id: number;
          payment_id: number;
          membership_type: number;
          status: string;
          start_date: string;
          end_date: string;
          invoice_number: string;
        }>
      >(membershipQuery, [membershipRecordId]);

      const membership = membershipResult?.[0];
      if (membership) {
        membershipData = {
          id: membership.id,
          membershipType: membership.membership_type,
          status: membership.status,
          startDate: membership.start_date,
          expiresAt: membership.end_date,
          invoiceNumber: membership.invoice_number,
          orderId: membership.order_id,
          paymentId: membership.payment_id,
        };

        // Generate and send invoice email asynchronously
        try {
          console.log("📧 Starting invoice generation and email process...");

          // Get user details for invoice
          const userQuery = `
            SELECT first_name, last_name, email, phone
            FROM users 
            WHERE id = ?
          `;

          const userResult = await executeQuery<
            Array<{
              first_name: string;
              last_name: string;
              email: string;
              phone: string;
            }>
          >(userQuery, [order.user_id]);

          const user = userResult?.[0];
          if (user) {
            console.log("👤 User details retrieved:", {
              userId: order.user_id,
              firstName: user.first_name,
              lastName: user.last_name,
              email: user.email,
              phone: user.phone,
            });

            // Generate invoice data
            const invoiceData = {
              invoiceNumber: membership.invoice_number || `INV-${Date.now()}`,
              invoiceDate: new Date().toLocaleDateString("en-IN"),
              customerName: `${user.first_name} ${user.last_name}`.trim(),
              customerEmail: user.email,
              amount: 999.0,
              membershipType:
                membership.membership_type === 1
                  ? "Individual Annual Plan"
                  : "Family Annual Plan",
              paymentId: paymentId,
              orderId: orderId,
            };

            console.log("📄 Invoice data prepared:", {
              invoiceNumber: invoiceData.invoiceNumber,
              customerName: invoiceData.customerName,
              customerEmail: invoiceData.customerEmail,
              amount: invoiceData.amount,
              membershipType: invoiceData.membershipType,
            });

            // Generate invoice PDF
            console.log("🔄 Generating invoice PDF...");
            const invoiceBuffer = generateInvoiceBuffer(invoiceData);
            console.log(
              "✅ Invoice PDF generated successfully, size:",
              invoiceBuffer.length,
              "bytes"
            );

            // Send email with invoice attachment synchronously (removed setImmediate)
            if (membershipData) {
              console.log(
                "📤 Sending email immediately (removed setImmediate wrapper)..."
              );
              try {
                console.log("🚀 Executing email sending...");
                await sendMembershipSuccessEmail(
                  {
                    name: invoiceData.customerName,
                    email: invoiceData.customerEmail,
                    phone: user.phone,
                  },
                  membershipData!,
                  invoiceBuffer
                );
                console.log(
                  "✅ Invoice email sent successfully for user:",
                  user.email
                );
              } catch (emailError) {
                console.error("❌ Failed to send invoice email:", emailError);
                console.error("Email error details:", {
                  userEmail: user.email,
                  userName: invoiceData.customerName,
                  error:
                    emailError instanceof Error
                      ? emailError.message
                      : String(emailError),
                });
              }
            } else {
              console.warn("⚠️ membershipData is null, skipping email sending");
            }
          } else {
            console.error(
              "❌ User not found for invoice generation, user_id:",
              order.user_id
            );
          }
        } catch (invoiceError) {
          console.error(
            "❌ Failed to generate invoice or send email:",
            invoiceError
          );
          console.error("Invoice error details:", {
            userId: order.user_id,
            orderId: order.id,
            error:
              invoiceError instanceof Error
                ? invoiceError.message
                : String(invoiceError),
          });
          // Don't fail the payment verification if invoice generation fails
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: paymentId,
      orderId: orderId,
      internalOrderId: order.id,
      internalPaymentId: paymentRecordId,
      paymentStatus: paymentDetails.status,
      amount: paymentDetails.amount,
      membership: membershipData,
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json(
      {
        error: "Verification failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
