<script>
  import { useInput } from "../../../hooks/useInput.js";
  import { addItem, changeItem, itemLoading } from "../states/linkTreesStore.js";
  import {
    showSuccessDialog,
    showErrorDialog,
  } from "../../../helpers/toolsHelper.js";

  let { linkTreeId, item, onClose } = $props();

  const { value: title } = useInput(item ? item.title : "");
  const { value: url } = useInput(item ? item.url : "");
  const heading = item ? "Ubah Item" : "Tambah Item";

  async function handleSubmit(event) {
    event.preventDefault();
    const data = { title: $title, url: $url };
    const result = item
      ? await changeItem(linkTreeId, item.id, data)
      : await addItem(linkTreeId, data);

    if (result.status === "success") {
      showSuccessDialog("Item berhasil disimpan.");
      onClose();
    } else {
      showErrorDialog(result.message);
    }
  }
</script>

<div
  role="dialog"
  aria-modal="true"
  aria-label={heading}
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
>
  <div class="w-full max-w-md bg-white rounded-2xl p-6">
    <h2 class="text-xl font-bold mb-4">{heading}</h2>

    <form onsubmit={handleSubmit} class="space-y-4">
      <div>
        <label for="item-title" class="block text-sm font-medium mb-1">Judul</label>
        <input
          id="item-title"
          type="text"
          required
          bind:value={$title}
          class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label for="item-url" class="block text-sm font-medium mb-1">URL</label>
        <input
          id="item-url"
          type="url"
          required
          bind:value={$url}
          class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
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
          disabled={$itemLoading}
          class="rounded-lg bg-indigo-600 text-white font-semibold px-4 py-2 hover:bg-indigo-700 disabled:opacity-60"
        >
          {$itemLoading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  </div>
</div>
