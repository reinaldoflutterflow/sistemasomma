<template>
  <div class="dashboard-container">
    <aside class="sidebar">
      <div class="logo">
        <img src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/aulas-y-t-74meoi/assets/5bwoip7attwb/branco.svg" alt="Logo" />
      </div>

      <div class="menu-section">
        <span class="menu-label">PRINCIPAL</span>
        <router-link to="/dashboard" class="menu-item active">
          <i class="fas fa-home"></i>
          <span>Dashboard</span>
        </router-link>
      </div>

      <div class="menu-section">
        <span class="menu-label">CADASTROS</span>
        <router-link to="/familias" class="menu-item">
          <i class="fas fa-users"></i>
          <span>Famílias</span>
        </router-link>
        <router-link to="/criancas" class="menu-item">
          <i class="fas fa-child"></i>
          <span>Crianças</span>
        </router-link>
        <router-link to="/salas" class="menu-item">
          <i class="fas fa-door-open"></i>
          <span>Salas</span>
        </router-link>
      </div>

      <div class="menu-section">
        <span class="menu-label">OPERAÇÕES</span>
        <router-link to="/checkin" class="menu-item">
          <i class="fas fa-sign-in-alt"></i>
          <span>Check-in</span>
        </router-link>
        <router-link to="/checkout" class="menu-item">
          <i class="fas fa-sign-out-alt"></i>
          <span>Check-out</span>
        </router-link>
        <router-link to="/etiquetas" class="menu-item">
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
        <button @click="handleLogout" class="logout-button">
          <i class="fas fa-sign-out-alt"></i>
          <span>Sair</span>
        </button>
      </div>
    </aside>

    <main class="main-content">
      <div class="top-bar">
        <div class="search-container">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Buscar..." />
        </div>
        <div class="user-controls">
          <div class="date-container">
            <i class="fas fa-calendar"></i>
            <span>{{ currentDate }}</span>
          </div>
          <div class="notifications-container">
            <i class="fas fa-bell"></i>
            <span class="notifications">2</span>
          </div>
          <div class="user-info">
            <span class="user-email">teste@teste.com</span>
          </div>
        </div>
      </div>

      <div class="content">
        <div class="header">
          <div class="header-text">
            <h1>Bem-vindo ao Módulo Infantil</h1>
            <p>Painel de controle do Somma - Sistema de Gerenciamento da Igreja</p>
          </div>
          <div class="period-filter">
            <button class="active">Hoje</button>
            <button>Esta Semana</button>
            <button>Este Mês</button>
            <button>Todos</button>
          </div>
        </div>

        <div class="stats-container">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-info">
                <span class="stat-label">Famílias</span>
                <h3 class="stat-value">1</h3>
                <div class="stat-trend-container">
                  <span class="stat-trend">↑ 3.4%</span>
                </div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-child"></i>
              </div>
              <div class="stat-info">
                <span class="stat-label">Crianças</span>
                <h3 class="stat-value">1</h3>
                <div class="stat-trend-container">
                  <span class="stat-trend">↑ 2.1%</span>
                </div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="stat-info">
                <span class="stat-label">Check-ins Hoje</span>
                <h3 class="stat-value">1</h3>
                <div class="stat-trend-container">
                  <span class="stat-trend">↑ 4.2%</span>
                </div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-desktop"></i>
              </div>
              <div class="stat-info">
                <span class="stat-label">Salas Ativas</span>
                <h3 class="stat-value">3</h3>
                <div class="stat-trend-container">
                  <span class="stat-trend">↑ 1.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="sections-grid">
          <div class="section">
            <div class="section-header">
              <h2>Check-ins Ativos</h2>
              <p>Crianças presentes hoje</p>
              <div class="section-actions">
                <button class="btn-primary" @click="showCheckinModal = true">
                  <i class="fas fa-plus"></i> Novo Check-in
                </button>
                <button class="btn-icon" @click="refreshCheckins">
                  <i class="fas fa-sync-alt"></i>
                </button>
                <button class="btn-icon">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            <div class="checkin-list">
              <div v-if="criancasPresentes.length === 0" class="no-data">
                <i class="fas fa-info-circle"></i>
                <p>Nenhum check-in encontrado para hoje</p>
              </div>
              <div v-else v-for="checkin in criancasPresentes" :key="checkin.id" class="checkin-item">
                <div class="avatar">
                  <i class="fas fa-child"></i>
                </div>
                <div class="info">
                  <h3>{{ checkin.nome }}</h3>
                  <div class="details">
                    <span><i class="fas fa-door-open"></i> {{ checkin.sala }}</span>
                    <span><i class="fas fa-clock"></i> {{ formatarData(checkin.horario_checkin) }}</span>
                    <span><i class="fas fa-user"></i> {{ checkin.responsavel }}</span>
                  </div>
                  <div class="qr-info">
                    <span><i class="fas fa-qrcode"></i> {{ checkin.qr_code.substring(0, 8) }}...</span>
                  </div>
                </div>
                <div class="actions">
                  <button class="btn-outline" @click="handleCheckout(checkin.id)">Check-out</button>
                  <button class="btn-icon" @click="viewQRCode(checkin.qr_code)">
                    <i class="fas fa-eye"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <h2>Salas Ativas</h2>
              <p>Salas disponíveis para check-in</p>
              <div class="section-actions">
                <button class="btn-primary" @click="showSalaModal = true">
                  <i class="fas fa-plus"></i> Nova Sala
                </button>
                <button class="btn-icon">
                  <i class="fas fa-sync-alt"></i>
                </button>
                <button class="btn-icon">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>

            <div class="rooms-list">
              <div v-if="salas.length === 0" class="no-data">
                <i class="fas fa-info-circle"></i>
                <p>Nenhuma sala ativa encontrada</p>
              </div>
              <div v-else v-for="sala in salas" :key="sala.id" class="room-item">
                <div class="room-icon">
                  <i class="fas fa-door-open"></i>
                </div>
                <div class="info">
                  <h3>{{ sala.nome_sala }}</h3>
                  <div class="details">
                    <span><i class="fas fa-child"></i> {{ sala.faixa_etaria_inicio }} a {{ sala.faixa_etaria_fim }} anos</span>
                    <span><i class="fas fa-clock"></i> {{ sala.inicio_aula }} - {{ sala.fim_aula }}</span>
                  </div>
                  <p v-if="sala.professor" class="teacher">Professor: {{ sala.professor }}</p>
                </div>
                <div class="room-status">
                  <span class="capacity">0/{{ sala.capacidade }}</span>
                  <button class="btn-primary" @click="openCheckInModal(sala.id)">Check-in</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Check-in -->
      <div v-if="showCheckinModal" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h2>Novo Check-in</h2>
            <button class="modal-close" @click="closeModal">&times;</button>
          </div>
          
          <form @submit.prevent="handleCheckin">
            <div class="form-group">
              <label>Sala</label>
              <select
                v-model="checkInForm.sala_id"
                required
                @change="handleSalaChange"
              >
                <option value="">Selecione uma sala</option>
                <option v-for="sala in salas" :key="sala.id" :value="sala.id">
                  {{ sala.nome_sala }} ({{ sala.faixa_etaria_inicio }} - {{ sala.faixa_etaria_fim }} anos)
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Família</label>
              <SearchableSelect
                v-model="checkInForm.familia_id"
                :options="familiasOptions"
                @change="handleFamiliaChange"
                placeholder="Selecione uma família"
              />
            </div>
            
            <div class="form-group">
              <label>Criança</label>
              <select v-model="checkInForm.crianca_id" required>
                <option value="">Selecione uma criança</option>
                <option v-for="crianca in criancasFiltradas" :key="crianca.id" :value="crianca.id">
                  {{ crianca.nome }} ({{ calcularIdade(crianca.data_nascimento) }} anos)
                </option>
              </select>
            </div>

            <div v-if="error" class="alert alert-error">
              {{ error }}
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="closeModal">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="isLoading">
                {{ isLoading ? 'Realizando check-in...' : 'Confirmar Check-in' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal de Nova Sala -->
      <div v-if="showSalaModal" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h2>Nova Sala</h2>
            <button class="modal-close" @click="closeSalaModal">&times;</button>
          </div>
          
          <form @submit.prevent="handleSalaSubmit">
            <div class="form-group">
              <label>Nome da Sala</label>
              <input 
                type="text" 
                v-model="salaForm.nome_sala" 
                required
                placeholder="Ex: Sala PQ"
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Faixa Etária Inicial</label>
                <input 
                  type="number" 
                  v-model="salaForm.faixa_etaria_inicio" 
                  required
                  min="0"
                  placeholder="Ex: 2"
                />
              </div>
              
              <div class="form-group">
                <label>Faixa Etária Final</label>
                <input 
                  type="number" 
                  v-model="salaForm.faixa_etaria_fim" 
                  required
                  min="0"
                  placeholder="Ex: 6"
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Início da Aula</label>
                <input 
                  type="time" 
                  v-model="salaForm.inicio_aula" 
                  required
                />
              </div>
              
              <div class="form-group">
                <label>Fim da Aula</label>
                <input 
                  type="time" 
                  v-model="salaForm.fim_aula" 
                  required
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Capacidade</label>
                <input 
                  type="number" 
                  v-model="salaForm.capacidade" 
                  required
                  min="1"
                  placeholder="Ex: 10"
                />
              </div>
              
              <div class="form-group">
                <label>Professor</label>
                <input 
                  type="text" 
                  v-model="salaForm.professor" 
                  placeholder="Nome do professor"
                />
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="closeSalaModal">Cancelar</button>
              <button type="submit" class="btn-primary">
                Cadastrar Sala
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Alert -->
      <div v-if="showAlert" :class="['alert', `alert-${alertType}`]">
        {{ alertMessage }}
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '../services/auth';
import { getDashboardData, getActiveCheckins } from '../services/dashboard';
import type { DashboardData, CriancaPresente } from '../services/dashboard';
import LineChart from './LineChart.vue';
import { supabase } from '../supabase';
import * as QRCode from 'qrcode';
import { getFamilias, getSalas, getCriancasPorFamilia, realizarCheckin } from '../services/checkin';
import type { Familia, Sala, Crianca } from '../services/checkin';
import SearchableSelect from './SearchableSelect.vue';

const router = useRouter();
const selectedPeriod = ref(30);

const periods = [
  { days: 365, label: '365 dias' },
  { days: 180, label: '180 dias' },
  { days: 30, label: '30 dias' },
  { days: 15, label: '15 dias' },
  { days: 7, label: '7 dias' }
];

const dashboardData = ref<DashboardData>({
  total_usuarios: 0,
  total_familias: 0,
  total_criancas: 0,
  total_checkins_hoje: 0,
  total_salas: 0
});

const criancasPresentes = ref<CriancaPresente[]>([]);

// Dados mockados para os gráficos
const chartData = {
  criancas: {
    labels: Array.from({ length: 30 }, (_, i) => `Dia ${i + 1}`),
    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 50)
  },
  checkins: {
    labels: Array.from({ length: 30 }, (_, i) => `Dia ${i + 1}`),
    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 30) + 20)
  },
  familias: {
    labels: Array.from({ length: 30 }, (_, i) => `Dia ${i + 1}`),
    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 20) + 30)
  }
};

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const handleLogout = () => {
  logout();
  router.push('/login');
};

