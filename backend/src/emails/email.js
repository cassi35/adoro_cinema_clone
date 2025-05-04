import dotenv from 'dotenv'
import axios from 'axios'
dotenv.config()
import {postCadastradoSucesso, wecomelADmin} from '../emails/emailTemplate.js'
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
       const response = await axios.post('')
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