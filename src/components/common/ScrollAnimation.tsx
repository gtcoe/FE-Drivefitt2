"use client";
import { motion } from "framer-motion";
import { useRef, useState, useEffect, ReactNode } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  threshold?: number;
  direction?: "up" | "down" | "left" | "right";
}

export default function ScrollAnimation({
  children,
  className = "",
  delay = 0,
  duration = 0.7,
  distance = 30,
  once = true,
  threshold = 0.1,
  direction = "up",
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin: "0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [once, threshold]);

  // Define initial and animate properties based on direction
  const getInitialProps = () => {
    switch (direction) {
      case "up":
        return { y: distance, opacity: 0 };
      case "down":
        return { y: -distance, opacity: 0 };
      case "left":
        return { x: distance, opacity: 0 };
      case "right":
        return { x: -distance, opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialProps()}
      animate={isInView ? { y: 0, x: 0, opacity: 1 } : getInitialProps()}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0], // Smooth easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
