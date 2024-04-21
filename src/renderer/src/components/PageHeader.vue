<template>
  <div>
    <header class="header h-8 pl-2 bg-primary bg-opacity-80">
      <h1 class="text-xl text-popGrey">{{ pageMeta.title }}</h1>
    </header>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "../stores/store";

const store = useStore();
// change page title when data is changed in store (via router)
const pageMeta = computed(() => store.getPageMeta);
</script>

