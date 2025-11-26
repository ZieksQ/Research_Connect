import { apiFetch } from "../fetcher";

// ---------------------------------
// ============= POST ==============
// ---------------------------------

// for publishing survey - sending for approval
export const publishSurvey = async (surveyData) => {
  await apiFetch("/api/survey/post/send/questionnaire/web", {
    method: "POST",
    body: surveyData,
  });
};

// for answering survey - submitting response
export const submitSurveyResponse = async (id, surveydata) => {
  return await apiFetch(`/api/survey/answer/questionnaire/${id}`, {
    method: 'POST',
    body: JSON.stringify(surveydata),
  });
};

// ---------------------------------
// ============= GET ===============
// ---------------------------------

// for fetching all active survey
export const getAllSurvey = async () => {
  return await apiFetch("/api/survey/post/get", {
    method: "GET",
  });
};

// get specific post for survey response
export const getSurvey = async (id) => {
  return await apiFetch(`/api/survey/post/get/questionnaire/${id}`, {
    method: "GET",
  });
};
