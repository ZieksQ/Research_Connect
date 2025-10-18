import React from "react";
import { Link } from "react-router-dom";
import PrimaryButton from "../../components/button/PrimaryButton";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)]">
      {/* fixed outer box */}
      <section className="max-w-8xl relative h-[92vh] w-[95%] overflow-hidden rounded-[2rem] bg-[var(--color-surface)] shadow-2xl">
        {/* header */}
        <header className="absolute top-4 left-0 z-10 flex w-full items-center justify-between bg-transparent px-10 py-4 backdrop-blur-none">
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
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
            <Link to="/login">
              <PrimaryButton
                to="/login"
                Text={"Login"}
                Style={"px-4 rounded-sm bg-black"}
              />
            </Link>
          </nav>
        </header>

        {/* scrollable container (no gradient, no visible scrollbar) */}
        <div className="hide-scrollbar absolute inset-0 snap-y snap-mandatory overflow-y-scroll scroll-smooth pt-20">
          <section className="flex h-[90vh] snap-start flex-col items-center justify-center text-center">
            <h2 className="mb-4 text-6xl font-extrabold text-[var(--color-text-primary)]">
              Connect Through Student Surveys
            </h2>
            <p className="max-w-md text-lg text-[var(--color-text-secondary)]">
              Join a community where students can post surveys, explore
              insights, and engage with peers to make research meaningful and
              collaborative.
            </p>
          </section>

          <section className="flex h-[90vh] snap-start flex-col items-center justify-center text-center">
            <p className="max-w-xl text-lg text-[var(--color-text-secondary)]">
              Post surveys. Discover insights. Connect with fellow students.
            </p>
          </section>

          <section className="flex h-[90vh] snap-start flex-col items-center justify-center text-center">
            <h2 className="mb-3 text-4xl font-bold text-[var(--color-text-primary)]">
              Your Research, Your Community
            </h2>
            <p className="max-w-md text-[var(--color-text-secondary)]">
              Turn your questions into knowledge and collaborate with students
              across campus. Share surveys, gather responses, and learn
              together.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
