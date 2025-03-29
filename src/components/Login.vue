<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-left">
        <div class="logo">
        </div>

        <div class="login-form-container">
          <div class="somma-logo">
            <img src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/aulas-y-t-74meoi/assets/rpjfvrrg7ufg/Group_24.svg" alt="Somma Logo" class="logo-image">
          </div>
          <h2>Bem-vindo de volta</h2>
          <p class="subtitle">Bem-vindo de volta! Por favor, insira seus dados.</p>


          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email"
                v-model="email"
                required
                placeholder="teste@teste.com"
              />
            </div>

            <div class="form-group">
              <label for="password">Senha</label>
              <div class="password-input-container">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password"
                  v-model="password"
                  required
                  placeholder="•••••••"
                />
                <button type="button" class="toggle-password" @click="togglePassword">
                  <span>Mostrar</span>
                </button>
              </div>
            </div>

            <a href="#" class="forgot-password-link">Esqueceu a senha?</a>

            <button type="submit" class="btn-login" :disabled="loading">
              {{ loading ? 'Entrando...' : 'Login' }}
            </button>
          </form>



          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </div>
      </div>

      <div class="login-right">
        <div class="image-container"></div>
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
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

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
  min-height: 100vh;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-content {
  display: flex;
  width: 100%;
  height: 100vh;
  max-width: 100%;
}

.login-left {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.login-right {
  flex: 1.5;
  background: linear-gradient(135deg, #f6f8ff, #cbdafc);
  position: relative;
  overflow: hidden;
}

.logo {
  margin-bottom: 60px;
}

.logo h1 {
  color: #2d00ff;
  font-size: 28px;
  font-weight: 600;
}

.login-form-container {
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  margin: 0 auto;
  text-align: center;
}

.somma-logo {
  margin-bottom: 24px;
  display: flex;
  justify-content: flex-start;
}

.logo-image {
  height: 40px;
}

.login-form-container h2 {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
  text-align: left;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 16px;
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
  text-align: left;
}

.form-group label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
}

.password-input-container {
  position: relative;
}

.password-input-container input {
  width: 100%;
  padding-right: 80px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #2d00ff;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #2d00ff;
  box-shadow: 0 0 0 2px rgba(45, 0, 255, 0.1);
}

.forgot-password-link {
  align-self: flex-end;
  color: #2d00ff;
  text-decoration: none;
  font-size: 14px;
  margin-top: -8px;
  margin-bottom: 16px;
}

.btn-login {
  background: #2d00ff;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 16px;
}

.btn-login:hover {
  background: #2500d9;
}

.btn-login:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}





.image-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/aulas-y-t-74meoi/assets/gy4w49xb8u3h/aaaaaa.png') center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  transform: scale(0.85);
  display: flex;
  justify-content: center;
  align-items: center;
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

@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
  }
  
  .login-right {
    display: none;
  }
  
  .login-left {
    padding: 24px;
  }
  
  .login-form-container {
    max-width: 100%;
  }
}
</style> 