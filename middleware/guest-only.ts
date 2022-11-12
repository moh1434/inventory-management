export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useAuthUser();

  if (user.value) {
    return navigateTo({ name: "index" });
  }
});
