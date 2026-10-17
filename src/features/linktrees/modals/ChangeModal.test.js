import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.js";
import ChangeModal from "./ChangeModal.svelte";
import { changeLinkTree, changeLoading } from "../states/linkTreesStore.js";
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
      return "# baru";
    }
  },
}));
vi.mock("../states/linkTreesStore.js", async () => {
  const { writable } = await import("svelte/store");
  return { changeLinkTree: vi.fn(), changeLoading: writable(false) };
});
vi.mock("../../../helpers/toolsHelper.js", () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
}));

const linkTree = { id: 5, title: "Lama", type: "unlisted", description: "Desk" };

async function editAndSubmit() {
  const user = userEvent.setup();
  const title = screen.getByLabelText("Judul");
  await user.clear(title);
  await user.type(title, "Baru");
  await user.selectOptions(screen.getByLabelText("Tipe"), "private");
  instances.at(-1).options.events.change();
  await user.click(screen.getByRole("button", { name: "Simpan" }));
}

describe("ChangeModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    changeLoading.set(false);
  });

  it("menampilkan nilai awal dari link tree", () => {
    renderWithProviders(ChangeModal, { linkTree, onClose: vi.fn() });

    expect(screen.getByLabelText("Judul")).toHaveValue("Lama");
    expect(screen.getByLabelText("Tipe")).toHaveValue("unlisted");
    expect(instances.at(-1).options.initialValue).toBe("Desk");
  });

  it("sukses: mengirim data, menampilkan dialog, dan menutup modal", async () => {
    changeLinkTree.mockResolvedValue({ status: "success" });
    const onClose = vi.fn();
    renderWithProviders(ChangeModal, { linkTree, onClose });

    await editAndSubmit();

    await waitFor(() =>
      expect(changeLinkTree).toHaveBeenCalledWith(5, {
        title: "Baru",
        type: "private",
        description: "# baru",
      })
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(showSuccessDialog).toHaveBeenCalled();
  });

  it("gagal: menampilkan dialog error dan tidak menutup modal", async () => {
    changeLinkTree.mockResolvedValue({ status: "fail", message: "Ditolak" });
    const onClose = vi.fn();
    renderWithProviders(ChangeModal, { linkTree, onClose });

    await editAndSubmit();

    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Ditolak"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("tombol Batal menutup modal", async () => {
    const onClose = vi.fn();
    renderWithProviders(ChangeModal, { linkTree, onClose });

    await userEvent.setup().click(screen.getByRole("button", { name: "Batal" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("menampilkan teks menyimpan saat loading", () => {
    changeLoading.set(true);
    renderWithProviders(ChangeModal, { linkTree, onClose: vi.fn() });

    expect(screen.getByRole("button", { name: "Menyimpan..." })).toBeDisabled();
  });
});
