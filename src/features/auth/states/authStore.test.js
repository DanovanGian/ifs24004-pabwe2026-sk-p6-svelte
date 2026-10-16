import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";
import {
  authToken,
  isAuthenticated,
  authLoading,
  login,
  register,
  logout,
} from "./authStore.js";
import { loginRequest, registerRequest } from "../api/authApi.js";
import { getAccessToken } from "../../../helpers/apiHelper.js";

vi.mock("../api/authApi.js", () => ({
  loginRequest: vi.fn(),
  registerRequest: vi.fn(),
}));

describe("authStore", () => {
  beforeEach(() => {
    localStorage.clear();
    authToken.set(null);
    loginRequest.mockReset();
    registerRequest.mockReset();
  });

  it("login sukses menyimpan token", async () => {
    loginRequest.mockResolvedValue({ status: "success", data: { token: "t1" } });

    const result = await login("a@b.c", "123");

    expect(result.status).toBe("success");
    expect(getAccessToken()).toBe("t1");
    expect(get(authToken)).toBe("t1");
    expect(get(isAuthenticated)).toBe(true);
    expect(get(authLoading)).toBe(false);
  });

  it("login gagal tidak menyimpan token", async () => {
    loginRequest.mockResolvedValue({ status: "fail", message: "salah" });

    const result = await login("a@b.c", "x");

    expect(result.message).toBe("salah");
    expect(getAccessToken()).toBeNull();
    expect(get(isAuthenticated)).toBe(false);
    expect(get(authLoading)).toBe(false);
  });

  it("authLoading bernilai true selama login berjalan", async () => {
    let resolveFn;
    loginRequest.mockReturnValue(new Promise((r) => (resolveFn = r)));

    const pending = login("a@b.c", "123");
    expect(get(authLoading)).toBe(true);

    resolveFn({ status: "fail" });
    await pending;
    expect(get(authLoading)).toBe(false);
  });

  it("register meneruskan hasil API dan mematikan loading", async () => {
    registerRequest.mockResolvedValue({ status: "success" });

    const result = await register("Gian", "a@b.c", "123");

    expect(registerRequest).toHaveBeenCalledWith("Gian", "a@b.c", "123");
    expect(result.status).toBe("success");
    expect(get(authLoading)).toBe(false);
  });

  it("logout menghapus token", () => {
    localStorage.setItem("access_token", "t1");
    authToken.set("t1");

    logout();

    expect(getAccessToken()).toBeNull();
    expect(get(authToken)).toBeNull();
  });
});