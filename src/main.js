import { createApp} from 'vue';
import App from './App.vue';
import routes from './router/index';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { createRouter, createWebHistory } from 'vue-router';

// Bootstrap CSS + JS
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

// BootstrapVue 3
import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import { BContainer, BRow, BCol } from 'bootstrap-vue-3';

import store from './store';

import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import 'bootstrap-icons/font/bootstrap-icons.css';





window.store = store;

// Router setup
const router = createRouter({
  history: createWebHistory(),
  routes
});




axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

// Axios interceptors
axios.interceptors.request.use((config) => config, (error) => Promise.reject(error));
axios.interceptors.response.use((response) => response, (error) => Promise.reject(error));

// Create app
const app = createApp(App);

// Plugins
app.use(router);
app.use(VueAxios, axios);
app.use(BootstrapVue3);
app.use(Toast, {
  // Global options
  position: POSITION.TOP_RIGHT,
  timeout: 8000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  hideProgressBar: false,
  closeButton: "button",
  icon: true
});

// Register global BootstrapVue3 components
app.component('BContainer', BContainer);
app.component('BRow', BRow);
app.component('BCol', BCol);

// app.config.globalProperties.$http = axios;
window.axios = axios;
window.router = router;

// Global store
app.config.globalProperties.store = store;

// Mount app
app.mount('#app');
