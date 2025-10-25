import { motion, useTransform, useMotionValue } from "framer-motion";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/src/locomotive-scroll.scss";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import HeroBackground from "./heroBackground";

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
      <header className="even-shadow fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center justify-center rounded-full bg-transparent">
        <nav className="even-shadow flex items-center gap-4 rounded-full bg-white px-4 py-2">
          <button className="rounded-full px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-[#F2F0EC]">
            SERVICES
          </button>
          <button className="rounded-full px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-[#F2F0EC]">
            ABOUT
          </button>
          <button className="rounded-full px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-[#F2F0EC]">
            WORK
          </button>
          <Link to="/login">
            <button className="rounded-full border-2 border-black px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-black hover:text-white">
              LOGIN
            </button>
          </Link>
          <Link to="/signup">
            <button className="rounded-full border-2 border-black bg-black px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800">
              SIGN UP
            </button>
          </Link>
        </nav>
      </header>

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
        </section>

        {/* Additional Sections */}
        <section className="flex flex-row items-start justify-start gap-10 py-20">
          <div className="w-[50%] flex-1">
            <h2 className="text-5xl font-bold text-black">
              SHAPING THE FUTURE OF DISCOVERY
            </h2>
            <button className="mt-5 rounded-full border-2 border-black bg-black px-5 py-2 font-semibold text-white transition-all hover:bg-white hover:text-black">
              Explore
            </button>
          </div>

          <div className="mt-3 flex w-[100%] flex-1 flex-col gap-5">
            <hr className="w-full border-t-2 border-black" />
            <p className="opacity-75">Who we are</p>
            <p className="text-3xl font-light">
              We’re a collective of researchers and innovators shaping ideas
              into impact. Together, we turn curiosity into discovery.
            </p>
          </div>
        </section>

        <section className="xs:grid-cols-1 grid min-h-screen grid-cols-1 gap-3 py-6 sm:grid-cols-2 md:grid-cols-3">
          {/* Card 1 */}
          <div className="aspect-[2/3] w-full overflow-hidden rounded-4xl border border-gray-300 bg-white">
            <img
              className="h-full w-full object-cover"
              src="./src/assets/images/phone-inquira.jpg"
              alt="inquira-mobile"
            />
            <p className="absolute bottom-4 left-4 text-lg font-semibold text-white drop-shadow"></p>
          </div>

          {/* Card 2 */}
          <div className="text-md flex aspect-[2/3] items-center justify-center rounded-4xl border border-gray-300 bg-white p-6 text-center leading-relaxed font-medium text-black">
            INQUIRA IS A PLATFORM BUILT FOR CURIOUS MINDS. WE MAKE IT EASIER FOR
            STUDENTS, RESEARCHERS, AND INNOVATORS TO CONNECT, SHARE IDEAS, AND
            TURN QUESTIONS INTO DISCOVERIES.
          </div>

          {/* Card 3 */}
          <div className="aspect-[2/3] rounded-4xl border border-gray-300 bg-white"></div>

          {/* Card 4 */}
          <div className="text-md flex aspect-[2/3] items-center justify-center rounded-4xl border border-gray-300 bg-white p-6 text-center leading-relaxed font-medium text-black">
            NOT JUST A TOOL, BUT AN ECOSYSTEM FOR GROWTH. HERE, CURIOSITY DRIVES
            COLLABORATION, AND COLLABORATION SPARKS INNOVATION. BUILT TO HELP
            PEOPLE EXPLORE TOGETHER, LEARN FASTER, AND SHAPE A FUTURE DEFINED BY
            UNDERSTANDING, NOT COMPETITION.
          </div>

          {/* Card 5 */}
          <div className="aspect-[2/3] rounded-4xl border border-gray-300 bg-white"></div>

          {/* Card 6 */}
          <div className="aspect-[2/3] rounded-4xl border border-gray-300 bg-white"></div>
        </section>
      </main>
    </>
  );
}
