<template>
  <div
    class="modal fade"
    id="createRecipeModal"
    tabindex="-1"
    aria-labelledby="createRecipeModalLabel"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <form id="createRecipeForm" @submit.prevent="submitRecipe">
          <div class="modal-header">
            <h5 class="modal-title" id="createRecipeModalLabel">Create New Recipe</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <!-- BASIC INFO -->
            <div class="mb-3">
              <label class="form-label">Title</label>
              <input v-model="title" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea v-model="description" class="form-control" required></textarea>
            </div>

            <div class="row mb-3">
              <div class="col">
                <label class="form-label">Ready in Minutes</label>
                <input type="number" min="1" v-model="readyInMinutes" class="form-control" required />
              </div>
              <div class="col">
                <label class="form-label">Servings</label>
                <input type="number" min="1" v-model="servings" class="form-control" required />
              </div>
            </div>

            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" v-model="vegan" />
              <label class="form-check-label">Vegan</label>
            </div>
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" v-model="vegetarian" />
              <label class="form-check-label">Vegetarian</label>
            </div>
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" v-model="glutenFree" />
              <label class="form-check-label">Gluten Free</label>
            </div>

            <!-- INGREDIENTS -->
            <div class="mb-3">
              <label class="form-label">Ingredients</label>
              <div v-for="(ingredient, index) in extendedIngredients" :key="index" class="input-group mb-2">
                <input v-model="extendedIngredients[index]" class="form-control" placeholder="Enter ingredient" />
                <button type="button" class="btn btn-outline-danger" @click="removeIngredient(index)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <button type="button" class="btn btn-outline-primary" @click="addIngredient">
                Add Ingredient
              </button>
            </div>

            <!-- INSTRUCTIONS -->
            <div>
              <label class="form-label">Instruction Groups</label>
              <div
                v-for="(group, gIndex) in analyzedInstructions"
                :key="gIndex"
                class="mb-3 border p-3 rounded"
              >
                <div class="d-flex justify-content-between">
                  <input v-model="group.name" class="form-control mb-2" placeholder="Group name" />
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger ms-2"
                    @click="removeGroup(gIndex)"
                  >
                    <i class="bi bi-x-circle"></i>
                  </button>
                </div>
                <div
                  v-for="(step, sIndex) in group.steps"
                  :key="sIndex"
                  class="input-group mb-2"
                >
                  <input v-model="group.steps[sIndex]" class="form-control" placeholder="Step" />
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    @click="removeStep(gIndex, sIndex)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
                <button type="button" class="btn btn-sm btn-outline-secondary" @click="addStep(gIndex)">
                  Add Step
                </button>
              </div>
              <button type="button" class="btn btn-outline-primary" @click="addGroup">
                Add Instruction Group
              </button>
            </div>
            <div class="mb-3">
              <label class="form-label">Image URL</label>
              <input v-model="imageUrl" class="form-control" placeholder="Enter image URL" @input="onImageUrlChange" />
              <div v-if="previewImage" class="mt-2">
                <img :src="previewImage" alt="Image Preview" style="max-width: 200px; max-height: 150px;" />
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-success w-100">Submit Recipe</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import { Modal } from 'bootstrap'
// Toast
const toast = useToast()

// Modal DOM ref
const modalRef = ref(null)

// Bootstrap modal instance method
function showModal() {
  if (!modalRef.value) return
  const modal = new Modal(modalRef.value)
  modal.show()
}

// Expose showModal() to parent
defineExpose({ showModal })

// Form data
const title = ref('')
const description = ref('')
const readyInMinutes = ref(1)
const servings = ref(1)
const vegan = ref(false)
const vegetarian = ref(false)
const glutenFree = ref(false)
const extendedIngredients = ref([''])
const analyzedInstructions = ref([{ name: '', steps: [''] }])
const imageUrl = ref('')
const previewImage = ref(null)

function onImageUrlChange() {
  // Basic validation (optional, improve as needed)
  if (imageUrl.value.trim().startsWith('http')) {
    previewImage.value = imageUrl.value.trim()
  } else {
    previewImage.value = null
  }
}


function addIngredient() {
  const last = extendedIngredients.value.at(-1)
  if (!last || last.trim() === '') {
    toast.error('Please fill in the last ingredient before adding another.')
    return
  }
  extendedIngredients.value.push('')
}

function removeIngredient(index) {
  extendedIngredients.value.splice(index, 1)
}

function addGroup() {
  const last = analyzedInstructions.value.at(-1)
  if (!last || last.name.trim() !== '' && last.steps.every(s => s.trim() !== '')) {
    analyzedInstructions.value.push({ name: '', steps: [''] })
  } else {
    toast.error('Please complete the current group before adding a new one.')
  }
}

function removeGroup(gIndex) {
  analyzedInstructions.value.splice(gIndex, 1)
}

function addStep(gIndex) {
  const group = analyzedInstructions.value[gIndex]
  const lastStep = group.steps.at(-1)
  if (lastStep.trim() === '') {
    toast.error('Please fill in the previous step before adding another.')
    return
  }
  group.steps.push('')
}

function removeStep(gIndex, sIndex) {
  analyzedInstructions.value[gIndex].steps.splice(sIndex, 1)
}

async function submitRecipe() {
  try {
    const image = imageUrl.value.trim() || "https://spoonacular.com/recipeImages/placeholder.png";
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
      analyzedInstructions: analyzedInstructions.value.map(group => ({
        name: group.name,
        steps: group.steps.filter(s => s.trim() !== '').map((step, i) => ({
          number: i + 1,
          step: step
        }))
      })),
      popularity: 0,
      image: image,
    }

    await axios.post("/users/RecipeDB", recipeData)

    // Close modal
    const modalEl = modalRef.value
    const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl)
    modalInstance.hide()

    toast.success('Recipe submitted successfully!')
  } catch (error) {
    toast.error('Error submitting recipe.')
  }
}

</script>

<style scoped>
.modal-dialog {
  max-width: 800px;
  overflow-y: auto;
}
.modal-content {
  overflow-y: auto;
}
.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
