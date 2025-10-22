import React from "react";

export default function GallerySection() {
  return (
    <section className="xs:grid-cols-1 grid min-h-screen grid-cols-1 gap-3 py-6 sm:grid-cols-2 md:grid-cols-3">
      {/* Card 1 */}
      <div className="group-image group">
        <img
          className="image-zoom"
          src="./src/assets/images/phone-inquira.jpg"
          alt="inquira-mobile"
        />
        <div className="text-appear-container">
          <p className="text-header-group">Innovation</p>
          <p className="text-description-group">Build solutions that matter</p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="text-md flex aspect-[2/3] items-center justify-center rounded-4xl border border-gray-300 bg-white p-6 text-center leading-relaxed font-medium text-black">
        INQUIRA IS A PLATFORM BUILT FOR CURIOUS MINDS. WE MAKE IT EASIER FOR
        STUDENTS, RESEARCHERS, AND INNOVATORS TO CONNECT, SHARE IDEAS, AND TURN
        QUESTIONS INTO DISCOVERIES.
      </div>

      {/* Card 3 */}
      <div className="group-image group">
        <img
          className="image-zoom"
          src="./src/assets/images/phone-call.avif"
          alt="student-study"
        />
        <div className="text-appear-container">
          <p className="text-header-group">Discovery</p>
          <p className="text-description-group">Turn curiosity into progress</p>
        </div>
      </div>

      {/* Card 4 */}
      <div className="text-md flex aspect-[2/3] items-center justify-center rounded-4xl border border-gray-300 bg-white p-6 text-center leading-relaxed font-medium text-black">
        NOT JUST A TOOL, BUT AN ECOSYSTEM FOR GROWTH. HERE, CURIOSITY DRIVES
        COLLABORATION, AND COLLABORATION SPARKS INNOVATION. BUILT TO HELP PEOPLE
        EXPLORE TOGETHER, LEARN FASTER, AND SHAPE A FUTURE DEFINED BY
        UNDERSTANDING, NOT COMPETITION.
      </div>

      {/* Card 5 */}
      <div className="group-image group">
        <img
          className="image-zoom"
          src="./src/assets/images/interview.jpg"
          alt="student-study"
        />
        <div className="text-appear-container">
          <p className="text-header-group">Collaboration</p>
          <p className="text-description-group">Connect minds, share insight</p>
        </div>
      </div>

      {/* Card 6 */}
      <div className="group-image group">
        <img
          className="image-zoom"
          src="./src/assets/images/mobile-phone.jpg"
          alt="student-study"
        />
        <div className="text-appear-container">
          <p className="text-header-group">Growth</p>
          <p className="text-description-group">
            Learn, evolve, and inspire others.
          </p>
        </div>
      </div>
    </section>
  );
}
