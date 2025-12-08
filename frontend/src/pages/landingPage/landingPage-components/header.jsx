// src/pages/landingPage-components/header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";

export default function Header({ onScrollTo }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const handleHomeClick = () => {
    setIsOpen(false);

    // If user is logged in (auth has been checked and confirmed), go to /home
    if (userInfo && !userInfo.not_logged_in) {
      navigate("/home");
    } else {
      // Otherwise, go to /login (which will redirect to /home if already logged in)
      navigate("/login");
    }
  };

  return (
    <>
      {/* Main header for lg and above */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="fixed top-6 left-1/2 z-50 hidden w-[90%] max-w-[1200px] -translate-x-1/2 items-center justify-center rounded-full bg-transparent lg:flex"
      >
        <nav className="even-shadow flex items-center justify-center gap-4 rounded-full bg-white px-4 py-2">
          <button 
            onClick={handleHomeClick}
            className="rounded-full px-4 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-blue-50 hover:text-custom-blue"
          >
            Home
          </button>

          <button 
            onClick={() => onScrollTo && onScrollTo('#features')}
            className="rounded-full px-4 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-blue-50 hover:text-custom-blue"
          >
            About
          </button>

          <Link to="/login">
            <button className="rounded-full border-2 border-custom-blue px-4 py-3 text-sm font-semibold text-custom-blue transition-all hover:bg-custom-blue hover:text-white">
              LOGIN
            </button>
          </Link>

          <Link to="/signup">
            <button className="rounded-full border-2 border-custom-blue bg-custom-blue px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:border-blue-700">
              SIGN UP
            </button>
          </Link>
        </nav>
      </motion.header>

      {/* Hamburger icon with Inquira for md and below */}
      <div className="fixed top-6 left-8 z-50 flex items-center gap-4 lg:hidden">
        <button
          className="flex h-6 w-8 flex-col justify-between focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          <span className="block h-1 w-full rounded bg-gray-900"></span>
          <span className="block h-1 w-full rounded bg-gray-900"></span>
          <span className="block h-1 w-full rounded bg-gray-900"></span>
        </button>
        <h1 className="text-xl font-bold text-custom-blue font-giaza">Inquira&trade;</h1>
      </div>

      {/* Sidebar overlay with AnimatePresence for exit animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }} // start off-screen left
            animate={{ x: 0 }} // slide to 0
            exit={{ x: "-100%" }} // slide back to left
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex bg-gray-900/80 backdrop-blur-sm"
          >
            <div className="mr-auto flex h-full w-64 flex-col items-start gap-4 bg-white p-6">
              <button
                className="mb-4 self-end text-xl font-bold text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>

              <button
                className="text-lg font-semibold text-gray-900 hover:text-custom-blue"
                onClick={handleHomeClick}
              >
                Home
              </button>

              <button
                className="text-lg font-semibold text-gray-900 hover:text-custom-blue"
                onClick={() => {
                  setIsOpen(false);
                  if (onScrollTo) onScrollTo('#features');
                }}
              >
                About
              </button>

              <Link to="/login">
                <span className="cursor-pointer text-lg font-semibold text-custom-blue hover:text-blue-700">
                  LOGIN
                </span>
              </Link>

              <Link to="/signup">
                <span className="cursor-pointer text-lg font-semibold text-custom-blue hover:text-blue-700">
                  SIGN UP
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
