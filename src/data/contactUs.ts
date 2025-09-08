import { ContactUsPageData } from "@/types/staticPages";
import { navbarData } from "./navbar";

export const contactUsData: ContactUsPageData = {
  title: "Contact Us",
  description: "Get in touch with us.",
  seoTitle: "Contact Us | Drive FITT",
  seoDescription:
    "Contact Drive FITT for any queries about our fitness and sports facilities.",
  navbar: navbarData,
  hero: {
    titleWords: [{ text: "Contact Us", color: "#FFFFFF" }],
    description:
      "Please feel free to contact us and we will get back to you as soon as we can.",
    desktopImage:
      "https://da8nru77lsio9.cloudfront.net/images/contact-us-compressed/hero.webp",
    mobileImage:
      "https://da8nru77lsio9.cloudfront.net/images/contact-us-compressed/mobile-hero.webp",
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
        email: "M3M 65th Avenue, Sector 65, Gurugram, Haryana - 122022 India",
        image: "https://da8nru77lsio9.cloudfront.net/images/VisitUs.svg",
      },
      {
        title: "Call Us",
        description: "Mon - Sun from 10AM to 10PM",
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
      description: "",
      submitButtonText: "Send Message",
      fields: {
        name: {
          label: "Name",
          placeholder: "Enter your name",
        },
        phone: {
          label: "Phone Number",
          placeholder: "Enter phone number",
        },
        interests: {
          label: "Choose Your Interest",
        },
        preferredLocation: {
          label: "Preferred Location",
          placeholder: "Select Location",
          options: [
            "M3M 65th Avenue, Gurgaon",
            "SilverGlades, Sushant Lok 1, Gurgaon",
            "Pacific Mall, Tagore Garden, New Delhi",
          ],
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
          { title: "Our services", link: "/services" },
          { title: "Blogs", link: "/blogs" },
          { title: "Career", link: "/career" },
          { title: "Partner with us", link: "/partner" },
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
          { title: "Account", link: "/account" },
          { title: "Help", link: "/help" },
          { title: "Contact Us", link: "/contact" },
          { title: "Customer Support", link: "/support" },
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
