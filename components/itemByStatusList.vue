<script setup lang='ts'>

// use itemsByStatus type or productTransform type when vue3.3 released:
//https://github.com/vuejs/core/issues/4294
// import { itemsByStatus } from '~~/types';
const props = defineProps<{
    itemsByStatus: {
        USED: number;
        NEW: number;
        BROKEN: number;
    }
}>();

const itemsCount = computed(() => props.itemsByStatus.BROKEN + props.itemsByStatus.NEW + props.itemsByStatus.USED
    //alternative approach: return Object.values(props.itemsByStatus).reduce((sum, currentValue) => sum + currentValue, 0);
);
</script>

<template>
    <v-list class="min-width-90" density="compact">
        <v-list-item class="text-center px-1">New: {{ itemsByStatus['NEW']
        }}
        </v-list-item>
        <v-list-item class="text-center px-1">Used: {{
                itemsByStatus['USED']
        }}
        </v-list-item>
        <v-list-item class="text-center px-1">Broken: {{
                itemsByStatus['BROKEN']
        }}</v-list-item>
        <v-list-item class="text-center px-1">Total: {{ itemsCount }}
        </v-list-item>
    </v-list>
</template>

<style>
.min-width-90 {
    min-width: 90px;
}
</style>