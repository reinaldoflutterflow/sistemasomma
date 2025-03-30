import { supabase } from '../supabase';

export interface Responsavel {
  id?: string;
  familia_id: string;
  nome: string;
  telefone: string;
  parentesco: string;
  whatsapp: boolean;
  pode_fazer_checkout: boolean;
  observacoes?: string;
}

/**
 * Cadastra um novo responsável no banco de dados
 * @param responsavel Dados do responsável a ser cadastrado
 * @returns Retorna o responsável cadastrado ou null em caso de erro
 */
export async function cadastrarResponsavel(responsavel: Responsavel): Promise<Responsavel | null> {
  try {
    console.log('Cadastrando responsável:', JSON.stringify(responsavel, null, 2));
    
    // Verificar se os campos obrigatórios estão preenchidos
    if (!responsavel.familia_id || !responsavel.nome || !responsavel.telefone || !responsavel.parentesco) {
      console.error('Campos obrigatórios não preenchidos');
      return null;
    }
    
    // Garantir que o parentesco seja um dos valores permitidos
    const parentescosPermitidos = ['Pai', 'Mãe', 'Tio', 'Avô', 'Outro'];
    if (!parentescosPermitidos.includes(responsavel.parentesco)) {
      console.error('Valor de parentesco inválido:', responsavel.parentesco);
      return null;
    }
    
    // Preparar os dados para inserção
    const dadosParaInserir = {
      familia_id: responsavel.familia_id,
      nome: responsavel.nome,
      telefone: responsavel.telefone,
      parentesco: responsavel.parentesco,
      whatsapp: responsavel.whatsapp !== undefined ? responsavel.whatsapp : true,
      pode_fazer_checkout: responsavel.pode_fazer_checkout !== undefined ? responsavel.pode_fazer_checkout : false,
      observacoes: responsavel.observacoes || null
    };
    
    // Inserir no banco de dados
    // Usando formato de array conforme esperado pelo Supabase
    const { data, error } = await supabase
      .from('responsaveis')
      .insert([dadosParaInserir])
      .select();
    
    if (error) {
      console.error('Erro ao cadastrar responsável no banco:', error);
      throw error;
    }
    
    console.log('Responsável cadastrado com sucesso:', data);
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Erro ao cadastrar responsável:', error);
    return null;
  }
}

/**
 * Busca responsáveis por família
 * @param familiaId ID da família
 * @returns Lista de responsáveis da família
 */
export async function buscarResponsaveisPorFamilia(familiaId: string): Promise<Responsavel[]> {
  try {
    const { data, error } = await supabase
      .from('responsaveis')
      .select('*')
      .eq('familia_id', familiaId)
      .order('nome');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar responsáveis:', error);
    return [];
  }
}
