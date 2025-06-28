<template>
  <div id="app" :class="{ toggled: isSidebarToggled }">
    <!-- Font import -->
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap" rel="stylesheet" />

    <!-- Sidebar -->
    <AppSidebar
      :isToggled="isSidebarToggled"
      @toggle="toggleSidebar"
      @open-create-recipe="openRecipeModal"
    />

    <!-- Page Content -->
    <div id="page-content-wrapper">
      <router-view />
    </div>

    <!-- Create Recipe Modal -->
    <CreateRecipeModal ref="recipeModalRef" />
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';
import { useToast } from "vue-toastification";
import AppSidebar from './components/Sidebar.vue';
import CreateRecipeModal from './components/CreateRecipeModal.vue'; 

export default {
  name: "App",
  components: {
    AppSidebar,
    CreateRecipeModal
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

    const recipeModalRef = ref(null);

    const openRecipeModal = () => {
      if (!store.username) {
        toast.error("You need to log in to create a recipe.");
        return;
      }
      recipeModalRef.value?.showModal();
    };

    return {
      store,
      logout,
      favorite: () => router.push("/favorite-page"),
      isSidebarToggled,
      toggleSidebar,
      openRecipeModal,
      recipeModalRef
    };
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
