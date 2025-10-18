import React from "react";
import { Link } from "react-router-dom";
import PrimaryButton from "../../components/button/PrimaryButton";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] transition-colors duration-300">
      {/* fixed outer box */}
      <section className="max-w-8xl relative h-[90vh] w-[90%] overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        {/* header (stays fixed at top inside box) */}
        <header className="absolute top-0 left-0 z-10 flex w-full items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 px-10 py-4 backdrop-blur-md">
          <h1 className="text-xl font-bold text-[var(--color-shade-primary)]">
            Inquira
          </h1>
          <nav className="flex gap-6 text-[var(--color-text-secondary)]">
            <Link
              to="#"
              className="transition-colors hover:text-[var(--color-primary)]"
            >
              Home
            </Link>
            <Link
              to="#"
              className="transition-colors hover:text-[var(--color-primary)]"
            >
              About
            </Link>
            <Link
              to="#"
              className="transition-colors hover:text-[var(--color-primary)]"
            >
              Contact
            </Link>
            <Link
            to="/login">
              <PrimaryButton
                to="/login"
                Text={"Login"}
                Style={"px-4 rounded-sm"}
              ></PrimaryButton>
            </Link>
          </nav>
        </header>

        {/* inner scrollable area */}
        <div className="landing-scroll absolute inset-0 snap-y snap-mandatory overflow-y-scroll scroll-smooth pt-20">
          {/* section 1 */}
          <section className="flex h-[90vh] snap-start flex-col items-center justify-center bg-gradient-to-b from-[var(--color-section1-from)] to-[var(--color-section1-to)] text-center">
            <h2 className="mb-4 text-6xl font-extrabold text-[var(--color-text-primary)]">
              Making work feel good
            </h2>
            <p className="max-w-md text-lg text-[var(--color-text-secondary)]">
              We’re Golden, a new kind of talent consultancy. We help ambitious
              companies and brilliant talent thrive through smart, strategic
              matching.
            </p>
          </section>

          {/* section 2 */}
          <section className="flex h-[90vh] snap-start flex-col items-center justify-center bg-gradient-to-b from-[var(--color-section2-from)] to-[var(--color-section2-to)] text-center">
            <p className="max-w-xl text-lg text-[var(--color-text-secondary)]">
              Great performance starts with happy people. We connect creative
              talent with fulfilling roles at culture-conscious companies.
            </p>
          </section>

          {/* section 3 */}
          <section className="flex h-[90vh] snap-start flex-col items-center justify-center bg-gradient-to-b from-[var(--color-section3-from)] to-[var(--color-section3-to)] text-center">
            <h2 className="mb-3 text-4xl font-bold text-[var(--color-text-primary)]">
              Join the movement
            </h2>
            <p className="max-w-md text-[var(--color-text-secondary)]">
              Discover how smart matchmaking can make work meaningful again.
            </p>
          </section>
        </div>
      </section>

      <section></section>
    </main>
  );
}
