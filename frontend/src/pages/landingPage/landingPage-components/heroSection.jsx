import { motion } from "framer-motion";
import HeroBackground from "./heroBackground";

export default function HeroSection({ x1, x2, x3 }) {
  return (
    <section className="relative mb-15 flex flex-col items-start justify-start gap-15 selection:bg-black selection:text-white">
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
  );
}
