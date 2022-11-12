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
    <FormLogin @success="onLoginSuccess" />
    <div mb-3 flex gap-3>
    </div>
  </div>
</template>
