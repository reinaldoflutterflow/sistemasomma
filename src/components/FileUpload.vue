<template>
  <div class="upload-container">
    <div class="upload-header">
      <div class="upload-icon">
        <i class="fa fa-cloud-upload-alt"></i>
      </div>
      <div class="upload-title">
        <h4>Upload de Arquivos</h4>
        <p>JPEG, PNG, PDF, formatos de até 10MB</p>
      </div>
      <div class="upload-info">
        <i class="fa fa-info-circle"></i>
      </div>
    </div>

    <div 
      class="upload-area" 
      :class="{ 'has-preview': preview }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      :style="isDragging ? { borderColor: '#4361ee', backgroundColor: '#f0f4ff' } : {}"
    >
      <div v-if="!preview" class="upload-placeholder">
        <div class="upload-icon-large">
          <i class="fa fa-cloud-upload-alt"></i>
        </div>
        <p>Escolha um arquivo ou arraste e solte aqui</p>
        <button type="button" class="browse-button" @click.prevent="triggerFileInput">
          Procurar <i class="fa fa-folder-open"></i>
        </button>
      </div>
      <div v-else class="preview-container">
        <img v-if="isImage" :src="preview" class="preview-image" alt="Preview" />
        <div v-else class="file-icon">
          <i class="fas fa-file"></i>
          <span>{{ fileName }}</span>
        </div>
      </div>
      <input 
        type="file" 
        ref="fileInput" 
        @change="onFileSelected" 
        accept="image/*,application/pdf,video/mp4"
        class="file-input"
      >
    </div>

    <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
      <div class="upload-progress-info">
        <div class="upload-file-info">
          <i class="fas" :class="fileIcon"></i>
          <span>{{ fileName }}</span>
          <span class="file-size">{{ formattedSize }} of {{ totalSize }}</span>
        </div>
        <div v-if="uploadProgress < 100" class="upload-status">
          <i class="fa fa-spinner fa-spin"></i>
          <span>Enviando...</span>
        </div>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: `${uploadProgress}%` }"></div>
      </div>
    </div>

    <div class="upload-actions" v-if="selectedFile">
      <button class="cancel-button" @click="cancelUpload">Limpar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import '@fortawesome/fontawesome-free/css/all.css';

const props = defineProps({
  maxSizeMB: {
    type: Number,
    default: 50
  }
});

const emit = defineEmits(['file-selected', 'upload', 'cancel']);

const fileInput = ref(null);
const selectedFile = ref(null);
const preview = ref(null);
const fileName = ref('');
const fileSize = ref(0);
const uploadProgress = ref(0);
const isDragging = ref(false);

const isImage = computed(() => {
  if (!selectedFile.value) return false;
  return selectedFile.value.type.startsWith('image/');
});

const fileIcon = computed(() => {
  if (!selectedFile.value) return 'fa-file';
  
  const type = selectedFile.value.type;
  if (type.startsWith('image/')) return 'fa-file-image';
  if (type === 'application/pdf') return 'fa-file-pdf';
  if (type.startsWith('video/')) return 'fa-file-video';
  return 'fa-file';
});

onMounted(() => {
  // Garantir que o FontAwesome esteja disponível
  if (document.querySelector('link[href*="fontawesome"]') === null) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(link);
  }
});

const formattedSize = computed(() => {
  return formatFileSize(fileSize.value * (uploadProgress.value / 100));
});

const totalSize = computed(() => {
  return formatFileSize(fileSize.value);
});

function formatFileSize(bytes) {
  if (bytes === 0) return '0 KB';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function triggerFileInput() {
  fileInput.value.click();
}

function onFileSelected(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (file.size > props.maxSizeMB * 1024 * 1024) {
    alert(`O arquivo é muito grande. O tamanho máximo permitido é ${props.maxSizeMB}MB.`);
    return;
  }
  
  selectedFile.value = file;
  fileName.value = file.name;
  fileSize.value = file.size;
  
  if (isImage.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    preview.value = 'non-image';
  }
  
  emit('file-selected', file);
}

function onDragOver(event) {
  isDragging.value = true;
}

function onDragLeave(event) {
  isDragging.value = false;
}

function onDrop(event) {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (!file) return;
  
  if (file.size > props.maxSizeMB * 1024 * 1024) {
    alert(`O arquivo é muito grande. O tamanho máximo permitido é ${props.maxSizeMB}MB.`);
    return;
  }
  
  selectedFile.value = file;
  fileName.value = file.name;
  fileSize.value = file.size;
  
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    preview.value = 'non-image';
  }
  
  emit('file-selected', file);
}

function uploadFile() {
  if (!selectedFile.value) return;
  
  // Simulação de upload com progresso
  uploadProgress.value = 0;
  const interval = setInterval(() => {
    uploadProgress.value += 5;
    if (uploadProgress.value >= 100) {
      clearInterval(interval);
      emit('upload', selectedFile.value);
    }
  }, 100);
}

function cancelUpload() {
  selectedFile.value = null;
  preview.value = null;
  fileName.value = '';
  fileSize.value = 0;
  uploadProgress.value = 0;
  fileInput.value.value = '';
  emit('cancel');
}
</script>

<style scoped>
.upload-container {
  width: 100%;
  max-width: 550px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.upload-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.upload-icon {
  color: #0000FF;
  font-size: 20px;
  margin-right: 12px;
}

.upload-title {
  flex: 1;
}

.upload-title h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.upload-title p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #666;
}

.upload-info {
  color: #aaa;
  font-size: 18px;
  cursor: pointer;
}

.upload-area {
  position: relative;
  min-height: 180px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #0000FF;
  background-color: #f9fbff;
}

.upload-placeholder {
  text-align: center;
  padding: 20px;
}

.upload-icon-large {
  font-size: 48px;
  color: #0000FF;
  margin-bottom: 16px;
}

.upload-placeholder p {
  margin: 0 0 16px;
  color: #666;
  font-size: 16px;
}

.file-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.browse-button {
  background-color: #f0f4ff;
  color: #0000FF;
  border: 1px solid #4361ee;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.browse-button:hover {
  background-color: #e0e8ff;
}

.preview-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.preview-image {
  max-width: 100%;
  max-height: 160px;
  border-radius: 4px;
  object-fit: contain;
}

.file-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #0000FF;
}

.file-icon i {
  font-size: 48px;
  margin-bottom: 8px;
}

.upload-progress {
  margin: 0 20px 20px;
}

.upload-progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.upload-file-info {
  display: flex;
  align-items: center;
}

.upload-file-info i {
  color: #0000FF;
  margin-right: 8px;
  font-size: 16px;
}

.file-size {
  color: #888;
  font-size: 12px;
  margin-left: 8px;
}

.upload-status {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 14px;
}

.upload-status i {
  margin-right: 6px;
  color: #0000FF;
}

.progress-bar-container {
  width: 100%;
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #0000FF;
  transition: width 0.3s ease;
}

.upload-actions {
  display: flex;
  justify-content: center;
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  width: 100%;
}

.cancel-button {
  background-color: #FF8C00; /* Tom de laranja */
  color: #fff; /* Texto branco */
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%; /* Expande horizontalmente */
  text-align: center;
}

.cancel-button:hover {
  background-color: #FF7000; /* Tom de laranja mais escuro no hover */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.upload-button {
  background-color: #0000FF;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.upload-button:hover {
  background-color: #0000CC;
}

.upload-button:disabled {
  background-color: #a8b8f0;
  cursor: not-allowed;
}

.upload-button i {
  margin-left: 8px;
}

.has-preview {
  border-style: solid;
  border-color: #0000FF;
}
</style>
