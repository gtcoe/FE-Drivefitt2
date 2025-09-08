"use client";

import { useEffect, useState, useRef } from "react";
import { FlipCardProps } from "@/types/staticPages";

const FlipCard = ({ value, label, isMobile }: FlipCardProps) => {
  const [currentValue, setCurrentValue] = useState("00");
  const [prevValue, setPrevValue] = useState("00");
  const cardRef = useRef<HTMLElement>(null);
  const topRef = useRef<HTMLElement>(null);
  const bottomRef = useRef<HTMLElement>(null);
  const backRef = useRef<HTMLElement>(null);
  const backBottomRef = useRef<HTMLElement>(null);

  const formatNumber = (num: number): string => {
    return ("0" + (num || 0)).slice(-2);
  };

  useEffect(() => {
    const newValue = formatNumber(value);

    if (newValue !== currentValue) {
      const top = topRef.current;
      const bottom = bottomRef.current;
      const back = backRef.current;
      const backBottom = backBottomRef.current;
      const card = cardRef.current;

      if (currentValue !== "00" && back && bottom) {
        back.setAttribute("data-value", currentValue);
        bottom.setAttribute("data-value", currentValue);
      }

      setPrevValue(currentValue);
      setCurrentValue(newValue);

      if (top) {
        top.textContent = newValue;
      }
      if (backBottom) {
        backBottom.setAttribute("data-value", newValue);
      }

      if (card) {
        card.classList.remove("flip");
        void card.offsetWidth;
        card.classList.add("flip");
      }
    }
  }, [value, currentValue]);

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`flip-number ${
          isMobile ? "w-[60px] h-[49px]" : "w-[84px] h-16"
        } bg-[#0D0D0D] rounded-lg overflow-hidden relative`}
      >
        <b ref={cardRef} className="flip-clock__card card">
          <b ref={topRef} className="card__top">
            {currentValue}
          </b>
          <b
            ref={bottomRef}
            className="card__bottom"
            data-value={prevValue}
          ></b>
          <b ref={backRef} className="card__back" data-value={prevValue}>
            <b
              ref={backBottomRef}
              className="card__bottom"
              data-value={currentValue}
            ></b>
          </b>
        </b>
      </div>
      <div className="tracking-[4px] text-center">{label}</div>
    </div>
  );
};

export default FlipCard;
