<script setup lang='ts'>
import { institutionI, institutionWithIdI } from '~~/types';

interface Props {
    institution: institutionI | institutionWithIdI;
}
const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'name', newValue: string): void
    (e: 'phoneNumber', newValue: string): void
    (e: 'city', newValue: string): void
    (e: 'location', newValue: string): void
}>()

const { required, notEmpty, phoneNumber } = useValidationRules();


</script>

<template>
    <div>
        <v-text-field :model-value="institution.name" @update:model-value="emit('name', $event)" class="mb-2" required
            label="Institution" :rules="[required('Name'), notEmpty('Name')]">
        </v-text-field>
        <v-text-field :model-value="institution.phoneNumber" @update:model-value="emit('phoneNumber', $event)"
            class="mb-2" required label="Phone number" :rules="[required('Phone'), notEmpty('Phone'), phoneNumber]">
        </v-text-field>
        <v-text-field :model-value="institution.city" @update:model-value="emit('city', $event)" class="mb-2" required
            label="City" :rules="[required('City'), notEmpty('City')]">
        </v-text-field>
        <v-text-field :model-value="institution.location" @update:model-value="emit('location', $event)" class="mb-2"
            required label="Location" :rules="[required('Location'), notEmpty('Location')]">
        </v-text-field>

    </div>
</template>

<style>

</style>