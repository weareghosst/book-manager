<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import livrosService from '../services/livros'

const livro = ref(null)
const route = useRoute()
const router = useRouter()

const statusLabel = { 'quero ler': '📌 Quero ler', 'lendo': '📖 Lendo', 'lido': '✅ Lido' }
const estrelas = computed(() => {
  if (!livro.value) return ''
  const nota = Math.max(0, Math.min(5, Math.round(Number(livro.value.nota) || 0)))
  return '★'.repeat(nota) + '☆'.repeat(5 - nota)
})
onMounted(async () => {
  const { data } = await livrosService.buscar(route.params.id)
  livro.value = data
})
</script>

<template>
  <div v-if="livro">
    <button class="btn btn-secondary voltar" @click="router.push('/')">← Voltar</button>

    <div class="card detail-card">
      <div class="detail-capa">
        <img v-if="livro.capa_url" :src="livro.capa_url" :alt="livro.titulo" />
        <div v-else class="capa-placeholder">📖</div>
      </div>
      <div class="detail-info">
        <span class="genero">{{ livro.genero }}</span>
        <h2 class="titulo">{{ livro.titulo }}</h2>
        <p class="autor">{{ livro.autor }}</p>
        <div class="divider"></div>
        <div class="meta-row">
          <span class="meta-label">Status</span>
          <span class="status-badge">{{ statusLabel[livro.status] || livro.status }}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Avaliação</span>
          <span class="nota">{{ estrelas }}</span>
        </div>
        <div class="detail-acoes">
          <button class="btn btn-primary" @click="router.push(`/editar/${livro.id}`)">Editar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.voltar { margin-bottom: 24px; }

.detail-card {
  display: flex;
  gap: 36px;
  max-width: 640px;
}

.detail-capa {
  width: 140px;
  min-width: 140px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  background: #ede8de;
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail-capa img { width: 100%; height: 100%; object-fit: cover; }
.capa-placeholder { font-size: 48px; }

.detail-info { flex: 1; display: flex; flex-direction: column; gap: 8px; }

.genero {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9c9588;
}

.titulo {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 600;
  color: #2c2a25;
  line-height: 1.3;
}

.autor { font-size: 15px; color: #6b6760; }

.divider {
  border-top: 1px solid #e0d9cc;
  margin: 8px 0;
}

.meta-row { display: flex; align-items: center; gap: 12px; }

.meta-label {
  font-size: 12px;
  font-weight: 500;
  color: #9c9588;
  width: 70px;
}

.status-badge {
  font-size: 13px;
  background: #ede8de;
  padding: 3px 10px;
  border-radius: 20px;
  color: #5a5750;
}

.nota { font-size: 16px; color: #b5872a; letter-spacing: 2px; }

.detail-acoes { margin-top: 16px; }
</style>