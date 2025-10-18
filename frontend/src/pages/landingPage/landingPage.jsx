import React from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import SpinningCube from "./spinningCube"; // import your cube component

export default function LandingPage() {
  const { scrollYProgress } = useScroll();

  // Horizontal movement for parallax effect
  const x1 = useTransform(scrollYProgress, [0, 0.35], ["0%", "-40%"]);
  const x2 = useTransform(scrollYProgress, [0, 0.35], ["0%", "40%"]);
  const x3 = useTransform(scrollYProgress, [0, 0.35], ["0%", "-40%"]);

  return (
    <main className="overflow-x-hidden bg-white p-8">
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

        <motion.h2
          style={{ x: x3 }}
          className="text-6xl whitespace-nowrap text-black md:text-9xl"
        >
          RESEARCH.
        </motion.h2>

        {/* Spinning Cube */}
      </section>

      {/* Additional Sections */}
      <section className="flex flex-col gap-10 bg-gray-100 px-8 py-40">
        <h2 className="text-4xl font-bold text-black">Our Services</h2>
        <p className="max-w-3xl text-lg text-gray-700">
          We provide a range of services to help turn your curiosity into
          meaningful insights. From research consulting to in-depth analysis,
          our team is here to guide you.
        </p>
      </section>

      <section className="flex flex-col gap-20 px-8 py-40">
        <h2 className="text-4xl font-bold text-black">About Us</h2>
        <p className="max-w-3xl text-lg text-gray-700">
          Inquira is dedicated to unlocking the potential of curiosity. Our
          mission is to provide tools and guidance for individuals and
          businesses to grow through meaningful research and learning.
        </p>
      </section>

      <section className="flex flex-col gap-20 bg-gray-100 px-8 py-40">
        <h2 className="text-4xl font-bold text-black">Our Work</h2>
        <p className="max-w-3xl text-lg text-gray-700">
          From case studies to interactive projects, our work showcases how
          curiosity-driven research can lead to transformative insights and
          strategies.
        </p>
      </section>

      <section className="flex flex-col gap-20 px-8 py-40">
        <h2 className="text-4xl font-bold text-black">Contact Us</h2>
        <p className="max-w-3xl text-lg text-gray-700">
          Want to learn more? Reach out and discover how we can collaborate to
          turn your ideas into meaningful research projects.
        </p>
      </section>
    </main>
  );
}
