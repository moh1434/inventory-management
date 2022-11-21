<script setup lang='ts'>
import { mdiPlayBoxOutline } from '@mdi/js';

import { productTransformedWithId, productWithId } from '~~/types';
import cloneDeep from "clone-deep";

//admin can not add a product, so there is no point to allow him to access this page(because he don't have products). also guests can't.
//only normal users can access this and create a product.
definePageMeta({
    middleware: ['user-only'],
});
//
//

//
const products = ref<productWithId[]>([]);

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
            <ProductSearch @update:products="products = $event" />
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