import { reactive } from 'vue';

const store = reactive({
  username: localStorage.getItem('username'),
  server_domain: "http://localhost:3000",

  login(username) {
    localStorage.setItem('username', username);
    this.username = username;
    console.log("login", this.username);
  },

logout() {
  console.log("logout");

  // 1. Call the backend to clear the session
  window.axios.post('/Logout', {}, { withCredentials: true })
    .then(response => {
      console.log("Logged out:", response.data);

      // 2. Clear frontend state
      localStorage.removeItem('username');
      this.username = undefined;

    })
    .catch(error => {
      console.error("Logout failed:", error);
    });
}
  
});

export default store;







