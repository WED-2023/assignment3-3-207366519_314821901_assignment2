<template>
  <div class="login-page">
    <h1>Login</h1>
    <form @submit.prevent="login">
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
        <div class="d-flex justify-content-between align-items-center mt-3">
          <button type="submit" class="btn btn-primary">Login</button>
          <div>
            <span>Don't have an account? </span>
            <button type="button" class="btn btn-primary" @click="register">Register</button>
          </div>
        </div>

    </form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import { useToast } from "vue-toastification";

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
    const register = () =>{
      window.router.push('/register');
    }
    const v$ = useVuelidate(rules, state);
    const toast = useToast();

    const login = async () => {
      if (await v$.value.$validate()) {
        // קריאה לשרת
        try {
          await window.axios.post('/Login', {
            username: state.username,
            password: state.password
          });
          window.store.login(state.username);
          window.router.push('/main');
        } catch (err) {
          toast.error("Invalid Login, Please check your username and password.");
        }
      }
    };

    expose({ login });

    return { state, v$, login, register };
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;  /* center vertically */
  align-items: center;      /* center horizontally */
  min-height: 100vh;        /* full viewport height */
  max-width: 400px;
  margin: auto;
  background: #ffffff;
  border-radius: 0;        /* no rounding */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    height: 100vh;       /* force exact viewport height */
  overflow: hidden;    /* prevent scrollbars */
  box-sizing: border-box;  /* include padding in height */
}

h1 {
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 700;
  font-size: 2rem;
}

.form-group {
  width: 100%;
  margin-bottom: 1.5rem; /* 20px */
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

input.form-control {
  width: 100%;
  padding: 0.6rem 0.9rem;
  font-size: 1rem;
  border: 1.5px solid #ccc;
  border-radius: 0;          /* no rounding */
  transition: border-color 0.3s ease;
}

input.form-control:focus {
  border-color: #0d6efd; /* Bootstrap primary blue */
  outline: none;
  box-shadow: 0 0 5px rgba(13, 110, 253, 0.5);
}

.text-danger {
  color: #dc3545; /* Bootstrap danger red */
  font-size: 0.85rem;
  margin-top: 0.3rem;
}

.d-flex.justify-content-between.align-items-center.mt-3 {
  width: 100%;
}

button.btn-primary {
  padding: 0.5rem 1.5rem;
  border-radius: 0;          /* no rounding */
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
}

button.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

/* Smaller spacing for the "Don't have an account?" text and button */
.d-flex > div > span {
  font-size: 0.9rem;
  color: #555;
  margin-right: 0.3rem;
}

.d-flex > div > button.btn-primary {
  padding: 0.3rem 1rem;
  font-size: 0.9rem;
  background-color: transparent;
  border: none;
  color: #0d6efd;
  border-radius: 0;          /* no rounding */
}

.d-flex > div > button.btn-primary:hover {
  background-color: transparent;
  text-decoration: underline;
  color: #0a58ca;
}

</style>
