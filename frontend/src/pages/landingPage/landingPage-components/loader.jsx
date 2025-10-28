// Loader.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const text = "Inquira";

export default function Loader({ onFinish }) {
  const [displayedText, setDisplayedText] = useState("");
  const [typing, setTyping] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timeout;
    if (typing) {
      if (index < text.length) {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => prev + text[index]);
          setIndex(index + 1);
        }, 120); // faster typing
      } else {
        timeout = setTimeout(() => setTyping(false), 500); // shorter pause
      }
    } else {
      if (index > 0) {
        timeout = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
          setIndex(index - 1);
        }, 150); // faster deleting
      } else {
        onFinish(); // Typing done
      }
    }
    return () => clearTimeout(timeout);
  }, [index, typing, onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }} // faster fade out
        className="fixed top-0 left-0 w-full h-full bg-black flex items-center justify-center z-50"
      >
        <h1 className="text-white text-6xl md:text-8xl font-bold">
          {displayedText}
          <span className="animate-blink">|</span>
        </h1>
      </motion.div>
    </AnimatePresence>
  );
}
