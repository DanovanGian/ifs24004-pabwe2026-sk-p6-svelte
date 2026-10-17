import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.js";
import ItemModal from "./ItemModal.svelte";
import { addItem, changeItem, itemLoading } from "../states/linkTreesStore.js";
import {
  showSuccessDialog,
  showErrorDialog,
} from "../../../helpers/toolsHelper.js";

vi.mock("../states/linkTreesStore.js", async () => {
  const { writable } = await import("svelte/store");
  return {
    addItem: vi.fn(),
    changeItem: vi.fn(),
    itemLoading: writable(false),
  };
});
vi.mock("../../../helpers/toolsHelper.js", () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

const item = { id: 3, title: "Lama", url: "http://lama.id" };

async function fillAndSubmit() {
  const user = userEvent.setup();
  const title = screen.getByLabelText("Judul");
  const url = screen.getByLabelText("URL");
  await user.clear(title);
  await user.type(title, "Baru");
  await user.clear(url);
  await user.type(url, "http://baru.id");
  await user.click(screen.getByRole("button", { name: "Simpan" }));
}

describe("ItemModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    itemLoading.set(false);
  });

  it("mode tambah: judul kosong dan memanggil addItem", async () => {
    addItem.mockResolvedValue({ status: "success" });
    const onClose = vi.fn();
    renderWithProviders(ItemModal, { linkTreeId: 5, item: null, onClose });

    expect(screen.getByRole("dialog", { name: "Tambah Item" })).toBeInTheDocument();
    expect(screen.getByLabelText("Judul")).toHaveValue("");

    await fillAndSubmit();

    await waitFor(() =>
      expect(addItem).toHaveBeenCalledWith(5, { title: "Baru", url: "http://baru.id" })
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(showSuccessDialog).toHaveBeenCalled();
    expect(changeItem).not.toHaveBeenCalled();
  });

  it("mode ubah: nilai awal terisi dan memanggil changeItem", async () => {
    changeItem.mockResolvedValue({ status: "success" });
    const onClose = vi.fn();
    renderWithProviders(ItemModal, { linkTreeId: 5, item, onClose });

    expect(screen.getByRole("dialog", { name: "Ubah Item" })).toBeInTheDocument();
    expect(screen.getByLabelText("Judul")).toHaveValue("Lama");
    expect(screen.getByLabelText("URL")).toHaveValue("http://lama.id");

    await fillAndSubmit();

    await waitFor(() =>
      expect(changeItem).toHaveBeenCalledWith(5, 3, {
        title: "Baru",
        url: "http://baru.id",
      })
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(addItem).not.toHaveBeenCalled();
  });

  it("gagal: menampilkan dialog error dan tidak menutup modal", async () => {
    addItem.mockResolvedValue({ status: "fail", message: "URL salah" });
    const onClose = vi.fn();
    renderWithProviders(ItemModal, { linkTreeId: 5, item: null, onClose });

    await fillAndSubmit();

    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("URL salah"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("tombol Batal menutup modal", async () => {
    const onClose = vi.fn();
    renderWithProviders(ItemModal, { linkTreeId: 5, item: null, onClose });

    await userEvent.setup().click(screen.getByRole("button", { name: "Batal" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("menampilkan teks menyimpan saat loading", () => {
    itemLoading.set(true);
    renderWithProviders(ItemModal, { linkTreeId: 5, item: null, onClose: vi.fn() });

    expect(screen.getByRole("button", { name: "Menyimpan..." })).toBeDisabled();
  });
});
