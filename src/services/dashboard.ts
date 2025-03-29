import { supabase } from '../supabase';
import { getAccessToken } from './auth';

interface DashboardData {
  total_criancas: number;
  total_familias: number;
  total_salas: number;
  checkins_hoje: number;
  tendencia_familias: number; // Percentual de crescimento/queda comparado com a semana anterior
  tendencia_criancas: number; // Percentual de crescimento/queda comparado com a semana anterior
}

export interface CriancaPresente {
  id: string;
  nome: string;
  sala: string;
  horario_checkin: string;
  qr_code: string;
  responsavel: string;
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    // Buscar total de famílias ativas
    const { data: familias, error: familiasError } = await supabase
      .from('familias')
      .select('id')
      .eq('status', true);
    
    if (familiasError) throw familiasError;
    
    // Buscar total de crianças
    const { data: criancas, error: criancasError } = await supabase
      .from('criancas')
      .select('id');
    
    if (criancasError) throw criancasError;
    
    // Buscar total de salas ativas
    const { data: salas, error: salasError } = await supabase
      .from('salas')
      .select('id')
      .eq('status', true);
    
    if (salasError) throw salasError;
    
    // Buscar check-ins de hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const { data: checkins, error: checkinsError } = await supabase
      .from('checkins')
      .select('id')
      .gte('data_checkin', hoje.toISOString());
    
    if (checkinsError) throw checkinsError;
    
    // Calcular tendência de famílias (semana atual vs semana passada)
    // Obter data de início da semana atual (domingo)
    const dataAtual = new Date();
    const inicioSemanaAtual = new Date(dataAtual);
    inicioSemanaAtual.setDate(dataAtual.getDate() - dataAtual.getDay()); // Domingo da semana atual
    inicioSemanaAtual.setHours(0, 0, 0, 0);
    
    // Obter data de início da semana passada
    const inicioSemanaPasada = new Date(inicioSemanaAtual);
    inicioSemanaPasada.setDate(inicioSemanaAtual.getDate() - 7); // Domingo da semana passada
    
    // Obter data de fim da semana passada
    const fimSemanaPasada = new Date(inicioSemanaAtual);
    fimSemanaPasada.setSeconds(fimSemanaPasada.getSeconds() - 1); // Um segundo antes do início da semana atual
    
    // Buscar famílias criadas na semana atual
    const { data: familiasSemanAtual, error: erroFamiliasAtual } = await supabase
      .from('familias')
      .select('id')
      .gte('data_criacao', inicioSemanaAtual.toISOString());
    
    if (erroFamiliasAtual) throw erroFamiliasAtual;
    
    // Buscar famílias criadas na semana passada
    const { data: familiasSemanaPasada, error: erroFamiliasPasada } = await supabase
      .from('familias')
      .select('id')
      .gte('data_criacao', inicioSemanaPasada.toISOString())
      .lt('data_criacao', inicioSemanaAtual.toISOString());
    
    if (erroFamiliasPasada) throw erroFamiliasPasada;
    
    // Calcular percentual de crescimento
    const qtdFamiliasSemanAtual = familiasSemanAtual?.length || 0;
    const qtdFamiliasSemanaPasada = familiasSemanaPasada?.length || 0;
    
    let tendenciaFamilias = 0;
    
    if (qtdFamiliasSemanaPasada > 0) {
      // Calcular percentual de crescimento: ((atual - anterior) / anterior) * 100
      tendenciaFamilias = ((qtdFamiliasSemanAtual - qtdFamiliasSemanaPasada) / qtdFamiliasSemanaPasada) * 100;
    } else if (qtdFamiliasSemanAtual > 0) {
      // Se não havia registros na semana passada, mas há na atual, considerar crescimento de 100%
      tendenciaFamilias = 100;
    }
    
    // Arredondar para uma casa decimal
    tendenciaFamilias = Math.round(tendenciaFamilias * 10) / 10;
    
    // Vamos usar a tabela original para contar as crianças
    // Não vamos calcular a tendência baseada na data de nascimento
    
    // Definir tendência de crianças como 0 (sem cálculo)
    const qtdCriancasSemanAtual = 0;
    const qtdCriancasSemanaPasada = 0;
    
    let tendenciaCriancas = 0;
    
    if (qtdCriancasSemanaPasada > 0) {
      // Calcular percentual de crescimento: ((atual - anterior) / anterior) * 100
      tendenciaCriancas = ((qtdCriancasSemanAtual - qtdCriancasSemanaPasada) / qtdCriancasSemanaPasada) * 100;
    } else if (qtdCriancasSemanAtual > 0) {
      // Se não havia registros na semana passada, mas há na atual, considerar crescimento de 100%
      tendenciaCriancas = 100;
    }
    
    // Arredondar para uma casa decimal
    tendenciaCriancas = Math.round(tendenciaCriancas * 10) / 10;
    
    console.log('Dados do dashboard carregados:', {
      total_familias: familias?.length || 0,
      total_criancas: criancas?.length || 0,
      total_salas: salas?.length || 0,
      checkins_hoje: checkins?.length || 0,
      tendencia_familias: tendenciaFamilias,
      tendencia_criancas: tendenciaCriancas,
      qtd_familias_semana_atual: qtdFamiliasSemanAtual,
      qtd_familias_semana_passada: qtdFamiliasSemanaPasada,
      qtd_criancas_semana_atual: qtdCriancasSemanAtual,
      qtd_criancas_semana_passada: qtdCriancasSemanaPasada
    });
    
    return {
      total_familias: familias?.length || 0,
      total_criancas: criancas?.length || 0,
      total_salas: salas?.length || 0, // Busca a quantidade real de salas ativas na tabela
      checkins_hoje: checkins?.length || 0,
      tendencia_familias: tendenciaFamilias,
      tendencia_criancas: tendenciaCriancas
    };
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return {
      total_criancas: 0,
      total_familias: 0,
      total_salas: 0,
      checkins_hoje: 0,
      tendencia_familias: 0,
      tendencia_criancas: 0
    };
  }
}

export async function getActiveCheckins(): Promise<CriancaPresente[]> {
  try {
    console.log('Buscando check-ins ativos...');
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('checkins')
      .select(`
        id,
        data_checkin,
        qr_gerado,
        criancas:crianca_id (id, nome),
        salas:sala_id (id, nome_sala),
        familias:responsavel_checkin (id, nome_familia)
      `)
      .gte('data_checkin', hoje.toISOString());

    if (error) {
      console.error('Erro na consulta:', error);
      throw error;
    }

    console.log('Dados recebidos da tabela checkins:', data);

    return (data || []).map(checkin => ({
      id: checkin.id,
      nome: checkin.criancas?.nome || 'Sem nome',
      sala: checkin.salas?.nome_sala || 'Sem sala',
      horario_checkin: checkin.data_checkin,
      qr_code: checkin.qr_gerado,
      responsavel: checkin.familias?.nome_familia || 'Sem responsável'
    }));
  } catch (error) {
    console.error('Erro ao buscar checkins ativos:', error);
    return [];
  }
} 