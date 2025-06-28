<template>
  <div class="register-page d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow-lg p-4" style="width: 100%; max-width: 500px;">
      <div class="text-center mb-4">
        <img :src="registerPageLogo" alt="Register Page Logo" class="img-fluid mb-3" style="max-height: 200px;" />
        <h2 class="fw-bold">Create Account</h2>
      </div>

      <form @submit.prevent="register" novalidate>
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input
            v-model="state.username"
            @blur="v$.username.$touch"
            type="text"
            class="form-control"
            placeholder="Enter username"
          />
          <div v-if="v$.username.$error && v$.username.$dirty" class="form-text text-danger small">
            Username must be 3–8 letters only.
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <input
            v-model="state.password"
            @blur="v$.password.$touch"
            type="password"
            class="form-control"
            placeholder="Enter password"
          />
          <div v-if="v$.password.$error && v$.password.$dirty" class="form-text text-danger small">
            5–10 characters, includes digit & special character.
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Confirm Password</label>
          <input
            v-model="state.confirmPassword"
            @blur="v$.confirmPassword.$touch"
            type="password"
            class="form-control"
            placeholder="Confirm password"
          />
          <div v-if="v$.confirmPassword.$error && v$.confirmPassword.$dirty" class="form-text text-danger small">
            Passwords must match.
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input
            v-model="state.email"
            @blur="v$.email.$touch"
            type="email"
            class="form-control"
            placeholder="Enter email"
          />
          <div v-if="v$.email.$error && v$.email.$dirty" class="form-text text-danger small">
            A valid email is required.
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">First Name</label>
          <input
            v-model="state.firstname"
            @blur="v$.firstname.$touch"
            type="text"
            class="form-control"
            placeholder="Enter first name"
          />
          <div v-if="v$.firstname.$error && v$.firstname.$dirty" class="form-text text-danger small">
            First name is required.
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Last Name</label>
          <input
            v-model="state.lastname"
            @blur="v$.lastname.$touch"
            type="text"
            class="form-control"
            placeholder="Enter last name"
          />
          <div v-if="v$.lastname.$error && v$.lastname.$dirty" class="form-text text-danger small">
            Last name is required.
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label">Country</label>
          <select
            v-model="state.country"
            @blur="v$.country.$touch"
            class="form-select"
          >
            <option disabled value="">Select a country</option>
            <option v-for="country in countries" :key="country.cca3" :value="country.name.common">
              {{ country.name.common }}
            </option>
          </select>
          <div v-if="v$.country.$error && v$.country.$dirty" class="form-text text-danger small">
            Country selection is required.
          </div>
        </div>

        <button type="submit" class="btn btn-success w-100">
          Register
        </button>
      </form>
    </div>
  </div>
</template>



<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, sameAs, email, maxLength } from '@vuelidate/validators';
import { useToast } from "vue-toastification";
import registerPageLogo from '../assets/registerPageLogo.jpeg';

export default {
  name: "RegisterPage",
  setup(_, { expose }) {
    const state = reactive({
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      firstname: '',
      lastname: '',
      country: '',
    });

    const countries = ref([]);

    onMounted(async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca3');
        const data = await response.json();
        countries.value = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
      } catch (error) {
        console.error('Failed to load countries:', error);
      }
    });

    const hasDigitAndSpecial = (value) => {
      if (!value) return false;
      const digitRegex = /\d/;
      // eslint-disable-next-line no-useless-escape
      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`';]/;
      return digitRegex.test(value) && specialCharRegex.test(value);
    };
    const lettersOnly = (value) => {
      if (!value) return false;
      const letterRegex = /^[a-zA-Z]+$/;
      return letterRegex.test(value);
    };

    const rules = computed(() => ({
      username: { required, minLength: minLength(3), maxLength: maxLength(8), lettersOnly },
      password: { required, minLength: minLength(5), maxLength: maxLength(10), hasDigitAndSpecial },
      confirmPassword: {
        required,
        sameAsPassword: sameAs(state.password, 'Passwords must match')
      },
      email: { required, email },
      firstname: { required },
      lastname: { required },
      country: { required },
    }));

    const v$ = useVuelidate(rules, state);
    const toast = useToast();
    const register = async () => {
      if (await v$.value.$validate()) {
        try {
          await window.axios.post('/Register', {
            username: state.username,
            password: state.password,
            email: state.email,
            firstname: state.firstname,
            lastname: state.lastname,
            country: state.country,
          });
          window.router.push('/login');
          toast.success("Registration successful!");
        } catch (err) {
          toast.error("Username or email already exists.");
        }
      }
    };

    expose({ register });

    return { state, v$, register, countries, registerPageLogo };
  }
};

</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: auto;
}
.register-page-logo {
  max-width: 300px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
