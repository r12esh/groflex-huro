import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ReactSlickCarousel({ settings, children }) {
  const defaultSetting = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnFocus: false,
    ...settings,
  };

  return <Slider {...defaultSetting}>{children}</Slider>;
}
