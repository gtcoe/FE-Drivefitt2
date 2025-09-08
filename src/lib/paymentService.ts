import { RazorpayHostedCheckout } from "./razorpayHostedCheckout";
import { RazorpayRedirect } from "./razorpayRedirect";

export interface PaymentOptions {
  amount: number;
  currency?: string;
  membershipType: number;
  userDetails: {
    id: number;
    name: string;
    email: string;
    contact: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
  membershipData?: {
    id: number;
    membershipType: number;
    status: "active" | "expired" | "cancelled" | "suspended";
    startDate: string;
    expiresAt: string;
    invoiceNumber?: string;
    orderId: number;
    paymentId: number;
  } | null;
}

export class PaymentService {
  // Create order on server
  static async createOrder(options: PaymentOptions) {
    console.log("🔍 Creating order via API...", options);
    const response = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: options.amount,
        currency: options.currency || "INR",
        receipt: `receipt_${Date.now()}`,
        membership_type: options.membershipType,
        user_id: options.userDetails.id,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create order");
    }

    const data = await response.json();

    return {
      orderId: data.orderId, // Razorpay order ID for frontend compatibility
      internalOrderId: data.internalOrderId, // Internal auto-increment ID
      amount: data.amount,
      currency: data.currency,
      receipt: data.receipt,
      invoiceNumber: data.invoiceNumber,
    };
  }

  // Verify payment on server
  static async verifyPayment(
    paymentData: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    },
    userDetails: {
      id: number;
      name: string;
      email: string;
      contact: string;
    },
    membershipType: number
  ) {
    console.log("🔍 Verifying payment...", paymentData);

    const response = await fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: paymentData.razorpay_order_id,
        paymentId: paymentData.razorpay_payment_id,
        signature: paymentData.razorpay_signature,
        userDetails: {
          ...userDetails,
          user_id: userDetails.id,
          membership_type: membershipType,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Payment verification failed");
    }

    return response.json();
  }

  // Complete payment flow using Razorpay hosted checkout
  static async processPayment(options: PaymentOptions): Promise<{
    success: boolean;
    paymentId?: string;
    error?: string;
    membershipData?: {
      id: number;
      membershipType: number;
      status: "active" | "expired" | "cancelled" | "suspended";
      startDate: string;
      expiresAt: string;
      invoiceNumber?: string;
      orderId: number;
      paymentId: number;
    } | null;
  }> {
    return new Promise(async (resolve) => {
      try {
        console.log("🚀 Starting payment process...", options);

        // Step 1: Create order
        console.log("📝 Step 1: Creating order...");
        const orderData = await this.createOrder(options);
        console.log("✅ Order created:", orderData);

        // Step 2: Try Razorpay hosted checkout, fallback to redirect
        console.log("💳 Step 2: Opening Razorpay checkout...");

        try {
          await RazorpayHostedCheckout.openCheckout({
            orderId: orderData.orderId,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "DriveFitt",
            description: `${options.membershipType} Membership`,
            prefill: {
              name: options.userDetails.name,
              email: options.userDetails.email,
              contact: options.userDetails.contact,
            },
            theme: {
              color: "#3399cc",
            },
            onSuccess: async (paymentResponse) => {
              try {
                console.log("✅ Payment successful:", paymentResponse);

                // Step 3: Verify payment
                console.log("🔍 Step 3: Verifying payment...");
                const verificationResult = await this.verifyPayment(
                  paymentResponse,
                  options.userDetails,
                  options.membershipType
                );
                console.log("✅ Payment verified:", verificationResult);

                if (verificationResult.success) {
                  resolve({
                    success: true,
                    paymentId: paymentResponse.razorpay_payment_id,
                    membershipData: verificationResult.membership, // ✅ New: Include membership data
                  });
                } else {
                  resolve({
                    success: false,
                    error: "Payment verification failed",
                  });
                }
              } catch (error) {
                console.error("❌ Payment verification failed:", error);
                resolve({
                  success: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Payment verification failed",
                });
              }
            },
            onError: (error) => {
              console.error("❌ Payment failed:", error);
              resolve({
                success: false,
                error:
                  error instanceof Error ? error.message : "Payment failed",
              });
            },
          });
        } catch (error) {
          console.error(
            "❌ Razorpay hosted checkout failed, trying redirect:",
            error
          );

          // Fallback to redirect approach
          try {
            RazorpayRedirect.openInNewWindow({
              orderId: orderData.orderId,
              amount: orderData.amount,
              currency: orderData.currency,
              name: "DriveFitt",
              description: `${options.membershipType} Membership`,
              prefill: {
                name: options.userDetails.name,
                email: options.userDetails.email,
                contact: options.userDetails.contact,
              },
              keyId: process.env.RAZORPAY_KEY_ID || "",
            });

            // For redirect approach, we can't verify payment immediately
            // The user will be redirected to success/cancel pages
            resolve({
              success: true,
              paymentId: "redirect_payment",
            });
          } catch (redirectError) {
            console.error("❌ Redirect approach also failed:", redirectError);
            resolve({
              success: false,
              error: "All payment methods failed. Please try again.",
            });
          }
        }
      } catch (error) {
        console.error("❌ Payment processing failed:", error);
        resolve({
          success: false,
          error: error instanceof Error ? error.message : "Payment failed",
        });
      }
    });
  }
}
