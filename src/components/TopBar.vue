<template>
  <div class="top-bar">
    <div class="page-title">
      <h1>{{ title }}</h1>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div class="actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.page-title {
  display: flex;
  flex-direction: column;
}

.page-title h1 {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.page-title p {
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0 0;
}

.actions {
  display: flex;
  gap: 12px;
}
</style>
