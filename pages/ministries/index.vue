<script setup lang='ts'>
import { mdiPencil, mdiDeleteForever, mdiPlusBox } from '@mdi/js';
import { Ref } from 'nuxt/dist/app/compat/capi';

import { ministryWithId, vuetifyFormI } from '~~/types';

definePageMeta({
    middleware: ['admin-only'],
});

const ministries = ref<ministryWithId[]>([]);

useWrapFetch<ministryWithId[]>('ministry').then(({ result }) => {
    if (!result) {
        ministries.value = [];
        return;
    };
    ministries.value = result;

});

//
const loadingEditDelete = ref(false);
const editDialogMinistry = ref<ministryWithId | null>(null);
function openEditMinistryDialog(ministry: ministryWithId) {
    editDialogMinistry.value = { ...ministry };
}
async function editMinistry() {
    loadingEditDelete.value = true;
    const targetMinistry = ministries.value.find(ministry => ministry.id === editDialogMinistry.value?.id);

    if (!targetMinistry || editDialogMinistry.value?.name === targetMinistry?.name) {
        loadingEditDelete.value = false;
        editDialogMinistry.value = null;
        return;
    }

    const { result } = await useWrapFetch<ministryWithId>(`ministry/${editDialogMinistry.value?.id}`, {
        method: 'PATCH',
        body: {
            name: editDialogMinistry.value?.name
        }
    });
    if (result) {
        targetMinistry.name = result.name;
        editDialogMinistry.value = null;
    }
    loadingEditDelete.value = false;
}
// 
const deleteDialogMinistry = ref<ministryWithId | null>(null);
function openDeleteMinistryDialog(ministry: ministryWithId) {
    deleteDialogMinistry.value = { ...ministry };
}
async function deleteMinistry() {
    loadingEditDelete.value = true;
    const index = ministries.value.findIndex(ministry => ministry.id === deleteDialogMinistry.value?.id);

    if (index == -1) {
        loadingEditDelete.value = false;
        deleteDialogMinistry.value = null;
        return;
    }

    const { result } = await useWrapFetch<ministryWithId>(`ministry/${deleteDialogMinistry.value?.id}`, {
        method: 'DELETE',
        body: {
            name: deleteDialogMinistry.value?.name
        }
    });
    if (result) {
        ministries.value.splice(index, 1);
        deleteDialogMinistry.value = null;
    }
    loadingEditDelete.value = false;
}
//

const createMinistryName = ref('');

const loadingCreate = ref(false);

const formCreateRef = ref<vuetifyFormI>() as unknown as Ref<vuetifyFormI>;
const isValidCreateForm = ref<boolean | null>(null);
const { required, notEmpty } = useValidationRules();

async function createMinistry() {
    formCreateRef.value.validate();
    if (!isValidCreateForm.value) return

    loadingCreate.value = true;
    const { result } = await useWrapFetch<ministryWithId>(`ministry`, {
        method: 'POST',
        body: {
            name: createMinistryName.value
        }
    });
    loadingCreate.value = false;
    if (result) {
        ministries.value.push(result);
        //TODO: use this in the older pages,components,code
        formCreateRef.value.reset();
    }
}
</script>

<template>
    <v-card class="mx-auto px-6 py-8 mt-14">
        <v-table>
            <thead>
                <tr>
                    <th class="text-left" colspan="2">
                        Ministry
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for=" item in ministries" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td class="text-right">
                        <v-btn @click="openEditMinistryDialog(item)" variant="text">
                            <v-icon :icon="mdiPencil" color="green"></v-icon>
                        </v-btn>

                        <v-btn @click="openDeleteMinistryDialog(item)" variant="text">
                            <v-icon :icon="mdiDeleteForever" color="red"></v-icon>
                        </v-btn>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <v-form v-model="isValidCreateForm" ref="formCreateRef" class="flex">
                            <v-text-field v-model="createMinistryName" label="new ministry" required
                                :disabled="loadingCreate" variant="underlined"
                                :rules="[required('Ministry'), notEmpty('Ministry')]">
                            </v-text-field>
                            <v-card-actions>
                                <v-btn @click="createMinistry" variant="text" :disabled="loadingCreate"
                                    :loading="loadingCreate">
                                    <v-icon :icon="mdiPlusBox" color="green" size="large"></v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-form>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <template v-if="editDialogMinistry">
            <Dialog :dialogValue="editDialogMinistry.name" @close="editDialogMinistry = null"
                @GreenBtnClick="editMinistry" title="Edit Ministry:" :loading="loadingEditDelete">
                <v-text-field v-model="editDialogMinistry.name" label="Ministry">
                </v-text-field>
            </Dialog>
        </template>
        <template v-if="deleteDialogMinistry">
            <Dialog :dialogValue="deleteDialogMinistry.name" @close="deleteDialogMinistry = null"
                @GreenBtnClick="deleteMinistry" btn-green-text="Delete" btn-red-text="Cancel"
                :title="`Delete ministry '${deleteDialogMinistry.name}'`"
                subTitle="and all it's products and institutions" :loading="loadingEditDelete">
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