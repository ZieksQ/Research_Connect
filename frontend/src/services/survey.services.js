import { apiFetch } from "./fetcher";

// for publishing survey - sending for approval
export const publishSurvey = async (surveyData) => {
  await apiFetch("/api/survey/post/send/questionnaire/web", {
    method: "POST",
    body: JSON.stringify(surveyData),
  });
};
