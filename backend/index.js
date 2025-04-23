import express from 'express'
import dotenv from 'dotenv'

dotenv.config() // Carrega as variáveis de ambiente do arquivo .env

const app = express()
const PORT = 4000

app.use(express.json())

app.listen(PORT, () => {
    console.log(`servidor rodando na porta: ${PORT}`)
})