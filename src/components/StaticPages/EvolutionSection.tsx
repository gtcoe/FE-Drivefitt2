"use client";
import { useState, useRef, useEffect } from "react";
import TitleDescription from "@/components/common/TitleDescription";
import { EvolutionSectionProps, EvolutionItem } from "@/types/staticPages";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ScrollAnimation from "@/components/common/ScrollAnimation";

const EvolutionSection = ({
  data,
  isMobile,
}: {
  data: EvolutionSectionProps;
  isMobile?: boolean;
}) => {
  const { title, evolutionList } = data;
  const [activeBackground, setActiveBackground] = useState<EvolutionItem>(
    evolutionList[0]
  );
  const [maxCardHeight, setMaxCardHeight] = useState<number>(144);
  // ADD THIS NEW STATE
  const [isHeightCalculated, setIsHeightCalculated] = useState<boolean>(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    cardRefs.current = new Array(evolutionList.length).fill(null);
  }, [evolutionList.length]);

  // UPDATED useEffect for height calculation
  useEffect(() => {
    if (!isMobile) return;

    const measureHeights = () => {
      const validRefs = cardRefs.current.filter((ref) => ref !== null);
      if (validRefs.length === 0) return;

      // First, reset to allow natural height calculation
      setIsHeightCalculated(false);

      setTimeout(() => {
        const heights = validRefs.map((ref) => ref?.offsetHeight || 0);
        const maxHeight = Math.max(...heights, 144);

        // Debug logs (remove in production)
        console.log("Card heights:", heights);
        console.log("Max height calculated:", maxHeight);

        setMaxCardHeight(maxHeight);
        setIsHeightCalculated(true);
      }, 300); // Increased delay to ensure DOM is ready
    };

    const timeoutId = setTimeout(measureHeights, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isMobile, evolutionList]);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1.1,
    slidesToScroll: 1,
    arrows: false,
    afterChange: (index: number) => {
      const roundedIndex = Math.round(index);
      const safeIndex = Math.max(
        0,
        Math.min(roundedIndex, evolutionList.length - 1)
      );

      if (evolutionList[safeIndex]) {
        setActiveBackground(evolutionList[safeIndex]);
      } else {
        setActiveBackground(evolutionList[0]);
      }
    },
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-white/40 hover:bg-white transition-colors duration-300" />
    ),
    dotsClass: "slick-dots custom-dots",
  };

  const backgroundImageUrl =
    activeBackground?.backgroundImage ||
    evolutionList[0]?.backgroundImage ||
    "";

  return (
    <section className="flex flex-col gap-5">
      <ScrollAnimation delay={0.2} direction="up">
        <TitleDescription title={title || ""} />
      </ScrollAnimation>
      <ScrollAnimation delay={0.3} direction="up">
        <div
          className="h-[208px] md:h-[730px] w-full flex flex-col justify-end evolution-background"
          style={{
            background: `linear-gradient(179.2deg, rgba(0, 0, 0, 0) 0.87%, rgba(0, 0, 0, 0.2) 54.05%, #0D0D0D 99.5%), url(${backgroundImageUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundAttachment: "local",
          }}
        >
          {/* Desktop Hover View */}
          <div className="hidden md:flex justify-between h-fit items-start w-full gap-10 md:px-[120px] pl-6 py-4 md:py-[60px]">
            {evolutionList.map((evo, idx) => {
              return (
                <div
                  key={idx}
                  {...(!isMobile && {
                    onMouseEnter: () => setActiveBackground(evo),
                  })}
                  className={`${
                    activeBackground.title === evo.title
                      ? "bg-white text-[#1C1C1C]"
                      : "bg-transparent text-white"
                  } flex flex-col gap-4 p-8 ${
                    isMobile ? "" : "cursor-pointer"
                  } h-full w-full md:w-[374px] border-t-[2px] border-white transition-colors duration-300`}
                >
                  <h3 className="text-xl md:text-[32px] font-semibold leading-6 md:leading-9 tracking-[-1%]">
                    {evo.title}
                  </h3>
                  <p className="text-sm tracking-[-1%] font-light md:text-base leading-5 md:tracking-[-2%]">
                    {evo.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollAnimation>
      {/* Mobile Carousel View */}
      <ScrollAnimation
        delay={0.4}
        direction="up"
        className="block md:hidden mt-[-70px] pl-4 evolutionCarousel"
      >
        <Slider {...sliderSettings}>
          {evolutionList.map((evo, idx) => (
            <div key={idx} className="!w-full pl-4">
              <div
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="bg-white text-[#1C1C1C] flex flex-col justify-start gap-3 p-6 w-full"
                style={{
                  // UPDATED: Only apply fixed height AFTER calculation is done
                  height:
                    isMobile && isHeightCalculated
                      ? `${maxCardHeight + 24}px`
                      : "auto",
                  minHeight: "144px",
                }}
              >
                <h3 className="text-xl font-semibold leading-6 tracking-[-1%]">
                  {evo.title}
                </h3>
                <p className="text-sm tracking-[-1%] font-light leading-5">
                  {evo.description}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </ScrollAnimation>
    </section>
  );
};

export default EvolutionSection;
