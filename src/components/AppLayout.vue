<template>
  <div class="app-container">
    <Sidebar />
    <div class="content-container">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue';
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
}

.content-container {
  flex: 1;
  margin-left: 280px; /* Largura do sidebar */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
