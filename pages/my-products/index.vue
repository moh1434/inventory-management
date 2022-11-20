<script setup lang='ts'>
import { mdiPencil, mdiDeleteForever, mdiPlusBox, mdiPlayBoxOutline } from '@mdi/js';
import { Ref } from 'nuxt/dist/app/compat/capi';
import { productTransformedWithId, productWithId, productWithIdAndUploadImages, vuetifyFormI } from '~~/types';
import cloneDeep from "clone-deep";

//admin can not add a product, so there is no point to allow him to access this page(because he don't have products). also guests can't.
//only normal users can access this and create a product.
definePageMeta({
    middleware: ['user-only'],
});

const products = ref<productWithId[]>([]);

useWrapFetch<productWithId[]>('/products/me').then(({ result }) => {
    if (!result) {
        products.value = [];
        return;
    };
    products.value = result;
    // console.log('products', products.value);
    console.log('result', result);
    products.value[0]
});
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
function updateImagesLinks($event: string[]) {
    console.log('images', $event);
    if (!editDialogProduct.value) return; //only for ts
    console.log('1')
    editDialogProduct.value.images = $event;
}
function updateImagesByUpload($event: File[]) {
    if (!editDialogProduct.value) return; //only for ts

    editDialogProduct.value.imageFiles = $event;
}

const formRef = ref<vuetifyFormI>() as unknown as Ref<vuetifyFormI>;

const loadingEditDelete = ref(false);

const editDialogProduct = ref<productWithIdAndUploadImages | null>(null);
function openEditProductDialog(product: productTransformedWithId) {
    editDialogProduct.value = { ...cloneDeep(product), imageFiles: [] };
}

//TODO: backend: PATCH products/id not return like GET products/id, items are not returned.
//in backend PATCH products/id add upload image from {imageFiles: File[]}
// DELETE products/id return Internal server error
async function editProduct() {
    if (!editDialogProduct.value) return;

    const isValid = await formRef.value.validate();
    if (!isValid.valid) return
    console.log('2', editDialogProduct.value?.id);
    loadingEditDelete.value = true;
    const index = products.value.findIndex(product => product.id === editDialogProduct.value?.id);
    console.log('3');
    if (index == -1) {
        loadingEditDelete.value = false;
        editDialogProduct.value = null;
        console.log('4');
        return;
    }
    console.log('5');
    // const body: any = cloneDeep(editDialogProduct.value);
    // delete body['itemsByStatus'];

    const formData = new FormData();
    editDialogProduct.value.imageFiles.forEach((image: File) => {
        formData.append("imageFiles", image);
    })
    editDialogProduct.value.images.forEach((imageStr, i) => {
        formData.append(`images[${i}]`, imageStr);
    });
    formData.append("name", editDialogProduct.value.name);
    formData.append("description", editDialogProduct.value.description);
    formData.append("categoryId", editDialogProduct.value.categoryId);

    if (JSON.stringify(editDialogProduct.value.items) !== JSON.stringify(products.value[index].items)) {
        editDialogProduct.value.items.forEach((item, i) => {
            formData.append(`items[${i}][code]`, item.code);
            formData.append(`items[${i}][status]`, item.status);
        })
    }
    const { result } = await useWrapFetch<productWithId>(`products/${editDialogProduct.value?.id}`, {
        method: 'PATCH',
        body: formData
    });
    console.log('6');
    if (result) {
        products.value[index] = result;
        editDialogProduct.value = null;
        console.log('7');
    }
    console.log('8');
    loadingEditDelete.value = false;
}
// 
type id = string;
const deleteDialogProduct = ref<id | null>(null);
function openDeleteProductDialog(product: productWithId) {
    deleteDialogProduct.value = product.id;
}
async function deleteProduct() {
    loadingEditDelete.value = true;
    const index = products.value.findIndex(product => product.id === deleteDialogProduct.value);

    if (index == -1) {
        loadingEditDelete.value = false;
        deleteDialogProduct.value = null;
        return;
    }

    const { error } = await useWrapFetch<productWithId>(`products/${deleteDialogProduct.value}`, {
        method: 'DELETE',
    });
    if (!error) {
        products.value.splice(index, 1);
        deleteDialogProduct.value = null;
    }
    loadingEditDelete.value = false;
}
//

