<script>
  import { Link2, LogOut, Menu } from "lucide-svelte";
  import { logout } from "../../auth/states/authStore.js";
  import { navigate } from "../../../router.js";
  import { showConfirmDialog } from "../../../helpers/toolsHelper.js";

  let { onToggleSidebar } = $props();

  async function handleLogout() {
    if (await showConfirmDialog("Yakin ingin keluar?", "Keluar")) {
      logout();
      navigate("/auth/login");
    }
  }
</script>

<header
  class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4"
>
  <div class="flex items-center gap-3">
    <button
      type="button"
      aria-label="Buka menu"
      onclick={onToggleSidebar}
      class="md:hidden p-2 rounded-lg hover:bg-slate-100"
    >
      <Menu size={20} />
    </button>

    <button
      type="button"
      onclick={() => navigate("/")}
      class="flex items-center gap-2 font-extrabold text-slate-900"
    >
      <span
        class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center"
      >
        <Link2 size={18} />
      </span>
      Delcom Link Tree
    </button>
  </div>

  <button
    type="button"
    onclick={handleLogout}
    class="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600"
  >
    <LogOut size={16} />
    Keluar
  </button>
</header>
