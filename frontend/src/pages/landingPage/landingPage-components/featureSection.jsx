import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Create Survey",
    desc: "Design and configure surveys effortlessly with intuitive tools for every question type.",
    icon: (
      <svg
        className="w-8 h-8 transition-colors duration-500"
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
        className="w-8 h-8 transition-colors duration-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 34 34"
      >
        <path d="M5 8h24v18H5z" />
        <circle cx="12" cy="17" r="2" />
        <circle cx="22" cy="17" r="2" />
        <line x1="16" y1="17" x2="18" y2="17" />
      </svg>
    ),
  },
  {
    title: "Mobile Compatible",
    desc: "Responsive and sleek on every device, making surveys accessible anywhere, anytime.",
    icon: (
      <svg
        className="w-8 h-8 transition-colors duration-500"
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
    title: "Approval of Admin/Dean",
    desc: "Every survey undergoes admin or dean approval to ensure authenticity and compliance.",
    icon: (
      <svg
        className="w-8 h-8 transition-colors duration-500"
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
    transition: { duration: 0.8, staggerChildren: 0.18 },
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
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        {/* Left Column - Heading */}
        <motion.div variants={cardVariant} className="space-y-6 text-center lg:text-left">
          <h2 className="font-black text-[clamp(2.2rem,5vw,4.8rem)] leading-tight tracking-tight">
            SMART SURVEY<br />SYSTEM.
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-md mx-auto lg:mx-0">
            Everything you need to create, post, and manage academic surveys in one seamless experience.
          </p>
        </motion.div>

        {/* Right Column - Feature Grid */}
        <motion.div
          variants={cardVariant}
          className="grid grid-cols-1 sm:grid-cols-2 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="group flex flex-col gap-3 items-start border border-black rounded-xl p-6 transition-all duration-500 hover:bg-black hover:text-white"
            >
              <div className="mb-3 text-black group-hover:text-white">{feature.icon}</div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed group-hover:text-gray-200">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
