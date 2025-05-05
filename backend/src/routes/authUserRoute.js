import express from 'express'
import {signup,verifyEmail,login,logout,resetPassword,sendResetPassword} from '../controllers/auth_controller.js'
const routerAuth = express.Router()
routerAuth.post('/signup',signup)
routerAuth.post('/login',login)
routerAuth.post('/logout',logout)
routerAuth.post('/verify-email',verifyEmail)
routerAuth.post('/send-reset-password',sendResetPassword)
routerAuth.post('/reset-password',resetPassword)
export default routerAuth