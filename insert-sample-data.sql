-- Insert additional departments
INSERT INTO departments (name, title) VALUES 
('Operations', 'Operations Department'),
('Fitness & Training', 'Fitness & Training Department'),
('Sales', 'Sales Department'),
('Marketing', 'Marketing Department'),
('Administration & HR', 'Administration & HR Department'),
('Finance & Accounts', 'Finance & Accounts Department'),
('Management', 'Management Department'),
('Others', 'Other Departments');

-- Job Type Mapping:
-- 1 = Full-time
-- 2 = Part-time  
-- 3 = Contractor

-- Insert additional locations (if needed)
INSERT INTO location (full_location, city) VALUES 
('Corporate Office, Sector 18, Noida', 'Noida'),
('Tech Hub, Whitefield, Bangalore', 'Bangalore'),
('Business District, Salt Lake, Kolkata', 'Kolkata');

-- Insert sample job postings with different job types
INSERT INTO job_postings (title, department_id, location_id, job_type, application_deadline, job_description, skills_required, role, qualifications, years_of_experience) VALUES 
-- Full-time positions (job_type = 1)
('Operations Manager', 4, 1, 1, '2025-12-31', 'Oversee daily operations and ensure efficiency.', 'Operations Management, Process Improvement, Leadership', '["Operations Manager", "Process Owner"]', '["MBA in Operations", "5+ years experience"]', '5-8'),
('Fitness Trainer', 5, 2, 1, '2025-11-15', 'Provide fitness training and wellness programs.', 'Fitness Training, Nutrition, Communication', '["Fitness Trainer", "Wellness Coach"]', '["Certified Personal Trainer", "2+ years experience"]', '2-4'),
('Marketing Specialist', 6, 3, 1, '2025-10-30', 'Develop and execute marketing campaigns.', 'Digital Marketing, Content Creation, Analytics', '["Marketing Specialist", "Campaign Manager"]', '["BBA in Marketing", "3+ years experience"]', '3-5'),

-- Part-time positions (job_type = 2)
('Part-time Sales Associate', 7, 1, 2, '2025-09-30', 'Support sales activities on part-time basis.', 'Sales, Customer Service, Communication', '["Sales Associate", "Customer Support"]', '["High School Diploma", "1+ years experience"]', '1-2'),
('Part-time Admin Assistant', 8, 2, 2, '2025-10-15', 'Provide administrative support part-time.', 'Administration, Data Entry, Organization', '["Admin Assistant", "Data Entry Clerk"]', '["Diploma in Office Management", "1+ years experience"]', '1-2'),

-- Contractor positions (job_type = 3)
('Contract Software Developer', 2, 3, 3, '2025-12-15', 'Contract-based software development project.', 'React, Node.js, MongoDB, AWS', '["Full Stack Developer", "Project Contributor"]', '["B.Tech in Computer Science", "3+ years experience"]', '3-5'),
('Contract Marketing Consultant', 6, 1, 3, '2025-11-30', 'Consult on marketing strategy and implementation.', 'Marketing Strategy, Brand Management, Analytics', '["Marketing Consultant", "Strategy Advisor"]', '["MBA in Marketing", "5+ years experience"]', '5-8'),
('Contract Finance Analyst', 9, 2, 3, '2025-10-31', 'Contract-based financial analysis and reporting.', 'Financial Analysis, Excel, Accounting', '["Finance Analyst", "Financial Reporter"]', '["CA/CFA", "4+ years experience"]', '4-6'),

