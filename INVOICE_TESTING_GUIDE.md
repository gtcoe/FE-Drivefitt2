# Invoice WhatsApp Integration - Testing Guide

## Overview
This document provides instructions for testing the new invoice delivery flow via WhatsApp using EasySocial API.

## New API Integration

### EasySocial Invoice Template
- **Template ID**: `cmkxu9v3o0878dwxpa24e2qe1/16325/3661`
- **Endpoint**: `https://api.easysocial.in/api/v1/wa-templates/send/cmkxu9v3o0878dwxpa24e2qe1/16325/3661/API/:mobile_number`
- **Parameters**:
  - `:mobile_number` - 10-digit mobile number
  - `body1` - Customer's first name
  - `header1` - CDN link to invoice PDF

## Services Updated

### 1. EasySocial Service (`src/lib/easySocialService.ts`)
- ✅ Added `sendInvoice()` method
- ✅ Supports both OTP and Invoice delivery
- ✅ Automatic first name extraction from full name
- ✅ URL encoding for parameters
- ✅ 15-second timeout
- ✅ Comprehensive error handling

### 2. Gupshup Service (`src/lib/gupshupService.ts`)
- ✅ Added `sendInvoice()` method using EasySocial API
- ✅ Maintains existing OTP functionality
- ✅ Same invoice delivery capabilities as EasySocial service

## Testing Methods

### Method 1: Web UI (Recommended)
The easiest way to test the invoice flow.

**Access**: http://localhost:3000/test/invoice

**Steps**:
1. Open the test page in your browser
2. Fill in the form:
   - **Phone**: Your 10-digit WhatsApp number
   - **Customer Name**: Any name (e.g., "John Doe")
   - **Invoice URL**: Use default or provide your own PDF URL
   - **Service**: Select "EasySocial" or "Gupshup"
3. Click "Send Test Invoice"
4. Check the result on the page
5. Verify the WhatsApp message on your phone

**Default Test PDF**: 
```
https://da8nru77lsio9.cloudfront.net/invoices/test-invoice-2025-09-10T14-52-28-810Z.pdf
```

### Method 2: API Testing (curl)

#### Test with EasySocial Service
```bash
curl -X POST http://localhost:3000/api/test/invoice \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "customerName": "John Doe",
    "invoiceUrl": "https://da8nru77lsio9.cloudfront.net/invoices/test-invoice-2025-09-10T14-52-28-810Z.pdf",
    "service": "easysocial"
  }'
```

#### Test with Gupshup Service
```bash
curl -X POST http://localhost:3000/api/test/invoice \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "customerName": "Jane Smith",
    "invoiceUrl": "https://da8nru77lsio9.cloudfront.net/invoices/test-invoice-2025-09-10T14-52-28-810Z.pdf",
    "service": "gupshup"
  }'
```

### Method 3: Postman

**Request**:
- **Method**: POST
- **URL**: `http://localhost:3000/api/test/invoice`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "phone": "9876543210",
    "customerName": "John Doe",
    "invoiceUrl": "https://da8nru77lsio9.cloudfront.net/invoices/test-invoice-2025-09-10T14-52-28-810Z.pdf",
    "service": "easysocial"
  }
  ```

## Expected Response

### Success Response
```json
{
  "success": true,
  "message": "Invoice sent successfully via easysocial",
  "data": {
    "service": "easysocial",
    "phone": "9876543210",
    "customerName": "John Doe",
    "invoiceUrl": "https://...",
    "messageId": "wamid.xxx"
  },
  "response": "{...}"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Failed to send invoice via easysocial",
  "details": "..."
}
```

## WhatsApp Message Format

The customer will receive a WhatsApp message with:
1. **Header**: Invoice PDF document
2. **Body**: Message with customer's first name
3. **PDF Attachment**: Clickable invoice document

## Validation Checks

The API performs the following validations:
- ✅ Phone number must be exactly 10 digits
- ✅ Customer name cannot be empty
- ✅ Invoice URL must start with http/https
- ✅ Invoice URL must be publicly accessible

## Troubleshooting

### Issue: "Invalid phone number"
**Solution**: Ensure the phone number is exactly 10 digits without any special characters or country code.

### Issue: "Invalid invoice URL"
**Solution**: Make sure the URL:
- Starts with `http://` or `https://`
- Points to a publicly accessible PDF file
- Is properly URL-encoded if it contains special characters

### Issue: "Request timeout"
**Solution**: 
- Check your internet connection
- Verify the EasySocial API is accessible
- Ensure the invoice PDF URL is accessible

### Issue: "Failed to send invoice"
**Solution**:
- Check the API logs in the terminal
- Verify the `EASYSOCIAL_API_KEY` is set in `.env.local`
- Ensure the phone number has WhatsApp installed

## Environment Variables

Make sure these are set in your `.env.local`:

```env
EASYSOCIAL_API_KEY=your_api_key_here
GUPSHUP_USERID=your_gupshup_userid
GUPSHUP_PASSWORD=your_gupshup_password
```

## Integration in Production

To use this in your payment flow:

```typescript
import { easySocialService } from "@/lib/easySocialService";
// OR
import { gupshupService } from "@/lib/gupshupService";

// After generating invoice and uploading to S3
const result = await easySocialService.sendInvoice({
  customerName: order.customerName,
  customerPhone: order.customerPhone,
  invoiceUrl: invoiceCdnUrl, // Full CloudFront URL
});

if (result.success) {
  console.log("Invoice sent successfully");
} else {
  console.error("Failed to send invoice:", result.response);
}
```

## Testing Checklist

- [ ] Test with EasySocial service
- [ ] Test with Gupshup service
- [ ] Verify WhatsApp message received with PDF
- [ ] Test with different customer names
- [ ] Test with different phone numbers
- [ ] Verify PDF is clickable and downloadable
- [ ] Test error handling (invalid phone, invalid URL)
- [ ] Check logs for successful delivery
- [ ] Verify first name extraction works correctly

## Support

For issues or questions:
1. Check the terminal logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with the web UI first before using curl/Postman
4. Ensure your test phone number has WhatsApp installed

---

**Last Updated**: January 28, 2026
