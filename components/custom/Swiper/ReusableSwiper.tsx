import React, { useState, useEffect } from "react";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from 'swiper';
import "swiper/css";
import "./ReusableSwiper.css";

interface SwiperBreakpoint {
  slidesPerView?: number;
  spaceBetween?: number;
}

interface ReusableSwiperProps {
  children?: React.ReactNode[] | React.ReactNode;
  noItemsMessage?: string;
  spaceBetween?: number;
  slidesPerView?: number;
  breakpoints?: { [width: number]: SwiperBreakpoint };
  className?: string;
  style?: React.CSSProperties;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean | { delay: number };
  centeredSlides?: boolean;
  freeMode?: boolean;
}

const ReusableSwiper: React.FC<ReusableSwiperProps> = ({ 
  children, 
  noItemsMessage = "No items to display",
  spaceBetween = 50,
  slidesPerView = 1,
  breakpoints,
  className = "",
  style = {},
  showNavigation = true,
  loop = false,
  autoplay = false,
  centeredSlides = false,
  freeMode = false
}) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [slidesCount, setSlidesCount] = useState<number>(0);
  const [isBeginning, setIsBeginning] = useState<boolean>(true);
  const [isEnd, setIsEnd] = useState<boolean>(false);

  // Convert children to array for consistent handling
  const childrenArray = React.Children.toArray(children);
  const hasItems = childrenArray.length > 0;

  const defaultBreakpoints: { [width: number]: SwiperBreakpoint } = breakpoints || {
    576: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    992: { slidesPerView: 3 },
  };

  useEffect(() => {
    if (swiperInstance) {
      const slidesPerViewParam = swiperInstance.params.slidesPerView;
      const effectiveSlidesPerView = typeof slidesPerViewParam === 'number' ? slidesPerViewParam : 1;
      
      setSlidesCount(
        Math.max(0, swiperInstance.slides.length - effectiveSlidesPerView)
      );
      
      setIsBeginning(swiperInstance.isBeginning);
      setIsEnd(swiperInstance.isEnd);

      const handleSlideChange = () => {
        setActiveIndex(swiperInstance.activeIndex);
        setIsBeginning(swiperInstance.isBeginning);
        setIsEnd(swiperInstance.isEnd);
      };

      swiperInstance.on("slideChange", handleSlideChange);
      
      // Cleanup function
      return () => {
        swiperInstance.off("slideChange", handleSlideChange);
      };
    }
  }, [swiperInstance]);

  const handlePrevious = () => {
    if (swiperInstance && !isBeginning) {
      swiperInstance.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperInstance && !isEnd) {
      swiperInstance.slideNext();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: 'prev' | 'next') => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action === 'prev' ? handlePrevious() : handleNext();
    }
  };

  return (
    <div className={`swiper-container ${className}`} style={style}>
      <Swiper
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        onSwiper={(swiper: SwiperType) => setSwiperInstance(swiper)}
        breakpoints={defaultBreakpoints}
        loop={loop}
        autoplay={autoplay}
        centeredSlides={centeredSlides}
        freeMode={freeMode}
      >
        {hasItems ? (
          childrenArray.map((child: React.ReactNode, index: number) => (
            <SwiperSlide key={index}>{child}</SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div
              className="no-items-message p-3 text-primary text-center bg-primary-light my-3 rounded"
              style={{ maxWidth: "400px", margin: "0 auto" }}
            >
              {noItemsMessage}
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      {showNavigation && hasItems && (
        <div className="px-2 pb-4 px-md-5 text-primary d-flex justify-content-end">
          <div className="d-flex">
            {!isBeginning && (
              <div
                className="prevButton me-3 d-flex align-items-center justify-content-center"
                onClick={handlePrevious}
                onKeyDown={(e) => handleKeyDown(e, 'prev')}
                role="button"
                tabIndex={0}
                aria-label="Previous slide"
                style={{ cursor: "pointer" }}
              >
                <FaLongArrowAltLeft />
              </div>
            )}
            {!isEnd && (
              <div
                className="nextButton d-flex align-items-center justify-content-center"
                onClick={handleNext}
                onKeyDown={(e) => handleKeyDown(e, 'next')}
                role="button"
                tabIndex={0}
                aria-label="Next slide"
                style={{ cursor: "pointer" }}
              >
                <FaLongArrowAltRight />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReusableSwiper;
