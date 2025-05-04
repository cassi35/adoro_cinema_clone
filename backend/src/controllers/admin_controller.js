import pool from "../lib/db.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import { createJsonToken } from "../../utils/createJsonToken.js"
import { logadoAdmin } from "../emails/email.js"
export const signUpAdmin = async (req,res)=>{
    const {email,password,name} = req.body
    if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
    }
    
    if (!validator.isEmail(email) ) {
        return res.status(400).json({ success: false, message: "Email inválido" });
    }
    if(password.length < 9){
        return res.status(400).json({success:false,message:"senha fraca"})
    }
    try {
        const existsAdmin = await pool.query(`SELECT * FROM admin WHERE email = ?`,[email])
        if(existsAdmin[0].length > 0){
            return res.status(400).json({success:false,message:"email ja cadastrado"})
        }
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password,salt)
        const sql = `INSERT INTO admin (email, senha, name) VALUES (?, ?, ?)`;
       const admin =  await pool.query(sql, [email, passwordHash, name]);
       const token = createJsonToken(res,admin[0].insertId)
       return res.status(200).json({success:true,message:"admin cadastrado com sucesso",token})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}
export const loginAdmin = async (req,res)=>{
   const {email,password} = req.body
   if (!email || !password) {
    return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
}

if (!validator.isEmail(email) ) {
    return res.status(400).json({ success: false, message: "Email inválido" });
}
if(password.length < 9){
    return res.status(400).json({success:false,message:"senha fraca"})
}
   try {
    const existsAdmin = await pool.query(`SELECT * FROM admin WHERE email = ?`,[email])
    if(existsAdmin[0].length === 0){
        return res.status(400).json({success:false,message:"email nao cadastrado"})
    }
    const admin = existsAdmin[0][0]
    if(!admin.senha){
        return res.status(500).json({success:false,message:"admin nao cadastrado"})
    }
    const match = await bcrypt.compare(password,admin.senha)
    if(!match){
        return res.status(400).json({success:false,message:"senha incorreta"})
    }
    const token = createJsonToken(res,admin.ID)
    logadoAdmin(email)
    return res.status(200).json({success:true,message:"admin logado com sucesso",token})
} catch (error) {
    return res.status(500).json({success:false,message:error.message})
   }
}
export const logout = async (req,res)=>{
    res.clearCookie('token')
    return res.status(200).json({success:true,message:"admin deslogado com sucesso"})
}