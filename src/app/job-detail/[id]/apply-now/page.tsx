import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isMobileDevice } from "@/utils/deviceDetection";
import StaticPages from "@/components/StaticPages";
import { Metadata } from "next";
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
    const jobDetails = await fetchJob(params.id);
    return {
      title: `Apply for ${jobDetails.title} | Drive FITT Premium Club`,
      description: `Apply for ${jobDetails.title} position at Drive FITT - ${
        jobDetails.location?.full_location ?? ""
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

export default async function ApplyNowPage({
  params,
}: {
  params: { id: string };
}) {
  const jobDetails = await fetchJob(params.id);

  const pageData = {
    title: `Apply for ${jobDetails.title} | Drive FITT Premium Club`,
    description: `Apply for ${jobDetails.title} position at Drive FITT`,
    seoTitle: `Apply for ${jobDetails.title} | Drive FITT Premium Club`,
    seoDescription: `Apply for ${jobDetails.title} position at Drive FITT - ${
      jobDetails.location?.full_location ?? ""
    }`,
    aboutUsHeroSection: {
      title: "Apply For This Job",
      subTitle: jobDetails.title,
      description: jobDetails.location?.full_location ?? "",
      jobType:
        jobDetails.job_type === JOB_TYPE.FULL_TIME
          ? "Fulltime"
          : jobDetails.job_type === JOB_TYPE.PART_TIME
          ? "Part-time"
          : "Contractor",
      isJobDetail: true,
      showBackButton: true,
      roiTag: "",
      roiIcon: "",
      desktopImage:
        "https://da8nru77lsio9.cloudfront.net/images/aboutUs-c/hero.svg",
      mobileImage:
        "https://da8nru77lsio9.cloudfront.net/images/aboutUs-c/hero-mobile.svg",
    },
    applyNowForm: {
      jobId: params.id,
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

  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = userAgent ? isMobileDevice(userAgent) : false;

  return (
    <main>
      <StaticPages data={pageData} pageName="apply-now" isMobile={isMobile} />
    </main>
  );
}
