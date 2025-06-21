<template>
  <div class="search-box container my-5">
    <div class="d-flex flex-wrap align-items-center gap-2 justify-content-center bg-white p-3 rounded shadow-sm">

      <!-- Search Input -->
      <div class="flex-grow-1">
        <div class="input-group">
          <input
            type="text"
            class="form-control rounded-pill px-4"
            placeholder="Search Recipes"
            v-model="state.search_input"
          />
        </div>
      </div>

      <!-- Cuisine Dropdown -->
      <div>
        <select class="form-select rounded-pill px-4" v-model="state.cuisine">
          <option value="">Cuisine</option>
          <option v-for="option in cuisines" :key="option" :value="option">{{ option }}</option>
        </select> 
      </div>


      <!-- Diet Dropdown -->
      <div>
        <select class="form-select rounded-pill px-4" v-model="state.diet">
          <option value="">Diet</option>
          <option v-for="option in diets" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>

      <!-- Intolerances Dropdown -->
      <div>
        <select class="form-select rounded-pill px-4" v-model="state.intolerances">
          <option value="">Intolerances</option>
          <option v-for="option in intolerances" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>

      <!-- Results Dropdown -->
      <div>
        <select class="form-select rounded-pill px-4" v-model="state.results_amount">
          <option value="5">5 results</option>
          <option value="10">10 results</option>
          <option value="15">15 results</option>
        </select>
      </div>

      <!-- Search Button with Spinner -->
      <div>
        <button
          class="btn btn-warning rounded-pill px-4 py-2 d-flex align-items-center"
          @click="OnSubmit"
          :disabled="state.isLoading"
        >
          <span v-if="!state.isLoading">
            <i class="bi bi-search me-2"></i> Search
          </span>
          <span v-else class="d-flex align-items-center gap-2">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...
          </span>
        </button>
      </div>

    </div>
  </div>
</template>
<script>
import { reactive } from 'vue';
import { useToast } from "vue-toastification";

export default {
  name: 'SearchBox',
  setup() {
    const state = reactive({
      search_input: '',
      results_amount: '5',
      cuisine: '',
      diet: '',
      intolerances: '',
      isLoading: false,
    });

    const cuisines = [
      "African", "Asian", "American", "British", "Cajun", "Caribbean", "Chinese",
      "Eastern European", "European", "French", "German", "Greek", "Indian", "Irish",
      "Italian", "Japanese", "Jewish", "Korean", "Latin American", "Mediterranean",
      "Mexican", "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"
    ];

    const diets = [
      "Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian",
      "Vegan", "Pescetarian", "Paleo", "Primal", "Low FODMAP", "Whole30"
    ];

    const intolerances = [
      "Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame",
      "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"
    ];
    const toast = useToast();
    const OnSubmit = async () => {
      state.isLoading = true;
        try {
            const response = await window.axios.get('/recipes/search', {
            params: {
                query: state.search_input,
                number: state.results_amount,
                cuisine: state.cuisine,
                diet: state.diet,
                intolerance: state.intolerances
            }
          });
          const recipes = response.data;
          state.recipes = [];
          state.recipes.push(...recipes);
          console.log(state.recipes);
        } catch (err) {
          toast.error("Invalid Search, Please check your input.");
        } finally {
          state.isLoading = false;
        }
    };

    return { state, cuisines, diets, intolerances, OnSubmit };
  }
};
</script>

<style scoped>
.search-box {
  background-color: #f8f9fa;
  border-radius: 2rem;
}

.form-control,
.form-select {
  min-width: 180px;
  height: 45px;
}

.btn {
  min-width: 120px;
  font-weight: bold;
}
</style>