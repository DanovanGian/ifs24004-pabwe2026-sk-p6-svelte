import { writable, derived } from "svelte/store";
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
} from "../../../helpers/apiHelper.js";
import { loginRequest, registerRequest } from "../api/authApi.js";

export const authToken = writable(getAccessToken());
export const isAuthenticated = derived(authToken, ($token) => !!$token);
export const authLoading = writable(false);

export async function login(email, password) {
  authLoading.set(true);
  try {
    const result = await loginRequest(email, password);
    if (result.status === "success") {
      putAccessToken(result.data.token);
      authToken.set(result.data.token);
    }
    return result;
  } finally {
    authLoading.set(false);
  }
}

export async function register(name, email, password) {
  authLoading.set(true);
  try {
    return await registerRequest(name, email, password);
  } finally {
    authLoading.set(false);
  }
}

export function logout() {
  removeAccessToken();
  authToken.set(null);
}