const express = require('express')
const {
  uploadController,
  videoView,
} = require('../controllers/uploadController')
const multer = require('multer')

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/upload', upload.single('video'), uploadController)
router.get('/', videoView)

module.exports = router
