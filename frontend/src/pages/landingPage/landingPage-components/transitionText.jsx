import React from "react";
import { motion } from "framer-motion";

const marqueeText =
  "INQUIRA™ • SURVEY INNOVATION • DATA INSIGHTS • ACADEMIC RESEARCH •";

export default function TransitionText() {
  return (
    <section className="relative w-full py-20 sm:py-32 bg-white overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Animated Header & Description */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.5 }}
        className="relative z-10 mb-10 px-4 sm:px-6"
      >
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-black break-words">
          GATHER. ANALYZE. GROW.
        </h2>
        <p className="text-gray-600 mt-4 text-base sm:text-lg max-w-2xl mx-auto">
          Transform data into meaningful insights with Inquira™ – empowering academic excellence through modern survey systems.
        </p>
      </motion.div>

      {/* 3 Marquee Rows */}
      <div className="relative w-full overflow-hidden space-y-4">
        {/* Top Row: Left to Right */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none"></div>
          <motion.div
            animate={{ x: ['-50%', '0%'] }}
            transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
            className="flex whitespace-nowrap text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tighter text-gray-200"
          >
            <span className="text-black/20 mr-20">{marqueeText}</span>
            <span className="text-black/20 mr-20">{marqueeText}</span>
          </motion.div>
        </div>

        {/* Middle Row: Right to Left */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none"></div>
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            className="flex whitespace-nowrap text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tighter text-gray-200"
          >
            <span className="text-black/20 mr-20">{marqueeText}</span>
            <span className="text-black/20 mr-20">{marqueeText}</span>
          </motion.div>
        </div>

        {/* Bottom Row: Left to Right with diff speed */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none"></div>
          <motion.div
            animate={{ x: ['-50%', '0%'] }}
            transition={{ repeat: Infinity, duration: 37, ease: 'linear' }}
            className="flex whitespace-nowrap text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tighter text-gray-200"
          >
            <span className="text-black/20 mr-20">{marqueeText}</span>
            <span className="text-black/20 mr-20">{marqueeText}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
