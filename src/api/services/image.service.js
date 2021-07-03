const multer = require('multer');
const path = require('path');

// File upload folder
const DIR = path.join(__dirname, '../../../public/images/');
const EVENT_IMAGES_ROUTE = 'event-images';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname.toLowerCase().split(' ').join('-').substr(10)}`;
    cb(null, fileName);
  },
});

exports.upload = multer({
  storage,
  // eslint-disable-next-line consistent-return
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

exports.getImageUrl = imageName => `${process.env.SERVER_ADDRESS}:${process.env.PORT}/${EVENT_IMAGES_ROUTE}/${imageName}`;

exports.imageDirPath = DIR;
exports.eventImagesRoute = EVENT_IMAGES_ROUTE;
