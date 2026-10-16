import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  apiRequest,
} from "./apiHelper.js";

describe("apiHelper", () => {
  beforeEach(() => {
    localStorage.clear();
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ status: "success" }),
    });
  });

  it("menyimpan, membaca, dan menghapus token", () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it("GET tanpa body memakai header Authorization", async () => {
    putAccessToken("abc");
    const result = await apiRequest("/link-trees");

    expect(result).toEqual({ status: "success" });
    expect(fetch).toHaveBeenCalledWith(`${DELCOM_BASEURL}/link-trees`, {
      method: "GET",
      headers: { Authorization: "Bearer abc" },
      body: undefined,
    });
  });

  it("body objek dikirim sebagai JSON", async () => {
    await apiRequest("/auth/login", {
      method: "POST",
      body: { email: "a@b.c" },
      auth: false,
    });

    expect(fetch).toHaveBeenCalledWith(`${DELCOM_BASEURL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "a@b.c" }),
    });
  });

  it("FormData dikirim apa adanya tanpa Content-Type", async () => {
    putAccessToken("abc");
    const form = new FormData();
    form.append("cover", "x");
    await apiRequest("/link-trees/1/cover", { method: "POST", body: form });

    const options = fetch.mock.calls[0][1];
    expect(options.body).toBe(form);
    expect(options.headers["Content-Type"]).toBeUndefined();
  });
});