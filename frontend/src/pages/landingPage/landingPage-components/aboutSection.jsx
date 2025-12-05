export default function AboutSection() {
  return (
    <section className="flex flex-col md:flex-row items-start justify-start gap-10 py-20">
      {/* Left side: heading + button */}
      <div className="w-full md:w-1/2 flex-1">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
          SHAPING THE FUTURE OF DISCOVERY
        </h2>
        <button className="mt-5 rounded-full border-2 border-custom-blue bg-custom-blue px-5 py-2 font-semibold text-white transition-all hover:bg-white hover:text-custom-blue">
          Explore
        </button>
      </div>

      {/* Right side: text content */}
      <div className="mt-8 md:mt-0 w-full md:w-1/2 flex-1 flex flex-col gap-5">
        <hr className="w-full border-t-2 border-custom-blue" />
        <p className="opacity-75 text-lg md:text-base text-gray-700">Who we are</p>
        <p className="text-2xl md:text-3xl font-light text-gray-800">
          We’re a collective of researchers and innovators shaping ideas into
          impact. Together, we turn curiosity into discovery.
        </p>
      </div>
    </section>
  );
}
