import { createRouter, createWebHashHistory } from "vue-router";

const EmptyView = { template: "<span hidden></span>" };

function preferredRouteLocale() {
  const saved = window.localStorage.getItem("yyzz-locale");
  if (saved === "en-US") return "en";
  if (saved === "zh-CN") return "zh";
  return window.navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

export const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: "smooth" };
    return { top: 0 };
  },
  routes: [
    { path: "/", redirect: () => `/${preferredRouteLocale()}` },
    { path: "/:locale(zh|en)", name: "home", component: EmptyView },
    { path: "/:locale(zh|en)/vows/:slug", name: "vow", component: EmptyView },
    { path: "/:pathMatch(.*)*", redirect: () => `/${preferredRouteLocale()}` },
  ],
});
