import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isMobileDevice } from "@/utils/deviceDetection";
import StaticPages from "@/components/StaticPages";
import { JobPosting } from "@/types/database";
import { JobType, JOB_TYPE } from "@/constants/database";
import { jobAPI } from "@/services/jobAPI";

const fetchJob = async (id: string): Promise<JobPosting> => {
  try {
    const job = await jobAPI.getById(Number(id));
    return job;
  } catch (error) {
    // If job not found or not accessible, trigger the not-found page
    notFound();
  }
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const job = await fetchJob(params.id);
    return {
      title: `${job.title} | Drive FITT Premium Club`,
      description: `Apply for ${job.title} position at Drive FITT - ${
        job.location?.full_location ?? ""
      }`,
    };
  } catch {
    // If job not found, return default metadata
    return {
      title: "Job Not Found | Drive FITT Premium Club",
      description: "The requested job posting could not be found.",
    };
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = userAgent ? isMobileDevice(userAgent) : false;

  const jobDetails = await fetchJob(params.id);

  const pageData = {
    title: `${jobDetails.title} | Drive FITT Premium Club`,
    description: `Apply for ${jobDetails.title} position at Drive FITT`,
    seoTitle: `${jobDetails.title} | Drive FITT Premium Club`,
    seoDescription: `Apply for ${jobDetails.title} position at Drive FITT - ${jobDetails.location}`,
    aboutUsHeroSection: {
      title: jobDetails.title,
      subTitle: "",
      description: jobDetails.location?.full_location ?? "",
      jobType:
        jobDetails.job_type === JOB_TYPE.FULL_TIME
          ? "Fulltime"
          : jobDetails.job_type === JOB_TYPE.PART_TIME
          ? "Part-time"
          : "Contractor",
      isJobDetail: true,
      roiTag: "",
      roiIcon: "",
      desktopImage:
        "https://da8nru77lsio9.cloudfront.net/images/aboutUs-c/hero.svg",
      mobileImage:
        "https://da8nru77lsio9.cloudfront.net/images/aboutUs-c/hero-mobile.svg",
      btnPrimaryText: "Apply now",
      btnPrimaryLink: `/job-detail/${params.id}/apply-now`,
    },
    jobDetailSection: {
      job: {
        id: String(jobDetails.id),
        title: jobDetails.title,
        location: jobDetails.location?.full_location ?? "",
        jobType:
          jobDetails.job_type === JOB_TYPE.FULL_TIME
            ? "Fulltime"
            : jobDetails.job_type === JOB_TYPE.PART_TIME
            ? "Part-time"
            : "Contractor",
        jobCategory: jobDetails.department?.name || "General",
        details: [
          {
            title: "Job Description",
            description: jobDetails.job_description || "",
            list: [],
          },
          {
            title: "Role",
            description: "",
            list: jobDetails.role || [],
          },
          {
            title: "Skills and Qualifications:",
            description: "",
            list: jobDetails.qualifications || [],
          },
          {
            title: "Location",
            description: jobDetails.location?.full_location || "",
            list: [],
          },
          {
            title: "Years Of Exp",
            description: jobDetails.years_of_experience || "",
            list: [],
          },
        ],
      },
    },
    footerSection: {
      logo: "https://da8nru77lsio9.cloudfront.net/images/logo.svg",
      description:
        "Experience Gurugram's Premier Fitness & Sports Club - Gym, Cricket, Recovery & more.",
      sections: [
        {
          title: "Quick Links",
          links: [
            { title: "About us", link: "/about-us" },
            { title: "Blogs", link: "/coming-soon" },
            { title: "Career", link: "/careers" },
            { title: "Partner With Us", link: "/franchise" },
          ],
        },
        {
          title: "Services",
          links: [
            { title: "Cricket", link: "/cricket" },
            { title: "Fitness", link: "/fitness" },
            { title: "Recovery", link: "/recovery" },
            { title: "Running", link: "/running" },
            { title: "Group Classes", link: "/group-classes" },
            { title: "Pilates", link: "/pilates" },
            { title: "Personal Training", link: "/personal-training" },
          ],
        },
        {
          title: "Support",
          links: [
            { title: "Account", link: "/coming-soon" },
            { title: "Help", link: "/coming-soon" },
            { title: "Contact Us", link: "/contact-us" },
          ],
        },
        {
          title: "Legals",
          links: [
            { title: "Terms & Conditions", link: "/terms" },
            { title: "Privacy & Policy", link: "/privacy" },
          ],
        },
      ],
      socialLinks: [
        {
          image: "https://da8nru77lsio9.cloudfront.net/images/x-social.svg",
          link: "https://x.com/Drive_Fitt",
        },
        {
          image:
            "https://da8nru77lsio9.cloudfront.net/images/instagram-social.svg",
          link: "https://www.instagram.com/drive_fitt/",
        },
        {
          image:
            "https://da8nru77lsio9.cloudfront.net/images/linkedin-social.svg",
          link: "https://www.linkedin.com/company/drivefitt/",
        },
        {
          image:
            "https://da8nru77lsio9.cloudfront.net/images/facebook-social.svg",
          link: "https://www.facebook.com/profile.php?id=61561476262978",
        },
      ],
      copyright:
        "© 2025 Drive FITT by 24-7 Cricket Group India Private Limited. All rights reserved.",
    },
  };

  return (
    <main>
      <StaticPages data={pageData} pageName="about-us" isMobile={isMobile} />
    </main>
  );
}
