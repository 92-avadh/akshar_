const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

// 1. Define where and how the files should be saved
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadsDir); // Save files to 'uploads' folder
    },
    filename(req, file, cb) {
        // Create a unique filename: fieldname-timestamp.extension
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// 2. Security Check: Only allow image files
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

// 3. Initialize Multer
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// 4. Create the POST route (Max 7 files)
router.post('/', protect, admin, upload.array('images', 7), (req, res) => {
    // Map through uploaded files and format paths for the frontend
    const imagePaths = req.files.map(file => `/uploads/${path.basename(file.path)}`);
    res.send(imagePaths); // Send array of URLs back to React
});

module.exports = router;
