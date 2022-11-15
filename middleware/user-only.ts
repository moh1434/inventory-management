export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const user = useAuthUser();
  const isAdmin = useAdmin();
  if (!user.value) {
    return navigateTo({ name: "login" });
  } else if (isAdmin.value) {
    return abortNavigation();
  }
});
