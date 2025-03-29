import { supabase } from '../supabase';
import { getAccessToken } from './auth';

interface DashboardData {
  total_criancas: number;
  total_familias: number;
  total_salas: number;
  checkins_hoje: number;
}

export interface CriancaPresente {
  id: string;
  nome: string;
  sala: string;
  horario_checkin: string;
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const token = getAccessToken();
    const response = await fetch('https://n8nwebhook.paraisoambiental.com.br/webhook/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do dashboard');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return {
      total_criancas: 0,
      total_familias: 0,
      total_salas: 0,
      checkins_hoje: 0
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
        crianca:crianca_id (
          nome
        ),
        sala:sala_id (
          nome_sala
        )
      `)
      .gte('data_checkin', hoje.toISOString())
      .is('data_checkout', null);

    if (error) {
      console.error('Erro na consulta:', error);
      throw error;
    }

    console.log('Dados recebidos:', data);

    return (data || []).map(checkin => ({
      id: checkin.id,
      nome: checkin.crianca?.nome || '',
      sala: checkin.sala?.nome_sala || '',
      horario_checkin: checkin.data_checkin
    }));
  } catch (error) {
    console.error('Erro ao buscar checkins ativos:', error);
    return [];
  }
} 