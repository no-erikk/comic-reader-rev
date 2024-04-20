<template>
  <main class="home-page">
    <div class="libraryGrid grid grid-cols-5 flex-wrap justify-items-center gap-4">
      <div
        v-for="dir in directories"
        :key="dir.id"
        class="p-2 h-48 w-36 text-center bg-pink-300 rounded-md"
      >
        <div class="h-5/6 bg-slate-700 rounded-md"></div>
        {{ dir.path }}
      </div>
    </div>
  </main>
</template>

<script setup>
const testFolders = []
for (let i = 0; i < 50; i++) {
  testFolders.push('Folder ' + i)
}
</script>

<style scoped></style>
