-- Check job postings status in database
-- Run this to see which jobs are visible/active

-- 1. Show all jobs with their status
SELECT 
    id,
    title,
    CASE 
        WHEN status = 1 THEN 'ACTIVE'
        WHEN status = 2 THEN 'CLOSED'
        WHEN status = 3 THEN 'DELETED'
        ELSE CONCAT('UNKNOWN (', status, ')')
    END as status_label,
    status as status_code,
    is_visible,
    department_id,
    location_id,
    created_at
FROM job_postings
ORDER BY id DESC;

-- 2. Show jobs that would be returned by the API (active + visible)
SELECT 
    id,
    title,
    status,
    is_visible,
    'WOULD SHOW IN API' as api_status
FROM job_postings
WHERE status = 1 AND is_visible = 1
ORDER BY id DESC;

-- 3. Show jobs that would NOT be returned by the API
SELECT 
    id,
    title,
    status,
    is_visible,
    CASE 
        WHEN status != 1 THEN CONCAT('Status is ', status, ' (not ACTIVE)')
        WHEN is_visible = 0 THEN 'Not visible'
        ELSE 'Unknown reason'
    END as reason_hidden
FROM job_postings
WHERE status != 1 OR is_visible = 0
ORDER BY id DESC;

-- 4. Count summary
SELECT 
    COUNT(*) as total_jobs,
    SUM(CASE WHEN status = 1 AND is_visible = 1 THEN 1 ELSE 0 END) as visible_active_jobs,
    SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as active_jobs,
    SUM(CASE WHEN is_visible = 1 THEN 1 ELSE 0 END) as visible_jobs
FROM job_postings;
