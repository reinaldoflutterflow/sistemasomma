<template>
  <div class="exemplo-zoom">
    <h2>Exemplo de Zoom em Imagem</h2>
    <div class="zoom-container">
      <ImageZoom 
        src="/church.svg" 
        alt="Logo da Igreja" 
        :maxZoom="5" 
        :minZoom="0.5" 
        :zoomStep="0.2"
      />
    </div>
    <div class="instrucoes">
      <p><strong>Instruções:</strong></p>
      <ul>
        <li>Use a roda do mouse para aumentar/diminuir o zoom</li>
        <li>Clique e arraste para mover a imagem</li>
        <li>Clique duas vezes para resetar o zoom</li>
        <li>Use os botões abaixo da imagem para controlar o zoom</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageZoom from './ImageZoom.vue';
</script>

<style scoped>
.exemplo-zoom {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.zoom-container {
  width: 100%;
  height: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f8f9fa;
}

.instrucoes {
  margin-top: 20px;
  padding: 15px;
  background-color: #f0f4f8;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.instrucoes ul {
  padding-left: 20px;
}

.instrucoes li {
  margin-bottom: 8px;
}
</style>
