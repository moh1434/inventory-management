<script setup lang='ts'>

interface Props {

    dialogValue: string | null;
    loading?: boolean;
    title?: string | null;
    btnGreenText?: string
    btnRedText?: string
}

withDefaults(defineProps<Props>(), {
    loading: false,
    title: null,
    btnGreenText: 'Edit',
    btnRedText: 'Cancel'
});

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'GreenBtnClick'): void
}>()
</script>

<template>
    <v-dialog :model-value="typeof dialogValue == 'string'" @update:model-value="emit('close')" max-width="460">
        <v-card v-if="typeof dialogValue == 'string'" class="px-6 py-6 mt-14">
            <v-card-title v-if="title" class="px-0">{{ title }}</v-card-title>
            <v-form>
                <slot />
                <v-card-actions>
                    <v-btn color="green" @click="emit('GreenBtnClick')" :disabled="loading" :loading="loading">{{
                    btnGreenText
                    }}
                    </v-btn>
                    <v-btn color="red" @click="emit('close')" :disabled="loading">{{ btnRedText }}
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<style>

</style>