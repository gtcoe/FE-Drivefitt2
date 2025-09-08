import { navbarData } from "./navbar";
import { StaticPageData } from "@/types/staticPages";

export const plansData: StaticPageData = {
  title: "Plans",
  description: "Choose the plan that's right for you.",
  seoTitle: "Plans | Drive FITT",
  seoDescription: "Choose the plan that's right for you.",
  navbar: navbarData,
  aboutUsHeroSection: {
    title: "Plans & Pricing",
    subTitle: "",
    description: "",
    roiTag: "",
    roiIcon: "https://da8nru77lsio9.cloudfront.net/images/roi-icon.svg",
    desktopImage: "https://da8nru77lsio9.cloudfront.net/images/plans/hero.svg",
    mobileImage:
      "https://da8nru77lsio9.cloudfront.net/images/plans/hero-mobile.svg",
    btnPrimaryText: "",
  },
  banner2Section: {
    title: "Train. Play. Recover. Your way.",
    description:
      "Enjoy unlimited club access, group classes*, a complimentary fitness assessment + 2 Personal Training sessions and more.",
    class: "-mt-[195px] md:-mt-[282px]",
    titleClass:
      "font-semibold text-2xl leading-7 tracking-[-1px] text-center px-[34px] md:font-semibold md:text-[40px] md:leading-[56px] md:tracking-[-2px] md:text-center",
    descriptionClass:
      "md:font-normal md:text-base md:leading-5 md:tracking-0 md:text-center",
  },
  pricingPlansSection: {
    plans: [
      {
        title: "Individual Annual Plan",
        discountedPrice: "₹47,116",
        originalPrice: "₹63,130",
        discountPercentage: "30%",
        buttonText: "Lock this Price @ ₹999",
        seatsLeft: "Less than 50 spots left!",
      },
      {
        title: "Family Annual Plan",
        subtitle: "3 Members",
        discountedPrice: "₹1,14,282",
        originalPrice: "₹1,64,688",
        discountPercentage: "30%",
        buttonText: "Lock this Price @ ₹999",
        seatsLeft: "Less than 50 spots left!",
      },
    ],
  },
  includedPlansSection: {
    title: "Included in all plans",
    className: "-md:mt-[150px]",
    items: [
      "30 Cricket Sessions",
      "8 Pilates Sessions",
      "6 Run Studio Sessions",
      "6 Recovery Classes",
      "4 Physio Sessions",
      "Unlimited Group Classes (Spinning, etc.)",
      "Unlimited Small Group Training",
      "Included: Fitness Induction + Events/Workshops/Outdoor Runs/Bootcamps",
    ],
  },
  footerInfoSection: {
    footerInfoList: [
      {
        title: "Write To Us",
        description: "Our friendly team is here to help",
        email: "info@drivefitt.club",
        image: "https://da8nru77lsio9.cloudfront.net/images/ChatToUs.svg",
      },
      {
        title: "Visit Us",
        description: "Discover the best of what we offer at our Flagship Club",
        email: "M3M 65th Avenue, Sector 65, Gurugram, Haryana 122022",
        image: "https://da8nru77lsio9.cloudfront.net/images/VisitUs.svg",
      },
      {
        title: "Call Us",
        description: "Mon - Sun from 10AM To 10PM",
        email: "+91-9871836565",
        image: "https://da8nru77lsio9.cloudfront.net/images/CallUs.svg",
      },
    ],
    socialLinkList: [
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
    contactFormSection: {
      title: "Get In Touch",
      description: "We'd love to hear from you. Please fill out this form.",
      submitButtonText: "Send Message",
      fields: {
        firstName: {
          label: "First Name*",
          placeholder: "Enter your first name",
        },
        lastName: {
          label: "Last Name",
          placeholder: "Enter your last name",
        },
        email: {
          label: "Email ID",
          placeholder: "Enter your email address",
        },
        phone: {
          label: "Phone Number*",
          placeholder: "Enter phone number",
        },
        message: {
          label: "Message",
          placeholder: "Write your message here...",
        },
      },
    },
  },
  footerSection: {
    logo: "https://da8nru77lsio9.cloudfront.net/images/logo.svg",
    description:
      "Experience Gurugram's Premier Sports Club - Cricket, Fitness, Recovery & more.",
    sections: [
      {
        title: "Quick links",
        links: [
          { title: "About us", link: "/about-us" },
          { title: "Our services", link: "/coming-soon" },
          { title: "Blogs", link: "/coming-soon" },
          { title: "Career", link: "/coming-soon" },
          { title: "Partner with us", link: "/franchise" },
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
