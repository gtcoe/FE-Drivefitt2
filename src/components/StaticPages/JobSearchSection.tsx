"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { JobSearchSection as JobSearchSectionType } from "@/types/staticPages";
import { jobAPI } from "@/services/jobAPI";
import { JobPosting } from "@/types/database";
import { JobType, JOB_TYPE } from "@/constants/database";
import JobDisplay from "./JobDisplay";

interface JobSearchSectionProps {
  data: JobSearchSectionType;
  isMobile?: boolean;
}

const JobSearchSection = ({ data, isMobile }: JobSearchSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All job categories");
  const [selectedType, setSelectedType] = useState("All job types");
  const [selectedLocation, setSelectedLocation] = useState("All job location");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<
    {
      id: number;
      title: string;
      location: string;
      jobType: string;
      jobCategory: string;
    }[]
  >([]);
  const [jobCategories, setJobCategories] = useState<string[]>([
    "All job categories",
  ]);
  const [jobTypes, setJobTypes] = useState<string[]>(["All job types"]);
  const [jobLocations, setJobLocations] = useState<string[]>([
    "All job location",
  ]);

  useEffect(() => {
    (async () => {
      try {
        const [postingList] = await Promise.all([
          jobAPI.list({ status: 1, is_visible: true }),
          jobAPI.getDepartmentsLocations(),
        ]);

        const typeLabel = (t: JobType) =>
          t === JOB_TYPE.FULL_TIME
            ? "Fulltime"
            : t === JOB_TYPE.PART_TIME
            ? "Part-time"
            : "Contractor";

        const mapped = postingList.map((jp: JobPosting) => ({
          id: jp.id,
          title: jp.title,
          location: jp.location?.full_location || "",
          jobType: typeLabel(jp.job_type),
          jobCategory: jp.department?.name || "General",
        }));
        setJobs(mapped);

        const categories = [
          "All job categories",
          ...Array.from(new Set(mapped.map((m) => m.jobCategory))).sort(),
        ];
        const types = [
          "All job types",
          ...Array.from(new Set(mapped.map((m) => m.jobType))).sort(),
        ];
        const locations = [
          "All job location",
          ...Array.from(new Set(mapped.map((m) => m.location))).sort(),
        ];
        setJobCategories(categories);
        setJobTypes(types);
        setJobLocations(locations);
      } catch (error) {
        console.error("Failed to fetch job data:", error);
        // No fallback - let the user know there's an issue
        setJobs([]);
      }
    })();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All job categories" ||
      job.jobCategory === selectedCategory;
    const matchesType =
      selectedType === "All job types" || job.jobType === selectedType;
    const matchesLocation =
      selectedLocation === "All job location" ||
      job.location === selectedLocation;

    return matchesSearch && matchesCategory && matchesType && matchesLocation;
  });

  const jobsPerPage = 10;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage) || 1;
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedType, selectedLocation]);

  return (
    <div className="w-full flex justify-center px-6 mt-[-180px] md:mt-[-320px] md:px-[120px]">
      <div
        className={`${
          isMobile ? "" : ""
        } h-fit w-full rounded-[40px] border-2 border-[#333333] bg-gradient-to-b from-[#1E1E1E] to-[#141414]`}
      >
        {/* Job Search Bar */}
        <div
          className={`p-6 md:px-10 md:pt-10 md:pb-6 ${
            isMobile ? "space-y-4" : "flex gap-4"
          }`}
        >
          {/* Search Input */}
          <div className="relative flex-1 w-[2/5]">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${
                isMobile
                  ? "h-[36px] pl-10 pr-4 py-2"
                  : "h-[44px] pl-10 pr-4 py-3"
              } w-full bg-[#0D0D0D] border border-[#333333] rounded-lg text-white placeholder-[#FFFFFF] focus:outline-none focus:border-[#00DBDC]`}
            />
            <Image
              src="/images/careers/career-search.svg"
              alt="Search"
              width={16}
              height={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            />
          </div>

          {/* Job Categories Dropdown */}
          <div className="relative md:w-[240px] w-[1/5]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`${
                isMobile
                  ? "h-[36px] pl-4 pr-10 leading-[36px]"
                  : "h-[44px] pl-4 pr-10 leading-[44px]"
              } w-full bg-[#0D0D0D] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#00DBDC] appearance-none`}
            >
              {jobCategories.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="bg-[#0D0D0D] text-white"
                >
                  {category}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path
                  d="M1 1L6 6L11 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Job Types Dropdown */}
          <div className="relative md:w-[240px] w-[1/5]">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={`${
                isMobile
                  ? "h-[36px] pl-4 pr-10 leading-[36px]"
                  : "h-[44px] pl-4 pr-10 leading-[44px]"
              } w-full bg-[#0D0D0D] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#00DBDC] appearance-none`}
            >
              {jobTypes.map((type) => (
                <option
                  key={type}
                  value={type}
                  className="bg-[#0D0D0D] text-white"
                >
                  {type}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path
                  d="M1 1L6 6L11 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Job Location Dropdown */}
          <div className="relative md:w-[240px] w-[1/5]">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className={`${
                isMobile
                  ? "h-[36px] pl-4 pr-10 leading-[36px]"
                  : "h-[44px] pl-4 pr-10 leading-[44px]"
              } w-full bg-[#0D0D0D] border border-[#333333] rounded-lg text-white focus:outline-none focus:border-[#00DBDC] appearance-none`}
            >
              {jobLocations.map((location) => (
                <option
                  key={location}
                  value={location}
                  className="bg-[#0D0D0D] text-white"
                >
                  {location}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path
                  d="M1 1L6 6L11 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Job Component List */}
        <div className="px-6 md:px-10 pb-6 md:pb-10">
          {paginatedJobs.length > 0 ? (
            <div className="space-y-0">
              {paginatedJobs.map((job, index) => (
                <JobDisplay
                  key={job.id}
                  job={job}
                  isMobile={isMobile}
                  isFirst={index === 0}
                  isLast={index === paginatedJobs.length - 1}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 md:py-16">
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-medium text-white mb-2">
                  No Jobs Found
                </h3>
                <p className="text-sm md:text-base text-[#8A8A8A]">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 md:gap-3 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`min-w-9 h-9 md:min-w-10 md:h-10 px-3 rounded-lg border transition-all duration-200 ${
                  currentPage === 1
                    ? "bg-[#0D0D0D] text-[#8A8A8A] border-[#333333] cursor-not-allowed"
                    : "bg-[#0D0D0D] text-white border-[#333333] hover:border-[#00DBDC]"
                }`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-9 h-9 md:min-w-10 md:h-10 px-3 rounded-lg border transition-all duration-200 ${
                      currentPage === page
                        ? "bg-[#00DBDC] text-[#0D0D0D] border-transparent"
                        : "bg-[#0D0D0D] text-white border-[#333333] hover:border-[#00DBDC]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`min-w-9 h-9 md:min-w-10 md:h-10 px-3 rounded-lg border transition-all duration-200 ${
                  currentPage === totalPages
                    ? "bg-[#0D0D0D] text-[#8A8A8A] border-[#333333] cursor-not-allowed"
                    : "bg-[#0D0D0D] text-white border-[#333333] hover:border-[#00DBDC]"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearchSection;
