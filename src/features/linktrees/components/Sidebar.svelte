<script>
  import { Link2, Users, User } from "lucide-svelte";
  import { currentPath, navigate } from "../../../router.js";

  let { open, onClose } = $props();

  const items = [
    { label: "Semua Link Tree", path: "/", icon: Link2 },
    { label: "Pengguna", path: "/users", icon: Users },
    { label: "Profil", path: "/profile", icon: User },
  ];

  function isActive(path, current) {
    if (path === "/") {
      return current === "/" || current.startsWith("/link-trees");
    }
    return current === path;
  }

  function go(path) {
    navigate(path);
    onClose();
  }
</script>

{#if open}
  <button
    type="button"
    aria-label="Tutup menu"
    onclick={onClose}
    class="fixed inset-0 bg-black/40 z-30 md:hidden"
  ></button>
{/if}

<aside
  class={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white border-r border-slate-200 p-4 transition-transform ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
>
  <nav class="space-y-1">
    {#each items as item (item.path)}
      {@const Icon = item.icon}
      {@const active = isActive(item.path, $currentPath)}
      <button
        type="button"
        aria-current={active ? "page" : undefined}
        onclick={() => go(item.path)}
        class={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold ${active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"}`}
      >
        <Icon size={18} />
        {`${item.label}`}
      </button>
    {/each}
  </nav>
</aside>
