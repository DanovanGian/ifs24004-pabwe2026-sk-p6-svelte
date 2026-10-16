import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/svelte";
import { renderWithProviders } from "../../../test-utils.js";
import UsersPage from "./UsersPage.svelte";
import { users, usersLoading, fetchUsers } from "../states/usersStore.js";

vi.mock("../states/usersStore.js", async () => {
  const { writable } = await import("svelte/store");
  return {
    users: writable([]),
    usersLoading: writable(false),
    fetchUsers: vi.fn(),
  };
});

describe("UsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    users.set([]);
    usersLoading.set(false);
  });

  it("memuat pengguna saat halaman dibuka", () => {
    renderWithProviders(UsersPage);
    expect(fetchUsers).toHaveBeenCalled();
  });

  it("menampilkan teks memuat saat loading", () => {
    usersLoading.set(true);
    renderWithProviders(UsersPage);
    expect(screen.getByText("Memuat pengguna...")).toBeInTheDocument();
  });

  it("menampilkan pesan kosong bila tidak ada pengguna", () => {
    renderWithProviders(UsersPage);
    expect(screen.getByText("Belum ada pengguna.")).toBeInTheDocument();
  });

  it("menampilkan pengguna dengan foto dan tanpa foto", () => {
    users.set([
      { id: 1, name: "Budi", email: "budi@x.id", photo: "http://x/b.png" },
      { id: 2, name: "gian", email: "gian@x.id", photo: null },
    ]);
    renderWithProviders(UsersPage);

    expect(screen.getByAltText("Budi")).toBeInTheDocument();
    expect(screen.getByText("budi@x.id")).toBeInTheDocument();
    expect(screen.getByText("G")).toBeInTheDocument();
    expect(screen.getByText("gian@x.id")).toBeInTheDocument();
  });
});
