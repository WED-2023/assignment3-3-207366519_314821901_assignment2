import Main from "../pages/MainPage.vue";
import NotFound from "../pages/NotFoundPage.vue";

const routes = [
  
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/RegisterPage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/LoginPage.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../pages/SearchPage.vue"),
  },
  {
    path: "/recipe/:recipeId",
    name: "recipe",
    component: () => import("../pages/RecipeViewPage.vue"),
  },
    {
    path: "/create-recipe",
    name: "create-recipe",
    component: () => import("../pages/CreateRecipePage.vue"),
  },

   {
    path: "/favorite-page",
    name: "favorite-page",
    component: () => import("../pages/FavoritePage.vue"),
  },
  {
    path: "/my-recipes",
    name: "my-recipes",
    component: () => import("../pages/MyRecipesPage.vue"),
  },

  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: NotFound,
  }
  
];

export default routes;
