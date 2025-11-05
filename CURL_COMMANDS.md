# Job Posting and Application Management APIs - CURL Commands

## Prerequisites

1. Ensure database tables are created using `setup-job-tables.sql`
2. Start the Next.js development server: `npm run dev`
3. Server should be running on `http://localhost:3000`

## API Endpoints and CURL Commands

### 1. Get Departments and Locations

```bash
curl -X GET "http://localhost:3000/api/departments-locations" \
  -H "Content-Type: application/json"
```

### 2. Get All Job Postings

```bash
curl -X GET "http://localhost:3000/api/job-postings" \
  -H "Content-Type: application/json"
```

### 3. Get Job Postings with Filters

```bash
# Filter by status (1=Active)
curl -X GET "http://localhost:3000/api/job-postings?status=1" \
  -H "Content-Type: application/json"

# Filter by visibility
curl -X GET "http://localhost:3000/api/job-postings?is_visible=true" \
  -H "Content-Type: application/json"

# Filter by department
curl -X GET "http://localhost:3000/api/job-postings?department_id=2" \
  -H "Content-Type: application/json"

# Filter by location
curl -X GET "http://localhost:3000/api/job-postings?location_id=3" \
  -H "Content-Type: application/json"
```

### 4. Create New Job Posting

```bash
curl -X POST "http://localhost:3000/api/job-postings" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Software Engineer",
    "department_id": 2,
    "location_id": 3,
    "job_type": 1,
    "application_deadline": "2025-12-31",
    "job_description": "Lead development of web applications using modern technologies",
    "skills_required": "React, Node.js, TypeScript, AWS",
    "role": ["Tech Lead", "Full Stack Developer"],
    "qualifications": ["B.Tech in Computer Science", "5+ years experience"],
    "years_of_experience": "5-8",
    "is_visible": true
  }'
```

### 5. Get Specific Job Posting

```bash
# Replace {id} with actual job posting ID
curl -X GET "http://localhost:3000/api/job-postings/{id}" \
  -H "Content-Type: application/json"
```

### 6. Update Job Posting

```bash
# Replace {id} with actual job posting ID
curl -X PUT "http://localhost:3000/api/job-postings/{id}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Software Engineer",
    "job_description": "Updated job description",
    "years_of_experience": "3-6"
  }'
```

### 7. Update Job Posting Status

```bash
# Replace {id} with actual job posting ID
# Status: 0=Inactive, 1=Active, 2=Closed, 3=Deleted
curl -X PUT "http://localhost:3000/api/job-postings/{id}/status" \
  -H "Content-Type: application/json" \
  -d '{"status": 2}'
```

### 8. Update Job Posting Visibility

```bash
# Replace {id} with actual job posting ID
curl -X PUT "http://localhost:3000/api/job-postings/{id}/visibility" \
  -H "Content-Type: application/json" \
  -d '{"is_visible": false}'
```

### 9. Get All Applications

```bash
curl -X GET "http://localhost:3000/api/applications" \
  -H "Content-Type: application/json"
```

### 10. Get Applications with Filters

```bash
# Filter by status (0=New, 1=In Review, 2=Rejected, 3=Shortlisted)
curl -X GET "http://localhost:3000/api/applications?status=0" \
  -H "Content-Type: application/json"

# Filter by job ID
curl -X GET "http://localhost:3000/api/applications?job_id=1" \
  -H "Content-Type: application/json"
```

### 11. Create Application (with file upload)

```bash
curl -X POST "http://localhost:3000/api/applications" \
  -F "candidate_name=John Doe" \
  -F "email=john.doe@example.com" \
  -F "phone=+1234567890" \
  -F "job_id=1" \
  -F "resume=@/path/to/resume.pdf"
```

### 12. Create Application (without file)

```bash
curl -X POST "http://localhost:3000/api/applications" \
  -F "candidate_name=Jane Smith" \
  -F "email=jane.smith@example.com" \
  -F "phone=+0987654321" \
  -F "job_id=1"
```

### 13. Download Application Resume

```bash
# Replace {id} with actual application ID
curl -X GET "http://localhost:3000/api/applications/{id}/resume" \
  -o "resume_{id}.pdf"
```

### 14. Update Application Status

```bash
# Replace {id} with actual application ID
# Status: 0=New, 1=In Review, 2=Rejected, 3=Shortlisted
curl -X PUT "http://localhost:3000/api/applications/{id}/status" \
  -H "Content-Type: application/json" \
  -d '{"status": 1}'
```

## Status Codes Reference

### Job Status

- `0` = Inactive
- `1` = Active
- `2` = Closed
- `3` = Deleted

### Application Status

- `0` = New
- `1` = In Review
- `2` = Rejected
- `3` = Shortlisted

### Job Type

- `1` = Full Time
- `2` = Part Time
- `3` = Contractor

## Response Examples

### Successful Job Posting Creation

```json
{
  "success": true,
  "message": "Job posting created successfully",
  "id": 1
}
```

### Job Posting with Department and Location

```json
{
  "id": 1,
  "title": "Software Engineer",
  "job_type": 1,
  "application_deadline": "2025-09-30",
  "job_description": "Responsible for developing and maintaining web applications.",
  "skills_required": "Java, Spring Boot, MySQL, REST APIs",
  "role": ["Backend Developer", "Team Contributor"],
  "qualifications": ["B.Tech in Computer Science", "2+ years experience"],
  "status": 1,
  "years_of_experience": "2-4",
  "created_at": "2025-09-01T10:00:00.000Z",
  "updated_at": "2025-09-05T14:30:00.000Z",
  "department": {
    "id": 2,
    "name": "Engineering",
    "title": "Tech Department",
    "status": 1,
    "created_at": "2025-08-01T09:00:00.000Z",
    "updated_at": "2025-09-01T10:00:00.000Z"
  },
  "location": {
    "id": 3,
    "full_location": "3rd Floor, IT Park, Indore",
    "city": "Indore",
    "status": 1,
    "created_at": "2025-07-15T12:00:00.000Z",
    "updated_at": "2025-08-10T15:00:00.000Z"
  }
}
```

### Error Response

```json
{
  "error": "Job posting not found"
}
```

## Testing Notes

- All APIs return appropriate HTTP status codes (200, 201, 400, 404, 500)
- File uploads use multipart/form-data
- JSON fields (role, qualifications) are automatically serialized/deserialized
- Database relationships are properly joined in responses
- All endpoints include proper error handling and validation
