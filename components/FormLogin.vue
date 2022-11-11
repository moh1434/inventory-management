<script lang="ts" setup>
const emit = defineEmits(['success'])

const { login } = useAuth()

const config = useRuntimeConfig();
const formRef = ref<any>(null); //vuetify <v-form ref="formRef"
const isValidForm = ref(null);
const form = reactive({
  data: {
    username: config.public.isDebug ? 'name_' : '',
    password: config.public.isDebug ? 'password_' : '',
  },
  error: '',
  pending: false,
})

async function onLoginClick() {
  formRef.value.validate();
  if (!isValidForm.value) return

  try {
    form.error = ''
    form.pending = true

    const authUser = await login(form.data.username, form.data.password)
    if (!authUser) return;

    emit('success')
  }

  finally {
    form.pending = false
  }
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
  <v-card class="mx-auto px-6 py-8 mt-14" max-width="344">
    <v-form v-model="isValidForm" ref="formRef">
      <v-text-field v-model="form.data.username" class="mb-2" :rules="rules.username" required label="Username">
      </v-text-field>

      <v-text-field v-model="form.data.password" :rules="rules.password" required label="Password"
        placeholder="Enter your password">
      </v-text-field>

      <br>

      <v-btn :disabled="!isValidForm || form.pending" :loading="form.pending" block color="success" size="large"
        variant="elevated" @click.prevent="onLoginClick">
        Login
      </v-btn>
    </v-form>
  </v-card>
</template>
