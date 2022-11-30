<script setup lang='ts'>
import { mdiPlayBoxOutline } from '@mdi/js';

import { productWithId, productWithIdAndUploadImages } from '~~/types';


//admin can not add a product, so there is no point to allow him to access this page(because he don't have products). also guests can't.
//only normal users can access this and create a product.
definePageMeta({
    middleware: ['user-only'],
});

const { products } = useMyProducts();

const { productsTransformed } = useTransformProducts(products);

//
function updateImagesLinks($event: string[], editDialogProduct: productWithIdAndUploadImages) {
    console.log('images', $event);
    if (!editDialogProduct) return; //only for ts

    editDialogProduct.images = $event;
}
function updateImagesByUpload($event: File[], editDialogProduct: productWithIdAndUploadImages) {
    if (!editDialogProduct) return; //only for ts

    editDialogProduct.imageFiles = $event;
}

//


function afterCreateItem($event: productWithId) {
    const createdInstitution = $event;
    if (!createdInstitution) return;
    products.value.push($event);
}

function afterEditItem($event: { index: number, newItem: productWithId }) {
    Object.assign(products.value[$event.index], $event.newItem);
}

function afterDeleteItem($event: number) {
    products.value.splice($event, 1);
}
//
</script>

<template>
    <EditableTable :thTableList="['name', 'description']" :useProductForm="true" :useBlockBtn="true"
        :items="productsTransformed" endpoint-url="products" item-text="products"
        delete-dialog-sub-title="and all it's items" @created-item="afterCreateItem" @edited-item="afterEditItem"
        @deleted-item="afterDeleteItem">
        <template #extra-th>
            <th class="text-left">
                Category
            </th>
            <th class="text-center">
                Image
            </th>
            <th class="text-center">
                Count
            </th>
        </template>
        <template #extra-td="{ item }">
            <td>{{ item.category.name }}</td>
            <!-- as productWithIdAndUploadImages -->
            <td>
                <template v-if="item.images.length">
                    <Image :src="item.images[0]" alt="no image" class="mobile-w" />
                </template>
                <template v-else>
                    <span>no images</span>
                </template>
            </td>
            <td>
                <ItemByStatusList :items-by-status="item.itemsByStatus" />
            </td>
        </template>
        <template #extra-actions="{ item }">
            <v-btn block variant="text" :to="{ name: 'products-id', params: { 'id': item.id } }" nuxt>
                <v-icon :icon="mdiPlayBoxOutline" color="green"></v-icon>
            </v-btn>
        </template>

        <template #createItem="{ onCreatedItem }">
            <FormProduct @success="onCreatedItem" class="w-full" />
        </template>
        <template #editItem="{ editDialogItem }">
            <!-- as productWithIdAndUploadImages -->
            <template v-if="editDialogItem">
                <FormBaseProduct :product="editDialogItem" :isImageRequired="false"
                    @update:description="editDialogItem.description = $event"
                    @update:name="editDialogItem.name = $event" @update:category-id="editDialogItem.categoryId = $event"
                    @update:items="editDialogItem.items = $event"
                    @update:images="updateImagesLinks($event, editDialogItem)"
                    @update:images-to-upload="updateImagesByUpload($event, editDialogItem)" />
            </template>
        </template>
    </EditableTable>
</template>

<style>
.w-full {
    width: 100%;
}
</style>