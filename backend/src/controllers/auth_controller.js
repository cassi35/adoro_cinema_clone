import bcrypt from 'bcryptjs'
import validator from 'validator'
import pool from '../lib/db.js'
import { createJsonToken } from '../../utils/createJsonToken.js'
import { generateVerificationToken } from '../utils/generateVerificationToken.js'
import { sendVerificationToken, sendWelcomeEmail } from  '../emails/email.js'
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
export const login = async (req,res)=>{
    const {email,senha} = req.body
    if(!validator.isEmail(email) || senha.length <= 5){
        return res.status(400).json({success:false,message:"email ou senha invalido"})
    }
    try {
    const user = await pool.query(`SELECT * FROM users WHERE email = ?`,[email])
    if(user[0].length === 0){
        return res.status(400).json({success:false,message:"email nao cadastrado"})
    }        
    if(user[0][0].isverified == 'false'){
        return res.status(400).json({success:false,message:"email nao verificado"})
    }
    if(!user[0][0].senha){
        return res.status(500).json({success:false,message:"user nao cadastrado"})
    }
    const match = await bcrypt.compare(senha,user[0][0].senha)
    if(!match){
        return res.status(400).json({success:false,message:"senha incorreta"})
    }
    if(user[0][0].isverified == 'false'){
       return res.status(400).json({success:false,message:"email nao verificado"})
    }
    const token = createJsonToken(res,user[0][0].ID)
    return res.status(200).json({success:true,message:"user logado com sucesso",token})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}
export const logout = async (req,res)=>{
    try {
        res.clearCookie('token')
        res.status(200).json({success:true,message:"user deslogado com sucesso"})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}
export const verifyEmail = async (req,res)=>{
    const {code} = req.body
    try {
        const user = await pool.query(`SELECT * FROM users WHERE verificationToken = ?`,[code])
        if(user[0].length === 0){
            return res.status(400).json({success:false,message:"token invalido"})
        }
        user[0][0].isverified = 'true'
        user[0][0].verificationToken = null
        user[0][0].verificationTokenExpireAt = null
        await pool.query(`UPDATE users SET ? WHERE ID = ?`,[user[0][0],user[0][0].ID])
        sendWelcomeEmail(user[0][0].email)
        return res.status(200).json({success:true,message:"email verificado com sucesso"})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}
