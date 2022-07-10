import Vue from 'vue'
import VueRouter from 'vue-router'
import OneGroupView from '../views/OneGroupView.vue'
import OneMemberView from '../views/OneMemberView.vue'
import OneExpenseView from '../views/OneExpenseView.vue'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import PageNotFoundView from '../views/PageNotFoundView.vue'

import { auth } from "@/firebaseConfig.js"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
    meta: {
      requiresAuth: false
    },
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/group/:groupId',
    name: 'oneGroup',
    component: OneGroupView,
    props: true,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/group/:groupId/:memberId',
    name: 'oneMember',
    component: OneMemberView,
    props: true,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/group/:groupId/:expenseId',
    name: 'oneExpense',
    component: OneExpenseView,
    props: true,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '*',
    name: '404',
    component: PageNotFoundView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  console.log(to);
  console.log(from);
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/')
    // could also just fire off a redirect login here, or redirect based on a meta property!
  } else {
    next()
  }
})

export default router
//sourcecodecannibals@gmail.com
//sccproject2