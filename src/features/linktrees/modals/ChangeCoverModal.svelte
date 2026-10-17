<script>
  import {
    changeCover,
    changeCoverLoading,
  } from "../states/linkTreesStore.js";
  import {
    showSuccessDialog,
    showErrorDialog,
  } from "../../../helpers/toolsHelper.js";

  let { linkTreeId, onClose } = $props();

  let file = $state(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("cover", file);

    const result = await changeCover(linkTreeId, formData);

    if (result.status === "success") {
      showSuccessDialog("Sampul berhasil diperbarui.");
      onClose();
    } else {
      showErrorDialog(result.message);
    }
  }
</script>

<div
  role="dialog"
  aria-modal="true"
  aria-label="Ubah Sampul"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
>
  <div class="w-full max-w-md bg-white rounded-2xl p-6">
    <h2 class="text-xl font-bold mb-4">Ubah Sampul</h2>

    <form onsubmit={handleSubmit} class="space-y-4">
      <div>
        <label for="cover-file" class="block text-sm font-medium mb-1">Berkas Sampul</label>
        <input
          id="cover-file"
          type="file"
          accept="image/*"
          onchange={(event) => (file = event.target.files[0])}
          class="text-sm"
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
          disabled={$changeCoverLoading || !file}
          class="rounded-lg bg-indigo-600 text-white font-semibold px-4 py-2 hover:bg-indigo-700 disabled:opacity-60"
        >
          {$changeCoverLoading ? "Mengunggah..." : "Simpan"}
        </button>
      </div>
    </form>
  </div>
</div>
