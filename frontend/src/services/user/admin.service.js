import { apiFetch } from "../fetcher";

// get pending posts
export const getPendingPosts = async () => 
    await apiFetch("/api/admin/post/get/not_approved", {
        method: "GET",
    })

// manually approve post
export const approvePost = async (id) =>
    await apiFetch("/api/admin/approve_post", {
        method: "PATCH",
        body: JSON.stringify(id),
    })

// generate approval code for posts
export const generateApprovalCode = async () =>
    await apiFetch("/api/admin/generate/post_code", {
        method: "GET",
    })

