import jwt from 'jsonwebtoken'
export const adminMiddleware = (req,res,next)=>{
    const token = req.cookies.token 
    if(!token){
        return res.status(401).json({success:false,message:"admin nao autenticado"})
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        console.log("token decodificado")
        req.userId = decoded.userId
        next()
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}