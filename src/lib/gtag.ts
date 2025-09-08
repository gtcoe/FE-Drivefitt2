export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string,
      config?: Record<string, string | number | boolean | undefined>
    ) => void;
  }
}

export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    console.log("Sending pageview to GA:", url);
    window.gtag("config", GA_TRACKING_ID!, {
      page_location: url,
    });
  } else {
    console.log(
      "GA not available - window.gtag:",
      typeof window !== "undefined" ? !!window.gtag : "window undefined"
    );
  }
};

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
