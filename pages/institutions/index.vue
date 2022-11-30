<script setup lang='ts'>
import { institutionWithIdI } from '~~/types';

definePageMeta({
    middleware: ['admin-only'],
});

const { institutions } = useInstitutions();

//ERP: dynamic workflow
//
function afterCreateItem($event: institutionWithIdI) {
    const createdInstitution = $event;
    if (!createdInstitution) return;

    //@ts-ignore, the API return this field and currently i not edit it and not display it, so i will delete it to make "POST" response same as "PATCH" response
    delete createdInstitution['ministry'];
    institutions.value.push(createdInstitution);
}

function afterEditItem($event: { index: number, newItem: institutionWithIdI }) {
    Object.assign(institutions.value[$event.index], $event.newItem);
}

function afterDeleteItem($event: number) {
    institutions.value.splice($event, 1);
}
//

// const editDialogInstitution = ref<institutionWithIdI>();

</script>

<template>
    <EditableTable :thTableList="['name', 'phoneNumber', 'city', 'location']" :items="institutions"
        endpoint-url="institution" item-text="institution" delete-dialog-sub-title="and all it's products"
        @created-item="afterCreateItem" @edited-item="afterEditItem" @deleted-item="afterDeleteItem">
        <template #createItem='{ onCreatedItem }'>
            <FormInstitution @success="onCreatedItem" class="w-full" />
        </template>
        <template #editItem="{ editDialogItem }">
            <template v-if="editDialogItem">
                <!--  as productWithIdAndUploadImages -->
                <FormBaseInstitution :institution="editDialogItem" @name="editDialogItem.name = $event"
                    @city="editDialogItem.city = $event" @phone-number="editDialogItem.phoneNumber = $event"
                    @location="editDialogItem.location = $event">
                </FormBaseInstitution>
            </template>
        </template>
    </EditableTable>
</template>

<style>
.img-width {
    max-width: 60px;
}

.w-full {
    width: 100%;
}
</style>