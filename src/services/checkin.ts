import { supabase } from "../supabase"

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

export async function realizarCheckin(sala_id: string, crianca_id: string) {
  try {
    const { error } = await supabase
      .from('checkins')
      .insert([
        {
          sala_id,
          crianca_id,
          data_checkin: new Date().toISOString()
        }
      ])

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Erro ao realizar check-in:', error)
    return { success: false, error }
  }
} 