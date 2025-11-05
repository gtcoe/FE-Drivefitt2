"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import JobPostApplicationTable from "./JobPostApplicationTable";
import AddJobPostModal from "./AddJobPostModal";
import { jobAPI } from "@/services/jobAPI";
import { applicationAPI } from "@/services/applicationAPI";
import {
  JOB_STATUS,
  APPLICATION_STATUS,
  JOB_TYPE,
  JOB_STATUS_LABELS,
  APPLICATION_STATUS_LABELS,
  JobStatus,
  ApplicationStatus,
  JobType,
  JobStatusString,
  ApplicationStatusString,
  JOB_STATUS_ACTIVE,
  JOB_STATUS_CLOSED,
  APPLICATION_STATUS_NEW,
  APPLICATION_STATUS_SHORTLISTED,
  APPLICATION_STATUS_IN_REVIEW,
  APPLICATION_STATUS_REJECTED,
} from "@/constants/database";

type ToggleOption = "job-posts" | "application";

interface JobPostApplicationSectionProps {
  onDataChange?: () => void;
}

const JobPostApplicationSection: React.FC<JobPostApplicationSectionProps> = ({
  onDataChange,
}) => {
  const [selectedToggle, setSelectedToggle] =
    useState<ToggleOption>("job-posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editJobData, setEditJobData] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Filter states
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
  // Applications tab: status filter
  const [selectedApplicationStatuses, setSelectedApplicationStatuses] =
    useState<number[]>([]);
  const [departments, setDepartments] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [locations, setLocations] = useState<
    Array<{ id: number; full_location: string }>
  >([]);
  // Applications tab: filter by job (Applied for)
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);
  const [jobPosts, setJobPosts] = useState<
    {
      id: number;
      jobTitle: string;
      department: string;
      location: string;
      status: JobStatusString;
      isVisible: boolean;
    }[]
  >([]);

  // Store complete job data for editing without additional API calls
  const [completeJobData, setCompleteJobData] = useState<any[]>([]);
  const [applications, setApplications] = useState<
    {
      id: number;
      candidatesName: string;
      emailAddress: string;
      phoneNumber: string;
      workExperience: string;
      expectedSalary: string;
      appliedFor: string;
      jobId?: number;
      resumeStatus: ApplicationStatusString;
      resumeUrl?: string;
    }[]
  >([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const toStatus = (s: number | JobStatus): JobStatusString =>
    s === JOB_STATUS.ACTIVE
      ? JOB_STATUS_LABELS[JOB_STATUS.ACTIVE]
      : s === JOB_STATUS.CLOSED
      ? JOB_STATUS_LABELS[JOB_STATUS.CLOSED]
      : JOB_STATUS_LABELS[JOB_STATUS.DELETED];

  const toApplicationLabel = (
    s: number | ApplicationStatus
  ): ApplicationStatusString =>
    s === APPLICATION_STATUS.SHORTLISTED
      ? APPLICATION_STATUS_LABELS[APPLICATION_STATUS.SHORTLISTED]
      : s === APPLICATION_STATUS.IN_REVIEW
      ? APPLICATION_STATUS_LABELS[APPLICATION_STATUS.IN_REVIEW]
      : s === APPLICATION_STATUS.REJECTED
      ? APPLICATION_STATUS_LABELS[APPLICATION_STATUS.REJECTED]
      : APPLICATION_STATUS_LABELS[APPLICATION_STATUS.NEW];

  useEffect(() => {
    (async () => {
      try {
        const [jobs, apps, deptLocData] = await Promise.all([
          jobAPI.list({ admin: true }), // Get all job postings (both visible and hidden) for admin
          applicationAPI.list(),
          jobAPI.getDepartmentsLocations(),
        ]);

        // Store complete job data for editing
        setCompleteJobData(jobs);

        const jobMapped = jobs.map((j) => ({
          id: j.id,
          jobTitle: j.title,
          department: j.department?.name || "",
          location: j.location?.full_location || "",
          status: toStatus(j.status as number),
          isVisible: !!j.is_visible,
        }));
        setJobPosts(jobMapped);

        const appMapped = apps.map((a) => ({
          id: a.id,
          candidatesName: a.candidate_name,
          emailAddress: a.email,
          phoneNumber: a.phone || "",
          workExperience: a.work_exprience || "",
          expectedSalary: a.expected_salary || "",
          appliedFor: a.job?.title || "",
          jobId: a.job_id,
          resumeStatus: toApplicationLabel(a.status),
          resumeUrl: a.resume,
        }));
        setApplications(appMapped);

        // Set total items for pagination
        setTotalItems(
          selectedToggle === "job-posts" ? jobs.length : apps.length
        );

        // Set departments and locations for filters
        setDepartments(deptLocData.departments);
        setLocations(deptLocData.locations);
      } catch (_) {
        setJobPosts([]);
        setApplications([]);
        setTotalItems(0);
      }
    })();
  }, [selectedToggle]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  // Clear search when switching tabs
  const handleToggleChange = (toggle: ToggleOption) => {
    setSelectedToggle(toggle);
    setSearchQuery(""); // Clear search when switching tabs
    setCurrentPage(1); // Reset to first page
  };

  // Filter handlers
  const handleDepartmentFilter = (selectedIds: number[]) => {
    setSelectedDepartments(selectedIds);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleLocationFilter = (selectedIds: number[]) => {
    setSelectedLocations(selectedIds);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleStatusFilter = (selectedStatuses: number[]) => {
    setSelectedStatuses(selectedStatuses);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Applications tab: applied jobs filter
  const handleAppliedJobsFilter = (selectedIds: number[]) => {
    setAppliedJobIds(selectedIds);
    setCurrentPage(1);
  };

  // Applications tab: status filter handler
  const handleApplicationStatusFilter = (selectedIds: number[]) => {
    setSelectedApplicationStatuses(selectedIds);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Pagination calculations
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Filter data based on search query and filters
  const filteredJobPosts = useMemo(() => {
    let filtered = jobPosts;

    // Apply search filter (only on job title for job posts)
    if (searchQuery) {
      filtered = filtered.filter((job) =>
        job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply department filter
    if (selectedDepartments.length > 0) {
      filtered = filtered.filter((job) => {
        const jobDept = departments.find((d) => d.name === job.department);
        return jobDept && selectedDepartments.includes(jobDept.id);
      });
    }

    // Apply location filter
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((job) => {
        const jobLoc = locations.find((l) => l.full_location === job.location);
        return jobLoc && selectedLocations.includes(jobLoc.id);
      });
    }

    // Apply status filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((job) => {
        const statusMap = {
          Active: JOB_STATUS.ACTIVE,
          Closed: JOB_STATUS.CLOSED,
          Deleted: JOB_STATUS.DELETED,
        };
        const jobStatusValue = statusMap[job.status];
        return selectedStatuses.includes(jobStatusValue);
      });
    }

    return filtered;
  }, [
    jobPosts,
    searchQuery,
    selectedDepartments,
    selectedLocations,
    selectedStatuses,
    departments,
    locations,
  ]);

  const filteredApplications = useMemo(() => {
    let filtered = applications;

    // Applicant-name-only search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((app) =>
        (app.candidatesName || "").toLowerCase().includes(q)
      );
    }

    // Applied for filter (by job id)
    if (appliedJobIds.length > 0) {
      filtered = filtered.filter(
        (app) =>
          app.jobId !== undefined && appliedJobIds.includes(Number(app.jobId))
      );
    }

    // Status filter (by numeric enum values)
    if (selectedApplicationStatuses.length > 0) {
      filtered = filtered.filter((app) =>
        selectedApplicationStatuses.some((statusNum) => {
          const label =
            APPLICATION_STATUS_LABELS[
              statusNum as keyof typeof APPLICATION_STATUS_LABELS
            ];
          return label === app.resumeStatus;
        })
      );
    }

    return filtered;
  }, [applications, searchQuery, appliedJobIds, selectedApplicationStatuses]);

  // Update total items when filtered data changes
  useEffect(() => {
    const newTotal =
      selectedToggle === "job-posts"
        ? filteredJobPosts.length
        : filteredApplications.length;
    setTotalItems(newTotal);
    setCurrentPage(1); // Reset to first page when data changes
  }, [selectedToggle, filteredJobPosts, filteredApplications]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Paginated data
  const paginatedJobPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredJobPosts.slice(startIndex, endIndex);
  }, [filteredJobPosts, currentPage, itemsPerPage]);

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredApplications.slice(startIndex, endIndex);
  }, [filteredApplications, currentPage, itemsPerPage]);

  const handleAddNew = () => {
    setIsEditMode(false);
    setEditJobData(null);
    setIsAddModalOpen(true);
  };

  const handleEditJobPost = (index: number, jobData: any) => {
    // Find the complete job data from stored data (no API call needed)
    const fullJobData = completeJobData.find((job) => job.id === jobData.id);

    if (!fullJobData) {
      console.error("Job data not found for editing");
      alert("Job data not found. Please refresh the page and try again.");
      return;
    }

    // Map the complete job data to the form structure
    const mappedData = {
      id: fullJobData.id,
      jobTitle: fullJobData.title || "",
      departmentId: fullJobData.department_id || "",
      locationId: fullJobData.location_id || "",
      jobType:
        fullJobData.job_type === JOB_TYPE.FULL_TIME
          ? "Full-time"
          : fullJobData.job_type === JOB_TYPE.PART_TIME
          ? "Part-time"
          : "Contractor",
      applicationDeadline: fullJobData.application_deadline
        ? new Date(fullJobData.application_deadline).toISOString().split("T")[0]
        : "",
      jobDescription: fullJobData.job_description || "",
      skillsRequired: fullJobData.skills_required || "",
      roleItems: fullJobData.role || [],
      qualifications: fullJobData.qualifications || [],
      yearsOfExperience: fullJobData.years_of_experience || "",
      isVisible: fullJobData.is_visible || false,
    };

    setEditJobData(mappedData);
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setIsEditMode(false);
    setEditJobData(null);
  };

  const handleJobPostSubmit = async (jobPost: any) => {
    const mapJobType = (jt: string): JobType => {
      const v = (jt || "").toLowerCase();
      if (v.includes("part")) return JOB_TYPE.PART_TIME;
      if (v.includes("contract")) return JOB_TYPE.CONTRACTOR;
      return JOB_TYPE.FULL_TIME;
    };

    const payload = {
      title: jobPost.jobTitle,
      department_id: Number(jobPost.departmentId),
      location_id: Number(jobPost.locationId),
      job_type: mapJobType(jobPost.jobType),
      application_deadline: jobPost.applicationDeadline || undefined,
      job_description: jobPost.jobDescription || undefined,
      skills_required: jobPost.skillsRequired || undefined,
      role: jobPost.roleItems || [],
      qualifications: jobPost.qualifications || [],
      years_of_experience: jobPost.yearsOfExperience || undefined,
      is_visible: true,
    } as any;

    if (isEditMode && jobPost?.id) {
      await jobAPI.update(jobPost.id, payload);
    } else {
      await jobAPI.create(payload);
    }
    setIsAddModalOpen(false);
    const refreshed = await jobAPI.list({ admin: true }); // Get all job postings for admin
    // Update complete job data
    setCompleteJobData(refreshed);
    setJobPosts(
      refreshed.map((j) => ({
        id: j.id,
        jobTitle: j.title,
        department: j.department?.name || "",
        location: j.location?.full_location || "",
        status: toStatus(j.status),
        isVisible: !!j.is_visible,
      }))
    );
    // Refresh metrics when job is created/updated
    onDataChange?.();
  };

  const handleChangeJobPostStatus = async (
    index: number,
    jobData: { id: number },
    newStatus: JobStatusString
  ) => {
    await jobAPI.setStatus(
      jobData.id,
      newStatus === JOB_STATUS_ACTIVE ? JOB_STATUS.ACTIVE : JOB_STATUS.CLOSED
    );
    // Refresh job data and metrics when job status changes
    const refreshed = await jobAPI.list({ admin: true });
    setCompleteJobData(refreshed);
    setJobPosts(
      refreshed.map((j) => ({
        id: j.id,
        jobTitle: j.title,
        department: j.department?.name || "",
        location: j.location?.full_location || "",
        status: toStatus(j.status),
        isVisible: !!j.is_visible,
      }))
    );
    onDataChange?.();
  };

  const handleToggleVisibility = async (
    _index: number,
    jobData: { id: number; isVisible: boolean }
  ) => {
    await jobAPI.setVisibility(jobData.id, !jobData.isVisible);
    const refreshed = await jobAPI.list({ admin: true }); // Get all job postings for admin
    // Update complete job data
    setCompleteJobData(refreshed);
    setJobPosts(
      refreshed.map((j) => ({
        id: j.id,
        jobTitle: j.title,
        department: j.department?.name || "",
        location: j.location?.full_location || "",
        status: toStatus(j.status),
        isVisible: !!j.is_visible,
      }))
    );
    // Refresh metrics when visibility changes
    onDataChange?.();
  };

  const handleChangeApplicationStatus = async (
    index: number,
    application: { id: number },
    newStatus: ApplicationStatusString
  ) => {
    const statusMap: Record<string, ApplicationStatus> = {
      [APPLICATION_STATUS_IN_REVIEW]: APPLICATION_STATUS.IN_REVIEW,
      [APPLICATION_STATUS_SHORTLISTED]: APPLICATION_STATUS.SHORTLISTED,
      [APPLICATION_STATUS_NEW]: APPLICATION_STATUS.NEW,
      [APPLICATION_STATUS_REJECTED]: APPLICATION_STATUS.REJECTED,
    };
    await applicationAPI.setStatus(application.id, statusMap[newStatus]);
    // Refresh metrics when application status changes
    onDataChange?.();
  };

  const handleDownloadResume = (
    _index: number,
    application: { resumeUrl?: string; candidatesName: string }
  ) => {
    if (application.resumeUrl) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = application.resumeUrl;
      link.download = `${application.candidatesName}_resume.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDeleteJobPost = async (
    _index: number,
    jobData: { id: number; jobTitle: string }
  ) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${jobData.jobTitle}"? This will mark it as deleted but preserve the data.`
      )
    ) {
      try {
        await jobAPI.delete(jobData.id);
        // Refresh the job posts list
        const refreshed = await jobAPI.list({ admin: true });
        setCompleteJobData(refreshed);
        setJobPosts(
          refreshed.map((j) => ({
            id: j.id,
            jobTitle: j.title,
            department: j.department?.name || "",
            location: j.location?.full_location || "",
            status: toStatus(j.status),
            isVisible: !!j.is_visible,
          }))
        );
        // Refresh metrics when job is deleted
        onDataChange?.();
      } catch (error) {
        console.error("Failed to delete job posting:", error);
        alert("Failed to delete job posting. Please try again.");
      }
    }
  };

  return (
    <div>
      {/* Filter Header */}
      <div className="flex justify-between items-center p-6">
        {/* Toggle Section */}
        <div
          className="bg-[#1D1D1D] rounded-lg flex p-[6px]"
          style={{
            width: "220px",
            height: "40px",
            gap: "13px",
          }}
        >
          <button
            type="button"
            onClick={() => handleToggleChange("job-posts")}
            className={`rounded-md px-3 py-1 text-sm transition-all duration-200 ${
              selectedToggle === "job-posts"
                ? "bg-[#00DBDC] text-[#0D0D0D]"
                : "text-[#8A8A8A]"
            }`}
            style={{
              width: "90px",
              height: "28px",
              fontWeight: selectedToggle === "job-posts" ? 500 : 400,
              fontSize: "14px",
              lineHeight: "20px",
            }}
          >
            Job Posts
          </button>
          <button
            type="button"
            onClick={() => handleToggleChange("application")}
            className={`rounded-md px-3 py-1 text-sm transition-all duration-200 ${
              selectedToggle === "application"
                ? "bg-[#00DBDC] text-[#0D0D0D]"
                : "text-[#8A8A8A]"
            }`}
            style={{
              width: "103px",
              height: "28px",
              fontWeight: selectedToggle === "application" ? 500 : 400,
              fontSize: "14px",
              lineHeight: "20px",
            }}
          >
            Applications
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                selectedToggle === "job-posts"
                  ? "Search job titles..."
                  : "Search candidate..."
              }
              className="bg-[#0D0D0D] border border-[#333333] rounded-lg pl-10 pr-4 py-2 text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#00DBDC] transition-colors duration-200"
              style={{ width: "240px", height: "40px" }}
            />
            <Image
              src="/images/careers/career-search.svg"
              alt="Search"
              width={16}
              height={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A8A8A]"
            />
          </div>

          {/* Add New Post Button */}
          <button
            type="button"
            onClick={handleAddNew}
            className="bg-[#0D0D0D] border border-[#333333] rounded-lg flex items-center justify-center gap-2 hover:bg-[#333333] transition-colors duration-200 px-4"
            style={{ height: "40px" }}
          >
            <Image
              src="/images/careers/plus.svg"
              alt="Add new post"
              width={16}
              height={16}
            />
            <span className="text-[#BFBFBF] text-sm font-normal">
              Add new post
            </span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="pb-6">
        <JobPostApplicationTable
          selectedToggle={selectedToggle}
          jobPosts={paginatedJobPosts}
          applications={paginatedApplications}
          onEditJobPost={handleEditJobPost}
          onDeleteJobPost={handleDeleteJobPost}
          onChangeJobPostStatus={handleChangeJobPostStatus}
          onChangeApplicationStatus={handleChangeApplicationStatus}
          onDownloadResume={handleDownloadResume}
          onToggleVisibility={handleToggleVisibility}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          // Filter props
          departments={departments}
          locations={locations}
          onDepartmentFilter={handleDepartmentFilter}
          onLocationFilter={handleLocationFilter}
          onStatusFilter={handleStatusFilter}
          selectedDepartments={selectedDepartments}
          selectedLocations={selectedLocations}
          selectedStatuses={selectedStatuses}
          // Applications tab specific filters
          jobs={
            completeJobData?.map((j: any) => ({ id: j.id, title: j.title })) ||
            []
          }
          selectedAppliedJobs={appliedJobIds}
          onAppliedJobsFilter={handleAppliedJobsFilter}
          selectedApplicationStatuses={selectedApplicationStatuses}
          onApplicationStatusFilter={handleApplicationStatusFilter}
        />
      </div>

      {/* Add Job Post Modal */}
      <AddJobPostModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSubmit={handleJobPostSubmit}
        editData={editJobData}
        isEdit={isEditMode}
      />
    </div>
  );
};

export default JobPostApplicationSection;
