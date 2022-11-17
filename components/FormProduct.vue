<script setup lang='ts'>
import { productWithUploadImages } from '~~/types';
import { productWithId, itemStatusI } from '../types';

interface Props {
    loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
});

const emit = defineEmits(['success'])

const config = useRuntimeConfig();
const formRef = ref<any>(null); //vuetify <v-form ref="formRef"
const isValidForm = ref(null);


const initialForm = (): { data: productWithUploadImages, pending: boolean } => ({
    data: {
        name: '',
        description: '',

        images: [],
        newImages: [],
        items: [],

        institutionId: '',
        category: { name: '', id: '' },
        categoryId: '',
    },

    pending: props.loading,
});
const form = ref<{ data: productWithUploadImages, pending: boolean }>(initialForm());

// TODO: danger this printed in dist deploy files also!, remove it and use .env if you want, also it printed in github!
if (config.public.isDebug) {
    form.value.data = {
        name: 'product name',
        description: 'product desc',

        images: [],
        newImages: [],
        items: [{
            code: 'Qwe',
            id: 'test-id',
            productId: 'test-productId',
            status: 'NEW'
        }],

        institutionId: '',
        category: { name: '', id: '' },
        categoryId: '',
    }

    onMounted(() => {
        setTimeout(() => {
            formRef.value.validate();
        }, 1);
    });

}

//
function updateImagesByUpload($event: File[]) {
    form.value.data.newImages = $event;
}
//

//delete this before insert to API.
// item id, productId, institutionId (backend will set it from auth user), 
//category id,
// images
async function onCreateProductClick() {
    if (!formRef.value.validate()) return

    form.value.pending = true
    const body = {
        name: form.value.data.name,
        description: form.value.data.description,
        newImages: form.value.data.newImages,
        categoryId: form.value.data.categoryId,
        items: ([] as { code: string, status: itemStatusI }[]),
    };
    form.value.data.items.forEach(item => {
        body.items.push({ code: item.code, status: item.status })
    })
    const { result } = await useWrapFetch<productWithId>('products', {
        method: "POST",
        body: body
    });
    form.value.pending = false
    if (!result) return;
    // console.log('result', result);

    form.value = initialForm();
    emit('success', result);

}

</script>

<template>
    <v-card class="mx-auto px-6 py-8 mt-14" max-width="560">
        <v-form v-model="isValidForm" ref="formRef">
            <v-card-title class="px-0">product data:</v-card-title>

            <FormBaseProduct :product="form.data" @update:images-to-upload="updateImagesByUpload($event)"
                @update:description="form.data.description = $event" @update:name="form.data.name = $event"
                @update:category-id="form.data.categoryId = $event" @update:items="form.data.items = $event" />

            <br>

            <v-btn :disabled="!isValidForm || form.pending" :loading="form.pending" block color="success" size="large"
                variant="elevated" @click.prevent="onCreateProductClick">
                create the product
            </v-btn>
        </v-form>
    </v-card>
</template>

<style>

</style>