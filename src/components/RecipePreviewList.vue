<template>
  <div class="container">
    <h3>{{ title }}</h3>
    <div class="row">
      <div class="col" v-for="r in recipes" :key="r.id">
        <RecipePreview
          class="recipePreview"
          :recipe="r"
          @update-popularity-increase="increasePopularity"
          @update-popularity-decrease="decreasePopularity"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";

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
      try {
        const response = await this.axios.get(
          this.$root.store.server_domain + this.endpoint,
          this.withCredentials ? { withCredentials: true } : undefined
        );
        this.recipes = [];
        this.recipes.push(...response.data);
      } catch (error) {
        console.log("Error getting recipes", error);
      }
    },
      increasePopularity(id) {
        const recipe = this.recipes.find(r => r.id === id);
        if (recipe) recipe.popularity++;
      },
      decreasePopularity(id) {
        const recipe = this.recipes.find(r => r.id === id);
        if (recipe && recipe.popularity > 0) recipe.popularity--;
      }



  }
};
</script>

<style scoped>
.container {
  min-height: 400px;
}
</style>