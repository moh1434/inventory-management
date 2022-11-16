<script setup lang='ts'>
import { mdiPencil, mdiDeleteForever, mdiPlusBox, mdiCamera } from '@mdi/js';
import cloneDeep from 'clone-deep';
import { institutionWithIdI, itemStatusI, productI } from '~~/types';
import { categoryWithId, itemWithID } from '../types';


interface Props {
    product: productI;
}
const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'update:name', newValue: string): void
    (e: 'update:description', newValue: string): void
    (e: 'update:images', newValue: string[]): void
    (e: 'update:categoryId', newValue: string): void
    // (e: 'update:institutionId', newValue: string): void
    (e: 'update:items', newValue: itemWithID[]): void
    (e: 'update:imagesToUpload', newValue: File[]): void
}>()

const { required, notEmpty, images } = useValidationRules();

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
// const institutions = ref<institutionWithIdI[]>([]);
// useWrapFetch<institutionWithIdI[]>('institution').then(({ result }) => {
//     if (!result) {
//         institutions.value = [];
//         return;
//     };
//     institutions.value = result;
// });
// const institutionsVuetify = computed(() => {
//     return institutions.value.map(institution => ({
//         title: institution.name,
//         value: institution.id,
//     }))
// });
// 

const imagesToUpload = ref<File[]>([]);
watch(imagesToUpload, () => {
    console.log('1');
    emit('update:imagesToUpload', imagesToUpload.value);
})

function updateItemCode(code: string, item: itemWithID) {
    const items = cloneDeep(props.product.items)
    items.some(it => {
        if (it.id === item.id) {
            it.code = code;
            return true;
        }
    });

    emit('update:items', items);
}
function updateItemStatus(status: itemStatusI, item: itemWithID) {
    const items = cloneDeep(props.product.items)
    console.log('status', status);
    items.some(it => {
        if (it.id === item.id) {
            it.status = status;
            return true;
        }
    });
    console.log('items', items);
    emit('update:items', items);
}

function deleteImage(index: number) {
    const imagesAfterDelete = [...props.product.images].splice(index, 1);
    if (imagesAfterDelete.length !== props.product.images.length) return;

    emit('update:images', imagesAfterDelete);
}
</script>

<template>
    <div>
        <v-text-field :model-value="product.name" @change="emit('update:name', $event.target.value)" class="mb-2"
            required label="Institution name" :rules="[required('Name'), notEmpty('Name')]">
        </v-text-field>
        <v-text-field :model-value="product.description" @change="emit('update:description', $event.target.value)"
            class="mb-2" required label="Description" :rules="[required('Description'), notEmpty('Description')]">
        </v-text-field>
        <v-select :items="categories" item-title="name" item-value="id" :model-value="product.categoryId"
            @update:model-value="emit('update:categoryId', $event)">
        </v-select>
        <!-- <v-select :items="institutionsVuetify" :model-value="product.institutionId"
            @change="emit('update:institutionId', $event)"></v-select> -->
        <!-- <div  class="flex"> -->
        <!-- loop through the images, display <img> for each image. with delete ability -->

        <v-card class="mb-5">
            <v-card-title>Images</v-card-title>
            <div class="flex">
                <v-card-item v-for="(image, index) in product.images" :key="index" class="text-center">
                    <v-img class="relative" :src="image" alt="no image" min-width="100" />
                    <v-btn class="img-btn" size="small" variant="tonal">
                        <v-icon :icon="mdiDeleteForever" color="red" @click="deleteImage(index)"></v-icon>
                    </v-btn>
                </v-card-item>
            </div>
            <v-file-input class="mt-5 px-6" v-model="imagesToUpload" show-size multiple :rules="images"
                accept="image/png, image/jpeg" placeholder="add image" :prepend-icon="mdiCamera" label="Add new image">
            </v-file-input>
            <!-- also we need create image ability, <v-file-input>, <v-btn upload image and return url component>upload</v-btn> -->
        </v-card>
        <v-list>
            <v-list-item-title>Items:</v-list-item-title>
            <v-list-item v-for="item in product.items" :key="item.id">
                <form-item :code="item.code" :status="item.status" @update:code="updateItemCode($event, item)"
                    @update:status="updateItemStatus($event, item)" class="flex gap-2" />
            </v-list-item>
        </v-list>
    </div>
</template>

<style>
.flex {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
}


.gap-2 {
    gap: 4px;
}
</style>