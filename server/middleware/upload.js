const multer = require('multer');
const path = require('path');

// Store files locally on disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // uploaded at the same millisecond will overwrite each other
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const allowedFileMimeType = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];
const upload = multer({
	storage,
	fileFilter(req, file, cb) {
		if (allowedFileMimeType.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error(`File type ${file.mimetype} is not allowed, Only pdf and images are accepted`), false);
		}
	},
});

module.exports = upload;
