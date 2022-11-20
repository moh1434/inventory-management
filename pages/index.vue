<script lang="ts" setup>
//Icons are from: https://materialdesignicons.com/
//mdiDotsVertical, mdiStar, mdiBookVariant, mdiBuffet,
import { mdiAirballoon } from "@mdi/js";
// definePageMeta({
//   middleware: [],
// })
// const messages = ref([
//   {
//     title: 'مشروع المواد الراكدة وبطيئة الحركة',
//     message: `استناداً الى توجيهات الأمانة العامة لمجلس الوزراء وبالتعاون مع وزارة الصناعة / الشركة العامة
//                   للانظمة الالكترونية تم اعداد نظام المواد الراكدة وبطيئة الحركة للاستفادة من المواد المتوفرة في
//                   المؤسسات والشركات في عموم العراق`,
//     color: 'green',
//   },
// ]);

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
    color: 'green-lighten-1',
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

      <!-- <v-card>
        <v-img height="500" src="imgs/home_img.jpg" class="text-white">
          <v-toolbar color="rgba(0, 0, 0, 0)" theme="dark">
            <v-toolbar-title class="text-h6">
              Home
            </v-toolbar-title>
          </v-toolbar>
        </v-img>

        <v-card-text>
          <div class="font-weight-bold ml-1 mb-2">
            البنك الوطني للمواد الراكدة
          </div>

          <v-timeline density="compact">
            <v-timeline-item v-for="(message, index) in messages" :key="index" :dot-color="message.color"
              size="x-small">
              <div class="mb-4 timeline-width">
                <div class="font-weight-normal">
                  <strong>{{ message.title }}</strong>
                </div>
                <div>{{ message.message }}</div>
              </div>


            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card> -->

      <v-img height="500" src="imgs/home_img.jpg" class="text-white" />

      <div class="mt-10">
        <v-timeline align="start">
          <v-timeline-item v-for="(item, i) in items" :key="i" :dot-color="item.color" :icon="item.icon" fill-dot>
            <v-card class="timeline-width">
              <v-card-title :class="['text-h5', `bg-${item.color}`, 'text-black']">
                {{ item.title }}
              </v-card-title>
              <v-card-text class="bg-white text--primary text-h6 py-4 line-height">
                {{ item.message }}

                <!-- <v-btn :color="item.color" variant="outlined">
                  Button
                </v-btn> -->
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
  /* text-align: right; */
}

.text-black {
  color: black;
}
</style>