import { apiFetch } from "../fetcher.js";

// send otp to given email
export const sendOTP = async (email) =>
  await apiFetch("/api/otp/send_otp", {
    method: "POST",
    body: JSON.stringify(email),
  });

// inputOTP for change password to verify email
export const inputOTP = async (otp) =>
  await apiFetch("/api/otp/input_otp", {
    method: "POST",
    body: JSON.stringify(otp),
  });

// add email
export const addEmail = async (otp) =>
  await apiFetch("/api/otp/enter_email", {
    method: "PATCH",
    body: JSON.stringify(otp),
  });

// change password
export const changePassword = async (password) =>
  await apiFetch("/api/otp/reset_pssw", {
    method: "PATCH",
    body: JSON.stringify(password),
  });
