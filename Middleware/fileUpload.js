const multer  = require('multer')
const APIError = require('../utils/APIError');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const { awsS3 } = require('../config');

var s3 = new aws.S3({ 
  secretAccessKey: awsS3.secretAccessKey,
  accessKeyId: awsS3.accessKeyId,
  region: awsS3.region 
})

const storage = multerS3({
  s3: s3,
  bucket: awsS3.bucket_name,
  key: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const audioTypes = ['audio/mpeg', 'audio/ogg', 'audio/wav']
    const videoTypes = ['video/mp4', 'video/webm', 'video/ogg']
    if(file.fieldname == "audio" && !audioTypes.includes(file.mimetype))
      cb(new APIError({status:422, message:'You have selected invalid file, Please select valid audio file!'}))
    else if(file.fieldname == "video" && !videoTypes.includes(file.mimetype)) {
      cb(new APIError({status:422, message:'You have selected invalid file, Please select valid video file!'}))
    } else {
      cb(null, file.originalname)
    }
  }
});
  
const upload = multer({ storage: storage })
module.exports = upload