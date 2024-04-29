<template>
  <main class="home-page">
    <div
      class="libraryGrid grid grid-cols-5 flex-wrap justify-items-center gap-1 p-2"
    >
      <div
        v-if="store.viewMode === 'folders'"
        v-for="folder in folders"
        :key="folder.path"
        @click="showFiles(folder)"
        class="p-2 h-48 w-36 text-sm text-center text-primary overflow-hidden bg-popPink rounded-md"
      >
        <div class="h-5/6 bg-secondary rounded-md"></div>
        {{ folder.name }}
      </div>
      <div
        v-else-if="store.viewMode === 'files'"
        v-for="file in files"
        :key="file.path"
        class="p-2 h-48 w-36 text-sm text-center text-primary overflow-hidden bg-popPink rounded-md"
      >
        <div class="h-5/6 bg-secondary rounded-md"></div>
        {{ file.name }}
      </div>
      <div v-else class="col-span-full text-center text-xl text-popGrey">
        <h1>Please set a library folder via the settings page.</h1>
        <br />
        <h1>設定ページでライブラリフォルダーを選択してください。</h1>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "../stores/store";

const store = useStore();
const folders = ref(null);
const files = ref({});
const selectedFolder = ref(null);

// load library UI from file on mount
onMounted(async () => {
  try {
    //console.log("Fetching folder data...");
    folders.value = await storageApi.readLibraryFolders();
    //console.log("Folder data fetched:", folders.value);
    if (folders.value) {
      store.setViewMode("folders");
    }
  } catch (error) {
    console.error("Error in mounted:", error);
  }
});

// read and display files within selected folder
const showFiles = async (folderPath) => {
  try {
    //console.log("selected folder:", folder);
    selectedFolder.value = folderPath;
    files.value = await storageApi.readLibraryFiles(selectedFolder.value.path);
    store.setViewMode("files");
    //console.log("files in folder", files.value);
    //console.log("check selected folder", selectedFolder);
  } catch (error) {
    console.error("Error getting files:", error);
  }
};
</script>
