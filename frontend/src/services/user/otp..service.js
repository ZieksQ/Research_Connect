import { apiFetch } from "../fetcher.js";

export const sendOTP = async (email) => 
    await apiFetch("/api/otp/send_otp", {
        method: "POST",
        body: JSON.stringify(email),
    });

export const inputOTP = async (otp) =>
    await apiFetch("/api/otp/input_otp", {
        method: "POST",
        body: JSON.stringify(otp),
    }) 