import { motion } from "framer-motion";
import HeroBackground from "./heroBackground";

export default function HeroSection({ x1, x2, x3 }) {
  const textAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      className="relative flex flex-col justify-start selection:bg-black selection:text-white
                 pt-20 lg:pt-0 px-4 md:px-8"
    >
      {/* Fake header - hidden on lg and below */}
      <motion.h1
        className="mb-6 hidden lg:block text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-black"
        initial="hidden"
        animate="visible"
        variants={textAnimation}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      >
        Inquira&trade;
      </motion.h1>

      {/* Hero text wrapper */}
      <div className="flex flex-col items-start justify-center 
                      mx-auto md:mx-0 md:items-start max-w-[95%] md:max-w-5xl">
        <motion.h2
          style={{ x: x1 }}
          className="whitespace-nowrap text-black text-[clamp(2rem,5vw,4rem)] md:text-[clamp(4rem,8vw,9rem)] 
                     leading-[1.05] md:leading-[1.2] mb-4 md:mb-8"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          TURNING CURIOSITY
        </motion.h2>

        <motion.h2
          style={{ x: x2 }}
          className="whitespace-nowrap text-black text-[clamp(2rem,5vw,4rem)] md:text-[clamp(4rem,8vw,9rem)] 
                     leading-[1.05] md:leading-[1.2] mb-4 md:mb-8"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        >
          INTO MEANINGFUL
        </motion.h2>

        <motion.div
          style={{ x: x3, willChange: "transform" }}
          className="flex flex-wrap items-center gap-4 md:gap-6 whitespace-nowrap text-black
                     text-[clamp(2rem,5vw,4rem)] md:text-[clamp(4rem,8vw,9rem)] leading-[1.05] md:leading-[1.2]"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
        >
          <h2>RESEARCH.</h2>
          <HeroBackground />
        </motion.div>
      </div>

      {/* Extra bottom padding so last line is fully visible */}
      <div className="h-12 md:h-20" />
    </section>
  );
}
