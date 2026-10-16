<script>
  import { navigate } from "../../../router.js";
</script>

<div class="min-h-screen flex flex-col items-center justify-center text-center p-4">
  <p class="text-7xl font-extrabold text-indigo-600">404</p>
  <h1 class="text-2xl font-bold mt-4">Halaman tidak ditemukan</h1>
  <p class="text-slate-500 mt-2">
    Alamat yang kamu buka tidak tersedia.
  </p>
  <button
    type="button"
    onclick={() => navigate("/")}
    class="mt-6 rounded-lg bg-indigo-600 text-white font-semibold px-4 py-2 hover:bg-indigo-700"
  >
    Kembali ke Beranda
  </button>
</div>
