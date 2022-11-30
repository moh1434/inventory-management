<script setup lang='ts'>
import { ministryWithId } from '~~/types';
definePageMeta({
    middleware: ['admin-only'],
});

const { ministries } = useMinistries();

function afterCreateItem($event: ministryWithId) {
    ministries.value.push($event);
}
function afterEditItem($event: { index: number, newItem: ministryWithId }) {
    ministries.value[$event.index].name = $event.newItem.name;
}
function afterDeleteItem($event: number) {
    ministries.value.splice($event, 1);
}
</script>

<template>
    <EditableTable :thTableList="['name']" :items="ministries" endpoint-url="ministry" item-text="ministry"
        delete-dialog-sub-title="and all it's products and institutions" @created-item="afterCreateItem"
        @edited-item="afterEditItem" @deleted-item="afterDeleteItem">
    </EditableTable>
</template>

<style>

</style>