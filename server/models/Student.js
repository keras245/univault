import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    matricule: {
        type: String,
        required: [true, 'Le matricule est requis'],
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                // Format 5 chiffres (2009-2011) ou 7 chiffres (2012+)
                return /^\d{5}$/.test(v) || /^\d{7}$/.test(v);
            },
            message: 'Le matricule doit contenir 5 ou 7 chiffres uniquement'
        }
    },
    firstName: {
        type: String,
        required: [true, 'Le prénom est requis'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true
    },
    service: {
        type: String,
        required: false,
        default: 'Scolarité',
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index pour recherche rapide
studentSchema.index({ matricule: 1 });
studentSchema.index({ firstName: 1, lastName: 1 });
studentSchema.index({ createdBy: 1 });

// Méthode virtuelle pour le nom complet
studentSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Inclure les virtuals dans toJSON
studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

const Student = mongoose.model('Student', studentSchema);

export default Student;
