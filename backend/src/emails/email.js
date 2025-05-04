import { text } from 'figlet'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
import {logadoAdmin} from '../emails/emailTemplate.js'
import tranporter from '../config/nodemailter.js'
export const logadoAdmin = async (email)=>{
    try {
       const mailOptions = {
        from:process.env.SENDER_EMAIL,
        to:email,
        subject:"logado como admin",
        text:logadoAdmin(email)
       }
       await tranporter.sendMail(mailOptions)
    } catch (error) {
        throw new Error(error.message)
    }
}