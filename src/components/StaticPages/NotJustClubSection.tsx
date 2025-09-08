"use client";
import { NotJustClubItem, NotJustClubSectionProps } from "@/types/staticPages";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState } from "react";

interface ListItemProps {
  item: NotJustClubItem;
  position: "top" | "middle" | "bottom";
  className?: string;
}

const ListItem = ({ item, position, className = "" }: ListItemProps) => {
  // Check for reduced motion preference
  const shouldReduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const variants: Variants = {
    top: {
      opacity: 0.1,
      y: -20,
      scale: 0.96,
      filter: "blur(0.5px)",
      transition: shouldReduceMotion
        ? { duration: 0.3 }
        : {
            duration: 1.4,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0,
          },
    },
    middle: {
      opacity: 1,
      y: 60,
      scale: 1,
      filter: "blur(0px)",
      transition: shouldReduceMotion
        ? { duration: 0.3 }
        : {
            duration: 1.4,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.1,
          },
    },
    bottom: {
      opacity: 0.1,
      y: 140,
      scale: 0.96,
      filter: "blur(0.5px)",
      transition: shouldReduceMotion
        ? { duration: 0.3 }
        : {
            duration: 1.4,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0,
          },
    },
    exit: {
      opacity: 0,
      y: -160,
      scale: 0.9,
      filter: "blur(2px)",
      transition: shouldReduceMotion
        ? { duration: 0.2 }
        : {
            duration: 1.2,
            ease: [0.4, 0, 0.2, 1],
          },
    },
  };

  return (
    <motion.div
      layoutId={`item-${item.description}`}
      className={`flex gap-6 items-center absolute left-0 ${className}`}
      variants={variants}
      initial={
        position === "bottom"
          ? {
              y: 160,
              scale: 0.9,
              filter: "blur(2px)",
            }
          : false
      }
      animate={position}
      exit="exit"
      layout
      style={{ willChange: "transform, opacity, filter" }}
    >
      <Image
        src={item.icon}
        alt={item.description}
        width={60}
        height={60}
        className="size-10 md:size-[60px]"
        priority
        style={{
          willChange: "transform",
          backfaceVisibility: "hidden",
          perspective: 1000,
        }}
        unoptimized
      />
      <motion.span
        className="text-5xl font-semibold leading-[56px] tracking-[-2px] text-[#91FFFF]"
        layout
      >
        {item.description}
      </motion.span>
    </motion.div>
  );
};

interface NotJustClubSectionComponentProps {
  data: NotJustClubSectionProps;
  className?: string;
}

const NotJustClubSection = ({
  data,
  className = "",
}: NotJustClubSectionComponentProps) => {
  const { title, bgImg, list } = data;
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState<NotJustClubItem[]>([]);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev >= list.length - 1) {
          setKey((k) => k + 1);
          return 0;
        }
        return prev + 1;
      });
    }, 1200); // Reduced from 1500ms to 1200ms for faster cycling

    return () => clearInterval(interval);
  }, [list.length]);

  useEffect(() => {
    const items = [];
    for (let i = -1; i <= 1; i++) {
      const index = (activeIndex + i + list.length) % list.length;
      items.push(list[index]);
    }
    setVisibleItems(items);
  }, [activeIndex, list]);

  return (
    <section className={`md:px-[120px] px-6 flex flex-col gap-5 ${className}`}>
      <div
        className="rounded-[20px] md:rounded-[40px] p-[2px] h-[256px] md:h-[364px]"
        style={{
          background:
            "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
        }}
      >
        <div
          className="rounded-[20px] md:rounded-[40px] bg-[#0D0D0D] w-full h-full flex flex-col justify-center relative"
          style={{
            backgroundImage: `url(${bgImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="pl-[92px] flex gap-6 items-center justify-start">
            <h1 className="text-5xl font-semibold leading-[56px] tracking-[-2px] w-fit">
              {title}
            </h1>
            <div className="flex flex-col gap-7 relative flex-1 h-[176px] overflow-hidden">
              <AnimatePresence mode="popLayout" key={key}>
                {visibleItems.map((item, index) => (
                  <ListItem
                    key={`${item.description}-${index}-${key}`}
                    item={item}
                    position={
                      index === 0 ? "top" : index === 1 ? "middle" : "bottom"
                    }
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotJustClubSection;
