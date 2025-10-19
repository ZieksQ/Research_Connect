import { motion, useTransform, useMotionValue } from "framer-motion";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/src/locomotive-scroll.scss";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import HeroBackground from "./landingPage-components/heroBackground";
import GallerySection from "./landingPage-components/gallerySection";
import HeroSection from "./landingPage-components/heroSection";
import AboutSection from "./landingPage-components/aboutSection";
import Header from "./landingPage-components/header";

export default function LandingPage() {
  const scrollRef = useRef(null);
  const scrollY = useMotionValue(0);

  const x1 = useTransform(scrollY, [0, 800], ["0%", "-70%"]);
  const x2 = useTransform(scrollY, [0, 800], ["0%", "70%"]);
  const x3 = useTransform(scrollY, [0, 800], ["0%", "-100%"]);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
    });

    scroll.on("scroll", (args) => {
      scrollY.set(args.scroll.y);
    });

    return () => {
      scroll.destroy();
    };
  }, [scrollY]);

  return (
    <>
      {/* Header moved outside the scroll container */}
      <Header />

      {/* Scroll container for Locomotive Scroll */}
      <main
        data-scroll-container
        ref={scrollRef}
        className="overflow-x-hidden scroll-smooth bg-white p-15 pt-10" // add padding-top to avoid overlap with fixed header
      >
        <HeroSection x1={x1} x2={x2} x3={x3}/>
        <AboutSection />
        <GallerySection />
      </main>
    </>
  );
}
