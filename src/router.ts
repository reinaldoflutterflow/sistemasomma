import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { isAuthenticated } from './services/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./components/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./components/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/exemplo-zoom',
    name: 'exemploZoom',
    component: () => import('./components/ExemploZoom.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('./components/FormularioComUpload.vue'),
    meta: { requiresAuth: false }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // Adicionar um console.log para debug em produção
  console.log('Navegando para:', to.path, 'Autenticado:', isAuthenticated());
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      // Redirecionar para login com query param
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      // Usuário autenticado, permitir acesso
      next();
    }
  } else {
    // Rota pública, permitir acesso
    next();
  }
});

export default router; 