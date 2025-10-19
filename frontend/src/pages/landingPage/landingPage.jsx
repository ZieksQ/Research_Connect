import { motion, useTransform, useMotionValue } from "framer-motion";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/src/locomotive-scroll.scss";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import HeroBackground from "./landingPage-components/heroBackground";
import GallerySection from "./landingPage-components/gallerySection";
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
        {/* Hero Section */}
        <section className="relative mb-15 flex min-h-screen flex-col items-start justify-start gap-15 selection:bg-black selection:text-white">
          <h1 className="mb-10 text-4xl">Inquira&trade;</h1>

          <motion.h2
            style={{ x: x1 }}
            className="text-6xl whitespace-nowrap text-black md:text-9xl"
          >
            TURNING CURIOSITY
          </motion.h2>

          <motion.h2
            style={{ x: x2 }}
            className="text-6xl whitespace-nowrap text-black md:text-9xl"
          >
            INTO MEANINGFUL
          </motion.h2>

          <motion.div
            style={{ x: x3, willChange: "transform" }}
            className="flex items-center gap-6 text-6xl whitespace-nowrap text-black md:text-9xl"
          >
            <h2>RESEARCH.</h2>
            <HeroBackground />
          </motion.div>

          <GallerySection />
        </section>
      </main>
    </>
  );
}
