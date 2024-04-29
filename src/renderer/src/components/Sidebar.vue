<template>
  <div class="flex flex-col overflow-hidden h-full p-1 bg-popPink">
    <!-- logo TEMP -->
    <span id="backBtn" class="navbuttons hover:bg-secondary rounded-md">
      <img :src="backIcon" alt="back icon" @click="back()" />
    </span>
    <div class="menu mt-6">
      <!-- home/library -->
      <nav class="hover:bg-secondary rounded-md">
        <router-link class="button" to="/">
          <span id="homeBtn" class="navbuttons">
            <img :src="homeIcon" alt="home icon" />
          </span>
        </router-link>
      </nav>
      <!-- settings  -->
      <nav class="hover:bg-secondary rounded-md">
        <router-link class="button" to="/settings">
          <span id="settingsBtn" class="navbuttons">
            <img :src="settingsIcon" alt="home icon" />
          </span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script setup>
import backIcon from "../assets/backarrow.svg";
import homeIcon from "../assets/home.svg";
import settingsIcon from "../assets/settings.svg";
import { useStore } from "../stores/store";

const store = useStore();

// basic back button for library view
const back = () => {
  store.setViewMode("folders");
};
</script>
