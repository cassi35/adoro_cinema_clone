import express from 'express'
import multer from 'multer'
import {inserirPost,inserirProducao} from '../controllers/post_controller.js'

const routerPost = express.Router()

// Configure multer for video uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'videos/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
})

routerPost.post('/inserirProducao',inserirProducao)
routerPost.post('/adicionar', upload.single('video'), inserirPost)

export default routerPost