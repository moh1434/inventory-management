<script lang="ts" setup>
import { Ref } from 'nuxt/dist/app/compat/capi';
import { vuetifyFormI } from '~~/types';

const emit = defineEmits(['success'])

const { login } = useAuth()

const config = useRuntimeConfig();
const formRef = ref<vuetifyFormI>() as unknown as Ref<vuetifyFormI>;
const isValidForm = ref(null);
const form = reactive({
  // TODO: danger this printed in dist deploy files also!, remove it and use .env if you want, also it printed in github!
  data: {
    username: config.public.isDebug ? 'admin_' : '',
    password: config.public.isDebug ? 'pleasechangemeiamadmin_' : '',
  },
  pending: false,
})

async function onLoginClick() {
  const isValid = await formRef.value.validate();
  if (!isValid.valid) return;

  form.pending = true

  const authUser = await login(form.data.username, form.data.password)
  form.pending = false;
  if (!authUser) return;

  emit('success')

}

const rules = {
  username: [
    (v: string) => !!v || 'Username is required',
    (v: string) => (v && v.length > 3) || 'Username must be more than 3 characters',
    (v: string) => (v && v.length <= 10) || 'Username must be less than 10 characters',
  ],
  password: [
    (v: string) => !!v || 'password is required',
    (v: string) => (v && v.length > 7) || 'Password must be more than 7 characters',
  ]
}

</script>

<template>
  <v-card class="mx-auto px-6 py-8 mt-14" max-width="500">
    <v-form v-model="isValidForm" ref="formRef">
      <v-text-field v-model="form.data.username" class="mb-2" :rules="rules.username" required label="Username">
      </v-text-field>

      <v-text-field v-model="form.data.password" :rules="rules.password" required label="Password"
        placeholder="Enter your password">
      </v-text-field>

      <br>

      <v-btn :disabled="!isValidForm || form.pending" :loading="form.pending" block color="blue" size="large"
        variant="elevated" @click.prevent="onLoginClick">
        Login
      </v-btn>
    </v-form>
  </v-card>
</template>
