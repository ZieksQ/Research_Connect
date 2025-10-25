import { apiFetch } from "./fetcher";

// user post new profile picture
export const postProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append("profile_pic", file); // must match Flask key

  return apiFetch("/api/user/profile_upload", {
    method: "POST",
    body: formData,
  });
};

// user get user data
export const getUserData = async () =>
  apiFetch('/api/user/user_data', {
    method: "GET",
  });