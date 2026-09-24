import {
  useRouter as _useRouter,
  createRouter,
  createWebHistory,
} from "vue-router";

const routes = [
  {
    path: "/sandboxes",
    name: "sandboxes",
    children: [
      {
        path: "base",
        name: "sandboxes.base",
        component: () => import(`../views/sandboxes/TheBasePageTech.vue`),
      },
    ],
  },
  {
    path: "/",
    name: "main",
    component: () => import(`../views/TheMainPage.vue`),
  },
  {
    path: "/news",
    name: "news",
    component: () => import(`../views/news/TheNewsListPage.vue`),
  },
  {
    path: "/colib",
    name: "colib",
    component: () => import(`../views/colib/TheColibPage.vue`),
  },
  {
    path: "/access-denied",
    name: "403",
    component: () => import(`../views/The403.vue`),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import(`../views/The404.vue`),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: routes,
});

const useRouter = () => _useRouter();

export default router;
export { useRouter };
