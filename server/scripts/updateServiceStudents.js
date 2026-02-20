import mongoose from 'mongoose';
import Student from '../models/Student.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

await mongoose.connect(process.env.MONGODB_URI); // 👈 corrigé

const result = await Student.updateMany(
    { $or: [{ service: null }, { service: '' }, { service: { $exists: false } }] },
    { $set: { service: 'Scolarité' } }
);

console.log(`✅ ${result.modifiedCount} étudiants mis à jour`);
await mongoose.disconnect();