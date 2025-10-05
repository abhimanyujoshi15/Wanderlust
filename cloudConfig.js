const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPIKEY,
    api_secret: process.env.CLOUDAPISECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',  // Optional: Folder for uploaded files in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],  // Optional: Restrict allowed file types
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional: Apply image transformations on upload
  }
});

module.exports = {cloudinary,storage};