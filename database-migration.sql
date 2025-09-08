-- Database Migration Script for Gupshup OTP Authentication System
-- Run this script to set up the required tables

-- Create OTP verification table with integer enum for purpose
CREATE TABLE IF NOT EXISTS otp_verification (
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

-- Create users table with integer enum for status
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) NULL,
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    phone_verified BOOLEAN DEFAULT FALSE,
    phone_verified_at TIMESTAMP NULL,
    status TINYINT DEFAULT 1 COMMENT '1=Active, 2=Inactive, 3=Suspended',
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_phone (phone),
    INDEX idx_users_email (email),
    INDEX idx_users_status (status)
);

-- Create user sessions table for JWT token management
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sessions_user (user_id),
    INDEX idx_sessions_expires (expires_at),
    INDEX idx_sessions_token_hash (token_hash)
);

-- Add comments for better documentation
ALTER TABLE otp_verification COMMENT = 'Stores OTP verification records for user authentication';
ALTER TABLE users COMMENT = 'Stores user account information';
ALTER TABLE user_sessions COMMENT = 'Stores active user sessions for JWT token validation';

-- Create indexes for better performance
CREATE INDEX idx_otp_phone_purpose ON otp_verification(phone, purpose);
CREATE INDEX idx_otp_created_at ON otp_verification(created_at);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_sessions_user_expires ON user_sessions(user_id, expires_at);
