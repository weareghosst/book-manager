<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const usuario = computed(() => {
  const u = localStorage.getItem('usuario')
  return u ? JSON.parse(u) : null
})

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  router.push('/login')
}
</script>

<template>
  <div class="app">
    <header class="header">
      <span class="header-logo">📚</span>
      <h1 class="header-title">Book Manager</h1>
      <div class="header-user" v-if="usuario">
        <span class="user-nome">{{ usuario.nome }}</span>
        <button class="btn-logout" @click="logout">Sair</button>
      </div>
    </header>
    <main class="container">
      <RouterView />
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background-color: #f5f0e8;
  color: #2c2a25;
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

.app { min-height: 100vh; }

.header {
  background-color: #2c2a25;
  padding: 18px 40px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-logo { font-size: 24px; }

.header-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 600;
  color: #f5f0e8;
  letter-spacing: 0.5px;
  flex: 1;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-nome {
  font-size: 14px;
  color: #c5bfb0;
}

.btn-logout {
  background: transparent;
  border: 1px solid #c5bfb0;
  color: #c5bfb0;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-logout:hover { background: rgba(255,255,255,0.1); }

.container {
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 24px;
}

.btn {
  display: inline-block;
  padding: 8px 18px;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}
.btn:hover { opacity: 0.85; }

.btn-primary { background-color: #2c2a25; color: #f5f0e8; }
.btn-secondary { background-color: transparent; color: #2c2a25; border: 1px solid #c5bfb0; }
.btn-danger { background-color: transparent; color: #8b3a2f; border: 1px solid #c9a49e; }
.btn-danger:hover { background-color: #f9eeec; opacity: 1; }

.card { background: #fdfaf5; border: 1px solid #e0d9cc; border-radius: 10px; padding: 24px; }
</style>