import express from 'express'
import {avaliacao,minhaLista,comentario} from '../controllers/user_controller.js'
import { userMiddleware } from '../middlewares/userMiddleware'
const userRoute = express.Router()
userRoute.post('/avaliar',userMiddleware,avaliacao)
userRoute.post('/comentario',userMiddleware,comentario)
userRoute.post('/minha-lista',userMiddleware,minhaLista)
export default userRoute