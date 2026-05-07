<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import livrosService from '../services/livros'

const router = useRouter()
const route = useRoute()
const id = route.params.id

const form = ref({ titulo: '', autor: '', genero: '', status: 'quero ler', nota: 0, capa_url: '' })

onMounted(async () => {
  if (id) {
    const { data } = await livrosService.buscar(id)
    form.value = data
  }
})

async function salvar() {
  if (id) await livrosService.atualizar(id, form.value)
  else await livrosService.criar(form.value)
  router.push('/')
}
</script>

<template>
  <div>
    <h2 class="page-title">{{ id ? 'Editar livro' : 'Adicionar livro' }}</h2>

    <div class="card form-card">
      <div class="form-group">
        <label>Título</label>
        <input v-model="form.titulo" placeholder="Ex: Dom Casmurro" />
      </div>
      <div class="form-group">
        <label>Autor</label>
        <input v-model="form.autor" placeholder="Ex: Machado de Assis" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Gênero</label>
          <input v-model="form.genero" placeholder="Ex: Romance" />
        </div>
        <div class="form-group">
          <label>Status</label>
          <select v-model="form.status">
            <option>quero ler</option>
            <option>lendo</option>
            <option>lido</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Nota (0 a 5)</label>
        <input v-model.number="form.nota" type="number" min="0" max="5" />
      </div>
      <div class="form-group">
        <label>URL da capa</label>
        <input v-model="form.capa_url" placeholder="https://..." />
      </div>

      <div class="form-acoes">
        <button class="btn btn-secondary" @click="router.push('/')">Cancelar</button>
        <button class="btn btn-primary" @click="salvar">Salvar livro</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 28px;
  color: #2c2a25;
}

.form-card { max-width: 560px; }

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

label {
  font-size: 13px;
  font-weight: 500;
  color: #5a5750;
  letter-spacing: 0.3px;
}

input, select {
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
input:focus, select:focus { border-color: #2c2a25; }

.form-acoes {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>