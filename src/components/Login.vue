<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <i class="fas fa-church"></i>
        <h1>Sistema da Igreja</h1>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email"
            v-model="email"
            required
            placeholder="Digite seu email"
          />
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input 
            type="password" 
            id="password"
            v-model="password"
            required
            placeholder="Digite sua senha"
          />
        </div>

        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await login(email.value, password.value)
    
    if (response.success) {
      router.push('/dashboard')
    } else {
      error.value = response.message
    }
  } catch (err) {
    error.value = 'Erro ao realizar login. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f8f9ff;
}

.login-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header i {
  font-size: 48px;
  color: #0000FF;
  margin-bottom: 16px;
}

.login-header h1 {
  font-size: 24px;
  color: #111;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
}

.form-group input:focus {
  outline: none;
  border-color: #0000FF;
  box-shadow: 0 0 0 2px rgba(0, 0, 255, 0.1);
}

.btn-login {
  background: #0000FF;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-login:hover {
  background: #0000dd;
}

.btn-login:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background: #fee2e2;
  color: #ef4444;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}
</style> 