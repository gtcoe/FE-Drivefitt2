# Form Submissions Implementation Plan - Production Ready

## Current State Analysis

### Database Tables (from schema)

1. **contact_us** - General Queries

   - Columns: id, first_name, last_name, email, phone, message, created_at, updated_at
   - NO status column currently

2. **franchise_inquiries** - Franchise Applications

   - Columns: id, business_name, contact_person, email, phone, location, city, state, investment_capacity, experience_years, business_background, why_franchise, status, notes, assigned_to, created_at, updated_at
   - HAS status column: TINYINT (1=New, 2=Contacted, 3=In Discussion, 4=Approved, 5=Rejected)

3. **lead_generation** - Lead Submissions
   - Columns: id, name, phone, message, preferred_location, cricket, fitness, recovery, running, pilates, personal_training, physiotherapy, group_classes, created_at, updated_at
   - NO status column currently

### Issues Found

1. ❌ Using mock data instead of fetching from database
2. ❌ No status update API endpoints
3. ❌ Status column missing in contact_us and lead_generation tables
4. ❌ Missing search functionality
5. ❌ Missing date range filter
6. ❌ Missing download CSV functionality
7. ❌ No API integration for fetching data
8. ❌ No delete/update operations

## Implementation Plan

### Phase 1: Database Schema Updates

**Files to modify:**

- Create new migration SQL file

**Tasks:**

1. Add status column to `contact_us` table
   - `status TINYINT DEFAULT 1 COMMENT '1=New, 2=In Progress, 3=Resolved, 4=Closed'`
2. Add status column to `lead_generation` table
   - `status TINYINT DEFAULT 1 COMMENT '1=New, 2=Contacted, 3=Qualified, 4=Converted, 5=Rejected'`
3. Add notes and assigned_to columns to both tables for consistency

### Phase 2: API Endpoints - Form Submissions CRUD

**Create new API routes:**

#### 1. Contact Us (General Queries) APIs

- `GET /api/admin/contact-us` - Fetch all with pagination, search, filters
- `GET /api/admin/contact-us/[id]` - Fetch single record
- `PATCH /api/admin/contact-us/[id]/status` - Update status
- `DELETE /api/admin/contact-us/[id]` - Delete record
- `GET /api/admin/contact-us/export` - Export to CSV

#### 2. Franchise Inquiries APIs

- `GET /api/admin/franchise-inquiries` - Fetch all with pagination, search, filters
- `GET /api/admin/franchise-inquiries/[id]` - Fetch single record
- `PATCH /api/admin/franchise-inquiries/[id]/status` - Update status
- `DELETE /api/admin/franchise-inquiries/[id]` - Delete record
- `GET /api/admin/franchise-inquiries/export` - Export to CSV

#### 3. Lead Generation APIs

- `GET /api/admin/lead-generation` - Fetch all with pagination, search, filters
- `GET /api/admin/lead-generation/[id]` - Fetch single record
- `PATCH /api/admin/lead-generation/[id]/status` - Update status
- `DELETE /api/admin/lead-generation/[id]` - Delete record
- `GET /api/admin/lead-generation/export` - Export to CSV

**Query Parameters for GET endpoints:**

- `page` - Page number
- `limit` - Items per page
- `search` - Search query
- `status` - Filter by status
- `startDate` - Date range filter start
- `endDate` - Date range filter end
- `sortBy` - Sort column
- `sortOrder` - asc/desc

### Phase 3: TypeScript Types & Interfaces

**Files to create/modify:**

- `src/types/formSubmissions.ts` - Complete type definitions

**Types needed:**

```typescript
// Contact Us Types
interface ContactUsRecord {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  status: number;
  notes?: string;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
}

// Franchise Inquiry Types
interface FranchiseInquiryRecord {
  id: number;
  business_name: string;
  contact_person: string;
  email: string;
  phone: string;
  location: string;
  city: string;
  state: string;
  investment_capacity: number;
  experience_years: number;
  business_background: string;
  why_franchise: string;
  status: number;
  notes?: string;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
}

// Lead Generation Types
interface LeadGenerationRecord {
  id: number;
  name: string;
  phone: string;
  message: string;
  preferred_location: string;
  cricket: number;
  fitness: number;
  recovery: number;
  running: number;
  pilates: number;
  personal_training: number;
  physiotherapy: number;
  group_classes: number;
  status: number;
  notes?: string;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
}

// API Response Types
interface PaginatedResponse<T> {
  status: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
```

### Phase 4: Frontend Components Refactoring

