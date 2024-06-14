import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";



// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET
 });


const uploadOnCloudinary = async function(localFilePath) {

    // Upload an image
    try {
        if(localFilePath){
            const Response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: 'auto'
            })

            console.log(uploadResult);

            fs.unlinkSync(localFilePath);
            return Response
        }
        
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}



export {uploadOnCloudinary};