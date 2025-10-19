import React from "react";
import { motion } from "framer-motion";

export default function FeatureSection() {
  const cards = [
    { title: "Innovation", description: "We bring innovative solutions." },
    { title: "Quality", description: "High quality is our standard." },
    { title: "Teamwork", description: "Collaboration drives us forward." },
    { title: "Customer Focus", description: "Our customers come first." },
  ];

  return (
    <section className="relative rounded-3xl mt-30 flex min-h-screen flex-col">
      {/* Cards container */}
      <h2 className="mb-5 w-[90%] text-8xl font-bold">
        DISCOVER WHAT MAKES US DIFFERENT
      </h2>
      <p className="w-[50ch] text-4xl font-normal mb-30">
        From bold ideas to exceptional execution, we create experiences that
        leave a lasting impact.
      </p>

      <div className="flex w-full flex-col gap-5">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="rounded-xl p-8 shadow-lg"
            initial={{ backgroundColor: "#ffffff" }}
            whileInView={{ backgroundColor: "#151515" }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="mb-2 text-2xl font-semibold text-white">
              {card.title}
            </h3>
            <p className="text-white opacity-75">{card.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
