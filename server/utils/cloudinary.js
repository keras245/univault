import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload un fichier vers Cloudinary (pour documents généraux)
 */
export const uploadToCloudinary = async (filePath, folder = 'univault') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: 'auto',
            use_filename: true,
            unique_filename: true,
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            size: result.bytes,
        };
    } catch (error) {
        console.error('Erreur upload Cloudinary:', error);
        throw new Error('Échec de l\'upload du fichier');
    }
};

/**
 * Supprime un fichier de Cloudinary (pour documents généraux)
 */
export const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Erreur suppression Cloudinary:', error);
        throw new Error('Échec de la suppression du fichier');
    }
};

export default cloudinary;
