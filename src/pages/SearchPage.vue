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
          <RecipePreview
              class="recipePreview card-body"
              :recipe="recipe"
              @update-popularity-increase="increasePopularity"
              @update-popularity-decrease="decreasePopularity"
              @update-favorite="updateFavorite"
            />
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
import { onMounted, ref } from 'vue';
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

    const updateLocalStorage = () => {
      localStorage.setItem("lastSearchResults", JSON.stringify(recipesFromChild.value));
    };

    const onResultsFound = (recipes) => {
      recipesFromChild.value = [...recipes];
      hasSearched.value = true;
      updateLocalStorage();
    };

    const increasePopularity = (id) => {
      const recipe = recipesFromChild.value.find(r => r.id === id);
      if (recipe) {
        recipe.popularity++;
        updateLocalStorage();
      }
    };

    const decreasePopularity = (id) => {
      const recipe = recipesFromChild.value.find(r => r.id === id);
      if (recipe && recipe.popularity > 0) {
        recipe.popularity--;
        updateLocalStorage();
      }
    };

    const updateFavorite = ({ id, isFavorite }) => {
      const recipe = recipesFromChild.value.find(r => r.id === id);
      if (recipe) {
        recipe.isFavoriteRecipe = isFavorite;
        updateLocalStorage();
      }
    };

    onMounted(() => {
      const cached = localStorage.getItem("lastSearchResults");
      if (cached) {
        recipesFromChild.value = JSON.parse(cached);
        hasSearched.value = true;
      }
    });

    return {
      recipesFromChild,
      onResultsFound,
      hasSearched,
      increasePopularity,
      decreasePopularity,
      updateFavorite
    };
  }
};
</script>
<style scoped>
h1.title {
  text-align: center;
}
</style>

