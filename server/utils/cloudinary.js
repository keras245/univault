import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 120000,
});

const getResourceType = (filePath) => {
    const ext = filePath.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) return 'image';
    if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'video';
    return 'raw';
};

export const uploadToCloudinary = async (filePath, folder = 'univault') => {
    const resourceType = getResourceType(filePath);

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType,
                use_filename: true,
                unique_filename: true,
                access_mode: 'public',
                invalidate: true,
            },
            (error, result) => {
                if (error) {
                    console.error('❌ Erreur Cloudinary:', error.message);
                    return reject(new Error(`Échec upload: ${error.message}`));
                }
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                    format: result.format || filePath.split('.').pop().toLowerCase(),
                    size: result.bytes,
                    resourceType,
                });
            }
        );

        // Stream le fichier directement depuis le disque 👇
        fs.createReadStream(filePath).pipe(uploadStream);
    });
};

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true,
        });
        return result;
    } catch (error) {
        console.error('Erreur suppression Cloudinary:', error);
        throw new Error('Échec de la suppression du fichier');
    }
};

export default cloudinary;