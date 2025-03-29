<template>
  <div class="image-zoom-container">
    <div 
      class="image-wrapper" 
      ref="imageWrapper"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      @wheel.prevent="onZoom"
      @touchstart="startTouch"
      @touchmove="onTouch"
      @touchend="stopTouch"
    >
      <img 
        :src="src" 
        :alt="alt" 
        ref="zoomableImage"
        :style="{
          transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }"
        @dblclick="resetZoom"
      />
    </div>
    <div class="zoom-controls">
      <button @click="zoomIn" class="zoom-btn">
        <i class="fas fa-search-plus"></i>
      </button>
      <button @click="resetZoom" class="zoom-btn">
        <i class="fas fa-sync-alt"></i>
      </button>
      <button @click="zoomOut" class="zoom-btn">
        <i class="fas fa-search-minus"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Imagem com zoom'
  },
  maxZoom: {
    type: Number,
    default: 3
  },
  minZoom: {
    type: Number,
    default: 0.5
  },
  zoomStep: {
    type: Number,
    default: 0.1
  }
});

const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const lastTranslateX = ref(0);
const lastTranslateY = ref(0);
const zoomableImage = ref<HTMLImageElement | null>(null);
const imageWrapper = ref<HTMLDivElement | null>(null);

// Função para aumentar o zoom
const zoomIn = () => {
  if (scale.value < props.maxZoom) {
    scale.value = Math.min(scale.value + props.zoomStep, props.maxZoom);
  }
};

// Função para diminuir o zoom
const zoomOut = () => {
  if (scale.value > props.minZoom) {
    scale.value = Math.max(scale.value - props.zoomStep, props.minZoom);
  }
};

// Função para resetar o zoom
const resetZoom = () => {
  scale.value = 1;
  translateX.value = 0;
  translateY.value = 0;
};

// Funções para arrastar a imagem
const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;
  lastTranslateX.value = translateX.value;
  lastTranslateY.value = translateY.value;
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;
  
  const deltaX = e.clientX - startX.value;
  const deltaY = e.clientY - startY.value;
  
  translateX.value = lastTranslateX.value + deltaX / scale.value;
  translateY.value = lastTranslateY.value + deltaY / scale.value;
};

const stopDrag = () => {
  isDragging.value = false;
};

// Funções para zoom com a roda do mouse
const onZoom = (e: WheelEvent) => {
  const delta = e.deltaY > 0 ? -props.zoomStep : props.zoomStep;
  const newScale = Math.max(props.minZoom, Math.min(props.maxZoom, scale.value + delta));
  
  // Calcula o ponto de origem do zoom (posição do cursor)
  if (imageWrapper.value && zoomableImage.value) {
    const rect = imageWrapper.value.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Ajusta a posição para manter o ponto sob o cursor no mesmo lugar
    const scaleChange = newScale - scale.value;
    translateX.value -= (mouseX - translateX.value) * scaleChange / newScale;
    translateY.value -= (mouseY - translateY.value) * scaleChange / newScale;
  }
  
  scale.value = newScale;
};

// Funções para suporte a toque
const startTouch = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    isDragging.value = true;
    startX.value = e.touches[0].clientX;
    startY.value = e.touches[0].clientY;
    lastTranslateX.value = translateX.value;
    lastTranslateY.value = translateY.value;
  }
};

const onTouch = (e: TouchEvent) => {
  if (!isDragging.value || e.touches.length !== 1) return;
  
  const deltaX = e.touches[0].clientX - startX.value;
  const deltaY = e.touches[0].clientY - startY.value;
  
  translateX.value = lastTranslateX.value + deltaX / scale.value;
  translateY.value = lastTranslateY.value + deltaY / scale.value;
};

const stopTouch = () => {
  isDragging.value = false;
};

onMounted(() => {
  // Inicializa o componente
  if (zoomableImage.value) {
    zoomableImage.value.onload = () => {
      resetZoom();
    };
  }
});
</script>

<style scoped>
.image-zoom-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  touch-action: none;
}

.image-wrapper img {
  max-width: 100%;
  max-height: 100%;
  transform-origin: center;
  transition: transform 0.05s ease-out;
  user-select: none;
  -webkit-user-drag: none;
}

.zoom-controls {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  gap: 10px;
}

.zoom-btn {
  background-color: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.zoom-btn:hover {
  background-color: #e0e0e0;
}

.zoom-btn:active {
  background-color: #d0d0d0;
}
</style>
