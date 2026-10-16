import { apiRequest } from "../../../helpers/apiHelper.js";

export function loginRequest(email, password) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

export function registerRequest(name, email, password) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: { name, email, password },
    auth: false,
  });
}