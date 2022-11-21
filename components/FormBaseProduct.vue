<script setup lang='ts'>
import { mdiPencil, mdiDeleteForever, mdiPlusBox, mdiCamera } from '@mdi/js';
import cloneDeep from 'clone-deep';
import { institutionWithIdI, itemStatusI, productI } from '~~/types';
import { categoryWithId, itemWithID } from '../types';


interface Props {
    product: productI;
    isImageRequired: boolean
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

function updateItemCode(code: string, index: number) {
    const items = cloneDeep(props.product.items);
    items[index].code = code;

    emit('update:items', items);
}
function updateItemStatus(status: itemStatusI, index: number) {
    const items = cloneDeep(props.product.items)
    console.log('status', status);
    items[index].status = status;
    console.log('items', items);
    emit('update:items', items);
}

function deleteImage(index: number) {
    const imagesAfterDelete = [...props.product.images];
    imagesAfterDelete.splice(index, 1);
    console.log('22', imagesAfterDelete, props.product.images, index)
    if (imagesAfterDelete.length == props.product.images.length) return;
    console.log('11');
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
        <!-- <div  class="flex justify-evenly"> -->

        <v-card class="mb-5">
            <v-card-title>Images</v-card-title>
            <div class="flex justify-evenly">
                <v-card-item v-for="(image, index) in product.images" :key="index" class="text-center">
                    <Image class="relative" :src="image" alt="no image" min-width="100" />
                    <v-btn class="img-btn" size="small" variant="tonal" @click="deleteImage(index)">
                        <v-icon :icon="mdiDeleteForever" color="red"></v-icon>
                    </v-btn>
                </v-card-item>
            </div>
            <v-file-input class="mt-5 px-6" v-model="imagesToUpload" show-size multiple :rules="images(isImageRequired)"
                accept="image/png, image/jpeg" placeholder="add image" :prepend-icon="mdiCamera" label="Add new image">
            </v-file-input>
        </v-card>
        <v-card>
            <v-card-title>Items:</v-card-title>
            <v-card-item>
                <!-- don't use item.id as a :key because when create a new products, all items will have id='' -->
                <form-item v-for="(item, index) in product.items" :key="index" :code="item.code" :status="item.status"
                    @update:code="updateItemCode($event, index)" @update:status="updateItemStatus($event, index)"
                    class="flex justify-evenly gap-2" />
                <div class="flex items-center justify-start -mt-4">
                    <v-btn @click="product.items.push({ code: '', id: '', productId: '', status: 'NEW' })"
                        variant="text">
                        <v-icon :icon="mdiPlusBox" color="green" size="large"></v-icon>
                    </v-btn>
                    <v-btn v-if="product.items.length > 1" @click="product.items.splice(product.items.length - 1, 1)"
                        variant="text" size="large">
                        <v-icon :icon="mdiDeleteForever" color="red"></v-icon>
                    </v-btn>
                </div>
            </v-card-item>
        </v-card>
    </div>
</template>

<style>
.flex {
    display: flex;
    flex-wrap: wrap;
}

.justify-evenly {
    justify-content: space-evenly;
}

.items-center {
    align-items: center;
}

.justify-start {
    justify-content: end !important;

}

.gap-2 {
    gap: 4px;
}

.-mt-4 {
    margin-top: -20px;
}
</style>