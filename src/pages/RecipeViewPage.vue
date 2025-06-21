<template>
  <div class="container">
    <div v-if="recipe">
      <div class="recipe-header mt-3 mb-4">
        <h1>{{ recipe.title }}</h1>
        <img :src="recipe.image" class="center" />
      </div>
      <div class="recipe-body">
        <div class="wrapper">
          <div class="wrapped">
            <div class="mb-3">
              <div>Ready in {{ recipe.readyInMinutes }} minutes</div>
              <div>Likes: {{ recipe.popularity }} likes</div>
            </div>
            <strong>Ingredients:</strong>
            <ul>
              <li
                v-for="(r, index) in recipe.extendedIngredients"
                :key="index + '_' + r.id"
              >
                {{ r.original }}
              </li>
            </ul>
          </div>
          <div class="wrapped">
            <strong>Instructions:</strong>
            <ol>
              <li v-for="s in recipe._instructions" :key="s.number">
                {{ s.step }}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const customInstructions = [
  {
    name: "Default",
    steps: [
      {
        number: 1,
        step: "Preheat the oven to 350°F.",
        equipment: [
          {
            id: 404784,
            image: "oven.jpg",
            name: "oven",
            temperature: {
              number: 350,
              unit: "Fahrenheit"
            }
          }
        ]
      }
    ]
  }
];

export default {
  data() {
    return {
      recipe: null
    };
  },

  async created() {
    console.log("RecipeViewPage created");
    try {
      const id = this.$route.params.recipeId;
      let response;

      try {
        response = await this.axios.get(
          this.$root.store.server_domain + "/recipes/searchById/" + id
        );

        if (response.status !== 200) {
          this.$router.replace("/NotFound");
          return;
        }
      } catch (error) {
        console.log("error.response.status", error.response?.status || error);
        this.$router.replace("/NotFound");
        return;
      }
      console.log("response.data chekc if analyzedInstruction", response.data);

      const {
        instructions,
        extendedIngredients,
        popularity,
        readyInMinutes,
        image,
        title
      } = response.data;

      const analyzedInstructions = customInstructions

      const _instructions = analyzedInstructions.flatMap(fstep =>
        fstep.steps.map(step => ({
          ...step,
          step: (fstep.name ? fstep.name + ": " : "") + step.step
        }))
      );

      this.recipe = {
        instructions,
        _instructions,
        analyzedInstructions,
        extendedIngredients,
        popularity,
        readyInMinutes,
        image,
        title
      };
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  }
};
</script>

<style scoped>
/* Container with some padding and max width for readability */
.container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background: #fafafa;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

/* Header with spacing and center alignment */
.recipe-header {
  text-align: center;
  margin-bottom: 2rem;
}

.recipe-header h1 {
  font-weight: 700;
  font-size: 2.75rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}

/* Center the image with a soft rounded border and shadow */
.center {
  display: block;
  margin: 0 auto;
  width: 60%;
  max-width: 400px;
  border-radius: 16px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.15);
  transition: transform 0.3s ease;
}

.center:hover {
  transform: scale(1.05);
}

/* Wrapper to place ingredients and instructions side by side */
.wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
}

/* Each column takes half width on desktop, full on mobile */
.wrapped {
  flex: 1 1 45%;
  background: #fff;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: box-shadow 0.3s ease;
}

.wrapped:hover {
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

/* Titles for ingredients and instructions */
strong {
  display: block;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #34495e;
  letter-spacing: 0.8px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.3rem;
  font-weight: 700;
}

/* Lists styling */
ul {
  list-style-type: disc;
  padding-left: 1.2rem;
  color: #555;
  line-height: 1.5;
}

ol {
  padding-left: 1.2rem;
  color: #555;
  line-height: 1.6;
}

/* Each instruction step spacing */
ol li {
  margin-bottom: 0.8rem;
}

/* Ready time and likes box */
.mb-3 {
  background: #eaf3fc;
  border-left: 5px solid #3498db;
  padding: 0.8rem 1rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  border-radius: 6px;
  box-shadow: inset 0 0 10px #d0e4fc;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .wrapped {
    flex: 1 1 100%;
  }
  .center {
    width: 100%;
  }
}
</style>

