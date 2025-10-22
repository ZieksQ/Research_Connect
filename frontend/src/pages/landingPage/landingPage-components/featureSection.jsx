import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Create Survey",
    desc: "Design and configure surveys effortlessly with intuitive tools for every question type.",
    icon: (
      <svg
        className="w-10 h-10 transition-colors duration-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 34 34"
      >
        <rect x="6" y="6" width="22" height="22" rx="3" />
        <line x1="10" y1="12" x2="24" y2="12" />
        <line x1="10" y1="18" x2="24" y2="18" />
        <line x1="10" y1="24" x2="20" y2="24" />
      </svg>
    ),
  },
  {
    title: "Post Survey",
    desc: "Publish surveys instantly to your desired participants, ready to collect valuable responses.",
    icon: (
      <svg
        className="w-10 h-10 transition-colors duration-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 34 34"
      >
        <rect x="5" y="8" width="24" height="18" rx="2" />
        <circle cx="12" cy="17" r="2" />
        <circle cx="22" cy="17" r="2" />
        <line x1="16" y1="17" x2="18" y2="17" />
      </svg>
    ),
  },
  {
    title: "Mobile Compatible",
    desc: "Optimized for mobile and desktop, ensuring a smooth experience across all devices.",
    icon: (
      <svg
        className="w-10 h-10 transition-colors duration-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 34 34"
      >
        <rect x="9" y="3" width="16" height="28" rx="4" />
        <circle cx="17" cy="26" r="1" />
      </svg>
    ),
  },
  {
    title: "Admin/Dean Approval",
    desc: "All submitted surveys undergo admin or dean review to maintain integrity and compliance.",
    icon: (
      <svg
        className="w-10 h-10 transition-colors duration-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 34 34"
      >
        <path d="M5 28V8l12-5 12 5v20l-12 5-12-5z" />
        <polyline points="11,17 15,21 23,13" />
      </svg>
    ),
  },
];

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, staggerChildren: 0.15 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export default function FeatureSection() {
  return (
    <section className="mt-24 bg-white text-black">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariant}
        className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-20 px-6"
      >
        {/* Heading */}
        <motion.div variants={cardVariant} className="space-y-6">
          <h2 className="font-black text-[clamp(2.8rem,6vw,6rem)] leading-tight tracking-tight">
            SMART SURVEY<br />SYSTEM.
          </h2>
          <p className="text-gray-600 text-xl md:text-2xl max-w-2xl mx-auto">
            Everything you need to create, post, and manage academic surveys in one seamless platform.
          </p>
        </motion.div>

        {/* All Cards – Icons aligned right consistently */}
        <div className="flex flex-col gap-10 w-full">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariant}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border border-black rounded-2xl p-10 transition-all duration-700 hover:bg-black hover:text-white sm:flex-row-reverse"
            >
              <div className="flex-shrink-0 mb-4 sm:mb-0 text-black group-hover:text-white flex justify-center sm:justify-end">
                {feature.icon}
              </div>
              <div className="text-center sm:text-left sm:max-w-lg">
                <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-200">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
