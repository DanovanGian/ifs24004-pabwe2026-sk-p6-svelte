import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/svelte";
import { get } from "svelte/store";
import { renderWithProviders } from "./test-utils.js";
import App from "./App.svelte";
import { currentPath } from "./router.js";
import { isAuthenticated } from "./features/auth/states/authStore.js";
import { fetchLinkTree } from "./features/linktrees/states/linkTreesStore.js";

vi.mock("@toast-ui/editor", () => ({
  default: class {
    destroy() {}
    getMarkdown() {
      return "";
    }
  },
}));

vi.mock("./features/auth/states/authStore.js", async () => {
  const { writable } = await import("svelte/store");
  return {
    isAuthenticated: writable(false),
    authLoading: writable(false),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  };
});

vi.mock("./features/linktrees/states/linkTreesStore.js", async () => {
  const { writable } = await import("svelte/store");
  return {
    linkTrees: writable([]),
    linkTree: writable(null),
    listLoading: writable(false),
    detailLoading: writable(false),
    addLoading: writable(false),
    changeLoading: writable(false),
    changeCoverLoading: writable(false),
    itemLoading: writable(false),
    fetchLinkTrees: vi.fn(),
    fetchLinkTree: vi.fn(),
    resetLinkTree: vi.fn(),
    removeLinkTree: vi.fn(),
    removeAllLinkTrees: vi.fn(),
    removeItem: vi.fn(),
    addLinkTree: vi.fn(),
    changeLinkTree: vi.fn(),
    changeCover: vi.fn(),
    addItem: vi.fn(),
    changeItem: vi.fn(),
  };
});

vi.mock("./features/users/states/usersStore.js", async () => {
  const { writable } = await import("svelte/store");
  return {
    me: writable(null),
    users: writable([]),
    usersLoading: writable(false),
    profileLoading: writable(false),
    fetchMe: vi.fn(),
    fetchUsers: vi.fn(),
    updateMe: vi.fn(),
    updatePhoto: vi.fn(),
    changePassword: vi.fn(),
  };
});

function visit(path, authenticated) {
  window.history.replaceState({}, "", path);
  currentPath.set(path);
  isAuthenticated.set(authenticated);
  return renderWithProviders(App);
}

describe("App", () => {
  beforeEach(() => vi.clearAllMocks());

  it("belum masuk di /auth/login: layout auth dan halaman login", () => {
    visit("/auth/login", false);

    expect(screen.getByText("Kumpulkan semua tautan pentingmu dalam satu tempat.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Masuk" })).toBeInTheDocument();
  });

  it("belum masuk di /auth/register: halaman register", () => {
    visit("/auth/register", false);

    expect(screen.getByRole("heading", { name: "Daftar" })).toBeInTheDocument();
  });

  it("belum masuk di halaman aplikasi: dialihkan ke login", async () => {
    visit("/", false);

    expect(await screen.findByRole("heading", { name: "Masuk" })).toBeInTheDocument();
    expect(get(currentPath)).toBe("/auth/login");
  });

  it("sudah masuk di /auth/login: dialihkan ke beranda", async () => {
    visit("/auth/login", true);

    expect(await screen.findByRole("heading", { name: "Semua Link Tree" })).toBeInTheDocument();
    expect(get(currentPath)).toBe("/");
  });

  it("sudah masuk di /: layout aplikasi dan halaman beranda", () => {
    visit("/", true);

    expect(screen.getByRole("button", { name: "Keluar" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Semua Link Tree" })).toBeInTheDocument();
  });

  it("sudah masuk di /link-trees/:id: halaman detail menerima parameter", () => {
    visit("/link-trees/5", true);

    expect(fetchLinkTree).toHaveBeenCalledWith("5");
    expect(screen.getByText("Link tree tidak ditemukan.")).toBeInTheDocument();
  });

  it("sudah masuk di /users: halaman pengguna", () => {
    visit("/users", true);

    expect(screen.getByRole("heading", { name: "Pengguna" })).toBeInTheDocument();
  });

  it("sudah masuk di /profile: halaman profil", () => {
    visit("/profile", true);

    expect(screen.getByRole("heading", { name: "Profil" })).toBeInTheDocument();
  });

  it("path tidak dikenal menampilkan 404 tanpa layout", () => {
    visit("/ngawur", false);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Keluar" })).not.toBeInTheDocument();
  });
});
