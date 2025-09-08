# Asynchronous OTP Flow with Vendor Response Tracking

## 🔄 **Updated OTP Flow Overview**

The OTP system now operates asynchronously with vendor response tracking for better performance and monitoring.

## 📊 **Database Schema Updates**

### **New Column Added:**

```sql
ALTER TABLE otp_verification
ADD COLUMN vendor_response TEXT NULL COMMENT 'Stores Gupshup API response';
```

### **Complete Table Structure:**

```sql
CREATE TABLE otp_verification (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    phone VARCHAR(20) NOT NULL,
    otp VARCHAR(4) NOT NULL,
    purpose TINYINT NOT NULL COMMENT '1=login, 2=registration, 3=password_reset',
    attempts INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    vendor_response TEXT NULL COMMENT 'Stores Gupshup API response',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL,
    INDEX idx_otp_phone (phone),
    INDEX idx_otp_expires (expires_at),
    INDEX idx_otp_purpose (purpose)
);
```

## 🔄 **Asynchronous Flow Process**

### **1. User Requests OTP**

```
User clicks "Continue" → PhoneNumberModal → API call to /api/auth/send-otp
```

### **2. Immediate Response (Optimistic)**

```typescript
// OTP service returns success immediately
async sendOTP(phone: string, purpose: OTPPurpose): Promise<boolean> {
  const otp = this.generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Store OTP in database first
  const otpId = await this.storeOTP(phone, otp, purpose, expiresAt);

  // Send via Gupshup asynchronously (fire and forget)
  this.sendOTPAsync(phone, otp, otpId);

  // Return success immediately
  return true;
}
```

### **3. Asynchronous SMS Sending**

```typescript
private async sendOTPAsync(phone: string, otp: string, otpId: number): Promise<void> {
  try {
    // Send via Gupshup
    const result = await gupshupService.sendOTP(phone, otp);

    // Update vendor response in database
    await this.updateVendorResponse(otpId, result);

    if (result.success) {
      console.log(`OTP sent successfully to ${phone}`);
    } else {
      console.error(`Failed to send OTP to ${phone}: ${result.response}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await this.updateVendorResponse(otpId, { success: false, response: errorMessage });
  }
}
```

### **4. Vendor Response Storage**

```typescript
private async updateVendorResponse(otpId: number, result: { success: boolean; response: string }): Promise<void> {
  const query = `
    UPDATE otp_verification
    SET vendor_response = ?
    WHERE id = ?
  `;

  const responseData = JSON.stringify(result);
  await executeQuery(query, [responseData, otpId]);
}
```

## 📈 **Benefits of Asynchronous Flow**

### **1. Improved User Experience**

- **Faster Response**: User gets immediate feedback
- **No Waiting**: No blocking on SMS delivery
- **Better UX**: Modal transitions happen instantly

### **2. Better Error Handling**

- **Non-blocking**: API failures don't affect user flow
- **Retry Capability**: Can implement retry logic later
- **Monitoring**: Track all vendor responses

### **3. Scalability**

- **Concurrent Processing**: Multiple SMS requests handled efficiently
- **Resource Optimization**: Database operations don't wait for SMS
- **Load Distribution**: SMS sending doesn't block API responses

## 🔍 **Vendor Response Tracking**

### **Response Format:**

```json
{
  "success": true,
  "response": "success | messageId123456"
}
```

### **Error Response:**

```json
{
  "success": false,
  "response": "Network timeout error"
}
```

### **Database Storage:**

```sql
-- Example vendor_response content
UPDATE otp_verification
SET vendor_response = '{"success":true,"response":"success|msg123456"}'
WHERE id = 1;
```

## 📊 **Monitoring & Analytics**

### **Query Examples:**

```sql
-- Check success rate
SELECT
  COUNT(*) as total_requests,
  SUM(CASE WHEN JSON_EXTRACT(vendor_response, '$.success') = true THEN 1 ELSE 0 END) as successful,
  SUM(CASE WHEN JSON_EXTRACT(vendor_response, '$.success') = false THEN 1 ELSE 0 END) as failed
FROM otp_verification
WHERE created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR);

-- Check vendor response details
SELECT
  phone,
  JSON_EXTRACT(vendor_response, '$.response') as vendor_response,
  created_at
FROM otp_verification
WHERE vendor_response IS NOT NULL
ORDER BY created_at DESC;
```

## 🚀 **Migration Steps**

### **1. Run Database Migration:**

```sql
-- Execute add-vendor-response-column.sql
ALTER TABLE otp_verification
ADD COLUMN IF NOT EXISTS vendor_response TEXT NULL COMMENT 'Stores Gupshup API response';
```

### **2. Deploy Updated Code:**

- Updated `otpService.ts` with asynchronous flow
- Updated `gupshupService.ts` with response tracking
- Updated `auth.ts` types with vendor_response field

### **3. Monitor Implementation:**

- Check vendor_response column population
- Monitor SMS delivery success rates
- Verify user experience improvements

## ⚠️ **Important Notes**

### **1. Backward Compatibility**

- Existing OTP verification still works
- Vendor response is optional (NULL for old records)
- No breaking changes to API responses

### **2. Error Handling**

- SMS failures don't affect OTP verification
- Users can still verify OTP even if SMS fails
- All errors are logged and tracked

### **3. Performance**

- API response time improved significantly
- Database operations are non-blocking
- SMS sending happens in background

## 🔧 **Configuration**

### **Environment Variables:**

```env
OTP_EXPIRY_MINUTES=5
OTP_MAX_ATTEMPTS=3
RATE_LIMIT_OTP_PER_HOUR=3
```

### **Gupshup Configuration:**

```env
GUPSHUP_USERID=2000259058
GUPSHUP_PASSWORD=your_password
```

### **Updated API Endpoint:**

- **URL**: `https://mediaapi.smsgupshup.com/GatewayAPI/rest`
- **Method**: `SENDMESSAGE` with `isTemplate=true`
- **Format**: JSON response format
- **Message Template**: `%2A{otp}%2A+is+your+verification+code.+For+your+security%2C+do+not+share+this+code.`

This asynchronous implementation provides better user experience, improved error handling, and comprehensive vendor response tracking for monitoring and analytics.
