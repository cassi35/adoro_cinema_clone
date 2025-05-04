import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const tranporter = nodemailer.createTransport({
    host:"smtp-relay.brevo.com",
    port:587,
    auth:{
        user:process.env.STMP_USER,
        pass:process.env.STMP_PASSWORD
    }
})
export default tranporter
/* 

*/