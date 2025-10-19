import React from "react";
import { motion } from "framer-motion";
import SpinningCube from "./spinningCube";

export default function FeatureSection() {
  const cards = [
    { title: "Take Surveys", description: "Participate in surveys easily and share your opinions." },
    { title: "Post Surveys", description: "Submissions are reviewed and approved by the head before publishing." },
    { title: "Survey Analytics", description: "View detailed statistics of surveys taken by the community." },
    { title: "Mobile App", description: "Access our platform anytime, anywhere on your mobile device." },
  ];

  const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative mt-30 flex flex-col px-4 md:px-8 bg-white">
      {/* Header */}
      <h2 className="mb-5 text-4xl font-bold md:text-6xl lg:text-8xl text-black">
        DISCOVER WHAT MAKES US DIFFERENT
      </h2>
      <p className="mb-12 max-w-[50ch] text-xl md:mb-20 md:text-2xl lg:text-4xl">
        From bold ideas to exceptional execution, we create experiences that leave a lasting impact.
      </p>

      {/* Cards + Cube */}
      <section className="flex flex-col gap-10 lg:flex-row lg:items-start">
        {/* Cards */}
        <div className="flex w-full flex-col gap-8 lg:w-1/2">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              className="relative rounded-md border-l-4 border-black bg-transparent px-5 py-4"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              <h3 className="text-lg md:text-2xl font-semibold mb-2">{card.title}</h3>
              <p className="text-base md:text-lg opacity-75">{card.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Spinning Cube */}
        <div className="w-full h-[400px] lg:h-[500px] lg:w-1/2 lg:sticky lg:top-20">
          <SpinningCube />
        </div>
      </section>
    </section>
  );
}
