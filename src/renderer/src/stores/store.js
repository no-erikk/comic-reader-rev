import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore({
  id: "app",
  state: () => ({
    activePage: ref("home"),
    pageMetadata: {
      home: {
        title: "Library",
        icon: "home",
        iconPath: "../assets/home.svg",
      },
      settings: {
        title: "Settings",
        icon: "settings",
        iconPath: "../assets/settings.svg",
      },
    },
    settings: {
      databasePath: "db.json",
      currentLibraryPath: "",
    },
  }),
  actions: {
    setActivePage(page) {
      this.activePage = page;
      return this.activePage;
    },
  },
  getters: {
    getActivePage() {
      console.log("from store:", this.activePage);
      return this.activePage;
    },
    getPageMeta() {
      console.log("arg from store:", this.activePage);
      const selectedMeta = this.pageMetadata[this.activePage] || {};
      console.log("selected meta:", selectedMeta);
      return selectedMeta;
    },
  },
});

