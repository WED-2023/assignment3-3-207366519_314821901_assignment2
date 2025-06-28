<template>
  <div class="container">
    <h1 class="mb-4">Family Recipes</h1>
    <div v-if="recipes.length === 0">
      <p>No family recipes found.</p>
    </div>
    <div v-else>
      <div
        v-for="recipe in recipes"
        :key="recipe.id"
        class="recipe-card mb-5 p-4"
      >
        <h2>{{ recipe.title }}</h2>
        <img
          :src="getImage()"
          alt="Recipe Image"
          class="recipe-image"
        />
        <div class="mb-2">Ready in: {{ recipe.readyInMinutes }} minutes</div>
        <div class="mb-2">Likes: {{ recipe.popularity }}</div>
        <div class="mb-2">Servings: {{ recipe.servings }}</div>

        <div class="badges">
          <span v-if="recipe.vegan" class="badge vegan">Vegan</span>
          <span v-if="recipe.vegetarian" class="badge vegetarian">Vegetarian</span>
          <span class="badge" :class="recipe.glutenFree ? 'glutenfree' : 'contains-gluten'">
            {{ recipe.glutenFree ? 'Gluten-Free' : 'Contains Gluten' }}
          </span>
        </div>

        <strong>Ingredients:</strong>
        <ul>
          <li v-for="(ing, i) in recipe.extendedIngredients" :key="i + '_' + ing.id">
            {{ ing.original }}
          </li>
        </ul>

        <strong>Instructions:</strong>
        <ol>
          <li
            v-for="step in parseInstructions(recipe.analyzedInstructions)"
            :key="step.number"
          >
            {{ step.step }}
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recipes: []
    };
  },
  async created() {
    try {
      const response = await this.axios.get(this.$root.store.server_domain + "/familyrecipes");
      if (response.status === 200) {
        this.recipes = response.data;
      } else {
        console.warn("Failed to fetch family recipes.");
      }
    } catch (error) {
      console.error("Error fetching family recipes:", error);
    }
  },
  methods: {
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
    getImage() {
      // You can change this logic per recipe if needed.
      // Assuming all family recipes should use a static image
      return "/BeansGrandmother.jpg";
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
  color: #333;
}

.recipe-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.recipe-card h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.recipe-image {
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  margin: 1rem 0;
  display: block;
}

.badges {
  margin-bottom: 1rem;
}
.badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  margin-right: 0.5rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}
.vegan {
  background-color: #28a745;
  color: #fff;
}
.vegetarian {
  background-color: #ff9800;
  color: #fff;
}
.glutenfree {
  background-color: #4caf50;
  color: #fff;
}
.contains-gluten {
  background-color: #f44336;
  color: #fff;
}

ul,
ol {
  padding-left: 1.5rem;
}
</style>
