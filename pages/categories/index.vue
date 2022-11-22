<script setup lang='ts'>
definePageMeta({
    middleware: ['admin-only'],
});

const { categories } = useCategories();

</script>

<template>
    <EditableTable :items="categories" endpoint-url="category" item-text="category"
        delete-dialog-sub-title="and all it's products"></EditableTable>
</template>

<style>

</style>