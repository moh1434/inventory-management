<script setup lang='ts'>
import { mdiPencil, mdiDeleteForever, mdiPlusBox } from '@mdi/js';
import { Ref } from 'nuxt/dist/app/compat/capi';

import { institutionWithIdI, vuetifyFormI } from '~~/types';

definePageMeta({
    middleware: ['admin-only'],
});

const categories = ref<institutionWithIdI[]>([]);

useWrapFetch<institutionWithIdI[]>('institution').then(({ result }) => {
    if (!result) {
        categories.value = [];
        return;
    };
    categories.value = result;
});
//ERP: dynamic workflow
//
const isOpenCreateDialog = ref<boolean>(false);
function onCreatedInstitution($event: institutionWithIdI) {
    const createdInstitution = $event;
    if (!createdInstitution) return;
    categories.value.push($event);
    isOpenCreateDialog.value = false;
    // useAlerts().setAlert('institution created successfully', 'success');
}

//

const formEditRef = ref<vuetifyFormI>() as unknown as Ref<vuetifyFormI>;
const isValidEditForm = ref<boolean | null>(null);

const loadingEditDelete = ref(false);
const editDialogCategory = ref<institutionWithIdI | null>(null);
function openEditCategoryDialog(category: institutionWithIdI) {
    editDialogCategory.value = { ...category };
}
async function editCategory() {
    formEditRef.value.validate();
    if (!isValidEditForm.value) return

    loadingEditDelete.value = true;
    const targetCategory = categories.value.find(category => category.id === editDialogCategory.value?.id);

    if (!targetCategory || editDialogCategory.value?.name === targetCategory?.name) {
        loadingEditDelete.value = false;
        editDialogCategory.value = null;
        return;
    }

    const { result } = await useWrapFetch<institutionWithIdI>(`institution/${editDialogCategory.value?.id}`, {
        method: 'PATCH',
        body: editDialogCategory.value
    });
    loadingEditDelete.value = false;
    if (result) {
        Object.assign(targetCategory, result);
        formEditRef.value.reset();
        editDialogCategory.value = null;
    }

}
// 
const deleteDialogCategory = ref<institutionWithIdI | null>(null);
function openDeleteCategoryDialog(category: institutionWithIdI) {
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

    const { result } = await useWrapFetch<institutionWithIdI>(`institution/${deleteDialogCategory.value?.id}`, {
        method: 'DELETE',
        body: {
            name: deleteDialogCategory.value?.name
        }
    });
    if (result) {
        categories.value.splice(index, 1);
        deleteDialogCategory.value = null;
    }
    loadingEditDelete.value = false;
}
//


</script>

<template>
    <v-card class="mx-auto px-6 py-8 mt-14">
        <v-table>
            <thead>
                <tr>
                    <th class="text-left">
                        Institution
                    </th>
                    <th class="text-left">
                        phone
                    </th>
                    <th class="text-left">
                        city
                    </th>
                    <th class="text-left">
                        location
                    </th>
                    <th class="text-left">
                        image
                    </th>
                    <th class="text-center" colspan="2">
                        actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for=" item in categories" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.phoneNumber }}</td>
                    <td>{{ item.city }}</td>
                    <td>{{ item.location }}</td>
                    <td><img :src="item.image" alt="no image" class="img-width" /></td>
                    <td class="text-center">
                        <v-btn @click="openEditCategoryDialog(item)" variant="text">
                            <v-icon :icon="mdiPencil" color="green"></v-icon>
                        </v-btn>

                        <v-btn @click="openDeleteCategoryDialog(item)" variant="text">
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
            <FormInstitution @success="onCreatedInstitution" class="w-full" />
        </v-dialog>
        <template v-if="editDialogCategory">
            <Dialog :dialogValue="editDialogCategory.name" @close="editDialogCategory = null"
                @GreenBtnClick="editCategory" title="Edit Institution:" :loading="loadingEditDelete">
                <v-form ref="formEditRef" v-model="isValidEditForm">
                    <!-- ignore TS, i have  <template v-if="editDialogCategory"> -->
                    <FormBaseInstitution :institution="editDialogCategory" @name="editDialogCategory.name = $event"
                        @city="editDialogCategory.city = $event" @phone-number="editDialogCategory.phoneNumber = $event"
                        @location="editDialogCategory.location = $event" @image="editDialogCategory.image = $event" />
                </v-form>
            </Dialog>
        </template>
        <template v-if="deleteDialogCategory">
            <Dialog :dialogValue="deleteDialogCategory.name" @close="deleteDialogCategory = null"
                @GreenBtnClick="deleteCategory" btn-green-text="Delete" btn-red-text="Cancel"
                :title="`Delete institution '${deleteDialogCategory.name}'`" subTitle="and all it's products"
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

.img-width {
    max-width: 60px;
}

.w-full {
    width: 100%;
}
</style>