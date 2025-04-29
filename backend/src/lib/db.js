import mysql from 'mysql2'
const connectDbMysql = ()=>{
    const conexao = mysql.createConnection({
        host:"localhost",
        user:'root',
        password:"root",
        database:"adoroFilmes"
    })
    
   conexao.connect((err) => {
    if(err){
        throw err 
    }
    console.log(`connecao feita com sucesso`)
   })
}
export default connectDbMysql