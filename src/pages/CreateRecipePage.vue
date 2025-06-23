<template>
  <div class="container my-5">
    <div class="card shadow-sm p-4">
      <h2 class="mb-4 text-primary text-center">Create New Recipe</h2>
      <form @submit.prevent="submitRecipe">

        <!-- Title -->
        <div class="mb-3">
          <label class="form-label fw-bold">Title</label>
          <input v-model="title" type="text" class="form-control" required />
        </div>

        <!-- Description -->
        <div class="mb-3">
          <label class="form-label fw-bold">Description</label>
          <textarea v-model="description" class="form-control" rows="2" required></textarea>
        </div>

        <!-- Time & Servings -->
        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label fw-bold">Ready in Minutes</label>
            <input v-model.number="readyInMinutes" type="number" class="form-control" min="1" required />
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold">Servings</label>
            <input v-model.number="servings" type="number" class="form-control" min="1" required />
          </div>
        </div>

        <!-- Ingredients -->
        <h5 class="mt-4 text-success">Ingredients</h5>
        <div v-for="(ingredient, index) in extendedIngredients" :key="index" class="mb-2 d-flex align-items-center gap-2">
          <input
            v-model="extendedIngredients[index]"
            type="text"
            class="form-control"
            placeholder="Enter ingredient"
            required
          />
          <button type="button" class="btn btn-outline-danger btn-sm" @click="removeIngredient(index)">
            &times;
          </button>
        </div>
        <button type="button" class="btn btn-outline-secondary btn-sm mb-3" @click="addIngredient">+ Add Ingredient</button>

        <!-- Instructions -->
        <h5 class="mt-4 text-success">Instructions</h5>
        <div v-for="(group, gIndex) in analyzedInstructions" :key="gIndex" class="mb-4 p-3 border rounded bg-light">
          <input
            v-model="group.name"
            type="text"
            class="form-control mb-2"
            placeholder="Group name (e.g. Preparation)"
          />
          <ol class="ps-3">
            <li v-for="(step, sIndex) in group.steps" :key="sIndex" class="d-flex align-items-center gap-2 mb-2">
              <input
                v-model="group.steps[sIndex]"
                type="text"
                class="form-control"
                placeholder="Instruction step"
                required
              />
              <button type="button" class="btn btn-outline-danger btn-sm" @click="removeStep(gIndex, sIndex)">×</button>
            </li>
          </ol>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="addStep(gIndex)">+ Add Step</button>
            <button type="button" class="btn btn-outline-warning btn-sm" @click="removeGroup(gIndex)">Remove Group</button>
          </div>
        </div>
        <button type="button" class="btn btn-outline-primary btn-sm mb-4" @click="addGroup">+ Add Instruction Group</button>

        <!-- Tags -->
        <h5 class="text-success">Tags</h5>
        <div class="form-check mb-2">
          <input v-model="vegan" type="checkbox" class="form-check-input" id="veganCheck" />
          <label class="form-check-label" for="veganCheck">Vegan</label>
        </div>
        <div class="form-check mb-2">
          <input v-model="vegetarian" type="checkbox" class="form-check-input" id="vegetarianCheck" />
          <label class="form-check-label" for="vegetarianCheck">Vegetarian</label>
        </div>
        <div class="form-check mb-4">
          <input v-model="glutenFree" type="checkbox" class="form-check-input" id="glutenFreeCheck" />
          <label class="form-check-label" for="glutenFreeCheck">Gluten Free</label>
        </div>

        <!-- Submit -->
        <button type="submit" class="btn btn-success w-100">Submit Recipe</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from "vue-toastification";
import axios from 'axios';

const toast = useToast()

// Basic fields
const title = ref('')
const description = ref('')
const readyInMinutes = ref(1)
const servings = ref(1)
const vegan = ref(false)
const vegetarian = ref(false)
const glutenFree = ref(false)
const extendedIngredients = ref([''])
const analyzedInstructions = ref([
  {
    name: '',        // Group name (e.g., "Preparation")
    steps: ['']      // Array of steps as strings inside this group
  }
])




function addIngredient() {
  if (extendedIngredients.value.length === 0) {
    extendedIngredients.value.push('')
    return
  }

  const last = extendedIngredients.value[extendedIngredients.value.length - 1]
  if (!last || last.trim() === '') {
    toast.error('Please fill in the last ingredient before adding another.')
    return
  }
  extendedIngredients.value.push('')
}

function removeIngredient(index) {
  extendedIngredients.value.splice(index, 1)
}


function removeGroup(gIndex) {
  analyzedInstructions.value.splice(gIndex, 1)
}

function removeStep(gIndex, sIndex) {
  analyzedInstructions.value[gIndex].steps.splice(sIndex, 1)
}
function addGroup() {
  // Check if there is no group yet OR
  // last group has a non-empty name AND all its steps are non-empty
  if (
    analyzedInstructions.value.length === 0 ||
    (
      analyzedInstructions.value.at(-1).name.trim() !== '' &&
      analyzedInstructions.value.at(-1).steps.every(step => step.trim() !== '')
    )
  ) {
    analyzedInstructions.value.push({ name: '', steps: [''] })
  } else {
    toast.error('Please fill in the previous group name and all its steps before adding a new group.')
  }
}

function addStep(gIndex) {
  const group = analyzedInstructions.value[gIndex]
  // Only add a new step if the last step is not empty
  if (group.steps.length === 0 || group.steps.at(-1).trim() !== '') {
    group.steps.push('')
  } else {
    toast.error('Please fill in the previous step before adding a new one.')
  }
}


// Submit handler
async function submitRecipe() {
    const instructionsWithObjects = analyzedInstructions.value.map(group => ({
    name: group.name,
    steps: group.steps
        .filter(s => s.trim() !== "")
        .map((stepText, index) => ({
        number: index + 1,
        step: stepText
        }))
    }));

  const recipeData = {
    title: title.value,
    description: description.value,
    readyInMinutes: readyInMinutes.value,
    servings: servings.value,
    vegan: vegan.value,
    vegetarian: vegetarian.value,
    glutenFree: glutenFree.value,
    extendedIngredients: extendedIngredients.value
      .filter(i => i.trim() !== '')
      .map(str => ({ original: str })),
    analyzedInstructions: instructionsWithObjects,
    popularity: 0, // Default popularity 
    image:"https://spoonacular.com/recipeImages/placeholder.png" // Placeholder image
  };

  await axios.post("/users/RecipeDB", recipeData);
}

</script>


<style scoped>
.container {
  max-width: 600px;
}
</style>


