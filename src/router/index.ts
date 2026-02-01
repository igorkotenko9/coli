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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: routes,
});

const useRouter = () => _useRouter();

export default router;
export { useRouter };