const currentDate = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}).format(new Date()).toLowerCase();

const loading = ref(false);

const loadDashboardData = async () => {
  try {
    loading.value = true;
    const data = await getDashboardData();
    dashboardData.value = data;
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
  } finally {
    loading.value = false;
  }
};

const loadCriancasPresentes = async () => {
  try {
    const data = await getActiveCheckins();
    criancasPresentes.value = data;
  } catch (error) {
    console.error('Erro ao carregar crianças presentes:', error);
  }
};

interface Familia {
  id: string;
  nome_familia: string;
}

interface Crianca {
  id: string;
  nome: string;
  data_nascimento: string;
  familia_id: string;
}

interface Sala {
  id: string;
  nome_sala: string;
  faixa_etaria_inicio: number;
  faixa_etaria_fim: number;
  capacidade: number;
  inicio_aula: string;
  fim_aula: string;
  professor?: string;
}

const showCheckinModal = ref(false);
const familias = ref<Familia[]>([]);
const criancas = ref<Crianca[]>([]);
const salas = ref<Sala[]>([]);

const checkInForm = ref({
  familia_id: '',
  crianca_id: '',
  sala_id: ''
});

const criancasFiltradas = computed(() => {
  if (!checkInForm.value.familia_id) return [];
  
  // Se tiver uma sala selecionada, filtra por faixa etária
  const sala = salas.value.find(s => s.id === checkInForm.value.sala_id);
  if (sala) {
    return criancas.value.filter(c => {
      const idade = calcularIdade(c.data_nascimento);
      return c.familia_id === checkInForm.value.familia_id && 
             idade >= sala.faixa_etaria_inicio && 
             idade <= sala.faixa_etaria_fim;
    });
  }
  
  // Se não tiver sala selecionada, mostra todas as crianças da família
  return criancas.value.filter(c => c.familia_id === checkInForm.value.familia_id);
});

