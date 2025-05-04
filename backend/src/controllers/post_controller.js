
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
        let funcionarioExists = await pool.query(`SELECT * FROM funcionario WHERE id_funcionario = ?`,[id_funcionario])
        let diretorExists = await pool.query(`SELECT * FROM diretor WHERE id_diretor = ?`,[direcao_id])
        if(funcionarioExists[0].length === 0 || diretorExists[0].length === 0){
            return res.status(400).json({success:false,message:"funcionario nao cadastrado ou diretor nao cadastrado"})
        }
        let videoUrl = null 
        if(id_traler){  
            const response = await cloudinary.uploader.upload(id_traler)
            videoUrl = response.secure_url
        }
        const sql = `INSERT INTO filmes VALUES (?, ?, ?, ?, ?, ?, ? ?)`
        await pool.query(sql,[titulo,sinopse,genero,avaliacao,id_image,direcao_id,id_funcionario,videoUrl] )
        const email = funcionarioExists[0][0].email 
        postCadastrado(email)
        return res.status(200).json({success:true,message:"filme cadastrado com sucesso"})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}