import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()
const pool = mysql.createPool({
    host:process.env.DB_HOST || 'localhost', 
    user:process.env.DB_USER || 'root',    
    password:process.env.DB_PASSWORD || 'root',
    database:process.env.DB_NAME || 'adoroFilmes'
}).promise()
export const connectDbMysql = async ()=>{
   try {
    const connection = await pool.getConnection()
    console.log('Conexão com o MySQL estabelecida com sucesso!');
    connection.release()
   } catch (error) {
    console.error('Erro ao estabelecer conexão com o MySQL:', error);
    throw error
   }
}
export default pool