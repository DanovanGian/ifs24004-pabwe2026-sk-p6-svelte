import { apiRequest } from "../../../helpers/apiHelper.js";

export function getUsersRequest() {
  return apiRequest("/users");
}

export function getMeRequest() {
  return apiRequest("/users/me");
}

export function updateMeRequest(name, email) {
  return apiRequest("/users/me", {
    method: "PUT",
    body: { name, email },
  });
}

export function updatePhotoRequest(formData) {
  return apiRequest("/users/photo", {
    method: "POST",
    body: formData,
  });
}

export function changePasswordRequest(password, newPassword) {
  return apiRequest("/users/change-password", {
    method: "PUT",
    body: { password, new_password: newPassword },
  });
}
