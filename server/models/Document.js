import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Le titre est requis'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    service: {
        type: String,
        required: [true, 'Le service est requis'],
        enum: [
            'Scolarité',
            'Comptabilité',
            'Ressources Humaines',
            'Génie Informatique',
            'Droit',
            'Administration',
            'Autre',
        ],
    },
    category: {
        type: String,
        required: [true, 'La catégorie est requise'],
    },
    fileUrl: {
        type: String,
        required: [true, 'L\'URL du fichier est requise'],
    },
    fileType: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
        required: true,
    },
    cloudinaryId: {
        type: String,
        required: true,
    },
    resourceType: {
        type: String,
        default: 'image'
    },
    // Métadonnées spécifiques par service
    metadata: {
        // Scolarité
        studentMatricule: String,
        studentName: String,
        academicYear: String,

        // Comptabilité
        orderNumber: String,
        invoiceNumber: String,
        amount: Number,
        beneficiary: String,
        paymentDate: Date,

        // RH
        letterReference: String,
        employeeId: String,
        salaryMonth: String,

        // Champs génériques
        customFields: mongoose.Schema.Types.Mixed,
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'signed', 'archived'],
        default: 'draft',
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    versions: [{
        version: {
            type: Number,
            required: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        cloudinaryId: {
            type: String,
            required: true,
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    }],
    tags: [{
        type: String,
        trim: true,
    }],
}, {
    timestamps: true,
});

// Index pour améliorer les performances de recherche
documentSchema.index({ service: 1, category: 1 });
documentSchema.index({ 'metadata.studentMatricule': 1 });
documentSchema.index({ 'metadata.letterReference': 1 });
documentSchema.index({ title: 'text', description: 'text' });

const Document = mongoose.model('Document', documentSchema);

export default Document;
