"use client";

import TitleDescription from "../common/TitleDescription";
import ScrollAnimation from "../common/ScrollAnimation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

interface Coach {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface MeetYourCoachesSectionProps {
  title: string;
  coaches: Coach[];
  seeMoreText?: string;
  isMobile?: boolean;
}

const MeetYourCoachesSection = ({
  title,
  coaches,
  seeMoreText = "See more",
  isMobile = false,
}: MeetYourCoachesSectionProps) => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const handleSeeMore = () => {
    // Handle see more functionality
    console.log("See more clicked");
  };

  return (
    <div ref={containerRef} className="w-full">
      <ScrollAnimation delay={0.2} direction="up">
        <TitleDescription title={title} />
      </ScrollAnimation>

      <motion.div className="mt-8 md:mt-16" style={{ opacity, scale }}>
        {/* Desktop Cards Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 mb-16 justify-items-center px-[120px] max-w-[1440px] mx-auto">
          {coaches.map((coach, index) => (
            <motion.div
              key={coach.id}
              initial={{ y: 100, opacity: 0, scale: 0.8 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.2 + index * 0.1,
                ease: [0.25, 0.1, 0.25, 1.0],
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
              className="rounded-[40px] p-0 flex flex-col text-center overflow-hidden relative w-full max-w-[373px] h-[568px]"
              style={{
                opacity: 1,
              }}
            >
              {/* Coach Image Container */}
              <div className="w-full h-full relative">
                {/* Image */}
                <Image
                  src={coach.image}
                  alt={coach.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 100%)",
                  }}
                />
              </div>

              {/* Text Content */}
              <div className="p-6 flex flex-col justify-end absolute bottom-0 left-0 right-0">
                {/* Coach Name */}
                <h3
                  className="text-white mb-2"
                  style={{
                    fontWeight: 600,
                    fontSize: "20px",
                    lineHeight: "24px",
                    letterSpacing: "0px",
                  }}
                >
                  {coach.name}
                </h3>

                {/* Coach Description */}
                <p
                  className="text-gray-300"
                  style={{
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "20px",
                    letterSpacing: "0px",
                  }}
                >
                  {coach.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Horizontal Scroll */}
        <motion.div
          className="md:hidden"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div
            className="flex gap-4 overflow-x-auto px-6 pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {coaches.map((coach, index) => (
              <motion.div
                key={coach.id}
                initial={{ x: 100, opacity: 0, scale: 0.8 }}
                whileInView={{ x: 0, opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1.0],
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
                className="rounded-[20px] p-0 flex flex-col text-center overflow-hidden relative flex-shrink-0"
                style={{
                  width: "200px",
                  height: "304px",
                  opacity: 1,
                }}
              >
                {/* Coach Image Container */}
                <div className="w-full h-full relative">
                  {/* Image */}
                  <Image
                    src={coach.image}
                    alt={coach.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 100%)",
                    }}
                  />
                </div>

                {/* Text Content */}
                <div className="p-4 flex flex-col justify-end absolute bottom-0 left-0 right-0">
                  {/* Coach Name */}
                  <h3
                    className="text-white mb-1"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      lineHeight: "20px",
                      letterSpacing: "0px",
                    }}
                  >
                    {coach.name}
                  </h3>

                  {/* Coach Description */}
                  <p
                    className="text-gray-300"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "22px",
                      letterSpacing: "0px",
                    }}
                  >
                    {coach.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* See More Button */}
        <motion.div
          className="flex justify-center px-6 md:px-[120px]"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={handleSeeMore}
            className={`bg-[#00DBDC] border border-transparent w-fit leading-[100%] tracking-[-5%] text-base text-[#0D0D0D] px-10 py-3 rounded-[4px] md:rounded-lg font-medium ${
              isMobile
                ? "h-[37px] font-medium text-sm leading-none tracking-tighter"
                : "hover:bg-transparent hover:border-[#00DBDC] hover:text-[#00DBDC]"
            } transition-all duration-200 md:px-[48px] md:h-[50px]`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {seeMoreText}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MeetYourCoachesSection;
