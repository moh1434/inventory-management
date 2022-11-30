<script lang="ts" setup>
import { mdiAirballoon } from "@mdi/js";
const items = ref([
  // {
  //   color: 'red-lighten-2',
  //   icon: mdiStar,
  // },
  // {
  //   color: 'purple-lighten-2',
  //   icon: mdiBookVariant,
  // },
  {
    title: 'مشروع المواد الراكدة وبطيئة الحركة',
    message: `استناداً الى توجيهات الأمانة العامة لمجلس الوزراء وبالتعاون مع وزارة الصناعة / الشركة العامة
                  للانظمة الالكترونية تم اعداد نظام المواد الراكدة وبطيئة الحركة للاستفادة من المواد المتوفرة في
                  المؤسسات والشركات في عموم العراق`,
    color: 'green',
    icon: mdiAirballoon,
  },
  // {
  //   color: 'indigo-lighten-2',
  //   icon: mdiBuffet,
  // },
]);
</script>

<template>
  <div>
    <v-container fluid>
      <v-img height="500" src="imgs/home_img.jpg" />

      <div class="mt-10">
        <v-timeline align="start">
          <v-timeline-item v-for="(item, i) in items" :key="i" :dot-color="item.color" :icon="item.icon" fill-dot>
            <v-card class="timeline-width">
              <v-card-title :class="['text-h5', `bg-${item.color}`]">
                {{ item.title }}
              </v-card-title>
              <v-card-text class="bg-white text--primary text-h6 py-4 line-height">
                {{ item.message }}
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </div>
    </v-container>
  </div>
</template>

<style>
.line-height {
  line-height: inherit !important;
}

.timeline-width {
  max-width: 900px;
}
</style>