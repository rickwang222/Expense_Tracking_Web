import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { auth } from "@/firebaseConfig";
import './assets/bulma.css';
import * as VueGoogleMaps from 'vue2-google-maps'


import { firestorePlugin } from 'vuefire'
Vue.use(firestorePlugin)

Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyA4aoVmKASXWtExrc-Z4j4u-4dioHfbet8',
    libraries: 'places',
  }
});

let app
auth.onAuthStateChanged(()=>{
  if (!app) {
    new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')
  }  
});
