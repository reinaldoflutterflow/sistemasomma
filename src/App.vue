<script setup lang="ts">
import Login from './components/Login.vue'
</script>

<template>
  <router-view></router-view>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

html, body {
  height: 100%;
  background-color: #f8f9ff;
}

#app {
  height: 100%;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  cursor: pointer;
  font-family: inherit;
}

input, select {
  font-family: inherit;
}
</style>
