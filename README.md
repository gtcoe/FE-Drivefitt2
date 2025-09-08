# DriveFitt Frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## 🚀 Deployment Issues & Troubleshooting

### 📧 Invoice Email Issues on Vercel

If you're not receiving invoice emails after payment on Vercel:

1. **Check Environment Variables** in Vercel Dashboard:

   - Go to Settings → Environment Variables
   - Ensure `BREVO_API_KEY` is set correctly
   - Verify `SENDER_EMAIL` is configured

2. **Test Services Endpoint**:

   ```bash
   # Visit this URL after deployment to test all services:
   https://your-domain.vercel.app/api/test-services
   ```

3. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Functions
   - Click on `/api/payments/verify`
   - Check "Logs" tab for detailed execution logs

### 🔍 Common Issues & Solutions

#### Issue 1: Environment Variables Not Set

```bash
# Look for these errors in logs:
❌ BREVO_API_KEY environment variable is not set!
❌ SENDER_EMAIL environment variable is not set!
```

**Solution**: Add missing variables in Vercel Dashboard

#### Issue 2: Database Connection Failed

```bash
# Look for:
❌ Database connection error details
❌ Query failed, retrying...
```

**Solution**: Verify database credentials and network access

#### Issue 3: Email Service Failed

```bash
# Look for:
❌ Error sending membership success email via Brevo
❌ BREVO_API_KEY not set - cannot send email
```

**Solution**: Check Brevo API key and sender email configuration

### 📊 Monitoring & Debugging

1. **Real-time Logs**: Look for emoji indicators in Vercel logs:

   - 🚀 = Function started
   - ✅ = Success
   - ❌ = Error
   - 📧 = Email process
   - 👤 = User data

2. **Service Testing**: Use `/api/test-services` endpoint to verify:
   - Environment variables
   - Database connection
   - Brevo API functionality
   - PDF generation

### 🛠️ Quick Fixes

1. **Redeploy with Environment Variables**:

   ```bash
   # After adding env vars in Vercel Dashboard
   git push origin main
   # Vercel will auto-deploy
   ```

2. **Check Function Timeouts**:

   - Payment verification: 60s (configured in vercel.json)
   - Other functions: 30s

3. **Verify Brevo API Key**:
   - Check Brevo dashboard for API usage
   - Ensure sender email domain is verified

### 📚 Detailed Documentation

For comprehensive troubleshooting, see:

- [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [RAZORPAY_INTEGRATION.md](./RAZORPAY_INTEGRATION.md) - Payment integration details

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
