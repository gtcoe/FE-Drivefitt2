"use client";
import { ScrollingCardSection as ScrollingCardSectionType } from "@/types/staticPages";
import TitleDescription from "@/components/common/TitleDescription";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import ScrollAnimation from "@/components/common/ScrollAnimation";
import { motion, AnimatePresence } from "framer-motion";

interface ScrollingCardSectionProps {
  data: ScrollingCardSectionType;
  isMobile?: boolean;
}

const ScrollingCardSection = ({
  data,
  isMobile,
}: ScrollingCardSectionProps) => {
  const { title, description, iconImage, cardSection } = data;
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!isMobile) return;

    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.8,
      }
    );

    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current);
    }

    return () => sectionObserver.disconnect();
  }, [isMobile]);

  const handleAccordionToggle = (index: number) => {
    if (isMobile) {
      setActiveIndex(activeIndex === index ? -1 : index);
    } else {
      setActiveIndex(index);
    }
  };

  const renderCardImage = (
    <motion.div
      key={activeIndex}
      className={`rounded-[20px] md:rounded-[40px] p-[2px] h-[396px] md:h-[598px] ${
        isMobile && isInView ? "sticky top-4" : ""
      }`}
      style={{
        background: "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`card-image-${activeIndex}`}
          className="rounded-[20px] md:rounded-[40px] w-full h-full cursor-pointer flex flex-col justify-center"
          style={{
            background: `linear-gradient(180.09deg, rgba(13, 13, 13, 0) 50%, #0D0D0D 99.92%), url(${
              isMobile && cardSection[activeIndex]?.mobileImage
                ? cardSection[activeIndex].mobileImage
                : cardSection[activeIndex]?.backgroundImage
            })`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
          }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
        />
      </AnimatePresence>
    </motion.div>
  );

  return (
    <section
      ref={sectionRef}
      className="md:px-[120px] px-6 flex flex-col gap-5 md:gap-8"
    >
      <ScrollAnimation delay={0.2} direction="up">
        <TitleDescription title={title} description={description} />
      </ScrollAnimation>
      <div className="flex justify-center">
        <div
          className="flex gap-[68px] justify-center"
          style={{ maxWidth: "1201px" }}
        >
          <ScrollAnimation
            delay={0.3}
            direction="left"
            className="flex flex-col md:w-[584px] w-full h-auto md:h-full justify-center border-t border-[#FFFFFF29] md:border-t-0"
          >
            {cardSection.map((card, idx) => (
              <motion.div
                key={idx}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                style={{
                  background: `${
                    activeIndex === idx && !isMobile
                      ? "linear-gradient(90deg, #1E1E1E 0%, #0D0D0D 100%)"
                      : ""
                  }`,
                }}
                className="flex flex-col cursor-pointer border-b border-[#FFFFFF29]"
                onMouseEnter={() => !isMobile && setActiveIndex(idx)}
                onClick={() => isMobile && handleAccordionToggle(idx)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.1,
                  ease: [0.25, 0.1, 0.25, 1.0],
                }}
                whileHover={{
                  backgroundColor:
                    activeIndex !== idx ? "rgba(30, 30, 30, 0.3)" : undefined,
                  transition: { duration: 0.3 },
                }}
              >
                <motion.div
                  className="flex items-center justify-between py-6 md:px-10 md:pt-8 md:pb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <motion.h3
                    className="text-base md:text-[32px] font-semibold md:font-medium leading-6 md:leading-10 tracking-[-1px]"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {card.subTitle}
                  </motion.h3>
                  {isMobile && (
                    <Image
                      src={
                        activeIndex === idx
                          ? "https://da8nru77lsio9.cloudfront.net/images/accordian-up-arrow.svg"
                          : "https://da8nru77lsio9.cloudfront.net/images/accordian-down-arrow.svg"
                      }
                      alt={activeIndex === idx ? "collapse" : "expand"}
                      width={24}
                      height={24}
                      className="transition-transform duration-200"
                    />
                  )}
                </motion.div>

                <motion.div
                  className="overflow-hidden"
                  initial={false}
                  animate={{
                    height: activeIndex === idx ? "auto" : 0,
                    opacity: activeIndex === idx ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1.0],
                  }}
                >
                  <div className="flex flex-col gap-4 md:gap-3 pb-6 md:px-10">
                    {card.list.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="flex items-start gap-[14px] md:gap-[26px]"
                      >
                        {iconImage && (
                          <Image
                            src={iconImage}
                            alt="check"
                            width={23.33}
                            height={23.33}
                            className="mt-1 size-5 md:size-[23.33px]"
                          />
                        )}
                        <span className="text-xs font-light md:text-base tracking-[-1%]">
                          {item}
                        </span>
                      </div>
                    ))}
                    {card.extraTagLabel && !isMobile && (
                      <span className="text-right text-sm text-[#808080] mt-2 italic">
                        {card.extraTagLabel}
                      </span>
                    )}
                    {isMobile && activeIndex === idx && renderCardImage}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </ScrollAnimation>
          {isMobile ? null : (
            <ScrollAnimation
              delay={0.4}
              direction="right"
              className="w-[549px]"
            >
              {renderCardImage}
            </ScrollAnimation>
          )}
        </div>
      </div>
    </section>
  );
};

export default ScrollingCardSection;
