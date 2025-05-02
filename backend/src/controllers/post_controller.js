
import cloudinary from "../lib/cloudinary.js"
import pool from "../lib/db.js"

export const inserirProducao = async (req, res) => {
    const { nome, idade, nacionalidade, atividade, foto } = req.body;

    // Validação de entrada
    if (!nome || !idade || !nacionalidade || !atividade || !foto) {
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
    try {
        
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}