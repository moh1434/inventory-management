<script lang="ts" setup>
const currentUser = useAuthUser()
const isAdmin = useAdmin()
const { logout } = useAuth()

const form = reactive({
  pending: false,
})

async function onLogoutClick() {
  try {
    form.pending = true

    await logout()

    await navigateTo({ name: "login" });
  }
  catch (error) {
    console.error(error)
  }
  finally {
    form.pending = false;
    drawer.value = false;
  }
}

const drawer = ref<boolean | null>(null);
</script>

<template>
  <v-app id="inspire">

    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@500&display=swap" rel="stylesheet">
    </Head>
    <AlertHandler></AlertHandler>
    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item :to="{ name: 'index' }" :exact="true">
          Home
        </v-list-item>
        <template v-if="currentUser">
          <template v-if="isAdmin">
            <v-list-item :disabled="form.pending" :to="{ name: 'categories' }">
              Categories
            </v-list-item>
            <v-list-item :disabled="form.pending" :to="{ name: 'ministries' }">
              Ministries
            </v-list-item>
            <v-list-item :disabled="form.pending" :to="{ name: 'institutions' }">
              Institutions
            </v-list-item>
          </template>
          <template v-else>
            <!--normal user-->
            <v-list-item :disabled="form.pending" :to="{ name: 'my-products' }">
              My Products
            </v-list-item>
            <v-list-item :disabled="form.pending" :to="{ name: 'products' }">
              Search Product
            </v-list-item>
          </template>
          <v-list-item :disabled="form.pending" @click="onLogoutClick">
            Logout
          </v-list-item>
        </template>
        <template v-else>
          <v-list-item :to="{ name: 'login' }">
            Login
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>البنك الوطني للمواد الراكدة</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <VContainer fluid>
        <slot />
      </VContainer>
    </v-main>
  </v-app>
</template>
<style>
body {
  font-family: 'Alexandria', sans-serif !important;
}
</style>
