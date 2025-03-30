// Script para testar a inserção na tabela responsaveis
import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase (as mesmas usadas no projeto)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'Definida' : 'Não definida');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testarInserirResponsavel() {
  try {
    // Dados de teste
    const responsavel = {
      familia_id: '123e4567-e89b-12d3-a456-426614174000', // Substitua por um ID válido
      nome: 'Teste Responsável',
      telefone: '(22) 99999-9999',
      parentesco: 'Pai',
      whatsapp: true,
      pode_fazer_checkout: false
    };

    console.log('Tentando inserir responsável:', responsavel);

    // Teste 1: Inserir como objeto
    console.log('\n--- Teste 1: Inserir como objeto ---');
    const { data: data1, error: error1 } = await supabase
      .from('responsaveis')
      .insert(responsavel);

    console.log('Resultado (objeto):', { data: data1, error: error1 });

    // Teste 2: Inserir como array
    console.log('\n--- Teste 2: Inserir como array ---');
    const { data: data2, error: error2 } = await supabase
      .from('responsaveis')
      .insert([responsavel]);

    console.log('Resultado (array):', { data: data2, error: error2 });

    // Teste 3: Inserir com select
    console.log('\n--- Teste 3: Inserir com select ---');
    const { data: data3, error: error3 } = await supabase
      .from('responsaveis')
      .insert([responsavel])
      .select();

    console.log('Resultado (array com select):', { data: data3, error: error3 });

    // Verificar a estrutura da tabela
    console.log('\n--- Verificando estrutura da tabela ---');
    const { data: schema, error: schemaError } = await supabase
      .from('responsaveis')
      .select('*')
      .limit(1);

    console.log('Estrutura da tabela:', schema);
    console.log('Erro ao verificar estrutura:', schemaError);

  } catch (error) {
    console.error('Erro no teste:', error);
  }
}

testarInserirResponsavel();
