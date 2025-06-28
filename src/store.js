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
  window.axios.post('/Logout', {}, { withCredentials: true })
    .then(response => {
      console.log("Logged out:", response.data);

      // Clear session-related data
      localStorage.removeItem('username');
      localStorage.removeItem('lastSearchResults'); 
      localStorage.removeItem('lastSearchInput');
      this.username = undefined;

      this.$router.push('/login').catch(() => {});
    })
    .catch(error => {
      console.error("Logout failed:", error);
    });
}


  
});

export default store;







