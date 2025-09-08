import {
  FranchiseCardSection,
  FranchiseHero,
  BannerSection,
} from "@/types/franchisePage";

export interface TitleWord {
  text: string;
  color?: string;
  isItalic?: boolean;
}

export enum LoginModalType {
  PHONE = "phone",
  EMAIL = "email",
}

export interface Hero {
  titleWords: TitleWord[];
  description: string;
  desktopImage: string;
  originalDesktopImage?: string;
  mobileImage: string;
  originalMobileImage?: string;
  btnPrimaryText?: string;
  btnSecondaryText?: string;
}

export interface CarouselBanner {
  title: string;
  countdownEnd: string;
  backgroundImage: string;
}

export interface CardType {
  title?: string;
  description?: string;
  backgroundImage?: string;
  link?: string;
  className?: string;
  iconImage?: string;
  redirectionIcon?: string;
}

export interface CardSection {
  title?: string;
  description?: string;
  isMobile?: boolean;
  cardSection: CardType[];
}

export interface StaticCardType extends CardType {
  modalImage: string;
}

export interface CardParallaxProps {
  title?: string;
  description?: string;
  src: string;
  backgroundImage?: string;
  url: string;
  mobileUrl?: string;
  color: string;
}

export interface CardsParallaxProps {
  cardSection: CardParallaxProps[];
}
export interface StaticCardProps {
  title?: string;
  description?: string;
  cardSection: StaticCardType[];
}

export interface InfoItem {
  image: string;
  description: string;
}

export interface InfoSection {
  title: string;
  list: InfoItem[];
}

export interface InnovationCommunitySectionProps {
  title: string;
  description: string;
  infoSection: InfoSection[];
}

export interface GallerySectionProps {
  title: string;
  description: string;
  btnLabel: string;
  imageList?: number[];
  desktopImage?: string;
  mobileImage?: string;
  addGradient?: boolean;
  mobileImageUp?: boolean;
  imageClass?: string;
  specialBackgroundClass?: string;
  showStrip?: boolean;
  parentClass?: string;
}

export interface SportsClubSectionProps {
  title: string;
  description: string;
  btnLabel?: string;
  image: string;
  mobileImage?: string;
}

export interface MemberItem {
  title: string;
  description: string;
  backgroundImage: string;
  link: string;
}

export interface MemberSectionProps {
  title: string;
  description: string;
  memberList: MemberItem[];
}

export interface AppDownloadProps {
  title: string;
  description: string;
  googlePlayImg: string;
  appStoreImg: string;
  desktopImage: string;
  mobileImage: string;
}

export interface SocialLinks {
  image: string;
  link: string;
}

export interface FooterInfoItem {
  title: string;
  description: string;
  email: string;
  image: string;
}
export interface ContactFormProps {
  title: string;
  description: string;
  submitButtonText: string;
  fields: {
    firstName: {
      label: string;
      placeholder?: string;
    };
    lastName: {
      label: string;
      placeholder?: string;
    };
    email: {
      label: string;
      placeholder?: string;
    };
    phone: {
      label: string;
      placeholder?: string;
    };
    message: {
      label: string;
      placeholder?: string;
    };
  };
}

export interface ContactUsContactFormProps {
  title: string;
  description: string;
  submitButtonText: string;
  fields: {
    name: {
      label: string;
      placeholder?: string;
    };
    phone: {
      label: string;
      placeholder?: string;
    };
    interests: {
      label: string;
    };
    preferredLocation?: {
      label: string;
      placeholder?: string;
      options?: string[];
    };
    message: {
      label: string;
      placeholder?: string;
    };
  };
}

export interface FooterInfoProps {
  footerInfoList: FooterInfoItem[];
  socialLinkList: SocialLinks[];
  contactFormSection: ContactFormProps;
}

export interface ContactUsFooterInfoProps {
  footerInfoList: FooterInfoItem[];
  socialLinkList: SocialLinks[];
  contactFormSection: ContactUsContactFormProps;
}

