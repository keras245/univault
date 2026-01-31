import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const checkAndCreateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connecté');

        // Chercher l'utilisateur admin@unc.edu
        const admin = await User.findOne({ email: 'admin@unc.edu' });

        if (!admin) {
            console.log('❌ Aucun super-admin trouvé. Création...');

            const newAdmin = await User.create({
                email: 'admin@unc.edu',
                password: 'password123',
                firstName: 'Admin',
                lastName: 'UNC',
                service: 'Administration',
                role: 'super-admin',
                isActive: true
            });

            console.log('✅ Super-admin créé:', newAdmin.email);
        } else {
            console.log('📋 Super-admin existant:');
            console.log('   Email:', admin.email);
            console.log('   Rôle:', admin.role);
            console.log('   Actif:', admin.isActive);
            console.log('   Service:', admin.service);

            // Vérifier et corriger le rôle si nécessaire
            if (admin.role !== 'super-admin') {
                console.log('⚠️  Rôle incorrect, correction...');
                admin.role = 'super-admin';
                await admin.save();
                console.log('✅ Rôle corrigé en super-admin');
            }
        }

        await mongoose.connection.close();
        console.log('\n✅ Vérification terminée');
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
};

checkAndCreateAdmin();
