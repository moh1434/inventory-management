<script lang="ts" setup>
//Icons are from: https://materialdesignicons.com/
import { mdiHumanGreetingVariant } from '@mdi/js';

// definePageMeta({
//   middleware: [],
// })
const currentUser = useAuthUser()
</script>

<template>
  <div>
    <v-btn :prepend-icon="mdiHumanGreetingVariant">test</v-btn>
    <h1>
      Home
    </h1>
    n:{{ currentUser }}
  </div>
</template>
