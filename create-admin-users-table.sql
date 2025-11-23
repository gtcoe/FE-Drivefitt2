-- Create admin_users table for admin authentication
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status)
);

-- Insert a default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt with salt rounds 10
INSERT INTO admin_users (username, password, email, name, status) VALUES 
('admin', '$2b$10$Eok73p38YvZMrfI5kQGy7OcyqVuvdky/6x8AbysyPmPO6TVlFGE4u', 'admin@drivefitt.com', 'Admin User', 'active')
ON DUPLICATE KEY UPDATE 
    password = VALUES(password),
    email = VALUES(email),
    name = VALUES(name),
    status = VALUES(status);
