// backend/routes/auth.js
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../database')
const router = express.Router()

const SECRET = process.env.JWT_SECRET || 'bookmanager_secret'

// Criar tabela de usuários
db.query(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW()
  )
`)

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body
    if (!nome || !email || !senha) return res.status(400).json({ erro: 'Preencha todos os campos' })

    const existe = await db.query('SELECT id FROM usuarios WHERE email = $1', [email])
    if (existe.rows.length > 0) return res.status(400).json({ erro: 'Email já cadastrado' })

    const hash = await bcrypt.hash(senha, 10)
    const result = await db.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email',
      [nome, email, hash]
    )

    const token = jwt.sign({ id: result.rows[0].id }, SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, usuario: result.rows[0] })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registrar' })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body
    if (!email || !senha) return res.status(400).json({ erro: 'Preencha todos os campos' })

    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email])
    if (result.rows.length === 0) return res.status(401).json({ erro: 'Email ou senha incorretos' })

    const usuario = result.rows[0]
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) return res.status(401).json({ erro: 'Email ou senha incorretos' })

    const token = jwt.sign({ id: usuario.id }, SECRET, { expiresIn: '7d' })
    res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao fazer login' })
  }
})

module.exports = router