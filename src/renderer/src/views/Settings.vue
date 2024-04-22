<script setup>
import { ref } from "vue";

const filePath = ref(null);
const readDir = async () => {
  try {
    filePath.value = await fileApi.readFileDirectory();
  } catch (error) {
    console.log(error);
  }
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
      <h2 class="inline text-popGrey">Selected Folder: {{ filePath }}</h2>
    </div>
  </main>
</template>
