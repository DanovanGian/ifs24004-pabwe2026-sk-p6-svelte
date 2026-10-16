<script>
  import { Link2 } from "lucide-svelte";

  let { children } = $props();
</script>

<div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <div
        class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white mb-4"
      >
        <Link2 size={28} />
      </div>
      <h1 class="text-2xl font-extrabold text-slate-900">Delcom Link Tree</h1>
      <p class="text-slate-500 mt-1">
        Kumpulkan semua tautan pentingmu dalam satu tempat.
      </p>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {@render children()}
    </div>
  </div>
</div>
