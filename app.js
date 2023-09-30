const express = require('express')
const multer = require('multer')
const path = require('path')
const port = process.env.PORT || 5000
const fs = require('fs')
const cloudinary = require('./cloudinary-config')
const dotenv = require('dotenv')

const uploadRouter = require('./routes/upload')

const app = express()
dotenv.config()


// Set up storage for uploaded videos using Multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

// Set up EJS as the template engine
app.set('view engine', 'ejs')

// Define a route to render the video playback page
// app.get('/', (req, res) => {
//   // Get the list of uploaded videos (assuming they are in the 'uploads' folder)
//   const videoFiles = fs.readdirSync('./uploads/')
//   res.render('index', { videos: videoFiles })
// })

// Define a route to handle video uploads
// app.post('/upload', upload.single('video'), (req, res) => {
//   res.status(200).send('Video uploaded successfully!')
// })

// Serve static files (e.g., videos) from the 'uploads' directory
// app.use('/videos', express.static(path.join(__dirname, 'uploads')))

app.use('/api/v1', uploadRouter)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
