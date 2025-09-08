# Gupshup OTP Authentication Implementation

This document outlines the complete implementation of Gupshup OTP authentication system for DriveFitt.

## 🚀 Features Implemented

- **OTP Generation & Verification**: Secure 4-digit OTP generation and validation
- **Gupshup SMS Integration**: Real-time SMS delivery via Gupshup API
- **User Authentication**: JWT-based authentication with session management
- **Rate Limiting**: Protection against OTP abuse (3 requests per hour)
- **Database Storage**: Secure OTP and user data storage
- **Frontend Integration**: Updated PhoneNumberModal with API integration
- **Integer Enums**: Performance-optimized enum usage throughout

## 📋 Prerequisites

1. **Gupshup Account**: Username and password for SMS API
2. **MySQL Database**: For storing users, OTPs, and sessions
3. **Environment Variables**: Proper configuration

## 🛠️ Installation & Setup

### 1. Install Dependencies

```bash
npm install axios jsonwebtoken bcryptjs
npm install --save-dev @types/jsonwebtoken @types/bcryptjs
```

### 2. Environment Variables

Create `.env.local` with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=drivefitt
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure

# Gupshup SMS Configuration
GUPSHUP_USERID=2000259058
GUPSHUP_PASSWORD=your_gupshup_password

# OTP Configuration
OTP_EXPIRY_MINUTES=5
OTP_MAX_ATTEMPTS=3

# Rate Limiting Configuration
RATE_LIMIT_OTP_PER_HOUR=3
RATE_LIMIT_VERIFY_PER_HOUR=5
```

### 3. Database Setup

Run the migration script:

```sql
-- Execute database-migration.sql in your MySQL database
```

## 📁 File Structure

```
src/
├── types/
│   └── auth.ts                    # Type definitions and enums
├── lib/
│   ├── gupshupService.ts          # Gupshup SMS integration
│   ├── otpService.ts              # OTP generation and verification
│   ├── jwtService.ts              # JWT token management
│   ├── userService.ts             # User operations
│   └── rateLimitService.ts        # Rate limiting
├── app/api/auth/
│   ├── send-otp/route.ts          # Send OTP API
│   ├── verify-otp/route.ts        # Verify OTP API
│   ├── login-with-otp/route.ts    # Login with OTP API
│   └── logout/route.ts            # Logout API
├── services/
│   └── authAPI.ts                 # Frontend API service
└── components/common/Modal/
    └── PhoneNumberModal.tsx       # Updated modal with API integration
```

## 🔧 API Endpoints

### 1. Send OTP

```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "phone": "9876543210",
  "purpose": 1
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent successfully to your mobile number."
}
```

### 2. Verify OTP

```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phone": "9876543210",
  "otp": "1234",
  "purpose": 1
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP verified successfully."
}
```

### 3. Login with OTP

```http
POST /api/auth/login-with-otp
Content-Type: application/json

{
  "phone": "9876543210",
  "otp": "1234"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "phone": "9876543210",
      "phone_verified": true,
      "status": 1
    },
    "expires_in": 604800
  }
}
```

### 4. Logout

```http
POST /api/auth/logout
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

## 🔐 Security Features

### Rate Limiting

- **OTP Requests**: 3 per hour per phone number
- **Verification Attempts**: 5 per hour per phone number
- **OTP Expiry**: 5 minutes
- **Max Attempts**: 3 per OTP

### Data Protection

- **JWT Tokens**: 7-day expiry with secure hashing
- **Phone Validation**: Indian mobile number format validation
- **Input Sanitization**: All inputs validated and sanitized
- **Session Management**: Secure session storage and cleanup

## 🎯 Integer Enums Usage

### OTP Purpose Enum

```typescript
export enum OTPPurpose {
  LOGIN = 1,
  REGISTRATION = 2,
  PASSWORD_RESET = 3,
}
```

### User Status Enum

```typescript
export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 2,
  SUSPENDED = 3,
}
```

## 🔄 Frontend Integration

### PhoneNumberModal Updates

- **API Integration**: Connected to new authentication APIs
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Token Storage**: Automatic JWT token storage in localStorage

### Usage Example

```typescript
import { authAPI } from "@/services/authAPI";
import { OTPPurpose } from "@/types/auth";

// Send OTP
const response = await authAPI.sendOTP("9876543210", OTPPurpose.LOGIN);

// Login with OTP
const loginResponse = await authAPI.loginWithOTP("9876543210", "1234");

// Store token
if (loginResponse.success && loginResponse.data?.token) {
  localStorage.setItem("authToken", loginResponse.data.token);
}
```

## 🧪 Testing

### Manual Testing Steps

1. **Database Setup**: Run migration script
2. **Environment Setup**: Configure all environment variables
3. **Gupshup Integration**: Test SMS delivery
4. **API Testing**: Test all endpoints with Postman/curl
5. **Frontend Testing**: Test PhoneNumberModal integration

### Test Cases

- ✅ Valid phone number validation
- ✅ OTP generation and delivery
- ✅ OTP verification
- ✅ Rate limiting enforcement
- ✅ JWT token generation
- ✅ Session management
- ✅ Error handling
- ✅ Frontend integration

## 🚨 Error Handling

### Common Error Scenarios

1. **Invalid Phone Number**: 400 Bad Request
2. **Rate Limit Exceeded**: 429 Too Many Requests
3. **Invalid OTP**: 400 Bad Request
4. **Expired OTP**: 400 Bad Request
5. **Network Errors**: 500 Internal Server Error

### Error Response Format

```json
{
  "success": false,
  "message": "Error description here"
}
```

## 📊 Monitoring & Logging

### Database Tables

- `otp_verification`: OTP records with attempts tracking
- `users`: User accounts with phone verification
- `user_sessions`: Active JWT sessions

### Logging

- All API calls logged with timestamps
- Error details logged for debugging
- Gupshup API responses logged

## 🔧 Configuration Options

### OTP Settings

- **Expiry Time**: Configurable via `OTP_EXPIRY_MINUTES`
- **Max Attempts**: Configurable via `OTP_MAX_ATTEMPTS`
- **Rate Limits**: Configurable via environment variables

### SMS Settings

- **API Endpoint**: `https://mediaapi.smsgupshup.com/GatewayAPI/rest`
- **Method**: `SENDMESSAGE` with `isTemplate=true`
- **Format**: JSON response format
- **Message Template**: `%2A{otp}%2A+is+your+verification+code.+For+your+security%2C+do+not+share+this+code.`

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migration executed
- [ ] Gupshup credentials verified
- [ ] API endpoints tested
- [ ] Frontend integration tested
- [ ] Rate limiting verified
- [ ] Error handling tested
- [ ] Security measures validated

## 📞 Support

For issues or questions:

1. Check environment variable configuration
2. Verify Gupshup account credentials
3. Review database connection settings
4. Check API endpoint responses
5. Validate frontend integration

## 🔄 Future Enhancements

- [ ] Email OTP as backup
- [ ] Multi-factor authentication
- [ ] Social login integration
- [ ] Admin dashboard for user management
- [ ] Analytics and reporting
- [ ] Webhook notifications
