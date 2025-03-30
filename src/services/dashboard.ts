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
    
    // Buscar check-ins de hoje da view checkin_checkout_status
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const { data: checkins, error: checkinsError } = await supabase
      .from('checkin_checkout_status')
      .select('checkin_id')
      .eq('status', 'Presente')
      .gte('data_checkin', hoje.toISOString());
    
    console.log('Check-ins ativos da view:', checkins?.length || 0);
    
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

export interface CheckoutData {
  checkinId: string;
  responsavelId?: string;
  qrLido: string;
}

/**
 * Verifica se um check-in já possui registro na tabela de checkouts
 * @param checkinId ID do check-in a ser verificado
 * @returns true se já existe checkout, false caso contrário
 */
export async function verificarCheckoutExistente(checkinId: string): Promise<boolean> {
  try {
    const { data, error, count } = await supabase
      .from('checkouts')
      .select('id', { count: 'exact' })
      .eq('checkin_id', checkinId);
    
    if (error) {
      console.error('Erro ao verificar checkout existente:', error);
      return false;
    }
    
    return count !== null && count > 0;
  } catch (error) {
    console.error('Erro ao verificar checkout existente:', error);
    return false;
  }
}

export async function finalizarCheckin(data: CheckoutData): Promise<boolean> {
  try {
    console.log('Finalizando check-in ID:', data.checkinId);
    
    // 0. Verificar se já existe um checkout para este check-in
    const checkoutExistente = await verificarCheckoutExistente(data.checkinId);
    if (checkoutExistente) {
      console.warn('Check-in já possui um checkout registrado');
      return false;
    }
    
    // 1. Atualizar o check-in para finalizado
    const { error: updateError } = await supabase
      .from('checkins')
      .update({ finalizado: true })
      .eq('id', data.checkinId);
    
    if (updateError) {
      console.error('Erro ao finalizar check-in:', updateError);
      return false;
    }
    
    // 2. Criar um registro na tabela checkouts
    const { error: insertError } = await supabase
      .from('checkouts')
      .insert([
        { 
          checkin_id: data.checkinId,
          responsavel_checkout: data.responsavelId || null,
          qr_lido: data.qrLido
        }
      ]);
    
    if (insertError) {
      console.error('Erro ao criar registro de checkout:', insertError);
      return false;
    }
    
    console.log('Check-in finalizado e checkout registrado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao finalizar check-in:', error);
    return false;
  }
}

export async function getActiveCheckins(): Promise<CriancaPresente[]> {
  try {
    console.log('Buscando check-ins ativos...');
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    console.log('Data de hoje (início do dia):', hoje.toISOString());

    // Buscar diretamente da tabela checkins os check-ins não finalizados de hoje
    console.log('Buscando check-ins não finalizados...');
    const { data: checkinsData, error: checkinsError } = await supabase
      .from('checkins')
      .select(`
        id,
        crianca_id,
        sala_id,
        data_checkin,
        responsavel_id,
        qr_gerado,
        responsavel_checkin
      `)
      .eq('finalizado', false)
      .gte('data_checkin', hoje.toISOString());

    if (checkinsError) {
      console.error('Erro na consulta de check-ins ativos:', checkinsError);
      throw checkinsError;
    }

    console.log('Check-ins não finalizados encontrados:', checkinsData ? checkinsData.length : 0);
    
    if (!checkinsData || checkinsData.length === 0) {
      return [];
    }

    // Extrair IDs para buscar informações relacionadas
    const criancaIds = checkinsData.map(c => c.crianca_id);
    const salaIds = checkinsData.map(c => c.sala_id);
    const responsavelIds = checkinsData.filter(c => c.responsavel_id).map(c => c.responsavel_id);
    const familiaIds = checkinsData.filter(c => c.responsavel_checkin).map(c => c.responsavel_checkin);

    // Buscar informações das crianças
    const { data: criancasData, error: criancasError } = await supabase
      .from('criancas')
      .select('id, nome')
      .in('id', criancaIds);

    if (criancasError) {
      console.error('Erro ao buscar crianças:', criancasError);
      throw criancasError;
    }

    // Buscar informações das salas
    const { data: salasData, error: salasError } = await supabase
      .from('salas')
      .select('id, nome_sala, faixa_etaria_inicio, faixa_etaria_fim')
      .in('id', salaIds);

    if (salasError) {
      console.error('Erro ao buscar salas:', salasError);
      throw salasError;
    }

    // Buscar informações dos responsáveis
    let responsaveisMap = {};
    if (responsavelIds.length > 0) {
      const { data: responsaveisData, error: responsaveisError } = await supabase
        .from('responsaveis')
        .select('id, nome, parentesco')
        .in('id', responsavelIds);

      if (responsaveisError) {
        console.error('Erro ao buscar responsáveis:', responsaveisError);
      } else {
        responsaveisMap = (responsaveisData || []).reduce((acc, resp) => {
          acc[resp.id] = {
            nome: resp.nome,
            parentesco: resp.parentesco
          };
          return acc;
        }, {});
      }
    }

    // Buscar informações das famílias
    let familiasMap = {};
    if (familiaIds.length > 0) {
      const { data: familiasData, error: familiasError } = await supabase
        .from('familias')
        .select('id, nome_familia')
        .in('id', familiaIds);

      if (familiasError) {
        console.error('Erro ao buscar famílias:', familiasError);
      } else {
        familiasMap = (familiasData || []).reduce((acc, fam) => {
          acc[fam.id] = fam.nome_familia;
          return acc;
        }, {});
      }
    }

    // Criar mapas para facilitar o acesso aos dados
    const criancasMap = (criancasData || []).reduce((acc, crianca) => {
      acc[crianca.id] = crianca.nome;
      return acc;
    }, {});

    const salasMap = (salasData || []).reduce((acc, sala) => {
      acc[sala.id] = {
        nome: sala.nome_sala,
        faixa_inicio: sala.faixa_etaria_inicio,
        faixa_fim: sala.faixa_etaria_fim
      };
      return acc;
    }, {});

    // Montar a lista de check-ins ativos com todas as informações
    return checkinsData.map(checkin => ({
      id: checkin.id,
      nome: criancasMap[checkin.crianca_id] || 'Sem nome',
      sala: salasMap[checkin.sala_id]?.nome || 'Sem sala',
      faixa_etaria_inicio: salasMap[checkin.sala_id]?.faixa_inicio || 0,
      faixa_etaria_fim: salasMap[checkin.sala_id]?.faixa_fim || 0,
      horario_checkin: checkin.data_checkin,
      qr_code: checkin.qr_gerado || '',
      familia: familiasMap[checkin.responsavel_checkin] || 'Sem família',
      responsavel: responsaveisMap[checkin.responsavel_id]?.nome || 'Não informado',
      parentesco: responsaveisMap[checkin.responsavel_id]?.parentesco || ''
    }));
  } catch (error) {
    console.error('Erro ao buscar checkins ativos:', error);
    console.error('Detalhes do erro:', JSON.stringify(error));
    return [];
  }
} 