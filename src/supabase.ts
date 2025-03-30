import { createClient } from '@supabase/supabase-js';

// Valores padrão para desenvolvimento e produção
const DEFAULT_SUPABASE_URL = 'https://ehhrlezlyumxjbzxevdk.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVocnJsZXpseXVteGpienhlcmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyNTUzMTAsImV4cCI6MjAyNjgzMTMxMH0.0KpZBQxlOZm-PUQXXkxWPGHSiMPtXgBuTdRGsYPzJAQ';

// Tenta obter as variáveis de ambiente, caso contrário usa os valores padrão
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Log para debug
console.log('Supabase URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);