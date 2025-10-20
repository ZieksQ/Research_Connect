import React from "react";

export default function HeroBackground({ src = "/src/assets/video/studying.mp4" }) {
  return (
    <div
      className="group relative w-25 h-14 overflow-hidden rounded-full cursor-pointer 
                 sm:w-26 sm:h-16 lg:w-40 lg:h-26"
    >
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover opacity-100 mix-blend-overlay transition-all duration-300 group-hover:opacity-80"
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-100">
        <p className="text-lg font-bold text-white drop-shadow-md sm:text-base xs:text-sm">
          GitHub
        </p>
      </div>
    </div>
  );
}
