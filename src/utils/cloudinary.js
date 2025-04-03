import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
    });

    const uploadOnCloudnary = async(localFilePath)=> {
            try {
                  if(!localFilePath) return null
                  // then uploload the file 
                  const uploadResult = await cloudinary.uploader.upload(localFilePath,{
                      resource_type:"auto" // menas jo bhi file aiye gi vo detect ho jaiye ga
                  })
                  console.log("File is upload on Succesfully",uploadResult.url);
                  return uploadResult; 
            }  catch (error){
                 fs.unlinkSync(localFilePath) 
                 return null;
            }
    }

    cloudinary.v2.uploader.upload('https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {public_id: 'shoes'},
      function (error,result) {console.log(result)});

      export {uploadOnCloudnary}