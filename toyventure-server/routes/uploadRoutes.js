const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

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
        cb(new Error('Images only!'));
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

// 4. Create the POST route (Max 4 files: 1 main, 3 optional angles)
router.post('/', protect, admin, upload.array('images', 4), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No images uploaded' });
    }

    // Return the FULL absolute URL so the frontend correctly renders it regardless of domain
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imagePaths = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);

    res.json(imagePaths); // Send array of absolute URLs back to React
});

module.exports = router;