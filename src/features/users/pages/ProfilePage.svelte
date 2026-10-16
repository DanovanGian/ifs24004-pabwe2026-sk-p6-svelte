<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { useInput } from "../../../hooks/useInput.js";
  import {
    me,
    profileLoading,
    fetchMe,
    updateMe,
    updatePhoto,
    changePassword,
  } from "../states/usersStore.js";
  import {
    showSuccessDialog,
    showErrorDialog,
  } from "../../../helpers/toolsHelper.js";

  const { value: name } = useInput("");
  const { value: email } = useInput("");
  const { value: currentPassword, reset: resetCurrentPassword } = useInput("");
  const { value: newPassword, reset: resetNewPassword } = useInput("");

  onMount(async () => {
    await fetchMe();
    const current = get(me);
    if (current) {
      name.set(current.name);
      email.set(current.email);
    }
  });

  function report(result, successMessage) {
    if (result.status === "success") {
      showSuccessDialog(successMessage);
    } else {
      showErrorDialog(result.message);
    }
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    report(await updateMe($name, $email), "Profil berhasil diperbarui.");
  }

  async function handlePhotoChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);
    report(await updatePhoto(formData), "Foto profil berhasil diperbarui.");
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    const result = await changePassword($currentPassword, $newPassword);

    if (result.status === "success") {
      resetCurrentPassword();
      resetNewPassword();
    }
    report(result, "Kata sandi berhasil diubah.");
  }
</script>

<div class="max-w-2xl mx-auto space-y-6">
  <h1 class="text-2xl font-extrabold">Profil</h1>

  <section class="bg-white border border-slate-200 rounded-2xl p-6">
    <h2 class="font-bold mb-4">Foto Profil</h2>
    <div class="flex items-center gap-4">
      {#if $me?.photo}
        <img
          src={$me.photo}
          alt="Foto profil"
          class="w-20 h-20 rounded-full object-cover"
        />
      {:else}
        <div
          class="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 text-2xl font-bold flex items-center justify-center"
        >
          {$name.charAt(0).toUpperCase()}
        </div>
      {/if}
      <div>
        <label for="photo" class="block text-sm font-medium mb-1">Ubah Foto</label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onchange={handlePhotoChange}
          disabled={$profileLoading}
          class="text-sm"
        />
      </div>
    </div>
  </section>

  <section class="bg-white border border-slate-200 rounded-2xl p-6">
    <h2 class="font-bold mb-4">Data Diri</h2>
    <form onsubmit={handleProfileSubmit} class="space-y-4">
      <div>
        <label for="profile-name" class="block text-sm font-medium mb-1">Nama</label>
        <input
          id="profile-name"
          type="text"
          required
          bind:value={$name}
          class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label for="profile-email" class="block text-sm font-medium mb-1">Email</label>
        <input
          id="profile-email"
          type="email"
          required
          bind:value={$email}
          class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <button
        type="submit"
        disabled={$profileLoading}
        class="rounded-lg bg-indigo-600 text-white font-semibold px-4 py-2 hover:bg-indigo-700 disabled:opacity-60"
      >
        Simpan Profil
      </button>
    </form>
  </section>

  <section class="bg-white border border-slate-200 rounded-2xl p-6">
    <h2 class="font-bold mb-4">Ubah Kata Sandi</h2>
    <form onsubmit={handlePasswordSubmit} class="space-y-4">
      <div>
        <label for="current-password" class="block text-sm font-medium mb-1">Kata Sandi Saat Ini</label>
        <input
          id="current-password"
          type="password"
          required
          bind:value={$currentPassword}
          class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label for="new-password" class="block text-sm font-medium mb-1">Kata Sandi Baru</label>
        <input
          id="new-password"
          type="password"
          required
          bind:value={$newPassword}
          class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <button
        type="submit"
        disabled={$profileLoading}
        class="rounded-lg bg-indigo-600 text-white font-semibold px-4 py-2 hover:bg-indigo-700 disabled:opacity-60"
      >
        Ubah Kata Sandi
      </button>
    </form>
  </section>
</div>
