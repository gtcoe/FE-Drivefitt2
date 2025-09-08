"use client";
import { useRef, useState } from "react";
import { MemberSectionProps } from "@/types/staticPages";
import MemberCard from "@/components/StaticPages/MemberCard";
import Image from "next/image";
import TitleDescription from "@/components/common/TitleDescription";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ScrollAnimation from "@/components/common/ScrollAnimation";

const MemberSection = ({
  data,
  isMobile,
}: {
  data: MemberSectionProps;
  isMobile?: boolean;
}) => {
  const { title, description, memberList } = data;
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 1.8 : 3,
    slidesToScroll: 1,
    arrows: false,
    swipe: isMobile,
    draggable: isMobile,
    touchMove: isMobile,
    afterChange: (current: number) => {
      setCurrentSlide(current);
    },
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.8,
          slidesToScroll: 1,
          swipe: true,
          draggable: false,
          touchMove: true,
        },
      },
    ],
  };

  const handlePrevious = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  // Calculate position and width for highlighting based on visible members progress
  const getActiveCardHighlight = () => {
    if (isMobile) return { width: 0, left: 0 }; // No highlight on mobile

    const totalWidth = 100; // Total width in percentage
    const visibleSlides = isMobile ? 1.8 : 3; // Number of slides visible at once
    const maxSlidePosition = Math.max(0, memberList.length - visibleSlides); // Maximum possible slide position

    // If total members is less than or equal to visible slides, show full progress
    if (memberList.length <= visibleSlides) {
      return {
        width: "97%",
        left: "0%",
      };
    }

    // Calculate base progress from visible slides
    const baseProgress = (visibleSlides / memberList.length) * totalWidth;

    // Calculate additional progress based on current position
    const remainingWidth = totalWidth - baseProgress;
    const additionalProgress =
      maxSlidePosition === 0
        ? 0
        : (currentSlide / maxSlidePosition) * remainingWidth;

    // Total progress is base progress plus any additional progress from sliding
    const progress = baseProgress + additionalProgress;

    return {
      width: `${progress}%`,
      left: "0%",
    };
  };

  const highlightStyle = getActiveCardHighlight();

  return (
    <section className="md:px-[120px] px-6 flex flex-col gap-5 overflow-hidden">
      <ScrollAnimation delay={0.2} direction="up">
        <TitleDescription title={title || ""} description={description || ""} />
      </ScrollAnimation>

      <ScrollAnimation delay={0.3} direction="up">
        <div className="member-carousel">
          <Slider ref={sliderRef} {...sliderSettings}>
            {memberList.map((member) => (
              <div key={member.title} className="px-[10px] md:px-5">
                <MemberCard data={member} />
              </div>
            ))}
          </Slider>
        </div>
      </ScrollAnimation>

      {isMobile ? null : (
        <ScrollAnimation delay={0.4} direction="up">
          <div className="flex items-center mt-8">
            <div className="relative w-full max-w-[1200px] h-[1px] bg-[#1C1C1E] mb-2">
              {/* White highlight below active card */}
              <div
                className="hidden md:block absolute top-0 h-[2px] bg-white transition-all duration-500 ease-in-out"
                style={{
                  width: highlightStyle.width,
                  left: highlightStyle.left,
                }}
              />
            </div>
            <div className="h-16 p-2 rounded-[53.3px] bg-[#222226] hidden md:flex gap-4">
              <button
                onClick={handlePrevious}
                className={`bg-[#373737] rounded-full p-4 ${
                  isMobile ? "" : "hover:bg-[#2C2C2E]"
                } transition-colors`}
              >
                <Image
                  src="https://da8nru77lsio9.cloudfront.net/images/arrow-left.svg"
                  alt="Previous"
                  width={24}
                  height={24}
                />
              </button>
              <button
                onClick={handleNext}
                className={`bg-[#373737] rounded-full p-4 ${
                  isMobile ? "" : "hover:bg-[#2C2C2E]"
                } transition-colors`}
              >
                <Image
                  src="https://da8nru77lsio9.cloudfront.net/images/arrow-right.svg"
                  alt="Next"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </div>
        </ScrollAnimation>
      )}
    </section>
  );
};

export default MemberSection;
