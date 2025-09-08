"use client";
import { PhotoCircleSectionProps } from "@/types/staticPages";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const PhotoCircleSection = ({
  data,
  isMobile,
}: {
  data: PhotoCircleSectionProps;
  isMobile?: boolean;
}) => {
  const { title, description, image1, image2 } = data;
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="md:px-[120px] px-6 flex flex-col gap-5 md:gap-8 relative md:mb-[-160px]"
    >
      {!isMobile && (
        <div
          className="absolute pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, #00DBDC33 5%, transparent 50%)",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1000px 1000px",
            top: "-160px",
            bottom: "-160px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100vw",
            zIndex: 10,
          }}
        />
      )}
      <motion.div
        className="relative flex items-center justify-center min-h-[440px] md:mb-[75px] z-20"
        style={{ opacity, scale }}
      >
        {/* Mobile Layout */}
        {isMobile ? (
          <div className="flex flex-col items-center justify-center w-full px-4">
            <motion.div
              className="flex items-center justify-center flex-shrink-0"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div
                className="rounded-full p-[2px] w-[260px] h-[260px]"
                style={{
                  background:
                    "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
                  backgroundColor: "#00DBDC33",
                  backdropFilter: "blur(384px)",
                }}
              >
                <div className="rounded-full w-full h-full bg-[#0D0D0D] flex items-center justify-center p-6">
                  <div className="text-center max-w-[180px]">
                    <h3 className="text-2xl leading-7 tracking-[-1px] font-semibold mb-4 text-white">
                      {title}
                    </h3>
                    <p className="text-xs font-normal tracking-[-1px] leading-5 text-white">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="flex z-20 justify-center"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="flex-shrink-0 z-10 -mr-5 -mt-[52px]"
                style={{ y: y1 }}
              >
                <Image
                  src={image1}
                  alt="Pilates Practitioner 1"
                  width={200}
                  height={268}
                />
              </motion.div>
              <motion.div
                className="flex-shrink-0 z-10 -ml-5 -mt-[52px]"
                style={{ y: y2 }}
              >
                <Image
                  src={image2}
                  alt="Pilates Practitioner 2"
                  width={200}
                  height={268}
                />
              </motion.div>
            </motion.div>
          </div>
        ) : (
          /* Desktop Layout */
          <div className="flex items-center justify-center w-full">
            <motion.div
              className="flex-shrink-0 z-10 -mr-16"
              style={{ y: y1 }}
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Image
                src={image1}
                alt="Pilates Practitioner 1"
                width={252}
                height={360}
                className="w-auto h-auto"
              />
            </motion.div>
            <motion.div
              className="flex items-center justify-center z-20 flex-shrink-0"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div
                className="rounded-full p-[2px] w-[500px] h-[500px]"
                style={{
                  background:
                    "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
                }}
              >
                <div className="rounded-full w-full h-full bg-[#0D0D0D] flex items-center justify-center p-12">
                  <div className="text-center max-w-[380px]">
                    <h3 className="text-5xl font-semibold mb-10 text-white leading-[56px] tracking-[-2px]">
                      {title}
                    </h3>
                    <p className="text-xl font-normal leading-[29px] tracking-[-1px] text-[#FFFFFF]">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="flex-shrink-0 z-10 -ml-16"
              style={{ y: y2 }}
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Image
                src={image2}
                alt="Pilates Practitioner 2"
                width={252}
                height={360}
                className="w-auto h-auto"
              />
            </motion.div>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default PhotoCircleSection;
