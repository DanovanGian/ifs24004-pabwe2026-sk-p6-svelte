<script>
  import { onMount } from "svelte";
  import { Plus, Trash2, Search } from "lucide-svelte";
  import {
    linkTrees,
    listLoading,
    fetchLinkTrees,
    removeLinkTree,
    removeAllLinkTrees,
  } from "../states/linkTreesStore.js";
  import { me, fetchMe } from "../../users/states/usersStore.js";
  import AddModal from "../modals/AddModal.svelte";
  import { navigate } from "../../../router.js";
  import {
    showSuccessDialog,
    showErrorDialog,
    showConfirmDialog,
  } from "../../../helpers/toolsHelper.js";

  let search = $state("");
  let onlyMine = $state(false);
  let showAdd = $state(false);

  onMount(() => {
    fetchLinkTrees();
    fetchMe();
  });

  const filtered = $derived(
    $linkTrees.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) &&
        (!onlyMine || item.user_id === $me?.id)
    )
  );

  const stats = $derived([
    { label: "Total", value: $linkTrees.length },
    { label: "Public", value: $linkTrees.filter((i) => i.type === "public").length },
    { label: "Unlisted", value: $linkTrees.filter((i) => i.type === "unlisted").length },
    { label: "Private", value: $linkTrees.filter((i) => i.type === "private").length },
  ]);

  function report(result, successMessage) {
    if (result.status === "success") {
      showSuccessDialog(successMessage);
    } else {
      showErrorDialog(result.message);
    }
  }

  async function handleDelete(item) {
    if (await showConfirmDialog(`Hapus link tree "${item.title}"?`, "Hapus")) {
      report(await removeLinkTree(item.id), "Link tree berhasil dihapus.");
    }
  }

  async function handleDeleteAll() {
    if (await showConfirmDialog("Hapus SEMUA link tree?", "Hapus Semua")) {
      report(await removeAllLinkTrees(), "Semua link tree berhasil dihapus.");
    }
  }
</script>

<div class="max-w-5xl mx-auto space-y-6">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <h1 class="text-2xl font-extrabold">Semua Link Tree</h1>
    <div class="flex gap-2">
      <button
        type="button"
        onclick={handleDeleteAll}
        class="rounded-lg border border-red-300 text-red-600 font-semibold px-4 py-2 hover:bg-red-50"
      >
        Hapus Semua
      </button>
      <button
        type="button"
        onclick={() => (showAdd = true)}
        class="flex items-center gap-2 rounded-lg bg-indigo-600 text-white font-semibold px-4 py-2 hover:bg-indigo-700"
      >
        <Plus size={16} />
        Tambah Link Tree
      </button>
    </div>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    {#each stats as stat (stat.label)}
      <div
        data-testid={`stat-${stat.label}`}
        class="bg-white border border-slate-200 rounded-xl p-4"
      >
        <p class="text-sm text-slate-500">{`${stat.label}`}</p>
        <p class="text-2xl font-extrabold">{`${stat.value}`}</p>
      </div>
    {/each}
  </div>

  <div class="flex flex-wrap items-center gap-4">
    <div class="relative flex-1 min-w-48">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Search size={16} />
      </span>
      <input
        type="search"
        aria-label="Cari"
        placeholder="Cari link tree..."
        bind:value={search}
        class="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2"
      />
    </div>
    <label class="flex items-center gap-2 text-sm font-medium">
      <input type="checkbox" bind:checked={onlyMine} />
      Milik saya
    </label>
  </div>

  {#if $listLoading}
    <p class="text-slate-500">Memuat link tree...</p>
  {:else if filtered.length === 0}
    <p class="text-slate-500">Tidak ada link tree.</p>
  {:else}
    <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each filtered as item (item.id)}
        <li class="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {#if item.cover}
            <img src={item.cover} alt={`Sampul ${item.title}`} class="h-32 w-full object-cover" />
          {:else}
            <div class="h-32 w-full bg-indigo-100"></div>
          {/if}
          <div class="p-4 flex items-start justify-between gap-2">
            <div class="min-w-0">
              <button
                type="button"
                onclick={() => navigate(`/link-trees/${item.id}`)}
                class="font-bold text-left truncate hover:text-indigo-600"
              >
                {`${item.title}`}
              </button>
              <p class="text-xs uppercase text-slate-500 mt-1">{`${item.type}`}</p>
            </div>
            <button
              type="button"
              aria-label={`Hapus ${item.title}`}
              onclick={() => handleDelete(item)}
              class="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

{#if showAdd}
  <AddModal onClose={() => (showAdd = false)} />
{/if}
