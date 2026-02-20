import mongoose from 'mongoose';

const documentTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom du type de document est requis'],
        trim: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: [true, 'Le service est requis']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index pour recherche rapide
documentTypeSchema.index({ name: 1, service: 1 });

const DocumentType = mongoose.model('DocumentType', documentTypeSchema);

export default DocumentType;
