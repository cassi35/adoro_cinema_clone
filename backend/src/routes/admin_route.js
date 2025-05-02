import express from 'express'
import { loginAdmin ,logout,signUpAdmin} from '../controllers/admin_controller.js'
const routerAdmin = express.Router()
routerAdmin.post('/signup',signUpAdmin)
routerAdmin.post('/login',loginAdmin)
routerAdmin.post('/logout',logout)
export default routerAdmin