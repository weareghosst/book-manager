<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import livrosService from '../services/livros'

const livros = ref([])
const router = useRouter()

const statusLabel = { 'quero ler': '📌 Quero ler', 'lendo': '📖 Lendo', 'lido': '✅ Lido' }
const notaEstrelas = (n) => {
  const nota = Math.max(0, Math.min(5, Math.round(Number(n) || 0)))
  return '★'.repeat(nota) + '☆'.repeat(5 - nota)
}

onMounted(async () => {
  const { data } = await livrosService.listar()
  livros.value = data
})

async function excluir(id) {
  if (!confirm('Remover este livro?')) return
  await livrosService.remover(id)
  livros.value = livros.value.filter(l => l.id !== id)
}
</script>

<template>
  <div>
    <div class="list-header">
      <h2 class="page-title">Minha Estante</h2>
      <button class="btn btn-primary" @click="router.push('/novo')">+ Adicionar livro</button>
    </div>

    <p v-if="livros.length === 0" class="empty">Nenhum livro cadastrado ainda.</p>

    <div class="livros-grid">
      <div class="card livro-card" v-for="livro in livros" :key="livro.id">
        <div class="livro-capa" @click="router.push(`/livro/${livro.id}`)">
          <img v-if="livro.capa_url" :src="livro.capa_url" :alt="livro.titulo" />
          <div v-else class="capa-placeholder">📖</div>
        </div>
        <div class="livro-info">
          <span class="livro-genero">{{ livro.genero }}</span>
          <h3 class="livro-titulo" @click="router.push(`/livro/${livro.id}`)">{{ livro.titulo }}</h3>
          <p class="livro-autor">{{ livro.autor }}</p>
          <div class="livro-meta">
            <span class="status-badge">{{ statusLabel[livro.status] || livro.status }}</span>
            <span class="nota">{{ notaEstrelas(livro.nota) }}</span>
          </div>
          <div class="livro-acoes">
            <button class="btn btn-secondary" @click="router.push(`/editar/${livro.id}`)">Editar</button>
            <button class="btn btn-danger" @click="excluir(livro.id)">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 600;
  color: #2c2a25;
}

.empty {
  text-align: center;
  color: #9c9588;
  margin-top: 60px;
  font-size: 15px;
}

.livros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.livro-card {
  display: flex;
  gap: 16px;
  transition: box-shadow 0.2s;
}
.livro-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

.livro-capa {
  width: 72px;
  min-width: 72px;
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  background: #ede8de;
  display: flex;
  align-items: center;
  justify-content: center;
}
.livro-capa img { width: 100%; height: 100%; object-fit: cover; }
.capa-placeholder { font-size: 28px; }

.livro-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }

.livro-genero {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9c9588;
}

.livro-titulo {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  color: #2c2a25;
}
.livro-titulo:hover { text-decoration: underline; }

.livro-autor { font-size: 13px; color: #6b6760; }

.livro-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}

.status-badge {
  font-size: 11px;
  background: #ede8de;
  padding: 2px 8px;
  border-radius: 20px;
  color: #5a5750;
}

.nota { font-size: 12px; color: #b5872a; letter-spacing: 1px; }

.livro-acoes {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
</style>