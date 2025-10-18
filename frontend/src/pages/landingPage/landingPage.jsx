import React from "react";
import { Link } from "react-router-dom";
import PrimaryButton from "../../components/button/PrimaryButton";

export default function LandingPage() {
  return (
    <main className="flex-col items-center justify-center bg-[var(--color-background)]">
      <header className="absolute top-6 left-1/2 flex -translate-x-1/2 items-center justify-center">
        <nav className="even-shadow flex items-center gap-4 rounded-full bg-white/80 px-4 py-2">
          <button className="rounded-full px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-[#F2F0EC]">
            SERVICES
          </button>
          <button className="rounded-full px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-[#F2F0EC]">
            ABOUT
          </button>
          <button className="rounded-full px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-[#F2F0EC]">
            WORK
          </button>
          <button className="rounded-full border-2 border-black px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-black hover:text-white">
            LOGIN
          </button>
          <button className="hover:bg-gray- rounded-full border-2 border-black bg-black px-4 py-2 text-sm font-semibold text-nowrap text-white transition-all">
            SIGN UP
          </button>
        </nav>
      </header>
    </main>
  );
}
