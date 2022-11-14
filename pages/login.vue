<script lang="ts" setup>
definePageMeta({
  middleware: ['guest-only'],
})

const isAdmin = useAdmin()

async function onLoginSuccess() {
  const routeName = isAdmin.value ? 'categories' : 'index'

  await navigateTo({ name: routeName })
}
</script>

<template>
  <div>
    <img src="imgs/logo_background.png" class="img">
    <FormLogin @success="onLoginSuccess" />
    <div mb-3 flex gap-3>
    </div>
  </div>
</template>

<style>
.img {
  display: block;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
}
</style>