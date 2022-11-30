<script setup lang='ts'>
import { productWithId } from '~~/types';


//admin can not add a product, so there is no point to allow him to access this page(because he don't have products). also guests can't.
//only normal users can access this and create a product.
definePageMeta({
    middleware: ['user-only'],
});
//

const productsSearched = ref<productWithId[]>([]);

//
</script>

<template>
    <v-card class="mx-auto px-6 py-8">
        <v-card class="mb-10">
            <ProductSearch @update:products="productsSearched = $event" />
        </v-card>
        <ProductsTable :products="productsSearched"></ProductsTable>
    </v-card>
</template>

<style>

</style>