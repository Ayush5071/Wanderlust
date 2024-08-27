// cloudinary.js
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({ 
  cloud_name: "do0otkuad", 
  api_key: "851367178743574", 
  api_secret: "yiX7UIq9jMJvSKLaXQe9Oor_Nk0"
});

const uploadOnCloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) return null;

    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto"
    });

    console.log("File has been uploaded to Cloudinary", response.url);

    fs.unlinkSync(localfilepath);
    return response;

  } catch (error) {
    fs.unlinkSync(localfilepath); 
    return null;      
  }
};

module.exports = { uploadOnCloudinary };

