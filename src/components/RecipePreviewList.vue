<template>
  <div class="container mb-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0">{{ title }}</h3>
      <i
        v-if="endpoint === '/recipes/random'"
        class="bi bi-arrow-clockwise refresh-icon"
        @click="refreshRandomRecipes"
        title="Refresh Random Recipes"
      ></i>
    </div>

      <div class="row g-4">
        <div
          class="col"
          :class="`col-md-${Math.floor(12 / Math.min(recipes.length, 4))}`"
          v-for="r in recipes"
          :key="r.id"
        >
          <RecipePreview
            class="recipePreview"
            :recipe="r"
            @update-popularity-increase="increasePopularity"
            @update-popularity-decrease="decreasePopularity"
            @update-favorite="updateFavorite"
          />
        </div>
      </div>
  </div>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";

const RANDOM_STORAGE_KEY = "cached_random_recipes";

export default {
  name: "RecipePreviewList",
  components: { RecipePreview },
  props: {
    title: { type: String, required: true },
    endpoint: { type: String, required: true },
    withCredentials: { type: Boolean, default: false }
  },
  data() {
    return { recipes: [] };
  },
  mounted() {
    this.updateRecipes();
  },
  methods: {
    async updateRecipes() {
      if (this.endpoint === "/recipes/random") {
        const cached = localStorage.getItem(RANDOM_STORAGE_KEY);
        if (cached) {
          this.recipes = JSON.parse(cached);
          return;
        }
      }

      try {
        const response = await this.axios.get(
          this.$root.store.server_domain + this.endpoint,
          this.withCredentials ? { withCredentials: true } : undefined
        );
        this.recipes = [...response.data];
        if (this.recipes.length === 0) {
          this.$emit("recipes-empty");
        }

        if (this.endpoint === "/recipes/random") {
          localStorage.setItem(RANDOM_STORAGE_KEY, JSON.stringify(this.recipes));
        }
      } catch (error) {
        console.log("Error getting recipes", error);
          this.recipes = [];
          this.$emit("recipes-empty");
      }
    },
    async refreshRandomRecipes() {
      localStorage.removeItem(RANDOM_STORAGE_KEY);
      await this.updateRecipes();
    },
    increasePopularity(id) {
      const recipe = this.recipes.find(r => r.id === id);
      if (recipe) {
        recipe.popularity++;
        this.updateRandomStorage();
      }
    },
    decreasePopularity(id) {
      const recipe = this.recipes.find(r => r.id === id);
      if (recipe && recipe.popularity > 0) {
        recipe.popularity--;
        this.updateRandomStorage();
      }
    },
    updateFavorite({ id, isFavorite }) {
      const recipe = this.recipes.find(r => r.id === id);
      if (recipe) {
        recipe.isFavoriteRecipe = isFavorite;
        this.updateRandomStorage();
      }
    },
    updateRandomStorage() {
      if (this.endpoint === "/recipes/random") {
        localStorage.setItem(RANDOM_STORAGE_KEY, JSON.stringify(this.recipes));
      }
    }
  }
};
</script>

<style scoped>
.container {
  min-height: 400px;
}
.refresh-icon {
  font-size: 1.5rem;
  color: #007bff;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.refresh-icon:hover {
  transform: rotate(90deg) scale(1.2);
}
</style>
