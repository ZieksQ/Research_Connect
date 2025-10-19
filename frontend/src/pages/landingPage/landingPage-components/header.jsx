// src/pages/landingPage-components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="even-shadow fixed top-6 left-1/2 z-50 flex -translate-x-1/2 items-center justify-center rounded-full bg-transparent">
      <nav className="even-shadow flex items-center gap-4 rounded-full bg-white px-4 py-2">
        <button className="rounded-full px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-[#F2F0EC]">
          SERVICES
        </button>

        <button className="rounded-full px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-[#F2F0EC]">
          ABOUT
        </button>

        <button className="rounded-full px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-[#F2F0EC]">
          WORK
        </button>

        <Link to="/login">
          <button className="rounded-full border-2 border-black px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-black hover:text-white">
            LOGIN
          </button>
        </Link>

        <Link to="/signup">
          <button className="rounded-full border-2 border-black bg-black px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800">
            SIGN UP
          </button>
        </Link>
      </nav>
    </header>
  );
}
