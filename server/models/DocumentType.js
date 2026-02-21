import mongoose from 'mongoose';

const documentTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom du type de document est requis'],
        trim: true
    },
    service: {
        type: String,
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

documentTypeSchema.index({ name: 1, service: 1 }, { unique: true });

const DocumentType = mongoose.model('DocumentType', documentTypeSchema);

export default DocumentType;
