import { describe, it, expect, beforeEach } from "vitest";
import { get } from "svelte/store";
import { currentPath, navigate, resolveRoute } from "./router.js";

describe("navigate", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
    currentPath.set("/");
  });

  it("menambah riwayat dan memperbarui currentPath", () => {
    const before = window.history.length;

    navigate("/users");

    expect(window.location.pathname).toBe("/users");
    expect(get(currentPath)).toBe("/users");
    expect(window.history.length).toBe(before + 1);
  });

  it("replace tidak menambah riwayat", () => {
    const before = window.history.length;

    navigate("/profile", { replace: true });

    expect(window.location.pathname).toBe("/profile");
    expect(get(currentPath)).toBe("/profile");
    expect(window.history.length).toBe(before);
  });

  it("popstate memperbarui currentPath dari alamat browser", () => {
    window.history.replaceState({}, "", "/users");

    window.dispatchEvent(new PopStateEvent("popstate"));

    expect(get(currentPath)).toBe("/users");
  });
});

describe("resolveRoute", () => {
  it.each([
    ["/auth/login", "auth", "login"],
    ["/auth/register", "auth", "register"],
    ["/", "app", "home"],
    ["/users", "app", "users"],
    ["/profile", "app", "profile"],
  ])("%s -> layout %s, halaman %s", (path, layout, page) => {
    expect(resolveRoute(path)).toEqual({ layout, page, params: {} });
  });

  it("mengambil parameter linkTreeId dari rute detail", () => {
    expect(resolveRoute("/link-trees/abc-123")).toEqual({
      layout: "app",
      page: "detail",
      params: { linkTreeId: "abc-123" },
    });
  });

  it("mengabaikan garis miring di akhir path", () => {
    expect(resolveRoute("/users/").page).toBe("users");
  });

  it.each(["/tidak-ada", "/a/b/c", "/link-trees"])(
    "%s menampilkan halaman 404",
    (path) => {
      expect(resolveRoute(path)).toEqual({
        layout: null,
        page: "notfound",
        params: {},
      });
    }
  );
});
