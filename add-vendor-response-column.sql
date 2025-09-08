-- Migration script to add vendor_response column to existing otp_verification table

-- Add vendor_response column if it doesn't exist
ALTER TABLE otp_verification 
ADD COLUMN IF NOT EXISTS vendor_response TEXT NULL COMMENT 'Stores Gupshup API response';

-- Update existing records to have NULL vendor_response
UPDATE otp_verification 
SET vendor_response = NULL 
WHERE vendor_response IS NULL;
