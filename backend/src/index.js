import express from 'express'
import dotenv from 'dotenv'
import {connectDbMysql} from './lib/db.js'
dotenv.config() // Carrega as variáveis de ambiente do arquivo .env

const app = express()
const PORT = 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// endpoints  routes

//connecao mysql  
connectDbMysql()

app.get('/',(req,res)=>{
    res.send('api adoro dinema rodando')
})
//endpoints 
app.listen(PORT, () => {
    console.log(`servidor rodando na porta: ${PORT}`)
})
