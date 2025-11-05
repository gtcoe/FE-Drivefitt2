# Job Posting and Application Management APIs

This document outlines all APIs for managing job postings and applications, including resume upload via S3 pre-signed URLs.

## Database Tables

- `job_postings`: Job posting information
- `departments`: Department information
- `location`: Location information
- `applications`: Job applications

## API Endpoints

### 1) Job Postings

#### GET /api/job-postings

Fetch all job postings with optional filters.

Query Parameters:

- `status` (optional): 0=inactive, 1=active, 2=closed, 3=deleted
- `is_visible` (optional): true/false
- `department_id` (optional)
- `location_id` (optional)

Response: Array<JobPosting> including `department` and `location` objects.

#### GET /api/job-postings/[id]

Fetch a specific job posting by ID.

Response: JobPosting with `department` and `location`.

#### POST /api/job-postings

Create a new job posting.

Request Body (JSON):

```json
{
  "title": "Software Engineer",
  "department_id": 1,
  "location_id": 1,
  "job_type": 1,
  "application_deadline": "2025-12-31",
  "job_description": "Job description here",
  "skills_required": "Java, Spring Boot",
  "role": ["Backend Developer", "Team Contributor"],
  "qualifications": ["B.Tech in Computer Science", "2+ years experience"],
  "years_of_experience": "2-4",
  "is_visible": true
}
```

#### PUT /api/job-postings/[id]

Update a job posting (all fields optional; same schema as POST).

#### PUT /api/job-postings/[id]/status

Update job posting status.

Request Body:

```json
{ "status": 1 }
```

#### PUT /api/job-postings/[id]/visibility

Update job posting visibility.

Request Body:

```json
{ "is_visible": true }
```

### 2) Applications

#### GET /api/applications

Fetch applications with optional filters.

Query Parameters:

- `status` (optional): 0=new, 1=in review, 2=rejected, 3=shortlisted
- `job_id` (optional)

Response:

```json
{
  "applications": [
    {
      "id": 1,
      "candidate_name": "John Doe",
      "email": "john@example.com",
      "phone": "+91...",
      "job_id": 10,
      "status": 0,
      "current_location": "Gurugram",
      "work_exprience": "3 years",
      "expected_salary": "6 LPA",
      "resume": "https://cdn/.../resumes/uuid-file.pdf",
      "created_at": "...",
      "updated_at": "...",
      "job": {
        "id": 10,
        "title": "Frontend Developer",
        "department": { "id": 2, "name": "Engineering" }
      }
    }
  ]
}
```

#### POST /api/applications

Create a new application.

Request Body (multipart/form-data; all fields as strings):

- `candidate_name` (required)
- `email` (required)
- `phone` (optional)
- `job_id` (required, number string)
- `current_location` (optional)
- `work_exprience` (optional)
- `expected_salary` (optional)
- `resume` (optional; CDN URL string returned from upload step)

Behavior: Sets `status=0 (NEW)` by default.

#### PUT /api/applications/[id]/status

Update application status.

Request Body:

```json
{ "status": 1 }
```

#### GET /api/applications/[id]/resume

Returns a 302 redirect to the stored resume CDN URL when present.

### 3) Departments and Locations

#### GET /api/departments-locations

Fetch all active departments and locations.

Response:

```json
{ "departments": [...], "locations": [...] }
```

### 4) File Uploads (Presigned S3)

#### GET /api/uploads/presign

Create a presigned S3 URL to upload a resume directly from the browser.

Query Parameters:

- `type` (required): `resume`
- `filename` (required): original file name
- `contentType` (required): e.g. `application/pdf`

Response:

```json
{
  "status": true,
  "data": {
    "uploadUrl": "https://s3...",
    "cdnUrl": "https://cdn.../resumes/uuid-filename.pdf",
    "key": "resumes/uuid-filename.pdf"
  }
}
```

Upload flow:

1. Client calls `GET /api/uploads/presign` with filename and contentType
2. Client `PUT`s the file to `uploadUrl`
3. Client submits application via `POST /api/applications` with `resume` set to the returned `cdnUrl`

## Enums

### JobType

- `FULL_TIME = 1`
- `PART_TIME = 2`
- `CONTRACTOR = 3`

### JobStatus

- `ACTIVE = 1`
- `CLOSED = 2`
- `DELETED = 3`

### ApplicationStatus

- `NEW = 0`
- `IN_REVIEW = 1`
- `REJECTED = 2`
- `SHORTLISTED = 3`

## Example Usage

### Fetch all active & visible job postings

```
GET /api/job-postings?status=1&is_visible=true
```

### Create a new job posting

```http
POST /api/job-postings
Content-Type: application/json

{
  "title": "Frontend Developer",
  "department_id": 2,
  "location_id": 1,
  "job_type": 1,
  "job_description": "Develop user interfaces",
  "skills_required": "React, TypeScript, CSS",
  "role": ["Frontend Developer"],
  "qualifications": ["B.Tech in Computer Science"],
  "years_of_experience": "1-3",
  "is_visible": true
}
```

### Upload resume and submit application

```http
GET /api/uploads/presign?type=resume&filename=John_Doe.pdf&contentType=application/pdf

# PUT the file bytes to `uploadUrl` from the response

POST /api/applications
Content-Type: multipart/form-data

candidate_name=John Doe
email=john@example.com
phone=+1234567890
job_id=1
current_location=Gurugram
work_exprience=3 years
expected_salary=6 LPA
resume=https://cdn.../resumes/uuid-John_Doe.pdf
```

### Update application status

```http
PUT /api/applications/1/status
Content-Type: application/json

{ "status": 1 }
```

## Error Handling

Status codes:

- `200` Success
- `201` Created
- `400` Bad Request
- `404` Not Found
- `500` Internal Server Error

Error shape:

```json
{ "error": "Error description" }
```

Success shape (example):

```json
{ "success": true, "message": "Operation completed successfully", "id": 123 }
```
