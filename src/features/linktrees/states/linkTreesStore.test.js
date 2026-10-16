import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";
import * as store from "./linkTreesStore.js";
import * as api from "../api/linkTreeApi.js";

vi.mock("../api/linkTreeApi.js", () => ({
  getLinkTreesRequest: vi.fn(),
  getLinkTreeRequest: vi.fn(),
  createLinkTreeRequest: vi.fn(),
  updateLinkTreeRequest: vi.fn(),
  updateCoverRequest: vi.fn(),
  deleteLinkTreeRequest: vi.fn(),
  deleteAllLinkTreesRequest: vi.fn(),
  createItemRequest: vi.fn(),
  updateItemRequest: vi.fn(),
  deleteItemRequest: vi.fn(),
}));

const data = { title: "T", type: "public", description: "D" };
const item = { title: "I", url: "http://i.id" };
const form = new FormData();
const ok = { status: "success", data: { link_trees: [], link_tree: {} } };

describe("linkTreesStore: pengambilan data", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    store.linkTrees.set([]);
    store.linkTree.set(null);
  });

  it("fetchLinkTrees sukses mengisi daftar", async () => {
    api.getLinkTreesRequest.mockResolvedValue({
      status: "success",
      data: { link_trees: [{ id: 1 }] },
    });

    await store.fetchLinkTrees();

    expect(get(store.linkTrees)).toEqual([{ id: 1 }]);
    expect(get(store.listLoading)).toBe(false);
  });

  it("fetchLinkTrees gagal tidak mengubah daftar", async () => {
    api.getLinkTreesRequest.mockResolvedValue({ status: "fail" });

    const result = await store.fetchLinkTrees();

    expect(result.status).toBe("fail");
    expect(get(store.linkTrees)).toEqual([]);
    expect(get(store.listLoading)).toBe(false);
  });

  it("fetchLinkTree sukses mengisi detail", async () => {
    api.getLinkTreeRequest.mockResolvedValue({
      status: "success",
      data: { link_tree: { id: 1, items: [] } },
    });

    await store.fetchLinkTree(1);

    expect(api.getLinkTreeRequest).toHaveBeenCalledWith(1);
    expect(get(store.linkTree)).toEqual({ id: 1, items: [] });
    expect(get(store.detailLoading)).toBe(false);
  });

  it("fetchLinkTree gagal tidak mengubah detail", async () => {
    api.getLinkTreeRequest.mockResolvedValue({ status: "fail" });

    await store.fetchLinkTree(1);

    expect(get(store.linkTree)).toBeNull();
    expect(get(store.detailLoading)).toBe(false);
  });

  it("resetLinkTree mengosongkan detail", () => {
    store.linkTree.set({ id: 1 });
    store.resetLinkTree();
    expect(get(store.linkTree)).toBeNull();
  });
});

// [nama, pemanggil, request API, argumen request, refetch, bendera]
const mutations = [
  ["addLinkTree", () => store.addLinkTree(data), api.createLinkTreeRequest, [data], api.getLinkTreesRequest, store.addLoading],
  ["changeLinkTree", () => store.changeLinkTree(1, data), api.updateLinkTreeRequest, [1, data], api.getLinkTreeRequest, store.changeLoading],
  ["changeCover", () => store.changeCover(1, form), api.updateCoverRequest, [1, form], api.getLinkTreeRequest, store.changeCoverLoading],
  ["removeLinkTree", () => store.removeLinkTree(1), api.deleteLinkTreeRequest, [1], api.getLinkTreesRequest, store.deleteLoading],
  ["removeAllLinkTrees", () => store.removeAllLinkTrees(), api.deleteAllLinkTreesRequest, [], api.getLinkTreesRequest, store.deleteAllLoading],
  ["addItem", () => store.addItem(1, item), api.createItemRequest, [1, item], api.getLinkTreeRequest, store.itemLoading],
  ["changeItem", () => store.changeItem(1, 3, item), api.updateItemRequest, [1, 3, item], api.getLinkTreeRequest, store.itemLoading],
  ["removeItem", () => store.removeItem(1, 3), api.deleteItemRequest, [1, 3], api.getLinkTreeRequest, store.itemLoading],
];

describe("linkTreesStore: mutasi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getLinkTreesRequest.mockResolvedValue(ok);
    api.getLinkTreeRequest.mockResolvedValue(ok);
  });

  it.each(mutations)("%s sukses memanggil API lalu memuat ulang", async (_n, run, request, args, refetch, flag) => {
    request.mockResolvedValue({ status: "success" });

    const result = await run();

    expect(result.status).toBe("success");
    expect(request).toHaveBeenCalledWith(...args);
    expect(refetch).toHaveBeenCalled();
    expect(get(flag)).toBe(false);
  });

  it.each(mutations)("%s gagal tidak memuat ulang", async (_n, run, request, _args, refetch, flag) => {
    request.mockResolvedValue({ status: "fail", message: "x" });

    const result = await run();

    expect(result.status).toBe("fail");
    expect(refetch).not.toHaveBeenCalled();
    expect(get(flag)).toBe(false);
  });

  it("bendera menyala selama request berjalan", async () => {
    let resolveFn;
    api.createLinkTreeRequest.mockReturnValue(new Promise((r) => (resolveFn = r)));

    const pending = store.addLinkTree(data);
    expect(get(store.addLoading)).toBe(true);

    resolveFn({ status: "fail" });
    await pending;
    expect(get(store.addLoading)).toBe(false);
  });
});
