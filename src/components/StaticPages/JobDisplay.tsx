"use client";

import Image from "next/image";
import { Job } from "@/types/staticPages";
import { useRouter } from "next/navigation";

interface JobDisplayProps {
  job: Job;
  isMobile?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

const JobDisplay = ({ job, isMobile, isFirst, isLast }: JobDisplayProps) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/job-detail/${job.id}`);
  };

  return (
    <div
      className={`w-full bg-[#1E1E1E] border border-[#333333] ${
        isFirst ? "rounded-t-[20px]" : ""
      } ${isLast ? "rounded-b-[20px]" : ""} ${
        isMobile ? "px-6 py-6" : "px-10 py-6"
      } flex flex-col gap-4 md:flex-row justify-start md:justify-between items-start md:items-center`}
    >
      <div className="flex-1">
        {/* Job Title */}
        <h3
          className={`text-white font-normal mb-3 md:mb-[18px] ${
            isMobile ? "text-base leading-5" : "text-[28px] leading-9"
          }`}
        >
          {job.title}
        </h3>

        {/* Subtitle - Location and Job Type */}
        <div className="flex items-center md:gap-[10px] gap-2">
          {/* Location */}
          <div className="flex items-center gap-1">
            <Image
              src="/images/careers/marker.svg"
              alt="Location"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span
              className={`text-gray-300 tracking-[0%] font-light ${
                isMobile ? "text-xs leading-5" : "text-base leading-5"
              }`}
            >
              {job.location}
            </span>
          </div>

          {/* Separator */}
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>

          {/* Job Type */}
          <div className="flex items-center gap-1">
            <Image
              src="/images/careers/luggage.svg"
              alt="Job Type"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span
              className={`text-gray-300 font-light ${
                isMobile ? "text-xs leading-5" : "text-base leading-5"
              }`}
            >
              {job.jobType}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={handleViewDetails}
        className={`bg-[#00DBDC] w-fit h-fit font-medium text-[#0D0D0D] border border-transparent hover:bg-transparent hover:border-[#00DBDC] hover:text-[#00DBDC] transition-all duration-200 shadow-[0px_9px_12px_0px_rgba(0,219,220,0.2)] ${
          isMobile
            ? "px-3 py-2 text-xs leading-4 rounded"
            : "px-7 py-2.5 text-base leading-5 rounded-lg"
        }`}
      >
        View details
      </button>
    </div>
  );
};

export default JobDisplay;
