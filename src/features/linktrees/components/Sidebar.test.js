import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { get } from "svelte/store";
import { renderWithProviders } from "../../../test-utils.js";
import Sidebar from "./Sidebar.svelte";
import { currentPath } from "../../../router.js";

describe("Sidebar", () => {
  beforeEach(() => currentPath.set("/"));

  it("menampilkan semua menu", () => {
    renderWithProviders(Sidebar, { open: false, onClose: vi.fn() });

    expect(screen.getByRole("button", { name: "Semua Link Tree" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pengguna" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Profil" })).toBeInTheDocument();
  });

  it("menandai menu beranda aktif di path /", () => {
    renderWithProviders(Sidebar, { open: false, onClose: vi.fn() });

    expect(screen.getByRole("button", { name: "Semua Link Tree" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Pengguna" })).not.toHaveAttribute("aria-current");
  });

  it("menu beranda tetap aktif di halaman detail", () => {
    currentPath.set("/link-trees/abc");
    renderWithProviders(Sidebar, { open: false, onClose: vi.fn() });

    expect(screen.getByRole("button", { name: "Semua Link Tree" })).toHaveAttribute("aria-current", "page");
  });

  it("menandai menu lain sesuai path", () => {
    currentPath.set("/users");
    renderWithProviders(Sidebar, { open: false, onClose: vi.fn() });

    expect(screen.getByRole("button", { name: "Pengguna" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Semua Link Tree" })).not.toHaveAttribute("aria-current");
  });

  it("klik menu berpindah halaman dan menutup sidebar", async () => {
    const onClose = vi.fn();
    renderWithProviders(Sidebar, { open: true, onClose });

    await userEvent.setup().click(screen.getByRole("button", { name: "Profil" }));

    expect(get(currentPath)).toBe("/profile");
    expect(onClose).toHaveBeenCalled();
  });

  it("overlay hanya muncul saat terbuka dan menutup sidebar", async () => {
    const onClose = vi.fn();
    const { rerender } = renderWithProviders(Sidebar, { open: false, onClose });
    expect(screen.queryByLabelText("Tutup menu")).not.toBeInTheDocument();

    await rerender({ open: true, onClose });
    await userEvent.setup().click(screen.getByLabelText("Tutup menu"));

    expect(onClose).toHaveBeenCalled();
  });
});
