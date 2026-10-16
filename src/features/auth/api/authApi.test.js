import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginRequest, registerRequest } from "./authApi.js";
import { apiRequest } from "../../../helpers/apiHelper.js";

vi.mock("../../../helpers/apiHelper.js", () => ({ apiRequest: vi.fn() }));

describe("authApi", () => {
  beforeEach(() => apiRequest.mockReset());

  it("loginRequest memanggil POST /auth/login tanpa token", () => {
    loginRequest("a@b.c", "123");
    expect(apiRequest).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      body: { email: "a@b.c", password: "123" },
      auth: false,
    });
  });

  it("registerRequest memanggil POST /auth/register tanpa token", () => {
    registerRequest("Gian", "a@b.c", "123");
    expect(apiRequest).toHaveBeenCalledWith("/auth/register", {
      method: "POST",
      body: { name: "Gian", email: "a@b.c", password: "123" },
      auth: false,
    });
  });
});