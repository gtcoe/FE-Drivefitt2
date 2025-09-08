import { StaticPageData } from "@/types/staticPages";

export const error404Data: StaticPageData = {
  title: "404 - Page Not Found | DriveFITT Premium Club",
  description:
    "The page you're looking for doesn't exist. Return to DriveFITT's homepage.",
  seoTitle: "404 - Page Not Found | DriveFITT Premium Club",
  seoDescription:
    "Oops! The page you're looking for doesn't exist. Return to DriveFITT's homepage to explore our premium cricket and fitness facilities.",
  error404Section: {
    title: "Oops! Page Not Found",
    description: "We can't find the page you're looking for",
    iconImage: "https://da8nru77lsio9.cloudfront.net/images/404.svg",
    btnText: "Go To Home",
    btnLink: "/",
  },
  footerSection: {
    logo: "https://da8nru77lsio9.cloudfront.net/images/logo.svg",
    description:
      "Experience Gurugram's premier fitness sports club - Cricket, Recovery & more",
    sections: [
      {
        title: "Quick Links",
        links: [
          { title: "About us", link: "/about-us" },
          { title: "Blogs", link: "/coming-soon" },
          { title: "Career", link: "/coming-soon" },
          { title: "Partner With Us", link: "/franchise" },
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
      "DriveFITT. All Right Reserved. Designed and Developed by TechKatalyst",
  },
};
