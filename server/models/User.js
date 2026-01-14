import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email invalide'],
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
        select: false, // Ne pas retourner le mot de passe par défaut
    },
    firstName: {
        type: String,
        required: [true, 'Le prénom est requis'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Le nom est requis'],
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
    role: {
        type: String,
        enum: ['user', 'admin', 'super-admin'],
        default: 'user',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
    },
}, {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
});

// Hash le mot de passe avant sauvegarde
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour obtenir les infos publiques de l'utilisateur
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;
