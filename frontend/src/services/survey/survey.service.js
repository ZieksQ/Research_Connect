import { apiFetch } from "../fetcher";

// ---------------------------------
// ============= POST ==============
// ---------------------------------

// for publishing survey - sending for approval
export const publishSurvey = async (surveyData) => {
  return await apiFetch("/api/survey/post/send/questionnaire/web", {
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

// check if user already answered the survey
export const answerSurveyChecker = async (surveyId) =>
  await apiFetch(`/api/survey/questionnaire/is_answered`, {
    method: "POST",
    body: JSON.stringify({ survey_id: surveyId }),
  })

export const likePost = async (postId) =>
  await apiFetch(`/api/survey/post/like`, {
    method: "POST",
    body: JSON.stringify({ post_id: postId }),
  })

// ---------------------------------
// ============= GET ===============
// ---------------------------------

// for fetching all active survey
export const getAllSurvey = async () => {
  return await apiFetch("/api/survey/post/get", {
    method: "GET",
  });
};

// fetch survey pagination like
export const getPaginationSurvey = async (page, perPage) =>
  await apiFetch(`/api/survey/post/get?page=${page}&per_page=${perPage}`, {
    method: "GET",
  })

// get specific post for survey response
export const getSurvey = async (id) => {
  return await apiFetch(`/api/survey/post/get/questionnaire/${id}`, {
    method: "GET",
  });
};

// search survey
export const searchSurvey = async (query, order) =>
  await apiFetch(`/api/survey/post/search?query=${query}&order=${order}`, {
    method: "GET",
  })

// filter survey
export const filteredSurvey = async (query, order) => 
  await apiFetch(`/api/survey/post/search/tags_audience?query=${query}&order=${order}`, {
    method: "GET",
  })

// ---------------------------------
// ============ PATCH ==============
// ---------------------------------

// delete post
export const deleteSurvey = async (id) => 
  await apiFetch(`/api/survey/post/archive`, {
    method: "PATCH",
    body: JSON.stringify(id),
  })
