import mongoose from 'mongoose';
import DocumentType from '../models/DocumentType.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

await mongoose.connect(process.env.MONGODB_URI);

const types = [
    "Fiche d'inscription",
    "Fiche de réinscription",
    "Diplôme du bac",
    "Extrait de naissance",
    "Photo d'identité",
    "Certificat de scolarité",
    "Attestation",
    "Autre"
];

for (const name of types) {
    await DocumentType.updateOne(
        { name, service: 'Scolarité' },
        { $setOnInsert: { name, service: 'Scolarité', isActive: true } },
        { upsert: true }
    );
}

console.log('✅ Types de documents scolarité créés');
await mongoose.disconnect();