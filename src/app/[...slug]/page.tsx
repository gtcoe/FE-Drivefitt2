import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cricketData } from "@/data/cricket";
import { fitnessData } from "@/data/fitness";
import { recoveryData } from "@/data/recovery";
import { runningData } from "@/data/running";
import { pilatesData } from "@/data/pilates";
import { StaticPageData } from "@/types/staticPages";
import StaticPage from "@/components/StaticPages";
import { headers } from "next/headers";
import { isMobileDevice } from "@/utils/deviceDetection";
import { personalTrainingData } from "@/data/personal-training";
import { groupClassesData } from "@/data/group-classes";
import { plansData } from "@/data/plans";

type PageParams = {
  params: {
    slug: string;
  };
};

const pageData: { [key: string]: StaticPageData } = {
  cricket: cricketData,
  fitness: fitnessData,
  recovery: recoveryData,
  running: runningData,
  pilates: pilatesData,
  "personal-training": personalTrainingData,
  "group-classes": groupClassesData,
  plans: plansData,
};

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const slug = params.slug;
  const data = pageData[slug];

  if (!data) {
    return {
      title: "Page Not Found | DriveFITT Premium Club",
      description: "The page you&apos;re looking for doesn&apos;t exist.",
    };
  }

  return {
    title: data.seoTitle || data.title,
    description: data.seoDescription,
  };
}

export default function Page({ params }: PageParams) {
  const slug = params.slug;
  const data = pageData[slug];

  if (!data) {
    notFound();
  }

  const pageName = Array.isArray(slug) ? slug[0] : slug;
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = userAgent ? isMobileDevice(userAgent) : false;

  return (
    <main>
      <StaticPage data={data} pageName={pageName} isMobile={isMobile} />
    </main>
  );
}
