import React from "react";
import SurveyCard from "../components/survey/SurveyCard";
import { surveyData } from "../static/sampleSurvey";

const SurveyPage = () => {
  return (
    <section className="container-center mt-6 space-y-4">
      <form action="">
        {surveyData.map((e, index) => (
          <SurveyCard
            key={index}
            Title={e.title}
            Name={e.name}
            Options={e.Options}
          />
        ))}
      </form>
    </section>
  );
};

export default SurveyPage;
