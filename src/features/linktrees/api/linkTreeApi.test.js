import { describe, it, expect, vi, beforeEach } from "vitest";
import * as api from "./linkTreeApi.js";
import { apiRequest } from "../../../helpers/apiHelper.js";

vi.mock("../../../helpers/apiHelper.js", () => ({ apiRequest: vi.fn() }));

const data = { title: "T", type: "public", description: "D" };
const item = { title: "I", url: "http://i.id" };
const form = new FormData();

describe("linkTreeApi", () => {
  beforeEach(() => apiRequest.mockReset());

  it("GET daftar dan detail", () => {
    api.getLinkTreesRequest();
    expect(apiRequest).toHaveBeenLastCalledWith("/link-trees");

    api.getLinkTreeRequest(7);
    expect(apiRequest).toHaveBeenLastCalledWith("/link-trees/7");
  });

  it("POST dan PUT link tree mengirim title, type, description", () => {
    api.createLinkTreeRequest(data);
    expect(apiRequest).toHaveBeenLastCalledWith("/link-trees", {
      method: "POST",
      body: data,
    });

    api.updateLinkTreeRequest(7, data);
    expect(apiRequest).toHaveBeenLastCalledWith("/link-trees/7", {
      method: "PUT",
      body: data,
    });
  });

  it("POST cover mengirim FormData", () => {
    api.updateCoverRequest(7, form);
    expect(apiRequest).toHaveBeenLastCalledWith("/link-trees/7/cover", {
      method: "POST",
      body: form,
    });
  });

  it("DELETE satu dan semua link tree", () => {
    api.deleteLinkTreeRequest(7);
    expect(apiRequest).toHaveBeenLastCalledWith("/link-trees/7", {
      method: "DELETE",
    });

    api.deleteAllLinkTreesRequest();
    expect(apiRequest).toHaveBeenLastCalledWith("/link-trees", {
      method: "DELETE",
    });
  });

  it("item: POST, PUT, DELETE", () => {
    api.createItemRequest(7, item);
    expect(apiRequest).toHaveBeenLastCalledWith("/link-trees/7/items", {
      method: "POST",
      body: item,
    });

    api.updateItemRequest(7, 3, item);
    expect(apiRequest).toHaveBeenLastCalledWith("/link-trees/7/items/3", {
      method: "PUT",
      body: item,
    });

    api.deleteItemRequest(7, 3);
    expect(apiRequest).toHaveBeenLastCalledWith("/link-trees/7/items/3", {
      method: "DELETE",
    });
  });
});
