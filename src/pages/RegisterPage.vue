<template>
  <div class="register-page">
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <label>Username:</label>
        <input v-model="state.username" type="text" class="form-control" />
        <div v-if="v$.username.$error" class="text-danger">
          Username is required.
        </div>
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input v-model="state.password" type="password" class="form-control" />
        <div v-if="v$.password.$error" class="text-danger">
          Password is required (at least 6 characters).
        </div>
      </div>
      <div class="form-group">
        <label>Confirm Password:</label>
        <input v-model="state.confirmPassword" type="password" class="form-control" />
        <div v-if="v$.confirmPassword.$error" class="text-danger">
          Passwords must match.
        </div>
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input v-model="state.email" type="email" class="form-control" />
        <div v-if="v$.email.$error" class="text-danger">
          Email is required.
        </div>
      </div>
      <div class="form-group">
        <label>First Name:</label>
        <input v-model="state.firstname" type="text" class="form-control" />
        <div v-if="v$.firstname.$error" class="text-danger">
          First Name is required.
        </div>
      </div>
      <div class="form-group">
        <label>Last Name:</label>
        <input v-model="state.lastname" type="text" class="form-control" />
        <div v-if="v$.lastname.$error" class="text-danger">
          Last Name is required.
        </div>
      </div>
      <div class="form-group">
        <label>Country:</label>
        <input v-model="state.country" type="text" class="form-control" />
        <div v-if="v$.country.$error" class="text-danger">
          Country is required.
        </div>
      </div>
      <button type="submit" class="btn btn-success mt-3">Register</button>
    </form>
  </div>
</template>

<script>
import { reactive, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, sameAs, email } from '@vuelidate/validators';

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

    const rules = computed(() => ({
      username: { required },
      password: { required, minLength: minLength(6) },
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
        } catch (err) {
          window.toast("Registration failed", err.response.data.message, "danger");
        }
      }
    };

    expose({ register });

    return { state, v$, register };
  }
};
</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: auto;
}
</style>
