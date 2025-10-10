import React, { useState } from "react";
import SurveyCard from "../components/survey/SurveyCard";
import { formData } from "../static/sampleSurvey";

const SurveyPage = () => {
  const [data, setData] = useState({});

  const handleChange = (name, value) => {
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log("Answers:", { ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final Submitted Data:", data);
  };

  return (
    <section className="container-center mt-6 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {formData.map((question, index) => (
          <SurveyCard
            key={index}
            data={question}
            value={data[question.name] || ""}
            onChange={handleChange}
          />
        ))}

        <button
          type="submit"
          className="btn btn-primary ml-auto block w-[30%]"
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default SurveyPage;
