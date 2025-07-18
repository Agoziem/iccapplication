"use client";
import React, { useState, useEffect } from "react";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./ReusableSwiper.css";

const ReusableSwiper = ({ children, noItemsMessage }) => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesCount, setSlidesCount] = useState(0);

  useEffect(() => {
    if (swiperInstance) {
      setSlidesCount(
        swiperInstance.slides.length - swiperInstance.params.slidesPerView
      );
      swiperInstance.on("slideChange", () => {
        setActiveIndex(swiperInstance.activeIndex);
      });
    }
  }, [swiperInstance]);

  return (
    <div className="swiper-container">
      <Swiper
        spaceBetween={50}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
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
              className={`prevButton me-3 d-flex align-items-center justify-content-center`}
              onClick={() => swiperInstance && swiperInstance.slidePrev()}
            >
              <FaLongArrowAltLeft />
            </div>
          )}
          {activeIndex < slidesCount && (
            <div
              className={`nextButton d-flex align-items-center justify-content-center`}
              onClick={() => swiperInstance && swiperInstance.slideNext()}
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
