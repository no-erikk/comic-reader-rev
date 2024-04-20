<script setup>
import Sidebar from "./components/Sidebar.vue";
</script>

<template>
  <div class="app">
    <div class="sidebar-container">
      <Sidebar />
    </div>
    <div class="content-container pl-20 pr-4">
      <router-view />
    </div>
  </div>
</template>

<style></style>