-- Additional 20 job postings
('Senior Software Engineer', 2, 1, 1, '2025-12-20', 'Lead development of scalable web applications.', 'Java, Spring Boot, Microservices, Docker', '["Senior Developer", "Tech Lead"]', '["B.Tech in Computer Science", "5+ years experience"]', '5-8'),
('Digital Marketing Manager', 6, 2, 1, '2025-11-25', 'Manage digital marketing campaigns and strategies.', 'SEO, SEM, Social Media, Analytics', '["Marketing Manager", "Campaign Lead"]', '["MBA in Marketing", "4+ years experience"]', '4-6'),
('HR Business Partner', 8, 3, 1, '2025-10-20', 'Partner with business units on HR initiatives.', 'HR Strategy, Employee Relations, Talent Management', '["HR Business Partner", "People Manager"]', '["MBA in HR", "6+ years experience"]', '6-8'),
('Financial Controller', 9, 1, 1, '2025-12-10', 'Oversee financial reporting and compliance.', 'Financial Reporting, GAAP, Audit, Leadership', '["Financial Controller", "Finance Head"]', '["CA/CPA", "7+ years experience"]', '7-10'),
('Customer Success Manager', 7, 2, 1, '2025-11-05', 'Ensure customer satisfaction and retention.', 'Customer Relations, Account Management, CRM', '["Customer Success Manager", "Account Manager"]', '["BBA in Business", "3+ years experience"]', '3-5'),
('DevOps Engineer', 2, 3, 1, '2025-12-05', 'Manage infrastructure and deployment pipelines.', 'AWS, Docker, Kubernetes, CI/CD', '["DevOps Engineer", "Infrastructure Lead"]', '["B.Tech in Computer Science", "4+ years experience"]', '4-6'),
('Content Marketing Specialist', 6, 1, 1, '2025-10-15', 'Create and manage content marketing strategies.', 'Content Creation, SEO, Social Media, Analytics', '["Content Specialist", "Content Manager"]', '["B.A. in Communications", "2+ years experience"]', '2-4'),
('Training Coordinator', 5, 2, 1, '2025-11-20', 'Coordinate training programs and workshops.', 'Training Development, Event Management, Communication', '["Training Coordinator", "Learning Specialist"]', '["B.A. in Education", "3+ years experience"]', '3-5'),
('Business Analyst', 4, 3, 1, '2025-12-01', 'Analyze business processes and requirements.', 'Business Analysis, Data Analysis, Process Improvement', '["Business Analyst", "Process Analyst"]', '["MBA in Business", "3+ years experience"]', '3-5'),
('Part-time Content Writer', 6, 1, 2, '2025-09-25', 'Create engaging content for marketing materials.', 'Content Writing, SEO, Social Media', '["Content Writer", "Copywriter"]', '["B.A. in English", "1+ years experience"]', '1-3'),
('Part-time Data Entry Operator', 4, 2, 2, '2025-10-10', 'Handle data entry and administrative tasks.', 'Data Entry, Excel, Typing, Attention to Detail', '["Data Entry Operator", "Admin Support"]', '["High School Diploma", "1+ years experience"]', '1-2'),
('Part-time Customer Support', 7, 3, 2, '2025-11-15', 'Provide customer support via phone and email.', 'Customer Service, Communication, Problem Solving', '["Customer Support", "Help Desk"]', '["High School Diploma", "1+ years experience"]', '1-2'),
('Contract UI/UX Designer', 2, 1, 3, '2025-12-30', 'Design user interfaces and user experiences.', 'Figma, Adobe Creative Suite, User Research, Prototyping', '["UI/UX Designer", "Product Designer"]', '["B.Des in Design", "3+ years experience"]', '3-5'),
('Contract Data Scientist', 2, 2, 3, '2025-11-28', 'Analyze data and build machine learning models.', 'Python, Machine Learning, Statistics, SQL', '["Data Scientist", "ML Engineer"]', '["M.Tech in Data Science", "4+ years experience"]', '4-6'),
('Contract Legal Advisor', 8, 3, 3, '2025-10-25', 'Provide legal advice and compliance support.', 'Legal Research, Contract Law, Compliance, Communication', '["Legal Advisor", "Compliance Officer"]', '["LLB", "5+ years experience"]', '5-7'),
('Contract Project Manager', 4, 1, 3, '2025-12-15', 'Manage projects and ensure timely delivery.', 'Project Management, Agile, Leadership, Communication', '["Project Manager", "Scrum Master"]', '["PMP Certification", "6+ years experience"]', '6-8'),
('Contract Quality Assurance', 2, 2, 3, '2025-11-10', 'Ensure software quality through testing.', 'Manual Testing, Automated Testing, Bug Tracking, Selenium', '["QA Engineer", "Test Engineer"]', '["B.Tech in Computer Science", "3+ years experience"]', '3-5'),
('Contract Social Media Manager', 6, 3, 3, '2025-10-05', 'Manage social media presence and campaigns.', 'Social Media Marketing, Content Creation, Analytics', '["Social Media Manager", "Digital Marketing Specialist"]', '["B.A. in Marketing", "2+ years experience"]', '2-4'),
('Contract Research Analyst', 4, 1, 3, '2025-12-25', 'Conduct market research and analysis.', 'Market Research, Data Analysis, Report Writing', '["Research Analyst", "Market Analyst"]', '["MBA in Business", "3+ years experience"]', '3-5'),
('Contract Event Coordinator', 5, 2, 3, '2025-11-30', 'Coordinate events and training sessions.', 'Event Planning, Vendor Management, Communication', '["Event Coordinator", "Training Coordinator"]', '["B.A. in Event Management", "2+ years experience"]', '2-4');


