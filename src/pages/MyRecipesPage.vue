<template>
  <div class="container">
    <h1 class="title">My Recipes</h1>

    <template v-if="noRecipes">
      <div class="no-recipes-message">
        <h3 class="mb-0">You have no recipes yet</h3>
        <p>Start adding some delicious recipes!</p>
        <button class="btn btn-primary mt-3" @click="openCreateModal">
          Create Recipe
        </button>
      </div>
    </template>

    <template v-else>
      <RecipePreviewList
        endpoint="/users/getUserRecipes"
        :withCredentials="true"
        @recipes-empty="handleEmptyRecipes"
      />
    </template>

    <!-- Modal component ref -->
    <CreateRecipeModal ref="recipeModalRef" />
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";
import CreateRecipeModal from "../components/CreateRecipeModal.vue";
import { useToast } from 'vue-toastification';

export default {
  components: { RecipePreviewList, CreateRecipeModal },
  setup() {
    const noRecipes = ref(false);
    const recipeModalRef = ref(null);

    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;

    const toast = useToast();

    const handleEmptyRecipes = () => {
      noRecipes.value = true;
    };

    const openCreateModal = () => {
      if (!store.username) {
        toast.error("You need to log in to create a recipe.");
        return;
      }
      recipeModalRef.value?.showModal();
    };

    return {
      store,
      noRecipes,
      handleEmptyRecipes,
      openCreateModal,
      recipeModalRef
    };
  }
};
</script>

<style scoped>
h1.title {
  text-align: center;
  margin-bottom: 1.5rem;
}

.no-recipes-message {
  margin-top: 2rem;
  text-align: center;
  font-size: 1.25rem;
}

.container {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
