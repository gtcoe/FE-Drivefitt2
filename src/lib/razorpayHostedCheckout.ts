export interface RazorpayCheckoutOptions {
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onError: (error: Error) => void;
}

export class RazorpayHostedCheckout {
  private static scriptLoaded = false;
  private static scriptLoading = false;

  private static loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Window is not available"));
        return;
      }

      // Check if script is already loaded
      if (window.Razorpay && this.scriptLoaded) {
        resolve();
        return;
      }

      // If script is already loading, wait for it
      if (this.scriptLoading) {
        const checkLoaded = () => {
          if (window.Razorpay && this.scriptLoaded) {
            resolve();
          } else if (!this.scriptLoading) {
            reject(new Error("Script loading failed"));
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }

      this.scriptLoading = true;

      // Remove any existing script first
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        this.scriptLoaded = true;
        this.scriptLoading = false;
        console.log("✅ Razorpay script loaded successfully");
        resolve();
      };
      script.onerror = () => {
        this.scriptLoading = false;
        console.error("❌ Failed to load Razorpay script");
        reject(new Error("Failed to load Razorpay script"));
      };

      document.head.appendChild(script);
    });
  }

  static async openCheckout(options: RazorpayCheckoutOptions): Promise<void> {
    try {
      console.log("🔄 Starting Razorpay checkout process...");

      // Load Razorpay script if not already loaded
      console.log("📥 Loading Razorpay script...");
      await this.loadScript();

      console.log("🔍 Checking Razorpay availability...");
      if (!window.Razorpay) {
        console.error("❌ Razorpay not available after script load");
        throw new Error("Razorpay not available");
      }

      console.log("✅ Razorpay is available, creating checkout instance...");

      const a = {
        key: process.env.RAZORPAY_KEY_ID!,
        amount: options.amount,
        currency: options.currency,
        name: options.name,
        description: options.description,
        order_id: options.orderId,
        prefill: options.prefill,
        theme: options.theme,
        handler: options.onSuccess,
        modal: {
          ondismiss: () => {
            console.log("🚫 Payment cancelled by user");
            options.onError(new Error("Payment cancelled by user"));
          },
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: "Pay using UPI",
                instruments: [
                  {
                    method: "upi",
                  },
                ],
              },
              cards: {
                name: "Pay using Card",
                instruments: [
                  {
                    method: "card",
                  },
                ],
              },
              netbanking: {
                name: "Pay using Net Banking",
                instruments: [
                  {
                    method: "netbanking",
                  },
                ],
              },
            },
            sequence: ["block.banks", "block.cards", "block.netbanking"],
            preferences: {
              show_default_blocks: false,
            },
          },
        },
      };
      console.log("a:", a);
      const rzp = new window.Razorpay(a);

      console.log("🚀 Opening Razorpay checkout...");
      rzp.open();
      console.log("✅ Razorpay checkout opened successfully");
    } catch (error) {
      console.error("❌ Failed to open Razorpay checkout:", error);
      options.onError(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }
}

// Declare global Razorpay type
declare global {
  interface Window {
    Razorpay: new (options: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      order_id: string;
      prefill: {
        name: string;
        email: string;
        contact: string;
      };
      theme: {
        color: string;
      };
      handler: (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => void;
      modal: {
        ondismiss: () => void;
      };
      config: {
        display: {
          blocks: {
            banks: { name: string; instruments: Array<{ method: string }> };
            cards: { name: string; instruments: Array<{ method: string }> };
            netbanking: {
              name: string;
              instruments: Array<{ method: string }>;
            };
          };
          sequence: string[];
          preferences: { show_default_blocks: boolean };
        };
      };
    }) => {
      open: () => void;
    };
  }
}
