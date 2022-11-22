<script setup lang='ts'>
import { mdiPencil, mdiDeleteForever, mdiPlusBox } from '@mdi/js';
import { Ref } from 'nuxt/dist/app/compat/capi';

import { categoryWithId, ministryWithId, vuetifyFormI } from '~~/types';

interface Props {
  items: categoryWithId[] | ministryWithId[];
  /** categories, institutions, ... */
  itemText: string;
  /** api endpoint */
  endpointUrl: string;
  deleteDialogSubTitle?: string;
}
type itemType = typeof props.items[0];

const props = defineProps<Props>();

//
const loadingEditDelete = ref(false);
const editDialogItem = ref<itemType>();
function openEditItemDialog(item: itemType) {
  editDialogItem.value = { ...item };
}

async function editItem() {
  loadingEditDelete.value = true;
  const targetItem = props.items.find(item => item.id === editDialogItem.value?.id);

  if (!targetItem || editDialogItem.value?.name === targetItem?.name) {
    loadingEditDelete.value = false;
    editDialogItem.value = undefined;
    return;
  }

  const { result } = await useWrapFetch<itemType>(`${props.endpointUrl}/${editDialogItem.value?.id}`, {
    method: 'PATCH',
    body: {
      name: editDialogItem.value?.name
    }
  });
  if (result) {
    targetItem.name = result.name;
    editDialogItem.value = undefined;
  }
  loadingEditDelete.value = false;
}
// 
const deleteDialogItem = ref<itemType>();
function openDeleteItemDialog(item: itemType) {
  deleteDialogItem.value = { ...item };
}
async function deleteItem() {
  loadingEditDelete.value = true;
  const index = props.items.findIndex(item => item.id === deleteDialogItem.value?.id);

  if (index == -1) {
    loadingEditDelete.value = false;
    deleteDialogItem.value = undefined;
    return;
  }

  const { error } = await useWrapFetch<itemType>(`${props.endpointUrl}/${deleteDialogItem.value?.id}`, {
    method: 'DELETE'
  });
  if (!error) {
    props.items.splice(index, 1);
    deleteDialogItem.value = undefined;
  }
  loadingEditDelete.value = false;
}
//

const createItemName = ref('');

const loadingCreate = ref(false);

const formRef = ref<vuetifyFormI>() as unknown as Ref<vuetifyFormI>;

const { required, notEmpty } = useValidationRules();

async function createItem() {

  const isValid = await formRef.value.validate();
  if (!isValid.valid) return

  loadingCreate.value = true;
  const { result } = await useWrapFetch<itemType>(props.endpointUrl, {
    method: 'POST',
    body: {
      name: createItemName.value
    }
  });
  loadingCreate.value = false;
  if (result) {
    props.items.push(result);
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
            Item
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for=" item in props.items" :key="item.id">
          <td>{{ item.name }}</td>
          <td class="text-right">
            <v-btn @click="openEditItemDialog(item)" variant="text">
              <v-icon :icon="mdiPencil" color="green"></v-icon>
            </v-btn>

            <v-btn @click="openDeleteItemDialog(item)" variant="text">
              <v-icon :icon="mdiDeleteForever" color="red"></v-icon>
            </v-btn>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <v-form ref="formRef" class="flex">
              <v-text-field v-model="createItemName" :label="`new ${itemText}`" required :disabled="loadingCreate"
                variant="underlined" :rules="[required(itemText), notEmpty(itemText)]">
              </v-text-field>
              <v-card-actions>
                <v-btn @click="createItem" variant="text" :disabled="loadingCreate" :loading="loadingCreate">
                  <v-icon :icon="mdiPlusBox" color="green" size="large"></v-icon>
                </v-btn>
              </v-card-actions>
            </v-form>
          </td>
        </tr>
      </tbody>
    </v-table>
    <template v-if="editDialogItem">
      <Dialog :dialogValue="editDialogItem.name" @btn-red-click="editDialogItem = undefined" @GreenBtnClick="editItem"
        :title="`Edit ${itemText}`" :loading="loadingEditDelete">
        <v-text-field v-model="editDialogItem.name" :label="itemText">
        </v-text-field>
      </Dialog>
    </template>
    <template v-if="deleteDialogItem">
      <Dialog :dialogValue="deleteDialogItem.name" @green-btn-click="deleteDialogItem = undefined"
        @btn-red-click="deleteItem" btn-green-text="Cancel" btn-red-text="Delete"
        :title="`Delete ${itemText} ${deleteDialogItem.name}`" :subTitle="deleteDialogSubTitle"
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