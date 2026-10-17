<script>
  import { useInput } from "../../../hooks/useInput.js";
  import { changeLinkTree, changeLoading } from "../states/linkTreesStore.js";
  import MarkdownEditor from "../components/MarkdownEditor.svelte";
  import {
    showSuccessDialog,
    showErrorDialog,
  } from "../../../helpers/toolsHelper.js";

  let { linkTree, onClose } = $props();

  const { value: title } = useInput(linkTree.title);
  const { value: type } = useInput(linkTree.type);
  let description = $state(linkTree.description);

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await changeLinkTree(linkTree.id, {
      title: $title,
      type: $type,
      description,
    });

    if (result.status === "success") {
      showSuccessDialog("Link tree berhasil diperbarui.");
      onClose();
    } else {
      showErrorDialog(result.message);
    }
  }
</script>

<div
  role="dialog"
  aria-modal="true"
  aria-label="Ubah Link Tree"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
>
  <div class="w-full max-w-lg max-h-full overflow-y-auto bg-white rounded-2xl p-6">
    <h2 class="text-xl font-bold mb-4">Ubah Link Tree</h2>

    <form onsubmit={handleSubmit} class="space-y-4">
      <div>
        <label for="change-title" class="block text-sm font-medium mb-1">Judul</label>
        <input
          id="change-title"
          type="text"
          required
          bind:value={$title}
          class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label for="change-type" class="block text-sm font-medium mb-1">Tipe</label>
        <select
          id="change-type"
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
          disabled={$changeLoading}
          class="rounded-lg bg-indigo-600 text-white font-semibold px-4 py-2 hover:bg-indigo-700 disabled:opacity-60"
        >
          {$changeLoading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  </div>
</div>
