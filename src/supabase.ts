import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';
import { getAccessToken } from './services/auth';

// Usar diretamente os valores do arquivo env.ts
const supabaseUrl = ENV.SUPABASE_URL;
const supabaseAnonKey = ENV.SUPABASE_ANON_KEY;

// Log para debug
console.log('Supabase URL (hardcoded):', supabaseUrl);

// Criar o cliente Supabase com os valores hardcoded e configurações adicionais
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      // Adiciona o token de autenticação em todas as requisições
      get Authorization() {
        const token = getAccessToken();
        return token ? `Bearer ${token}` : '';
      }
    }
  }
});