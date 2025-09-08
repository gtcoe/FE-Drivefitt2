"use client";

import { FaqSectionProps } from "@/types/staticPages";
import TitleDescription from "@/components/common/TitleDescription";
import { useState } from "react";
import Image from "next/image";
import ScrollAnimation from "@/components/common/ScrollAnimation";

const Faq = ({ data }: { data: FaqSectionProps }) => {
  const { title, description, faqList } = data;
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="md:px-[120px] px-6 flex flex-col gap-8 md:-mt-[175px]">
      <ScrollAnimation delay={0.2} direction="up">
        <TitleDescription title={title || ""} description={description || ""} />
      </ScrollAnimation>
      <ScrollAnimation delay={0.3} direction="up">
        <div
          className="rounded-[20px] md:rounded-[40px] p-[2px] h-[480px]"
          style={{
            background:
              "linear-gradient(180deg, #333333 29.36%, #00DBDC 120.13%)",
          }}
        >
          <div
            className="rounded-[20px] md:rounded-[40px] w-full h-full cursor-pointer flex flex-col justify-center p-6 md:p-10"
            style={{
              background: "linear-gradient(180deg, #1E1E1E 0%, #141414 100%)",
            }}
          >
            {faqList?.map((faq, idx) => (
              <div
                key={idx}
                className="border-b border-[#333333] last:border-b-0"
              >
                <div
                  className="flex justify-between items-center py-8 cursor-pointer"
                  onMouseDown={() => toggleFaq(idx)}
                >
                  <h3 className="text-white text-base md:text-xl font-medium">
                    {faq.title}
                  </h3>
                  <Image
                    src={`https://da8nru77lsio9.cloudfront.net/images/${
                      openFaqIndex === idx ? "minus" : "plus"
                    }.svg`}
                    alt={openFaqIndex === idx ? "minus" : "plus"}
                    width={24}
                    height={26}
                  />
                </div>
                {openFaqIndex === idx && (
                  <p className="text-[#8A8A8A] text-sm md:text-xl font-light md:pb-10 md:pr-11">
                    {faq.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollAnimation>
    </section>
  );
};

export default Faq;
