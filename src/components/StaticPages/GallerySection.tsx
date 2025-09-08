"use client";
import { GallerySectionProps } from "@/types/staticPages";
import Image from "next/image";
import { useState } from "react";
import EmailModal from "@/components/common/Modal/EmailModal";
import ScrollAnimation from "@/components/common/ScrollAnimation";
import { GALLERY_IMAGES } from "@/data/constants";

const GallerySection = ({
  data,
  isMobile,
}: {
  data: GallerySectionProps;
  isMobile?: boolean;
}) => {
  const { title, description, imageList } = data;
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      navigateImage("next");
    }
    if (isRightSwipe) {
      navigateImage("prev");
    }
  };

  // const handleButtonClick = () => {
  //   if (btnLabel === "View Gallery") {
  //     window.location.href = "/coming-soon";
  //   } else if (btnLabel === "Join online" || btnLabel === "Join Online") {
  //     setIsEmailModalOpen(true);
  //   }
  // };

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentImageIndex((prev) =>
        prev === 1 ? Object.keys(GALLERY_IMAGES).length : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === Object.keys(GALLERY_IMAGES).length ? 1 : prev + 1
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeImageModal();
    } else if (e.key === "ArrowLeft") {
      navigateImage("prev");
    } else if (e.key === "ArrowRight") {
      navigateImage("next");
    }
  };

  return (
    <>
      <div className="md:px-[120px] px-6 flex flex-col md:flex-row gap-[25px] md:gap-[104px] justify-between items-center">
        <ScrollAnimation
          delay={0.2}
          direction="left"
          className="w-full md:w-2/5 flex flex-col text-center justify-center items-center md:text-start md:justify-start md:items-start gap-3 md:gap-4"
        >
          <h2
            className={`${
              isMobile
                ? "text-2xl font-semibold leading-7 tracking-[-1px]"
                : "text-5xl font-semibold leading-[56px] tracking-[-2.4px]"
            } md:text-5xl md:font-semibold md:leading-[56px] md:tracking-[-2.4px]`}
          >
            {title}
          </h2>
          <p
            className={`${
              isMobile
                ? "text-xs font-light leading-4 tracking-[-1%] text-[#8A8A8A]"
                : "text-lg font-light leading-7 tracking-[-0.9px]"
            } md:text-lg md:font-light md:leading-7 md:tracking-[-0.9px]`}
          >
            {description}
          </p>
          {/* <button
            onClick={handleButtonClick}
            className={`bg-[#00DBDC] border border-transparent w-fit leading-[100%] tracking-[-5%] text-base text-[#0D0D0D] px-10 py-3 rounded-[4px] md:rounded-lg font-medium mt-2 md:mt-[60px] ${
              isMobile
                ? "h-[37px] font-medium text-sm leading-none tracking-tighter"
                : "hover:bg-transparent hover:border-[#00DBDC] hover:text-[#00DBDC]"
            } transition-all duration-200 md:px-[48px] md:h-[50px]`}
          >
            {btnLabel}
          </button> */}
        </ScrollAnimation>
        {imageList && (
          <ScrollAnimation
            delay={0.3}
            direction="right"
            className="w-full md:w-3/5"
          >
            <div className="grid grid-cols-5 gap-2 h-[316px] md:h-[577px]">
              <div className="col-span-2 grid grid-rows-2 gap-2">
                <div
                  className="row-span-1 relative h-full w-full rounded-[20px] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity duration-200"
                  onClick={() => openImageModal(imageList[0])}
                >
                  <Image
                    src={GALLERY_IMAGES[imageList[0]]?.CROPPED_IMAGE || ""}
                    alt="gallery-1"
                    fill
                    className="object-cover"
                  />
                </div>
                <div
                  className="row-span-1 relative h-full w-full rounded-[20px] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity duration-200"
                  onClick={() => openImageModal(imageList[1])}
                >
                  <Image
                    src={GALLERY_IMAGES[imageList[1]]?.CROPPED_IMAGE || ""}
                    alt="gallery-2"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div
                className="col-span-3 relative h-full w-full rounded-[20px] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity duration-200"
                onClick={() => openImageModal(imageList[2])}
              >
                <Image
                  src={GALLERY_IMAGES[imageList[2]]?.CROPPED_IMAGE || ""}
                  alt="gallery-3"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </ScrollAnimation>
        )}
      </div>

      {/* Image Preview Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeImageModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeImageModal}
            className={`absolute ${
              isMobile ? "top-4 right-4" : "top-[275px] right-[133px]"
            } z-[60] text-white hover:text-gray-300 transition-colors duration-200`}
          >
            <svg
              width={isMobile ? "24" : "42"}
              height={isMobile ? "24" : "42"}
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 8L8 24M8 8L24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="relative w-full h-full md:w-auto md:h-auto flex items-center justify-center">
            {/* Navigation Arrows - Only show on desktop */}
            {!isMobile && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("prev");
                  }}
                  className="absolute left-[-90px] top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors duration-200"
                >
                  <svg
                    width="42"
                    height="42"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 24L12 16L20 8"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("next");
                  }}
                  className="absolute right-[-90px] top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors duration-200"
                >
                  <svg
                    width="42"
                    height="42"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8L20 16L12 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Image */}
            <div
              className="relative w-full h-full flex items-center justify-center p-4 md:p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`relative ${isMobile ? "w-full" : ""}`}
                onTouchStart={isMobile ? onTouchStart : undefined}
                onTouchMove={isMobile ? onTouchMove : undefined}
                onTouchEnd={isMobile ? onTouchEnd : undefined}
              >
                <Image
                  src={GALLERY_IMAGES[currentImageIndex]?.GALLERY_IMAGE || ""}
                  alt={`gallery-${currentImageIndex + 1}`}
                  width={800}
                  height={600}
                  className={`${
                    isMobile
                      ? "w-full h-auto max-h-[80vh] object-contain"
                      : "max-w-full max-h-[80vh] object-contain"
                  }`}
                  priority
                />
              </div>
            </div>

            {/* Mobile Navigation Controls */}
            {isMobile && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-8 bg-black bg-opacity-60 px-6 py-3 rounded-full">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("prev");
                  }}
                  className="text-white"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 24L12 16L20 8"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className="text-white text-sm font-medium">
                  {currentImageIndex} / {Object.keys(GALLERY_IMAGES).length}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("next");
                  }}
                  className="text-white"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8L20 16L12 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Desktop Counter */}
            {!isMobile && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm font-medium">
                {currentImageIndex} / {Object.keys(GALLERY_IMAGES).length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        isMobile={isMobile}
      />
    </>
  );
};

export default GallerySection;
