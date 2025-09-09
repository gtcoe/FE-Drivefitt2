import { StaticPageData } from "@/types/staticPages";
import { navbarData } from "./navbar";
import { PROTEIN_BAR_TEXT } from "@/data/constants";

export const homeData: StaticPageData = {
  title: "Drive FITT",
  description: "Experience the best fitness and sports facilities.",
  seoTitle: "Drive FITT - Premium Fitness & Sports Club",
  seoDescription:
    "Join Drive FITT, Gurugram's premier fitness & sports club. Experience state-of-the-art facilities for cricket, fitness, recovery, and more.",
  navbar: navbarData,
  hero: {
    titleWords: [
      {
        text: "India's First ",
        color: "#FFFFFF",
      },
      {
        text: "Cricket ",
        color: "#00DBDC",
      },
      {
        text: "and ",
        color: "#FFFFFF",
      },
      {
        text: "Fitness ",
        color: "#00DBDC",
      },
      {
        text: "Club",
        color: "#FFFFFF",
      },
    ],
    description: "",
    desktopImage: "https://da8nru77lsio9.cloudfront.net/images/homec/hero.webp",
    originalDesktopImage:
      "https://da8nru77lsio9.cloudfront.net/images/homec/hero-original.svg",
    mobileImage:
      "https://da8nru77lsio9.cloudfront.net/images/homec/mobile-hero.webp",
    originalMobileImage:
      "https://da8nru77lsio9.cloudfront.net/images/hero/home-mobile-original.svg",
    btnPrimaryText: "Join Now",
  },
  countdownSection: {
    title: "Your Premium Sports Club. Opening Soon at ",
    date: "2025-12-15T11:00:00",
    bgImage: "/images/counterbg.svg",
    mobileBgImage: "/images/counterbg-mobile.svg",
    location: "M3M 65th Ave., Golf Course Extn Road, Gurugram",
    openingText: "Opening in",
    labels: {
      days: "DAYS",
      hours: "HOURS",
      minutes: "MINUTE",
      seconds: "SECOND",
    },
  },
  carouselBanner: [
    {
      title: "Experience Premium Club. Launching in GURUGRAM",
      countdownEnd: "2025-12-15",
      backgroundImage:
        "https://da8nru77lsio9.cloudfront.net/images/carouselBanner/banner-1.svg",
    },
  ],
  cardSection4: {
    title: "A Complete Ecosystem for Peak Performance",
    description:
      "From cricket training to multi-format fitness and recovery—every element of your game is here.",
    cardSection: [
      {
        title: "Cricket",
        description:
          "World-class indoor nets, ball tracking & analytics & pro coaching for all skill levels",
        backgroundImage:
          "https://da8nru77lsio9.cloudfront.net/images/homec/card4-1.svg",
        link: "/cricket",
        redirectionIcon:
          "https://da8nru77lsio9.cloudfront.net/images/redirection.svg",
      },
      {
        title: "Fitness",
        description:
          "Expertly designed strength, conditioning, and performance training utilizing top-tier equipment, tailored for you.",
        backgroundImage:
          "https://da8nru77lsio9.cloudfront.net/images/homec/card4-2.webp",
        link: "/fitness",
        redirectionIcon:
          "https://da8nru77lsio9.cloudfront.net/images/redirection.svg",
      },
      {
        title: "Recovery",
        description:
          "Cold plunge, infrared sauna, compression & percussion therapy along with physiotherapy to recharge, recover, and reduce injury risk.",
        backgroundImage:
          "https://da8nru77lsio9.cloudfront.net/images/homec/card4-3.svg",
        link: "/recovery",
        redirectionIcon:
          "https://da8nru77lsio9.cloudfront.net/images/redirection.svg",
      },
      {
        title: "Running",
        description:
          "Pace-enhancing run classes with functional drills to optimize speed, agility & endurance.",
        backgroundImage:
          "https://da8nru77lsio9.cloudfront.net/images/homec/card4-4.webp",
        link: "/running",
        redirectionIcon:
          "https://da8nru77lsio9.cloudfront.net/images/redirection.svg",
      },
    ],
  },
  cardSection3: {
    title: "Train Your Way",
    description:
      "Group energy. Focused strength. Smart recovery — your training, your terms.",
    cardSection: [
      {
        title: "Group Classes",
        description:
          "Our expert-led group sessions fuel your energy and connect you with a community that shares your drive.",
        backgroundImage:
          "https://da8nru77lsio9.cloudfront.net/images/homec/card3-1.webp",
        link: "/group-classes",
        redirectionIcon: "/images/redirection.svg",
      },
      {
        title: "Pilates",
        description:
          "Low-impact, high-control pilates workouts designed to improve flexibility, posture, and core strength in a group setting.",
        backgroundImage:
          "https://da8nru77lsio9.cloudfront.net/images/homec/card3-2.webp",
        link: "/pilates",
        redirectionIcon: "/images/redirection.svg",
      },
      {
        title: "Personal Training",
        description:
          "Customized 1-on-1 coaching tailored to your body, goals, sport-specific performance—and complete recovery needs.",
        backgroundImage:
          "https://da8nru77lsio9.cloudfront.net/images/homec/card3-3.webp",
        link: "/personal-training",
        redirectionIcon: "/images/redirection.svg",
      },
    ],
  },
  cardSection2: {
    title: "Refueling & Gear-Up Zone",
    description: "Refuel. Recharge. Recover.",
    cardSection: [
      {
        title: PROTEIN_BAR_TEXT,
        description:
          "Fuel up with wholesome meals, recovery shakes, and smart hydration—designed for every fitness goal.",
        backgroundImage:
          "https://da8nru77lsio9.cloudfront.net/images/card-section/home/card-section-2-bg.svg",
        modalImage:
          "https://da8nru77lsio9.cloudfront.net/images/card-section/home/man-modal.svg",
        link: "",
        redirectionIcon:
          "https://da8nru77lsio9.cloudfront.net/images/redirection.svg",
      },
      {
        title: "Pro Shop",
        description:
          "Access premium cricket gear, fitness accessories, and apparel—all curated for champions.",
        backgroundImage:
          "https://da8nru77lsio9.cloudfront.net/images/card-section/home/card-section-2-bg.svg",
        modalImage:
          "https://da8nru77lsio9.cloudfront.net/images/homec/card2-2.svg",
        link: "",
        redirectionIcon:
          "https://da8nru77lsio9.cloudfront.net/images/redirection.svg",
      },
    ],
  },
  innovationCommunitySection: {
    title: "Innovation & Community",
    description: "Beyond Training: Your Tech-Integrated Fitness Lifestyle",
    infoSection: [
      {
        title: "Performance Tech",
        list: [
          {
            image: "https://da8nru77lsio9.cloudfront.net/images/info1-1.svg",
            description: "3D body scan assessment",
          },
          {
            image: "https://da8nru77lsio9.cloudfront.net/images/info1-2.svg",
            description: "A.I. ball tracking & analytics for cricket",
          },
          {
            image: "https://da8nru77lsio9.cloudfront.net/images/info1-3.svg",
            description: "Integrated member app",
          },
        ],
      },
      {
        title: "Premium Workspaces",
        list: [
          {
            image: "https://da8nru77lsio9.cloudfront.net/images/info2-1.svg",
            description: "Dedicated phone booths",
          },
          {
            image: "https://da8nru77lsio9.cloudfront.net/images/info2-2.svg",
            description: "Ample sitting space",
          },
          {
            image: "https://da8nru77lsio9.cloudfront.net/images/info2-3.svg",
            description: "Fast and reliable Wi-Fi",
          },
        ],
      },
      {
        title: "Community & Challenges",
        list: [
          {
            image: "https://da8nru77lsio9.cloudfront.net/images/info3-1.svg",
            description: "Squad based challenges",
          },
          {
            image: "https://da8nru77lsio9.cloudfront.net/images/info3-2.svg",
            description: "Signature events & experiences",
          },
          {
            image: "https://da8nru77lsio9.cloudfront.net/images/info3-3.svg",
            description: "Family plan",
          },
        ],
      },
    ],
  },
  gallerySection: {
    title: "Step Inside the Future of Sports & Fitness",
    description:
      "Tour our state-of-the-art club and discover how Drive FITT redefines space, energy, and purpose.",
    btnLabel: "View Gallery",
    imageList: [1, 2, 3],
  },
  ecosystemGifSection: {
    title: "The Drive FITT Sports Club Philosophy",
    description: "The Drive FITT Model: Engineered for Excellence",
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
      "Experience Gurugram's Premier Sports Club - Cricket, Fitness, Recovery & more.",
    sections: [
      {
        title: "Quick Links",
        links: [
          {
            title: "About Us",
            link: "/about-us",
          },
          {
            title: "Blogs",
            link: "/coming-soon",
          },
          {
            title: "Career",
            link: "/coming-soon",
          },
          {
            title: "Partner With Us",
            link: "/franchise",
          },
        ],
      },
      {
        title: "Services",
        links: [
          {
            title: "Cricket",
            link: "/cricket",
          },
          {
            title: "Fitness",
            link: "/fitness",
          },
          {
            title: "Recovery",
            link: "/recovery",
          },
          {
            title: "Running",
            link: "/running",
          },
          {
            title: "Group Classes",
            link: "/group-classes",
          },
          {
            title: "Pilates",
            link: "/pilates",
          },
          {
            title: "Personal Training",
            link: "/personal-training",
          },
        ],
      },
      {
        title: "Support",
        links: [
          {
            title: "Account",
            link: "/coming-soon",
          },
          {
            title: "Help",
            link: "/coming-soon",
          },
          {
            title: "Contact Us",
            link: "/contact-us",
          },
        ],
      },
      {
        title: "Legals",
        links: [
          {
            title: "Terms & Conditions",
            link: "/terms",
          },
          {
            title: "Privacy & Policy",
            link: "/privacy",
          },
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
