<template>
  <div class="container">
    <h1 class="title">Search Page</h1>
    <SearchBox @results-found="onResultsFound" />
    <div v-if="recipesFromChild.length > 0" class="row">
      <div
        v-for="recipe in recipesFromChild"
        :key="recipe.id"
        class="col-sm-6 col-md-4 col-lg-3 mb-4"
      >
        <div class="card h-100">
          <RecipePreview class="recipePreview card-body" :recipe="recipe" />
        </div>
      </div>
    </div>

    <div v-else-if="hasSearched" class="no-results-card text-center">
      <i class="bi bi-emoji-frown icon-empty mb-3"></i>
      <h5>No recipes found</h5>
      <p class="text-muted">Try searching with different ingredients or keywords.</p>
    </div>
    </div>
</template>



<script>
import { ref } from 'vue';
import SearchBox from '../components/SearchBox.vue';
import RecipePreview from '../components/RecipePreview.vue';
export default {
  name: 'SearchPage',
  components: {
    SearchBox,
    RecipePreview
  },
  setup() {
    const recipesFromChild = ref([]);
    const hasSearched = ref(false);

    const onResultsFound = (recipes) => {
      recipesFromChild.value = [...recipes];
      hasSearched.value = true; // mark that search was done
      console.log('Recipes from child:', recipesFromChild.value);
    };
    return { recipesFromChild, onResultsFound, hasSearched };
  }
};

</script>

