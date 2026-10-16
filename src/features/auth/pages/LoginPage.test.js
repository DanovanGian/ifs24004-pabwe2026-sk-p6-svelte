import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.js";
import LoginPage from "./LoginPage.svelte";
import { login, authLoading } from "../states/authStore.js";
import { navigate } from "../../../router.js";
import { showErrorDialog } from "../../../helpers/toolsHelper.js";

vi.mock("../states/authStore.js", async () => {
  const { writable } = await import("svelte/store");
  return { login: vi.fn(), authLoading: writable(false) };
});
vi.mock("../../../router.js", () => ({ navigate: vi.fn() }));
vi.mock("../../../helpers/toolsHelper.js", () => ({
  showErrorDialog: vi.fn(),
}));

async function fillAndSubmit() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email"), "a@b.c");
  await user.type(screen.getByLabelText("Kata Sandi"), "123");
  await user.click(screen.getByRole("button", { name: "Masuk" }));
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authLoading.set(false);
  });

  it("login sukses mengarahkan ke beranda", async () => {
    login.mockResolvedValue({ status: "success" });
    renderWithProviders(LoginPage);

    await fillAndSubmit();

    await waitFor(() => expect(login).toHaveBeenCalledWith("a@b.c", "123"));
    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("login gagal menampilkan dialog error", async () => {
    login.mockResolvedValue({ status: "fail", message: "Salah" });
    renderWithProviders(LoginPage);

    await fillAndSubmit();

    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Salah"));
    expect(navigate).not.toHaveBeenCalled();
  });

  it("menampilkan teks memproses saat loading", () => {
    authLoading.set(true);
    renderWithProviders(LoginPage);

    expect(screen.getByRole("button", { name: "Memproses..." })).toBeDisabled();
  });

  it("tombol Daftar mengarah ke halaman register", async () => {
    renderWithProviders(LoginPage);

    await userEvent.setup().click(screen.getByRole("button", { name: "Daftar" }));

    expect(navigate).toHaveBeenCalledWith("/auth/register");
  });
});
