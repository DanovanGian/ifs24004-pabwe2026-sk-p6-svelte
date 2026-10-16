import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getUsersRequest,
  getMeRequest,
  updateMeRequest,
  updatePhotoRequest,
  changePasswordRequest,
} from "./userApi.js";
import { apiRequest } from "../../../helpers/apiHelper.js";

vi.mock("../../../helpers/apiHelper.js", () => ({ apiRequest: vi.fn() }));

describe("userApi", () => {
  beforeEach(() => apiRequest.mockReset());

  it("getUsersRequest memanggil GET /users", () => {
    getUsersRequest();
    expect(apiRequest).toHaveBeenCalledWith("/users");
  });

  it("getMeRequest memanggil GET /users/me", () => {
    getMeRequest();
    expect(apiRequest).toHaveBeenCalledWith("/users/me");
  });

  it("updateMeRequest memanggil PUT /users/me", () => {
    updateMeRequest("Gian", "g@x.id");
    expect(apiRequest).toHaveBeenCalledWith("/users/me", {
      method: "PUT",
      body: { name: "Gian", email: "g@x.id" },
    });
  });

  it("updatePhotoRequest mengirim FormData lewat POST /users/photo", () => {
    const form = new FormData();
    updatePhotoRequest(form);
    expect(apiRequest).toHaveBeenCalledWith("/users/photo", {
      method: "POST",
      body: form,
    });
  });

  it("changePasswordRequest memakai kunci new_password", () => {
    changePasswordRequest("lama", "baru");
    expect(apiRequest).toHaveBeenCalledWith("/users/change-password", {
      method: "PUT",
      body: { password: "lama", new_password: "baru" },
    });
  });
});
