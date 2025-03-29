import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated } from './services/auth';
import Dashboard from './components/Dashboard.vue';
import Login from './components/Login.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const auth = await isAuthenticated();
  
  if (to.meta.requiresAuth && !auth) {
    next('/login');
  } else if (to.path === '/login' && auth) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router; 