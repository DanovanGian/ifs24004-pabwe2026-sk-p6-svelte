import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.js";
import RegisterPage from "./RegisterPage.svelte";
import { register, authLoading } from "../states/authStore.js";
import { navigate } from "../../../router.js";
import {
  showSuccessDialog,
  showErrorDialog,
} from "../../../helpers/toolsHelper.js";

vi.mock("../states/authStore.js", async () => {
  const { writable } = await import("svelte/store");
  return { register: vi.fn(), authLoading: writable(false) };
});
vi.mock("../../../router.js", () => ({ navigate: vi.fn() }));
vi.mock("../../../helpers/toolsHelper.js", () => ({
  showSuccessDialog: vi.fn().mockResolvedValue(),
  showErrorDialog: vi.fn(),
}));

async function fillAndSubmit() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Nama"), "Gian");
  await user.type(screen.getByLabelText("Email"), "a@b.c");
  await user.type(screen.getByLabelText("Kata Sandi"), "123");
  await user.click(screen.getByRole("button", { name: "Daftar" }));
}

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authLoading.set(false);
  });

  it("register sukses menampilkan dialog lalu ke halaman login", async () => {
    register.mockResolvedValue({ status: "success" });
    renderWithProviders(RegisterPage);

    await fillAndSubmit();

    await waitFor(() =>
      expect(register).toHaveBeenCalledWith("Gian", "a@b.c", "123")
    );
    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/auth/login"));
    expect(showSuccessDialog).toHaveBeenCalled();
  });

  it("register gagal menampilkan dialog error", async () => {
    register.mockResolvedValue({ status: "fail", message: "Email dipakai" });
    renderWithProviders(RegisterPage);

    await fillAndSubmit();

    await waitFor(() =>
      expect(showErrorDialog).toHaveBeenCalledWith("Email dipakai")
    );
    expect(navigate).not.toHaveBeenCalled();
  });

  it("menampilkan teks memproses saat loading", () => {
    authLoading.set(true);
    renderWithProviders(RegisterPage);

    expect(screen.getByRole("button", { name: "Memproses..." })).toBeDisabled();
  });

  it("tombol Masuk mengarah ke halaman login", async () => {
    renderWithProviders(RegisterPage);

    await userEvent.setup().click(screen.getByRole("button", { name: "Masuk" }));

    expect(navigate).toHaveBeenCalledWith("/auth/login");
  });
});
