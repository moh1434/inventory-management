<script setup lang='ts'>

interface Props {
    src: string;
}

const props = defineProps<Props>();

const config = useRuntimeConfig();
const baseUrl = config.public.baseURL.replace("/v1", "");;

const fullUrl = new URL(props.src, baseUrl).toString();
</script>

<template>
    <v-img :src="fullUrl" v-bind="$attrs" />
</template>

<style>

</style>