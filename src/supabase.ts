import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

// Usar diretamente os valores do arquivo env.ts
const supabaseUrl = ENV.SUPABASE_URL;
const supabaseAnonKey = ENV.SUPABASE_ANON_KEY;

// Log para debug
console.log('Supabase URL (hardcoded):', supabaseUrl);

// Criar o cliente Supabase com os valores hardcoded
export const supabase = createClient(supabaseUrl, supabaseAnonKey);