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
  description: string;
  desktopImage: string;
  originalDesktopImage?: string;
  mobileImage: string;
  originalMobileImage?: string;
  btnPrimaryText?: string;
  btnPrimaryLink?: string;
}

export interface CardSection {
  title: string;
  description: string;
  cards?: any[];
  cardSection?: any[];
}

export interface CarouselBanner {
  image: string;
  title: string;
  description: string;
}

export interface StaticCardProps {
  title: string;
  description: string;
  cards?: any[];
  cardSection?: any[];
}

export interface InnovationCommunitySectionProps {
  title: string;
  description: string;
  infoSection?: InfoSection[];
}

export interface GallerySectionProps {
  title: string;
  description: string;
  images?: string[];
  imageList?: (string | number)[];
  btnLabel?: string;
  desktopImage?: string;
  mobileImage?: string;
  addGradient?: boolean;
  mobileImageUp?: string;
  imageClass?: string;
  specialBackgroundClass?: string;
  showStrip?: boolean;
  parentClass?: string;
}

export interface SportsClubSectionProps {
  title: string;
  description: string;
  image: string;
  mobileImage?: string;
  btnLabel: string;
}

export interface MemberItem {
  title: string;
  description: string;
  backgroundImage: string;
}

export interface MemberSectionProps {
  title: string;
  description: string;
  memberList?: MemberItem[];
}

export interface AppDownloadProps {
  title: string;
  description: string;
  googlePlayImg: string;
  appStoreImg: string;
  mobileImage: string;
  desktopImage: string;
}

export interface FooterInfoItem {
  title: string;
  description: string;
  email: string;
  image: string;
}

export interface FooterSection {
  title: string;
  links: Array<{ title: string; link: string }>;
}

export interface SocialLink {
  image: string;
  link: string;
}

export interface ContactFormField {
  label: string;
  placeholder?: string;
  options?: string[];
}

export interface ContactFormProps {
  title: string;
  description: string;
  submitButtonText: string;
  fields: {
    firstName: ContactFormField;
    lastName: ContactFormField;
    email: ContactFormField;
    phone: ContactFormField;
    message: ContactFormField;
  };
}

export interface ContactUsContactFormProps {
  title: string;
  description: string;
  submitButtonText: string;
  fields: {
    name: ContactFormField;
    phone: ContactFormField;
    interests: ContactFormField;
    preferredLocation: ContactFormField;
    message: ContactFormField;
  };
}

export interface ContactUsFooterInfoProps {
  footerInfoList: FooterInfoItem[];
  socialLinkList: SocialLink[];
  contactFormSection: any;
}

export interface CardType {
  title: string;
  description: string;
  backgroundImage: string;
  link?: string;
  redirectionIcon?: string;
  iconImage?: string;
  modalImage?: string;
  [key: string]: unknown;
}

export interface FooterInfoProps {
  title?: string;
  description?: string;
  footerInfoList: FooterInfoItem[];
  socialLinkList: SocialLink[];
  contactFormSection?: any;
}

export interface FooterProps {
  logo: string;
  description: string;
  sections: FooterSection[];
  socialLinks: SocialLink[];
  copyright: string;
}

export interface EvolutionItem {
  title: string;
  description: string;
  backgroundImage: string;
}

export interface EvolutionSectionProps {
  title: string;
  evolutionList: EvolutionItem[];
}

export interface FlipCardProps {
  value: string;
  label: string;
  isMobile?: boolean;
}

export interface InfoSection {
  title: string;
  list: Array<{
    description: string;
    image: string;
  }>;
}

export interface FAQ {
  title: string;
  description: string;
}

export interface FaqSectionProps {
  title: string;
  description: string;
  faqList: FAQ[];
}

export interface ScrollingCardSection {
  title: string;
  description?: string;
  iconImage?: string;
  cardSection?: any[];
  cards?: any[];
}

export interface CountdownSection {
  title: string;
  date: string;
  bgImage: string;
  mobileBgImage?: string;
  location?: string;
  openingText?: string;
  labels?: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
}

export interface CountdownData {
  title: string;
  date: string;
  bgImage: string;
  mobileBgImage?: string;
  location?: string;
  openingText?: string;
  labels?: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
}

