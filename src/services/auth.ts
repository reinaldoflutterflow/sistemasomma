interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: {
    id: string;
    email: string;
  }
}

const API_URL = 'https://n8nwebhook.paraisoambiental.com.br/webhook/fbb1459a-d8eb-4d23-99ca-b3b2fc043384';

let tokenRefreshTimeout: NodeJS.Timeout;

function setTokenRefreshTimeout() {
  // Limpa o timeout existente se houver
  if (tokenRefreshTimeout) {
    clearTimeout(tokenRefreshTimeout);
  }

  // Configura novo timeout para renovar o token a cada 30 minutos
  tokenRefreshTimeout = setTimeout(async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      await refreshAccessToken(refreshToken);
    }
  }, 30 * 60 * 1000); // 30 minutos
}

async function refreshAccessToken(refreshToken: string): Promise<boolean> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken
      })
    });

    if (response.ok) {
      const data = await response.json();
      saveAuthData(data);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    return false;
  }
}

function saveAuthData(data: TokenData) {
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  localStorage.setItem('expires_at', data.expires_at.toString());
  localStorage.setItem('user_id', data.user.id);
  localStorage.setItem('user_email', data.user.email);
  setTokenRefreshTimeout();
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      saveAuthData(data);
      
      return {
        success: true,
        message: 'Login realizado com sucesso!',
        data
      };
    }

    return {
      success: false,
      message: 'Credenciais inválidas.'
    };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return {
      success: false,
      message: 'Erro ao realizar login. Tente novamente.'
    };
  }
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('access_token');
  const expiresAt = localStorage.getItem('expires_at');

  if (!token || !expiresAt) {
    return false;
  }

  // Verifica se o token não está expirado
  return Date.now() < parseInt(expiresAt) * 1000;
}

export async function logout(): Promise<void> {
  // Limpa o timeout de renovação do token
  if (tokenRefreshTimeout) {
    clearTimeout(tokenRefreshTimeout);
  }

  // Limpa os dados de autenticação do localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('expires_at');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_email');
}

// Função para obter o token de acesso atual
export function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

// Função para obter os dados do usuário
export function getUserData() {
  return {
    id: localStorage.getItem('user_id'),
    email: localStorage.getItem('user_email')
  };
} 