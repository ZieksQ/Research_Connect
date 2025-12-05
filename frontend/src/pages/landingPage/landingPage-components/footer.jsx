import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const footerLinks = [
  { title: "Home", url: "/" },
  { title: "Socials", url: "/socials" },
  { title: "About", url: "/about" },
];

const contacts = [
  { title: "LinkedIn", url: "https://linkedin.com" },
  { title: "Instagram", url: "https://instagram.com" },
  { title: "TikTok", url: "https://tiktok.com" },
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
    rest: { scale: 1, color: "#111827" }, // text-gray-900
    hover: { scale: 1.05, color: "#1447E6" }, // text-custom-blue
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeVariant}
      className="bg-white text-gray-900 px-8 py-16 md:px-20 mt-24 border-t border-gray-200"
    >
      <motion.div
        variants={fadeVariant}
        className="flex flex-col lg:flex-row lg:items-start lg:justify-between max-w-7xl mx-auto gap-12"
      >
        {/* Left Side */}
        <motion.div
          variants={fadeVariant}
          className="flex-1 space-y-6 lg:max-w-md text-center lg:text-left"
        >
          <div>
            <h1 className="font-extrabold text-4xl tracking-tight text-custom-blue">
              Inquira<sup className="text-base">™</sup>
            </h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900">
            Empowering academic research with modern survey tools.
          </h2>

          <div className="flex mt-4 max-w-sm space-x-3 justify-center lg:justify-start mx-auto lg:mx-0">
            <Link to="/login">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#1447E6",
                  color: "#fff",
                  borderColor: "#1447E6"
                }}
                transition={{ duration: 0.3 }}
                className="bg-transparent border border-custom-blue text-custom-blue px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Login
              </motion.button>
            </Link>

            <Link to="/signup">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#1d4ed8", // blue-700
                  color: "#fff",
                }}
                transition={{ duration: 0.3 }}
                className="bg-custom-blue text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Sign Up
              </motion.button>
            </Link>
          </div>

          <small className="block text-xs text-gray-500 max-w-sm mx-auto lg:mx-0">
            Join Inquira™ to streamline academic survey creation, collaboration,
            and secure data handling in one unified platform.
          </small>
        </motion.div>

        {/* Right Side - properly aligned */}
        <motion.div
          variants={fadeVariant}
          className="flex flex-1 flex-row justify-center lg:justify-end gap-16 text-center lg:text-left"
        >
          <div>
            <h4 className="mb-3 text-gray-500 uppercase font-semibold tracking-wide">
              More Links
            </h4>
            {footerLinks.map((link) => (
              <motion.a
                key={link.title}
                href={link.url}
                variants={linkHover}
                whileHover="hover"
                className="block mb-3 text-lg relative group transition"
              >
                <span className="group-hover:text-custom-blue transition-colors duration-300">
                  {link.title}
                </span>
                <span className="absolute left-0 bottom-0 h-[1px] w-full bg-custom-blue scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </motion.a>
            ))}
          </div>

          <div>
            <h4 className="mb-3 text-gray-500 uppercase font-semibold tracking-wide">
              Contacts
            </h4>
            {contacts.map((link) => (
              <motion.a
                key={link.title}
                href={link.url}
                variants={linkHover}
                whileHover="hover"
                className="block mb-3 text-lg relative group transition"
              >
                <span className="group-hover:text-custom-blue transition-colors duration-300">
                  {link.title}
                </span>
                <span className="absolute left-0 bottom-0 h-[1px] w-full bg-custom-blue scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
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
        © {new Date().getFullYear()} Inquira™. All rights reserved.
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
