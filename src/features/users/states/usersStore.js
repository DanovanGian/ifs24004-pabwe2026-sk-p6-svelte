import { writable } from "svelte/store";
import {
  getUsersRequest,
  getMeRequest,
  updateMeRequest,
  updatePhotoRequest,
  changePasswordRequest,
} from "../api/userApi.js";

export const users = writable([]);
export const me = writable(null);
export const usersLoading = writable(false);
export const profileLoading = writable(false);

export async function fetchUsers() {
  usersLoading.set(true);
  try {
    const result = await getUsersRequest();
    if (result.status === "success") {
      users.set(result.data.users);
    }
    return result;
  } finally {
    usersLoading.set(false);
  }
}

export async function fetchMe() {
  const result = await getMeRequest();
  if (result.status === "success") {
    me.set(result.data.user);
  }
  return result;
}

async function mutateProfile(request) {
  profileLoading.set(true);
  try {
    const result = await request();
    if (result.status === "success") {
      await fetchMe();
    }
    return result;
  } finally {
    profileLoading.set(false);
  }
}

export function updateMe(name, email) {
  return mutateProfile(() => updateMeRequest(name, email));
}

export function updatePhoto(formData) {
  return mutateProfile(() => updatePhotoRequest(formData));
}

export async function changePassword(password, newPassword) {
  profileLoading.set(true);
  try {
    return await changePasswordRequest(password, newPassword);
  } finally {
    profileLoading.set(false);
  }
}
