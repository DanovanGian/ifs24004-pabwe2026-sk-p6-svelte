import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test-utils.js";
import NotFoundPage from "./NotFoundPage.svelte";
import { navigate } from "../../../router.js";

vi.mock("../../../router.js", () => ({ navigate: vi.fn() }));

describe("NotFoundPage", () => {
  it("menampilkan pesan 404", () => {
    renderWithProviders(NotFoundPage);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Halaman tidak ditemukan")).toBeInTheDocument();
  });

  it("tombol kembali mengarah ke beranda", async () => {
    renderWithProviders(NotFoundPage);

    await userEvent
      .setup()
      .click(screen.getByRole("button", { name: "Kembali ke Beranda" }));

    expect(navigate).toHaveBeenCalledWith("/");
  });
});
