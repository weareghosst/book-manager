// backend/database.js
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function init() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        criado_em TIMESTAMP DEFAULT NOW()
      )
    `)
  } catch (e) {}

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS livros (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        autor TEXT NOT NULL,
        genero TEXT,
        status TEXT DEFAULT 'quero ler',
        nota INTEGER DEFAULT 0,
        capa_url TEXT,
        user_id INTEGER
      )
    `)
  } catch (e) {}

  try {
    await pool.query(`
      ALTER TABLE livros ADD COLUMN IF NOT EXISTS user_id INTEGER
    `)
  } catch (e) {}
}

init()
module.exports = pool