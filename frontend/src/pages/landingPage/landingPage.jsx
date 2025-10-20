import { motion, useTransform, useMotionValue } from "framer-motion";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/src/locomotive-scroll.scss";
import React, { useEffect, useRef, useState } from "react";
import Header from "./landingPage-components/header";
import HeroSection from "./landingPage-components/heroSection";
import AboutSection from "./landingPage-components/aboutSection";
import GallerySection from "./landingPage-components/gallerySection";
import FeatureSection from "./landingPage-components/featureSection";
import TransitionText from "./landingPage-components/transitionText";
import Loader from "./landingPage-components/loader"; // import the loader

export default function LandingPage() {
  const scrollRef = useRef(null);
  const scrollY = useMotionValue(0);
  const [loading, setLoading] = useState(true);

  // HeroSection scroll animations
  const x1 = useTransform(scrollY, [0, 800], ["0%", "-70%"]);
  const x2 = useTransform(scrollY, [0, 800], ["0%", "70%"]);
  const x3 = useTransform(scrollY, [0, 800], ["0%", "-100%"]);

  // Initialize LocomotiveScroll **after loader finishes**
  useEffect(() => {
    if (!loading && scrollRef.current) {
      const scroll = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        smartphone: { smooth: true },
        tablet: { smooth: true },
      });

      scroll.on("scroll", (args) => {
        scrollY.set(args.scroll.y);
      });

      return () => scroll.destroy();
    }
  }, [loading, scrollY]);

  return (
    <>
      {/* Loader */}
      {loading && <Loader onFinish={() => setLoading(false)} />}

      {/* Main content, only rendered after loader */}
      {!loading && (
        <>
          <Header />
          <main
            data-scroll-container
            ref={scrollRef}
            className="relative min-h-screen overflow-x-hidden scroll-smooth p-8 bg-white"
          >
            <HeroSection x1={x1} x2={x2} x3={x3} />
            <AboutSection />
            <GallerySection />
            <FeatureSection />
            <TransitionText />
            <div className="h-32" />
          </main>
        </>
      )}
    </>
  );
}
