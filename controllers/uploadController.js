const multer = require('multer')
const cloudinary = require('../cloudinary-config')
const port = process.env.PORT || 5000
const path = require('path')
const fs = require('fs')

// Set up Multer to handle video uploads
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Set up storage for uploaded videos using Multer
// const storage = multer.diskStorage({
//   destination: './uploads/',
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   },
// })

const videoView = async (req, res) => {
  try {
    // Fetch the list of uploaded videos from Cloudinary
    const { resources } = await cloudinary.search
      .expression('resource_type:video')
      .sort_by('public_id', 'desc')
      .max_results(30) // Adjust the number of videos to fetch as needed
      .execute()

    res.render('index', { videos: resources })
  } catch (error) {
    console.error('Error fetching videos from Cloudinary:', error)
    res.status(500).send('Internal Server Error')
  }
}

const uploadController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.')
    }

    // Generate a unique filename (e.g., timestamp + originalname)
    const uniqueFilename = `${Date.now()}_${req.file.originalname}`

    // Create the temporary file path
    const tempFilePath = path.join(__dirname, 'uploads', uniqueFilename)

    // Log the temporary file path for debugging
    console.log('Temporary file path:', tempFilePath)

    // Write the uploaded file to the temporary file
    fs.writeFileSync(tempFilePath, req.file.buffer)

    // Log that the temporary file has been created
    console.log('Temporary file created:', tempFilePath)

    // Upload the temporary file to Cloudinary
    const result = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: 'video',
      folder: 'hngx/chrome-ext',
    })

    // Delete the temporary file
    fs.unlinkSync(tempFilePath)

    // Log that the temporary file has been deleted
    console.log('Temporary file deleted:', tempFilePath)

    console.log('Uploaded video details:', result)

    res.status(200).send('Video uploaded successfully!')
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', error)
    res.status(500).send('Internal Server Error')
  }
}

module.exports = { videoView, uploadController }
