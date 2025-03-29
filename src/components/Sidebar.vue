<template>
  <aside class="sidebar">
    <div class="logo">
      <i class="fas fa-church"></i>
      <span class="logo-text">Igreja</span>
    </div>

    <div class="menu-section">
      <span class="menu-label">PRINCIPAL</span>
      <router-link to="/dashboard" class="menu-item" :class="{ active: $route.path === '/dashboard' }">
        <i class="fas fa-home"></i>
        <span>Dashboard</span>
      </router-link>
    </div>

    <div class="menu-section">
      <span class="menu-label">CADASTROS</span>
      <router-link to="/familias" class="menu-item" :class="{ active: $route.path === '/familias' }">
        <i class="fas fa-users"></i>
        <span>Famílias</span>
      </router-link>
      <router-link to="/criancas" class="menu-item" :class="{ active: $route.path === '/criancas' }">
        <i class="fas fa-child"></i>
        <span>Crianças</span>
      </router-link>
      <router-link to="/salas" class="menu-item" :class="{ active: $route.path === '/salas' }">
        <i class="fas fa-door-open"></i>
        <span>Salas</span>
      </router-link>
    </div>

    <div class="menu-section">
      <span class="menu-label">OPERAÇÕES</span>
      <router-link to="/checkin" class="menu-item" :class="{ active: $route.path === '/checkin' }">
        <i class="fas fa-sign-in-alt"></i>
        <span>Check-in</span>
      </router-link>
      <router-link to="/checkout" class="menu-item" :class="{ active: $route.path === '/checkout' }">
        <i class="fas fa-sign-out-alt"></i>
        <span>Check-out</span>
      </router-link>
      <router-link to="/etiquetas" class="menu-item" :class="{ active: $route.path === '/etiquetas' }">
        <i class="fas fa-qrcode"></i>
        <span>Etiquetas QR</span>
      </router-link>
    </div>

    <div class="user-section">
      <div class="user-info">
        <i class="fas fa-user-circle"></i>
        <span class="user-name">Usuário</span>
        <span class="user-role">Admin</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
// Component logic here if needed
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  background: white;
  padding: 24px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e5e7eb;
  position: fixed;
  left: 0;
  top: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  color: #0000FF;
  font-size: 24px;
}

.logo-text {
  font-weight: 600;
  font-size: 20px;
}

.menu-section {
  margin-bottom: 24px;
}

.menu-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 12px;
  display: block;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  color: #666;
  text-decoration: none;
  margin-bottom: 4px;
  transition: all 0.2s;
}

.menu-item:hover {
  background: #f3f4f6;
  color: #0000FF;
}

.menu-item.active {
  background: #f0f2ff;
  color: #0000FF;
}

.menu-item i {
  width: 20px;
  text-align: center;
}

.user-section {
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #666;
}

.user-info i {
  font-size: 24px;
}

.user-name {
  font-weight: 500;
}

.user-role {
  font-size: 12px;
  color: #6b7280;
}
</style> 