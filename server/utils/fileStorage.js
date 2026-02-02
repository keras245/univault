import cloudinary from './cloudinary.js';
import fs from 'fs';

/**
 * Upload un fichier vers Cloudinary avec le BON resource_type
 */
export async function uploadFile(filePath, options = {}) {
    const { folder, originalName, mimetype } = options;
    
    console.log('📤 UPLOAD:', originalName, '|', mimetype);
    
    // Déterminer le resource_type CORRECT
    let resourceType = 'auto';
    if (mimetype === 'application/pdf') {
        resourceType = 'raw'; // PDFs = raw
        console.log('🔴 PDF détecté → resource_type: raw');
    } else if (mimetype.startsWith('image/')) {
        resourceType = 'image';
        console.log('🟢 Image détectée → resource_type: image');
    }
    
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: resourceType,
            use_filename: true,
            unique_filename: true
        });
        
        console.log('✅ Cloudinary OK!');
        console.log('   URL:', result.secure_url);
        console.log('   Resource type retourné:', result.resource_type);
        
        return {
            url: result.secure_url,
            publicId: result.public_id,
            resourceType: result.resource_type,
            bytes: result.bytes,
            storage: 'cloudinary'
        };
        
    } catch (error) {
        console.error('❌ Erreur Cloudinary:', error.message);
        throw error;
    }
}

/**
 * Supprime un fichier de Cloudinary
 */
export async function deleteFile(document) {
    console.log('🗑️ Suppression:', document.fileName);
    
    try {
        // Utiliser le BON resource_type pour la suppression
        const resourceType = document.fileType === 'application/pdf' ? 'raw' : 'image';
        
        await cloudinary.uploader.destroy(document.cloudinaryId, {
            resource_type: resourceType
        });
        
        console.log('✅ Supprimé de Cloudinary');
        return { success: true };
        
    } catch (error) {
        console.error('❌ Erreur suppression:', error.message);
        return { success: false, error: error.message };
    }
}

export default {
    uploadFile,
    deleteFile
};
