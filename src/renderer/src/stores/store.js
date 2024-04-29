import { useLocalStorage } from "@vueuse/core";
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
        iconPath: "../assets/home.svg", // todo
      },
      settings: {
        title: "Settings",
        icon: "settings",
        iconPath: "../assets/settings.svg", // todo
      },
    },
    viewMode: ref(""),
    settings: {
      databasePath: "src/db.json", // todo
      currentLibraryPath: ref(""),
    },
  }),
  actions: {
    loadLibraryData() {
      const savedLibraryPath = useLocalStorage(
        "libraryPath",
        this.settings.currentLibraryPath,
      );
      this.settings.currentLibraryPath = savedLibraryPath.value;
    },
    setActivePage(page) {
      this.activePage = page;
      return this.activePage;
    },
    setViewMode(viewName) {
      this.viewMode = viewName;
    },
    setLibraryDirectory(libraryPath) {
      this.settings.currentLibraryPath = libraryPath;
      useLocalStorage("libraryPath", libraryPath); // save to local storage
    },
    clearLibraryInformation() {
      this.settings.currentLibraryPath = "";
      localStorage.removeItem("libraryPath");
      this.setViewMode("");
    },
  },
  getters: {
    getActivePage() {
      return this.activePage;
    },
    getPageMeta() {
      const selectedMeta = this.pageMetadata[this.activePage] || {};
      return selectedMeta;
    },
    getLibraryDirectory() {
      return this.settings.currentLibraryPath;
    },
  },
});
