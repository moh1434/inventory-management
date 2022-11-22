<script setup lang='ts'>
definePageMeta({
    middleware: ['admin-only'],
});

const { ministries } = useMinistries();

</script>

<template>
    <EditableTable :items="ministries" endpoint-url="ministry" item-text="ministry"
        delete-dialog-sub-title="and all it's products and institutions"></EditableTable>
</template>

<style>

</style>