<script>
  import { currentPath, resolveRoute, navigate } from "./router.js";
  import { isAuthenticated } from "./features/auth/states/authStore.js";
  import AuthLayout from "./features/auth/layouts/AuthLayout.svelte";
  import LoginPage from "./features/auth/pages/LoginPage.svelte";
  import RegisterPage from "./features/auth/pages/RegisterPage.svelte";
  import LinkTreeLayout from "./features/linktrees/layouts/LinkTreeLayout.svelte";
  import HomePage from "./features/linktrees/pages/HomePage.svelte";
  import DetailPage from "./features/linktrees/pages/DetailPage.svelte";
  import UsersPage from "./features/users/pages/UsersPage.svelte";
  import ProfilePage from "./features/users/pages/ProfilePage.svelte";
  import NotFoundPage from "./features/common/pages/NotFoundPage.svelte";

  const layouts = { auth: AuthLayout, app: LinkTreeLayout };
  const pages = {
    login: LoginPage,
    register: RegisterPage,
    home: HomePage,
    detail: DetailPage,
    users: UsersPage,
    profile: ProfilePage,
    notfound: NotFoundPage,
  };

  const route = $derived(resolveRoute($currentPath));
  const Layout = $derived(layouts[route.layout]);
  const Page = $derived(pages[route.page]);

  const redirectTo = $derived(
    route.layout === "app" && !$isAuthenticated
      ? "/auth/login"
      : route.layout === "auth" && $isAuthenticated
        ? "/"
        : null
  );

  $effect(() => {
    if (redirectTo) navigate(redirectTo, { replace: true });
  });
</script>

{#if !redirectTo}
  {#if Layout}
    <Layout>
      <Page params={route.params} />
    </Layout>
  {:else}
    <Page params={route.params} />
  {/if}
{/if}
