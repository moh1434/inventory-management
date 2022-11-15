<script setup lang='ts'>
import { mdiPencil, mdiDeleteForever, mdiPlusBox } from '@mdi/js';
import { Ref } from 'nuxt/dist/app/compat/capi';

import { institutionWithIdI, vuetifyFormI } from '~~/types';

definePageMeta({
    middleware: ['admin-only'],
});

const institutions = ref<institutionWithIdI[]>([]);

useWrapFetch<institutionWithIdI[]>('institution').then(({ result }) => {
    if (!result) {
        institutions.value = [];
        return;
    };
    institutions.value = result;
});
//ERP: dynamic workflow
//
const isOpenCreateDialog = ref<boolean>(false);
function onCreatedInstitution($event: institutionWithIdI) {
    const createdInstitution = $event;
    if (!createdInstitution) return;
    institutions.value.push($event);
    isOpenCreateDialog.value = false;
    // useAlerts().setAlert('institution created successfully', 'success');
}

//

const formEditRef = ref<vuetifyFormI>() as unknown as Ref<vuetifyFormI>;
const isValidEditForm = ref<boolean | null>(null);

const loadingEditDelete = ref(false);
const editDialogInstitution = ref<institutionWithIdI | null>(null);
function openEditInstitutionDialog(institution: institutionWithIdI) {
    editDialogInstitution.value = { ...institution };
}
async function editInstitution() {
    formEditRef.value.validate();
    if (!isValidEditForm.value) return

    loadingEditDelete.value = true;
    const targetInstitution = institutions.value.find(institution => institution.id === editDialogInstitution.value?.id);

    if (!targetInstitution || editDialogInstitution.value?.name === targetInstitution?.name) {
        loadingEditDelete.value = false;
        editDialogInstitution.value = null;
        return;
    }

    const { result } = await useWrapFetch<institutionWithIdI>(`institution/${editDialogInstitution.value?.id}`, {
        method: 'PATCH',
        body: editDialogInstitution.value
    });
    loadingEditDelete.value = false;
    if (result) {
        Object.assign(targetInstitution, result);
        formEditRef.value.reset();
        editDialogInstitution.value = null;
    }

}
// 
const deleteDialogInstitution = ref<institutionWithIdI | null>(null);
function openDeleteInstitutionDialog(institution: institutionWithIdI) {
    deleteDialogInstitution.value = { ...institution };
}
async function deleteInstitution() {
    loadingEditDelete.value = true;
    const index = institutions.value.findIndex(institution => institution.id === deleteDialogInstitution.value?.id);

    if (index == -1) {
        loadingEditDelete.value = false;
        deleteDialogInstitution.value = null;
        return;
    }

    const { result } = await useWrapFetch<institutionWithIdI>(`institution/${deleteDialogInstitution.value?.id}`, {
        method: 'DELETE',
        body: {
            name: deleteDialogInstitution.value?.name
        }
    });
    if (result) {
        institutions.value.splice(index, 1);
        deleteDialogInstitution.value = null;
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
                <tr v-for=" item in institutions" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.phoneNumber }}</td>
                    <td>{{ item.city }}</td>
                    <td>{{ item.location }}</td>
                    <td><img :src="item.image" alt="no image" class="img-width" /></td>
                    <td class="text-center">
                        <v-btn @click="openEditInstitutionDialog(item)" variant="text">
                            <v-icon :icon="mdiPencil" color="green"></v-icon>
                        </v-btn>

                        <v-btn @click="openDeleteInstitutionDialog(item)" variant="text">
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
        <template v-if="editDialogInstitution">
            <Dialog :dialogValue="editDialogInstitution.name" @close="editDialogInstitution = null"
                @GreenBtnClick="editInstitution" title="Edit Institution:" :loading="loadingEditDelete">
                <v-form ref="formEditRef" v-model="isValidEditForm">
                    <!-- ignore TS, i have  <template v-if="editDialogInstitution"> -->
                    <FormBaseInstitution :institution="editDialogInstitution"
                        @name="editDialogInstitution.name = $event" @city="editDialogInstitution.city = $event"
                        @phone-number="editDialogInstitution.phoneNumber = $event"
                        @location="editDialogInstitution.location = $event"
                        @image="editDialogInstitution.image = $event" />
                </v-form>
            </Dialog>
        </template>
        <template v-if="deleteDialogInstitution">
            <Dialog :dialogValue="deleteDialogInstitution.name" @close="deleteDialogInstitution = null"
                @GreenBtnClick="deleteInstitution" btn-green-text="Delete" btn-red-text="Cancel"
                :title="`Delete institution '${deleteDialogInstitution.name}'`" subTitle="and all it's products"
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