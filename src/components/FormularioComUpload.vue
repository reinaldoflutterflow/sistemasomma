<template>
  <div class="formulario-container">
    <form @submit.prevent="enviarFormulario" class="formulario-upload">
      <!-- Campos existentes do formulário -->
      <div class="form-group">
        <label>Família</label>
        <div class="search-select-container">
          <input type="text" placeholder="Pesquisar família..." class="form-control" required>
        </div>
      </div>
      
      <div class="form-group">
        <label>Nome do Responsável</label>
        <input type="text" required placeholder="Ex: João Silva" class="form-control">
      </div>
      
      <div class="form-group">
        <label>Telefone</label>
        <input type="text" required placeholder="Ex: (11) 99999-9999" class="form-control">
      </div>
      
      <div class="form-group">
        <label>Parentesco</label>
        <select required class="form-control">
          <option value="" disabled selected>Selecione o parentesco</option>
          <option value="Pai">Pai</option>
          <option value="Mãe">Mãe</option>
          <option value="Tio">Tio</option>
          <option value="Avô">Avô</option>
          <option value="Outro">Outro</option>
        </select>
      </div>
      
      <!-- Componente de upload de foto -->
      <div class="form-group">
        <label>Foto</label>
        <FileUpload 
          :maxSizeMB="10" 
          @file-selected="onFileSelected" 
          @upload="onFileUpload"
          @cancel="onCancelUpload"
        />
      </div>
      
      <div class="form-group checkbox-group">
        <label class="checkbox-label">
          <input type="checkbox"> Possui WhatsApp
        </label>
      </div>
      
      <div class="form-group checkbox-group">
        <label class="checkbox-label">
          <input type="checkbox"> Pode realizar check-out
        </label>
      </div>
      
      <div class="form-group">
        <label>Observações</label>
        <textarea class="form-control" placeholder="Observações adicionais"></textarea>
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="cancelar">Cancelar</button>
        <button type="submit" class="btn btn-primary">Salvar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FileUpload from './FileUpload.vue';

const selectedFile = ref(null);

function onFileSelected(file) {
  selectedFile.value = file;
  console.log('Arquivo selecionado:', file.name);
}

function onFileUpload(file) {
  console.log('Arquivo enviado:', file.name);
  // Aqui você implementaria a lógica para salvar o arquivo no servidor
  // Por exemplo, usando o Supabase Storage
}

function onCancelUpload() {
  selectedFile.value = null;
  console.log('Upload cancelado');
}

function enviarFormulario() {
  // Implementar a lógica para enviar o formulário
  console.log('Formulário enviado com arquivo:', selectedFile.value);
  
  // Aqui você implementaria a lógica para salvar o arquivo no Supabase Storage
  // Por exemplo:
  /*
  if (selectedFile.value) {
    const { data, error } = await supabase.storage
      .from('fotos')
      .upload(`responsaveis/${Date.now()}-${selectedFile.value.name}`, selectedFile.value);
      
    if (error) {
      console.error('Erro ao fazer upload:', error);
      return;
    }
    
    // Salvar o caminho da imagem no banco de dados junto com os outros dados do formulário
    const imagePath = data.path;
  }
  */
}

function cancelar() {
  // Implementar a lógica para cancelar o formulário
  console.log('Formulário cancelado');
}
</script>

<style scoped>
.formulario-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-control:focus {
  border-color: #4361ee;
  outline: none;
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
}

.search-select-container {
  position: relative;
}

.checkbox-group {
  margin-bottom: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input {
  margin-right: 8px;
}

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #0000FF;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #0000CC;
}

.btn-secondary {
  background-color: #fff;
  color: #666;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background-color: #f5f5f5;
}
</style>
