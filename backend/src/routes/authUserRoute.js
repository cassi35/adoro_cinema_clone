import express from 'express'
import {signup,verifyEmail} from '../controllers/auth_controller.js'
const routerAuth = express.Router()
routerAuth.post('/signup',signup)
routerAuth.post('/verify-email',verifyEmail)
export default routerAuth