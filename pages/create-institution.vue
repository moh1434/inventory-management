<script setup lang='ts'>
import { institutionResponseI } from '~~/types';

definePageMeta({
    middleware: ['admin-only'],
});

function onCreateInstitution(institution: institutionResponseI) {
    useAlerts().setAlert('institution created successfully', 'success');
    // console.log('institution', institution)
}

</script>

<template>
    <div>
        <FormInstitution @success="onCreateInstitution" />
    </div>
</template>

<style>

</style>