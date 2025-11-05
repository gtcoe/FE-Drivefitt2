"use client";

import React, { useState } from "react";
import Image from "next/image";
import Pagination from "../common/Pagination";
import ColumnFilter from "./ColumnFilter";
import {
  JOB_STATUS_COLORS,
  APPLICATION_STATUS_COLORS,
  APPLICATION_STATUS_LABELS,
  JOB_STATUS,
  APPLICATION_STATUS,
  JobStatusString,
  ApplicationStatusString,
  JOB_STATUS_ACTIVE,
  JOB_STATUS_CLOSED,
  JOB_STATUS_DELETED,
  APPLICATION_STATUS_NEW,
  APPLICATION_STATUS_SHORTLISTED,
  APPLICATION_STATUS_IN_REVIEW,
  APPLICATION_STATUS_REJECTED,
} from "@/constants/database";

type ToggleOption = "job-posts" | "application";

interface JobPostApplicationTableProps {
  selectedToggle: ToggleOption;
  jobPosts?: JobPostData[];
  applications?: ApplicationData[];
  onEditJobPost?: (index: number, jobData: JobPostData) => void;
  onDeleteJobPost?: (index: number, jobData: JobPostData) => void;
  onChangeJobPostStatus?: (
    index: number,
    jobData: JobPostData,
    newStatus: JobStatusString
  ) => void;
  onToggleVisibility?: (index: number, jobData: JobPostData) => void;
  onChangeApplicationStatus?: (
    index: number,
    application: ApplicationData,
    newStatus: ApplicationStatusString
  ) => void;
  onDownloadResume?: (index: number, application: ApplicationData) => void;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  // Filter props
  departments?: Array<{ id: number; name: string }>;
  locations?: Array<{ id: number; full_location: string }>;
  onDepartmentFilter?: (selectedIds: number[]) => void;
  onLocationFilter?: (selectedIds: number[]) => void;
  onStatusFilter?: (selectedStatuses: number[]) => void;
  selectedDepartments?: number[];
  selectedLocations?: number[];
  selectedStatuses?: number[];
  // Applications tab specific filters
  jobs?: Array<{ id: number; title: string }>;
  selectedAppliedJobs?: number[];
  onAppliedJobsFilter?: (selectedIds: number[]) => void;
  selectedApplicationStatuses?: number[];
  onApplicationStatusFilter?: (selectedIds: number[]) => void;
}

interface ApplicationData {
  id: number;
  candidatesName: string;
  emailAddress: string;
  phoneNumber: string;
  workExperience: string;
  expectedSalary: string;
  appliedFor: string;
  resumeStatus: ApplicationStatusString;
  resumeUrl?: string;
}

interface JobPostData {
  id: number;
  jobTitle: string;
  department: string;
  location: string;
  status: JobStatusString;
  isVisible: boolean;
}

const mockApplicationData: ApplicationData[] = [];

const mockJobPostData: JobPostData[] = [];

