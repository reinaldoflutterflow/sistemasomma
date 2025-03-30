<template>
  <AppLayout>

    <main class="main-content">
      <!-- Top Bar - Componente Global -->
      <div class="search-container">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Buscar..." v-model="searchQuery" />
      </div>

      <!-- Conteúdo específico da página de Salas -->
      <div class="content">
        <TopBar title="Gerenciamento de Salas" subtitle="Cadastre e gerencie as salas do ministério infantil">
          <template #actions>
            <button class="btn-primary" @click="showAddSalaModal = true">
              <i class="fas fa-plus"></i> Nova Sala
            </button>
          </template>
        </TopBar>

        <!-- Lista de Salas -->
        <div class="team-members-container">
          <div v-if="salas.length === 0 && !isLoading" class="no-data">
            <i class="fas fa-info-circle"></i>
            <p>Nenhuma sala cadastrada</p>
            <button class="btn-primary" @click="showAddSalaModal = true">
              <i class="fas fa-plus"></i> Cadastrar Sala
            </button>
          </div>
          
          <div v-else-if="isLoading" class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Carregando salas...</p>
          </div>
          
          <!-- Cards de Salas no estilo da imagem -->
          <div v-else class="team-members-grid">
            <div v-for="sala in filteredSalas" :key="sala.id" class="team-member-card">
              <div class="card-header-row">
                <div class="card-title">
                  <h3>{{ sala.nome_sala || sala.nome }}</h3>
                  <div class="card-subtitle">
                    <span class="seats-info">{{ sala.faixa_etaria_inicio }}-{{ sala.faixa_etaria_fim }} anos</span>
                    <span class="seats-count">{{ sala.capacidade }} vagas</span>
                  </div>
                </div>
                <div class="card-actions">
                  <button class="action-button" @click="showMenu(sala.id)">
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                  <div v-if="activeMenu === sala.id" class="action-menu">
                    <button class="menu-item" @click="editSala(sala)">
                      <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="menu-item" @click="confirmDeleteSala(sala)">
                      <i class="fas fa-trash"></i> Excluir
                    </button>
                  </div>
                </div>
              </div>
              <p class="card-description">Gerenciar sala e horários de aula.</p>
              <div class="card-details">
                <div class="detail-item">
                  <i class="fas fa-user"></i>
                  <span>{{ sala.professor || 'Professor não atribuído' }}</span>
                </div>
                <div class="detail-item">
                  <i class="fas fa-clock"></i>
                  <span>{{ formatHorario(sala.inicio_aula) }} - {{ formatHorario(sala.fim_aula) }}</span>
                </div>
              </div>
              <div class="card-footer">
                <button class="btn-secondary" @click="editSala(sala)">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-primary" @click="showAddSalaModal = true">
                  <i class="fas fa-plus"></i> Nova Sala
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal para adicionar/editar sala -->
    <div v-if="showAddSalaModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Editar Sala' : 'Nova Sala' }}</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="nome">Nome da Sala</label>
            <input type="text" id="nome" v-model="salaForm.nome" placeholder="Ex: Sala dos Pequeninos" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="faixa_etaria_inicio">Idade Mínima</label>
              <input type="number" id="faixa_etaria_inicio" v-model="salaForm.faixa_etaria_inicio" min="0" max="18" />
            </div>
            <div class="form-group">
              <label for="faixa_etaria_fim">Idade Máxima</label>
              <input type="number" id="faixa_etaria_fim" v-model="salaForm.faixa_etaria_fim" min="0" max="18" />
            </div>
          </div>
          <div class="form-group">
            <label for="capacidade">Capacidade</label>
            <input type="number" id="capacidade" v-model="salaForm.capacidade" min="1" />
          </div>
          <div class="form-group">
            <label for="professor">Professor Responsável</label>
            <input type="text" id="professor" v-model="salaForm.professor" placeholder="Nome do professor" />
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="closeModal">Cancelar</button>
          <button type="button" class="btn-primary" @click="saveSala" :disabled="isLoading">
            {{ isLoading ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmação para excluir sala -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Confirmar Exclusão</h2>
          <button class="close-btn" @click="showDeleteModal = false">×</button>
        </div>
        <div class="modal-body">
          <p>Tem certeza que deseja excluir a sala <strong>{{ selectedSala?.nome }}</strong>?</p>
          <p class="warning">Esta ação não pode ser desfeita.</p>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="showDeleteModal = false">Cancelar</button>
          <button type="button" class="btn-danger" @click="deleteSala" :disabled="isLoading">
            {{ isLoading ? 'Excluindo...' : 'Excluir' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Alerta de sucesso/erro -->
    <div v-if="showAlert" :class="['alert', `alert-${alertType}`]">
      {{ alertMessage }}
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { supabase } from '../services/supabase';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AppLayout from './AppLayout.vue';
import TopBar from './TopBar.vue';

const router = useRouter();
const salas = ref<any[]>([]);
const isLoading = ref(false);
const searchQuery = ref('');
const showAddSalaModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const selectedSala = ref<any>(null);
const activeMenu = ref<string | null>(null);

const salaForm = ref({
  id: null,
  nome: '',
  faixa_etaria_inicio: 0,
  faixa_etaria_fim: 12,
  capacidade: 20,
  professor: ''
});

// Alerta
const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref('success');

// Data atual formatada
const currentDate = computed(() => {
  return format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
});

// Salas filtradas pela busca
const filteredSalas = computed(() => {
  if (!searchQuery.value) return salas.value;
  
  const query = searchQuery.value.toLowerCase();
  return salas.value.filter(sala => 
    sala.nome.toLowerCase().includes(query) || 
    (sala.professor && sala.professor.toLowerCase().includes(query))
  );
});

// Carregar salas
const loadSalas = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await supabase
      .from('salas')
      .select('*');
    
    if (error) throw error;
    
    // Ordenar os resultados no lado do cliente
    const sortedData = data ? [...data].sort((a, b) => {
      // Tentar ordenar por nome_sala ou nome, o que estiver disponível
      const nameA = (a.nome_sala || a.nome || '').toLowerCase();
      const nameB = (b.nome_sala || b.nome || '').toLowerCase();
      return nameA.localeCompare(nameB);
    }) : [];
    
    salas.value = sortedData;
  } catch (error) {
    console.error('Erro ao carregar salas:', error);
    showErrorAlert('Erro ao carregar salas. Tente novamente.');
  } finally {
    isLoading.value = false;
  }
};

// Salvar sala (criar ou atualizar)
const saveSala = async () => {
  if (!salaForm.value.nome) {
    showErrorAlert('O nome da sala é obrigatório.');
    return;
  }
  
  if (salaForm.value.faixa_etaria_inicio > salaForm.value.faixa_etaria_fim) {
    showErrorAlert('A idade mínima não pode ser maior que a idade máxima.');
    return;
  }
  
  isLoading.value = true;
  
  try {
    if (isEditing.value && salaForm.value.id) {
      // Atualizar sala existente
      const { error } = await supabase
        .from('salas')
        .update({
          nome: salaForm.value.nome,
          faixa_etaria_inicio: salaForm.value.faixa_etaria_inicio,
          faixa_etaria_fim: salaForm.value.faixa_etaria_fim,
          capacidade: salaForm.value.capacidade,
          professor: salaForm.value.professor
        })
        .eq('id', salaForm.value.id);
      
      if (error) throw error;
      
      showSuccessAlert('Sala atualizada com sucesso!');
    } else {
      // Criar nova sala
      const { error } = await supabase
        .from('salas')
        .insert([{
          nome: salaForm.value.nome,
          faixa_etaria_inicio: salaForm.value.faixa_etaria_inicio,
          faixa_etaria_fim: salaForm.value.faixa_etaria_fim,
          capacidade: salaForm.value.capacidade,
          professor: salaForm.value.professor
        }]);
      
      if (error) throw error;
      
      showSuccessAlert('Sala criada com sucesso!');
    }
    
    // Recarregar salas e fechar modal
    await loadSalas();
    closeModal();
  } catch (error) {
    console.error('Erro ao salvar sala:', error);
    showErrorAlert('Erro ao salvar sala. Tente novamente.');
  } finally {
    isLoading.value = false;
  }
};

// Excluir sala
const deleteSala = async () => {
  if (!selectedSala.value) return;
  
  isLoading.value = true;
  
  try {
    const { error } = await supabase
      .from('salas')
      .delete()
      .eq('id', selectedSala.value.id);
    
    if (error) throw error;
    
    showSuccessAlert('Sala excluída com sucesso!');
    showDeleteModal.value = false;
    await loadSalas();
  } catch (error) {
    console.error('Erro ao excluir sala:', error);
    showErrorAlert('Erro ao excluir sala. Tente novamente.');
  } finally {
    isLoading.value = false;
  }
};

// Abrir modal para editar sala
const editSala = (sala: any) => {
  isEditing.value = true;
  salaForm.value = {
    id: sala.id,
    nome: sala.nome,
    faixa_etaria_inicio: sala.faixa_etaria_inicio,
    faixa_etaria_fim: sala.faixa_etaria_fim,
    capacidade: sala.capacidade,
    professor: sala.professor || ''
  };
  showAddSalaModal.value = true;
};

// Confirmar exclusão de sala
const confirmDeleteSala = (sala: any) => {
  selectedSala.value = sala;
  showDeleteModal.value = true;
};

// Fechar modal e resetar formulário
const closeModal = () => {
  showAddSalaModal.value = false;
  isEditing.value = false;
  salaForm.value = {
    id: null,
    nome: '',
    faixa_etaria_inicio: 0,
    faixa_etaria_fim: 12,
    capacidade: 20,
    professor: ''
  };
};

// Mostrar alerta de sucesso
const showSuccessAlert = (message: string) => {
  alertMessage.value = message;
  alertType.value = 'success';
  showAlert.value = true;
  setTimeout(() => {
    showAlert.value = false;
  }, 3000);
};

// Mostrar alerta de erro
const showErrorAlert = (message: string) => {
  alertMessage.value = message;
  alertType.value = 'error';
  showAlert.value = true;
  setTimeout(() => {
    showAlert.value = false;
  }, 3000);
};

// Formatar horário
const formatHorario = (horario: string | null) => {
  if (!horario) return 'N/A';
  try {
    // Se for um horário no formato HH:MM:SS
    if (horario.includes(':')) {
      const [horas, minutos] = horario.split(':');
      return `${horas}:${minutos}`;
    }
    return horario;
  } catch (error) {
    console.error('Erro ao formatar horário:', error);
    return 'N/A';
  }
};

// Mostrar/ocultar menu de ações
const showMenu = (salaId: string) => {
  if (activeMenu.value === salaId) {
    activeMenu.value = null;
  } else {
    activeMenu.value = salaId;
  }
  
  // Fechar o menu quando clicar fora dele
  setTimeout(() => {
    const closeMenu = (e: MouseEvent) => {
      activeMenu.value = null;
      document.removeEventListener('click', closeMenu);
    };
    document.addEventListener('click', closeMenu);
  }, 100);
};

// Função de logout
const handleLogout = () => {
  supabase.auth.signOut().then(() => {
    router.push('/login');
  });
};

// Carregar salas ao montar o componente
onMounted(() => {
  loadSalas();
});
</script>

<style scoped>
/* Estilos globais já existentes */
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: #0000FF;
  padding: 24px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  padding: 0 12px;
}

.logo img {
  max-width: 100%;
  height: auto;
  max-height: 60px;
}

.menu-section {
  margin-bottom: 24px;
}

.menu-label {
  font-size: 12px;
  color: white;
  opacity: 0.7;
  padding: 0 12px;
  margin-bottom: 8px;
  display: block;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 4px;
  transition: background-color 0.2s;
}

.menu-item i {
  width: 20px;
  margin-right: 12px;
}

.menu-item.active {
  background: rgba(255, 255, 255, 0.1);
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-section {
  margin-top: auto;
  padding: 12px;
  margin-bottom: 16px;
}

.logout-button {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: white;
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  width: 100%;
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.logout-button i {
  margin-right: 12px;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 24px;
}

/* Top Bar */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.search-container {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 8px 16px;
  width: 300px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-container i {
  color: #6b7280;
  margin-right: 8px;
}

.search-container input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 24px;
}

.date-container {
  display: flex;
  align-items: center;
  color: #6b7280;
  font-size: 14px;
}

.date-container i {
  margin-right: 8px;
}

.notifications-container {
  position: relative;
}

.notifications-container i {
  color: #6b7280;
  font-size: 18px;
}

.notifications {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #0000FF;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-email {
  font-size: 14px;
  color: #111;
}

/* Card Header - estilo semelhante à imagem */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #0000FF;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-header-left i {
  font-size: 24px;
  color: #0000FF;
}

.card-header-text h1 {
  font-size: 20px;
  font-weight: 600;
  color: #111;
  margin-bottom: 4px;
}

.card-header-text p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.add-button {
  background-color: #0000FF;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
}

/* Team Members Grid - estilo da imagem */
.team-members-container {
  margin-bottom: 32px;
}

.team-members-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.team-member-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.card-title h3 {
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin: 0 0 4px 0;
}

.card-subtitle {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.seats-info {
  color: #666;
  font-size: 14px;
}

.seats-count {
  color: #6200ee;
  font-size: 14px;
  font-weight: 500;
}

.card-actions {
  position: relative;
}

.action-button {
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
}

.action-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 120px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.menu-item:hover {
  background: #f5f5f5;
}

.card-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}

.card-details {
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.detail-item i {
  color: #6200ee;
  width: 16px;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.sala-info {
  margin-left: 16px;
}

.sala-info h3 {
  font-size: 16px;
  font-weight: 500;
  color: #111;
  margin-bottom: 4px;
}

.sala-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.sala-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  color: #2d01fe;
  border-color: #2d01fe;
}

.teacher {
  display: inline-flex;
  align-items: center;
  background-color: #e8f4e8;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 12px;
  color: #28a745;
  border: 1px solid #c3e6cb;
  margin-top: 4px;
}

.qr-badge {
  display: inline-flex;
  align-items: center;
  background-color: #e8f4e8;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 12px;
  color: #28a745;
  border: 1px solid #c3e6cb;
}

.faixa-etaria {
  background-color: transparent;
  color: #28a745;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  margin-left: 5px;
}

.capacity {
  display: inline-flex;
  align-items: center;
  background-color: #f0f2ff;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 12px;
  color: #2d01fe;
  border: 1px solid #d1d5ff;
}

.no-data {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #6b7280;
  text-align: center;
}

.no-data i {
  font-size: 32px;
  margin-bottom: 16px;
  color: #d1d5db;
}

.no-data button {
  margin-top: 16px;
}

.loading {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #6b7280;
}

.loading i {
  font-size: 32px;
  margin-bottom: 16px;
  color: #0000FF;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #111;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #374151;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.btn-primary {
  background: #0000FF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.btn-danger:disabled {
  background: #f87171;
  cursor: not-allowed;
}

.warning {
  color: #ef4444;
  font-size: 14px;
  margin-top: 8px;
}

/* Alert */
.alert {
  position: fixed;
  top: 24px;
  right: 24px;
  padding: 16px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 1100;
  animation: slideIn 0.3s ease-out;
}

.alert-success {
  background: #22C55E;
}

.alert-error {
  background: #EF4444;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
