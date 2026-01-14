import mongoose from 'mongoose';

const letterSchema = new mongoose.Schema({
    reference: {
        type: String,
        required: true,
        unique: true,
    },
    subject: {
        type: String,
        required: [true, 'Le sujet est requis'],
        trim: true,
    },
    sender: {
        type: String,
        required: [true, 'L\'expéditeur est requis'],
        trim: true,
    },
    recipient: {
        type: String,
        required: [true, 'Le destinataire est requis'],
        trim: true,
    },
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'processed', 'archived'],
        default: 'pending',
    },
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    processedAt: {
        type: Date,
    },
    notes: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

// Génération automatique de la référence avant sauvegarde
letterSchema.pre('save', async function (next) {
    if (!this.reference) {
        const year = new Date().getFullYear();
        const count = await mongoose.model('Letter').countDocuments();
        this.reference = `RH-${year}-${String(count + 1).padStart(5, '0')}`;
    }
    next();
});

// Index pour améliorer les performances
letterSchema.index({ reference: 1 });
letterSchema.index({ status: 1, createdAt: -1 });

const Letter = mongoose.model('Letter', letterSchema);

export default Letter;
