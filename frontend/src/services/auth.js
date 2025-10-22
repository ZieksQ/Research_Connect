import { apiFetch } from "./fetcher";

export const loginUser = async(data) => 
    apiFetch('/user/login', {
        method: "POST",
        body: JSON.stringify(data),
    })

export const registerUser = async(data) =>
    apiFetch('/user/register', {
        method: "POST",
        body: JSON.stringify(data),
    })

export const logoutUser = async() => 
    apiFetch('user/logout', {method: "POST"})