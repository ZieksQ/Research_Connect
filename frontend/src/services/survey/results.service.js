import { apiFetch } from "../fetcher";

// get computed results data
export const getComputedResults = async (id) => {
  return await apiFetch(`/api/survey/post/respones/computed_data/${id}`, {
    method: "GET",
  });
};

// get total section and questions
// idk where to use this one
export const getSectionAndQuestionCount = async (id) => {
  return await apiFetch(`/api/survey/post/count_questions/${id}`, {
    method: "GET",
  });
};
