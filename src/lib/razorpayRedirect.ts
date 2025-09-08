export interface RazorpayRedirectOptions {
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
  keyId: string;
}

export class RazorpayRedirect {
  static redirectToCheckout(options: RazorpayRedirectOptions): void {
    console.log("🔄 Redirecting to Razorpay checkout...");
    console.log("🔑 Using key:", options.keyId);
    console.log("💰 Amount:", options.amount);
    console.log("🆔 Order ID:", options.orderId);

    // Create a form to submit to Razorpay
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://api.razorpay.com/v1/checkout/embedded";
    form.target = "_blank";
    form.style.display = "none";

    // Add form fields
    const fields = {
      key_id: options.keyId,
      amount: options.amount,
      currency: options.currency,
      name: options.name,
      description: options.description,
      order_id: options.orderId,
      prefill: JSON.stringify(options.prefill),
      theme: JSON.stringify({
        color: "#3399cc",
      }),
      callback_url: `${window.location.origin}/payment-success`,
      cancel_url: `${window.location.origin}/payment-cancelled`,
    };

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value.toString();
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    console.log("✅ Redirected to Razorpay checkout");
  }

  static openInNewWindow(options: RazorpayRedirectOptions): void {
    console.log("🔄 Opening Razorpay checkout in new window...");

    const params = new URLSearchParams({
      key_id: options.keyId,
      amount: options.amount.toString(),
      currency: options.currency,
      name: options.name,
      description: options.description,
      order_id: options.orderId,
      prefill: JSON.stringify(options.prefill),
      theme: JSON.stringify({
        color: "#3399cc",
      }),
      callback_url: `${window.location.origin}/payment-success`,
      cancel_url: `${window.location.origin}/payment-cancelled`,
    });

    const checkoutUrl = `https://api.razorpay.com/v1/checkout/embedded?${params.toString()}`;

    console.log("🌐 Checkout URL:", checkoutUrl);

    // Open in new window
    const newWindow = window.open(
      checkoutUrl,
      "razorpay_checkout",
      "width=800,height=600,scrollbars=yes,resizable=yes"
    );

    if (!newWindow) {
      console.error("❌ Failed to open new window");
      throw new Error("Failed to open payment window");
    }

    console.log("✅ Opened Razorpay checkout in new window");
  }
}
