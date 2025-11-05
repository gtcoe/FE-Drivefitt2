// Database status enums and constants
export const JOB_STATUS = {
  ACTIVE: 1,
  CLOSED: 2,
  DELETED: 3,
} as const;

export const APPLICATION_STATUS = {
  NEW: 0,
  SHORTLISTED: 1,
  IN_REVIEW: 2,
  REJECTED: 3,
} as const;

export const JOB_TYPE = {
  FULL_TIME: 1,
  PART_TIME: 2,
  CONTRACTOR: 3,
} as const;

export const DEPARTMENT_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
} as const;

export const LOCATION_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
} as const;

// Individual string constants for each status
export const JOB_STATUS_ACTIVE = "Active" as const;
export const JOB_STATUS_CLOSED = "Closed" as const;
export const JOB_STATUS_DELETED = "Deleted" as const;

export const APPLICATION_STATUS_NEW = "New" as const;
export const APPLICATION_STATUS_SHORTLISTED = "Shortlisted" as const;
export const APPLICATION_STATUS_IN_REVIEW = "In Review" as const;
export const APPLICATION_STATUS_REJECTED = "Rejected" as const;

// Status labels for UI display
export const JOB_STATUS_LABELS = {
  [JOB_STATUS.ACTIVE]: JOB_STATUS_ACTIVE,
  [JOB_STATUS.CLOSED]: JOB_STATUS_CLOSED,
  [JOB_STATUS.DELETED]: JOB_STATUS_DELETED,
} as const;

export const APPLICATION_STATUS_LABELS = {
  [APPLICATION_STATUS.NEW]: APPLICATION_STATUS_NEW,
  [APPLICATION_STATUS.SHORTLISTED]: APPLICATION_STATUS_SHORTLISTED,
  [APPLICATION_STATUS.IN_REVIEW]: APPLICATION_STATUS_IN_REVIEW,
  [APPLICATION_STATUS.REJECTED]: APPLICATION_STATUS_REJECTED,
} as const;

export const JOB_TYPE_LABELS = {
  [JOB_TYPE.FULL_TIME]: "Full-time",
  [JOB_TYPE.PART_TIME]: "Part-time",
  [JOB_TYPE.CONTRACTOR]: "Contractor",
} as const;

// Status colors for UI
export const JOB_STATUS_COLORS = {
  [JOB_STATUS.ACTIVE]: "#00DBDC",
  [JOB_STATUS.CLOSED]: "#BFBFBF",
  [JOB_STATUS.DELETED]: "#FF6B6B",
} as const;

export const APPLICATION_STATUS_COLORS = {
  [APPLICATION_STATUS.NEW]: "#00DBDC",
  [APPLICATION_STATUS.SHORTLISTED]: "#0BFFB6",
  [APPLICATION_STATUS.IN_REVIEW]: "#BFBFBF",
  [APPLICATION_STATUS.REJECTED]: "#FF6B6B",
} as const;

// Type definitions for better type safety
export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];
export type ApplicationStatus =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];
export type JobType = (typeof JOB_TYPE)[keyof typeof JOB_TYPE];
export type DepartmentStatus =
  (typeof DEPARTMENT_STATUS)[keyof typeof DEPARTMENT_STATUS];
export type LocationStatus =
  (typeof LOCATION_STATUS)[keyof typeof LOCATION_STATUS];

// String type definitions for UI components
export type JobStatusString =
  | typeof JOB_STATUS_ACTIVE
  | typeof JOB_STATUS_CLOSED
  | typeof JOB_STATUS_DELETED;
export type ApplicationStatusString =
  | typeof APPLICATION_STATUS_NEW
  | typeof APPLICATION_STATUS_SHORTLISTED
  | typeof APPLICATION_STATUS_IN_REVIEW
  | typeof APPLICATION_STATUS_REJECTED;
