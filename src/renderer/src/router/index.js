import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Settings from "../views/Settings.vue";
import { useStore } from "../stores/store";

// set routes to pages
// ページにルーターを設定
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
// ルーターの初期化
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// change activePage state on each call to router
// ルーターの呼び出し毎にactivePageの状態を変更
router.afterEach((to) => {
  const activePage = to.meta.page;
  //console.log("router first:", activePage);
  const store = useStore();
  store.setActivePage(activePage);
  //console.log("sent to store:", store.setActivePage(activePage));
});

export { router };
