<template>
  <div id="app" :class="{ toggled: isSidebarToggled }">
    <!-- Font import -->
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap" rel="stylesheet" />

    <!-- Sidebar -->
    <AppSidebar :isToggled="isSidebarToggled" @toggle="toggleSidebar" />

    <!-- Page Content -->
    <div id="page-content-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue';
import { useToast } from "vue-toastification";
import AppSidebar from './components/Sidebar.vue';

export default {
  name: "App",
  components: {
    AppSidebar
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const router = internalInstance.appContext.config.globalProperties.$router;
    const toast = useToast();

    const isSidebarToggled = ref(false);
    const toggleSidebar = () => {
      isSidebarToggled.value = !isSidebarToggled.value;
    };

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

    return { store, logout, CreateRecipe, isSidebarToggled, toggleSidebar };
  }
};
</script>

<style scoped>
#app {
  display: flex;
  font-family: 'Quicksand', Avenir, Helvetica, Arial, sans-serif;
  min-height: 100vh;
  transition: all 0.3s ease;
}
#app.toggled #sidebar-wrapper {
  margin-left: -220px;
}
#page-content-wrapper {
  flex: 1;
  padding: 20px;
  transition: all 0.3s ease;
}
</style>
