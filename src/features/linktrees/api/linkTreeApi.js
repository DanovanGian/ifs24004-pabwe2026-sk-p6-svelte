import { apiRequest } from "../../../helpers/apiHelper.js";

export function getLinkTreesRequest() {
  return apiRequest("/link-trees");
}

export function getLinkTreeRequest(id) {
  return apiRequest(`/link-trees/${id}`);
}

export function createLinkTreeRequest({ title, type, description }) {
  return apiRequest("/link-trees", {
    method: "POST",
    body: { title, type, description },
  });
}

export function updateLinkTreeRequest(id, { title, type, description }) {
  return apiRequest(`/link-trees/${id}`, {
    method: "PUT",
    body: { title, type, description },
  });
}

export function updateCoverRequest(id, formData) {
  return apiRequest(`/link-trees/${id}/cover`, {
    method: "POST",
    body: formData,
  });
}

export function deleteLinkTreeRequest(id) {
  return apiRequest(`/link-trees/${id}`, { method: "DELETE" });
}

export function deleteAllLinkTreesRequest() {
  return apiRequest("/link-trees", { method: "DELETE" });
}

export function createItemRequest(id, { title, url }) {
  return apiRequest(`/link-trees/${id}/items`, {
    method: "POST",
    body: { title, url },
  });
}

export function updateItemRequest(id, itemId, { title, url }) {
  return apiRequest(`/link-trees/${id}/items/${itemId}`, {
    method: "PUT",
    body: { title, url },
  });
}

export function deleteItemRequest(id, itemId) {
  return apiRequest(`/link-trees/${id}/items/${itemId}`, {
    method: "DELETE",
  });
}
