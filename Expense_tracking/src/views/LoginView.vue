<template>
    <div id="app">
        <div id="signInText">Welcome to</div>
        <div id="siteName">Money Cannibals</div>
        <login-button></login-button>
    </div>
</template>


<script>
import LoginButton from '../components/LoginButton.vue';

export default {
    name: 'LoginView',
    components: { LoginButton }
}
</script>


<style scoped>
    #app {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 8px;
        height: 100%;
        padding: 24px;
    }
    #siteName {
        font-size: 3rem;
    }
    #signInText {
        font-size: 1rem;
    }

  .blue{color: #74BDCB;}
  .orange{color: #FFA384;}
  .grey{color: #676767;}
  .grey-hover{color: #E55A5C;}
  .white{color: #E7F2F8;}
  .white-hover{color: #BADAEB;}
</style>
