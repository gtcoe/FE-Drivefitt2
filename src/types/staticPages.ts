export enum LoginModalType {
  PHONE = "PHONE",
  EMAIL = "EMAIL",
}

export interface NavbarProps {
  logo: string;
  navLinks: Array<{
    title: string;
    href: string;
  }>;
  signInButton: {
    text: string;
  };
  loginModalType: LoginModalType;
}

export interface Hero {
  title?: string;
  titleWords?: Array<{ text: string; color: string }>;
  description?: string;
  desktopImage?: string;
  originalDesktopImage?: string;
  mobileImage?: string;
  originalMobileImage?: string;
  btnPrimaryText?: string;
  btnPrimaryLink?: string;
}

export interface CardSection {
  title: string;
  description: string;
  cards?: unknown[];
  cardSection?: unknown[];
}

export interface CarouselBanner {
  image: string;
  title: string;
  description: string;
}

export interface StaticCardProps {
  title: string;
  description: string;
  cards?: unknown[];
  cardSection?: unknown[];
}

export interface InnovationCommunitySectionProps {
  title: string;
  description: string;
  infoSection?: Array<{
    title: string;
    list: Array<{ image: string; description: string }>;
  }>;
}

export interface GallerySectionProps {
  title: string;
  description: string;
  images?: string[];
  btnLabel?: string;
  imageList?: number[];
}

export interface SportsClubSectionProps {
  title: string;
  description: string;
}

export interface MemberSectionProps {
  title: string;
  description: string;
}

export interface AppDownloadProps {
  title: string;
  description: string;
}

export interface FooterInfoProps {
  title?: string;
  description?: string;
  footerInfoList?: Array<{
    title: string;
    description: string;
    email: string;
    image: string;
  }>;
  socialLinkList?: Array<{ image: string; link: string }>;
  contactFormSection?: {
    title: string;
    description: string;
    submitButtonText: string;
    fields: {
      firstName: { label: string; placeholder: string };
      lastName: { label: string; placeholder: string };
      email: { label: string; placeholder: string };
      phone: { label: string; placeholder: string };
      message: { label: string; placeholder: string };
    };
  };
}

export interface FooterProps {
  logo: string;
  description: string;
  sections: unknown[];
  socialLinks: unknown[];
  copyright: string;
}

export interface EvolutionSectionProps {
  title: string;
  description: string;
}

export interface FaqSectionProps {
  title: string;
  faqs: unknown[];
}

export interface ScrollingCardSection {
  title: string;
  cards: unknown[];
}

export interface CountdownSection {
  title?: string;
  date?: string;
  endDate?: string;
  bgImage?: string;
  mobileBgImage?: string;
  location?: string;
  openingText?: string;
  labels?: { days: string; hours: string; minutes: string; seconds: string };
}

export interface ComingSoonSection {
  title: string;
  description: string;
}

export interface Error404Section {
  title: string;
  description: string;
}

export interface PolicySection {
  title: string;
  htmlContent: string;
}

export interface JoinNowSectionProps {
  title: string;
  description: string;
}

export interface RecoveryBannerProps {
  title: string;
  description: string;
}

export interface NotJustClubSectionProps {
  title: string;
  description: string;
}

export interface EcosystemGifSectionProps {
  title: string;
  description: string;
}

export interface MeetYourCoachesSectionProps {
  title: string;
  coaches: unknown[];
  seeMoreText: string;
}

export interface ChooseYourPathSectionProps {
  title: string;
  packages: unknown[];
  buttonText: string;
}

export interface PhotoCircleSectionProps {
  title: string;
  description: string;
}

export interface Banner2SectionType {
  title: string;
  description: string;
}

export interface Banner2WithImageProps {
  title: string;
  description: string;
  image: string;
  backgroundImage: string;
  mobileBackgroundImage: string;
  className?: string;
}

export interface CardsParallaxProps {
  title: string;
  cards: unknown[];
}

export interface SignatureClassCard {
  title: string;
  description: string;
  backgroundImage: string;
}

export interface SignatureClassesSection {
  title: string;
  classes: unknown[];
  cardList: SignatureClassCard[];
  cardList2: SignatureClassCard[];
}

export interface PricingPlan {
  title: string;
  subtitle?: string;
  discountedPrice: string;
  originalPrice: string;
  discountPercentage: string;
  buttonText: string;
  seatsLeft: string;
  limitedOfferCountText?: string; // e.g., "100 members" or "100 families"
}

export interface PricingPlansSection {
  plans: unknown[];
}

export interface IncludedPlansSection {
  title: string;
  items: string[];
  className?: string;
}

export interface JobSearchSection {
  title: string;
  jobs: unknown[];
}

export interface JobDetailSection {
  job: unknown;
}

export interface ApplyNowFormSection {
  jobId: string;
}

export interface StaticPageData {
  title?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  navbar?: NavbarProps;
  hero?: Hero;
  franchiseHeroSection?: unknown;
  aboutUsHeroSection?: unknown;
  carouselBanner?: Array<{
    title: string;
    countdownEnd?: string;
    backgroundImage: string;
  }>;
  cardSection4?: CardSection;
  cardSection3?: CardSection;
  cardSection5?: CardSection;
  cardSection2?: StaticCardProps;
  innovationCommunitySection?: InnovationCommunitySectionProps;
  evolutionSection?: EvolutionSectionProps;
  gallerySection?: GallerySectionProps;
  countdownSection?: CountdownSection;
  faqSection?: FaqSectionProps;
  sportsClubSection?: SportsClubSectionProps;
  bannerSection?: SportsClubSectionProps;
  memberSection?: MemberSectionProps;
  appDownloadSection?: AppDownloadProps;
  footerInfoSection?: FooterInfoProps;
  footerSection?: FooterProps;
  scrollingCardSection?: ScrollingCardSection;
  comingSoonSection?: ComingSoonSection;
  error404Section?: Error404Section;
  policySection?: PolicySection;
  joinNowSection?: JoinNowSectionProps;
  recoveryBannerSection?: RecoveryBannerProps;
  notJustClubSection?: NotJustClubSectionProps;
  ecosystemGifSection?: EcosystemGifSectionProps;
  meetYourCoachesSection?: MeetYourCoachesSectionProps;
  chooseYourPathSection?: ChooseYourPathSectionProps;
  photoCircleSection?: PhotoCircleSectionProps;
  banner2Section?: Banner2SectionType;
  banner2WithImageSection?: Banner2WithImageProps;
  cardsParallaxSection?: CardsParallaxProps;
  signatureClassesSection?: SignatureClassesSection;
  pricingPlansSection?: PricingPlansSection;
  includedPlansSection?: IncludedPlansSection;
  jobSearchSection?: JobSearchSection;
  jobDetailSection?: JobDetailSection;
  applyNowForm?: ApplyNowFormSection;
}

// Alias for specific pages to keep imports stable where used
export type ContactUsPageData = StaticPageData;
