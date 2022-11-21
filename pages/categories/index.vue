<script setup lang='ts'>
import { mdiPencil, mdiDeleteForever, mdiPlusBox } from '@mdi/js';
import { Ref } from 'nuxt/dist/app/compat/capi';

import { categoryWithId, vuetifyFormI } from '~~/types';

definePageMeta({
    middleware: ['admin-only'],
});

const categories = ref<categoryWithId[]>([]);

useWrapFetch<categoryWithId[]>('category').then(({ result }) => {
    if (!result) {
        categories.value = [];
        return;
    };
    categories.value = result;

});

//
const loadingEditDelete = ref(false);
const editDialogCategory = ref<categoryWithId | null>(null);
function openEditCategoryDialog(category: categoryWithId) {
    editDialogCategory.value = { ...category };
}
async function editCategory() {
    loadingEditDelete.value = true;
    const targetCategory = categories.value.find(category => category.id === editDialogCategory.value?.id);

    if (!targetCategory || editDialogCategory.value?.name === targetCategory?.name) {
        loadingEditDelete.value = false;
        editDialogCategory.value = null;
        return;
    }

    const { result } = await useWrapFetch<categoryWithId>(`category/${editDialogCategory.value?.id}`, {
        method: 'PATCH',
        body: {
            name: editDialogCategory.value?.name
        }
    });
    if (result) {
        targetCategory.name = result.name;
        editDialogCategory.value = null;
    }
    loadingEditDelete.value = false;
}
// 
const deleteDialogCategory = ref<categoryWithId | null>(null);
function openDeleteCategoryDialog(category: categoryWithId) {
    deleteDialogCategory.value = { ...category };
}
async function deleteCategory() {
    loadingEditDelete.value = true;
    const index = categories.value.findIndex(category => category.id === deleteDialogCategory.value?.id);

    if (index == -1) {
        loadingEditDelete.value = false;
        deleteDialogCategory.value = null;
        return;
    }

    const { error } = await useWrapFetch<categoryWithId>(`category/${deleteDialogCategory.value?.id}`, {
        method: 'DELETE',
        body: {
            name: deleteDialogCategory.value?.name
        }
    });
    if (!error) {
        categories.value.splice(index, 1);
        deleteDialogCategory.value = null;
    }
    loadingEditDelete.value = false;
}
//

const createCategoryName = ref('');

const loadingCreate = ref(false);

const formRef = ref<vuetifyFormI>() as unknown as Ref<vuetifyFormI>;
const isValidCreateForm = ref<boolean | null>(null);
const { required, notEmpty } = useValidationRules();

async function createCategory() {

    const isValid = await formRef.value.validate();
    if (!isValid.valid) return

    loadingCreate.value = true;
    const { result } = await useWrapFetch<categoryWithId>(`category`, {
        method: 'POST',
        body: {
            name: createCategoryName.value
        }
    });
    loadingCreate.value = false;
    if (result) {
        categories.value.push(result);
        formRef.value.reset();
    }
}
</script>

<template>
    <v-card class="mx-auto px-6 py-8 mt-14">
        <v-table>
            <thead>
                <tr>
                    <th class="text-left" colspan="2">
                        Category
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for=" item in categories" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td class="text-right">
                        <v-btn @click="openEditCategoryDialog(item)" variant="text">
                            <v-icon :icon="mdiPencil" color="green"></v-icon>
                        </v-btn>

                        <v-btn @click="openDeleteCategoryDialog(item)" variant="text">
                            <v-icon :icon="mdiDeleteForever" color="red"></v-icon>
                        </v-btn>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <v-form v-model="isValidCreateForm" ref="formRef" class="flex">
                            <v-text-field v-model="createCategoryName" label="new category" required
                                :disabled="loadingCreate" variant="underlined"
                                :rules="[required('Category'), notEmpty('Category')]">
                            </v-text-field>
                            <v-card-actions>
                                <v-btn @click="createCategory" variant="text" :disabled="loadingCreate"
                                    :loading="loadingCreate">
                                    <v-icon :icon="mdiPlusBox" color="green" size="large"></v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-form>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <template v-if="editDialogCategory">
            <Dialog :dialogValue="editDialogCategory.name" @btn-red-click="editDialogCategory = null"
                @GreenBtnClick="editCategory" title="Edit Category:" :loading="loadingEditDelete">
                <v-text-field v-model="editDialogCategory.name" label="Category">
                </v-text-field>
            </Dialog>
        </template>
        <template v-if="deleteDialogCategory">
            <Dialog :dialogValue="deleteDialogCategory.name" @green-btn-click="deleteDialogCategory = null"
                @btn-red-click="deleteCategory" btn-green-text="Cancel" btn-red-text="Delete"
                :title="`Delete category '${deleteDialogCategory.name}'`" subTitle="and all it's products"
                :loading="loadingEditDelete">
            </Dialog>
        </template>
    </v-card>
</template>

<style>
.flex {
    display: flex;
    flex-wrap: wrap;
}
</style>