<template>
  <div class="container">
    <h1 class="title">Main Page</h1>

    <RandomRecipePreviewList title="Random Recipes" class="RandomRecipes center" />

    <div v-if="!store.username" class="text-center mt-4">
      <router-link :to="{ name: 'login' }">
        <button class="btn btn-primary">You need to Login to view this</button>
      </router-link>
    </div>
    <div v-else>
    <LastViewedRecipesPreviewList
      title="Last Viewed Recipes"
      class="LastViewedRecipes center"
      />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import RandomRecipePreviewList from "../components/RandomRecipePreviewList.vue";
import LastViewedRecipesPreviewList from "../components/LastViewedRecipesPreviewList.vue";

export default {
  components: {
    RandomRecipePreviewList,
    LastViewedRecipesPreviewList
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;

    return { store };
  }
};
</script>

<style lang="scss" scoped>
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
</style>
