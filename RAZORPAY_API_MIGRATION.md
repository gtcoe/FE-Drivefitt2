# Razorpay API Migration Documentation

## Overview

This document describes the migration from Razorpay SDK to direct API calls. The implementation provides better control, enhanced security, and additional verification capabilities.

## Migration Summary

### What Changed

1. **Replaced Razorpay SDK** with direct HTTP API calls
2. **Enhanced Security** with additional API-based verification
3. **Added New Endpoints** for refunds and payment details
4. **Improved Error Handling** with detailed logging
5. **Added Utility Functions** for common operations

### Files Modified

- `src/lib/razorpayApiClient.ts` - New API client
- `src/lib/razorpayUtils.ts` - Utility functions
- `src/app/api/payments/create-order/route.ts` - Updated to use API client
- `src/app/api/payments/verify/route.ts` - Enhanced verification
- `src/app/api/payments/webhook/route.ts` - Added API validation
- `src/app/api/payments/refund/route.ts` - New refund endpoint
- `src/app/api/payments/details/route.ts` - New details endpoint

## API Client Features

### RazorpayApiClient Class

The new API client provides the following methods:

#### Order Management

- `createOrder(orderData)` - Create payment orders
- `getOrder(orderId)` - Fetch order details
- `getOrderPayments(orderId)` - Get payments for an order

#### Payment Management

- `getPayment(paymentId)` - Fetch payment details
- `capturePayment(paymentId, amount?)` - Capture authorized payments
- `createRefund(paymentId, amount?, notes?)` - Create refunds

#### Authentication

- Uses Basic Auth with base64 encoded credentials
- Automatically handles authentication headers
- Supports both test and live environments

## Enhanced Security Features

### 1. Double Verification

- **Signature Verification**: Original crypto-based signature verification
- **API Verification**: Cross-reference with Razorpay API for additional security

### 2. Webhook Validation

- Validates webhook events against Razorpay API
- Prevents processing of invalid or tampered webhooks
- Ensures data consistency between webhook and API

### 3. Payment Status Verification

- Verifies payment status through API calls
- Validates order ID matches between payment and order
- Ensures payment is in correct state before processing

## API Endpoints

### 1. Create Order

**POST** `/api/payments/create-order`

Creates a new payment order using Razorpay API.

**Request:**

```json
{
  "amount": 100,
  "currency": "INR",
  "receipt": "receipt_123",
  "membership_type": "Premium"
}
```

**Response:**

```json
{
  "orderId": "order_xxxxxxxxxxxxx",
  "amount": 10000,
  "currency": "INR",
  "receipt": "receipt_123",
  "status": "created"
}
```

### 2. Verify Payment

**POST** `/api/payments/verify`

Enhanced payment verification with API cross-reference.

**Request:**

```json
{
  "orderId": "order_xxxxxxxxxxxxx",
  "paymentId": "pay_xxxxxxxxxxxxx",
  "signature": "signature_string",
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
  "orderId": "order_xxxxxxxxxxxxx",
  "paymentStatus": "captured",
  "amount": 10000
}
```

### 3. Get Payment/Order Details

**GET** `/api/payments/details?orderId=xxx&paymentId=xxx`

Fetch detailed information about orders and payments.

**Response:**

```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order_xxxxxxxxxxxxx",
      "amount": 10000,
      "status": "paid",
      "currency": "INR"
    },
    "payments": [
      {
        "id": "pay_xxxxxxxxxxxxx",
        "amount": 10000,
        "status": "captured",
        "method": "card"
      }
    ],
    "paymentVerification": {
      "isValid": true,
      "paymentDetails": { ... }
    }
  }
}
```

### 4. Create Refund

**POST** `/api/payments/refund`

Create refunds for payments.

**Request:**

```json
{
  "paymentId": "pay_xxxxxxxxxxxxx",
  "amount": 50,
  "reason": "Customer request",
  "notes": {
    "refund_type": "partial"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Refund created successfully",
  "refundId": "rfnd_xxxxxxxxxxxxx",
  "refundDetails": { ... }
}
```

### 5. Webhook Handler

**POST** `/api/payments/webhook`

Enhanced webhook processing with API validation.

**Features:**

- Signature verification
- API-based event validation
- Status consistency checks
- Detailed logging

## Utility Functions

### RazorpayUtils

The utility module provides helper functions:

- `verifyPaymentCompletion(paymentId, orderId)` - Verify payment completion
- `getOrderDetails(orderId)` - Get order information
- `getOrderPayments(orderId)` - Get payments for an order
- `captureAuthorizedPayment(paymentId, amount?)` - Capture payments
- `createRefund(paymentId, amount?, notes?)` - Create refunds
- `validateWebhookEvent(event)` - Validate webhook events

## Error Handling

### Comprehensive Error Management

1. **API Errors**: Proper handling of Razorpay API errors
2. **Network Errors**: Retry logic and timeout handling
3. **Validation Errors**: Input validation and sanitization
4. **Database Errors**: Graceful handling of database failures
5. **Logging**: Detailed logging for debugging

### Error Response Format

```json
{
  "error": "Error description",
  "details": "Detailed error message",
  "statusCode": 400
}
```

## Testing

### Test Coverage

The implementation can be tested through:

- Order creation API
- Payment verification API
- Refund creation API
- Webhook handling
- Error scenarios

## Environment Configuration

### Required Environment Variables

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=drivefitt
DB_PORT=3306
```

## Migration Benefits

### 1. Enhanced Security

- Double verification (signature + API)
- Webhook validation
- Status consistency checks

### 2. Better Control

- Direct API access
- Custom error handling
- Detailed logging

### 3. Additional Features

- Refund management
- Payment details API
- Order status tracking

### 4. Improved Reliability

- Better error handling
- Retry mechanisms
- Fallback strategies

## Backward Compatibility

The migration maintains backward compatibility:

- Same API endpoints
- Same request/response formats
- Same database schema
- Same webhook events

## Production Deployment

### 1. Update Environment Variables

```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key
RAZORPAY_WEBHOOK_SECRET=your_live_webhook_secret
```

### 2. Test Thoroughly

- Test all payment flows
- Verify webhook delivery
- Test error scenarios
- Validate refund process

### 3. Monitor

- Payment success rates
- API response times
- Error rates
- Webhook delivery

## Support and Troubleshooting

### Common Issues

1. **Authentication Errors**

   - Check environment variables
   - Verify key format
   - Ensure correct environment (test/live)

2. **API Errors**

   - Check Razorpay dashboard
   - Verify account status
   - Review API limits

3. **Webhook Issues**
   - Verify webhook URL
   - Check signature verification
   - Monitor webhook delivery

### Debug Mode

Enable debug logging:

```env
DEBUG_PAYMENTS=true
```

## References

- [Razorpay API Documentation](https://razorpay.com/docs/api/)
- [Orders API](https://razorpay.com/docs/api/orders/create/)
- [Payments API](https://razorpay.com/docs/api/payments/)
- [Webhooks API](https://razorpay.com/docs/api/webhooks/)

---

**Migration completed successfully! 🚀**

The system now uses direct Razorpay API calls with enhanced security and additional features while maintaining full backward compatibility.
