import styles from "./CardParallax.module.scss";
import { useTransform, motion, MotionValue } from "framer-motion";
import { useRef } from "react";
const CardParallax = ({
  title,
  description,
  url,
  mobileUrl,
  progress,
  range,
  targetScale,
  isMobile,
}: {
  title?: string;
  description?: string;
  src: string;
  backgroundImage?: string;
  url: string;
  mobileUrl?: string;
  color: string;
  i: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  isMobile?: boolean;
}) => {
  const container = useRef(null);

  const scale = useTransform(progress, range, [1, targetScale]);

  // Helper function to render HTML description with mobile/desktop image handling
  const createMarkup = (htmlString: string) => {
    if (!htmlString) return { __html: "" };

    let processedHtml = htmlString;

    if (isMobile) {
      // Replace desktop images with mobile versions
      processedHtml = processedHtml
        .replace(
          /src="\/images\/aboutUs\/3Years\.svg"/g,
          'src="/images/aboutUs/3Years-mobile.svg"'
        )
        .replace(
          /src="\/images\/aboutUs\/300Franchise\.svg"/g,
          'src="/images/aboutUs/300Franchise-mobile.svg"'
        )
        .replace(
          /src="\/images\/aboutUs\/GlennMaxwell\.svg"/g,
          'src="/images/aboutUs/GlennMaxwell-mobile.svg"'
        );
    }

    return { __html: processedHtml };
  };

  return (
    <div ref={container} className={styles.cardContainer}>
      <motion.div
        className={styles.card}
        style={{
          scale,
          backgroundImage: `url(${isMobile ? mobileUrl || url : url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {isMobile ? (
          <div className={styles.cardContentMobile}>
            {/* Image now applied as background to main card */}
            <h1 className={styles.mobileTitle}>{title}</h1>
            <p
              className={styles.mobileDescription}
              dangerouslySetInnerHTML={
                description ? createMarkup(description) : undefined
              }
            />
          </div>
        ) : (
          <div className={styles.cardContent}>
            <div className={styles.leftContent}>
              <h1 className={styles.title}>{title}</h1>
              <p
                className={styles.description}
                dangerouslySetInnerHTML={
                  description ? createMarkup(description) : undefined
                }
              />
            </div>

            <div className={styles.rightContent}>
              {/* Image now applied as background to main card */}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CardParallax;
