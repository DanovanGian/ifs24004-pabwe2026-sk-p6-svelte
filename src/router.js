import { writable } from "svelte/store";

export const currentPath = writable(window.location.pathname);

export function navigate(path, { replace = false } = {}) {
  if (replace) {
    window.history.replaceState({}, "", path);
  } else {
    window.history.pushState({}, "", path);
  }
  currentPath.set(path);
}

window.addEventListener("popstate", () => {
  currentPath.set(window.location.pathname);
});

const routes = [
  { path: "/auth/login", layout: "auth", page: "login" },
  { path: "/auth/register", layout: "auth", page: "register" },
  { path: "/", layout: "app", page: "home" },
  { path: "/link-trees/:linkTreeId", layout: "app", page: "detail" },
  { path: "/users", layout: "app", page: "users" },
  { path: "/profile", layout: "app", page: "profile" },
];

function matchPath(pattern, path) {
  const patternParts = pattern.split("/");
  const pathParts = path.split("/");

  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

export function resolveRoute(path) {
  const clean = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

  for (const route of routes) {
    const params = matchPath(route.path, clean);
    if (params) {
      return { layout: route.layout, page: route.page, params };
    }
  }

  return { layout: null, page: "notfound", params: {} };
}
