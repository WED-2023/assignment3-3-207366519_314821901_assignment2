<template>
  <div class="login-page d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow-lg p-4" style="width: 100%; max-width: 450px;">
      <div class="text-center mb-4">
        <img :src="loginPageLogo" alt="Login Page Logo" class="img-fluid mb-3" style="max-height: 180px;" />
        <h2 class="fw-bold">Let's Cook Together</h2>
      </div>

      <form @submit.prevent="login">
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
            Username is required.
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
            Password is required (at least 6 characters).
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3">
          <button type="submit" class="btn btn-primary">Login</button>
          <div class="ms-2">
            <span class="me-1">Don't have an account?</span>
            <button type="button" class="btn btn-link p-0" @click="register">Register</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import { useToast } from "vue-toastification";
import loginPageLogo from '../assets/loginPageLogo.jpeg';

export default {
  name: "LoginPage",
  setup(_, { expose }) {
    const state = reactive({
      username: '',
      password: '',
    });

    const rules = {
      username: { required },
      password: { required, minLength: minLength(6) },
    };

    const v$ = useVuelidate(rules, state);
    const toast = useToast();

    const login = async () => {
      if (await v$.value.$validate()) {
        try {
          await window.axios.post('/Login', {
            username: state.username,
            password: state.password
          });
          window.store.login(state.username);
          window.router.push('/');
        } catch (err) {
          toast.error("Invalid Login, Please check your username and password.");
        }
      }
    };

    const register = () => {
      window.router.push('/register');
    };

    expose({ login });
    return { state, v$, login, register, loginPageLogo };
  }
};
</script>

<style scoped>
.login-page {
  background-color: #f8f9fa;
  padding: 2rem;
  width: 100%;
}

.card {
  border-radius: 0;
  border: none;
}

h2 {
  font-size: 1.75rem;
  color: #333;
}

.form-label {
  font-weight: 600;
}

input.form-control {
  border-radius: 0;
}

.btn-primary {
  border-radius: 0;
  font-weight: 600;
}

.btn-link {
  color: #0d6efd;
  font-size: 0.9rem;
  text-decoration: underline;
}
</style>
