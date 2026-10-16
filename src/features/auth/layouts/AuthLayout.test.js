import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { renderWithProviders } from "../../../test-utils.js";
import AuthLayout from "./AuthLayout.svelte";

describe("AuthLayout", () => {
  it("menampilkan judul, deskripsi, dan isi halaman", () => {
    const children = createRawSnippet(() => ({
      render: () => "<p>isi halaman</p>",
    }));

    renderWithProviders(AuthLayout, { children });

    expect(screen.getByText("Delcom Link Tree")).toBeInTheDocument();
    expect(screen.getByText(/Kumpulkan semua tautan/)).toBeInTheDocument();
    expect(screen.getByText("isi halaman")).toBeInTheDocument();
  });
});
