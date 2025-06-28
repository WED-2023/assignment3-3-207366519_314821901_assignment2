<template>
  <div class="container">
    <h1 class="title">Main Page</h1>
    <RecipePreviewList
      title="Random Recipes"
      endpoint="/recipes/random"
    />

<div>
        <h3 class="mb-0">Last Viewed Recipes</h3>

        <div v-if="!store.username" class="text-center mt-3">
          <router-link :to="{ name: 'login' }">
            <button class="btn btn-primary">You need to Login to view this</button>
          </router-link>
        </div>

        <div v-else>
          <RecipePreviewList
            endpoint="/users/getLastViewedRecipes"
            :withCredentials="true"
          />
        </div>
      </div>

  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";

export default {
  components: {
    RecipePreviewList
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;

    return { store };
  }
};
</script>

<style lang="scss" scoped>
h1.title {
  text-align: center;
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
</style>
