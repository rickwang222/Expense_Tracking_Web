<template>
  <div id="app" class="background">
    <div id="navbar">
      <div class="leftNavbar">
        <router-link class="navbarItem navbarTitle" to="/">Money Cannibals</router-link>
        <div id="divider"></div>
        <router-link class="navbarItem" to="/home">Groups</router-link>
      </div>
      <div class="rightNavbar">
        <login-button></login-button>
      </div>
    </div>
    <div id="content">
      <router-view/>
    </div>
  </div>
</template>


<script>
import { auth } from "@/firebaseConfig";
import LoginButton from './components/LoginButton.vue';

export default {
  components: { LoginButton },
  beforeCreate: function() {
    auth.getRedirectResult().then(result=>{
      if (result.user) {
        console.log('result: ', result)
        this.$router.push("/")
      }
    }).catch(() => {
      this.$router.push("/404")
    })
  }
}
</script>


<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  #content {
    height: calc(100vh-(64px));
    padding: 24px;
  }
  #navbar {
    height: 64px;
    background: #74BDCB;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .navbarItem {
    display:flex;
    align-items:center;
    justify-content:center;
    margin: 8px;
    font-size: 1rem;
    text-decoration: none;
    color: #E7F2F8;;
  }
  .navbarTitle {
    padding-left: 0;
    border-left: none;
    font-size: 1.5rem;
  }
  .leftNavbar {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 8px;
  }
  .rightNavbar {
    padding: 24px;
  }
  #divider {
    height: 100%;
    width: 1px;
    background: #E7F2F8;;
    margin: 0 24px;
  }
  nav {
    padding: 30px;
  }
  nav a {
    font-weight: bold;
    color: #2c3e50;
  }
  nav a.router-link-exact-active {
    color: #42b983;
  }

  .background{
    height: 100%;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #EFE8D8;
    min-height: 100vh;
  }
  .blue{color: #74BDCB;}
  .orange{color: #FFA384;}
  .grey{color: #676767;}
  .grey-hover{color: #E55A5C;}
  .white{color: #E7F2F8;}
  .white-hover{color: #BADAEB;}
</style>
