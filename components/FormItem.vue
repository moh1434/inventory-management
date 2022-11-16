<script setup lang='ts'>
import { itemStatuses } from '~~/constans/constants';
import { itemStatusI, } from '~~/types';

interface itemCodeStatus {
    code: string;
    status: itemStatusI;
};
const props = defineProps<itemCodeStatus>();

const emit = defineEmits<{
    (e: 'update:code', newValue: string): void
    (e: 'update:status', newValue: itemStatusI): void
}>()

const { required, notEmpty } = useValidationRules();

const itemStatusList = computed(() => {
    return itemStatuses.map(status => ({
        title: status,
        value: status
    }))
})

</script>

<template>
    <div v-bind="$attrs">
        <v-text-field :model-value="code" @change="emit('update:code', $event.target.value)" class="mb-2" required
            label="Code" :rules="[required('Code'), notEmpty('Code')]">
        </v-text-field>
        <v-select :model-value="status" @update:model-value="emit('update:status',  $event)" :items="itemStatusList"
            class="mb-2" required label="Status">
        </v-select>
    </div>
</template>

<style>

</style>