import { motion, useTransform, useMotionValue } from "framer-motion";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/src/locomotive-scroll.scss";
import React, { useEffect, useRef } from "react";
import Header from "./landingPage-components/header";
import HeroSection from "./landingPage-components/heroSection";
import AboutSection from "./landingPage-components/aboutSection";
import GallerySection from "./landingPage-components/gallerySection";
import FeatureSection from "./landingPage-components/featureSection";

export default function LandingPage() {
  const scrollRef = useRef(null);
  const scrollY = useMotionValue(0);

  // HeroSection scroll animations
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
      <Header />

      <main
        data-scroll-container
        ref={scrollRef}
        className="min-h-screen overflow-x-hidden scroll-smooth p-8 "
      >
        {/* Light Sections */}
        <HeroSection x1={x1} x2={x2} x3={x3} />
        <AboutSection />
        <GallerySection />
        <FeatureSection />
      </main>
    </>
  );
}
