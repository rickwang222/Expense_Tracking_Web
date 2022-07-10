<template>
  <div class="auth">
    <template v-if="user">
      <!-- google is real paranoid about hotlinking images I guess the referrerpolicy seems to fix it
        https://stackoverflow.com/questions/40570117/http403-forbidden-error-when-trying-to-load-img-src-with-google-profile-pic -->
      <button @click="signOut" class="button is-small delete-button">Sign Out</button>
    </template>
    <template v-else>
      <!-- google is real paranoid about hotlinking images I guess the referrerpolicy seems to fix it
        https://stackoverflow.com/questions/40570117/http403-forbidden-error-when-trying-to-load-img-src-with-google-profile-pic -->
      <button @click="signInWithGoogle" class="button is-small button-login">Sign In</button>
    </template>

    <!-- <pre>{{ user }}</pre> -->
  </div>
</template>

<script>
import { auth, provider } from "@/firebaseConfig";

export default {
    components: {},
    name: "LoginButton",
  data() {
    return {
      user: null
    };
  },
  beforeCreate: function() {
    auth.onAuthStateChanged(user => {
       console.log("user state:", user);
      // uncomment above to check out which user properties are available.
      if (user) {        
        this.user = user;
        // user is currently logged in
        this.$router.push({ name: 'home'})
      } else {
        this.user = null;
        // user is currently logged out
        this.$router.push("/")
      }
    });
  },
  methods: {
    signInWithGoogle: function() {
      auth.signInWithRedirect(provider)
        .then(result => {
          this.user = result.user;
        })
        .catch(err => console.log(err));
    },
    signOut: function() {
      auth.signOut()
        .then(() => {
          this.user = null;
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style scoped>
  .avatar {
    width: 2em; 
    height: 2em; 
    border-radius: 50%;
  }
  .delete-button{
        background-color: #676767;
        color: #E7F2F8;
        border: none;
    }
    .delete-button:hover{
        background-color: #E55A5C;
        color: #E7F2F8;
    }
    .button-login{
        background-color: #676767;
        color: #E7F2F8;
        border: none;
    }
    .button-login:hover{
        background-color: #74BDCB;
        color: #E7F2F8;
    }
    .header {
        color: #676767;
    }
</style>
