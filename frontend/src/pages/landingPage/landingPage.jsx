import React from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();

  // Horizontal movement for parallax effect
  const x1 = useTransform(scrollYProgress, [0, 0.25], ["0%", "-50%"]);
  const x2 = useTransform(scrollYProgress, [0, 0.25], ["0%", "40%"]);
  const x3 = useTransform(scrollYProgress, [0, 0.25], ["0%", "-70%"]);

  return (
    <main className="p-8 bg-white">
      {/* Header */}
      <header className="fixed top-6 left-1/2 z-50 -translate-x-1/2 flex items-center justify-center">
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
          <button className="rounded-full border-2 border-black px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-black hover:text-white">
            LOGIN
          </button>
          <button className="rounded-full border-2 border-black bg-black px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-800">
            SIGN UP
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col gap-15 min-h-screen items-start justify-start">
        <h1 className=" text-giaza text-4xl mb-10">Inquira&trade;</h1>

        <motion.h2
          style={{ x: x1 }}
          className="text-6xl md:text-8xl font-bold text-black whitespace-nowrap"
        >
          TURNING CURIOSITY
        </motion.h2>

        <motion.h2
          style={{ x: x2 }}
          className="text-6xl md:text-8xl font-bold text-black whitespace-nowrap"
        >
          INTO MEANINGFUL
        </motion.h2>

        <motion.h2
          style={{ x: x3 }}
          className="text-6xl md:text-8xl font-bold text-black whitespace-nowrap"
        >
          RESEARCH
        </motion.h2>
      </section>

      {/* Additional Scrollable Sections */}
      <section className="py-40 px-8 bg-gray-100 flex flex-col gap-20">
        <h2 className="text-4xl font-bold text-black">Our Services</h2>
        <p className="text-lg max-w-3xl text-gray-700">
          We provide a range of services to help turn your curiosity into meaningful insights. From research
          consulting to in-depth analysis, our team is here to guide you.
        </p>
      </section>

      <section className="py-40 px-8 flex flex-col gap-20">
        <h2 className="text-4xl font-bold text-black">About Us</h2>
        <p className="text-lg max-w-3xl text-gray-700">
          Inquira is dedicated to unlocking the potential of curiosity. Our mission is to provide tools and
          guidance for individuals and businesses to grow through meaningful research and learning.
        </p>
      </section>

      <section className="py-40 px-8 bg-gray-100 flex flex-col gap-20">
        <h2 className="text-4xl font-bold text-black">Our Work</h2>
        <p className="text-lg max-w-3xl text-gray-700">
          From case studies to interactive projects, our work showcases how curiosity-driven research can
          lead to transformative insights and strategies.
        </p>
      </section>

      <section className="py-40 px-8 flex flex-col gap-20">
        <h2 className="text-4xl font-bold text-black">Contact Us</h2>
        <p className="text-lg max-w-3xl text-gray-700">
          Want to learn more? Reach out and discover how we can collaborate to turn your ideas into meaningful
          research projects.
        </p>
      </section>
    </main>
  );
}