export interface CountdownProps {
  countdownData: CountdownData;
  isMobile?: boolean;
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

export interface NotJustClubItem {
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface NotJustClubSectionProps {
  title: string;
  description: string;
  bgImg?: string;
  list?: NotJustClubItem[];
  items?: NotJustClubItem[];
}

export interface EcosystemGifSectionProps {
  title: string;
  description: string;
}

export interface MeetYourCoachesSectionProps {
  title: string;
  coaches: any[];
  seeMoreText: string;
}

export interface ChooseYourPathSectionProps {
  title: string;
  packages: any[];
  buttonText: string;
}

export interface PhotoCircleSectionProps {
  title: string;
  description: string;
  image1?: string;
  image2?: string;
}

export interface Banner2SectionType {
  title: string;
  description: string;
  titleClass?: string;
  class?: string;
  subClass?: string;
  descriptionClass?: string;
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
  title?: string;
  cards?: any[];
  cardSection?: any[];
}

export interface SignatureClassCard {
  title: string;
  description: string;
  backgroundImage: string;
}

export interface SignatureClassesSection {
  title: string;
  classes?: any[];
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
  plans: any[];
}

export interface IncludedPlansSection {
  title: string;
  items: string[];
  className?: string;
}

export interface Job {
  id: number;
  title: string;
  location: string;
  jobType: string;
  jobCategory: string;
}

export interface JobSearchSection {
  title?: string;
  jobs: Job[];
  jobCategories?: any[];
  jobTypes?: any[];
  jobLocations?: any[];
}

export interface JobDetailSection {
  job: any;
}

export interface ApplyNowFormSection {
  jobId: string;
}

export interface ContactUsPageData {
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  navbar: NavbarProps;
  appDownloadSection?: AppDownloadProps;
  hero: {
    titleWords: Array<{ text: string; color: string; isItalic?: boolean }>;
    description: string;
    desktopImage: string;
    mobileImage: string;
  };
  footerInfoSection: {
    footerInfoList: Array<{
      title: string;
      description: string;
      email: string;
      image: string;
    }>;
    socialLinkList: Array<{
      image: string;
      link: string;
    }>;
    contactFormSection?: any;
  };
  footerSection: FooterProps;
}

export interface ProfilePageData {
  title: string;
  seoTitle: string;
  seoDescription: string;
  userInfo: {
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    activePlan: string;
    planExpires: string;
  };
  actions: {
    viewPlan: {
      isButton?: boolean;
      text: string;
      enabled?: boolean;
    };
    [key: string]: unknown;
  };
  footerInfoSection?: FooterInfoProps;
  footerSection?: FooterProps;
  [key: string]: unknown;
}

export interface StaticPageData {
  title?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  navbar?: NavbarProps;
  hero?: Hero;
  franchiseHeroSection?: any;
  aboutUsHeroSection?: any;
  cardSection4?: CardSection;
  cardSection3?: CardSection;
  cardSection5?: CardSection;
  cardSection2?: StaticCardProps;
  innovationCommunitySection?: InnovationCommunitySectionProps;
  evolutionSection?: EvolutionSectionProps;
  gallerySection?: GallerySectionProps;
  faqSection?: FaqSectionProps;
  sportsClubSection?: SportsClubSectionProps;
  bannerSection?: SportsClubSectionProps;
  banner1Section?: any;
  visionariesSection?: any;
  banner3JoinUsSection?: any;
  memberSection?: MemberSectionProps;
  appDownloadSection?: AppDownloadProps;
  footerInfoSection?: FooterInfoProps;
  footerSection?: FooterProps;
  scrollingCardSection?: ScrollingCardSection;
  comingSoonSection?: ComingSoonSection;
  error404Section?: Error404Section;
  countdownSection?: CountdownSection;
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
  bannerCTASection2?: any;
  bannerCTASection?: any;
  cardsParallaxSection?: CardsParallaxProps;
  signatureClassesSection?: SignatureClassesSection;
  pricingPlansSection?: PricingPlansSection;
  includedPlansSection?: IncludedPlansSection;
  jobSearchSection?: JobSearchSection;
  jobDetailSection?: JobDetailSection;
  applyNowForm?: ApplyNowFormSection;
  carouselBanner?: Array<{
    title: string;
    countdownEnd: string;
    backgroundImage: string;
  }>;
  nextStepSection?: {
    title: string;
    description: string;
    cardList: Array<{
      icon?: string;
      title: string;
      description?: string | string[];
      subTitle?: string;
      tooltipImage?: string;
      tooltipImageMobile?: string;
      backgroundImage?: string;
    }>;
    cardTitleClass?: string;
    cardDescriptionClass?: string;
    backgroundImage?: string;
  };
  multiRevenueSection?: {
    title: string;
    description: string;
    cardList: Array<{
      icon?: string;
      title: string;
      description?: string | string[];
      subTitle?: string;
      tooltipImage?: string;
      tooltipImageMobile?: string;
      backgroundImage?: string;
    }>;
    cardTitleClass?: string;
    cardDescriptionClass?: string;
    backgroundImage?: string;
  };
}
