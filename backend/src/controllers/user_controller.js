export const minhaLista = async (req,res)=>{
    const {id_movie} = req.params
    const {email} = req.body
    try {
        const user = await pool.query(`SELECT * FROM users WHERE email = ?`,[email])
        if(user[0].length === 0){
            return res.status(400).json({success:false,message:"email nao cadastrado"})
        }
        const filme = await pool.query(`SELECT * FROM filmes WHERE ID = ?`,[id_movie])
        if(filme[0].length === 0){
            return res.status(400).json({success:false,message:"filme nao cadastrado"})
        }
        const sql = `INSERT INTO filmes_user (filme_id,user_id) VALUES (?,?)`
        await pool.query(sql,[filme[0][0].id,user[0][0].ID])
        return res.status(200).json({success:true,message:"filme adicionado com sucesso"})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}
