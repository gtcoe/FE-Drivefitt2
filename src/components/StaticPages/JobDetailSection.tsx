"use client";

import { useRouter } from "next/navigation";
import { JobDetailSection as JobDetailSectionType } from "@/types/staticPages";

interface JobDetailSectionProps {
  data: JobDetailSectionType;
  isMobile?: boolean;
}

const JobDetailSection = ({ data, isMobile }: JobDetailSectionProps) => {
  const router = useRouter();

  const handleApplyNow = () => {
    router.push(`/job-detail/${data.job.id}/apply-now`);
  };

  return (
    <div className="w-full flex flex-col gap-10 md:gap-[74px] mt-[-180px] md:mt-[-360px] justify-center items-center">
      {/* Apply Now Button at the top */}
      <button
        onClick={handleApplyNow}
        className="bg-[#00DBDC] font-medium text-[#0D0D0D] border border-transparent shadow-[0px_9px_12px_0px_rgba(0,219,220,0.2)] px-7 py-2.5 text-base leading-5 rounded-lg"
      >
        Apply now
      </button>

      <div className="w-full flex justify-center px-6 md:px-[120px]">
        <div
          className={`h-fit w-full ${
            isMobile ? "rounded-[20px]" : "rounded-[40px]"
          } border-2 border-[#333333] bg-gradient-to-b from-[#1E1E1E] to-[#141414]`}
        >
          <div className="px-6 md:px-10 py-6 md:py-10">
            {data.job.details.map(
              (
                detail: { title: string; description: string; list: string[] },
                index: number
              ) => (
                <div
                  key={index}
                  className={`w-full h-fit opacity-100 ${
                    isMobile ? "pb-6 gap-4" : "pb-10 gap-6"
                  } ${
                    index < data.job.details.length - 1
                      ? "border-b border-[#333333]"
                      : ""
                  }`}
                >
                  {/* Title */}
                  <h3
                    className={`font-semibold text-white mb-6 md:mb-6 ${
                      detail.title === "Skills and Qualifications:"
                        ? isMobile
                          ? "text-base leading-5 tracking-[0%]"
                          : "text-2xl leading-7 tracking-[-2%]"
                        : isMobile
                        ? "text-2xl leading-7 tracking-[-2px]"
                        : "text-[32px] leading-[48px] tracking-[-2px]"
                    } ${
                      detail.title === "About Drivefitt"
                        ? "mt-0"
                        : "mt-6 md:mt-10"
                    }`}
                  >
                    {detail.title}
                  </h3>

                  {/* Description */}
                  {detail.description && (
                    <p
                      className={`text-gray-300 font-light ${
                        isMobile
                          ? "text-sm leading-5 tracking-[0%]"
                          : "text-xl leading-7 tracking-[-2%]"
                      }`}
                    >
                      {detail.description}
                    </p>
                  )}

                  {/* List */}
                  {detail.list && detail.list.length > 0 && (
                    <ul className="space-y-3">
                      {detail.list.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className={`flex items-start gap-3 text-gray-300 font-light ${
                            isMobile
                              ? "text-sm leading-5 tracking-[0%]"
                              : "text-xl leading-7 tracking-[-2%]"
                          }`}
                        >
                          <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            )}

            {/* Apply Now Button */}
            <div className="flex justify-end">
              <button
                onClick={handleApplyNow}
                className="bg-[#00DBDC] font-medium text-[#0D0D0D] w-full md:w-fit border border-transparent shadow-[0px_9px_12px_0px_rgba(0,219,220,0.2)] px-7 py-2.5 text-base leading-5 rounded-lg"
              >
                Apply now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailSection;
