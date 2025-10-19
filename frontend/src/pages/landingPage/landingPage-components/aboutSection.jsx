export default function AboutSection() {
  return (
    <section className="flex flex-row items-start justify-start gap-10 py-20">
      {/* Left side: heading + button */}
      <div className="w-[50%] flex-1">
        <h2 className="text-5xl font-bold text-black">
          SHAPING THE FUTURE OF DISCOVERY
        </h2>
        <button className="mt-5 rounded-full border-2 border-black bg-black px-5 py-2 font-semibold text-white transition-all hover:bg-white hover:text-black">
          Explore
        </button>
      </div>

      {/* Right side: text content */}
      <div className="mt-3 flex w-[100%] flex-1 flex-col gap-5">
        <hr className="w-full border-t-2 border-black" />
        <p className="opacity-75">Who we are</p>
        <p className="text-3xl font-light">
          We’re a collective of researchers and innovators shaping ideas into
          impact. Together, we turn curiosity into discovery.
        </p>
      </div>
    </section>
  );
}
