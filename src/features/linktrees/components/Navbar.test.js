import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.js";
import Navbar from "./Navbar.svelte";
import { logout } from "../../auth/states/authStore.js";
import { navigate } from "../../../router.js";
import { showConfirmDialog } from "../../../helpers/toolsHelper.js";

vi.mock("../../auth/states/authStore.js", () => ({ logout: vi.fn() }));
vi.mock("../../../router.js", () => ({ navigate: vi.fn() }));
vi.mock("../../../helpers/toolsHelper.js", () => ({
  showConfirmDialog: vi.fn(),
}));

describe("Navbar", () => {
  beforeEach(() => vi.clearAllMocks());

  it("klik nama aplikasi mengarah ke beranda", async () => {
    renderWithProviders(Navbar, { onToggleSidebar: vi.fn() });

    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Delcom Link Tree" }));

    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("tombol menu memanggil onToggleSidebar", async () => {
    const onToggleSidebar = vi.fn();
    renderWithProviders(Navbar, { onToggleSidebar });

    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Buka menu" }));

    expect(onToggleSidebar).toHaveBeenCalled();
  });

  it("keluar dikonfirmasi lalu menghapus sesi dan ke halaman login", async () => {
    showConfirmDialog.mockResolvedValue(true);
    renderWithProviders(Navbar, { onToggleSidebar: vi.fn() });

    await userEvent.setup().click(screen.getByRole("button", { name: "Keluar" }));

    await waitFor(() => expect(logout).toHaveBeenCalled());
    expect(navigate).toHaveBeenCalledWith("/auth/login");
  });

  it("keluar dibatalkan tidak menghapus sesi", async () => {
    showConfirmDialog.mockResolvedValue(false);
    renderWithProviders(Navbar, { onToggleSidebar: vi.fn() });

    await userEvent.setup().click(screen.getByRole("button", { name: "Keluar" }));

    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
    expect(logout).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});
