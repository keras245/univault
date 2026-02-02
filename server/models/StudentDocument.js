import mongoose from 'mongoose';

const studentDocumentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        index: true
    },
    type: {
        type: String,
        required: [true, 'Le type de document est requis'],
        enum: [
            'Fiche d\'inscription',
            'Fiche de réinscription',
            'Diplôme du bac',
            'Extrait de naissance',
            'Photo d\'identité',
            'Certificat de scolarité',
            'Attestation',
            'Autre'
        ]
    },
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    cloudinaryId: {
        type: String,
        required: true
    },
    note: {
        type: String,
        trim: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false
});

// Index pour recherche rapide
studentDocumentSchema.index({ student: 1, uploadedAt: -1 });
studentDocumentSchema.index({ type: 1 });
studentDocumentSchema.index({ uploadedBy: 1 });

const StudentDocument = mongoose.model('StudentDocument', studentDocumentSchema);

export default StudentDocument;
