import bcrypt from 'bcryptjs'
import validator from 'validator'
import pool from '../lib/db.js'
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
             const hashPassword = await bcrypt.hash(password,9)
             const sql = `INSERT INTO users (name,email,senha) VALUES (?,?,?)`
             await pool.query(sql,[name,email,hashPassword])
             const user = await pool.query(`SELECT * FROM users WHERE email = ?`,[email])
             return res.status(200).json({success:true,message:"user cadastrado com sucesso",user})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}