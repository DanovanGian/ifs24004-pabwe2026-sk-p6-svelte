import { writable } from "svelte/store";
import {
  getLinkTreesRequest,
  getLinkTreeRequest,
  createLinkTreeRequest,
  updateLinkTreeRequest,
  updateCoverRequest,
  deleteLinkTreeRequest,
  deleteAllLinkTreesRequest,
  createItemRequest,
  updateItemRequest,
  deleteItemRequest,
} from "../api/linkTreeApi.js";

export const linkTrees = writable([]);
export const linkTree = writable(null);

export const listLoading = writable(false);
export const detailLoading = writable(false);
export const addLoading = writable(false);
export const changeLoading = writable(false);
export const changeCoverLoading = writable(false);
export const deleteLoading = writable(false);
export const deleteAllLoading = writable(false);
export const itemLoading = writable(false);

export async function fetchLinkTrees() {
  listLoading.set(true);
  try {
    const result = await getLinkTreesRequest();
    if (result.status === "success") {
      linkTrees.set(result.data.link_trees);
    }
    return result;
  } finally {
    listLoading.set(false);
  }
}

export async function fetchLinkTree(id) {
  detailLoading.set(true);
  try {
    const result = await getLinkTreeRequest(id);
    if (result.status === "success") {
      linkTree.set(result.data.link_tree);
    }
    return result;
  } finally {
    detailLoading.set(false);
  }
}

export function resetLinkTree() {
  linkTree.set(null);
}

async function mutate(flag, request, refetch) {
  flag.set(true);
  try {
    const result = await request();
    if (result.status === "success") {
      await refetch();
    }
    return result;
  } finally {
    flag.set(false);
  }
}

export function addLinkTree(data) {
  return mutate(addLoading, () => createLinkTreeRequest(data), fetchLinkTrees);
}

export function changeLinkTree(id, data) {
  return mutate(
    changeLoading,
    () => updateLinkTreeRequest(id, data),
    () => fetchLinkTree(id)
  );
}

export function changeCover(id, formData) {
  return mutate(
    changeCoverLoading,
    () => updateCoverRequest(id, formData),
    () => fetchLinkTree(id)
  );
}

export function removeLinkTree(id) {
  return mutate(deleteLoading, () => deleteLinkTreeRequest(id), fetchLinkTrees);
}

export function removeAllLinkTrees() {
  return mutate(deleteAllLoading, deleteAllLinkTreesRequest, fetchLinkTrees);
}

export function addItem(id, data) {
  return mutate(
    itemLoading,
    () => createItemRequest(id, data),
    () => fetchLinkTree(id)
  );
}

export function changeItem(id, itemId, data) {
  return mutate(
    itemLoading,
    () => updateItemRequest(id, itemId, data),
    () => fetchLinkTree(id)
  );
}

export function removeItem(id, itemId) {
  return mutate(
    itemLoading,
    () => deleteItemRequest(id, itemId),
    () => fetchLinkTree(id)
  );
}
