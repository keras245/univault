import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// Connexion à MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connecté');
    } catch (error) {
        console.error('❌ Erreur de connexion:', error.message);
        process.exit(1);
    }
};

// Schéma utilisateur (simplifié)
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    service: String,
    role: String,
    isActive: Boolean,
    createdAt: Date,
    updatedAt: Date,
});

const User = mongoose.model('User', userSchema);

// Créer un utilisateur de test
const createTestUser = async () => {
    try {
        await connectDB();

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email: 'admin@unc.edu' });

        if (existingUser) {
            console.log('⚠️  L\'utilisateur admin@unc.edu existe déjà !');
            console.log('📧 Email: admin@unc.edu');
            console.log('🔑 Mot de passe: password123');
            process.exit(0);
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // Créer l'utilisateur
        const user = await User.create({
            email: 'admin@unc.edu',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'UNC',
            service: 'Administration',
            role: 'super-admin',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log('');
        console.log('🎉 Utilisateur de test créé avec succès !');
        console.log('');
        console.log('╔═══════════════════════════════════════════╗');
        console.log('║   Credentials de Connexion                ║');
        console.log('╠═══════════════════════════════════════════╣');
        console.log('║  📧 Email:        admin@unc.edu           ║');
        console.log('║  🔑 Mot de passe: password123             ║');
        console.log('║  👤 Rôle:         super-admin             ║');
        console.log('║  🏢 Service:      Administration          ║');
        console.log('╚═══════════════════════════════════════════╝');
        console.log('');
        console.log('🌐 Allez sur http://localhost:5173/login');
        console.log('');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de la création:', error.message);
        process.exit(1);
    }
};

// Exécuter
createTestUser();
