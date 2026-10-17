import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.js";
import DetailPage from "./DetailPage.svelte";
import {
  linkTree,
  detailLoading,
  fetchLinkTree,
  resetLinkTree,
  removeItem,
} from "../states/linkTreesStore.js";
import { navigate } from "../../../router.js";
import {
  showSuccessDialog,
  showErrorDialog,
  showConfirmDialog,
} from "../../../helpers/toolsHelper.js";

vi.mock("@toast-ui/editor", () => ({
  default: class {
    destroy() {}
    getMarkdown() {
      return "";
    }
  },
}));
vi.mock("../states/linkTreesStore.js", async () => {
  const { writable } = await import("svelte/store");
  return {
    linkTree: writable(null),
    detailLoading: writable(false),
    changeLoading: writable(false),
    changeCoverLoading: writable(false),
    itemLoading: writable(false),
    fetchLinkTree: vi.fn(),
    resetLinkTree: vi.fn(),
    removeItem: vi.fn(),
    changeLinkTree: vi.fn(),
    changeCover: vi.fn(),
    addItem: vi.fn(),
    changeItem: vi.fn(),
  };
});
vi.mock("../../../router.js", () => ({ navigate: vi.fn() }));
vi.mock("../../../helpers/toolsHelper.js", () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
  showConfirmDialog: vi.fn(),
}));

const detail = {
  id: 5,
  title: "Alpha",
  type: "public",
  description: "Deskripsi",
  cover: "http://x/c.png",
  items: [
    { id: 1, title: "GitHub", url: "http://github.com" },
    { id: 2, title: "Blog", url: "http://blog.id" },
  ],
};

const params = { linkTreeId: "5" };

