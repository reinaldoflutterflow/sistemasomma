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
                <h3 class="stat-value">{{ dashboardData.total_familias }}</h3>
                <div class="stat-trend-container" :class="{ 'positive-bg': dashboardData.tendencia_familias > 0, 'negative-bg': dashboardData.tendencia_familias < 0 }">
                  <span class="stat-trend" :class="{ 'positive': dashboardData.tendencia_familias > 0, 'negative': dashboardData.tendencia_familias < 0 }">
                    {{ dashboardData.tendencia_familias > 0 ? '↑' : '↓' }} {{ Math.abs(dashboardData.tendencia_familias) }}%
                  </span>
                </div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-child"></i>
              </div>
              <div class="stat-info">
                <span class="stat-label">Crianças</span>
                <h3 class="stat-value">{{ dashboardData.total_criancas }}</h3>
                <div class="stat-trend-container" :class="{ 'positive-bg': dashboardData.tendencia_criancas > 0, 'negative-bg': dashboardData.tendencia_criancas < 0 }">
                  <span class="stat-trend" :class="{ 'positive': dashboardData.tendencia_criancas > 0, 'negative': dashboardData.tendencia_criancas < 0 }">
                    {{ dashboardData.tendencia_criancas > 0 ? '↑' : '↓' }} {{ Math.abs(dashboardData.tendencia_criancas) }}%
                  </span>
                </div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="stat-info">
                <span class="stat-label">Check-ins Hoje</span>
                <h3 class="stat-value">{{ dashboardData.checkins_hoje }}</h3>
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
                <h3 class="stat-value">{{ dashboardData.total_salas }}</h3>
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
                    <span><i class="fas fa-user"></i> {{ checkin.familia }}</span>
                  </div>
                  <div class="qr-info">
                    <span class="qr-badge">
                      <i class="fas fa-qrcode"></i>
                      <span class="faixa-etaria">{{ checkin.faixa_etaria_inicio }}-{{ checkin.faixa_etaria_fim }} anos</span>
                    </span>
                  </div>
                </div>
                <div class="actions">
                  <button class="btn-outline" @click="handleCheckout">Check-out</button>
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
            
            <div class="form-group">
              <label>Responsável</label>
              <select v-model="checkInForm.responsavel_id" required>
                <option value="">Selecione um responsável</option>
                <option v-for="responsavel in responsaveis" :key="responsavel.id" :value="responsavel.id">
                  {{ responsavel.nome }} ({{ responsavel.parentesco }})
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

      <!-- Modal de Check-out -->
      <div v-if="showCheckoutModal" class="modal-overlay">
        <div class="modal checkout-modal">
          <div class="modal-header">
            <h2>Confirmar Check-out</h2>
            <button class="modal-close" @click="closeCheckoutModal">&times;</button>
          </div>
          <div class="checkout-info" v-if="selectedCheckin">
            <div class="checkout-section">
              <h3>Informações da Criança</h3>
              <p><strong>Nome:</strong> {{ selectedCheckin.nome }}</p>
            </div>
            <div class="checkout-section">
              <h3>Informações da Sala</h3>
              <p><strong>Sala:</strong> {{ selectedCheckin.sala }}</p>
              <p><strong>Horário de Check-in:</strong> {{ formatarData(selectedCheckin.horario_checkin) }}</p>
            </div>
            <div class="checkout-section">
              <h3>Informações do Responsável</h3>
              <p><strong>Família:</strong> {{ selectedCheckin.familia }}</p>
              <p><strong>Responsável:</strong> {{ selectedCheckin.responsavel }} <span v-if="selectedCheckin.parentesco">({{ selectedCheckin.parentesco }})</span></p>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeCheckoutModal">Cancelar</button>
            <button type="button" class="btn-primary" @click="realizarCheckout(selectedCheckin.id)" :disabled="isLoading">
              {{ isLoading ? 'Processando...' : 'Confirmar Check-out' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de QR Code -->
      <div v-if="showQRCodeModal" class="modal-overlay">
        <div class="modal qr-modal">
          <div class="modal-header">
            <h2>QR Code</h2>
            <button class="modal-close" @click="showQRCodeModal = false">&times;</button>
          </div>
          <div class="qr-code-container">
            <img :src="currentQRCode" alt="QR Code" class="qr-code-image" />
          </div>
        </div>
      </div>

      <!-- Modal do Scanner de QR Code -->
      <div v-if="showQRScannerModal" class="modal-overlay">
        <div class="modal scanner-modal">
          <QrCodeScanner 
            @close="showQRScannerModal = false" 
            :onSuccess="handleQRCodeSuccess" 
            :onError="handleQRCodeError"
          />
        </div>
      </div>

      <!-- Modal de Cadastro de Responsável -->
      <div v-if="showResponsavelModal" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h2>Cadastrar Responsável</h2>
            <button class="modal-close" @click="closeResponsavelModal">&times;</button>
          </div>
          
          <form @submit.prevent="handleResponsavelSubmit">
            <div class="form-group">
              <label>Família</label>
              <div class="search-select-container">
                <input 
                  type="text" 
                  v-model="responsavelForm.searchFamilia" 
                  @input="filterFamilias"
                  @focus="showFamiliaDropdown = true"
                  placeholder="Pesquisar família..."
                  class="form-control"
                  required
                />
                <div v-if="showFamiliaDropdown && filteredFamilias.length > 0" class="search-select-dropdown">
                  <div 
                    v-for="familia in filteredFamilias" 
                    :key="familia.id"
                    class="search-select-item"
                    @click="selectFamilia(familia)"
                  >
                    {{ familia.nome_familia }}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label>Nome do Responsável</label>
              <input 
                type="text" 
                v-model="responsavelForm.nome" 
                required
                placeholder="Ex: João Silva"
                class="form-control"
              />
            </div>
            
            <div class="form-group">
              <label>Telefone</label>
              <input 
                type="text" 
                v-model="responsavelForm.telefone" 
                @input="formatarTelefone"
                required
                placeholder="Ex: (11) 9 9999-9999"
                class="form-control"
                maxlength="16"
                autocomplete="tel"
              />
            </div>
            
            <div class="form-group">
              <label>Parentesco</label>
              <select 
                v-model="responsavelForm.parentesco" 
                required
                class="form-control"
              >
                <option value="" disabled selected>Selecione o parentesco</option>
                <option value="Pai">Pai</option>
                <option value="Mãe">Mãe</option>
                <option value="Tio">Tio</option>
                <option value="Avô">Avô</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            
            <div class="form-group" v-if="responsavelForm.parentesco === 'Outro'">
              <label>Especifique o parentesco</label>
              <input 
                type="text" 
                v-model="responsavelForm.outroParentesco" 
                required
                placeholder="Ex: Padrinho, Madrinha, etc."
                class="form-control"
              />
              <small class="form-text text-muted">Esta informação será salva nas observações do responsável</small>
            </div>
            
            <!-- Checkboxes removidos conforme solicitado -->
            
            <div class="form-group">
              <label>Foto <span class="required">*</span></label>
              <FileUpload 
                :maxSizeMB="10" 
                @file-selected="onFileSelected" 
                @upload="onFileUpload"
                @cancel="onCancelUpload"
              />
              <div v-if="fotoRequired && !responsavelForm.foto" class="error-message">
                Por favor, selecione uma foto
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="closeResponsavelModal">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="isLoading">
                {{ isLoading ? 'Cadastrando...' : 'Cadastrar Responsável' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal de Cadastro de Família -->
      <div v-if="showFamiliaModal" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h2>Cadastrar Família</h2>
            <button class="modal-close" @click="closeFamiliaModal">&times;</button>
          </div>
          
          <form @submit.prevent="handleFamiliaSubmit">
            <div class="form-group">
              <label>Nome da Família</label>
              <input 
                type="text" 
                v-model="familiaForm.nome_familia" 
                required
                placeholder="Ex: Família Silva"
                class="form-control"
              />
            </div>
            
            <div class="form-group">
              <label>Telefone</label>
              <input 
                type="text" 
                v-model="familiaForm.telefone" 
                required
                placeholder="Ex: (11) 99999-9999"
                class="form-control"
              />
            </div>
            
            <div class="form-group">
              <label>Email</label>
              <input 
                type="email" 
                v-model="familiaForm.email" 
                placeholder="Ex: familia@email.com"
                class="form-control"
              />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Cidade</label>
                <input 
                  type="text" 
                  v-model="familiaForm.cidade" 
                  placeholder="Ex: Araruama"
                  class="form-control"
                />
              </div>
              
              <div class="form-group">
                <label>Estado</label>
                <input 
                  type="text" 
                  v-model="familiaForm.estado" 
                  placeholder="Ex: RJ"
                  class="form-control"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label>Endereço</label>
              <textarea 
                v-model="familiaForm.endereco" 
                placeholder="Endereço completo"
                class="form-control"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label>Observações</label>
              <textarea 
                v-model="familiaForm.observacoes" 
                placeholder="Observações sobre a família"
                class="form-control"
              ></textarea>
            </div>
            
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="familiaForm.visitante" />
                Visitante
              </label>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="closeFamiliaModal">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="isLoading">
                {{ isLoading ? 'Cadastrando...' : 'Cadastrar Família' }}
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

      <div class="content">
        <h2 class="acoes-title">Ações Rápidas</h2>
        <div class="acoes-grid">
        <div class="acao-card">
          <div class="acao-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <span class="acao-label">Novo Check-in</span>
        </div>
        <div class="acao-card" @click="handleCheckout">
          <div class="acao-icon">
            <i class="fas fa-sign-out-alt"></i>
          </div>
          <span class="acao-label">Novo Check-out</span>
        </div>
        <div class="acao-card" @click="showFamiliaModal = true">
          <div class="acao-icon">
            <i class="fas fa-users"></i>
          </div>
          <span class="acao-label">Cadastrar Família</span>
        </div>
        <div class="acao-card">
          <div class="acao-icon">
            <i class="fas fa-child"></i>
          </div>
          <span class="acao-label">Cadastrar Criança</span>
        </div>
        <div class="acao-card">
          <div class="acao-icon">
            <i class="fas fa-chalkboard"></i>
          </div>
          <span class="acao-label">Gerenciar Salas</span>
        </div>
        <div class="acao-card">
          <div class="acao-icon">
            <i class="fas fa-tag"></i>
          </div>
          <span class="acao-label">Imprimir Etiquetas</span>
        </div>
        <div class="acao-card" @click="showResponsavelModal = true">
          <div class="acao-icon">
            <i class="fas fa-user-plus"></i>
          </div>
          <span class="acao-label">Cadastrar Responsável</span>
        </div>
      </div>
    </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import FileUpload from './FileUpload.vue';
import { useRouter } from 'vue-router';
import { logout } from '../services/auth';
import { getDashboardData, getActiveCheckins, finalizarCheckin, verificarCheckoutExistente } from '../services/dashboard';
import type { DashboardData, CriancaPresente } from '../services/dashboard';
import LineChart from './LineChart.vue';
import { supabase } from '../supabase';
import * as QRCode from 'qrcode';
import { cadastrarResponsavel } from '../services/responsaveis';
import { getFamilias, getSalas, getCriancasPorFamilia, realizarCheckin, getResponsaveisPorFamilia } from '../services/checkin';
import type { Familia, Sala, Crianca, Responsavel } from '../services/checkin';
import SearchableSelect from './SearchableSelect.vue';
import QrCodeScanner from './QrCodeScanner.vue';

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
  sala_id: '',
  responsavel_id: ''
});

const responsaveis = ref<Responsavel[]>([]);
const error = ref('');

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
  return checkInForm.value.familia_id && checkInForm.value.crianca_id && checkInForm.value.sala_id && checkInForm.value.responsavel_id;
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
  if (!checkInForm.value.sala_id || !checkInForm.value.crianca_id || !checkInForm.value.responsavel_id) {
    showErrorAlert('Por favor, preencha todos os campos');
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    const result = await realizarCheckin(checkInForm.value.sala_id, checkInForm.value.crianca_id, checkInForm.value.responsavel_id);
    if (result.success) {
      showCheckinModal.value = false;
      checkInForm.value = {
        sala_id: '',
        familia_id: '',
        crianca_id: '',
        responsavel_id: ''
      };
      await loadCriancasPresentes();
      showSuccessAlert('Check-in realizado com sucesso!');
    } else {
      error.value = 'Erro ao realizar check-in';
      showErrorAlert('Erro ao realizar check-in');
    }
  } catch (err) {
    console.error('Erro ao realizar check-in:', err);
    error.value = 'Erro ao realizar check-in';
    showErrorAlert('Erro ao realizar check-in');
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => {
  showCheckinModal.value = false;
  checkInForm.value = {
    familia_id: '',
    crianca_id: '',
    sala_id: '',
    responsavel_id: ''
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

const showFamiliaModal = ref(false);
const familiaForm = reactive({
  nome_familia: '',
  telefone: '',
  email: '',
  endereco: '',
  estado: 'RJ',
  cidade: 'Araruama',
  observacoes: '',
  visitante: false
});

const showResponsavelModal = ref(false);
const showFamiliaDropdown = ref(false);

// Métodos para o upload de arquivo
const onFileSelected = (file) => {
  responsavelForm.foto = file;
  console.log('Arquivo selecionado:', file.name);
};

const onFileUpload = (file) => {
  console.log('Arquivo enviado:', file.name);
  // O upload real será feito ao submeter o formulário
};

const onCancelUpload = () => {
  responsavelForm.foto = null;
  console.log('Upload cancelado');
};

// Função para formatar o telefone com máscara
const formatarTelefone = () => {
  // Remove todos os caracteres não numéricos
  let numeros = responsavelForm.telefone.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  numeros = numeros.substring(0, 11);
  
  let telefoneFormatado = '';
  
  // Aplica a máscara (xx) x xxxx-xxxx
  if (numeros.length > 0) {
    // Adiciona o DDD entre parênteses
    telefoneFormatado = '(' + numeros.substring(0, Math.min(2, numeros.length));
    
    if (numeros.length > 2) {
      // Fecha o parêntese do DDD
      telefoneFormatado += ') ';
      
      // Adiciona o primeiro dígito após o DDD
      telefoneFormatado += numeros.substring(2, 3);
      
      if (numeros.length > 3) {
        // Adiciona espaço após o primeiro dígito
        telefoneFormatado += ' ';
        
        // Adiciona os próximos 4 dígitos
        if (numeros.length > 3) {
          telefoneFormatado += numeros.substring(3, Math.min(7, numeros.length));
        }
        
        if (numeros.length > 7) {
          // Adiciona hífen antes dos últimos 4 dígitos
          telefoneFormatado += '-';
          
          // Adiciona os últimos 4 dígitos
          telefoneFormatado += numeros.substring(7, Math.min(11, numeros.length));
        }
      }
    }
  }
  
  // Atualiza o valor no formulário com a máscara
  responsavelForm.telefone = telefoneFormatado;
};
const responsavelForm = reactive({
  familia_id: '',
  nome: '',
  telefone: '',
  parentesco: '',
  outroParentesco: '',
  whatsapp: true, // Sempre true
  pode_fazer_checkout: true, // Sempre true
  searchFamilia: '',
  selectedFamilia: null,
  observacoes: '',
  foto: null
});

const fotoRequired = ref(false);

const allFamilias = ref([]);
const filteredFamilias = ref([]);
const isLoading = ref(false);

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

const handleFamiliaSubmit = async () => {
  try {
    isLoading.value = true;
    
    const { data, error } = await supabase
      .from('familias')
      .insert({
        nome_familia: familiaForm.nome_familia,
        telefone: familiaForm.telefone,
        email: familiaForm.email || null,
        endereco: familiaForm.endereco || null,
        estado: familiaForm.estado || null,
        cidade: familiaForm.cidade || null,
        observacoes: familiaForm.observacoes || null,
        visitante: familiaForm.visitante || false,
        status: true
      });

    if (error) throw error;

    showSuccessAlert('Família cadastrada com sucesso!');
    closeFamiliaModal();
    await loadOptions(); // Recarrega as famílias
  } catch (error) {
    console.error('Erro ao cadastrar família:', error);
    showErrorAlert('Erro ao cadastrar família');
  } finally {
    isLoading.value = false;
  }
};

const closeFamiliaModal = () => {
  showFamiliaModal.value = false;
  familiaForm.nome_familia = '';
  familiaForm.telefone = '';
  familiaForm.email = '';
  familiaForm.endereco = '';
  familiaForm.estado = 'RJ';
  familiaForm.cidade = 'Araruama';
  familiaForm.observacoes = '';
  familiaForm.visitante = false;
};

const closeResponsavelModal = () => {
  showResponsavelModal.value = false;
  responsavelForm.familia_id = '';
  responsavelForm.nome = '';
  responsavelForm.telefone = '';
  responsavelForm.parentesco = '';
  responsavelForm.outroParentesco = '';
  responsavelForm.whatsapp = true;
  responsavelForm.pode_fazer_checkout = true;
  responsavelForm.searchFamilia = '';
  responsavelForm.selectedFamilia = null;
  responsavelForm.observacoes = '';
  responsavelForm.foto = null;
  showFamiliaDropdown.value = false;
};

const filterFamilias = () => {
  if (!responsavelForm.searchFamilia) {
    filteredFamilias.value = allFamilias.value;
    return;
  }
  
  const search = responsavelForm.searchFamilia.toLowerCase();
  filteredFamilias.value = allFamilias.value.filter(familia => 
    familia.nome_familia.toLowerCase().includes(search)
  );
};

const selectFamilia = (familia) => {
  responsavelForm.familia_id = familia.id;
  responsavelForm.searchFamilia = familia.nome_familia;
  responsavelForm.selectedFamilia = familia;
  showFamiliaDropdown.value = false;
};



const loadFamilias = async () => {
  try {
    const { data, error } = await supabase
      .from('familias')
      .select('id, nome_familia')
      .eq('status', true)
      .order('nome_familia');
      
    if (error) throw error;
    
    allFamilias.value = data || [];
    filteredFamilias.value = data || [];
  } catch (error) {
    console.error('Erro ao carregar famílias:', error);
    showErrorAlert('Erro ao carregar lista de famílias');
  }
};

const handleResponsavelSubmit = async () => {
  try {
    // Remover a máscara do telefone antes de salvar
    const telefoneNumerico = responsavelForm.telefone.replace(/\D/g, '');
    // Resetar flag de validação
    fotoRequired.value = false;
    
    if (!responsavelForm.familia_id) {
      showErrorAlert('Por favor, selecione uma família');
      return;
    }
    
    // Validar se foi especificado o outro parentesco quando selecionado "Outro"
    if (responsavelForm.parentesco === 'Outro' && !responsavelForm.outroParentesco) {
      showErrorAlert('Por favor, especifique o parentesco');
      return;
    }
    
    // Validar se a foto foi selecionada
    if (!responsavelForm.foto) {
      fotoRequired.value = true;
      showErrorAlert('Por favor, selecione uma foto');
      return;
    }
    
    isLoading.value = true;
    console.log('Iniciando cadastro de responsável');
    
    // Preparar observações se for "Outro" parentesco
    let observacoes = responsavelForm.observacoes || '';
    if (responsavelForm.parentesco === 'Outro' && responsavelForm.outroParentesco) {
      observacoes = `Parentesco específico: ${responsavelForm.outroParentesco}` + 
        (observacoes ? '\n' + observacoes : '');
    }
    
    // Declarar a variável fotoUrl antes de usá-la
    let fotoUrl = null;
    
    // Dados para inserir - versão simplificada
    const dadosResponsavel = {
      familia_id: responsavelForm.familia_id,
      nome: responsavelForm.nome,
      telefone: telefoneNumerico, // Telefone sem máscara
      parentesco: responsavelForm.parentesco,
      whatsapp: true, // Sempre true
      pode_fazer_checkout: true // Sempre true
      // O campo foto será adicionado após o upload
    };
    
    // Adicionar observações apenas se existirem
    if (observacoes) {
      dadosResponsavel.observacoes = observacoes;
    }
    
    // Upload da foto para o webhook
    if (responsavelForm.foto) {
      try {
        console.log('Iniciando upload da foto para o webhook...');
        
        // Criar um FormData para enviar como multipart/form-data
        const formData = new FormData();
        formData.append('data', responsavelForm.foto);
        
        // Fazer a chamada para o webhook
        const response = await fetch('https://n8nwebhook.paraisoambiental.com.br/webhook/efd81894-d1bd-4e24-8d66-1d9eeca342f2', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Erro na resposta do webhook: ${response.status}`);
        }
        
        // Processar a resposta
        const responseData = await response.json();
        console.log('Resposta do webhook:', responseData);
        
        // Extrair o webViewLink da resposta
        if (responseData && responseData.webViewLink) {
          fotoUrl = responseData.webViewLink;
          console.log('Link da foto obtido:', fotoUrl);
          
          // Adicionar o link da foto aos dados do responsável
          dadosResponsavel.foto = fotoUrl;
        } else {
          console.error('webViewLink não encontrado na resposta');
        }
      } catch (uploadError) {
        console.error('Erro no processo de upload para o webhook:', uploadError);
        showErrorAlert('Erro ao fazer upload da foto. Tente novamente.');
        isLoading.value = false;
        return;
      }
    }
    
    console.log('Dados para inserir:', JSON.stringify(dadosResponsavel));
    
    // Tentar inserir no formato de array (padrão do Supabase)
    console.log('Tentando inserir com formato de array...');
    const { data, error } = await supabase
      .from('responsaveis')
      .insert([dadosResponsavel]);
    
    console.log('Resposta do Supabase:', JSON.stringify({ data, error }));
    
    if (error) {
      console.error('Erro detalhado:', JSON.stringify(error));
      throw error;
    }

    showSuccessAlert('Responsável cadastrado com sucesso!');
    closeResponsavelModal();
    await loadFamilias(); // Recarrega as famílias
  } catch (error) {
    console.error('Erro ao cadastrar responsável:', error);
    showErrorAlert('Erro ao cadastrar responsável');
  } finally {
    isLoading.value = false;
  }

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
  checkInForm.value.responsavel_id = '';
  
  if (checkInForm.value.familia_id) {
    try {
      // Buscar todas as crianças da família
      const { data: criancasData, error: criancasError } = await supabase
        .from('criancas')
        .select('*')
        .eq('familia_id', checkInForm.value.familia_id);
      
      if (criancasError) throw criancasError;
      criancas.value = criancasData || [];
      console.log('Crianças da família carregadas:', criancasData);
      
      // Buscar todos os responsáveis da família
      const { data: responsaveisData, error: responsaveisError } = await supabase
        .from('responsaveis')
        .select('*')
        .eq('familia_id', checkInForm.value.familia_id)
        .order('nome');
      
      if (responsaveisError) throw responsaveisError;
      responsaveis.value = responsaveisData || [];
      console.log('Responsáveis carregados:', responsaveisData);
      
      // O computed criancasFiltradas já vai filtrar por faixa etária se uma sala estiver selecionada
    } catch (error) {
      console.error('Erro ao carregar dados da família:', error);
    }
  } else {
    criancas.value = [];
    responsaveis.value = [];
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
    console.log('Atualizando lista de check-ins ativos...');
    const checkinsAtivos = await getActiveCheckins();
    console.log('Check-ins ativos recebidos:', checkinsAtivos);
    criancasPresentes.value = checkinsAtivos;
  } catch (error) {
    console.error('Erro ao atualizar check-ins:', error);
    console.error('Detalhes do erro:', JSON.stringify(error));
  }
};

const showCheckoutModal = ref(false);
const selectedCheckin = ref<any>(null);

const showQRScannerModal = ref(false);

const handleCheckout = async () => {
  // Abrir o scanner de QR Code
  showQRScannerModal.value = true;
};

const realizarCheckout = (checkinId: string) => {
  // Verificar se temos os dados do QR Code
  if (!selectedCheckin.value || !selectedCheckin.value.qrCodeData) {
    showErrorAlert('Dados do QR Code não disponíveis. Tente novamente.');
    return;
  }
  
  console.log('Realizando checkout para:', checkinId);
  isLoading.value = true;
  
  // Preparar os dados para o checkout
  const checkoutData = {
    checkinId: checkinId,
    responsavelId: selectedCheckin.value.qrCodeData.responsavel?.id,
    qrLido: JSON.stringify(selectedCheckin.value.qrCodeData)
  };
  
  // Executar o checkout usando a nova função
  finalizarCheckin(checkoutData)
    .then(success => {
      isLoading.value = false;
      
      if (success) {
        // Remover o item da lista de crianças presentes (interface)
        criancasPresentes.value = criancasPresentes.value.filter(
          checkin => checkin.id !== checkinId
        );
        
        // Fechar o modal e mostrar mensagem de sucesso
        showSuccessAlert('Check-out realizado com sucesso!');
        showCheckoutModal.value = false;
      } else {
        showErrorAlert('Erro ao realizar check-out. Tente novamente.');
      }
    })
    .catch(error => {
      isLoading.value = false;
      console.error('Erro ao finalizar check-in:', error);
      showErrorAlert('Erro ao realizar check-out. Tente novamente.');
    });
};

const handleQRCodeSuccess = async (data: any) => {
  console.log('QR Code lido com sucesso:', data);
  showQRScannerModal.value = false;
  isLoading.value = true;
  
  try {
    // Verificar se o QR Code contém os dados esperados
    if (!data.crianca || !data.sala || !data.responsavel || !data.data_checkin) {
      showErrorAlert('QR Code inválido. Formato incorreto.');
      isLoading.value = false;
      return;
    }
    
    // Verificar se a data do check-in é a data atual
    const dataCheckin = new Date(data.data_checkin);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataCheckinInicioDia = new Date(dataCheckin);
    dataCheckinInicioDia.setHours(0, 0, 0, 0);
    
    if (dataCheckinInicioDia.getTime() !== hoje.getTime()) {
      showErrorAlert('Check-in não é válido para hoje. Data vencida.');
      isLoading.value = false;
      return;
    }
    
    // Buscar o check-in correspondente
    const checkin = criancasPresentes.value.find(c => 
      c.nome === data.crianca.nome && 
      c.sala === data.sala.nome
    );
    
    if (!checkin) {
      showErrorAlert('Check-in não encontrado no sistema.');
      isLoading.value = false;
      return;
    }
    
    // Verificar se o check-in já possui um checkout registrado
    const checkoutExistente = await verificarCheckoutExistente(checkin.id);
    if (checkoutExistente) {
      showErrorAlert('Este check-in já possui um checkout registrado.');
      isLoading.value = false;
      return;
    }
    
    // Exibir modal de confirmação com os dados
    selectedCheckin.value = {
      id: checkin.id,
      nome: data.crianca.nome,
      sala: data.sala.nome,
      horario_checkin: data.data_checkin,
      familia: data.familia_id ? 'Família vinculada' : 'Sem família',
      responsavel: data.responsavel.nome,
      parentesco: data.responsavel.parentesco,
      qrCodeData: data // Armazenar os dados completos do QR Code para uso posterior
    };
    
    isLoading.value = false;
    showCheckoutModal.value = true;
  } catch (error) {
    console.error('Erro ao processar QR Code:', error);
    showErrorAlert('Erro ao processar QR Code. Tente novamente.');
    isLoading.value = false;
  }
};

const handleQRCodeError = (error: string) => {
  console.error('Erro na leitura do QR Code:', error);
  showErrorAlert(`Erro na leitura do QR Code: ${error}`);
};

const closeCheckoutModal = () => {
  showCheckoutModal.value = false;
  selectedCheckin.value = null;
};

const showQRCodeModal = ref(false);
const currentQRCode = ref('');

const viewQRCode = (qrCode: string) => {
  // Gerar a imagem do QR Code usando a biblioteca QRCode
  QRCode.toDataURL(qrCode, { errorCorrectionLevel: 'H' })
    .then(url => {
      currentQRCode.value = url;
      showQRCodeModal.value = true;
    })
    .catch(err => {
      console.error('Erro ao gerar QR Code:', err);
      showErrorAlert('Erro ao gerar QR Code');
    });
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
    loadOptions(),
    loadFamilias()
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
  padding: 4px 8px;
  border-radius: 100px;
  width: fit-content;
  margin-top: 12px;
}

.positive-bg {
  background: rgba(34, 197, 94, 0.1);
}

.negative-bg {
  background: rgba(239, 68, 68, 0.1);
}

.stat-trend {
  font-size: 14px;
  font-weight: 500;
}

.stat-trend.positive {
  color: #22C55E;
}

.stat-trend.negative {
  color: #EF4444;
}

/* Ações Rápidas */
.acoes-rapidas {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
}

.acoes-title {
  font-size: 18px;
  font-weight: 600;
  color: #111;
  margin-bottom: 24px;
}

.acoes-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.acao-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.acao-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.acao-icon {
  width: 40px;
  height: 40px;
  background: #f0f2ff;
  color: #0000FF;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.acao-icon i {
  font-size: 18px;
  color: #0000FF;
}

.acao-label {
  font-size: 14px;
  color: #333;
  text-align: center;
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
  background: #f0f2ff;
  color: #2d01fe;
  border-radius: 8px;
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

.details span i.fa-door-open,
.details span i.fa-clock,
.details span i.fa-user {
  color: #2d01fe;
}

.qr-info {
  margin-top: 8px;
  display: inline-block;
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

.qr-text {
  margin: 0 5px;
  color: #333;
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
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow: hidden; /* Evita scroll na página de fundo */
  backdrop-filter: blur(2px); /* Adiciona um efeito de desfoque no fundo */
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 0; /* Removemos o padding geral para controlar melhor as áreas */
  width: 100%;
  max-width: 500px;
  max-height: 90vh; /* Limita a altura a 90% da altura da viewport */
  margin: 20px 0; /* Margem de segurança no topo e no fundo */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  /* Corrige o problema de conteúdo aparecendo atrás do modal */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  isolation: isolate;
  backface-visibility: hidden;
  position: relative;
  overflow: hidden; /* Esconde qualquer conteúdo que ultrapasse os limites */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  padding: 24px 24px 12px;
  border-bottom: 1px solid #f0f0f0;
  margin: 0;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #111;
}

form {
  width: 100%;
  overflow-y: auto; /* Adiciona scroll vertical apenas no formulário */
  padding: 0 24px;
  box-sizing: border-box;
  margin: 24px 0;
  max-height: calc(90vh - 140px); /* Altura máxima considerando o header e footer */
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

.form-group .required {
  color: #ff0000;
  margin-left: 4px;
}

.error-message {
  color: #ff0000;
  font-size: 12px;
  margin-top: 4px;
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
  position: sticky;
  bottom: 0;
  background: white;
  padding: 12px 24px 24px;
  border-top: 1px solid #f0f0f0;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
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
/* Estilos para o modal de QR Code */
.qr-modal {
  max-width: 400px;
}

.qr-code-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.qr-code-image {
  max-width: 100%;
  height: auto;
}

/* Estilos para o formulário de família */
.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  background-color: #fff;
}

.form-control:focus {
  outline: none;
  border-color: #0000FF;
  box-shadow: 0 0 0 2px rgba(0, 0, 255, 0.1);
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input {
  margin-right: 8px;
}

/* Estilos para o dropdown pesquisável */
.search-select-container {
  position: relative;
}

.search-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-top: 4px;
}

.search-select-item {
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-select-item:hover {
  background-color: #f3f4f6;
}

/* Estilos para o modal de Check-out */
.checkout-modal {
  max-width: 500px;
}

.checkout-info {
  padding: 0 20px 20px 20px;
}

.checkout-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9ff;
  border-radius: 8px;
}

.checkout-section h3 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #0000FF;
}

.checkout-section p {
  margin: 5px 0;
  font-size: 14px;
}
</style> 