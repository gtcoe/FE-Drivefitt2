# Razorpay Payment Gateway Integration

This document provides a comprehensive guide to the Razorpay payment gateway integration implemented in the DriveFitt project.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup Instructions](#setup-instructions)
4. [API Endpoints](#api-endpoints)
5. [Components](#components)
6. [Database Schema](#database-schema)
7. [Usage Examples](#usage-examples)
8. [Security Considerations](#security-considerations)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

## Overview

The Razorpay integration provides a complete payment solution for DriveFitt memberships, including:

- Secure payment processing
- Multiple payment methods (Card, UPI, Net Banking, Wallets, EMI)
- Payment verification and webhook handling
- Membership management
- User-friendly payment UI

## Architecture

### Frontend (Next.js)

- **Payment Service**: Handles payment flow and Razorpay SDK integration
- **Payment Components**: Modal, buttons, and success/error handling
- **Razorpay Script**: Loads Razorpay SDK dynamically

### Backend (API Routes)

- **Order Creation**: Creates orders in Razorpay and database
- **Payment Verification**: Verifies payment signatures and updates database
- **Webhook Handler**: Processes Razorpay webhook events

### Database

- **Payment Orders**: Stores order and payment information
- **Memberships**: Manages user membership records

## Setup Instructions

### 1. Environment Configuration

Create `.env.local` file in the project root:

```env
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=drivefitt
DB_PORT=3306
```

### 2. Install Dependencies

```bash
npm install razorpay
```

### 3. Initialize Database

```bash
# Initialize payment database tables
curl -X POST http://localhost:3000/api/payments/init-db
```

## API Endpoints

### 1. Create Order

**POST** `/api/payments/create-order`

Creates a new payment order in Razorpay and database.

**Request Body:**

```json
{
  "amount": 5000,
  "currency": "INR",
  "receipt": "receipt_123",
  "membership_type": "Premium"
}
```

**Response:**

```json
{
  "orderId": "order_xxxxxxxxxxxxx",
  "amount": 500000,
  "currency": "INR",
  "receipt": "receipt_123"
}
```

### 2. Verify Payment

**POST** `/api/payments/verify`

Verifies payment signature and creates membership record.

**Request Body:**

```json
{
  "orderId": "order_xxxxxxxxxxxxx",
  "paymentId": "pay_xxxxxxxxxxxxx",
  "signature": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "userDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "contact": "9876543210",
    "membership_type": "Premium"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment verified successfully",
  "paymentId": "pay_xxxxxxxxxxxxx",
  "orderId": "order_xxxxxxxxxxxxx"
}
```

### 3. Webhook Handler

**POST** `/api/payments/webhook`

Handles Razorpay webhook events for payment status updates.

## Components

### 1. PaymentButton

Simple button component for initiating payments.

```tsx
import PaymentButton from "@/components/common/PaymentButton";

<PaymentButton
  membershipType="Premium"
  amount={5000}
  variant="primary"
  size="lg"
>
  Join Premium Membership
</PaymentButton>;
```

### 2. EnhancedPaymentModal

Complete payment modal with success/error handling.

```tsx
import EnhancedPaymentModal from "@/components/common/EnhancedPaymentModal";

<EnhancedPaymentModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  membershipType="Premium"
  amount={5000}
/>;
```

### 3. PaymentService

Service class for handling payment operations.

```tsx
import { PaymentService } from "@/lib/paymentService";

const result = await PaymentService.processPayment({
  amount: 5000,
  membershipType: "Premium",
  userDetails: {
    name: "John Doe",
    email: "john@example.com",
    contact: "9876543210",
  },
});
```

## Database Schema

### Payment Orders Table

```sql
CREATE TABLE payment_orders (
  id VARCHAR(255) PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status ENUM('created', 'completed', 'failed', 'pending') DEFAULT 'created',
  membership_type VARCHAR(100),
  payment_id VARCHAR(255),
  signature VARCHAR(255),
  user_details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL
);
```

### Memberships Table

```sql
CREATE TABLE memberships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  order_id VARCHAR(255) NOT NULL,
  payment_id VARCHAR(255) NOT NULL,
  membership_type VARCHAR(100),
  status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  FOREIGN KEY (order_id) REFERENCES payment_orders(id)
);
```

## Usage Examples

### Basic Payment Integration

```tsx
"use client";
import { useState } from "react";
import PaymentButton from "@/components/common/PaymentButton";

export default function MembershipPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePaymentSuccess = (paymentId: string) => {
    setShowSuccess(true);
    console.log("Payment successful:", paymentId);
  };

  return (
    <div>
      <h1>Choose Your Membership</h1>

      <div className="membership-plans">
        <div className="plan">
          <h3>Basic Plan</h3>
          <p>₹2,000/month</p>
          <PaymentButton
            membershipType="Basic"
            amount={2000}
            onSuccess={handlePaymentSuccess}
          />
        </div>

        <div className="plan">
          <h3>Premium Plan</h3>
          <p>₹5,000/month</p>
          <PaymentButton
            membershipType="Premium"
            amount={5000}
            onSuccess={handlePaymentSuccess}
          />
        </div>
      </div>
    </div>
  );
}
```

### Custom Payment Flow

```tsx
"use client";
import { useState } from "react";
import { PaymentService } from "@/lib/paymentService";

export default function CustomPaymentPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomPayment = async () => {
    setIsLoading(true);

    try {
      const result = await PaymentService.processPayment({
        amount: 5000,
        membershipType: "Premium",
        userDetails: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9876543210",
        },
      });

      if (result.success) {
        alert("Payment successful!");
      } else {
        alert("Payment failed: " + result.error);
      }
    } catch (error) {
      alert("Payment error: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleCustomPayment} disabled={isLoading}>
      {isLoading ? "Processing..." : "Pay Now"}
    </button>
  );
}
```

## Security Considerations

### 1. Environment Variables

- Never expose secret keys in client-side code
- Use different keys for test and production environments
- Regularly rotate API keys

### 2. Payment Verification

- Always verify payment signatures on the server-side
- Implement proper error handling
- Log all payment transactions

### 3. Input Validation

- Validate all user inputs
- Sanitize data before processing
- Implement rate limiting

### 4. Webhook Security

- Verify webhook signatures
- Use HTTPS for webhook endpoints
- Implement idempotency

## Testing

### 1. Test Environment Setup

```bash
# Use test keys in .env.local
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret_key
```

### 2. Test Payment Methods

- **Card**: Use test card numbers (4111 1111 1111 1111)
- **UPI**: Use test UPI IDs (test@razorpay)
- **Net Banking**: Use test bank credentials
- **Wallet**: Use test wallet accounts

### 3. Test Scenarios

- Successful payments
- Failed payments
- Network interruptions
- Webhook failures
- Signature verification

## Troubleshooting

### Common Issues

1. **Razorpay SDK not loaded**

   - Check if RazorpayScript component is included in layout
   - Verify script loading in browser console

2. **Payment verification failed**

   - Check environment variables
   - Verify signature verification logic
   - Check database connection

3. **Webhook not working**

   - Verify webhook URL in Razorpay dashboard
   - Check webhook signature verification
   - Monitor server logs

4. **Database errors**
   - Verify database connection
   - Check table schema
   - Monitor database logs

### Debug Mode

Enable debug logging by setting environment variable:

```env
DEBUG_PAYMENTS=true
```

### Support

For technical support:

1. Check Razorpay documentation
2. Review server logs
3. Contact development team
4. Check Razorpay support portal

## Production Deployment

### 1. Environment Setup

- Use production Razorpay keys
- Set up production database
- Configure webhook URLs

### 2. SSL Certificate

- Ensure HTTPS is enabled
- Configure SSL certificates
- Update webhook URLs

### 3. Monitoring

- Set up payment monitoring
- Configure error alerts
- Monitor webhook delivery

### 4. Backup

- Regular database backups
- Payment log backups
- Configuration backups

---

For more information, refer to the [Razorpay Documentation](https://razorpay.com/docs/).


