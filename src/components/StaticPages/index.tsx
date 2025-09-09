import Navbar from "@/components/common/Navbar";
import { navbarData } from "@/data/navbar";
import HeroSection from "@/components/StaticPages/HeroSection";
import {
  BannerSection,
  FranchiseCardSection,
  FranchiseHero,
} from "@/types/franchisePage";
import {
  StaticPageData,
  Hero,
  CardSection,
  CarouselBanner,
  StaticCardProps,
  InnovationCommunitySectionProps,
  GallerySectionProps,
  SportsClubSectionProps,
  MemberSectionProps,
  AppDownloadProps,
  FooterInfoProps,
  FooterProps,
  EvolutionSectionProps,
  FaqSectionProps,
  ScrollingCardSection as ScrollingCardSectionType,
  CountdownSection,
  ComingSoonSection as ComingSoonSectionType,
  Error404Section as Error404SectionType,
  PolicySection as PolicySectionType,
  JoinNowSectionProps,
  RecoveryBannerProps,
  NotJustClubSectionProps,
  EcosystemGifSectionProps,
  MeetYourCoachesSectionProps,
  ChooseYourPathSectionProps,
  PhotoCircleSectionProps,
  Banner2SectionType,
  Banner2WithImageProps,
  CardsParallaxProps,
  SignatureClassesSection as SignatureClassesSectionType,
  PricingPlansSection,
  IncludedPlansSection,
} from "@/types/staticPages";
import CardSection4 from "@/components/StaticPages/CardSection4";
import CardSection5 from "@/components/StaticPages/CardSection5";
import CardSection3 from "@/components/StaticPages/CardSection3";
import CardSection2 from "@/components/StaticPages/CardSection2";
import InnovationCommunity from "@/components/StaticPages/InnovationCommunity";
import GallerySection from "./GallerySection";
import SportsClub from "@/components/StaticPages/SportsClub";
import MemberSection from "@/components/StaticPages/MemberSection";
import AppDownload from "@/components/common/AppDownload";
import FooterInfo from "@/components/common/FooterInfo";
import Footer from "@/components/common/Footer";
import EvolutionSection from "@/components/StaticPages/EvolutionSection";
import Faq from "@/components/common/Faq";
import Banner from "@/components/common/Banner";
import ScrollingCardSection from "@/components/StaticPages/ScrollingCardSection";
import ComingSoonSection from "@/components/StaticPages/ComingSoonSection";
import Error404Section from "@/components/StaticPages/Error404Section";
import PolicySection from "@/components/StaticPages/PolicySection";
import JoinNow from "@/components/common/JoinNow";
import RecoveryBanner from "@/components/StaticPages/RecoveryBanner";
import NotJustClubSection from "./NotJustClubSection";
import EcosystemGifSection from "./EcosystemGifSection";
import MeetYourCoachesSection from "./MeetYourCoachesSection";
import ChooseYourPathSection from "./ChooseYourPathSection";
import MultiRevenueSection from "../FranchisePage/MultiRevenueSection";
import PhotoCircleSection from "./PhotoCircleSection";
import Banner1Section from "../FranchisePage/Banner1Section";
import Banner2Section from "../FranchisePage/Banner2Section";
import Banner2WithImage from "./Banner2WithImage";
import FranchiseHeroSection from "../FranchisePage/FranchiseHeroSection";
import AboutUsHeroSection from "./AboutUsHeroSection";
import VisionarySection from "./VisionariesSection";
import BannerCTA from "./BannerCTA";
import BannerCTA2 from "./BannerCTA2";
import NextStepSection from "../FranchisePage/NextStepSection";
import CardsParallax from "./CardsParallax";
import Banner3JoinUs from "./Banner3JoinUs";
import SignatureClassesSection from "./SignatureClassesSection";
import PricingPlans from "@/components/common/PricingPlans";
import IncludedPlans from "@/components/common/IncludedPlans";

interface StaticPageProps {
  data: StaticPageData;
  pageName: string;
  isMobile?: boolean;
}

