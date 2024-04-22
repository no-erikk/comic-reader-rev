<template>
  <div class="flex flex-col overflow-hidden h-full p-1 bg-popPink">
    <!-- logo TEMP -->
    <div class="menu mt-6">
      <!-- home/library -->
      <nav class="hover:bg-secondary rounded-md">
        <router-link class="button" to="/">
          <span class="navbuttons">
            <img :src="homeIcon" alt="home icon" />
          </span>
        </router-link>
      </nav>
      <!-- settings  -->
      <nav class="hover:bg-secondary rounded-md">
        <router-link class="button" to="/settings">
          <span class="navbuttons">
            <img :src="settingsIcon" alt="home icon" />
          </span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script>
import homeIcon from "../assets/home.svg";
import settingsIcon from "../assets/settings.svg";

export default {
  data() {
    return {
      homeIcon,
      settingsIcon,
    };
  },
};
</script>
