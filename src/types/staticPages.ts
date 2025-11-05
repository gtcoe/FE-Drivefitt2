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
  title: string;
  description: string;
  desktopImage: string;
  mobileImage: string;
  btnPrimaryText?: string;
  btnPrimaryLink?: string;
}

export interface CardSection {
  title: string;
  description: string;
  cards: any[];
}

export interface CarouselBanner {
  image: string;
  title: string;
  description: string;
}

export interface StaticCardProps {
  title: string;
  description: string;
  cards: any[];
}

export interface InnovationCommunitySectionProps {
  title: string;
  description: string;
}

export interface GallerySectionProps {
  title: string;
  description: string;
  images: string[];
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
  title: string;
  description: string;
}

export interface FooterProps {
  logo: string;
  description: string;
  sections: any[];
  socialLinks: any[];
  copyright: string;
}

export interface EvolutionSectionProps {
  title: string;
  description: string;
}

export interface FaqSectionProps {
  title: string;
  faqs: any[];
}

export interface ScrollingCardSection {
  title: string;
  cards: any[];
}

export interface CountdownSection {
  title: string;
  endDate: string;
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
  cards: any[];
}

export interface SignatureClassCard {
  title: string;
  description: string;
  backgroundImage: string;
}

export interface SignatureClassesSection {
  title: string;
  classes: any[];
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

export interface JobSearchSection {
  title: string;
  jobs: any[];
}

export interface JobDetailSection {
  job: any;
}

export interface ApplyNowFormSection {
  jobId: string;
}

export interface StaticPageData {
  title?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
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