describe("DetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    linkTree.set(null);
    detailLoading.set(false);
  });

  it("memuat detail saat dibuka dan mereset saat ditutup", () => {
    const { unmount } = renderWithProviders(DetailPage, { params });

    expect(fetchLinkTree).toHaveBeenCalledWith("5");
    unmount();
    expect(resetLinkTree).toHaveBeenCalled();
  });

  it("menampilkan teks memuat saat loading", () => {
    detailLoading.set(true);
    renderWithProviders(DetailPage, { params });

    expect(screen.getByText("Memuat detail...")).toBeInTheDocument();
  });

  it("menampilkan pesan bila link tree tidak ditemukan", () => {
    renderWithProviders(DetailPage, { params });

    expect(screen.getByText("Link tree tidak ditemukan.")).toBeInTheDocument();
  });

  it("menampilkan detail, sampul, dan daftar item", () => {
    linkTree.set(detail);
    renderWithProviders(DetailPage, { params });

    expect(screen.getByRole("heading", { name: "Alpha" })).toBeInTheDocument();
    expect(screen.getByText("Deskripsi")).toBeInTheDocument();
    expect(screen.getByAltText("Sampul Alpha")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "http://github.com");
    expect(screen.getByRole("link", { name: "Blog" })).toBeInTheDocument();
  });

  it("tanpa sampul dan tanpa item menampilkan pesan kosong", () => {
    linkTree.set({ ...detail, cover: null, items: [] });
    renderWithProviders(DetailPage, { params });

    expect(screen.queryByAltText("Sampul Alpha")).not.toBeInTheDocument();
    expect(screen.getByText("Belum ada item.")).toBeInTheDocument();
  });

  it("tombol kembali mengarah ke beranda", async () => {
    renderWithProviders(DetailPage, { params });

    await userEvent.setup().click(screen.getByRole("button", { name: "Kembali" }));

    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("modal ubah data bisa dibuka dan ditutup", async () => {
    linkTree.set(detail);
    const user = userEvent.setup();
    renderWithProviders(DetailPage, { params });

    await user.click(screen.getByRole("button", { name: "Ubah Data" }));
    expect(screen.getByRole("dialog", { name: "Ubah Link Tree" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Batal" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("modal ubah sampul bisa dibuka dan ditutup", async () => {
    linkTree.set(detail);
    const user = userEvent.setup();
    renderWithProviders(DetailPage, { params });

    await user.click(screen.getByRole("button", { name: "Ubah Sampul" }));
    expect(screen.getByRole("dialog", { name: "Ubah Sampul" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Batal" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("modal tambah item terbuka dalam mode tambah", async () => {
    linkTree.set(detail);
    const user = userEvent.setup();
    renderWithProviders(DetailPage, { params });

    await user.click(screen.getByRole("button", { name: "Tambah Item" }));
    expect(screen.getByRole("dialog", { name: "Tambah Item" })).toBeInTheDocument();
    expect(screen.getByLabelText("Judul")).toHaveValue("");

    await user.click(screen.getByRole("button", { name: "Batal" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("tombol ubah item membuka modal dengan data item", async () => {
    linkTree.set(detail);
    renderWithProviders(DetailPage, { params });

    await userEvent.setup().click(screen.getByRole("button", { name: "Ubah GitHub" }));

    expect(screen.getByRole("dialog", { name: "Ubah Item" })).toBeInTheDocument();
    expect(screen.getByLabelText("Judul")).toHaveValue("GitHub");
  });

  it("hapus item dibatalkan tidak memanggil API", async () => {
    linkTree.set(detail);
    showConfirmDialog.mockResolvedValue(false);
    renderWithProviders(DetailPage, { params });

    await userEvent.setup().click(screen.getByRole("button", { name: "Hapus GitHub" }));

    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
    expect(removeItem).not.toHaveBeenCalled();
  });

  it("hapus item sukses menampilkan dialog sukses", async () => {
    linkTree.set(detail);
    showConfirmDialog.mockResolvedValue(true);
    removeItem.mockResolvedValue({ status: "success" });
    renderWithProviders(DetailPage, { params });

    await userEvent.setup().click(screen.getByRole("button", { name: "Hapus GitHub" }));

    await waitFor(() => expect(removeItem).toHaveBeenCalledWith("5", 1));
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalled());
  });

  it("hapus item gagal menampilkan dialog error", async () => {
    linkTree.set(detail);
    showConfirmDialog.mockResolvedValue(true);
    removeItem.mockResolvedValue({ status: "fail", message: "Gagal" });
    renderWithProviders(DetailPage, { params });

    await userEvent.setup().click(screen.getByRole("button", { name: "Hapus GitHub" }));

    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Gagal"));
  });
});

describe("DetailPage: penutupan modal lewat submit sukses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    detailLoading.set(false);
    linkTree.set(detail);
  });

  it("modal item menutup setelah simpan sukses", async () => {
    const { addItem } = await import("../states/linkTreesStore.js");
    addItem.mockResolvedValue({ status: "success" });
    const user = userEvent.setup();
    renderWithProviders(DetailPage, { params });

    await user.click(screen.getByRole("button", { name: "Tambah Item" }));
    await user.type(screen.getByLabelText("Judul"), "Baru");
    await user.type(screen.getByLabelText("URL"), "http://baru.id");
    await user.click(screen.getByRole("button", { name: "Simpan" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });

  it("modal sampul menutup setelah simpan sukses", async () => {
    const { changeCover } = await import("../states/linkTreesStore.js");
    changeCover.mockResolvedValue({ status: "success" });
    const user = userEvent.setup();
    renderWithProviders(DetailPage, { params });

    await user.click(screen.getByRole("button", { name: "Ubah Sampul" }));
    await user.upload(
      screen.getByLabelText("Berkas Sampul"),
      new File(["x"], "c.png", { type: "image/png" })
    );
    await user.click(screen.getByRole("button", { name: "Simpan" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });

  it("modal ubah data menutup setelah simpan sukses", async () => {
    const { changeLinkTree } = await import("../states/linkTreesStore.js");
    changeLinkTree.mockResolvedValue({ status: "success" });
    const user = userEvent.setup();
    renderWithProviders(DetailPage, { params });

    await user.click(screen.getByRole("button", { name: "Ubah Data" }));
    await user.click(screen.getByRole("button", { name: "Simpan" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });
});
