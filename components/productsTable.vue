<script setup lang='ts'>
import { mdiPlayBoxOutline } from '@mdi/js';

import { productWithId } from '~~/types';

interface Props {
    products: productWithId[];
}

const props = defineProps<Props>();

const { productsTransformed } = useTransformProducts(toRef(props, 'products'));

</script>

<template>
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
            <tr v-for=" product in productsTransformed" :key="`${product.id}${product.images[0]}`">
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
                    <slot name="extraActions" :product="product" />
                </td>
            </tr>
            <slot name="extraRows" />
        </tbody>
    </v-table>
</template>

<style scoped>
.mobile-w {
    min-width: 80px;
    max-width: 150px;
}

@media (max-width: 900px) {
    .mobile-w {
        min-width: 80px;
    }
}

.img-width {
    max-width: 60px;
}
</style>