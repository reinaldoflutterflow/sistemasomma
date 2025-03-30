// Dados simulados para o dashboard
export const mockDashboardData = {
  total_criancas: 120,
  total_familias: 45,
  total_salas: 8,
  checkins_hoje: 32,
  tendencia_familias: 5.2, // 5.2% de crescimento
  tendencia_criancas: 3.8, // 3.8% de crescimento
};

// Salas simuladas
export const mockSalas = [
  { id: '1', nome_sala: 'Berçário', capacidade: 15, status: true },
  { id: '2', nome_sala: 'Maternal', capacidade: 20, status: true },
  { id: '3', nome_sala: 'Jardim', capacidade: 25, status: true },
  { id: '4', nome_sala: 'Primário', capacidade: 30, status: true },
  { id: '5', nome_sala: 'Juniores', capacidade: 35, status: true },
  { id: '6', nome_sala: 'Adolescentes', capacidade: 40, status: true },
  { id: '7', nome_sala: 'Jovens', capacidade: 45, status: true },
  { id: '8', nome_sala: 'Adultos', capacidade: 50, status: true },
];

// Famílias simuladas
export const mockFamilias = [
  { id: '1', nome_familia: 'Silva', telefone: '(11) 99999-1111', email: 'silva@exemplo.com', status: true },
  { id: '2', nome_familia: 'Santos', telefone: '(11) 99999-2222', email: 'santos@exemplo.com', status: true },
  { id: '3', nome_familia: 'Oliveira', telefone: '(11) 99999-3333', email: 'oliveira@exemplo.com', status: true },
  { id: '4', nome_familia: 'Souza', telefone: '(11) 99999-4444', email: 'souza@exemplo.com', status: true },
  { id: '5', nome_familia: 'Ferreira', telefone: '(11) 99999-5555', email: 'ferreira@exemplo.com', status: true },
];

// Crianças simuladas
export const mockCriancas = [
  { id: '1', nome: 'João Silva', idade: 5, familia_id: '1', status: true },
  { id: '2', nome: 'Maria Santos', idade: 7, familia_id: '2', status: true },
  { id: '3', nome: 'Pedro Oliveira', idade: 4, familia_id: '3', status: true },
  { id: '4', nome: 'Ana Souza', idade: 6, familia_id: '4', status: true },
  { id: '5', nome: 'Lucas Ferreira', idade: 8, familia_id: '5', status: true },
];

// Check-ins simulados
export const mockCheckins = [
  { 
    id: '1', 
    crianca_id: '1', 
    sala_id: '2', 
    data_checkin: new Date().toISOString(), 
    responsavel_id: '1', 
    qr_gerado: true, 
    responsavel_checkin: 'João Silva Pai',
    finalizado: false
  },
  { 
    id: '2', 
    crianca_id: '2', 
    sala_id: '3', 
    data_checkin: new Date().toISOString(), 
    responsavel_id: '2', 
    qr_gerado: true, 
    responsavel_checkin: 'Maria Santos Mãe',
    finalizado: false
  },
  { 
    id: '3', 
    crianca_id: '3', 
    sala_id: '1', 
    data_checkin: new Date().toISOString(), 
    responsavel_id: '3', 
    qr_gerado: true, 
    responsavel_checkin: 'Pedro Oliveira Pai',
    finalizado: false
  },
];

// Crianças presentes simuladas
export const mockCriancasPresentes = [
  {
    id: '1',
    nome: 'João Silva',
    sala: 'Maternal',
    horario_checkin: new Date().toLocaleTimeString(),
    qr_code: 'QRCODE1',
    responsavel: 'João Silva Pai'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    sala: 'Jardim',
    horario_checkin: new Date().toLocaleTimeString(),
    qr_code: 'QRCODE2',
    responsavel: 'Maria Santos Mãe'
  },
  {
    id: '3',
    nome: 'Pedro Oliveira',
    sala: 'Berçário',
    horario_checkin: new Date().toLocaleTimeString(),
    qr_code: 'QRCODE3',
    responsavel: 'Pedro Oliveira Pai'
  },
];
