import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom du service est requis'],
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Le code du service est requis'],
        unique: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    responsable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    documentTypes: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware pour mettre à jour updatedAt
serviceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Index pour recherche rapide
serviceSchema.index({ name: 1, code: 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
