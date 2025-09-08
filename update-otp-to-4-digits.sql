-- Migration script to update OTP column from 6 digits to 4 digits
-- Run this script if you have an existing database with 6-digit OTP

-- Update the OTP column size from VARCHAR(6) to VARCHAR(4)
ALTER TABLE otp_verification 
MODIFY COLUMN otp VARCHAR(4) NOT NULL;

-- Optional: Clear existing OTP records to ensure consistency
-- Uncomment the line below if you want to clear all existing OTP records
-- DELETE FROM otp_verification WHERE created_at < NOW();

-- Add comment for documentation
ALTER TABLE otp_verification COMMENT = 'Stores OTP verification records for user authentication (4-digit OTP)';
