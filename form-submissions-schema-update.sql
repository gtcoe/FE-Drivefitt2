-- Schema updates for form submissions tables
-- Add status, notes, and assigned_to columns for admin portal management

-- Update contact_us table
ALTER TABLE contact_us
ADD COLUMN status TINYINT DEFAULT 1 COMMENT '1=New, 2=In Progress, 3=Resolved, 4=Closed',
ADD COLUMN notes TEXT NULL,
ADD COLUMN assigned_to INT NULL,
ADD INDEX idx_contact_status (status),
ADD INDEX idx_contact_assigned (assigned_to),
ADD INDEX idx_contact_created (created_at);

-- Update lead_generation table  
ALTER TABLE lead_generation
ADD COLUMN status TINYINT DEFAULT 1 COMMENT '1=New, 2=Contacted, 3=Qualified, 4=Converted, 5=Rejected',
ADD COLUMN notes TEXT NULL,
ADD COLUMN assigned_to INT NULL,
ADD INDEX idx_lead_status (status),
ADD INDEX idx_lead_assigned (assigned_to),
ADD INDEX idx_lead_created (created_at);

-- Ensure franchise_inquiries has proper indexes
ALTER TABLE franchise_inquiries
ADD INDEX IF NOT EXISTS idx_franchise_created (created_at);

-- Add comments for documentation
ALTER TABLE contact_us COMMENT = 'Stores contact form submissions from website';
ALTER TABLE lead_generation COMMENT = 'Stores lead generation form submissions from website';
ALTER TABLE franchise_inquiries COMMENT = 'Stores franchise inquiry submissions from website';

