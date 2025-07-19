"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "./ReusableSwiper.css";

interface ReusableSwiperProps {
  children?: ReactNode[];
  noItemsMessage?: string;
}

const ReusableSwiper = ({ children, noItemsMessage }: ReusableSwiperProps) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [slidesCount, setSlidesCount] = useState<number>(0);

  useEffect(() => {
    if (swiperInstance) {
      const totalSlides = swiperInstance.slides.length;
      const visibleSlides = swiperInstance.params.slidesPerView as number;
      setSlidesCount(totalSlides - visibleSlides);
      
      const handleSlideChange = () => {
        setActiveIndex(swiperInstance.activeIndex);
      };
      
      swiperInstance.on("slideChange", handleSlideChange);
      
      return () => {
        swiperInstance.off("slideChange", handleSlideChange);
      };
    }
  }, [swiperInstance]);

  const handlePrevSlide = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const handleNextSlide = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  return (
    <div className="swiper-container">
      <Swiper
        spaceBetween={50}
        onSwiper={setSwiperInstance}
        breakpoints={{
          576: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
        }}
      >
        {children && children.length > 0 ? (
          children.map((child, index) => (
            <SwiperSlide key={index}>{child}</SwiperSlide>
          ))
        ) : (
          <div
            className="no-items-message p-3 text-primary text-center bg-primary-light my-3 rounded"
            style={{ maxWidth: "400px" }}
          >
            {noItemsMessage}
          </div>
        )}
      </Swiper>

      <div className="px-2 pb-4 px-md-5 text-primary d-flex justify-content-end">
        <div className="d-flex">
          {activeIndex > 0 && (
            <div
              className="prevButton me-3 d-flex align-items-center justify-content-center"
              onClick={handlePrevSlide}
            >
              <FaLongArrowAltLeft />
            </div>
          )}
          {activeIndex < slidesCount && (
            <div
              className="nextButton d-flex align-items-center justify-content-center"
              onClick={handleNextSlide}
            >
              <FaLongArrowAltRight />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReusableSwiper;