const JobPostApplicationTable: React.FC<JobPostApplicationTableProps> = ({
  selectedToggle,
  jobPosts = mockJobPostData,
  applications = mockApplicationData,
  onEditJobPost,
  onDeleteJobPost,
  onChangeJobPostStatus,
  onToggleVisibility,
  onChangeApplicationStatus,
  onDownloadResume,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  // Filter props
  departments,
  locations,
  onDepartmentFilter,
  onLocationFilter,
  onStatusFilter,
  selectedDepartments,
  selectedLocations,
  selectedStatuses,
  jobs,
  selectedAppliedJobs,
  onAppliedJobsFilter,
  selectedApplicationStatuses,
  onApplicationStatusFilter,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [jobPostStatuses, setJobPostStatuses] = useState<JobStatusString[]>(
    jobPosts.map((item) => item.status)
  );
  const [applicationStatuses, setApplicationStatuses] = useState<
    ApplicationStatusString[]
  >(applications.map((item) => item.resumeStatus));

  // keep local mirrors in sync with incoming props
  React.useEffect(() => {
    setJobPostStatuses(jobPosts.map((item) => item.status));
  }, [jobPosts]);
  React.useEffect(() => {
    setApplicationStatuses(applications.map((item) => item.resumeStatus));
  }, [applications]);

  const handleJobPostStatusChange = (
    index: number,
    newStatus: JobStatusString
  ) => {
    const updatedStatuses = [...jobPostStatuses];
    updatedStatuses[index] = newStatus;
    setJobPostStatuses(updatedStatuses);
    setDropdownOpen(null);
    onChangeJobPostStatus?.(index, jobPosts[index], newStatus);
  };

  const handleApplicationStatusChange = (
    index: number,
    newStatus: ApplicationStatusString
  ) => {
    const updatedStatuses = [...applicationStatuses];
    updatedStatuses[index] = newStatus;
    setApplicationStatuses(updatedStatuses);
    onChangeApplicationStatus?.(index, applications[index], newStatus);
  };

  const handleEdit = (index: number) => {
    const jobData = jobPosts[index];
    onEditJobPost?.(index, jobData);
    setDropdownOpen(null);
  };

  const handleDelete = (index: number) => {
    onDeleteJobPost?.(index, jobPosts[index]);
    setDropdownOpen(null);
  };

  const toggleDropdown = (index: number) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest?.("[data-menu-root]")) setDropdownOpen(null);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const renderApplicationHeaders = () => (
    <div
      className="bg-[#333333] flex items-center text-[#8A8A8A] w-full sticky top-0 z-10"
      style={{
        height: "48px",
        paddingTop: "16px",
        paddingRight: "40px",
        paddingBottom: "16px",
        paddingLeft: "40px",
        gap: "24px",
        fontWeight: 500,
        fontSize: "12px",
        lineHeight: "16px",
      }}
    >
      <div className="flex-1">Candidates name</div>
      <div className="flex-1 ">Email address</div>
      <div className="flex-1 pl-[65px]">Phone number</div>
      <div className="flex-1">Work Experience</div>
      <div className="flex-1">Expected Salary</div>
      <div className="flex-1 flex items-center gap-2">
        <span>Applied for</span>
        <ColumnFilter
          options={
            jobs?.map((j) => ({ id: j.id, label: j.title, value: j.id })) || []
          }
          selectedValues={selectedAppliedJobs || []}
          onFilterChange={(values) => onAppliedJobsFilter?.(values as number[])}
          placeholder="Search jobs"
          searchable
          searchPlaceholder="Search jobs..."
          searchMinChars={2}
        />
      </div>
      <div className="flex-1 flex items-center justify-center gap-2">
        <span>Status</span>
        <ColumnFilter
          options={[
            {
              id: APPLICATION_STATUS.NEW,
              label: APPLICATION_STATUS_LABELS[APPLICATION_STATUS.NEW],
              value: APPLICATION_STATUS.NEW,
            },
            {
              id: APPLICATION_STATUS.SHORTLISTED,
              label: APPLICATION_STATUS_LABELS[APPLICATION_STATUS.SHORTLISTED],
              value: APPLICATION_STATUS.SHORTLISTED,
            },
            {
              id: APPLICATION_STATUS.IN_REVIEW,
              label: APPLICATION_STATUS_LABELS[APPLICATION_STATUS.IN_REVIEW],
              value: APPLICATION_STATUS.IN_REVIEW,
            },
            {
              id: APPLICATION_STATUS.REJECTED,
              label: APPLICATION_STATUS_LABELS[APPLICATION_STATUS.REJECTED],
              value: APPLICATION_STATUS.REJECTED,
            },
          ]}
          selectedValues={selectedApplicationStatuses || []}
          onFilterChange={(values) =>
            onApplicationStatusFilter?.(values as number[])
          }
          placeholder="Filter by Status"
        />
      </div>
      <div className="w-15 flex justify-center">Action</div>
    </div>
  );

  const renderJobPostHeaders = () => (
    <div
      className="bg-[#333333] flex items-center text-[#8A8A8A] w-full sticky top-0 z-10"
      style={{
        height: "48px",
        paddingTop: "16px",
        paddingRight: "40px",
        paddingBottom: "16px",
        paddingLeft: "40px",
        gap: "24px",
        fontWeight: 500,
        fontSize: "12px",
        lineHeight: "16px",
      }}
    >
      <div className="flex-1">Job title</div>
      <div className="flex-1 flex items-center gap-2">
        <span>Department</span>
        <ColumnFilter
          options={
            departments?.map((d) => ({
              id: d.id,
              label: d.name,
              value: d.id,
            })) || []
          }
          selectedValues={selectedDepartments || []}
          onFilterChange={(values) => onDepartmentFilter?.(values as number[])}
          placeholder="Filter by Department"
        />
      </div>
      <div className="flex-1 flex items-center gap-2">
        <span>Location</span>
        <ColumnFilter
          options={
            locations?.map((l) => ({
              id: l.id,
              label: l.full_location,
              value: l.id,
            })) || []
          }
          selectedValues={selectedLocations || []}
          onFilterChange={(values) => onLocationFilter?.(values as number[])}
          placeholder="Filter by Location"
        />
      </div>
      <div className="flex-1 flex items-center justify-center gap-2">
        <span>Status</span>
        <ColumnFilter
          options={[
            {
              id: JOB_STATUS.ACTIVE,
              label: JOB_STATUS_ACTIVE,
              value: JOB_STATUS.ACTIVE,
            },
            {
              id: JOB_STATUS.CLOSED,
              label: JOB_STATUS_CLOSED,
              value: JOB_STATUS.CLOSED,
            },
            {
              id: JOB_STATUS.DELETED,
              label: JOB_STATUS_DELETED,
              value: JOB_STATUS.DELETED,
            },
          ]}
          selectedValues={selectedStatuses || []}
          onFilterChange={(values) => onStatusFilter?.(values as number[])}
          placeholder="Filter by Status"
        />
      </div>
      <div className="w-15 flex justify-center">Action</div>
    </div>
  );

  const renderApplicationRows = () =>
    applications.map((item, index) => (
      <div
        key={index}
        className="bg-[#1D1D1D] border-r border-b border-l border-[#333333] flex items-center text-white relative w-full"
        style={{
          height: "56px",
          paddingTop: "16px",
          paddingRight: "40px",
          paddingBottom: "16px",
          paddingLeft: "40px",
          gap: "24px",
          fontSize: "14px",
        }}
      >
        <div className="flex-1">{item.candidatesName}</div>
        <div className="flex-1">{item.emailAddress}</div>
        <div className="flex-1">{item.phoneNumber}</div>
        <div className="flex-1">{item.workExperience}</div>
        <div className="flex-1">{item.expectedSalary}</div>
        <div className="flex-1">{item.appliedFor}</div>
        <div className="flex-1 flex justify-center">
          <div className="relative" data-menu-root>
            <button
              type="button"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                toggleDropdown(index + 1000);
              }}
              className="bg-[#333333] border border-[#333333] rounded flex items-center justify-between transition-colors"
              style={{
                width: "85px",
                height: "24px",
                paddingTop: "4px",
                paddingRight: "10px",
                paddingBottom: "4px",
                paddingLeft: "10px",
                gap: "4px",
              }}
            >
              <span
                className={`text-center`}
                style={{
                  color:
                    applicationStatuses[index] === APPLICATION_STATUS_NEW
                      ? APPLICATION_STATUS_COLORS[APPLICATION_STATUS.NEW]
                      : applicationStatuses[index] ===
                        APPLICATION_STATUS_SHORTLISTED
                      ? APPLICATION_STATUS_COLORS[
                          APPLICATION_STATUS.SHORTLISTED
                        ]
                      : applicationStatuses[index] ===
                        APPLICATION_STATUS_IN_REVIEW
                      ? APPLICATION_STATUS_COLORS[APPLICATION_STATUS.IN_REVIEW]
                      : APPLICATION_STATUS_COLORS[APPLICATION_STATUS.REJECTED], // REJECTED
                  fontWeight: 300,
                  fontSize: "12px",
                  lineHeight: "16px",
                  letterSpacing: "0%",
                }}
              >
                {applicationStatuses[index]}
              </span>
              <svg
                width="8"
                height="6"
                viewBox="0 0 8 6"
                fill="none"
                className={`${
                  applicationStatuses[index] === APPLICATION_STATUS_NEW
                    ? "text-[#00DBDC]"
                    : applicationStatuses[index] ===
                      APPLICATION_STATUS_SHORTLISTED
                    ? "text-[#0BFFB6]"
                    : applicationStatuses[index] ===
                      APPLICATION_STATUS_IN_REVIEW
                    ? "text-[#BFBFBF]"
                    : "text-[#FF6B6B]" // REJECTED
                } transform transition-transform duration-200 ${
                  dropdownOpen === index + 1000 ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M1 1L4 4L7 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {dropdownOpen === index + 1000 && (
              <div
                className="absolute left-0 bg-[#1D1D1D] border border-[#333333] rounded shadow-lg z-20"
                data-menu-root
                style={{
                  width: "85px",
                  // Position above for last 2 items, below for others
                  ...(index >= applications.length - 2
                    ? { bottom: "100%", marginBottom: "4px" }
                    : { top: "100%", marginTop: "4px" }),
                }}
              >
                {applicationStatuses[index] !== APPLICATION_STATUS_NEW && (
                  <button
                    type="button"
                    onClick={() => {
                      handleApplicationStatusChange(
                        index,
                        APPLICATION_STATUS_NEW
                      );
                      setDropdownOpen(null);
                    }}
                    className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-[#333333]"
                  >
                    {APPLICATION_STATUS_NEW}
                  </button>
                )}
                {applicationStatuses[index] !==
                  APPLICATION_STATUS_SHORTLISTED && (
                  <button
                    type="button"
                    onClick={() => {
                      handleApplicationStatusChange(
                        index,
                        APPLICATION_STATUS_SHORTLISTED
                      );
                      setDropdownOpen(null);
                    }}
                    className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-[#333333]"
                  >
                    {APPLICATION_STATUS_SHORTLISTED}
                  </button>
                )}
                {applicationStatuses[index] !==
                  APPLICATION_STATUS_IN_REVIEW && (
                  <button
                    type="button"
                    onClick={() => {
                      handleApplicationStatusChange(
                        index,
                        APPLICATION_STATUS_IN_REVIEW
                      );
                      setDropdownOpen(null);
                    }}
                    className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-[#333333]"
                  >
                    {APPLICATION_STATUS_IN_REVIEW}
                  </button>
                )}
                {applicationStatuses[index] !== APPLICATION_STATUS_REJECTED && (
                  <button
                    type="button"
                    onClick={() => {
                      handleApplicationStatusChange(
                        index,
                        APPLICATION_STATUS_REJECTED
                      );
                      setDropdownOpen(null);
                    }}
                    className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-[#333333]"
                  >
                    {APPLICATION_STATUS_REJECTED}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="w-15 flex justify-center">
          <div className="relative" data-menu-root>
            <button
              type="button"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                toggleDropdown(index + 2000);
              }}
              className="w-8 h-8 flex items-center justify-center hover:bg-[#333333] rounded"
            >
              <Image
                src="/images/careers/dots-vertical.svg"
                alt="Actions"
                width={16}
                height={16}
              />
            </button>
            {dropdownOpen === index + 2000 && (
              <div
                className="absolute right-0 bg-[#1D1D1D] border border-[#333333] rounded shadow-lg z-20"
                data-menu-root
                style={{
                  // Position above for last 2 items, below for others
                  ...(index >= applications.length - 2
                    ? { bottom: "100%", marginBottom: "4px" }
                    : { top: "100%", marginTop: "4px" }),
                }}
              >
                {item.resumeUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      onDownloadResume?.(index, item);
                      setDropdownOpen(null);
                    }}
                    className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-[#333333]"
                  >
                    Download Resume
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    ));

  const renderJobPostRows = () =>
    jobPosts.map((item, index) => (
      <div
        key={index}
        className="bg-[#1D1D1D] border-r border-b border-l border-[#333333] flex items-center text-white relative w-full"
        style={{
          height: "56px",
          paddingTop: "16px",
          paddingRight: "40px",
          paddingBottom: "16px",
          paddingLeft: "40px",
          gap: "24px",
          fontSize: "14px",
        }}
      >
        <div className="flex-1">{item.jobTitle}</div>
        <div className="flex-1">{item.department}</div>
        <div className="flex-1">{item.location}</div>
        <div className="flex-1 flex justify-center">
          <div className="relative" data-menu-root>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown(index + 2000);
              }}
              className="bg-[#333333] border border-[#333333] rounded flex items-center justify-center gap-1 transition-colors"
              style={{
                width: "85px",
                height: "24px",
                paddingTop: "4px",
                paddingRight: "10px",
                paddingBottom: "4px",
                paddingLeft: "10px",
                gap: "4px",
              }}
            >
              <span
                className={`text-center`}
                style={{
                  color:
                    jobPostStatuses[index] === JOB_STATUS_ACTIVE
                      ? JOB_STATUS_COLORS[1] // ACTIVE
                      : jobPostStatuses[index] === JOB_STATUS_CLOSED
                      ? JOB_STATUS_COLORS[2] // CLOSED
                      : JOB_STATUS_COLORS[3], // DELETED
                  fontWeight: 300,
                  fontSize: "12px",
                  lineHeight: "16px",
                  letterSpacing: "0%",
                }}
              >
                {jobPostStatuses[index]}
              </span>
              <svg
                width="8"
                height="6"
                viewBox="0 0 8 6"
                fill="none"
                className={`${"text-[#BFBFBF]"} transform transition-transform duration-200 ${
                  dropdownOpen === index + 2000 ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M1 1L4 4L7 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {dropdownOpen === index + 2000 && (
              <div
                className="absolute left-0 bg-[#1D1D1D] border border-[#333333] rounded shadow-lg z-10"
                data-menu-root
                style={{
                  width: "85px",
                  // Position above for last 2 items, below for others
                  ...(index >= jobPosts.length - 2
                    ? { bottom: "100%", marginBottom: "4px" }
                    : { top: "100%", marginTop: "4px" }),
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    handleJobPostStatusChange(
                      index,
                      jobPostStatuses[index] === JOB_STATUS_ACTIVE
                        ? JOB_STATUS_CLOSED
                        : JOB_STATUS_ACTIVE
                    );
                    setDropdownOpen(null);
                  }}
                  className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-[#333333]"
                >
                  {jobPostStatuses[index] === JOB_STATUS_ACTIVE
                    ? JOB_STATUS_CLOSED
                    : JOB_STATUS_ACTIVE}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="w-15 flex justify-center">
          <div className="relative" data-menu-root>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown(index + 3000);
              }}
              className="w-8 h-8 flex items-center justify-center hover:bg-[#333333] rounded"
            >
              <Image
                src="/images/careers/dots-vertical.svg"
                alt="Actions"
                width={16}
                height={16}
              />
            </button>
            {dropdownOpen === index + 3000 && (
              <div
                className="absolute right-0 bg-[#1D1D1D] border border-[#333333] rounded shadow-lg z-10"
                style={{
                  // Position above for last 2 items, below for others
                  ...(index >= jobPosts.length - 2
                    ? { bottom: "100%", marginBottom: "4px" }
                    : { top: "100%", marginTop: "4px" }),
                }}
                data-menu-root
              >
                <button
                  type="button"
                  onClick={() => {
                    handleEdit(index);
                    setDropdownOpen(null);
                  }}
                  className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-[#333333]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onToggleVisibility?.(index, jobPosts[index]);
                    setDropdownOpen(null);
                  }}
                  className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-[#333333]"
                >
                  {jobPosts[index].isVisible ? "Hide" : "Show"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDelete(index);
                    setDropdownOpen(null);
                  }}
                  className="block w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-[#333333]"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    ));

  return (
    <div className="w-full pb-6">
      {selectedToggle === "application" ? (
        <div className="w-full">
          <div className="border border-[#333333] rounded-2xl overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {renderApplicationHeaders()}
              <div className="pb-0">{renderApplicationRows()}</div>
            </div>
          </div>
          {onPageChange && (
            <div className="mt-4 px-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="w-full">
          <div className="border border-[#333333] rounded-2xl overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {renderJobPostHeaders()}
              <div className="">{renderJobPostRows()}</div>
            </div>
          </div>
          {onPageChange && (
            <div className="mt-4 px-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobPostApplicationTable;
