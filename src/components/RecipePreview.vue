<template>
  <div class="card h-100 recipe-card shadow-sm" @click="openRecipeViewPage">
    <img
      v-if="recipe.image"
      :src="recipe.image"
      class="card-img-top recipe-image"
      alt="Recipe image"
    />

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
        <button @click="toggleLike" class="btn-icon" :title="liked ? 'Unlike' : 'Like'">
          <i :class="liked ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
        </button>
        <button @click="toggleFavorite" class="btn-icon" :title="favorited ? 'Unfavorite' : 'Favorite'">
          <i :class="favorited ? 'bi bi-star-fill' : 'bi bi-star'"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>

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
      liked: false,
      favorited: false
    };
  },
  methods: {
    toggleLike(event) {
      event.stopPropagation(); // prevent routing on button click
      this.liked = !this.liked;
    },
    toggleFavorite(event) {
      event.stopPropagation(); // prevent routing on button click
      this.favorited = !this.favorited;
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
</style>
