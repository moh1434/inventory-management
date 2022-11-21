<script setup lang='ts'>
import { Ref } from 'nuxt/dist/app/compat/capi';
import { productWithId, vuetifyFormI } from '~~/types';
import { mdiMagnify } from '@mdi/js';

const { institutions } = useInstitutions();

//
const { categories } = useCategories();
//
const formRef = ref<vuetifyFormI>() as unknown as Ref<vuetifyFormI>;
const loading = ref(false);

const emit = defineEmits<{
    (e: 'update:products', value: productWithId[]): void
    (e: 'update:loading', value: boolean): void

}>()
const selectedFilters = ref({
    productName: '',
    institutionId: null,
    categoryId: null
})
async function searchProducts() {
    console.log(selectedFilters.value);
    const isValid = await formRef.value.validate();
    if (!isValid.valid) return
    loading.value = true;
    const query = {} as {
        productName?: string,
        institutionId?: string,
        categoryId?: string
    };

    if (selectedFilters.value.productName) {
        query.productName = selectedFilters.value.productName;
    }
    if (selectedFilters.value.institutionId) {
        query.institutionId = selectedFilters.value.institutionId;
    }
    if (selectedFilters.value.categoryId) {
        query.categoryId = selectedFilters.value.categoryId;
    }

    const { result, error } = await useWrapFetch<productWithId[]>('/products/', {
        query
    });
    loading.value = false;
    if (error) {
        return;
    };
    emit('update:products', result ?? []); //backend already return [] if there is no products. but ts complain

    console.log('result', result);
}

watch(loading, () => {
    emit('update:loading', loading.value);
})
</script>

<template>
    <v-form ref="formRef">
        <v-card-title class="mb-2">Search products by:</v-card-title>
        <v-card-actions class="flex gap-4 mx-4 mb-4">
            <v-text-field v-model="selectedFilters.productName" :disabled="loading" :loading="loading" hide-details
                label="product name">
            </v-text-field>

            <v-select item-title="name" item-value="id" :items="categories" v-model="selectedFilters.categoryId"
                label="Category" clearable :disabled="loading" :loading="loading" hide-details />

            <v-select item-title="name" item-value="id" :items="institutions" v-model="selectedFilters.institutionId"
                label="Institution" clearable :disabled="loading" :loading="loading" hide-details />

            <v-btn @click="searchProducts">
                <v-icon :icon="mdiMagnify"></v-icon>
                Search
            </v-btn>
        </v-card-actions>
    </v-form>
</template>

<style>
.gap-4 {
    gap: 14px;
}
</style>