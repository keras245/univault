import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload un fichier vers Cloudinary
 * @param {string} filePath - Chemin du fichier à uploader
 * @param {string} folder - Dossier de destination dans Cloudinary
 * @returns {Promise<Object>} Résultat de l'upload
 */
export const uploadToCloudinary = async (filePath, folder = 'univault') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: 'auto', // Détecte automatiquement le type (image, pdf, etc.)
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
 * Supprime un fichier de Cloudinary
 * @param {string} publicId - ID public du fichier à supprimer
 * @returns {Promise<Object>} Résultat de la suppression
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

/**
 * Génère une URL signée temporaire pour un fichier
 * @param {string} publicId - ID public du fichier
 * @param {number} expiresIn - Durée de validité en secondes (défaut: 1h)
 * @returns {string} URL signée
 */
export const getSignedUrl = (publicId, expiresIn = 3600) => {
    const timestamp = Math.round(Date.now() / 1000) + expiresIn;

    return cloudinary.url(publicId, {
        sign_url: true,
        type: 'authenticated',
        expires_at: timestamp,
    });
};

export default cloudinary;
