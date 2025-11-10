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
  titleWords?: Array<{ text: string; color: string; isItalic?: boolean }>;
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

export type ScrollingCardItem = {
  subTitle: string;
  list: string[];
  extraTagLabel?: string;
  backgroundImage?: string;
  mobileImage?: string;
};

export interface ScrollingCardSection {
  title: string;
  description?: string;
  iconImage?: string;
  cards?: unknown[];
  cardSection?: ScrollingCardItem[];
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

export interface PolicySection {
  title?: string;
  htmlContent: string;
}

export interface JoinNowSectionProps {
  title: string;
  description: string;
}

export interface RecoveryBannerProps {
  title: string;
  description: string;
  image?: string;
  mobileImage?: string;
}

export interface EcosystemGifSectionProps {
  title: string;
  description: string;
}

export interface Banner2SectionType {
  title: string;
  description: string;
  titleClass?: string;
}

export interface Banner2WithImageProps {
  title: string;
  description: string;
  image: string;
  backgroundImage: string;
  mobileBackgroundImage: string;
  className?: string;
}

export interface SignatureClassCard {
  title: string;
  description: string;
  backgroundImage: string;
}

export interface SignatureClassesSection {
  title: string;
  classes?: unknown[];
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
  plans: PricingPlan[];
}

export interface IncludedPlansSection {
  title: string;
  items: string[];
  className?: string;
}

export interface JobSearchSection {
  title: string;
  jobs: unknown[];
  jobCategories?: unknown[];
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

export type FooterInfoItem = {
  title: string;
  description: string;
  email: string;
  image: string;
};

export type SocialLinks = {
  image: string;
  link: string;
};

export interface ContactFormProps {
  title: string;
  description: string;
  submitButtonText: string;
  fields: {
    firstName?: { label: string; placeholder: string };
    lastName?: { label: string; placeholder: string };
    email?: { label: string; placeholder: string };
    phone?: { label: string; placeholder: string };
    message?: { label: string; placeholder: string };
    name?: { label: string; placeholder: string };
    interests?: { label: string };
    preferredLocation?: {
      label: string;
      placeholder: string;
      options: string[];
    };
  };
}

export interface ContactUsContactFormProps {
  title: string;
  description: string;
  submitButtonText: string;
  fields: {
    name: { label: string; placeholder: string };
    phone: { label: string; placeholder: string };
    interests: { label: string };
    preferredLocation: {
      label: string;
      placeholder: string;
      options: string[];
    };
    message: { label: string; placeholder: string };
  };
}

export interface ContactUsFooterInfoProps {
  footerInfoList: FooterInfoItem[];
  socialLinkList: SocialLinks[];
  contactFormSection: ContactUsContactFormProps;
}

export type CardType = {
  title?: string;
  description?: string;
  image?: string;
  icon?: string;
  link?: string;
  backgroundImage?: string;
  redirectionIcon?: string;
  iconImage?: string;
  [key: string]: unknown;
};

export interface CountdownProps {
  countdownData: CountdownSection;
  isMobile?: boolean;
}

export type EvolutionItem = {
  title: string;
  description: string;
  image?: string;
  [key: string]: unknown;
};

export interface EvolutionSectionProps {
  title: string;
  description: string;
  evolutionList: EvolutionItem[];
}

export interface FlipCardProps {
  value: number;
  label: string;
  isMobile?: boolean;
}

export interface InfoSection {
  title: string;
  list: Array<{ image: string; description: string }>;
}

export interface Job {
  id: string | number;
  title: string;
  department?: string;
  location?: string;
  type?: string;
  [key: string]: unknown;
}

export type MemberItem = {
  title: string;
  description: string;
  image: string;
  [key: string]: unknown;
};

export interface MemberSectionProps {
  title: string;
  description: string;
  memberList?: MemberItem[];
}

export type NotJustClubItem = {
  title: string;
  description: string;
  image: string;
  icon?: string;
  [key: string]: unknown;
};

export interface NotJustClubSectionProps {
  title: string;
  description: string;
  bgImg?: string;
  list?: NotJustClubItem[];
}

export interface AppDownloadProps {
  title: string;
  description: string;
  googlePlayImg?: string;
  appStoreImg?: string;
  mobileImage?: string;
  desktopImage?: string;
}

export interface SportsClubSectionProps {
  title: string;
  description: string;
  image?: string;
  mobileImage?: string;
  btnLabel?: string;
}

export interface GallerySectionProps {
  title: string;
  description: string;
  images?: string[];
  btnLabel?: string;
  imageList?: number[];
  desktopImage?: string;
  mobileImage?: string;
  addGradient?: boolean;
  mobileImageUp?: string;
  imageClass?: string;
  specialBackgroundClass?: string;
  showStrip?: boolean;
  parentClass?: string;
}

export interface FaqSectionProps {
  title: string;
  description?: string;
  faqs: unknown[];
  faqList?: unknown[];
}

export interface ComingSoonSection {
  title: string;
  description: string;
  iconImage?: string;
  btnPrimaryText?: string;
  btnSecondaryText?: string;
  btnPrimaryLink?: string;
  btnSecondaryLink?: string;
}

export interface Error404Section {
  title: string;
  description: string;
  iconImage?: string;
  btnText?: string;
  btnLink?: string;
}

export interface PhotoCircleSectionProps {
  title: string;
  description: string;
  image1?: string;
  image2?: string;
}

export type CardsParallaxItem = {
  title?: string;
  description?: string;
  src: string;
  backgroundImage?: string;
  url: string;
  mobileUrl?: string;
  color: string;
};

export interface CardsParallaxProps {
  title?: string;
  cards?: unknown[];
  cardSection?: CardsParallaxItem[];
}

// Stronger exports for coaches/packages used in StaticPages
export type Coach = unknown;
export type Package = unknown;

// Ensure exports for sections used in StaticPages/index.tsx
export interface MeetYourCoachesSectionProps {
  title: string;
  coaches: Coach[];
  seeMoreText: string;
}

export interface ChooseYourPathSectionProps {
  title: string;
  packages: Package[];
  buttonText: string;
}

export type ProfilePageData = StaticPageData & {
  userInfo: {
    name: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    activePlan?: string;
    planExpires?: string;
  };
  actions: {
    viewPlan: { isButton?: boolean; text: string; enabled?: boolean };
  };
};

// Alias for specific pages with specialization for sections
export type ContactUsPageData = Omit<
  StaticPageData,
  "footerInfoSection" | "appDownloadSection"
> & {
  footerInfoSection: ContactUsFooterInfoProps;
  appDownloadSection?: AppDownloadProps;
};

// Static card type used in StaticCard component
export type StaticCardType = {
  title: string;
  description: string;
  backgroundImage?: string;
  modalImage?: string;
};
