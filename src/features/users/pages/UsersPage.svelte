<script>
  import { onMount } from "svelte";
  import { users, usersLoading, fetchUsers } from "../states/usersStore.js";

  onMount(fetchUsers);
</script>

<div class="max-w-3xl mx-auto">
  <h1 class="text-2xl font-extrabold mb-6">Pengguna</h1>

  {#if $usersLoading}
    <p class="text-slate-500">Memuat pengguna...</p>
  {:else if $users.length === 0}
    <p class="text-slate-500">Belum ada pengguna.</p>
  {:else}
    <ul class="grid gap-3 sm:grid-cols-2">
      {#each $users as user (user.id)}
        <li
          class="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4"
        >
          {#if user.photo}
            <img
              src={user.photo}
              alt={user.name}
              class="w-12 h-12 rounded-full object-cover"
            />
          {:else}
            <div
              class="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center"
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          {/if}
          <div class="min-w-0">
            <p class="font-semibold truncate">{user.name}</p>
            <p class="text-sm text-slate-500 truncate">{user.email}</p>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
