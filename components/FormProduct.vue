<script setup lang='ts'>
import { Ref } from 'vue';
import { productWithUploadImages, vuetifyFormI, productWithId } from '~~/types';

interface Props {
    loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
});

const emit = defineEmits(['success'])

const config = useRuntimeConfig();

const formRef = ref<vuetifyFormI>() as unknown as Ref<vuetifyFormI>;
const isValidForm = ref(null);


const initialForm = (): { data: productWithUploadImages, pending: boolean } => ({
    data: {
        name: '',
        description: '',

        images: [],
        imageFiles: [],
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
        imageFiles: [],
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
        setTimeout(async () => {
            await formRef.value.validate();
        }, 1);
    });

}

//
function updateImagesByUpload($event: File[]) {
    form.value.data.imageFiles = $event;
}
//

//delete this before insert to API.
// item id, productId, institutionId (backend will set it from auth user), 
//category id,
// images
async function onCreateProductClick() {
    const isValid = await formRef.value.validate();
    if (!isValid.valid) return

    form.value.pending = true

    const formData = new FormData();
    form.value.data.imageFiles.forEach(image => {
        formData.append("imageFiles", image);
    })
    formData.append("name", form.value.data.name);
    formData.append("description", form.value.data.description);
    formData.append("categoryId", form.value.data.categoryId);

    form.value.data.items.forEach((item, i) => {
        formData.append(`items[${i}][code]`, item.code);
        formData.append(`items[${i}][status]`, item.status);
    })

    const { result } = await useWrapFetch<productWithId>('products', {
        method: "POST",
        body: formData
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