<script setup lang='ts'>
import { mdiPlayBoxOutline, mdiMagnify } from '@mdi/js';

import { categoryWithId, institutionWithIdI, productTransformedWithId, productWithId, vuetifyFormI } from '~~/types';
import cloneDeep from "clone-deep";
import { Ref } from 'nuxt/dist/app/compat/capi';

//admin can not add a product, so there is no point to allow him to access this page(because he don't have products). also guests can't.
//only normal users can access this and create a product.
definePageMeta({
    middleware: ['user-only'],
});
//
const formRef = ref<vuetifyFormI>() as unknown as Ref<vuetifyFormI>;
const loading = ref(false);
//
const institutions = ref<institutionWithIdI[]>([]);
useWrapFetch<institutionWithIdI[]>('institution').then(({ result }) => {
    if (!result) {
        institutions.value = [];
        return;
    };
    institutions.value = result;
});
//
const categories = ref<categoryWithId[]>([]);

useWrapFetch<categoryWithId[]>('category').then(({ result }) => {
    if (!result) {
        categories.value = [];
        return;
    };
    categories.value = result;
});
//
const products = ref<productWithId[]>([]);

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

    const { result } = await useWrapFetch<productWithId[]>('/products/', {
        query
    });
    loading.value = false;
    if (!result) {
        products.value = [];
        return;
    };
    products.value = result;
    // console.log('products', products.value);
    console.log('result', result);


}
const productsTransformed = computed(() => {
    const productsTransformed: productTransformedWithId[] = cloneDeep(products.value) as any[];
    products.value.forEach((product, index) => {
        if (productsTransformed[index].description) {
            productsTransformed[index].description = productsTransformed[index].description.slice(0, 32);
        }
        if (!productsTransformed[index].itemsByStatus) {
            productsTransformed[index]['itemsByStatus'] = { 'NEW': 0, 'USED': 0, 'BROKEN': 0 };
        }
        product.items.forEach(item => {
            productsTransformed[index].itemsByStatus[item.status]++;
        })
    })
    return productsTransformed;
})
//

//
</script>

<template>
    <v-card class="mx-auto px-6 py-8">
        <v-card class="mb-10">
            <!-- class="flex gap-4" -->
            <v-form ref="formRef">
                <v-card-title class="mb-2">Search products by:</v-card-title>
                <v-card-actions class="flex gap-4 mx-4 mb-4">
                    <v-text-field v-model="selectedFilters.productName" :disabled="loading" :loading="loading"
                        hide-details label="product name">
                    </v-text-field>

                    <v-select item-title="name" item-value="id" :items="categories" v-model="selectedFilters.categoryId"
                        label="Category" clearable :disabled="loading" :loading="loading" hide-details />

                    <v-select item-title="name" item-value="id" :items="institutions"
                        v-model="selectedFilters.institutionId" label="Institution" clearable :disabled="loading"
                        :loading="loading" hide-details />

                    <!-- <v-card-actions class="flex gap-4"> -->
                    <v-btn @click="searchProducts">
                        <v-icon :icon="mdiMagnify"></v-icon>
                        Search
                    </v-btn>
                    <!-- </v-card-actions> -->
                </v-card-actions>
            </v-form>
        </v-card>
        <v-table>
            <thead>
                <tr>
                    <th class="text-left">
                        Product
                    </th>
                    <th class="text-left">
                        Category
                    </th>
                    <th class="text-left">
                        Description
                    </th>
                    <th class="text-center">
                        Image
                    </th>
                    <th class="text-center">
                        Count
                    </th>
                    <th class="text-center">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for=" product in productsTransformed" :key="product.id">
                    <td>{{ product.name }}</td>
                    <td>{{ product.category.name }}</td>
                    <td>{{ product.description }}</td>
                    <td>
                        <template v-if="product.images.length">
                            <Image :src="product.images[0]" alt="no image" class="mobile-w" />
                        </template>
                        <template v-else>
                            <span>no images</span>
                        </template>
                    </td>
                    <td>
                        <ItemByStatusList :items-by-status="product.itemsByStatus" />
                    </td>
                    <td class="text-center">
                        <v-btn block variant="text" :to="{ name: 'products-id', params: { 'id': product.id } }" nuxt>
                            <v-icon :icon="mdiPlayBoxOutline" color="green"></v-icon>
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>
    </v-card>
</template>

<style scoped>
/* TODO: union all css files, without repeat classes */
/* make sure to use scoped if you will not union css files */
.mobile-w {
    min-width: 80px;
    max-width: 150px;
}

@media (max-width: 900px) {
    .mobile-w {
        min-width: 80px;
    }
}

.gap-4 {
    gap: 14px;
}

.w-full {
    width: 100%;
}

.flex {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center;
}

.img-width {
    max-width: 60px;
}
</style>