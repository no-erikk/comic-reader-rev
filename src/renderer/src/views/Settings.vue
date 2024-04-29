<script setup>
import { computed } from "vue";
import { useStore } from "../stores/store";

const store = useStore();
const folderPath = computed(() => store.getLibraryDirectory);

const readDir = async () => {
  try {
    const libPath = await storageApi.selectDirectory();
    console.log("library path from main", libPath, typeof libPath);
    store.setLibraryDirectory(libPath);
  } catch (error) {
    console.log(error);
  }
};

const resetDir = () => {
  store.clearLibraryInformation();
  // call func to delete library.json
  storageApi.deleteLibraryFile();
};
</script>

<template>
  <main class="settings-page">
    <div class="selector p-3">
      <h1 class="text-lg text-popGrey">Select Library Folder</h1>
      <button
        id="btn"
        type="button"
        class="bg-popPink rounded-md text-primary text-sm font-semibold pl-1 pr-1 mr-3"
        @click="readDir"
      >
        Choose file
      </button>
      <h2 class="inline text-popGrey">
        Selected Folder: <b>{{ folderPath }}</b>
      </h2>
      <br />
      <button
        id="libResetBtn"
        type="button"
        class="bg-popPink rounded-md text-primary text-sm font-semibold pl-1 pr-1 mr-3"
        @click="resetDir"
      >
        Clear Directory
      </button>
    </div>
  </main>
</template>
