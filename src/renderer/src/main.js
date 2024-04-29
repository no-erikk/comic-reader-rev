import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
import { useStore } from "./stores/store";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

// load stored library data to store
const store = useStore();
store.loadLibraryData();

app.mount("#app");