const salasFiltradas = computed(() => {
  // Se não houver criança selecionada, retorna todas as salas
  if (!checkInForm.value.crianca_id) return salas.value;
  
  const crianca = criancas.value.find(c => c.id === checkInForm.value.crianca_id);
  if (!crianca) return [];
  
  const idade = calcularIdade(crianca.data_nascimento);
  return salas.value.filter(s => 
    idade >= s.faixa_etaria_inicio && 
    idade <= s.faixa_etaria_fim
  );
});

const familiasOptions = computed(() => {
  return familias.value.map(familia => ({
    value: familia.id,
    label: familia.nome_familia
  }));
});

const isFormValid = computed(() => {
  return checkInForm.value.familia_id && checkInForm.value.crianca_id && checkInForm.value.sala_id;
});

const loadOptions = async () => {
  try {
    // Carregar famílias com status true
    const { data: familiasData, error: familiasError } = await supabase
      .from('familias')
      .select('id, nome_familia, telefone, email, status')
      .eq('status', true)
      .order('nome_familia');
    
    if (familiasError) throw familiasError;
    familias.value = familiasData || [];
    console.log('Famílias carregadas:', familiasData);
    
    // Carregar todas as crianças
    const { data: criancasData, error: criancasError } = await supabase
      .from('criancas')
      .select('id, nome, data_nascimento, familia_id, genero, restricao_alimentar, necessidade_especial');
    
    if (criancasError) throw criancasError;
    criancas.value = criancasData || [];
    console.log('Crianças carregadas:', criancasData);
    
    // Carregar salas com status true
    const { data: salasData, error: salasError } = await supabase
      .from('salas')
      .select('*')
      .eq('status', true)
      .order('nome_sala');
    
    if (salasError) throw salasError;
    salas.value = salasData || [];
    console.log('Salas carregadas:', salasData);
  } catch (error) {
    console.error('Erro ao carregar opções:', error);
  }
};

