
export const inserirProducao = async (req,res)=>{
    const {nome,idade,nacionalidade,atividade,foto} = req.body
    if(!nome || !idade || !nacionalidade || !atividade || !foto){
        return res.status(400).json({success:false,message:"todos os campos obrigatorios"})
    }
    try {
        
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}
export const inserirPost = async (req,res)=>{
     
    try {
        
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}