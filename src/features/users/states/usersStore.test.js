import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";
import {
  users,
  me,
  usersLoading,
  profileLoading,
  fetchUsers,
  fetchMe,
  updateMe,
  updatePhoto,
  changePassword,
} from "./usersStore.js";
import {
  getUsersRequest,
  getMeRequest,
  updateMeRequest,
  updatePhotoRequest,
  changePasswordRequest,
} from "../api/userApi.js";

vi.mock("../api/userApi.js", () => ({
  getUsersRequest: vi.fn(),
  getMeRequest: vi.fn(),
  updateMeRequest: vi.fn(),
  updatePhotoRequest: vi.fn(),
  changePasswordRequest: vi.fn(),
}));

describe("usersStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    users.set([]);
    me.set(null);
  });

  it("fetchUsers sukses mengisi daftar pengguna", async () => {
    getUsersRequest.mockResolvedValue({
      status: "success",
      data: { users: [{ id: 1, name: "Gian" }] },
    });

    await fetchUsers();

    expect(get(users)).toEqual([{ id: 1, name: "Gian" }]);
    expect(get(usersLoading)).toBe(false);
  });

  it("fetchUsers gagal tidak mengubah daftar", async () => {
    getUsersRequest.mockResolvedValue({ status: "fail" });

    const result = await fetchUsers();

    expect(result.status).toBe("fail");
    expect(get(users)).toEqual([]);
    expect(get(usersLoading)).toBe(false);
  });

  it("fetchMe sukses mengisi data saya", async () => {
    getMeRequest.mockResolvedValue({
      status: "success",
      data: { user: { name: "Gian" } },
    });

    await fetchMe();

    expect(get(me)).toEqual({ name: "Gian" });
  });

  it("fetchMe gagal tidak mengubah data saya", async () => {
    getMeRequest.mockResolvedValue({ status: "fail" });

    await fetchMe();

    expect(get(me)).toBeNull();
  });

  it("updateMe sukses memuat ulang data saya", async () => {
    updateMeRequest.mockResolvedValue({ status: "success" });
    getMeRequest.mockResolvedValue({
      status: "success",
      data: { user: { name: "Baru" } },
    });

    const result = await updateMe("Baru", "b@x.id");

    expect(updateMeRequest).toHaveBeenCalledWith("Baru", "b@x.id");
    expect(result.status).toBe("success");
    expect(get(me)).toEqual({ name: "Baru" });
    expect(get(profileLoading)).toBe(false);
  });

  it("updateMe gagal tidak memuat ulang", async () => {
    updateMeRequest.mockResolvedValue({ status: "fail" });

    await updateMe("Baru", "b@x.id");

    expect(getMeRequest).not.toHaveBeenCalled();
    expect(get(profileLoading)).toBe(false);
  });

  it("updatePhoto sukses memuat ulang data saya", async () => {
    const form = new FormData();
    updatePhotoRequest.mockResolvedValue({ status: "success" });
    getMeRequest.mockResolvedValue({
      status: "success",
      data: { user: { photo: "p.png" } },
    });

    await updatePhoto(form);

    expect(updatePhotoRequest).toHaveBeenCalledWith(form);
    expect(get(me)).toEqual({ photo: "p.png" });
  });

  it("changePassword meneruskan hasil dan mematikan loading", async () => {
    changePasswordRequest.mockResolvedValue({ status: "success" });

    const result = await changePassword("lama", "baru");

    expect(changePasswordRequest).toHaveBeenCalledWith("lama", "baru");
    expect(result.status).toBe("success");
    expect(get(profileLoading)).toBe(false);
  });
});
