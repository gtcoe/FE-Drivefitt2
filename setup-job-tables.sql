-- Create job posting and application management tables

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    status TINYINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create location table
CREATE TABLE IF NOT EXISTS location (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_location VARCHAR(500) NOT NULL,
    city VARCHAR(255),
    status TINYINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create job_postings table -- Reviewed
CREATE TABLE IF NOT EXISTS job_postings ( 
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    location_id INT NOT NULL,
    job_type INT NOT NULL,
    application_deadline DATE,
    job_description TEXT,
    skills_required TEXT,
    role JSON,
    qualifications JSON,
    status TINYINT NOT NULL DEFAULT 1,
    years_of_experience VARCHAR(50),
    is_visible TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (location_id) REFERENCES location(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create applications table
CREATE TABLE IF NOT EXISTS applications(
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    job_id INT NOT NULL,
    status TINYINT NOT NULL DEFAULT 0,
    current_location VARCHAR(255),
    work_exprience VARCHAR(255),
    expected_salary VARCHAR(255),
    resume VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES job_postings(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample data
INSERT INTO departments (name, title) VALUES 
('Human Resources', 'HR Department'),
('Engineering', 'Tech Department'),
('Sales & Marketing', 'Sales Department');

INSERT INTO location (full_location, city) VALUES 
('Head Office, MG Road, Mumbai', 'Mumbai'),
('2nd Floor, Cyber City, Gurugram', 'Gurugram'),
('3rd Floor, IT Park, Indore', 'Indore');

INSERT INTO job_postings (title, department_id, location_id, job_type, application_deadline, job_description, skills_required, role, qualifications, years_of_experience) VALUES 
('Software Engineer', 2, 3, 1, '2025-09-30', 'Responsible for developing and maintaining web applications.', 'Java, Spring Boot, MySQL, REST APIs', '["Backend Developer", "Team Contributor"]', '["B.Tech in Computer Science", "2+ years experience"]', '2-4'),
('HR Manager', 1, 1, 1, '2025-10-15', 'Manage human resources operations and policies.', 'HR Management, Communication, Leadership', '["HR Manager", "Policy Maker"]', '["MBA in HR", "5+ years experience"]', '5-8'),
('Sales Executive', 3, 2, 1, '2025-11-30', 'Drive sales growth and client relationships.', 'Sales, CRM, Communication', '["Sales Executive", "Client Manager"]', '["BBA in Marketing", "3+ years experience"]', '3-5');
