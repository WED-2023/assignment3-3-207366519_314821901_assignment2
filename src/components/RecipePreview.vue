<template>
  <div class="card h-100">
    <img
      v-if="recipe.image"
      :src="recipe.image"
      class="card-img-top recipe-image"
      alt="Recipe image"
    />
    <div class="card-body text-center">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="card-text">
        {{ recipe.readyInMinutes }} Minutes <i class="bi bi-clock"></i> 
      </p>
      <p class="card-text">
         {{ recipe.popularity }} <i class="bi bi-heart"></i>
      </p>
      <p class="card-text">
        <i v-if="recipe.vegan" class="bi bi-leaf icon-vegan" title="Vegan"></i>
        <i v-if="recipe.vegetarian" class="bi bi-egg-fried icon-vegetarian" title="Vegetarian"></i>
        <i v-if="!recipe.glutenFree" class="bi bi-flower1 icon-glutenfree" title="Contains Gluten"></i>
        <i v-else class="bi bi-flower1 icon-glutenfree" title="Gluten-Free"></i></p>
      
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
  }
}
</script>

<style scoped>
.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.icon-vegan {
  color: #28a745;
  font-size: 1.5rem;
  margin-right: 0.5rem;
}
.icon-vegetarian {
  color: #ff9800;
  font-size: 1.5rem;
  margin-right: 0.5rem;
}
.icon-glutenfree {
  color: #ff5252;
  font-size: 1.5rem;
}

</style>
