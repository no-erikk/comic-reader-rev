<template>
  <aside>
    <div class="logo">
      <img src="../assets/electron.svg" alt="Electron" />
    </div>
    <h3>Menu</h3>
    <div class="menu">
      <router-link class="button" to="/">
        <span class="navbuttons">
          <img :src="homeIcon" alt="home icon" />
        </span>
      </router-link>
      <router-link class="button" to="/settings">
        <span class="navbuttons">
          <img :src="settingsIcon" alt="home icon" />
        </span>
      </router-link>
    </div>
  </aside>
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

<style scoped>
aside {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: calc(2rem + 32px);
  height: 100vh;
  overflow: hidden;
  padding: 1rem;

  background-color: gray;

  transition: 0.2s ease-out;

  .logo {
    margin-bottom: 1rem;

    img {
      width: 2rem;
    }
  }

  @media (max-width: 768px) {
    position: fixed;
    z-index: 99;
  }
}
</style>
