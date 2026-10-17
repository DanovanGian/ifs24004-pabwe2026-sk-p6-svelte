import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.js";
import HomePage from "./HomePage.svelte";
import {
  linkTrees,
  listLoading,
  fetchLinkTrees,
  removeLinkTree,
  removeAllLinkTrees,
} from "../states/linkTreesStore.js";
import { me, fetchMe } from "../../users/states/usersStore.js";
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
    linkTrees: writable([]),
    listLoading: writable(false),
    addLoading: writable(false),
    fetchLinkTrees: vi.fn(),
    removeLinkTree: vi.fn(),
    removeAllLinkTrees: vi.fn(),
    addLinkTree: vi.fn(),
  };
});
vi.mock("../../users/states/usersStore.js", async () => {
  const { writable } = await import("svelte/store");
  return { me: writable(null), fetchMe: vi.fn() };
});
vi.mock("../../../router.js", () => ({ navigate: vi.fn() }));
vi.mock("../../../helpers/toolsHelper.js", () => ({
  showSuccessDialog: vi.fn(),
  showErrorDialog: vi.fn(),
  showConfirmDialog: vi.fn(),
}));

const trees = [
  { id: 1, title: "Alpha", type: "public", user_id: 10, cover: "http://x/c.png" },
  { id: 2, title: "Beta", type: "private", user_id: 11, cover: null },
  { id: 3, title: "Gamma", type: "unlisted", user_id: 10, cover: null },
];

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    linkTrees.set([]);
    listLoading.set(false);
    me.set(null);
  });

  it("memuat data saat halaman dibuka", () => {
    renderWithProviders(HomePage);

    expect(fetchLinkTrees).toHaveBeenCalled();
    expect(fetchMe).toHaveBeenCalled();
  });

  it("menampilkan teks memuat saat loading", () => {
    listLoading.set(true);
    renderWithProviders(HomePage);

    expect(screen.getByText("Memuat link tree...")).toBeInTheDocument();
  });

  it("menampilkan pesan kosong bila tidak ada data", () => {
    renderWithProviders(HomePage);

    expect(screen.getByText("Tidak ada link tree.")).toBeInTheDocument();
  });

  it("menampilkan daftar, sampul, dan statistik", () => {
    linkTrees.set(trees);
    renderWithProviders(HomePage);

    expect(screen.getByRole("button", { name: "Alpha" })).toBeInTheDocument();
    expect(screen.getByAltText("Sampul Alpha")).toBeInTheDocument();
    expect(screen.queryByAltText("Sampul Beta")).not.toBeInTheDocument();
    expect(screen.getByTestId("stat-Total")).toHaveTextContent("3");
    expect(screen.getByTestId("stat-Public")).toHaveTextContent("1");
    expect(screen.getByTestId("stat-Unlisted")).toHaveTextContent("1");
    expect(screen.getByTestId("stat-Private")).toHaveTextContent("1");
  });

  it("pencarian menyaring berdasarkan judul", async () => {
    linkTrees.set(trees);
    renderWithProviders(HomePage);

    await userEvent.setup().type(screen.getByLabelText("Cari"), "bet");

    expect(screen.getByRole("button", { name: "Beta" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Alpha" })).not.toBeInTheDocument();
  });

  it("filter milik saya hanya menampilkan milik pengguna", async () => {
    linkTrees.set(trees);
    me.set({ id: 10 });
    renderWithProviders(HomePage);

    await userEvent.setup().click(screen.getByLabelText("Milik saya"));

    expect(screen.getByRole("button", { name: "Alpha" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Gamma" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Beta" })).not.toBeInTheDocument();
  });

  it("filter milik saya tanpa data pengguna menampilkan daftar kosong", async () => {
    linkTrees.set(trees);
    renderWithProviders(HomePage);

    await userEvent.setup().click(screen.getByLabelText("Milik saya"));

    expect(screen.getByText("Tidak ada link tree.")).toBeInTheDocument();
  });

  it("klik judul membuka halaman detail", async () => {
    linkTrees.set(trees);
    renderWithProviders(HomePage);

    await userEvent.setup().click(screen.getByRole("button", { name: "Alpha" }));

    expect(navigate).toHaveBeenCalledWith("/link-trees/1");
  });

  it("hapus dibatalkan tidak memanggil API", async () => {
    linkTrees.set(trees);
    showConfirmDialog.mockResolvedValue(false);
    renderWithProviders(HomePage);

    await userEvent.setup().click(screen.getByRole("button", { name: "Hapus Alpha" }));

    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
    expect(removeLinkTree).not.toHaveBeenCalled();
  });

  it("hapus sukses menampilkan dialog sukses", async () => {
    linkTrees.set(trees);
    showConfirmDialog.mockResolvedValue(true);
    removeLinkTree.mockResolvedValue({ status: "success" });
    renderWithProviders(HomePage);

    await userEvent.setup().click(screen.getByRole("button", { name: "Hapus Alpha" }));

    await waitFor(() => expect(removeLinkTree).toHaveBeenCalledWith(1));
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalled());
  });

  it("hapus gagal menampilkan dialog error", async () => {
    linkTrees.set(trees);
    showConfirmDialog.mockResolvedValue(true);
    removeLinkTree.mockResolvedValue({ status: "fail", message: "Gagal" });
    renderWithProviders(HomePage);

    await userEvent.setup().click(screen.getByRole("button", { name: "Hapus Alpha" }));

    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Gagal"));
  });

  it("hapus semua dibatalkan tidak memanggil API", async () => {
    showConfirmDialog.mockResolvedValue(false);
    renderWithProviders(HomePage);

    await userEvent.setup().click(screen.getByRole("button", { name: "Hapus Semua" }));

    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
    expect(removeAllLinkTrees).not.toHaveBeenCalled();
  });

  it("hapus semua sukses menampilkan dialog sukses", async () => {
    showConfirmDialog.mockResolvedValue(true);
    removeAllLinkTrees.mockResolvedValue({ status: "success" });
    renderWithProviders(HomePage);

    await userEvent.setup().click(screen.getByRole("button", { name: "Hapus Semua" }));

    await waitFor(() => expect(removeAllLinkTrees).toHaveBeenCalled());
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalled());
  });

  it("hapus semua gagal menampilkan dialog error", async () => {
    showConfirmDialog.mockResolvedValue(true);
    removeAllLinkTrees.mockResolvedValue({ status: "fail", message: "Gagal" });
    renderWithProviders(HomePage);

    await userEvent.setup().click(screen.getByRole("button", { name: "Hapus Semua" }));

    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Gagal"));
  });

  it("modal tambah bisa dibuka dan ditutup", async () => {
    const user = userEvent.setup();
    renderWithProviders(HomePage);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tambah Link Tree" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Batal" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
