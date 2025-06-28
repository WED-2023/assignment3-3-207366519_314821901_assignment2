<template>
  <div class="card h-100 recipe-card shadow-sm" @click="openRecipeViewPage">
    
  <div class="image-wrapper">
    <img
      v-if="recipe.image"
      :src="recipe.image"
      class="card-img-top recipe-image"
      alt="Recipe image"
    />
    <i
      v-if="recipe.isViewedRecipe"
      class="bi bi-eye-fill eye-icon"
      title="Viewed"
    ></i>
  </div>
    <div class="card-body text-center">
      <h5 class="card-title">{{ recipe.title }}</h5>

      <p class="card-text mb-1">
        <i class="bi bi-clock me-1"></i>{{ recipe.readyInMinutes }} Minutes
      </p>

      <p class="card-text">
        <i class="bi bi-fire me-1"></i>{{ recipe.popularity }}
      </p>
    </div>

    <!-- Fixed icon section -->
    <div class="card-footer d-flex justify-content-between align-items-center icon-footer">
      <div class="d-flex align-items-center">
        <i
          v-if="recipe.vegan"
          class="bi bi-leaf icon-vegan"
          title="Vegan"
        ></i>
        <i
          v-if="recipe.vegetarian"
          class="bi bi-egg-fried icon-vegetarian"
          title="Vegetarian"
        ></i>
        <i
          class="bi bi-flower1 icon-glutenfree"
          :title="recipe.glutenFree ? 'Gluten-Free' : 'Contains Gluten'"
          :style="{ color: recipe.glutenFree ? '#4caf50' : '#ff5252' }"
        ></i>
      </div>

      <div class="d-flex align-items-center">
        <button
          @click="toggleFavorite"
          class="btn-icon"
        >
          <i
            :class="favorited ? 'bi bi-star-fill' : 'bi bi-star'"
          ></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { useToast } from "vue-toastification";

export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      favorited: this.recipe.isFavoriteRecipe || false,
      toast: null // we'll assign it on created hook

    };
  },
  created() {
    this.toast = useToast(); // initialize toast instance
  },
  methods: {
    async toggleFavorite(event) {
      event.stopPropagation();
      if (!window.store.username) {
        this.toast.error("Log in to mark this recipe as a favorite.");
        return;
      }
      const newFavoritedState = !this.favorited;
      this.favorited = newFavoritedState;
      try {
        if (newFavoritedState) {
          this.$emit('update-popularity-increase', this.recipe.id)
          this.$emit("update-favorite", { id: this.recipe.id, isFavorite: true });
          await this.axios.post(
            this.$root.store.server_domain + "/users/favorites/",
            { recipeId: this.recipe.id }
          );
        } else {
          this.$emit('update-popularity-decrease', this.recipe.id)
          this.$emit("update-favorite", { id: this.recipe.id, isFavorite: false });
          await this.axios.delete(
            this.$root.store.server_domain + "/users/favorites/",
            { data: { recipeId: this.recipe.id } }
          );
        }
      } catch (error) {
        this.toast.error("Failed to update favorite status.");
        // rollback state on error
        this.favorited = !newFavoritedState;
      }
    },
    openRecipeViewPage() {
      localStorage.setItem('currentFullViewRecipe', JSON.stringify(this.recipe));
      this.$router.push({ name: 'recipe', params: { recipeId: this.recipe.id } });
    }
  }
};
</script>


<style scoped>
.recipe-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

.card-body {
  padding: 1rem;
  flex-grow: 1;
}

.card-footer.icon-footer {
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #eaeaea;
}

.icon-vegan,
.icon-vegetarian,
.icon-glutenfree {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.icon-vegan {
  color: #28a745;
}
.icon-vegetarian {
  color: #ff9800;
}
.icon-glutenfree {
  color: #ff5252;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.4rem;
  margin-left: 0.75rem;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
}
.btn-icon:hover {
  transform: scale(1.2);
}
.image-wrapper {
  position: relative;
}

/* Hide the eye by default */
.eye-icon {
  position: absolute;
  top: 8px;
  left: 8px; /* or right: 8px; */
  font-size: 1.4rem;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 60%;
  padding: 6px;
  z-index: 2;
  transition: transform 0.2s ease-in-out;
}

/* When hovered, make it bigger */
.eye-icon:hover {
  transform: scale(1.3);
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}


</style>
