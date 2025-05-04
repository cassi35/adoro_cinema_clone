import bcrypt from 'bcryptjs'
import validator from 'validator'
import pool from '../lib/db.js'
import { createJsonToken } from '../../utils/createJsonToken.js'
import { generateVerificationToken } from '../utils/generateVerificationToken.js'
import { sendVerificationToken } from  '../emails/email.js'
export const signup = async (req,res)=>{
    const {name,email,password} = req.body
    if(!validator.isEmail(email)|| password.length < 5){
        return res.status(400).json({success:false,message:"email ou senha invalido"})
    }
    try {
             const existsUser = await pool.query(`SELECT * FROM users WHERE email = ?`,[email])
             if(existsUser[0].length > 0){
                 return res.status(400).json({success:false,message:"email ja cadastrado"})
             }
             const tempo = new Date()
             const data = `${tempo.getFullYear()}-${tempo.getMonth()}-${tempo.getDate()}`
             const hashPassword = await bcrypt.hash(password,9)
             const verificationToken = generateVerificationToken()
             const sql = `INSERT INTO users (name,email,senha,isverified,verificationToken,verificationTokenExpireAt
             ) VALUES (?,?,? ,?, ?,?)`
             await pool.query(sql,[name,email,hashPassword,'false',verificationToken,data])
             const user = await pool.query(`SELECT * FROM users WHERE email = ?`,[email])
             const token = createJsonToken(res,user[0][0].ID)
             sendVerificationToken(email,verificationToken)
             return res.status(200).json({success:true,message:"user cadastrado com sucesso",token,verificationToken})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}