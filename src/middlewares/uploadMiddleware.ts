import multer from 'multer';
import * as aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import util from 'util';
import { AWS_KEY, AWS_S3_BUCKET_NAME, AWS_SECRET } from '../config/config'

const s3 = new aws.S3({
  region: 'ap-south-1',
  accessKeyId: AWS_KEY,
  secretAccessKey: AWS_SECRET
});

const multerConfig = {
  storage: multerS3({
    // @ts-ignore
    s3: s3,
    bucket: AWS_S3_BUCKET_NAME,
    acl: 'public-read',
    key: function (request: any, file: any, cb: any) {
      const ext = file.mimetype.split('/')[1];
      cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
    }
  }),
  fileFilter: function (req: any, file: any, cb: any) {
    if (!file) {
      cb();
    }
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
      return cb(null, true);
    } else {
      // Accepting only file type of image
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
    }
  }
};

const imageUpload = multer(multerConfig).single('file');

export const imageMiddleWare = (req: any, res: any, next: any) => {
  imageUpload(req, res, (err: any) => {
    console.log("error from here",util.inspect(err, { breakLength: Infinity }));

    if (err) {
      return res.status(422).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};