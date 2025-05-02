import express from 'express'
import {inserirPost,inserirProducao} from '../controllers/post_controller.js'
const routerPost = express.Router()
routerPost.post('/inserirProducao',inserirProducao)
routerPost.post('/adicionar',inserirPost)
export default routerPost