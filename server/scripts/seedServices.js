import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/Service.js';

dotenv.config();

const services = [
    {
        name: 'Scolarité',
        code: 'SCOL',
        description: 'Service de gestion de la scolarité et des étudiants',
        isActive: true
    },
    {
        name: 'Comptabilité',
        code: 'COMPTA',
        description: 'Service de gestion comptable et financière',
        isActive: true
    },
    {
        name: 'Ressources Humaines',
        code: 'RH',
        description: 'Service de gestion des ressources humaines',
        isActive: true
    },
    {
        name: 'Génie Informatique',
        code: 'INFO',
        description: 'Département de génie informatique',
        isActive: true
    },
    {
        name: 'Droit',
        code: 'DROIT',
        description: 'Département de droit',
        isActive: true
    },
    {
        name: 'Administration',
        code: 'ADMIN',
        description: 'Service administratif général',
        isActive: true
    }
];

const seedServices = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB');

        // Vérifier si des services existent déjà
        const existingServices = await Service.countDocuments();
        
        if (existingServices > 0) {
            console.log(`ℹ️  ${existingServices} service(s) déjà existant(s)`);
            console.log('Voulez-vous les supprimer et réinitialiser ? (Ctrl+C pour annuler)');
            
            // Attendre 3 secondes avant de continuer
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            await Service.deleteMany({});
            console.log('🗑️  Services existants supprimés');
        }

        // Créer les services
        const createdServices = await Service.insertMany(services);
        console.log(`✅ ${createdServices.length} services créés avec succès !`);

        createdServices.forEach(service => {
            console.log(`   - ${service.name} (${service.code})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors du seed des services:', error);
        process.exit(1);
    }
};

seedServices();
