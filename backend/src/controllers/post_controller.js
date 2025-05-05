
import { postCadastrado } from "../emails/email.js";
import cloudinary from "../lib/cloudinary.js"
import pool from "../lib/db.js"
export const inserirProducao = async (req, res) => {
    const { nome, idade, nacionalidade, atividade, foto,filme } = req.body;

    // Validação de entrada
    if (!nome || !idade || !nacionalidade || !atividade || !foto || !filme) {
        return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
    }

    if (nome.length < 5) {
        return res.status(400).json({ success: false, message: "O nome deve ter pelo menos 5 caracteres" });
    }

    if (idade < 1) {
        return res.status(400).json({ success: false, message: "A idade deve ser maior que 0" });
    }

    if (nacionalidade.length < 5) {
        return res.status(400).json({ success: false, message: "A nacionalidade deve ter pelo menos 5 caracteres" });
    }

    if (!["ator", "diretor", "escritor"].includes(atividade)) {
        return res.status(400).json({ success: false, message: "A atividade deve ser 'ator', 'diretor' ou 'escritor'" });
    }

    if (foto.length < 5) {
        return res.status(400).json({ success: false, message: "A URL da foto é inválida" });
    }

    try {
        // Upload da imagem para o Cloudinary
        let imgUrl = null;
        if (foto) {
            const response = await cloudinary.uploader.upload(foto);
            imgUrl = response.secure_url;
        }

        // Inserção no banco de dados
        const sql = `INSERT INTO pessoas (nome, idade, nacionalidade, atividade, id_image) VALUES (?, ?, ?, ?, ?)`;
        const result = await pool.query(sql, [nome, idade, nacionalidade, atividade, imgUrl]);

        return res.status(200).json({ success: true, message: "Pessoa cadastrada com sucesso" });
    } catch (error) {
        console.error("Erro ao cadastrar pessoa:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const inserirPost = async (req,res)=>{
    const {titulo,sinopse,genero,avaliacao,id_image,direcao_id,id_funcionario,id_traler} = req.body
    if(!titulo || !sinopse || !genero || !avaliacao || !id_image || !direcao_id || !id_funcionario || !id_traler){
        return res.status(400).json({success:false,message:"todos os campos obrigatorios"})
    }
    if((titulo.length < 5 || typeof titulo != "string") || (sinopse.length < 5 || typeof sinopse != "string") || (genero.length < 5 || typeof genero != "string") || (avaliacao < 0 || typeof avaliacao != "number")){
        return res.status(400).json({success:false,message:"campos invalidos"})
    }
    try {
        let funcionarioExists = await pool.query(`SELECT * FROM admin WHERE ID = ?`,[id_funcionario])
        let diretorExists = await pool.query(`SELECT * FROM pessoas WHERE ID = ?`,[direcao_id])
        if(funcionarioExists[0].length === 0 || diretorExists[0].length === 0){
            return res.status(400).json({success:false,message:"funcionario nao cadastrado ou diretor nao cadastrado",user:funcionarioExists})
        }
        let videoUrl = null 
        let imageUrl = null
        if(id_traler && id_image){  
            try {
                const response = await cloudinary.uploader.upload(id_traler,{folder:"filmes/post",resource_type:"video"})
                videoUrl = response.secure_url
                const responseImage = await cloudinary.uploader.upload(id_image,{folder:"filmes/post",resource_type:"image"})
                imageUrl = responseImage.secure_url
            } catch (error) {
               return res.status(500).json({success:false,message:error.message})
            }
        }
        const sql = `INSERT INTO filmes (titulo,sinopse,genero,avaliacao,id_image,direcao_id,id_funcionario,id_trailer) VALUES (?, ?, ?, ?, ?, ?, ? ,?)`
        await pool.query(sql,[titulo,sinopse,genero,avaliacao,imageUrl,direcao_id,id_funcionario,videoUrl] )
        const email = funcionarioExists[0][0].email 
        postCadastrado(email)
        return res.status(200).json({success:true,message:"filme cadastrado com sucesso"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:error.message})
    }
}
export const deletarPost = async (req,res)=>{
    const {id} = req.params
    try {
        const filme = await pool.query(`SELECT * FROM filmes WHERE ID = ?`,[id])
        if(filme[0].length === 0){
            return res.status(400).json({success:false,message:"filme nao cadastrado"})
        }
        await pool.query(`DELETE FROM filmes WHERE ID = ?`,[id])
        return res.status(200).json({success:true,message:"filme deletado com sucesso"})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}
export const editarPost = async (req,res)=>{
    const {id} = req.params
    const {titulo,sinopse,genero,avaliacao,id_image,direcao_id,id_funcionario,id_traler} = req.body
    try {
        const filme = await pool.query(`SELECT * FROM filmes WHERE ID = ?`,[id])
        if(filme[0].length === 0){
            return res.status(400).json({success:false,message:"filme nao cadastrado"})
        }
        let img_url = filme[0][0].id_image
        let video_url = filme[0][0].id_trailer
        if(id_image != ''){
            try {
                await cloudinary.uploader.destroy(filme[0][0].id_image)
                const response = await cloudinary.uploader.upload(id_image,{folder:"filmes/post",resource_type:"image"})
                img_url = response.secure_url
            } catch (error) {
                return res.status(500).json({success:false,message:error.message})
            }
        }
        if(video_url != ''){
            try {
                await cloudinary.uploader.destroy(filme[0][0].id_trailer)
                const response = await cloudinary.uploader.upload(id_traler,{folder:"filmes/post",resource_type:"video"})
                video_url = response.secure_url
            } catch (error) {
                return res.status(500).json({success:false,message:error.message})
            }
        }
       filme[0][0].titulo = titulo != ''?titulo:filme[0][0].titulo
       filme[0][0].sinopse = sinopse != ''?sinopse:filme[0][0].sinopse
       filme[0][0].genero = genero != ''?genero:filme[0][0].genero
       filme[0][0].avaliacao = avaliacao != ''?avaliacao:filme[0][0].avaliacao
       filme[0][0].id_image = img_url
       filme[0][0].id_trailer = video_url
       filme[0][0].direcao_id = direcao_id != ''?direcao_id:filme[0][0].direcao_id
       filme[0][0].id_funcionario = id_funcionario != ''?id_funcionario:filme[0][0].id_funcionario
       await pool.query(`UPDATE filmes SET ? WHERE ID = ?`,[filme[0][0],id])
       return res.status(200).json({success:true,message:"filme editado com sucesso"})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}