import express from 'express'
import { loginAdmin ,signUpAdmin} from '../controllers/admin_controller.js'
const routerAdmin = express.Router()
routerAdmin.post('/signup',signUpAdmin)
routerAdmin.post('/login',loginAdmin)
export default routerAdmin