import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { createRawSnippet } from "svelte";
import { renderWithProviders } from "../../../test-utils.js";
import LinkTreeLayout from "./LinkTreeLayout.svelte";

const children = createRawSnippet(() => ({
  render: () => "<p>isi halaman</p>",
}));

describe("LinkTreeLayout", () => {
  it("menampilkan navbar, sidebar, dan isi halaman", () => {
    renderWithProviders(LinkTreeLayout, { children });

    expect(screen.getByRole("button", { name: "Delcom Link Tree" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Semua Link Tree" })).toBeInTheDocument();
    expect(screen.getByText("isi halaman")).toBeInTheDocument();
  });

  it("tombol menu membuka sidebar dan overlay menutupnya", async () => {
    const user = userEvent.setup();
    renderWithProviders(LinkTreeLayout, { children });
    expect(screen.queryByLabelText("Tutup menu")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Buka menu" }));
    expect(screen.getByLabelText("Tutup menu")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Tutup menu"));
    expect(screen.queryByLabelText("Tutup menu")).not.toBeInTheDocument();
  });
});
