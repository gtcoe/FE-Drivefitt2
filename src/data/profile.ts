import { ProfilePageData } from "@/types/staticPages";

export const profileData: ProfilePageData = {
  title: "Profile",
  seoTitle: "Profile | DriveFITT Premium Club",
  seoDescription:
    "Manage your DriveFITT profile, view your membership details, and update your personal information.",
  userInfo: {
    name: "Sahil Dua",
    email: "sahildua@gmail.com",
    phone: "+91 898 898 8989",
    dateOfBirth: "25 Oct 1995",
    activePlan: "Individual Annual Plan",
    planExpires: "25 Oct 2025",
  },
  actions: {
    changeName: {
      text: "Change",
      enabled: true,
    },
    changeEmail: {
      text: "Change",
      enabled: true,
    },
    changeBirthday: {
      text: "Change",
      enabled: true,
    },
    viewPlan: {
      text: "View plan",
      enabled: true,
      isButton: true,
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
