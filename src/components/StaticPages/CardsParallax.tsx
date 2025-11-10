"use client";

import { CardsParallaxProps } from "@/types/staticPages";
import CardParallax from "@/components/StaticPages/CardParallax";
import styles from "./CardParallax.module.scss";
import { useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

const CardsParallax = ({
  data,
  isMobile,
}: {
  data: CardsParallaxProps;
  isMobile?: boolean;
}) => {
  const { cardSection } = data;
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,

    offset: ["start start", "end end"],
  });
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  return (
    <div ref={container} className={styles.main}>
      {cardSection?.map((card: any, i: number) => {
        const targetScale = 1 - ((cardSection?.length ?? 0) - i) * 0.05;
        return (
          <CardParallax
            key={`p_${i}`}
            i={i}
            title={card?.title}
            description={card?.description}
            url={card?.url || ""}
            mobileUrl={card?.mobileUrl}
            src={card?.src || ""}
            color={card?.color || "#000000"}
            progress={scrollYProgress}
            range={[i * 0.25, 1]}
            targetScale={targetScale}
            isMobile={isMobile}
          />
        );
      })}
    </div>
  );
};

export default CardsParallax;
