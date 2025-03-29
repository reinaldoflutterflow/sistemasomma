import { supabase } from "../supabase";

export interface DashboardData {
  total_familias: number;
  total_criancas: number;
  total_checkins_hoje: number;
  total_salas: number;
}

export interface CriancaPresente {
  id: string;
  crianca: {
    nome: string | null;
  } | null;
  sala: {
    nome_sala: string | null;
  } | null;
  data_checkin: string;
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const [
      { count: total_familias },
      { count: total_criancas },
      { count: total_checkins_hoje },
      { count: total_salas }
    ] = await Promise.all([
      supabase.from('familias').select('*', { count: 'exact', head: true }).eq('status', true),
      supabase.from('criancas').select('*', { count: 'exact', head: true }).eq('status', true),
      supabase.from('checkins').select('*', { count: 'exact', head: true }).gte('data_checkin', hoje.toISOString()),
      supabase.from('salas').select('*', { count: 'exact', head: true }).eq('status', true)
    ]);

    return {
      total_familias: total_familias || 0,
      total_criancas: total_criancas || 0,
      total_checkins_hoje: total_checkins_hoje || 0,
      total_salas: total_salas || 0
    };
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return {
      total_familias: 0,
      total_criancas: 0,
      total_checkins_hoje: 0,
      total_salas: 0
    };
  }
}

export async function getCriancasPresentes(): Promise<CriancaPresente[]> {
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
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar crianças presentes:', error);
    return [];
  }
} 