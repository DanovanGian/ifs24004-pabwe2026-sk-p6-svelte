import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "../../../test-utils.js";
import MarkdownEditor from "./MarkdownEditor.svelte";

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

describe("MarkdownEditor", () => {
  it("membuat editor dengan nilai awal", () => {
    renderWithProviders(MarkdownEditor, { value: "awal", onchange: vi.fn() });

    const editor = instances.at(-1);
    expect(editor.options.initialValue).toBe("awal");
    expect(editor.options.el).toBeInstanceOf(HTMLElement);
  });

  it("meneruskan isi markdown ke onchange saat berubah", () => {
    const onchange = vi.fn();
    renderWithProviders(MarkdownEditor, { value: "", onchange });

    instances.at(-1).options.events.change();

    expect(onchange).toHaveBeenCalledWith("# isi");
  });

  it("menghancurkan editor saat komponen dilepas", () => {
    const { unmount } = renderWithProviders(MarkdownEditor, {
      value: "",
      onchange: vi.fn(),
    });
    const editor = instances.at(-1);

    unmount();

    expect(editor.destroy).toHaveBeenCalled();
  });
});
