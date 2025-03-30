import { supabase } from "../supabase"

export interface Responsavel {
  id: string
  familia_id: string
  nome: string
  telefone: string
  parentesco: string
  whatsapp: boolean
  pode_fazer_checkout: boolean
  observacoes?: string
}

export interface Familia {
  id: string
  nome_familia: string
  status: boolean
}

export interface Sala {
  id: string
  nome_sala: string
  faixa_etaria_inicio: number
  faixa_etaria_fim: number
  capacidade: number
  status: boolean
}

export interface Crianca {
  id: string
  nome: string
  data_nascimento: string
  familia_id: string
  genero: string
  restricao_alimentar: boolean
  desc_restricao_alimentar?: string
  necessidade_especial: boolean
  desc_necessidade_especial?: string
  observacao_adicional?: string
  identificador?: string
}

export async function getFamilias(): Promise<Familia[]> {
  try {
    const { data, error } = await supabase
      .from('familias')
      .select('*')
      .eq('status', true)
      .order('nome_familia')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar famílias:', error)
    return []
  }
}

export async function getSalas(): Promise<Sala[]> {
  try {
    const { data, error } = await supabase
      .from('salas')
      .select('*')
      .eq('status', true)
      .order('nome_sala')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar salas:', error)
    return []
  }
}

export async function getCriancasPorFamilia(familia_id: string, sala_id: string): Promise<Crianca[]> {
  try {
    // Primeiro, buscar a sala para obter a faixa etária
    const { data: sala, error: salaError } = await supabase
      .from('salas')
      .select('faixa_etaria_inicio, faixa_etaria_fim')
      .eq('id', sala_id)
      .single()

    if (salaError) throw salaError

    // Calcular a data mínima e máxima baseada na faixa etária
    const hoje = new Date()
    const dataMinima = new Date()
    dataMinima.setFullYear(hoje.getFullYear() - sala.faixa_etaria_fim)
    const dataMaxima = new Date()
    dataMaxima.setFullYear(hoje.getFullYear() - sala.faixa_etaria_inicio)

    // Buscar crianças da família que estão dentro da faixa etária
    const { data: criancas, error: criancasError } = await supabase
      .from('criancas')
      .select('*')
      .eq('familia_id', familia_id)
      .gte('data_nascimento', dataMinima.toISOString().split('T')[0])
      .lte('data_nascimento', dataMaxima.toISOString().split('T')[0])
      .order('nome')

    if (criancasError) throw criancasError
    return criancas || []
  } catch (error) {
    console.error('Erro ao buscar crianças:', error)
    return []
  }
}

export async function getResponsaveisPorFamilia(familia_id: string): Promise<Responsavel[]> {
  try {
    const { data, error } = await supabase
      .from('responsaveis')
      .select('*')
      .eq('familia_id', familia_id)
      .order('nome')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar responsáveis:', error)
    return []
  }
}

export async function realizarCheckin(sala_id: string, crianca_id: string, responsavel_id: string) {
  try {
    // Buscar informações da criança para obter a família
    const { data: criancaData, error: criancaError } = await supabase
      .from('criancas')
      .select('familia_id, nome')
      .eq('id', crianca_id)
      .single();
    
    if (criancaError) throw criancaError;
    if (!criancaData) throw new Error('Criança não encontrada');
    
    // Buscar informações da sala
    const { data: salaData, error: salaError } = await supabase
      .from('salas')
      .select('nome_sala')
      .eq('id', sala_id)
      .single();
    
    if (salaError) throw salaError;
    if (!salaData) throw new Error('Sala não encontrada');
    
    // Buscar informações do responsável
    const { data: responsavelData, error: responsavelError } = await supabase
      .from('responsaveis')
      .select('nome, parentesco')
      .eq('id', responsavel_id)
      .single();
    
    if (responsavelError) throw responsavelError;
    if (!responsavelData) throw new Error('Responsável não encontrado');
    
    // Criar objeto com dados completos para o QR code
    const dadosQR = {
      crianca: {
        id: crianca_id,
        nome: criancaData.nome
      },
      sala: {
        id: sala_id,
        nome: salaData.nome_sala
      },
      responsavel: {
        id: responsavel_id,
        nome: responsavelData.nome,
        parentesco: responsavelData.parentesco
      },
      familia_id: criancaData.familia_id,
      data_checkin: new Date().toISOString()
    };
    
    // Gerar QR code com os dados completos
    const qr_gerado = JSON.stringify(dadosQR);
    
    console.log('Realizando check-in com os dados:', { 
      sala_id, 
      crianca_id, 
      responsavel_id, 
      responsavel_checkin: criancaData.familia_id,
      qr_gerado 
    });
    
    const { error } = await supabase
      .from('checkins')
      .insert([
        {
          sala_id,
          crianca_id,
          responsavel_id,
          responsavel_checkin: criancaData.familia_id, // UUID da família
          data_checkin: new Date().toISOString(),
          qr_gerado
        }
      ])

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Erro ao realizar check-in:', error)
    return { success: false, error }
  }
} 