**Files to modify:**

1. `src/components/AdminPortal/FormSubmissionTable.tsx` - Complete rewrite
2. `src/app/admin-portal/form-submission/general-queries/page.tsx`
3. `src/app/admin-portal/form-submission/franchise-applications/page.tsx`
4. `src/app/admin-portal/form-submission/lead-submissions/page.tsx`

**Component Features:**

1. ✅ Fetch data from API on mount
2. ✅ Real-time search with debounce
3. ✅ Date range filter component
4. ✅ Status filter dropdown
5. ✅ Pagination with proper state management
6. ✅ Status update dropdown with API call
7. ✅ Delete functionality with confirmation
8. ✅ CSV export button
9. ✅ Loading states
10. ✅ Error handling with toasts/alerts
11. ✅ Refresh data button

### Phase 5: Utility Functions

**Files to create:**

- `src/utils/csvExport.ts` - CSV export utility
- `src/utils/dateFilters.ts` - Date range helper functions
- `src/lib/formSubmissionApi.ts` - API client for form submissions

### Phase 6: Status Constants

**Files to create:**

- `src/constants/formSubmissionStatus.ts`

```typescript
// Contact Us Statuses
export const CONTACT_STATUS = {
  NEW: 1,
  IN_PROGRESS: 2,
  RESOLVED: 3,
  CLOSED: 4,
} as const;

export const CONTACT_STATUS_LABELS = {
  [CONTACT_STATUS.NEW]: "New",
  [CONTACT_STATUS.IN_PROGRESS]: "In Progress",
  [CONTACT_STATUS.RESOLVED]: "Resolved",
  [CONTACT_STATUS.CLOSED]: "Closed",
} as const;

export const CONTACT_STATUS_COLORS = {
  [CONTACT_STATUS.NEW]: "#00DBDC",
  [CONTACT_STATUS.IN_PROGRESS]: "#FFA500",
  [CONTACT_STATUS.RESOLVED]: "#00FF00",
  [CONTACT_STATUS.CLOSED]: "#808080",
} as const;

// Similar for Franchise and Lead Generation
```

### Phase 7: Testing Plan

**API Testing:**

1. Test all GET endpoints with various query parameters
2. Test status update APIs
3. Test delete APIs
4. Test CSV export
5. Test error scenarios (404, 500, validation errors)

**Frontend Testing:**

1. Test data fetching and display
2. Test search functionality
3. Test date filters
4. Test pagination
5. Test status updates
6. Test delete operations
7. Test CSV export
8. Test loading and error states

## File Structure

```
FE-DriveFitt/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── admin/
│   │           ├── contact-us/
│   │           │   ├── route.ts (GET, POST)
│   │           │   ├── [id]/
│   │           │   │   ├── route.ts (GET, PATCH, DELETE)
│   │           │   │   └── status/route.ts (PATCH)
│   │           │   └── export/route.ts (GET)
│   │           ├── franchise-inquiries/
│   │           │   └── (same structure)
│   │           └── lead-generation/
│   │               └── (same structure)
│   ├── components/
│   │   └── AdminPortal/
│   │       ├── FormSubmissionTable.tsx (refactored)
│   │       ├── DateRangeFilter.tsx (new)
│   │       └── StatusDropdown.tsx (new)
│   ├── lib/
│   │   └── formSubmissionApi.ts (new)
│   ├── types/
│   │   └── formSubmissions.ts (new)
│   ├── constants/
│   │   └── formSubmissionStatus.ts (new)
│   └── utils/
│       ├── csvExport.ts (new)
│       └── dateFilters.ts (new)
└── form-submissions-schema-update.sql (new)
```

## Implementation Order

1. ✅ Database schema updates (migration SQL)
2. ✅ Create TypeScript types
3. ✅ Create status constants
4. ✅ Create utility functions (CSV, date filters)
5. ✅ Create API endpoints (GET, PATCH, DELETE, EXPORT)
6. ✅ Create API client library
7. ✅ Create new UI components (DateRangeFilter, StatusDropdown)
8. ✅ Refactor FormSubmissionTable component
9. ✅ Update page components
10. ✅ Test all endpoints
11. ✅ End-to-end testing

## Success Criteria

- ✅ No mock data - all data from database
- ✅ All CRUD operations working
- ✅ Status updates working and persisting
- ✅ Search working across all fields
- ✅ Date range filtering working
- ✅ Pagination working correctly
- ✅ CSV export working
- ✅ Proper error handling
- ✅ Loading states for all async operations
- ✅ Production-ready code quality
