<script setup lang='ts'>
import { categoryWithId } from '~~/types';

definePageMeta({
    middleware: ['admin-only'],
});

const { categories } = useCategories();

function afterCreateItem($event: categoryWithId) {
    categories.value.push($event);
}

function afterEditItem($event: { index: number, newItem: categoryWithId }) {
    categories.value[$event.index].name = $event.newItem.name;
}
function afterDeleteItem($event: number) {
    categories.value.splice($event, 1);
}
</script>

<template>
    <EditableTable :thTableList="['name']" :items="categories" endpoint-url="category" item-text="category"
        delete-dialog-sub-title="and all it's products" @created-item="afterCreateItem" @edited-item="afterEditItem"
        @deleted-item="afterDeleteItem"></EditableTable>
</template>

<style>

</style>