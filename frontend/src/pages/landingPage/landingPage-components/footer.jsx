import React from "react";
import { motion } from "framer-motion";

const footerLinks = [
  { title: "Home", url: "/" },
  { title: "Services", url: "/services" },
  { title: "About", url: "/about" },
  { title: "Work", url: "/work" },
  { title: "Contact", url: "/contact" },
];

const socials = [
  { title: "LinkedIn", url: "https://linkedin.com" },
  { title: "Instagram", url: "https://instagram.com" },
  { title: "TikTok", url: "https://tiktok.com" },
  { title: "Dribbble", url: "https://dribbble.com" },
];

const learnLinks = [
  { title: "Insights", url: "/" },
  { title: "Brave/U", url: "/" },
  { title: "Careers", url: "/" },
];

const Footer = () => {
  const fadeVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 },
    },
  };

  const linkHover = {
    rest: { scale: 1, color: "#000" },
    hover: { scale: 1.05, color: "#555" },
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeVariant}
      className="bg-white text-black px-8 py-16 md:px-20 mt-24 border-t border-gray-300"
    >
      <motion.div
        variants={fadeVariant}
        className="flex flex-col lg:flex-row lg:justify-between gap-12"
      >
        {/* Left side - brand and newsletter */}
        <motion.div variants={fadeVariant} className="flex-1 space-y-6">
          <div>
            <span className="font-extrabold text-4xl tracking-tight">BP<sup className="text-base">®</sup></span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight text-black">
            Stay updated with<br/> our latest insights.
          </h2>

          <form className="flex mt-4 max-w-sm space-x-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded-l-lg bg-gray-100 text-black focus:outline-none focus:bg-white transition duration-300"
            />
            <motion.button
              whileHover={{ backgroundColor: "#000", color: "#fff", scale: 1.05 }}
              transition={{ duration: 0.3 }}
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-r-lg font-semibold transition-all duration-300"
            >
              Subscribe
            </motion.button>
          </form>
          <small className="block text-xs text-gray-500 max-w-sm">
            By subscribing, you agree to our{" "}
            <a href="#" className="underline hover:text-black transition">Privacy Policy</a>. 
            Unsubscribe anytime.
          </small>
        </motion.div>

        {/* Right side - navigation links */}
        <motion.div
          variants={fadeVariant}
          className="flex-1 flex flex-wrap sm:flex-nowrap justify-between gap-8"
        >
          <div>
            <h4 className="mb-3 text-gray-500 uppercase font-semibold tracking-wide">
              Company
            </h4>
            {footerLinks.map((link) => (
              <motion.a
                key={link.title}
                href={link.url}
                variants={linkHover}
                whileHover="hover"
                className="block mb-3 text-lg relative group transition"
              >
                <span className="group-hover:text-gray-700 transition-colors duration-300">{link.title}</span>
                <span className="absolute left-0 bottom-0 h-[1px] w-full bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </motion.a>
            ))}
          </div>

          <div>
            <h4 className="mb-3 text-gray-500 uppercase font-semibold tracking-wide">
              Discover
            </h4>
            {socials.map((link) => (
              <motion.a
                key={link.title}
                href={link.url}
                variants={linkHover}
                whileHover="hover"
                className="block mb-3 text-lg relative group transition"
              >
                <span className="group-hover:text-gray-700 transition-colors duration-300">{link.title}</span>
                <span className="absolute left-0 bottom-0 h-[1px] w-full bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </motion.a>
            ))}
          </div>

          <div>
            <h4 className="mb-3 text-gray-500 uppercase font-semibold tracking-wide">
              Learn
            </h4>
            {learnLinks.map((link) => (
              <motion.a
                key={link.title}
                href={link.url}
                variants={linkHover}
                whileHover="hover"
                className="block mb-3 text-lg relative group transition"
              >
                <span className="group-hover:text-gray-700 transition-colors duration-300">{link.title}</span>
                <span className="absolute left-0 bottom-0 h-[1px] w-full bg-black scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom copyright */}
      <motion.div
        variants={fadeVariant}
        className="mt-12 text-center text-sm text-gray-500"
      >
        © {new Date().getFullYear()} Brave People. All rights reserved.
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
