<script>
  import Navbar from "../components/Navbar.svelte";
  import Sidebar from "../components/Sidebar.svelte";

  let { children } = $props();

  let sidebarOpen = $state(false);
</script>

<div class="min-h-screen flex flex-col bg-slate-50">
  <Navbar onToggleSidebar={() => (sidebarOpen = !sidebarOpen)} />

  <div class="flex flex-1">
    <Sidebar open={sidebarOpen} onClose={() => (sidebarOpen = false)} />
    <main class="flex-1 p-4 md:p-8 min-w-0">
      {@render children()}
    </main>
  </div>
</div>
