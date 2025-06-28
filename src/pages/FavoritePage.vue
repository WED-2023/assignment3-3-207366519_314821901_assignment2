<template>
  <div class="container">
    <h1 class="title">Favorite Recipes</h1>
<template v-if="noRecipes">
  <transition name="fade">
    <div class="no-recipes-message" v-if="noRecipes" key="no-recipes">
      <h3 class="mb-0">You have no favorite recipes</h3>
      <p>Start adding some to your favorites!</p>
      <button @click="goToSearch" class="btn btn-primary mt-3">
        Explore Recipes
      </button>
    </div>
  </transition>
</template>


    <template v-else>
      <RecipePreviewList
        endpoint="/users/favorites"
        :withCredentials="true"
        @recipes-empty="handleEmptyRecipes"
      />
    </template>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";
import { useRouter } from 'vue-router';

export default {
  components: {
    RecipePreviewList
  },
  setup() {
    const noRecipes = ref(false);
    const router = useRouter();

    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;

    const handleEmptyRecipes = () => {
      noRecipes.value = true;
    };

    const goToSearch = () => {
      router.push({ name: 'search' });
    };

    return { store, noRecipes, handleEmptyRecipes, goToSearch };
  }
};
</script>

<style lang="scss" scoped>
h1.title {
  text-align: center;
}

.container {
  min-height: 80vh; /* leave space for header, adjust as needed */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.no-recipes-message {
  margin-top: 2rem;
  text-align: center;
  font-size: 1.25rem;
}



.RandomRecipes {
  margin: 10px 0 10px;
}

.LastViewedRecipes {
  margin: 10px 0 10px;
}

.blur {
  -webkit-filter: blur(5px); /* Safari 6.0 - 9.0 */
  filter: blur(2px);
}

::v-deep .blur .recipe-preview {
  pointer-events: none;
  cursor: default;
}

/* Optional fade transition styles */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
