<script>
  import { onMount } from "svelte";
  import { ArrowLeft, Pencil, Trash2, Plus, ImagePlus } from "lucide-svelte";
  import {
    linkTree,
    detailLoading,
    fetchLinkTree,
    resetLinkTree,
    removeItem,
  } from "../states/linkTreesStore.js";
  import ChangeModal from "../modals/ChangeModal.svelte";
  import ChangeCoverModal from "../modals/ChangeCoverModal.svelte";
  import ItemModal from "../modals/ItemModal.svelte";
  import { navigate } from "../../../router.js";
  import {
    showSuccessDialog,
    showErrorDialog,
    showConfirmDialog,
  } from "../../../helpers/toolsHelper.js";

  let { params } = $props();

  let showChange = $state(false);
  let showCover = $state(false);
  let showItem = $state(false);
  let editingItem = $state(null);

  onMount(() => {
    fetchLinkTree(params.linkTreeId);
    return resetLinkTree;
  });

  function openAddItem() {
    editingItem = null;
    showItem = true;
  }

  function openEditItem(item) {
    editingItem = item;
    showItem = true;
  }

  async function handleDeleteItem(item) {
    if (await showConfirmDialog(`Hapus item "${item.title}"?`, "Hapus")) {
      const result = await removeItem(params.linkTreeId, item.id);
      if (result.status === "success") {
        showSuccessDialog("Item berhasil dihapus.");
      } else {
        showErrorDialog(result.message);
      }
    }
  }
</script>

<div class="max-w-3xl mx-auto space-y-6">
  <button
    type="button"
    onclick={() => navigate("/")}
    class="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
  >
    <ArrowLeft size={16} />
    Kembali
  </button>

  {#if $detailLoading}
    <p class="text-slate-500">Memuat detail...</p>
  {:else if !$linkTree}
    <p class="text-slate-500">Link tree tidak ditemukan.</p>
  {:else}
    <section class="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {#if $linkTree.cover}
        <img
          src={$linkTree.cover}
          alt={`Sampul ${$linkTree.title}`}
          class="h-48 w-full object-cover"
        />
      {:else}
        <div class="h-48 w-full bg-indigo-100"></div>
      {/if}

      <div class="p-6 space-y-3">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <h1 class="text-2xl font-extrabold">{`${$linkTree.title}`}</h1>
            <p class="text-xs uppercase text-slate-500 mt-1">{`${$linkTree.type}`}</p>
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              onclick={() => (showCover = true)}
              class="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"
            >
              <ImagePlus size={16} />
              Ubah Sampul
            </button>
            <button
              type="button"
              onclick={() => (showChange = true)}
              class="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"
            >
              <Pencil size={16} />
              Ubah Data
            </button>
          </div>
        </div>
        <p class="text-slate-600 whitespace-pre-wrap">{`${$linkTree.description}`}</p>
      </div>
    </section>

    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold">Tautan</h2>
        <button
          type="button"
          onclick={openAddItem}
          class="flex items-center gap-2 rounded-lg bg-indigo-600 text-white font-semibold px-4 py-2 hover:bg-indigo-700"
        >
          <Plus size={16} />
          Tambah Item
        </button>
      </div>

      {#if $linkTree.items.length === 0}
        <p class="text-slate-500">Belum ada item.</p>
      {:else}
        <ul class="space-y-2">
          {#each $linkTree.items as item (item.id)}
            <li
              class="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                class="min-w-0 truncate font-semibold text-indigo-600 hover:underline"
              >
                {`${item.title}`}
              </a>
              <div class="flex gap-1">
                <button
                  type="button"
                  aria-label={`Ubah ${item.title}`}
                  onclick={() => openEditItem(item)}
                  class="p-2 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  aria-label={`Hapus ${item.title}`}
                  onclick={() => handleDeleteItem(item)}
                  class="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    {#if showChange}
      <ChangeModal linkTree={$linkTree} onClose={() => (showChange = false)} />
    {/if}
    {#if showCover}
      <ChangeCoverModal
        linkTreeId={params.linkTreeId}
        onClose={() => (showCover = false)}
      />
    {/if}
    {#if showItem}
      <ItemModal
        linkTreeId={params.linkTreeId}
        item={editingItem}
        onClose={() => (showItem = false)}
      />
    {/if}
  {/if}
</div>