const StaticPage = ({ data, pageName, isMobile }: StaticPageProps) => {
  const renderComponent = (
    key: string,
    value:
      | Hero
      | CardSection
      | CarouselBanner[]
      | StaticCardProps
      | InnovationCommunitySectionProps
      | GallerySectionProps
      | SportsClubSectionProps
      | MemberSectionProps
      | AppDownloadProps
      | FooterInfoProps
      | FooterProps
      | EvolutionSectionProps
      | FaqSectionProps
      | ScrollingCardSectionType
      | CountdownSection
      | ComingSoonSectionType
      | Error404SectionType
      | PolicySectionType
      | JoinNowSectionProps
      | RecoveryBannerProps
      | NotJustClubSectionProps
      | EcosystemGifSectionProps
      | CardsParallaxProps
      | SignatureClassesSectionType
      | PricingPlansSection
  ) => {
    switch (key) {
      case "hero":
        return (
          <HeroSection
            data={value as Hero}
            pageName={pageName}
            isMobile={isMobile}
          />
        );
      case "franchiseHeroSection":
        return (
          <FranchiseHeroSection
            data={value as FranchiseHero}
            pageName={pageName}
            isMobile={isMobile}
          />
        );
      case "aboutUsHeroSection":
        return (
          <AboutUsHeroSection
            data={value as FranchiseHero}
            isMobile={isMobile}
          />
        );
      case "comingSoonSection":
        return (
          <ComingSoonSection
            data={value as ComingSoonSectionType}
            isMobile={isMobile}
          />
        );
      case "error404Section":
        return (
          <Error404Section
            data={value as Error404SectionType}
            isMobile={isMobile}
          />
        );
      case "policySection":
        return <PolicySection data={value as PolicySectionType} />;
      case "cardSection4":
        return <CardSection4 data={value as CardSection} isMobile={isMobile} />;
      case "cardSection3":
        return <CardSection3 data={value as CardSection} isMobile={isMobile} />;
      case "cardSection5":
        return <CardSection5 data={value as CardSection} isMobile={isMobile} />;
      case "cardSection2":
        return (
          <CardSection2 data={value as StaticCardProps} isMobile={isMobile} />
        );
      case "innovationCommunitySection":
        return (
          <InnovationCommunity
            data={value as InnovationCommunitySectionProps}
          />
        );
      case "evolutionSection":
        return (
          <EvolutionSection
            data={value as EvolutionSectionProps}
            isMobile={isMobile}
          />
        );
      case "gallerySection":
        return (
          <GallerySection
            data={value as GallerySectionProps}
            isMobile={isMobile}
          />
        );
      case "faqSection":
        return isMobile ? null : <Faq data={value as FaqSectionProps} />;
      case "sportsClubSection":
        return (
          <SportsClub
            data={value as SportsClubSectionProps}
            isMobile={isMobile}
          />
        );
      case "bannerSection":
        return (
          <Banner data={value as SportsClubSectionProps} isMobile={isMobile} />
        );
      case "memberSection":
        return (
          <MemberSection
            data={value as MemberSectionProps}
            isMobile={isMobile}
          />
        );
      case "appDownloadSection":
        return (
          <AppDownload data={value as AppDownloadProps} isMobile={isMobile} />
        );
      case "footerInfoSection":
        return (
          <FooterInfo data={value as FooterInfoProps} isMobile={isMobile} />
        );
      case "footerSection":
        return <Footer data={value as FooterProps} isMobile={isMobile} />;
      case "scrollingCardSection":
        return (
          <ScrollingCardSection
            data={value as ScrollingCardSectionType}
            isMobile={isMobile}
          />
        );
      case "joinNowSection":
        return <JoinNow isMobile={isMobile} />;
      case "recoveryBannerSection":
        return (
          <RecoveryBanner
            data={value as RecoveryBannerProps}
            isMobile={isMobile}
          />
        );
      case "notJustClubSection":
        return <NotJustClubSection data={value as NotJustClubSectionProps} />;
      case "ecosystemGifSection":
        return (
          <EcosystemGifSection
            title={(value as EcosystemGifSectionProps).title}
            description={(value as EcosystemGifSectionProps).description}
          />
        );
      case "meetYourCoachesSection":
        return (
          <MeetYourCoachesSection
            title={(value as MeetYourCoachesSectionProps).title}
            coaches={(value as MeetYourCoachesSectionProps).coaches}
            seeMoreText={(value as MeetYourCoachesSectionProps).seeMoreText}
            isMobile={isMobile}
          />
        );
      case "chooseYourPathSection":
        return (
          <ChooseYourPathSection
            title={(value as ChooseYourPathSectionProps).title}
            packages={(value as ChooseYourPathSectionProps).packages}
            buttonText={(value as ChooseYourPathSectionProps).buttonText}
            isMobile={isMobile}
          />
        );
      case "multiRevenueSection":
        return (
          <MultiRevenueSection
            data={value as FranchiseCardSection}
            isMobile={isMobile}
          />
        );
      case "photoCircleSection":
        return (
          <PhotoCircleSection
            data={value as PhotoCircleSectionProps}
            isMobile={isMobile}
          />
        );
      case "pricingPlansSection":
        return (
          <PricingPlans
            plans={(value as PricingPlansSection).plans}
            isMobile={isMobile}
          />
        );
      case "includedPlansSection":
        return (
          <IncludedPlans
            data={value as IncludedPlansSection}
            isMobile={isMobile}
          />
        );

      case "banner1Section":
        return (
          <Banner1Section data={value as BannerSection} isMobile={isMobile} />
        );
      case "banner2Section":
        return (
          <Banner2Section
            data={value as Banner2SectionType}
            isMobile={isMobile}
          />
        );
      case "banner2WithImageSection":
        return (
          <Banner2WithImage
            title={(value as Banner2WithImageProps).title}
            description={(value as Banner2WithImageProps).description}
            image={(value as Banner2WithImageProps).image}
            backgroundImage={(value as Banner2WithImageProps).backgroundImage}
            mobileBackgroundImage={
              (value as Banner2WithImageProps).mobileBackgroundImage
            }
            isMobile={isMobile}
            className={(value as Banner2WithImageProps).className}
          />
        );
      case "banner3JoinUsSection":
        return (
          <Banner3JoinUs
            data={value as GallerySectionProps}
            isMobile={isMobile}
          />
        );
      case "visionariesSection":
        return (
          <VisionarySection
            data={value as FranchiseCardSection}
            isMobile={isMobile}
          />
        );
      case "bannerCTASection":
        return (
          <BannerCTA data={value as GallerySectionProps} isMobile={isMobile} />
        );
      case "bannerCTASection2":
        return (
          <BannerCTA2 data={value as GallerySectionProps} isMobile={isMobile} />
        );
      case "nextStepSection":
        return (
          <NextStepSection
            data={value as FranchiseCardSection}
            isMobile={isMobile}
          />
        );
      case "cardsParallaxSection":
        return (
          <CardsParallax
            data={value as CardsParallaxProps}
            isMobile={isMobile}
          />
        );
      case "signatureClassesSection":
        return (
          <SignatureClassesSection
            data={value as SignatureClassesSectionType}
            isMobile={isMobile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0D0D0D] w-full">
      <Navbar data={navbarData} isMobile={isMobile} />

      <div className="flex flex-col gap-[60px] md:gap-[160px] w-full">
        {Object.entries(data).map(([key, value]) => {
          const component = renderComponent(key, value);
          if (component) {
            if (key === "hero") {
              return (
                <div
                  key={key}
                  className="w-screen bg-center bg-no-repeat h-full md:mb-[-60px] -mt-[60px] md:-mt-[105px] relative left-1/2 right-1/2 -mx-[50vw]"
                  style={{
                    background: `url(${
                      isMobile
                        ? (value as Hero).mobileImage
                        : (value as Hero).desktopImage
                    })`,
                    backgroundPosition: "top center",
                    backgroundSize: isMobile ? "100% auto" : "100% auto",
                    backgroundRepeat: "no-repeat",
                    minHeight: isMobile ? "auto" : "100vh",
                    backgroundAttachment: "scroll",
                  }}
                >
                  <div className="pt-[84px] md:pt-[140px]">{component}</div>
                </div>
              );
            }
            if (
              key === "franchiseHeroSection" ||
              key === "aboutUsHeroSection"
            ) {
              return (
                <div
                  key={key}
                  className="w-full bg-center bg-no-repeat md:mb-[-60px] -mt-[60px] md:-mt-[105px]"
                  style={{
                    background: `url(${
                      isMobile
                        ? (value as FranchiseHero).mobileImage
                        : (value as FranchiseHero).desktopImage
                    })`,
                    backgroundPosition: "top center",
                    backgroundSize: isMobile ? "100% auto" : "cover",
                    backgroundRepeat: "no-repeat",
                    minHeight: isMobile ? "400px" : "641px",
                  }}
                >
                  <div className="pt-[84px] md:pt-[140px]">{component}</div>
                </div>
              );
            }
            if (key === "comingSoonSection") {
              return (
                <div key={key} className="w-full">
                  {component}
                </div>
              );
            }
            if (key === "error404Section") {
              return (
                <div key={key} className="w-full">
                  {component}
                </div>
              );
            }
            if (key === "policySection") {
              return (
                <div key={key} className="w-full">
                  {component}
                </div>
              );
            }
            if (key === "photoCircleSection") {
              return (
                <div key={key} className="relative">
                  {component}
                </div>
              );
            }
            if (key === "pricingPlansSection") {
              return (
                <div key={key} className="w-full">
                  {component}
                </div>
              );
            }
            return <div key={key}>{component}</div>;
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default StaticPage;
