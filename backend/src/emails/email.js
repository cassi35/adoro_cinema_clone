import dotenv from 'dotenv'
import axios from 'axios'
dotenv.config()
import {postCadastradoSucesso, wecomelADmin,verificationTokenFunc, sendEditado} from '../emails/emailTemplate.js'
import tranporter from '../config/nodemailter.js'
export const logadoAdmin = async (email)=>{
    try {
       const mailOptions = {
        from:process.env.SENDER_EMAIL,
        to:email,
        subject:"logado como admin",
        text:wecomelADmin(email)
       }
       await tranporter.sendMail(mailOptions)
    } catch (error) {
        throw new Error(error.message)
    }
}
export const postCadastrado = async (email)=>{
    try {
        const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"post  cadastrado",
            text:postCadastradoSucesso(email)
        }
        await tranporter.sendMail(mailOptions)

    } catch (error) {
        throw new Error(error.message)
    }
}
export const sendVerificationToken = async (email,verificationToken)=>{
    try {
        const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"token de verificacao",
            text:verificationTokenFunc(verificationToken)
        }
        await tranporter.sendMail(mailOptions)
    } catch (error) {
        throw new Error(error.message)
        
    }
}
export const sendWelcomeEmail = async (email)=>{
    try {
        const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"logado com sucesso",
            text:wecomelADmin(email)
        }
        await tranporter.sendMail(mailOptions)
    } catch (error) {
        throw new Error(error.message)
        
    }
}
export const sendAlteradoSucesso = async (email)=>{
    try {
        const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"logado com sucesso",
            text:sendEditado(email)
        }
        await tranporter.sendMail(mailOptions)
    } catch (error) {
        throw new Error(error.message)
        
    }
}