<script setup lang='ts'>
import { mdiPencil, mdiDeleteForever } from '@mdi/js';

import { categoryWithId } from '~~/types';

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

const loading = ref(false);
const editDialogCategory = ref<categoryWithId | null>(null);
function openEditCategoryDialog(category: categoryWithId) {
    editDialogCategory.value = { ...category };
}
async function editCategory() {
    loading.value = true;
    const targetCategory = categories.value.find(category => category.id === editDialogCategory.value?.id);

    if (!targetCategory || editDialogCategory.value?.name === targetCategory?.name) {
        loading.value = false;
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
    loading.value = false;
}
// 
const deleteDialogCategory = ref<categoryWithId | null>(null);
function openDeleteCategoryDialog(category: categoryWithId) {
    deleteDialogCategory.value = { ...category };
}
async function deleteCategory() {
    loading.value = true;
    const index = categories.value.findIndex(category => category.id === deleteDialogCategory.value?.id);

    if (index == -1) {
        loading.value = false;
        deleteDialogCategory.value = null;
        return;
    }

    const { result } = await useWrapFetch<categoryWithId>(`category/${deleteDialogCategory.value?.id}`, {
        method: 'DELETE',
        body: {
            name: deleteDialogCategory.value?.name
        }
    });
    if (result) {
        categories.value.splice(index, 1);
        deleteDialogCategory.value = null;
    }
    loading.value = false;
}
</script>

<template>
    <v-card class="mx-auto px-6 py-8 mt-14" max-width="460">
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
            </tbody>
        </v-table>
        <template v-if="editDialogCategory">
            <Dialog :dialogValue="editDialogCategory.name" @close="editDialogCategory = null"
                @GreenBtnClick="editCategory" title="Edit Category:">
                <v-text-field v-model="editDialogCategory.name" label="Category">
                </v-text-field>
            </Dialog>
        </template>
        <template v-if="deleteDialogCategory">
            <Dialog :dialogValue="deleteDialogCategory.name" @close="deleteDialogCategory = null"
                @GreenBtnClick="deleteCategory" btn-green-text="Delete" btn-red-text="Cancel"
                :title="`Delete category '${deleteDialogCategory.name}' and all it's products?`">
            </Dialog>
        </template>
    </v-card>
</template>

<style>

</style>