// backend/middleware/auth.js
const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET || 'bookmanager_secret'

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ erro: 'Token não fornecido' })

  try {
    const decoded = jwt.verify(token, SECRET)
    req.userId = decoded.id
    next()
  } catch {
    res.status(401).json({ erro: 'Token inválido' })
  }
}