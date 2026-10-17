import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.js";
import ChangeCoverModal from "./ChangeCoverModal.svelte";
import {
  changeCover,
  changeCoverLoading,
} from "../states/linkTreesStore.js";
import {
  showSuccessDialog,
  showErrorDialog,
} from "../../../helpers/toolsHelper.js";

vi.mock("../states/linkTreesStore.js", async () => {
  const { writable } = await import("svelte/store");
  return { changeCover: vi.fn(), changeCoverLoading: writable(false) };
});
vi.mock("../../../helpers/toolsHelper.js", () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

const file = new File(["x"], "c.png", { type: "image/png" });

async function pickAndSubmit() {
  const user = userEvent.setup();
  await user.upload(screen.getByLabelText("Berkas Sampul"), file);
  await user.click(screen.getByRole("button", { name: "Simpan" }));
}

describe("ChangeCoverModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    changeCoverLoading.set(false);
  });

  it("tombol simpan nonaktif sebelum berkas dipilih", () => {
    renderWithProviders(ChangeCoverModal, { linkTreeId: 5, onClose: vi.fn() });

    expect(screen.getByRole("button", { name: "Simpan" })).toBeDisabled();
  });

  it("sukses: mengirim FormData berisi cover dan menutup modal", async () => {
    changeCover.mockResolvedValue({ status: "success" });
    const onClose = vi.fn();
    renderWithProviders(ChangeCoverModal, { linkTreeId: 5, onClose });

    await pickAndSubmit();

    await waitFor(() => expect(changeCover).toHaveBeenCalled());
    const [id, formData] = changeCover.mock.calls[0];
    expect(id).toBe(5);
    expect(formData.get("cover")).toBe(file);
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(showSuccessDialog).toHaveBeenCalled();
  });

  it("gagal: menampilkan dialog error dan tidak menutup modal", async () => {
    changeCover.mockResolvedValue({ status: "fail", message: "Terlalu besar" });
    const onClose = vi.fn();
    renderWithProviders(ChangeCoverModal, { linkTreeId: 5, onClose });

    await pickAndSubmit();

    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Terlalu besar"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("tombol Batal menutup modal", async () => {
    const onClose = vi.fn();
    renderWithProviders(ChangeCoverModal, { linkTreeId: 5, onClose });

    await userEvent.setup().click(screen.getByRole("button", { name: "Batal" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("menampilkan teks mengunggah saat loading", () => {
    changeCoverLoading.set(true);
    renderWithProviders(ChangeCoverModal, { linkTreeId: 5, onClose: vi.fn() });

    expect(screen.getByRole("button", { name: "Mengunggah..." })).toBeDisabled();
  });
});
