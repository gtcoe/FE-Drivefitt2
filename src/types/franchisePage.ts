import { FooterInfoProps, FooterProps, NavbarProps } from "./staticPages";

export interface FranchiseHero {
  title: string;
  subTitle: string;
  description: string;
  roiTag: string;
  roiIcon: string;
  desktopImage: string;
  mobileImage: string;
  btnPrimaryText: string;
}

export interface BannerSection {
  title1?: string;
  title: string;
  subTitle: string;
  description1: string;
  description2: string;
  description3: string;
  className?: string;
}

export interface Card {
  icon: string;
  title: string;
  description?: string | string[];
  subTitle?: string;
  tooltipImage?: string;
  tooltipImageMobile?: string;
  backgroundImage?: string;
}

export interface FranchiseCardSection {
  title: string;
  description: string;
  backgroundImage?: string;
  cardList: Card[];
  cardTitleClass?: string;
  cardDescriptionClass?: string;
}

export interface ImageCardSection extends FranchiseCardSection {
  imageMobile: string;
  imageDesktop: string;
}

export interface Banner2SectionType {
  title: string;
  description: string;
  class?: string;
  titleClass?: string;
  descriptionClass?: string;
  subClass?: string;
  imageClass?: string;
}

export interface FranchisePageData {
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  navbar: NavbarProps;
  hero: FranchiseHero;
  banner1Section: BannerSection;
  multiRevenueSection: FranchiseCardSection;
  opportunitySection: FranchiseCardSection;
  whatYouReceiveSection: ImageCardSection;
  whatLookingForSection: FranchiseCardSection;
  banner2Section: Banner2SectionType;
  nextStepSection: FranchiseCardSection;
  footerInfoSection: FooterInfoProps;
  footerSection: FooterProps;
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
