// src/pages/landingPage-components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className=" fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center justify-center rounded-full bg-transparent w-[90%] max-w-[1200px]"
    >
      <nav className="even-shadow flex flex-wrap items-center justify-center gap-2 md:gap-4 rounded-full bg-white px-2 md:px-4 py-2">
        <button className="rounded-full px-3 py-2 md:px-4 md:py-3 text-xs sm:text-sm font-semibold text-black transition-all hover:bg-[#F2F0EC]">
          SERVICES
        </button>

        <button className="rounded-full px-3 py-2 md:px-4 md:py-3 text-xs sm:text-sm font-semibold text-black transition-all hover:bg-[#F2F0EC]">
          ABOUT
        </button>

        <button className="rounded-full px-3 py-2 md:px-4 md:py-3 text-xs sm:text-sm font-semibold text-black transition-all hover:bg-[#F2F0EC]">
          WORK
        </button>

        <Link to="/login">
          <button className="rounded-full border-2 border-black px-3 py-2 md:px-4 md:py-3 text-xs sm:text-sm font-semibold text-black transition-all hover:bg-black hover:text-white">
            LOGIN
          </button>
        </Link>

        <Link to="/signup">
          <button className="rounded-full border-2 border-black bg-black px-3 py-2 md:px-4 md:py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-gray-800">
            SIGN UP
          </button>
        </Link>
      </nav>
    </motion.header>
  );
}
