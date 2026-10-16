<script>
  import { useInput } from "../../../hooks/useInput.js";
  import { login, authLoading } from "../states/authStore.js";
  import { navigate } from "../../../router.js";
  import { showErrorDialog } from "../../../helpers/toolsHelper.js";

  const { value: email } = useInput("");
  const { value: password } = useInput("");

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await login($email, $password);

    if (result.status === "success") {
      navigate("/");
    } else {
      showErrorDialog(result.message);
    }
  }
</script>

<h2 class="text-xl font-bold mb-4">Masuk</h2>

<form onsubmit={handleSubmit} class="space-y-4">
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
    {$authLoading ? "Memproses..." : "Masuk"}
  </button>
</form>

<p class="text-sm text-slate-500 text-center mt-4">
  Belum punya akun?
  <button
    type="button"
    onclick={() => navigate("/auth/register")}
    class="text-indigo-600 font-semibold"
  >
    Daftar
  </button>
</p>
