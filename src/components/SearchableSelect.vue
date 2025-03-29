<template>
  <div class="searchable-select">
    <div 
      class="select-input" 
      @click="toggleDropdown"
      :class="{ 'active': isOpen }"
    >
      <input 
        type="text" 
        v-model="searchQuery" 
        @click.stop
        @input="filterOptions"
        placeholder="Pesquisar..."
        ref="searchInput"
      />
      <div class="select-arrow">
        <i class="fas fa-chevron-down"></i>
      </div>
    </div>
    
    <div v-if="isOpen" class="options-dropdown">
      <div 
        v-for="option in filteredOptions" 
        :key="option.value" 
        class="option-item"
        @click="selectOption(option)"
      >
        {{ option.label }}
      </div>
      <div v-if="filteredOptions.length === 0" class="no-results">
        Nenhum resultado encontrado
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  options: Array<{ value: string, label: string }>,
  modelValue: string,
  placeholder?: string
}>();

const emit = defineEmits(['update:modelValue', 'change']);

const isOpen = ref(false);
const searchQuery = ref('');
const searchInput = ref<HTMLInputElement | null>(null);

const selectedOption = computed(() => {
  return props.options.find(option => option.value === props.modelValue);
});

const filteredOptions = ref(props.options);

const filterOptions = () => {
  if (!searchQuery.value) {
    filteredOptions.value = props.options;
    return;
  }
  
  const query = searchQuery.value.toLowerCase();
  filteredOptions.value = props.options.filter(option => 
    option.label.toLowerCase().includes(query)
  );
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    setTimeout(() => {
      if (searchInput.value) {
        searchInput.value.focus();
      }
    }, 100);
  }
};

const selectOption = (option: { value: string, label: string }) => {
  emit('update:modelValue', option.value);
  emit('change', option.value);
  searchQuery.value = option.label;
  isOpen.value = false;
};

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const option = props.options.find(opt => opt.value === newValue);
    if (option) {
      searchQuery.value = option.label;
    }
  } else {
    searchQuery.value = '';
  }
}, { immediate: true });

watch(() => props.options, (newOptions) => {
  filteredOptions.value = newOptions;
}, { deep: true });

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.searchable-select')) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
  // Inicializar o valor de busca com a opção selecionada
  if (props.modelValue) {
    const option = props.options.find(opt => opt.value === props.modelValue);
    if (option) {
      searchQuery.value = option.label;
    }
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.searchable-select {
  position: relative;
  width: 100%;
}

.select-input {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.select-input.active {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.select-input input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #1e293b;
}

.select-arrow {
  color: #64748b;
  font-size: 12px;
  transition: transform 0.2s;
}

.active .select-arrow i {
  transform: rotate(180deg);
}

.options-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
}

.option-item {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
}

.option-item:hover {
  background-color: #f1f5f9;
}

.no-results {
  padding: 12px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
}
</style>
