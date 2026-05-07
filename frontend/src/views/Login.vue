<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/auth'

const router = useRouter()
const modo = ref('login') // 'login' ou 'register'
const erro = ref('')
const carregando = ref(false)

const form = ref({ nome: '', email: '', senha: '' })

async function submeter() {
  erro.value = ''
  carregando.value = true
  try {
    let res
    if (modo.value === 'login') {
      res = await authService.login({ email: form.value.email, senha: form.value.senha })
    } else {
      res = await authService.registrar(form.value)
    }
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('usuario', JSON.stringify(res.data.usuario))
    router.push('/')
  } catch (e) {
    erro.value = e.response?.data?.erro || 'Algo deu errado, tente novamente.'
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="auth-wrap">
    <div class="auth-card">
      <div class="auth-logo">📚</div>
      <h1 class="auth-title">Book Manager</h1>
      <p class="auth-sub">{{ modo === 'login' ? 'Entre na sua conta' : 'Crie sua conta' }}</p>

      <div class="form-group" v-if="modo === 'register'">
        <label>Nome</label>
        <input v-model="form.nome" placeholder="Seu nome" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" placeholder="seu@email.com" />
      </div>
      <div class="form-group">
        <label>Senha</label>
        <input v-model="form.senha" type="password" placeholder="••••••••" />
      </div>

      <p class="erro" v-if="erro">{{ erro }}</p>

      <button class="btn btn-primary btn-full" @click="submeter" :disabled="carregando">
        {{ carregando ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Criar conta' }}
      </button>

      <p class="auth-toggle">
        {{ modo === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?' }}
        <span @click="modo = modo === 'login' ? 'register' : 'login'">
          {{ modo === 'login' ? 'Cadastre-se' : 'Entrar' }}
        </span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.auth-card {
  background: #fdfaf5;
  border: 1px solid #e0d9cc;
  border-radius: 14px;
  padding: 40px 36px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.auth-logo { font-size: 36px; text-align: center; }

.auth-title {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: #2c2a25;
}

.auth-sub {
  text-align: center;
  color: #9c9588;
  font-size: 14px;
  margin-bottom: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label { font-size: 13px; font-weight: 500; color: #5a5750; }

input {
  padding: 10px 14px;
  border: 1px solid #ddd6c8;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  background: #fdfaf5;
  color: #2c2a25;
  outline: none;
  transition: border-color 0.2s;
}
input:focus { border-color: #2c2a25; }

.btn-full { width: 100%; text-align: center; padding: 12px; margin-top: 4px; }

.erro {
  color: #8b3a2f;
  font-size: 13px;
  background: #f9eeec;
  border: 1px solid #c9a49e;
  border-radius: 6px;
  padding: 8px 12px;
}

.auth-toggle {
  text-align: center;
  font-size: 13px;
  color: #9c9588;
}

.auth-toggle span {
  color: #2c2a25;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
}
</style>