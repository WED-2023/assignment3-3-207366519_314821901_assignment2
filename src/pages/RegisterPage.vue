<template>
  <div class="register-page">
    <h1>Register</h1>
    <form @submit.prevent="register">
<div class="form-group">
  <label>Username:</label>
  <input
    v-model="state.username"
    type="text"
    class="form-control"
    @input="onUsernameInput"
  />
  <div v-if="v$.username.$error" class="text-danger">
    <div v-if="v$.username.required.$invalid">Username is required.</div>
    <div v-else-if="v$.username.minLength.$invalid">Username must be at least 3 characters.</div>
    <div v-else-if="v$.username.maxLength.$invalid">Username must be at most 8 characters.</div>
  </div>
</div>


<div class="form-group">
  <label>Password:</label>
  <input 
    v-model="state.password" 
    type="password" 
    class="form-control" 
    @input="v$.password.$touch()" 
  />
      <div v-if="v$.password.$error" class="text-danger">
        <div v-if="v$.password.required.$invalid">Password is required.</div>
        <div v-else-if="v$.password.minLength.$invalid">Password must be at least 6 characters.</div>
        <div v-else-if="v$.password.hasLetterAndNumber && v$.password.hasLetterAndNumber.$invalid">
          Password must contain at least one letter and one number.
        </div>
      </div>
    </div>

      <div class="form-group">
        <label>Confirm Password:</label>
        <input v-model="state.confirmPassword" type="password" class="form-control" @input="v$.confirmPassword.$touch()" />
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
        <select v-model="state.country" class="form-select">
          <option value="" disabled>Select your country</option>
          <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
        </select>
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
import { required, minLength, sameAs, email ,maxLength} from '@vuelidate/validators';
import { useToast } from "vue-toastification";

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
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Deps", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh",
  "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi",
  "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile",
  "China", "Colombia", "Comoros", "Congo", "Congo {Democratic Rep}", "Costa Rica", "Croatia",
  "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
  "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel",
  "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Korea North", "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
  "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
  "Montenegro", "Morocco", "Mozambique", "Myanmar, {Burma}", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan",
  "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "St Kitts & Nevis",
  "St Lucia", "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
  "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain",
  "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia",
  "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];
    const hasLetterAndNumber = (value) => {
  if (!value) return false; // or true if you want to allow empty for required to handle separately
  const hasLetter = /[A-Za-z]/.test(value);
  const hasNumber = /\d/.test(value);
  return hasLetter && hasNumber;
};

    const onUsernameInput = (event) => {
      const value = event.target.value.replace(/[^a-zA-Z]/g, '');
      state.username = value;
      v$.value.username.$touch();
    };


    const rules = computed(() => ({
      username: { required , minLength: minLength(3), maxLength: maxLength(8)},
      password: { required, minLength: minLength(6) ,hasLetterAndNumber},
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

    return { state, v$, register,countries ,onUsernameInput,hasLetterAndNumber};
  }
};
</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: auto;
}
</style>
