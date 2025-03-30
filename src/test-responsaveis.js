// Script para testar a inserção na tabela responsaveis
import { createClient } from '@supabase/supabase-js';

// Substitua estas variáveis pelos valores corretos do seu projeto
const supabaseUrl = 'https://seu-projeto.supabase.co';
const supabaseKey = 'sua-chave-anon';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testarInsercaoResponsavel() {
  try {
    console.log('Iniciando teste de inserção na tabela responsaveis');
    
    // Dados de teste
    const dadosResponsavel = {
      familia_id: 'id-de-uma-familia-existente', // Substitua por um ID válido
      nome: 'Responsável Teste',
      telefone: '(22) 99999-9999',
      parentesco: 'Pai', // Valores permitidos: 'Pai', 'Mãe', 'Tio', 'Avô', 'Outro'
      whatsapp: true,
      pode_fazer_checkout: false,
      observacoes: 'Teste de inserção'
    };
    
    console.log('Tentando inserir com objeto simples:');
    const { data: data1, error: error1 } = await supabase
      .from('responsaveis')
      .insert(dadosResponsavel);
    
    console.log('Resultado (objeto simples):', { data: data1, error: error1 });
    
    console.log('Tentando inserir com array:');
    const { data: data2, error: error2 } = await supabase
      .from('responsaveis')
      .insert([dadosResponsavel]);
    
    console.log('Resultado (array):', { data: data2, error: error2 });
    
    // Verificar a estrutura da tabela
    console.log('Verificando estrutura da tabela:');
    const { data: colunas, error: errorColunas } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'responsaveis');
    
    console.log('Colunas da tabela:', colunas);
    console.log('Erro ao buscar colunas:', errorColunas);
    
  } catch (error) {
    console.error('Erro no teste:', error);
  }
}

testarInsercaoResponsavel();
