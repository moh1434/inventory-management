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

const formRef = ref<vuetifyFormI>() as unknown as Ref<vuetifyFormI>;

const loadingEditDelete = ref(false);
const editDialogInstitution = ref<institutionWithIdI | null>(null);
function openEditInstitutionDialog(institution: institutionWithIdI) {
    editDialogInstitution.value = { ...institution };
}
async function editInstitution() {
    const isValid = await formRef.value.validate();
    if (!isValid.valid) return

    loadingEditDelete.value = true;
    const index = institutions.value.findIndex(institution => institution.id === editDialogInstitution.value?.id);

    if (index == -1) {
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
        Object.assign(institutions.value[index], result);
        formRef.value.reset();
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

    const { error } = await useWrapFetch<institutionWithIdI>(`institution/${deleteDialogInstitution.value?.id}`, {
        method: 'DELETE',
        body: {
            name: deleteDialogInstitution.value?.name
        }
    });
    if (!error) {
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
                    <th class="text-center">
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
                    <td colspan="4"></td>
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
            <Dialog :dialogValue="editDialogInstitution.name" @btn-red-click="editDialogInstitution = null"
                @GreenBtnClick="editInstitution" title="Edit Institution:" :loading="loadingEditDelete">
                <v-form ref="formRef">
                    <!-- ignore TS, i have  <template v-if="editDialogInstitution"> -->
                    <FormBaseInstitution :institution="editDialogInstitution"
                        @name="editDialogInstitution.name = $event" @city="editDialogInstitution.city = $event"
                        @phone-number="editDialogInstitution.phoneNumber = $event"
                        @location="editDialogInstitution.location = $event" />
                </v-form>
            </Dialog>
        </template>
        <template v-if="deleteDialogInstitution">
            <Dialog :dialogValue="deleteDialogInstitution.name" @green-btn-click="deleteDialogInstitution = null"
                @btn-red-click="deleteInstitution" btn-green-text="Cancel" btn-red-text="Delete"
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