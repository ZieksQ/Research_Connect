import { motion, useTransform, useMotionValue } from "framer-motion";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/src/locomotive-scroll.scss";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const scrollRef = useRef(null);
  const scrollY = useMotionValue(0); // instead of useScroll

  // Map scrollY manually to transform values
  const x1 = useTransform(scrollY, [0, 500], ["0%", "-40%"]);
  const x2 = useTransform(scrollY, [0, 500], ["0%", "40%"]);
  const x3 = useTransform(scrollY, [0, 500], ["0%", "-40%"]);

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
    <main
      data-scroll-container
      ref={scrollRef}
      className="overflow-x-hidden scroll-smooth bg-white p-8"
    >
      {/* Header */}
      <header className="fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center justify-center">
        <nav className="even-shadow flex items-center gap-4 rounded-full bg-white px-4 py-2">
          <button className="rounded-full px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-[#F2F0EC]">
            SERVICES
          </button>
          <button className="rounded-full px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-[#F2F0EC]">
            ABOUT
          </button>
          <button className="rounded-full px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-[#F2F0EC]">
            WORK
          </button>
          <Link to="/login">
            <button className="rounded-full border-2 border-black px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-black hover:text-white">
              LOGIN
            </button>
          </Link>
          <Link to="/signup">
            <button className="rounded-full border-2 border-black bg-black px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-800">
              SIGN UP
            </button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex min-h-screen flex-col items-start justify-start gap-15 selection:bg-black selection:text-white">
        <h1 className="mb-10 text-4xl">Inquira&trade;</h1>

        <motion.h2 style={{ x: x1 }} className="text-6xl whitespace-nowrap md:text-9xl">
          TURNING CURIOSITY
        </motion.h2>

        <motion.h2 style={{ x: x2 }} className="text-6xl whitespace-nowrap md:text-9xl">
          INTO MEANINGFUL
        </motion.h2>

        <motion.h2 style={{ x: x3 }} className="text-6xl whitespace-nowrap md:text-9xl">
          RESEARCH.
        </motion.h2>
      </section>

      {/* Additional Sections */}
      <section className="flex flex-col gap-10 bg-gray-100 px-8 py-40">
        <h2 className="text-4xl font-bold">Our Services</h2>
        <p className="max-w-3xl text-lg text-gray-700">
          We provide a range of services to help turn your curiosity into
          meaningful insights. From research consulting to in-depth analysis,
          our team is here to guide you.
        </p>
      </section>
    </main>
  );
}