export interface FooterLink {
  title: string;
  link: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  logo: string;
  description: string;
  sections: FooterSection[];
  socialLinks: SocialLinks[];
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

export type FaqItem = {
  title: string;
  description: string;
  isOpen?: boolean;
};

export type FaqSectionProps = {
  title: string;
  description: string;
  faqList: FaqItem[];
};

export interface ScrollingCardItem {
  subTitle: string;
  list: string[];
  extraTagLabel?: string;
  backgroundImage: string;
  mobileImage?: string;
}

export interface ScrollingCardSection {
  title: string;
  description: string;
  iconImage: string;
  cardSection: ScrollingCardItem[];
}

export interface CountdownSection {
  title: string;
  date: string;
  bgImage: string;
  mobileBgImage?: string;
  location: string;
  openingText: string;
  labels: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
}

export interface ComingSoonSection {
  title: string;
  description: string;
  iconImage: string;
  btnPrimaryText: string;
  btnSecondaryText: string;
  btnPrimaryLink?: string;
  btnSecondaryLink?: string;
}

export interface Error404Section {
  title: string;
  description: string;
  iconImage: string;
  btnText: string;
  btnLink?: string;
}

export interface PolicySection {
  htmlContent: string;
}

export interface JoinNowSectionProps {
  title?: string;
  description?: string;
}

export interface RecoveryBannerProps {
  title: string;
  description: string;
  image: string;
  mobileImage?: string;
}

export interface NotJustClubItem {
  icon: string;
  description: string;
}

export interface NotJustClubSectionProps {
  title: string;
  bgImg: string;
  list: NotJustClubItem[];
}

export interface EcosystemGifSectionProps {
  title: string;
  description: string;
}

export interface PhotoCircleSectionProps {
  title: string;
  description: string;
  image1: string;
  image2: string;
}

export interface Banner2SectionType {
  title: string;
  description: string;
  class?: string;
  titleClass?: string;
  descriptionClass?: string;
  subClass?: string;
}

export interface Banner2WithImageProps {
  title: string;
  description: string;
  image: string;
  backgroundImage: string;
  mobileBackgroundImage?: string;
  className?: string;
}
export interface StaticPageData {
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  navbar?: NavbarProps;
  hero?: Hero;
  franchiseHeroSection?: FranchiseHero;
  aboutUsHeroSection?: FranchiseHero;
  countdownSection?: CountdownSection;
  comingSoonSection?: ComingSoonSection;
  error404Section?: Error404Section;
  policySection?: PolicySection;
  carouselBanner?: CarouselBanner[];
  cardSection2?: StaticCardProps;
  cardSection3?: CardSection;
  cardSection4?: CardSection;
  cardSection5?: CardSection;
  innovationCommunitySection?: InnovationCommunitySectionProps;
  gallerySection?: GallerySectionProps;
  sportsClubSection?: SportsClubSectionProps;
  memberSection?: MemberSectionProps;
  joinNowSection?: JoinNowSectionProps;
  evolutionSection?: EvolutionSectionProps;
  appDownloadSection?: AppDownloadProps;
  recoveryBannerSection?: RecoveryBannerProps;
  footerInfoSection?: FooterInfoProps;
  footerSection?: FooterProps;
  faqSection?: FaqSectionProps;
  bannerSection?: SportsClubSectionProps;
  scrollingCardSection?: ScrollingCardSection;
  notJustClubSection?: NotJustClubSectionProps;
  ecosystemGifSection?: EcosystemGifSectionProps;
  meetYourCoachesSection?: MeetYourCoachesSectionProps;
  chooseYourPathSection?: ChooseYourPathSectionProps;
  multiRevenueSection?: FranchiseCardSection;
  photoCircleSection?: PhotoCircleSectionProps;
  banner1Section?: BannerSection;
  banner2Section?: Banner2SectionType;
  banner2WithImageSection?: Banner2WithImageProps;
  nextStepSection?: FranchiseCardSection;
  visionariesSection?: FranchiseCardSection;
  bannerCTASection?: GallerySectionProps;
  bannerCTASection2?: GallerySectionProps;
  signatureClassesSection?: SignatureClassesSection;
  cardsParallaxSection?: CardsParallaxProps;
  banner3JoinUsSection?: GallerySectionProps;
  pricingPlansSection?: PricingPlansSection;
  includedPlansSection?: IncludedPlansSection;
}

export interface ContactUsPageData {
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  navbar: NavbarProps;
  hero: Hero;
  footerInfoSection?: ContactUsFooterInfoProps;
  footerSection?: FooterProps;
  appDownloadSection?: AppDownloadProps;
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
    changeName: {
      text: string;
      enabled: boolean;
    };
    changeEmail: {
      text: string;
      enabled: boolean;
    };
    changeBirthday: {
      text: string;
      enabled: boolean;
    };
    viewPlan: {
      text: string;
      enabled: boolean;
      isButton: boolean;
    };
  };
  footerInfoSection?: FooterInfoProps;
  footerSection?: FooterProps;
}

export interface NavLink {
  title: string;
  href: string;
}

export interface NavbarProps {
  logo: string;
  navLinks: NavLink[];
  signInButton: {
    text: string;
  };
  loginModalType: LoginModalType;
}

export interface CountdownProps {
  countdownData: CountdownSection;
  isMobile?: boolean;
}

export interface FlipCardProps {
  value: number;
  label: string;
  isMobile?: boolean;
}

export interface Coach {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface MeetYourCoachesSectionProps {
  title: string;
  coaches: Coach[];
  seeMoreText?: string;
}

export interface Package {
  name: string;
  sessions: string;
  includes: string;
}

export interface ChooseYourPathSectionProps {
  title: string;
  packages: Package[];
  buttonText?: string;
}

export interface SignatureClassCard {
  title: string;
  description: string;
  backgroundImage: string;
}

export interface SignatureClassesSection {
  title: string;
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
}

export interface PricingPlansSection {
  plans: PricingPlan[];
}

export interface IncludedPlansSection {
  title: string;
  items: string[];
  className?: string;
}