const formatarIdade = (dataNascimento: string) => {
  return calcularIdade(dataNascimento);
};

const calcularIdade = (dataNascimento: string) => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade;
};

const gerarQRCode = async (dados: any) => {
  try {
    return await QRCode.toDataURL(JSON.stringify(dados));
  } catch (error) {
    console.error('Erro ao gerar QR code:', error);
    return '';
  }
};

interface CheckinItem {
  id: string;
  crianca: {
    nome: string;
  };
  sala: {
    nome_sala: string;
  };
  data_checkin: string;
}

const checkinsAtivos = ref<CheckinItem[]>([]);
const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref('success');

const loadCheckinsAtivos = async () => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('checkins')
      .select(`
        id,
        crianca:criancas (
          nome
        ),
        sala:salas (
          nome_sala
        ),
        data_checkin
      `)
      .gte('data_checkin', hoje.toISOString())
      .order('data_checkin', { ascending: false });

    if (error) throw error;
    checkinsAtivos.value = data || [];
  } catch (error) {
    console.error('Erro ao carregar check-ins:', error);
    showErrorAlert('Erro ao carregar check-ins ativos');
  }
};

const showSuccessAlert = (message: string) => {
  alertMessage.value = message;
  alertType.value = 'success';
  showAlert.value = true;
  setTimeout(() => {
    showAlert.value = false;
  }, 3000);
};

