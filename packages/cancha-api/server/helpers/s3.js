const AWS = require('aws-sdk');

const BUCKET_NAME = 'canchaphotos';
const IAM_USER_KEY = process.env.AWSAccessKeyId;
const IAM_USER_SECRET = process.env.AWSSecretKey;

function uploadToS3(file) {
 let s3bucket = new AWS.S3({
   accessKeyId: IAM_USER_KEY,
   secretAccessKey: IAM_USER_SECRET,
   Bucket: BUCKET_NAME,
 });

 s3bucket.createBucket(function () {
   var params = {
    Bucket: BUCKET_NAME,
    Key: file.name,
    Body: file.data,
   };

   s3bucket.upload(params, function (err, data) {
    if (err) {
      console.info(`AWS, ${err}`);
    }
   });
 });
}

module.exports = { uploadToS3 }
