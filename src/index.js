const express = require('express');
const app = express();

const env = require('dotenv');
env.config();

var aws = require('aws-sdk')
var multer = require('multer');
var multerS3 = require('multer-s3');

//Lets Create s3 object

//let someobject = new SomeClass();
let s3 = new aws.S3({
    accessKeyId:process.env.ACCESS_KEY_ID,
    secretAccessKey:process.env.SECRET_ACCESS_KEY
});

var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.BUCKET_NAME,
      acl:'public-read',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
          console.log(file.originalname.split('.')[1]);
        cb(null, Date.now().toString()+'.'+file.originalname.split('.')[1])
      }
    })
  })

const Get = require('./route/Get');

app.get('/',Get);
app.post('/upload',upload.single('picture'),(req,res)=>{
    //console.log(req.file);
    res.status(201).json({
        msg:"File uploaded SUccessfully",
        file:req.file.location
    });
});

app.listen(process.env.PORT,()=>{
    console.log(`The server is running on port ${ process.env.PORT } `);
});