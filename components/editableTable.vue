<script setup lang='ts'>
import { mdiPencil, mdiDeleteForever, mdiPlusBox } from '@mdi/js';
import { Ref } from 'nuxt/dist/app/compat/capi';
import { productFormBuild } from '~~/helpers/productFormBulid';

import { categoryWithId, institutionWithIdI, ministryWithId, productWithIdAndUploadImages, vuetifyFormI } from '~~/types';

interface Props {
  items: categoryWithId[] | ministryWithId[] | institutionWithIdI[] | productWithIdAndUploadImages[];
  /** categories, institutions, ... */
  itemText: string;
  /** api endpoint */
  endpointUrl: string;
  deleteDialogSubTitle?: string;
  thTableList: (keyof categoryWithId)[] | (keyof ministryWithId)[] | (keyof institutionWithIdI)[] | (keyof productWithIdAndUploadImages)[];

  //
  useProductForm?: boolean;
  useBlockBtn?: boolean;
}
type itemType = typeof props.items[0];

const props = defineProps<Props>();

const { required, notEmpty } = useValidationRules();

const formRef = ref<vuetifyFormI>() as unknown as Ref<vuetifyFormI>;

const loadingEditDelete = ref(false);
const editDialogItem = ref<itemType>();
function openEditItemDialog(item: itemType) {
  editDialogItem.value = { ...item };
}


function transformBody(targetIndex?: number) {
  if (props.useProductForm && editDialogItem.value && typeof targetIndex === 'number') {
    const editDialogProduct = editDialogItem.value as productWithIdAndUploadImages;
    let items = editDialogProduct.items;
    if (JSON.stringify(editDialogProduct.items) === JSON.stringify((props.items as productWithIdAndUploadImages[])[targetIndex]?.items)) {
      items = [];
    }
    const formData = productFormBuild({ ...editDialogProduct, items });
    return formData;
  }

  return editDialogItem.value;
}

async function editItem() {
  const isValid = await formRef.value.validate();
  if (!isValid.valid) return

  loadingEditDelete.value = true;
  const targetIndex = props.items.findIndex(item => item.id === editDialogItem.value?.id);

  if (targetIndex == -1 || JSON.stringify(editDialogItem.value) === JSON.stringify(props.items[targetIndex])) {
    loadingEditDelete.value = false;
    editDialogItem.value = undefined;
    return;
  }

  const body = transformBody(targetIndex);
  const { result } = await useWrapFetch<itemType>(`${props.endpointUrl}/${editDialogItem.value?.id}`, {
    method: 'PATCH',
    body // editDialogItem.value.name
  });
  if (result) {
    editDialogItem.value = undefined;
    emit('EditedItem', { index: targetIndex, newItem: result });
    // Object.assign(props.items, result);
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
    emit('DeletedItem', index);
    // props.items.splice(index, 1);
    deleteDialogItem.value = undefined;
  }
  loadingEditDelete.value = false;
}
//
const isOpenCreateDialog = ref<boolean>(false);


const emit = defineEmits<{
  (e: 'CreatedItem', newItem: itemType): void
  (e: 'EditedItem', newItemAndIndex: { index: number, newItem: itemType }): void
  (e: 'DeletedItem', deletedIndex: number): void
}>();


function onCreatedItem($event: itemType) {
  console.log('onCreatedItem', $event);
  const createdItem = $event;
  if (!createdItem) return;
  emit('CreatedItem', createdItem);
  isOpenCreateDialog.value = false;
  // useAlerts().setAlert('institution created successfully', 'success');
}
</script>

<template>
  <v-card class="mx-auto px-6 py-8 mt-14">
    <v-table>
      <thead>
        <tr>
          <th class="text-left" v-for="th, index in thTableList" :key="index">
            {{ th }}
          </th>
          <slot name="extra-th" />
          <th class="text-right pr-14">
            actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for=" item in props.items" :key="item.id">
          <!-- @ts-ignore -->
          <td v-for="th, index in thTableList" :key="index">{{ item[th] }}</td>
          <slot name="extra-td" :item="item" />

          <td class="text-right">
            <slot name="extra-actions" :item="item" />
            <v-btn :block="!!useBlockBtn" @click="openEditItemDialog(item)" variant="text">
              <v-icon :icon="mdiPencil" color="green"></v-icon>
            </v-btn>

            <v-btn :block="!!useBlockBtn" @click="openDeleteItemDialog(item)" variant="text">
              <v-icon :icon="mdiDeleteForever" color="red"></v-icon>
            </v-btn>
          </td>
        </tr>
        <tr>
          <td class="text-right" colspan="100%">
            <v-btn @click="isOpenCreateDialog = true" variant="text">
              <v-icon :icon="mdiPlusBox" color="green" size="large"></v-icon>
            </v-btn>
            <!-- <v-btn variant="text" class="visibility-h"></v-btn> -->
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-dialog v-model="isOpenCreateDialog" max-width="660">
      <slot name="createItem" :onCreatedItem="onCreatedItem">
        <FormCreateItem :endpoint-url="endpointUrl" :item-text="itemText" @success="onCreatedItem" />
      </slot>
    </v-dialog>
    <template v-if="editDialogItem">
      <Dialog :dialogValue="editDialogItem.name" @btn-red-click="editDialogItem = undefined"
        @close="editDialogItem = undefined" @GreenBtnClick="editItem" :title="`Edit ${itemText}`"
        :loading="loadingEditDelete">
        <v-form ref="formRef">
          <slot name="editItem" :editDialogItem="editDialogItem">
            <v-text-field v-model="editDialogItem.name" :label="itemText" :rules="[required('Name'), notEmpty('Name')]">
            </v-text-field>
          </slot>
        </v-form>
      </Dialog>
    </template>
    <template v-if="deleteDialogItem">
      <Dialog :dialogValue="deleteDialogItem.name" @green-btn-click="deleteDialogItem = undefined"
        @close="deleteDialogItem = undefined" @btn-red-click="deleteItem" btn-green-text="Cancel" btn-red-text="Delete"
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

.w-full {
  width: 100%;
}

/* .visibility-h {
  visibility: hidden;
} */
</style>