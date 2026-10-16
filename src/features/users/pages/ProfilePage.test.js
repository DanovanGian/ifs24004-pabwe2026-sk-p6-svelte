import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.js";
import ProfilePage from "./ProfilePage.svelte";
import {
  me,
  profileLoading,
  fetchMe,
  updateMe,
  updatePhoto,
  changePassword,
} from "../states/usersStore.js";
import {
  showSuccessDialog,
  showErrorDialog,
} from "../../../helpers/toolsHelper.js";

vi.mock("../states/usersStore.js", async () => {
  const { writable } = await import("svelte/store");
  return {
    me: writable(null),
    profileLoading: writable(false),
    fetchMe: vi.fn(),
    updateMe: vi.fn(),
    updatePhoto: vi.fn(),
    changePassword: vi.fn(),
  };
});
vi.mock("../../../helpers/toolsHelper.js", () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

const profile = { name: "Gian", email: "g@x.id", photo: null };

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchMe.mockResolvedValue({ status: "success" });
    me.set(null);
    profileLoading.set(false);
  });

  it("mengisi formulir dari data saya setelah dimuat", async () => {
    me.set(profile);
    renderWithProviders(ProfilePage);

    await waitFor(() => expect(screen.getByLabelText("Nama")).toHaveValue("Gian"));
    expect(screen.getByLabelText("Email")).toHaveValue("g@x.id");
    expect(fetchMe).toHaveBeenCalled();
  });

  it("membiarkan formulir kosong bila data saya belum ada", async () => {
    renderWithProviders(ProfilePage);

    await waitFor(() => expect(fetchMe).toHaveBeenCalled());
    expect(screen.getByLabelText("Nama")).toHaveValue("");
  });

  it("menampilkan foto bila tersedia", async () => {
    me.set({ ...profile, photo: "http://x/p.png" });
    renderWithProviders(ProfilePage);

    expect(await screen.findByAltText("Foto profil")).toBeInTheDocument();
  });

  it("simpan profil sukses menampilkan dialog sukses", async () => {
    me.set(profile);
    updateMe.mockResolvedValue({ status: "success" });
    renderWithProviders(ProfilePage);
    await waitFor(() => expect(screen.getByLabelText("Nama")).toHaveValue("Gian"));

    await userEvent.setup().click(screen.getByRole("button", { name: "Simpan Profil" }));

    await waitFor(() => expect(updateMe).toHaveBeenCalledWith("Gian", "g@x.id"));
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalled());
  });

  it("simpan profil gagal menampilkan dialog error", async () => {
    me.set(profile);
    updateMe.mockResolvedValue({ status: "fail", message: "Email dipakai" });
    renderWithProviders(ProfilePage);
    await waitFor(() => expect(screen.getByLabelText("Nama")).toHaveValue("Gian"));

    await userEvent.setup().click(screen.getByRole("button", { name: "Simpan Profil" }));

    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Email dipakai"));
  });

  it("unggah foto mengirim FormData berisi berkas", async () => {
    updatePhoto.mockResolvedValue({ status: "success" });
    renderWithProviders(ProfilePage);
    const file = new File(["x"], "a.png", { type: "image/png" });

    await userEvent.setup().upload(screen.getByLabelText("Ubah Foto"), file);

    await waitFor(() => expect(updatePhoto).toHaveBeenCalled());
    expect(updatePhoto.mock.calls[0][0].get("photo")).toBe(file);
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalled());
  });

  it("tidak mengunggah bila tidak ada berkas dipilih", async () => {
    renderWithProviders(ProfilePage);

    await fireEvent.change(screen.getByLabelText("Ubah Foto"), {
      target: { files: [] },
    });

    expect(updatePhoto).not.toHaveBeenCalled();
  });

  it("ubah kata sandi sukses mengosongkan isian", async () => {
    changePassword.mockResolvedValue({ status: "success" });
    renderWithProviders(ProfilePage);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Kata Sandi Saat Ini"), "lama");
    await user.type(screen.getByLabelText("Kata Sandi Baru"), "baru");
    await user.click(screen.getByRole("button", { name: "Ubah Kata Sandi" }));

    await waitFor(() => expect(changePassword).toHaveBeenCalledWith("lama", "baru"));
    await waitFor(() =>
      expect(screen.getByLabelText("Kata Sandi Saat Ini")).toHaveValue("")
    );
    expect(screen.getByLabelText("Kata Sandi Baru")).toHaveValue("");
    expect(showSuccessDialog).toHaveBeenCalled();
  });

  it("ubah kata sandi gagal menampilkan dialog error", async () => {
    changePassword.mockResolvedValue({ status: "fail", message: "Salah" });
    renderWithProviders(ProfilePage);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Kata Sandi Saat Ini"), "x");
    await user.type(screen.getByLabelText("Kata Sandi Baru"), "y");
    await user.click(screen.getByRole("button", { name: "Ubah Kata Sandi" }));

    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Salah"));
    expect(screen.getByLabelText("Kata Sandi Saat Ini")).toHaveValue("x");
  });
});
