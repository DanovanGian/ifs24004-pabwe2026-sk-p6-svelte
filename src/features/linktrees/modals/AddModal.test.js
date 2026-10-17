import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.js";
import AddModal from "./AddModal.svelte";
import { addLinkTree, addLoading } from "../states/linkTreesStore.js";
import {
  showSuccessDialog,
  showErrorDialog,
} from "../../../helpers/toolsHelper.js";

const { instances } = vi.hoisted(() => ({ instances: [] }));

vi.mock("@toast-ui/editor", () => ({
  default: class {
    constructor(options) {
      this.options = options;
      this.destroy = vi.fn();
      instances.push(this);
    }
    getMarkdown() {
      return "# isi";
    }
  },
}));
vi.mock("../states/linkTreesStore.js", async () => {
  const { writable } = await import("svelte/store");
  return { addLinkTree: vi.fn(), addLoading: writable(false) };
});
vi.mock("../../../helpers/toolsHelper.js", () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

async function fillAndSubmit() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Judul"), "Judul A");
  await user.selectOptions(screen.getByLabelText("Tipe"), "private");
  instances.at(-1).options.events.change();
  await user.click(screen.getByRole("button", { name: "Simpan" }));
}

describe("AddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    addLoading.set(false);
  });

  it("sukses: mengirim data, menampilkan dialog, dan menutup modal", async () => {
    addLinkTree.mockResolvedValue({ status: "success" });
    const onClose = vi.fn();
    renderWithProviders(AddModal, { onClose });

    await fillAndSubmit();

    await waitFor(() =>
      expect(addLinkTree).toHaveBeenCalledWith({
        title: "Judul A",
        type: "private",
        description: "# isi",
      })
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(showSuccessDialog).toHaveBeenCalled();
  });

  it("gagal: menampilkan dialog error dan tidak menutup modal", async () => {
    addLinkTree.mockResolvedValue({ status: "fail", message: "Ditolak" });
    const onClose = vi.fn();
    renderWithProviders(AddModal, { onClose });

    await fillAndSubmit();

    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Ditolak"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("tombol Batal menutup modal", async () => {
    const onClose = vi.fn();
    renderWithProviders(AddModal, { onClose });

    await userEvent.setup().click(screen.getByRole("button", { name: "Batal" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("menampilkan teks menyimpan saat loading", () => {
    addLoading.set(true);
    renderWithProviders(AddModal, { onClose: vi.fn() });

    expect(screen.getByRole("button", { name: "Menyimpan..." })).toBeDisabled();
  });
});
