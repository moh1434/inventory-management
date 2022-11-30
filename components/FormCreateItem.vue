<script setup lang='ts'>
import { Ref } from 'nuxt/dist/app/compat/capi';
import { categoryWithId, ministryWithId, vuetifyFormI } from '~~/types';


interface Props {
  itemText: string;
  /** api endpoint */
  endpointUrl: string;
}

const props = defineProps<Props>();

const emit = defineEmits(['success'])

const loading = ref(false);

const createItemName = ref('');


const formRef = ref<vuetifyFormI>() as unknown as Ref<vuetifyFormI>;

const { required, notEmpty } = useValidationRules();

async function createItem() {

  const isValid = await formRef.value.validate();
  if (!isValid.valid) return

  loading.value = true;
  const { result } = await useWrapFetch<categoryWithId[] | ministryWithId[]>(props.endpointUrl, {
    method: 'POST',
    body: {
      name: createItemName.value
    }
  });
  loading.value = false;
  if (result) {
    emit('success', result);
    formRef.value.reset();
  }
}
</script>

<template>
  <v-card class="mx-auto px-6 py-8 mt-14 w-full">
    <v-form ref="formRef">
      <v-card-title class="px-0">Create {{ itemText }}:</v-card-title>

      <v-text-field v-model="createItemName" :label="`${itemText} name`" required :disabled="loading"
        variant="underlined" :rules="[required(itemText), notEmpty(itemText)]">
      </v-text-field>
      <v-btn :disabled="loading" :loading="loading" block color="success" size="large" variant="elevated"
        @click.prevent="createItem">
        create the {{ itemText }}
      </v-btn>
    </v-form>
  </v-card>
</template>

<style>

</style>