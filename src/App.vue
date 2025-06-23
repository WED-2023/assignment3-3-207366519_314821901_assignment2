<template>
  <div id="app">
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap" rel="stylesheet" />
    <div id="nav">
      <router-link :to="{ name: 'main' }">Vue Recipes</router-link> |
      <router-link :to="{ name: 'search' }">Search</router-link> |
      <span v-if="!store.username">
        Guest:
        <router-link :to="{ name: 'register' }">Register</router-link> |
        <router-link :to="{ name: 'login' }">Login</router-link> |
      </span>
      <span v-else>
        {{ store.username }}:
        <button @click="CreateRecipe" class="btn btn-link p-0">Create Recipe</button> |
        <button @click="logout" class="btn btn-link p-0">Logout</button> |
      </span>
    </div>
    <router-view />
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import { useToast } from "vue-toastification";

export default {
  name: "App",
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = useToast();
    const router = internalInstance.appContext.config.globalProperties.$router;
  
    const logout = () => {
      store.logout();
      toast.success("User logged out successfully");
      router.push("/login").catch(() => {});
    };
    const CreateRecipe = () => {
      if (!store.username) {
        toast.error("You need to log in to create a recipe.");
        return;
      }
      router.push("/create-recipe").catch(() => {});
    };

    return { store, logout, CreateRecipe };
  }
}
</script>

<style lang="scss">
@import "@/scss/form-style.scss";

#app {
  font-family: 'Quicksand', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
