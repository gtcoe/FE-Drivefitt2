# 🚀 Vercel Deployment Guide for DriveFitt

## 🔑 Required Environment Variables

### 1. Database Configuration

```bash
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=drivefitt
DB_PORT=3306
```

### 2. Email Service (Brevo)

```bash
BREVO_API_KEY=your_brevo_api_key_here
SENDER_EMAIL=alerts@drivefitt.club
NOTIFICATION_EMAIL=your_notification_email@example.com
FRANCHISE_NOTIFICATION_EMAIL=your_franchise_email@example.com
```

### 3. Razorpay Configuration

```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key
```

## 📋 Vercel Dashboard Setup

### 1. Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add all the above environment variables
4. **Important**: Set `NODE_ENV=production` for production deployment

### 2. Function Timeouts

- Payment verification: 60 seconds (already configured in vercel.json)
- Webhook handling: 30 seconds
- Order creation: 30 seconds

## 🔍 Troubleshooting Invoice Email Issues

### 1. Check Environment Variables

```bash
# In Vercel Function Logs, look for:
❌ BREVO_API_KEY environment variable is not set!
❌ SENDER_EMAIL environment variable is not set!
```

**Solution**: Add missing environment variables in Vercel dashboard

### 2. Check Brevo API Key

```bash
# Verify your Brevo API key is:
- Valid and active
- Has proper permissions
- Not expired
```

### 3. Check Database Connection

```bash
# Look for database connection errors:
❌ Database connection error details
❌ Query failed, retrying...
```

**Solution**: Verify database credentials and network access

### 4. Check Email Sending Process

```bash
# Look for these log patterns:
📧 Starting invoice generation and email process...
👤 User details retrieved
📄 Invoice data prepared
🔄 Generating invoice PDF...
✅ Invoice PDF generated successfully
📤 Scheduling email sending...
🚀 Executing email sending...
✅ Invoice email sent successfully
```

## 📊 Monitoring and Debugging

### 1. Vercel Function Logs

1. Go to Vercel Dashboard → Functions
2. Click on the function (e.g., `/api/payments/verify`)
3. Check "Logs" tab for detailed execution logs

### 2. Real-time Monitoring

```bash
# Look for these emoji indicators in logs:
🚀 = Function started
✅ = Success
❌ = Error
⚠️ = Warning
📧 = Email process
👤 = User data
📄 = Invoice data
🔄 = Processing
📤 = Scheduling
```

### 3. Common Error Patterns

#### Email Service Errors

```bash
❌ Error sending membership success email via Brevo
❌ BREVO_API_KEY not set - cannot send email
```

#### Database Errors

```bash
❌ Database connection error details
❌ Query failed, retrying...
❌ User not found for invoice generation
```

#### Invoice Generation Errors

```bash
❌ Failed to generate invoice or send email
❌ Invoice PDF generation failed
```

## 🛠️ Quick Fixes

### 1. Environment Variables Not Set

```bash
# Add in Vercel Dashboard → Settings → Environment Variables
BREVO_API_KEY=your_actual_key
SENDER_EMAIL=alerts@drivefitt.club
```

### 2. Database Connection Issues

```bash
# Verify database is accessible from Vercel
# Check firewall rules and network access
# Ensure database credentials are correct
```

### 3. Brevo API Issues

```bash
# Test Brevo API key manually
# Check Brevo dashboard for API usage
# Verify sender email domain is verified
```

## 📱 Testing After Deployment

### 1. Test Payment Flow

1. Make a test payment
2. Check Vercel function logs
3. Verify email is sent
4. Check invoice PDF generation

### 2. Monitor Logs

```bash
# Look for successful flow:
🚀 Payment verification API called
✅ Payment verification request received
📧 Starting invoice generation and email process...
✅ Invoice email sent successfully
```

### 3. Check Email Delivery

- Verify email arrives in inbox
- Check spam folder
- Verify invoice PDF attachment
- Confirm email content is correct

## 🚨 Emergency Contacts

### 1. Vercel Support

- Vercel Dashboard → Help → Contact Support
- Response time: Usually within 24 hours

### 2. Brevo Support

- Brevo Dashboard → Support
- Email: support@brevo.com

### 3. Database Support

- Contact your database provider
- Check network connectivity

## 📈 Performance Optimization

### 1. Function Timeouts

- Payment verification: 60s (handles PDF generation + email)
- Other functions: 30s (standard operations)

### 2. Database Connection Pooling

- Connection limit: 10
- Retry attempts: 3
- Connection timeout: 10s

### 3. Email Retry Logic

- Max retries: 3
- Retry delay: 1s
- Network error handling

---

**Last Updated**: $(date)
**Version**: 1.0
**Status**: Production Ready ✅
