<template>
  <div class="container">
    <h1 class="page-title">Family Recipes</h1>

    <div v-if="recipes.length === 0" class="empty-message">
      <p>No family recipes found.</p>
    </div>

    <div v-else class="slider-wrapper">
      <button class="nav-button left" @click="prevSlide" :disabled="currentIndex === 0">❮</button>

      <transition name="fade" mode="out-in">
        <div :key="currentRecipe.id" class="recipe-card">
          <img :src="getImage(currentRecipe)" alt="Recipe Image" class="recipe-image" />

          <div class="recipe-body">
            <h2 class="recipe-title">{{ currentRecipe.title }}</h2>
            <div class="info-row">
              <span>⏱ {{ currentRecipe.readyInMinutes }} min</span>
              <span>🔥 {{ currentRecipe.popularity }} likes</span>
              <span>🍽 {{ currentRecipe.servings }} servings</span>
            </div>

            <div class="card-footer d-flex justify-content-between align-items-center icon-footer mt-3">
              <div class="d-flex align-items-center">
                <i
                  v-if="currentRecipe.vegan"
                  class="bi bi-leaf icon-vegan"
                  title="Vegan"
                ></i>
                <i
                  v-if="currentRecipe.vegetarian"
                  class="bi bi-egg-fried icon-vegetarian"
                  title="Vegetarian"
                ></i>
                <i
                  class="bi bi-flower1 icon-glutenfree"
                  :title="currentRecipe.glutenFree ? 'Gluten-Free' : 'Contains Gluten'"
                  :style="{ color: currentRecipe.glutenFree ? '#4caf50' : '#ff5252' }"
                ></i>
              </div>
            </div>


            <strong>Ingredients:</strong>
            <ul class="ingredients">
              <li v-for="(ing, i) in currentRecipe.extendedIngredients" :key="i + '_' + ing.id">
                {{ ing.original }}
              </li>
            </ul>

            <strong>Instructions:</strong>
            <ol class="instructions">
              <li v-for="step in parseInstructions(currentRecipe.analyzedInstructions)" :key="step.number">
                {{ step.step }}
              </li>
            </ol>
          </div>
        </div>
      </transition>

      <button class="nav-button right" @click="nextSlide" :disabled="currentIndex === recipes.length - 1">❯</button>
    </div>
  </div>
</template>



<script>
export default {
  data() {
    return {
      recipes: [],
      currentIndex: 0
    };
  },
  computed: {
    currentRecipe() {
      return this.recipes[this.currentIndex] || {};
    }
  },
  async created() {
    try {
      const response = await this.axios.get(this.$root.store.server_domain + "/recipes/familyrecipes");
      if (response.status === 200) {
        this.recipes = response.data;
      }
    } catch (error) {
      console.error("Error fetching family recipes:", error);
    }
  },
  methods: {
    nextSlide() {
      if (this.currentIndex < this.recipes.length - 1) {
        this.currentIndex++;
      }
    },
    prevSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
    parseInstructions(analyzedInstructions) {
      if (!analyzedInstructions) return [];
      try {
        const parsed = typeof analyzedInstructions === "string"
          ? JSON.parse(analyzedInstructions)
          : analyzedInstructions;
        return parsed.flatMap(fstep =>
          fstep.steps.map(step => ({
            ...step,
            step: (fstep.name ? fstep.name + ": " : "") + step.step
          }))
        );
      } catch {
        return [];
      }
    },
    getImage(recipe) {
      if (!recipe?.title) return "/default.jpg";
      const title = recipe.title.toLowerCase();
      if (title.includes("beans")) return "/BeansGrandmother.jpg";
      if (title.includes("bread")) return "/BreadAndEgg.jpg";
      if (title.includes("peppers")) return "/PeppersAndMeat.jpeg";
      return "/default.jpg";
    }
  }
};

</script>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.empty-message {
  text-align: center;
}

.slider-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button {
  background: none;
  border: none;
  font-size: 2.5rem;
  cursor: pointer;
  color: #333;
  transition: color 0.2s;
}

.nav-button:hover {
  color: #007bff;
}

.nav-button:disabled {
  color: #ccc;
  cursor: default;
}

.recipe-card {
  width: 100%;
  max-width: 700px;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 1.5rem;
  transform: scale(0.95); /* Zoom out slightly */
  transition: transform 0.3s ease;
}

.recipe-image {
  width: 100%;
  height: 300px;
  object-fit: contain; /* ensures entire image is visible */
  display: block;
  margin: 0 auto;
  border-radius: 10px;
  padding: 10px; /* optional: space around image inside container */
}


.recipe-title {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.info-row {
  font-size: 0.95rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  color: #777;
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

.card-footer {
  border-top: 1px solid #eaeaea;
  padding-top: 0.75rem;
  margin-top: auto;
}


.ingredients,
.instructions {
  margin: 0.5rem 0 1rem;
  padding-left: 1.2rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}


</style>
