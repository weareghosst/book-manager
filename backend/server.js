// backend/server.js
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./database')
const authRoutes = require('./routes/auth')
const authMiddleware = require('./middleware/auth')

const app = express()
app.use(cors())
app.use(express.json())

// Rotas de autenticação (públicas)
app.use('/auth', authRoutes)

// READ — listar livros do usuário logado
app.get('/livros', authMiddleware, async (req, res) => {
  const result = await db.query('SELECT * FROM livros WHERE user_id = $1 ORDER BY id DESC', [req.userId])
  res.json(result.rows)
})

// READ — buscar um
app.get('/livros/:id', authMiddleware, async (req, res) => {
  const result = await db.query('SELECT * FROM livros WHERE id = $1 AND user_id = $2', [req.params.id, req.userId])
  if (result.rows.length === 0) return res.status(404).json({ erro: 'Livro não encontrado' })
  res.json(result.rows[0])
})

// CRIAR
app.post('/livros', authMiddleware, async (req, res) => {
  const { titulo, autor, genero, status, nota, capa_url } = req.body
  const result = await db.query(
    'INSERT INTO livros (titulo, autor, genero, status, nota, capa_url, user_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
    [titulo, autor, genero, status, nota, capa_url, req.userId]
  )
  res.status(201).json(result.rows[0])
})

// ATUALIZAR
app.put('/livros/:id', authMiddleware, async (req, res) => {
  const { titulo, autor, genero, status, nota, capa_url } = req.body
  const result = await db.query(
    'UPDATE livros SET titulo=$1, autor=$2, genero=$3, status=$4, nota=$5, capa_url=$6 WHERE id=$7 AND user_id=$8 RETURNING *',
    [titulo, autor, genero, status, nota, capa_url, req.params.id, req.userId]
  )
  res.json(result.rows[0])
})

// DELETAR
app.delete('/livros/:id', authMiddleware, async (req, res) => {
  await db.query('DELETE FROM livros WHERE id = $1 AND user_id = $2', [req.params.id, req.userId])
  res.json({ mensagem: 'Livro removido com sucesso' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`))