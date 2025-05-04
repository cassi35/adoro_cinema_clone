import express from 'express'
import {signup} from '../controllers/auth_controller.js'
const routerAuth = express.Router()
routerAuth.post('/signup',signup)
export default routerAuth