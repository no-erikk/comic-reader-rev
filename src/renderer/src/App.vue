<script setup>
import PageHeader from "./components/PageHeader.vue";
import Sidebar from "./components/Sidebar.vue";
</script>

<template>
  <div class="app flex h-screen">
    <!-- sidebar -->
    <div class="sidebar-container w-3rem">
      <Sidebar />
    </div>
    <!-- main content window -->
    <div class="content-container flex flex-1 flex-col bg-primary">
      <!-- header title bar -->
      <div class="page header">
        <PageHeader />
      </div>
      <!-- content window -->
      <router-view />
    </div>
  </div>
</template>

<style></style>
