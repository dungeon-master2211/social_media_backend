const { catchAsyncError } = require("./catchAsyncError");
const uid = require('uid')
const cloudinary = require('cloudinary').v2
exports.uploadImage = catchAsyncError(async(file)=>{
    // config
    cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret
      })
      const uniqueId = uid.uid()
      const res = await cloudinary.uploader.upload(file, {public_id: uniqueId})
      const data = await res.secure_url
      console.log(data)

      // Generate 
    const url = cloudinary.url(uniqueId, {
        width: 100,
        height: 150,
        Crop: 'fill'
    });
    console.log(url)
    return url

})