const showErrorAlert = (message: string) => {
  alertMessage.value = message;
  alertType.value = 'error';
  showAlert.value = true;
  setTimeout(() => {
    showAlert.value = false;
  }, 3000);
};

const handleCheckin = async () => {
  if (!checkInForm.value.sala_id || !checkInForm.value.crianca_id) {
    error.value = 'Por favor, preencha todos os campos';
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    const result = await realizarCheckin(checkInForm.value.sala_id, checkInForm.value.crianca_id);
    if (result.success) {
      showCheckinModal.value = false;
      checkInForm.value = {
        sala_id: '',
        familia_id: '',
        crianca_id: ''
      };
      await loadCheckinsAtivos();
    } else {
      error.value = 'Erro ao realizar check-in';
    }
  } catch (error) {
    console.error('Erro ao realizar check-in:', error);
    error.value = 'Erro ao realizar check-in';
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => {
  showCheckinModal.value = false;
  checkInForm.value = {
    familia_id: '',
    crianca_id: '',
    sala_id: ''
  };
  error.value = '';
};

const showSalaModal = ref(false);
const salaForm = reactive<SalaForm>({
  nome_sala: '',
  faixa_etaria_inicio: 0,
  faixa_etaria_fim: 0,
  inicio_aula: '',
  fim_aula: '',
  capacidade: 0,
  professor: ''
});

const handleSalaSubmit = async () => {
  try {
    const { data, error } = await supabase
      .from('salas')
      .insert({
        ...salaForm,
        status: true
      });

    if (error) throw error;

    showSuccessAlert('Sala cadastrada com sucesso!');
    closeSalaModal();
    await loadOptions(); // Recarrega as salas
  } catch (error) {
    console.error('Erro ao cadastrar sala:', error);
    showErrorAlert('Erro ao cadastrar sala');
  }
};

const closeSalaModal = () => {
  showSalaModal.value = false;
  salaForm.nome_sala = '';
  salaForm.faixa_etaria_inicio = 0;
  salaForm.faixa_etaria_fim = 0;
  salaForm.inicio_aula = '';
  salaForm.fim_aula = '';
  salaForm.capacidade = 0;
  salaForm.professor = '';
};

const openCheckInModal = (salaId: string) => {
  // Limpa o formulário antes de abrir
  checkInForm.value.familia_id = '';
  checkInForm.value.crianca_id = '';
  
  // Define a sala selecionada
  checkInForm.value.sala_id = salaId;
  showCheckinModal.value = true;
};

const handleFamiliaChange = async () => {
  checkInForm.value.crianca_id = '';
  
  if (checkInForm.value.familia_id) {
    try {
      // Buscar todas as crianças da família
      const { data, error } = await supabase
        .from('criancas')
        .select('*')
        .eq('familia_id', checkInForm.value.familia_id);
      
      if (error) throw error;
      
      // Atualizar a lista de crianças
      criancas.value = data || [];
      console.log('Crianças da família carregadas:', data);
      
      // O computed criancasFiltradas já vai filtrar por faixa etária se uma sala estiver selecionada
    } catch (error) {
      console.error('Erro ao carregar crianças:', error);
    }
  } else {
    criancas.value = [];
  }
};

const handleSalaChange = () => {
  checkInForm.value.familia_id = '';
  checkInForm.value.crianca_id = '';
  criancas.value = [];
};

const formatarData = (data: string) => {
  return new Date(data).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const refreshCheckins = async () => {
  try {
    criancasPresentes.value = await getCriancasPresentes();
  } catch (error) {
    console.error('Erro ao atualizar check-ins:', error);
  }
};

const handleCheckout = async (checkinId: string) => {
  try {
    // Implementar lógica de checkout
    await refreshCheckins();
  } catch (error) {
    console.error('Erro ao fazer checkout:', error);
  }
};

const viewQRCode = (qrCode: string) => {
  // Exibir o QR code em um modal ou popup
  alert(`QR Code: ${qrCode}`);
  // Aqui você pode implementar uma visualização melhor do QR code
};

const loadActiveCheckins = async () => {
  try {
    const data = await getActiveCheckins();
    criancasPresentes.value = data;
    console.log('Check-ins carregados:', data);
  } catch (error) {
    console.error('Erro ao carregar checkins ativos:', error);
  }
};

const loadActiveSalas = async () => {
  try {
    const { data, error } = await supabase
      .from('salas')
      .select('*')
      .eq('status', true)
      .order('nome_sala');
    
    if (error) throw error;
    salas.value = data || [];
    console.log('Salas ativas carregadas:', data);
  } catch (error) {
    console.error('Erro ao carregar salas ativas:', error);
  }
};

onMounted(async () => {
  await Promise.all([
    loadDashboardData(),
    loadActiveCheckins(),
    loadActiveSalas(),
    loadOptions()
  ]);
});
</script>

<style scoped>
/* Reset e base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f8f9ff;
}

.dashboard-container {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  max-width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
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
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-weight: 500;
  color: white;
}

.user-role {
  font-size: 12px;
  color: white;
  opacity: 0.7;
}

/* Main Content */
.main-content {
  margin-left: 280px;
  width: calc(100vw - 280px);
  min-height: 100vh;
  background: #f8f9ff;
  padding: 70px 0 0 0;
}

/* Menu Superior */
.top-bar {
  position: fixed;
  top: 0;
  right: 0;
  left: 280px;
  height: 70px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  border-bottom: 1px solid #eee;
  z-index: 100;
}

.search-container {
  display: flex;
  align-items: center;
  background: transparent;
  padding: 12px 16px;
  border-radius: 8px;
  width: 300px;
}

.search-container i {
  color: #666;
  margin-right: 12px;
  font-size: 14px;
}

.search-container input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  background: transparent;
  color: #333;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 32px;
}

.date-container {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.date-container i {
  color: #666;
  font-size: 16px;
}

.notifications-container {
  position: relative;
  cursor: pointer;
}

.notifications-container i {
  font-size: 20px;
  color: #666;
}

.notifications {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #0000FF;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-email {
  color: #666;
  font-size: 14px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #0000FF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

/* Dashboard Content */
.content {
  padding: 24px;
}

.header {
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-text h1 {
  font-size: 24px;
  font-weight: 600;
  color: #111;
  margin-bottom: 4px;
}

.header-text p {
  color: #666;
  font-size: 14px;
}

.period-filter {
  display: flex;
  gap: 16px;
}

.period-filter button {
  padding: 8px 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: white;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.period-filter button:hover {
  border-color: #0000FF;
  color: #0000FF;
}

.period-filter button.active {
  background: #0000FF;
  color: white;
  border-color: #0000FF;
}

/* Stats Container */
.stats-container {
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(63, 81, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon i {
  font-size: 24px;
  color: #0000FF;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  color: #111;
  margin: 0;
  line-height: 1;
}

.stat-trend-container {
  background: rgba(34, 197, 94, 0.1);
  padding: 4px 8px;
  border-radius: 100px;
  width: fit-content;
  margin-top: 12px;
}

.stat-trend {
  color: #22C55E;
  font-size: 14px;
  font-weight: 500;
}

/* Sections Grid */
.sections-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.section {
  background: white;
  border-radius: 16px;
  padding: 24px;
}

.section-header {
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #111;
  margin-bottom: 4px;
}

.section-header p {
  color: #666;
  font-size: 14px;
}

.section-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.btn-primary {
  background: #0000FF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  outline: none;
}

.btn-primary:focus {
  outline: none;
  box-shadow: none;
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

.btn-icon:hover,
.btn-icon:focus {
  outline: 2px solid #2d00ff;
  outline-offset: 1px;
  color: #2d00ff;
  border-color: transparent;
}

.checkin-list,
.rooms-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  color: #6b7280;
  text-align: center;
}

.no-data i {
  font-size: 32px;
  margin-bottom: 12px;
  color: #d1d5db;
}

.checkin-item,
.room-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f8f9ff;
  border-radius: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #0000FF;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.room-icon {
  width: 40px;
  height: 40px;
  background: #f0f2ff;
  color: #0000FF;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info {
  flex: 1;
  margin-left: 16px;
}

.info h3 {
  font-size: 16px;
  font-weight: 500;
  color: #111;
  margin-bottom: 4px;
}

.details {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 14px;
  flex-wrap: wrap;
}

.qr-info {
  margin-top: 8px;
  font-size: 13px;
  color: #4b5563;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.details span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.teacher {
  color: #666;
  font-size: 14px;
  margin-top: 4px;
}

.room-status {
  display: flex;
  align-items: center;
  gap: 16px;
}

.capacity {
  color: #666;
  font-size: 14px;
}

.btn-outline {
  border: 1px solid #e5e7eb;
  background: white;
  color: #666;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover,
.btn-outline:focus {
  outline: 2px solid #2d00ff;
  outline-offset: 1px;
  color: #2d00ff;
  border-color: transparent;
}

/* Modal de Check-in */
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

.modal {
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #111;
}

.modal-close {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group select {
  width: 100%;
  padding: 12px 30px 12px 12px; /* Aumentado o padding direito para dar espaço à seta */
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  cursor: pointer;
  appearance: none; /* Remove a aparência padrão do select */
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}

.form-group select:focus {
  outline: none;
  border-color: #0000FF;
  box-shadow: 0 0 0 2px rgba(0, 0, 255, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-secondary {
  background: #f3f4f6;
  color: #666;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #0000FF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

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

/* Adicione ao final do arquivo */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

input[type="text"],
input[type="number"],
input[type="time"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  background-color: #fff;
}

input[type="text"]:focus,
input[type="number"]:focus,
input[type="time"]:focus {
  outline: none;
  border-color: #0000FF;
  box-shadow: 0 0 0 2px rgba(0, 0, 255, 0.1);
}

@media (max-width: 1400px) {
  .sections-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 80px;
    width: calc(100vw - 80px);
  }
}

@media (max-width: 768px) {
  .sections-grid {
    width: calc(100% - 32px);
    margin: 0 16px;
  }
  
  .content {
    padding: 24px 16px;
  }
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background: #f8f9ff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-button:hover {
  background: #f3f4f6;
  color: #2d00ff;
}

.logout-button i {
  font-size: 16px;
}
</style> 