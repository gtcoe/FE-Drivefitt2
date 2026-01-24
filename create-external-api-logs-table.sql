-- Create external_api_logs table to track all external API calls
-- This table stores request payloads and responses for debugging and auditing

CREATE TABLE IF NOT EXISTS external_api_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type TINYINT NOT NULL COMMENT '1=YoActiv_AddMember, 2=YoActiv_SaveBill, 3=YoActiv_SaveEnquiry',
    payload JSON NOT NULL COMMENT 'Request payload sent to external API',
    response JSON NULL COMMENT 'Raw response from external API',
    status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    error_message TEXT NULL COMMENT 'Error message if API call failed',
    duration_ms INT NULL COMMENT 'API call duration in milliseconds',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Logs for all external API integrations';

-- Add comments for documentation
ALTER TABLE external_api_logs COMMENT = 'Stores request/response logs for external API calls (YoActiv, etc.)';
