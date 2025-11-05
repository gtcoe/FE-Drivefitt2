# Environment Variables Configuration

## Required Environment Variables

### AWS S3 Configuration

```bash
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=drivefitt
AWS_CLOUDFRONT_URL=https://da8nru77lsio9.cloudfront.net
```

### Gupshup WhatsApp Configuration

```bash
GUPSHUP_USERID=2000259058
GUPSHUP_PASSWORD=your_gupshup_password
```

### Email Configuration (Brevo)

```bash
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=info@drivefitt.club
```

### Database Configuration

```bash
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

## Setup Instructions

1. **AWS S3 Setup**:

   - Create an S3 bucket named `drivefitt` (or update `AWS_S3_BUCKET_NAME`)
   - Create IAM user with S3 permissions
   - Configure CloudFront distribution pointing to your S3 bucket
   - Set the CloudFront URL in `AWS_CLOUDFRONT_URL`

2. **Gupshup Setup**:

   - Sign up for Gupshup WhatsApp Business API
   - Get your userid and password from the dashboard
   - Set the credentials in environment variables

3. **Database Setup**:
   - Set up MySQL database
   - Configure connection details

## Testing

- Test WhatsApp: `POST /api/test-whatsapp-only`
- Test S3 + WhatsApp: `POST /api/test-s3-whatsapp` (requires AWS credentials)
- Test Email: `POST /api/test-email`

## File Structure

- Invoices are uploaded to S3 with path: `invoices/{receipt_number}.pdf`
- CDN URL format: `{AWS_CLOUDFRONT_URL}/invoices/{receipt_number}.pdf`

