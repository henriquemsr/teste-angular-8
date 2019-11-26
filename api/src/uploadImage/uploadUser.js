//requiring cloudinary and multer
const { cloud_name, api_key, api_secret } = require('../.env');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
const bcrypt = require('bcrypt');

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret
});

var storage = cloudinaryStorage({
  cloudinary,
  folder: 'usuarios', // The name of the folder in cloudinary
  allowedFormats: ['jpg', 'png', 'PNG', 'jpeg', 'gif'],
  filename: function (req, file, cb) {
    cb(null, bcrypt.hashSync(file.originalname, 10)); // The file on cloudinary would have the same name as the original file name
  }
});


const upload = multer({ storage: storage })
//const uploadCloud = multer({ storage: storage }).single('file');

module.exports = [upload, cloudinary];
