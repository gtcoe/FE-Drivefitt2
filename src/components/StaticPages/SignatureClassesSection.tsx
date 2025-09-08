"use client";
import { useState, useEffect } from "react";
import { SignatureClassesSection as SignatureClassesSectionType } from "@/types/staticPages";
import Image from "next/image";
import ScrollAnimation from "@/components/common/ScrollAnimation";
import TitleDescription from "../common/TitleDescription";

interface SignatureClassesSectionProps {
  data: SignatureClassesSectionType;
  isMobile?: boolean;
}

const SignatureClassesSection = ({
  data,
  isMobile,
}: SignatureClassesSectionProps) => {
  const { title, cardList, cardList2 } = data;
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedCards, setAnimatedCards] = useState<number[]>([]);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      const allCards = [...cardList, ...cardList2];
      allCards.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedCards((prev) => [...prev, index]);
        }, index * 100);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [cardList, cardList2]);

  const handlePrevious = () => {
    setScrollPosition((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    const maxScrollPosition = Math.max(0, cardList.length - 2);
    setScrollPosition((prev) => Math.min(maxScrollPosition, prev + 1));
  };

  const maxScrollPosition = Math.max(0, cardList.length - 4);
  const canGoPrevious = scrollPosition > 0;
  const canGoNext = scrollPosition < maxScrollPosition;

  return (
    <section className="w-full max-w-full overflow-hidden">
      <div className="md:pl-[120px] px-6 flex flex-col">
        <ScrollAnimation delay={0.2} direction="up">
          <TitleDescription title={title} />
        </ScrollAnimation>
        <ScrollAnimation delay={0.3} direction="up">
          <div className="flex flex-col items-center gap-9 mt-[4px] md:-mt-[14px]">
            {!isMobile && (
              <div
                className={`flex items-center gap-8 md:mb-[52px] transition-all duration-700 ease-out transform ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <button
                  onClick={handlePrevious}
                  disabled={!canGoPrevious}
                  className={`rounded-full flex items-center justify-center transition-all duration-500 ease-out transform hover:scale-110 ${
                    canGoPrevious
                      ? "bg-[#00DBDC] cursor-pointer hover:bg-[#00B8B9]"
                      : "bg-[#333333] cursor-not-allowed opacity-50"
                  }`}
                >
                  <Image
                    src="/images/group-classes/left-arrow.svg"
                    alt="Previous"
                    width={56}
                    height={56}
                    className={` ${!canGoPrevious ? "opacity-50" : ""}`}
                  />
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className={`rounded-full flex items-center justify-center transition-all duration-500 ease-out transform hover:scale-110 ${
                    canGoNext
                      ? "bg-[#00DBDC] cursor-pointer hover:bg-[#00B8B9]"
                      : "bg-[#333333] cursor-not-allowed opacity-50"
                  }`}
                >
                  <Image
                    src="/images/group-classes/right-arrow.png"
                    alt="Next"
                    width={56}
                    height={56}
                    className={!canGoNext ? "opacity-50" : ""}
                  />
                </button>
              </div>
            )}
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.3} direction="up">
          {isMobile ? (
            <div className="grid grid-cols-2 gap-4">
              {[...cardList, ...cardList2].map((card, index) => (
                <div
                  key={index}
                  className={`relative w-[174px] h-[174px] rounded-[12px] overflow-hidden transition-all duration-700 ease-out transform ${
                    animatedCards.includes(index)
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-8 scale-95"
                  }`}
                  style={{
                    backgroundImage: `url(${card.backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-medium text-sm leading-5 tracking-[0px]">
                      {card.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-10 w-full">
              <div className="relative w-full overflow-hidden">
                <div
                  className="flex gap-10 transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${scrollPosition * 296}px)`,
                  }}
                >
                  {cardList.map((card, index) => (
                    <div
                      key={index}
                      className={`relative flex-shrink-0 w-64 h-64 rounded-[40px] overflow-hidden group cursor-pointer transition-all duration-700 ease-out transform hover:scale-105 hover:shadow-2xl ${
                        animatedCards.includes(index)
                          ? "opacity-100 translate-y-0 scale-100"
                          : "opacity-0 translate-y-12 scale-95"
                      }`}
                      style={{
                        backgroundImage: `url(${card.backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transitionDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"></div>
                      <div className="absolute bottom-8 left-8 flex flex-col gap-4 transition-all duration-700 ease-in-out group-hover:bottom-[40px] z-10">
                        <h3 className="text-white font-medium text-[24px] leading-8 tracking-[0px] transition-all duration-700 ease-in-out group-hover:translate-y-0 translate-y-0">
                          {card.title}
                        </h3>
                        <p className="text-white font-light text-base leading-6 tracking-[-0.32px] max-w-[400px] hidden group-hover:block transition-all duration-700 ease-in-out pr-8">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative w-full overflow-hidden">
                <div
                  className="flex gap-10 transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${scrollPosition * 296}px)`,
                  }}
                >
                  {cardList2.map((card, index) => (
                    <div
                      key={index}
                      className={`relative flex-shrink-0 w-64 h-64 rounded-[40px] overflow-hidden group cursor-pointer transition-all duration-700 ease-out transform hover:scale-105 hover:shadow-2xl ${
                        animatedCards.includes(index + cardList.length)
                          ? "opacity-100 translate-y-0 scale-100"
                          : "opacity-0 translate-y-12 scale-95"
                      }`}
                      style={{
                        backgroundImage: `url(${card.backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transitionDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"></div>
                      <div className="absolute bottom-8 left-8 flex flex-col gap-4 transition-all duration-700 ease-in-out group-hover:bottom-[40px] z-10">
                        <h3 className="text-white font-medium text-[24px] leading-8 tracking-[-1px] transition-all duration-700 ease-in-out group-hover:translate-y-0 translate-y-0">
                          {card.title}
                        </h3>
                        <p className="text-white font-light text-base leading-6 tracking-[-0.32px] max-w-[400px] hidden group-hover:block transition-all duration-700 ease-in-out pr-8">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default SignatureClassesSection;
