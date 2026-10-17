<script>
  import { useInput } from "../../../hooks/useInput.js";
  import { addLinkTree, addLoading } from "../states/linkTreesStore.js";
  import MarkdownEditor from "../components/MarkdownEditor.svelte";
  import {
    showSuccessDialog,
    showErrorDialog,
  } from "../../../helpers/toolsHelper.js";

  let { onClose } = $props();

  const { value: title } = useInput("");
  const { value: type } = useInput("public");
  let description = $state("");

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await addLinkTree({
      title: $title,
      type: $type,
      description,
    });

    if (result.status === "success") {
      showSuccessDialog("Link tree berhasil ditambahkan.");
      onClose();
    } else {
      showErrorDialog(result.message);
    }
  }
</script>

<div
  role="dialog"
  aria-modal="true"
  aria-label="Tambah Link Tree"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
>
  <div class="w-full max-w-lg max-h-full overflow-y-auto bg-white rounded-2xl p-6">
    <h2 class="text-xl font-bold mb-4">Tambah Link Tree</h2>

    <form onsubmit={handleSubmit} class="space-y-4">
      <div>
        <label for="add-title" class="block text-sm font-medium mb-1">Judul</label>
        <input
          id="add-title"
          type="text"
          required
          bind:value={$title}
          class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label for="add-type" class="block text-sm font-medium mb-1">Tipe</label>
        <select
          id="add-type"
          bind:value={$type}
          class="w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="public">Public</option>
          <option value="unlisted">Unlisted</option>
          <option value="private">Private</option>
        </select>
      </div>

      <div>
        <span class="block text-sm font-medium mb-1">Deskripsi</span>
        <MarkdownEditor value={description} onchange={(v) => (description = v)} />
      </div>

      <div class="flex justify-end gap-2">
        <button
          type="button"
          onclick={onClose}
          class="rounded-lg border border-slate-300 px-4 py-2 font-semibold"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={$addLoading}
          class="rounded-lg bg-indigo-600 text-white font-semibold px-4 py-2 hover:bg-indigo-700 disabled:opacity-60"
        >
          {$addLoading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  </div>
</div>
