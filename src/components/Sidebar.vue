<template>
  <div id="sidebar-wrapper">
    <button class="btn btn-dark hamburger" @click="$emit('toggle')">
      <i class="bi bi-list" v-if="isToggled"></i>
      <i class="bi bi-x-lg" v-else></i>
    </button>

    <nav class="sidebar bg-dark text-light vh-100 position-fixed p-3">
      <div class="sidebar-brand mb-4 text-center">
        <router-link to="/" class="text-decoration-none text-light h5">Lior&Asaf</router-link>
      </div>
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link to="/search" class="nav-link text-light">
            <i class="bi bi-search me-2"></i>Search
          </router-link>
        </li>
        <li class="nav-item" v-if="!store.username">
          <span class="nav-link disabled text-secondary">Hello guest !</span>
          <router-link to="/register" class="nav-link text-light ms-3">
            <i class="bi bi-person-plus me-2"></i>Register
          </router-link>
          <router-link to="/login" class="nav-link text-light ms-3">
            <i class="bi bi-box-arrow-in-right me-2"></i>Login
          </router-link>
          <router-link to="/" class="nav-link text-light ms-3">
            <i class="bi bi-house-door me-2"></i>Main
          </router-link>
        </li>
        <li v-else class="nav-item">
          <button
            class="nav-link btn btn-link text-light text-start w-100 d-flex justify-content-between align-items-center"
            type="button"
            @click="showAccountMenu = !showAccountMenu"
            :aria-expanded="showAccountMenu"
          >
            <span>
              <i class="bi bi-person-circle me-2"></i>My Account
            </span>
            <i class="bi bi-chevron-down transition" :class="{ 'rotate': showAccountMenu }"></i>
          </button>
          <transition name="slide">
            <div v-if="showAccountMenu" class="ms-3">
              <router-link to="/favorites" class="nav-link text-light ms-3">
                <i class="bi bi-heart-fill me-2"></i>Favorites
              </router-link>
              <router-link to="/my-recipes" class="nav-link text-light ms-3">
                <i class="bi bi-journal-text me-2"></i>My Recipes
              </router-link>
              <button @click="CreateRecipe" class="nav-link btn btn-link text-light text-start ms-3">
                <i class="bi bi-pencil-square me-2"></i>Create Recipe
              </button>
              <button @click="logout" class="nav-link btn btn-link text-light text-start ms-3">
                <i class="bi bi-box-arrow-right me-2"></i>Logout
              </button>
            </div>
          </transition>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import { useToast } from "vue-toastification";

export default {
  name: "AppSidebar",
  props: {
    isToggled: {
      type: Boolean,
      required: true
    }
  },
  data() {
    const internalInstance = getCurrentInstance();
    return {
      showAccountMenu: false,
      store: internalInstance.appContext.config.globalProperties.store,
      router: internalInstance.appContext.config.globalProperties.$router,
      toast: useToast(),
    };
  },
  mounted() {},
  methods: {
    logout() {
      this.store.logout();
      this.toast.success("User logged out successfully");
      this.router.push("/login").catch(() => {});
    },
    CreateRecipe() {
      if (!this.store.username) {
        this.toast.error("You need to log in to create a recipe.");
        return;
      }
      this.router.push("/create-recipe").catch(() => {});
    },
  }
};
</script>

<style scoped>
#sidebar-wrapper {
  width: 220px;
  transition: all 0.3s ease;
}
.sidebar {
  width: 220px;
}
.hamburger {
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1051;
}
.transition {
  transition: transform 0.3s ease;
}
.rotate {
  transform: rotate(180deg);
}

/* slide transition for account menu */
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  overflow: hidden;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 500px; /* large enough to show content */
  overflow: hidden;
}
</style>
