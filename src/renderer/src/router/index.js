import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Settings from "../views/Settings.vue";
import { useStore } from "../stores/store";

// set routes to pages
const routes = [
  {
    path: "/",
    component: Home,
    meta: { page: "home" },
  },
  {
    path: "/settings",
    component: Settings,
    meta: { page: "settings" },
  },
];
// init router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// change activePage state on each call to router
router.afterEach((to) => {
  const activePage = to.meta.page;
  //console.log("router first:", activePage);
  const store = useStore();
  store.setActivePage(activePage);
  //console.log("sent to store:", store.setActivePage(activePage));
});

export { router };
