import { supabase } from '../supabase'

export interface AuthResponse {
  success: boolean
  message: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return {
      success: true,
      message: 'Login realizado com sucesso!'
    }
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao realizar login. Verifique suas credenciais.'
    }
  }
}

export async function isAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

export async function logout() {
  await supabase.auth.signOut()
} 