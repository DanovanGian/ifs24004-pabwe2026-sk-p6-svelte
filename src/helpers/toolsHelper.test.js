import { describe, it, expect, vi, beforeEach } from "vitest";
import Swal from "sweetalert2";
import {
  showSuccessDialog,
  showErrorDialog,
  showWarningDialog,
  showConfirmDialog,
  formatDate,
} from "./toolsHelper.js";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));

describe("toolsHelper", () => {
  beforeEach(() => {
    Swal.fire.mockReset();
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  it("dialog sukses, error, dan peringatan memakai ikon yang sesuai", async () => {
    await showSuccessDialog("ok");
    await showErrorDialog("gagal");
    await showWarningDialog("hati-hati");

    expect(Swal.fire.mock.calls[0][0]).toMatchObject({ icon: "success", text: "ok" });
    expect(Swal.fire.mock.calls[1][0]).toMatchObject({ icon: "error", text: "gagal" });
    expect(Swal.fire.mock.calls[2][0]).toMatchObject({ icon: "warning", text: "hati-hati" });
  });

  it("konfirmasi mengembalikan true saat disetujui", async () => {
    expect(await showConfirmDialog("Hapus?")).toBe(true);
    expect(Swal.fire.mock.calls[0][0].confirmButtonText).toBe("Ya");
  });

  it("konfirmasi mengembalikan false saat dibatalkan dan memakai teks kustom", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: false });
    expect(await showConfirmDialog("Hapus?", "Hapus")).toBe(false);
    expect(Swal.fire.mock.calls[0][0].confirmButtonText).toBe("Hapus");
  });

  it("formatDate memformat tanggal valid", () => {
    expect(formatDate("2026-10-16T00:00:00Z")).toMatch(/2026/);
  });

  it("formatDate mengembalikan '-' untuk nilai kosong atau tidak valid", () => {
    expect(formatDate("")).toBe("-");
    expect(formatDate(null)).toBe("-");
    expect(formatDate("bukan-tanggal")).toBe("-");
  });
});
