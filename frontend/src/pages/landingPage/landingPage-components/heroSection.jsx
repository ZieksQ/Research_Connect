import { motion } from "framer-motion";
import HeroBackground from "./heroBackground";

export default function HeroSection({ x1, x2, x3 }) {
  const textAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      className="relative flex flex-col justify-start selection:bg-custom-blue selection:text-white
                 pt-30 sm:pt-20 md:pt-12 lg:pt-0 px-4 md:px-8"
    >
      {/* Fake header - visible on lg only */}
      <motion.h1
        className="mb-6 hidden lg:block text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-gray-900 font-giaza"
        initial="hidden"
        animate="visible"
        variants={textAnimation}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      >
        Inquira&trade;
      </motion.h1>

      {/* Hero text wrapper */}
      <div
        className="flex flex-col 
                   mx-auto md:mx-0 
                   items-center md:items-start 
                   max-w-[95%] md:max-w-5xl"
      >
        <motion.h2
          style={{ x: x1 }}
          className="whitespace-nowrap text-gray-900
                     text-[clamp(2rem,5vw,4rem)] sm:text-[clamp(2.5rem,6vw,4.5rem)] 
                     md:text-[clamp(4rem,8vw,9rem)]
                     leading-[1.05] sm:leading-[1.1] md:leading-[1.2] 
                     mb-2 sm:mb-4 md:mb-8"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          TURNING CURIOSITY
        </motion.h2>

        <motion.h2
          style={{ x: x2 }}
          className="whitespace-nowrap text-gray-900
                     text-[clamp(2rem,5vw,4rem)] sm:text-[clamp(2.5rem,6vw,4.5rem)] 
                     md:text-[clamp(4rem,8vw,9rem)]
                     leading-[1.05] sm:leading-[1.1] md:leading-[1.2] 
                     mb-2 sm:mb-4 md:mb-8"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        >
          INTO MEANINGFUL
        </motion.h2>

        {/* HeroBackground placement for small screens */}
        <motion.div
          className="flex flex-wrap items-center gap-4 sm:gap-5 md:gap-6 whitespace-nowrap text-gray-900
                     text-[clamp(2rem,5vw,4rem)] sm:text-[clamp(2.5rem,6vw,4.5rem)] md:text-[clamp(4rem,8vw,9rem)]
                     leading-[1.05] sm:leading-[1.1] md:leading-[1.2]
                     flex-col sm:flex-row sm:items-center"
          style={{ x: x3, willChange: "transform" }}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
        >
          <h2 className="order-1 sm:order-1">RESEARCH.</h2>
          <div className="w-full sm:w-auto flex justify-center sm:justify-start order-2 sm:order-2">
            <HeroBackground />
          </div>
        </motion.div>
      </div>

      {/* Extra bottom padding */}
      <div className="h-10 sm:h-12 md:h-20" />
    </section>
  );
}
