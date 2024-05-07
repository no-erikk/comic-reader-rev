<template>
  <div>
    <Library v-if="!readerActive" @open-reader="openReader" />
    <Reader v-if="readerActive" :images="images" />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import Library from "../components/Library.vue";
import Reader from "../components/Reader.vue";
import { useLibStore } from "../stores/libStore";

const libStore = useLibStore();
const images = ref([]);

const readerActive = computed(() => libStore.readerActive);

const openReader = async (filePath) => {
  console.log("Received file path in Home.vue:", filePath);
  //console.log("Setting file path in libStore:", filePath);
  libStore.setCurrentFilePath(filePath);
  console.log("File path stored in libStore:", libStore.currentFilePath);
  //console.log("Activating reader mode");
  libStore.setReaderActive(true);
  //console.log("Extracting images from filePath:", filePath);
  try {
    const imgBuffer = await readerApi.extractImages(filePath);
    libStore.setCurrentLoadedImages(imgBuffer);
    console.log(
      "Images extracted successfully:",
      libStore.getCurrentLoadedImages,
    );
  } catch (error) {
    console.error("Error extracting images:", error);
  }
};
</script>

<style lang="scss" scoped></style>