const isOpenCreateDialog = ref<boolean>(false);

function onProductCreated($event: productWithId) {
    const createdInstitution = $event;
    if (!createdInstitution) return;
    products.value.push($event);
    isOpenCreateDialog.value = false;
}
//
</script>

<template>
    <v-card class="mx-auto px-6 py-8 mt-14">
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
                        <!-- TODO: make all tables responsive -->
                        <v-list class="min-width-80" density="compact">
                            <v-list-item density="compact" class="text-center px-1">New: {{ product.itemsByStatus['NEW']
                            }}
                            </v-list-item>
                            <v-list-item density="compact" class="text-center px-1">Used: {{
                                    product.itemsByStatus['USED']
                            }}
                            </v-list-item>
                            <v-list-item density="compact" class="text-center px-1">Broken: {{
                                    product.itemsByStatus['BROKEN']
                            }}</v-list-item>
                            <v-list-item density="compact" class="text-center px-1">Total: {{ product.items.length }}
                            </v-list-item>
                        </v-list>
                    </td>
                    <td class="text-center">
                        <v-btn block variant="text" :to="{ name: 'products-id', params: { 'id': product.id } }" nuxt>
                            <v-icon :icon="mdiPlayBoxOutline" color="green"></v-icon>
                        </v-btn>

                        <v-btn block @click="openEditProductDialog(product)" variant="text">
                            <v-icon :icon="mdiPencil" color="green"></v-icon>
                        </v-btn>
                        <v-btn block @click="openDeleteProductDialog(product)" variant="text">
                            <v-icon :icon="mdiDeleteForever" color="red"></v-icon>
                        </v-btn>

                    </td>
                </tr>
                <tr>
                    <td colspan="5"></td>
                    <td class="text-center">
                        <v-btn @click="isOpenCreateDialog = true" variant="text">
                            <v-icon :icon="mdiPlusBox" color="green" size="large"></v-icon>
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <v-dialog v-model="isOpenCreateDialog" max-width="660">
            <!-- TODO:migrate FormProduct file code, right now its just a clone of FormInstitution -->
            <FormProduct @success="onProductCreated" class="w-full" />
        </v-dialog>
        <template v-if="editDialogProduct">
            <Dialog :dialogValue="editDialogProduct.name" @close="editDialogProduct = null" @GreenBtnClick="editProduct"
                title="Edit Product:" :loading="loadingEditDelete" :maxWidth="560">
                <v-form ref="formRef">
                    <!--  @update:institution-id="editDialogProduct?.institutionId" -->
                    <FormBaseProduct :product="editDialogProduct"
                        @update:description="editDialogProduct.description = $event"
                        @update:name="editDialogProduct.name = $event"
                        @update:category-id="editDialogProduct.categoryId = $event"
                        @update:items="editDialogProduct.items = $event" @update:images="updateImagesLinks($event)"
                        @update:images-to-upload="updateImagesByUpload($event)" />
                </v-form>
            </Dialog>
        </template>
        <template v-if="deleteDialogProduct">
            <Dialog :dialogValue="deleteDialogProduct" @close="deleteDialogProduct = null"
                @GreenBtnClick="deleteProduct" btn-green-text="Delete" btn-red-text="Cancel" title="Delete the product"
                subTitle="and all it's products" :loading="loadingEditDelete">
            </Dialog>
        </template>
    </v-card>
</template>

<style>
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

.min-width-80 {
    min-width: 90px;
}

.flex {
    display: flex;
    flex-wrap: wrap;
}

.img-width {
    max-width: 60px;
}
</style>