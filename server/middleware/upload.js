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

const allowedExtension = [".pdf", ".jpg", ".jpeg", ".png", ".webp"]

const upload = multer({
	storage,
	fileFilter(req, file, cb) {
    const extension = path.extname(file.originalname).toLocaleLowerCase();
		if (allowedFileMimeType.includes(file.mimetype) && allowedExtension.includes(extension)) {
			cb(null, true);
		} else {
      const err = new Error(`File type ${file.mimetype} is not allowed, Only pdf and images are accepted`)
      err.statusCode = 400;
			cb(err, false);
		}
	},
});


module.exports = upload;
