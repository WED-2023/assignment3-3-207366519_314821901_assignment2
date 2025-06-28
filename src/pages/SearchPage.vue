<template>
  <div class="container">
    <h1 class="title">Search Page</h1>
    <SearchBox @results-found="onResultsFound" @loading-status="onLoadingStatus" />
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
    <div v-if="!hasSearched && !isLoading" class="text-center my-5">
      <img :src="searchPageLogo" alt="Search" style="max-width: 250px;  margin-top: 100px;" />
      <h5 class="mt-3">Start by searching for a recipe!</h5>
    </div>

    <div v-else-if="isLoading" class="text-center my-5">
      <img :src="searchPageLogo" alt="Loading" class="search-illustration-loading" />
      <h5 class="mt-3">Looking for delicious recipes...</h5>
    </div>
    </div>
</template>


<script>
import { onMounted, ref } from 'vue';
import SearchBox from '../components/SearchBox.vue';
import RecipePreview from '../components/RecipePreview.vue';
import searchPageLogo from '../assets/searchPageLogo.jpg'


export default {
  name: 'SearchPage',
  components: {
    SearchBox,
    RecipePreview
  },

  setup() {
    const recipesFromChild = ref([]);
    const hasSearched = ref(false);
    const isLoading = ref(false)
    const onLoadingStatus = (status) => {
      isLoading.value = status
    }
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
      updateFavorite,
      isLoading,
      onLoadingStatus,
      searchPageLogo
    };
  }
};
</script>
<style scoped>
h1.title {
  text-align: center;
}
</style>
<style scoped>
.search-illustration-loading {
  margin-top: 100px;
  max-width: 200px;
  height: auto;
  animation: pulse 1.5s infinite alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.05);
    opacity: 1;
  }
}
</style>

