<script>
  import { useInput } from "../../../hooks/useInput.js";
  import { register, authLoading } from "../states/authStore.js";
  import { navigate } from "../../../router.js";
  import {
    showSuccessDialog,
    showErrorDialog,
  } from "../../../helpers/toolsHelper.js";

  const { value: name } = useInput("");
  const { value: email } = useInput("");
  const { value: password } = useInput("");

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await register($name, $email, $password);

    if (result.status === "success") {
      await showSuccessDialog("Akun berhasil dibuat. Silakan masuk.");
      navigate("/auth/login");
    } else {
      showErrorDialog(result.message);
    }
  }
</script>

<h2 class="text-xl font-bold mb-4">Daftar</h2>

<form onsubmit={handleSubmit} class="space-y-4">
  <div>
    <label for="name" class="block text-sm font-medium mb-1">Nama</label>
    <input
      id="name"
      type="text"
      required
      bind:value={$name}
      class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  <div>
    <label for="email" class="block text-sm font-medium mb-1">Email</label>
    <input
      id="email"
      type="email"
      required
      bind:value={$email}
      class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  <div>
    <label for="password" class="block text-sm font-medium mb-1">Kata Sandi</label>
    <input
      id="password"
      type="password"
      required
      bind:value={$password}
      class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  <button
    type="submit"
    disabled={$authLoading}
    class="w-full rounded-lg bg-indigo-600 text-white font-semibold py-2 hover:bg-indigo-700 disabled:opacity-60"
  >
    {$authLoading ? "Memproses..." : "Daftar"}
  </button>
</form>

<p class="text-sm text-slate-500 text-center mt-4">
  Sudah punya akun?
  <button
    type="button"
    onclick={() => navigate("/auth/login")}
    class="text-indigo-600 font-semibold"
  >
    Masuk
  </button>
</p>