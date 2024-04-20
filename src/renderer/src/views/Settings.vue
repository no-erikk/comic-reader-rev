<script setup>
import { ref } from 'vue'

const filePath = ref(null)
const readDir = async () => {
  try {
    filePath.value = await fileApi.readFileDirectory()
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <main class="settings-page">
    <div class="selector col-span-2 justify-self-center text-center">
      <h1>Select Library Folder:</h1>
      <button type="button" id="btn" @click="readDir">Choose file</button>
      <br />
      <h2>{{ filePath }}</h2>
    </div>
  </main>
</template>
