import Student from '../models/Student.js';
import StudentDocument from '../models/StudentDocument.js';
import xlsx from 'xlsx';

/**
 * @route   GET /api/students
 * @desc    Obtenir la liste des étudiants avec recherche
 * @access  Private (Scolarité uniquement)
 */
export const getStudents = async (req, res) => {
    try {
        const { search, page = 1, limit = 50 } = req.query;

        const filter = {};

        // FILTRAGE PAR SERVICE (admin et user uniquement)
        if (req.user.role !== 'super-admin') {
            filter.service = req.user.service;
        }

        if (search) {
            filter.$or = [
                { matricule: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const students = await Student.find(filter)
            .populate('createdBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Compter les documents pour chaque étudiant
        const studentsWithDocCount = await Promise.all(
            students.map(async (student) => {
                const docCount = await StudentDocument.countDocuments({ student: student._id });
                return {
                    ...student.toObject(),
                    documentCount: docCount
                };
            })
        );

        const total = await Student.countDocuments(filter);

        res.json({
            success: true,
            data: studentsWithDocCount,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Erreur getStudents:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des étudiants',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/students/:id
 * @desc    Obtenir un étudiant par ID avec ses documents
 * @access  Private (Scolarité uniquement)
 */
export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate('createdBy', 'firstName lastName');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Étudiant non trouvé'
            });
        }

        // Récupérer les documents de l'étudiant
        const documents = await StudentDocument.find({ student: student._id })
            .populate('uploadedBy', 'firstName lastName')
            .sort({ uploadedAt: -1 });

        res.json({
            success: true,
            data: {
                ...student.toObject(),
                documents
            }
        });
    } catch (error) {
        console.error('Erreur getStudentById:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'étudiant',
            error: error.message
        });
    }
};

export const getAllStudentsDocuments = async (req, res) => {
    try {
        const { search, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (req.user.role !== 'super-admin') {
            filter.service = req.user.service;
        }

        if (search) {
            filter.$or = [
                { matricule: { $regex: search, $options: 'i'}},
                { firstName: { $regex: search, $options: 'i'}},
                { lastName: { $regex: search, $options: 'i'}}
            ];
        }

        const students = await Student.find(filter, '_id');
        const studentIds = students.map(s => s._id);

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [documents, total] = await Promise.all([
            StudentDocument.find({ student: { $in: studentIds } }).
            populate('student', 'matricule firstName lastName service')
            .populate('uploadedBy', 'firstName lastName')
            .sort({ uploadedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
            StudentDocument.countDocuments({ student: { $in: studentIds } })
        ]);


        res.json({
            success: true,
            data: documents,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Erreur lors de la récupération de tous les étudiants : ', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des documents : ',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/students
 * @desc    Créer un nouvel étudiant
 * @access  Private (Admin Scolarité uniquement)
 */
export const createStudent = async (req, res) => {
    try {
        const { matricule, firstName, lastName } = req.body;

        // Vérifier si le matricule existe déjà
        const existingStudent = await Student.findOne({ matricule });
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Ce matricule existe déjà'
            });
        }

        const student = await Student.create({
            matricule,
            firstName,
            lastName,
            service: 'Scolarité',
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Étudiant créé avec succès',
            data: student
        });
    } catch (error) {
        console.error('Erreur createStudent:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de l\'étudiant',
            error: error.message
        });
    }
};

/**
 * @route   PUT /api/students/:id
 * @desc    Mettre à jour un étudiant
 * @access  Private (Admin Scolarité uniquement)
 */
export const updateStudent = async (req, res) => {
    try {
        const { matricule, firstName, lastName } = req.body;

        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Étudiant non trouvé'
            });
        }

        // Vérifier si le nouveau matricule existe déjà (si changé)
        if (matricule && matricule !== student.matricule) {
            const existingStudent = await Student.findOne({ matricule });
            if (existingStudent) {
                return res.status(400).json({
                    success: false,
                    message: 'Ce matricule existe déjà'
                });
            }
            student.matricule = matricule;
        }

        if (firstName) student.firstName = firstName;
        if (lastName) student.lastName = lastName;

        await student.save();

        res.json({
            success: true,
            message: 'Étudiant mis à jour avec succès',
            data: student
        });
    } catch (error) {
        console.error('Erreur updateStudent:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour de l\'étudiant',
            error: error.message
        });
    }
};

/**
 * @route   DELETE /api/students/:id
 * @desc    Supprimer un étudiant et ses documents
 * @access  Private (Admin Scolarité uniquement)
 */
export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Étudiant non trouvé'
            });
        }

        // Supprimer tous les documents de l'étudiant
        // TODO: Supprimer aussi les fichiers de Cloudinary
        await StudentDocument.deleteMany({ student: student._id });

        await student.deleteOne();

        res.json({
            success: true,
            message: 'Étudiant et ses documents supprimés avec succès'
        });
    } catch (error) {
        console.error('Erreur deleteStudent:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'étudiant',
            error: error.message
        });
    }
};

/**
 * @route   POST /api/students/import
 * @desc    Importer des étudiants depuis un fichier Excel
 * @access  Private (Admin Scolarité uniquement)
 */
export const importStudents = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Aucun fichier fourni'
            });
        }

        // Lire le fichier Excel
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let data = xlsx.utils.sheet_to_json(worksheet);

        console.log('📊 Fichier Excel parsé:');
        console.log('Total lignes:', data.length);
        if (data.length > 0) {
            console.log('Clés détectées:', Object.keys(data[0]));
            console.log('Première ligne:', data[0]);
        }

        // CORRECTION : Si tout est dans une seule colonne, parser manuellement
        const firstKey = Object.keys(data[0])[0];
        if (firstKey && firstKey.includes(',')) {
            console.log('⚠️ Détection: colonnes non séparées, parsing manuel...');
            data = data.map(row => {
                const value = row[firstKey];
                if (typeof value === 'string' && value.includes(',')) {
                    const parts = value.split(',').map(p => p.trim());
                    return {
                        Matricule: parts[0] || '',
                        Nom: parts[1] || '',
                        Prénom: parts[2] || ''
                    };
                }
                return row;
            });
            console.log('✅ Après parsing manuel:', data[0]);
        }

        const results = {
            success: [],
            duplicates: [],
            errors: []
        };

        // Traiter chaque ligne
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const lineNumber = i + 2; // +2 car ligne 1 = header, index commence à 0

            try {
                // Afficher les clés disponibles pour déboguer
                console.log(`Ligne ${lineNumber} - Clés:`, Object.keys(row), '- Valeurs:', row);

                // Gérer différentes variations des noms de colonnes
                const matricule = (row.Matricule || row.matricule || row.MATRICULE || row['Matricule '] || row[' Matricule'] || '');
                const firstName = (row.Prénom || row.Prenom || row.prénom || row.prenom || row.PRENOM || row['Prénom '] || row[' Prénom'] || '');
                const lastName = (row.Nom || row.nom || row.NOM || row['Nom '] || row[' Nom'] || '');

                const cleanMatricule = matricule ? String(matricule).trim() : '';
                const cleanFirstName = firstName ? String(firstName).trim() : '';
                const cleanLastName = lastName ? String(lastName).trim() : '';

                console.log(`Ligne ${lineNumber} - Données extraites:`, { 
                    matricule: cleanMatricule, 
                    firstName: cleanFirstName, 
                    lastName: cleanLastName 
                });

                // Validation
                if (!cleanMatricule || !cleanFirstName || !cleanLastName) {
                    results.errors.push({
                        line: lineNumber,
                        matricule: cleanMatricule,
                        error: `Champs obligatoires manquants (Matricule: ${cleanMatricule ? 'OK' : 'VIDE'}, Nom: ${cleanLastName ? 'OK' : 'VIDE'}, Prénom: ${cleanFirstName ? 'OK' : 'VIDE'})`
                    });
                    continue;
                }

                // Valider format matricule
                if (!/^\d{5}$/.test(cleanMatricule) && !/^\d{7}$/.test(cleanMatricule)) {
                    results.errors.push({
                        line: lineNumber,
                        matricule: cleanMatricule,
                        error: 'Format matricule invalide (5 ou 7 chiffres requis)'
                    });
                    continue;
                }

                // Vérifier si existe déjà
                const existing = await Student.findOne({ matricule: cleanMatricule });
                if (existing) {
                    results.duplicates.push({
                        line: lineNumber,
                        matricule: cleanMatricule,
                        name: `${cleanFirstName} ${cleanLastName}`
                    });
                    continue;
                }

                // Créer l'étudiant
                const student = await Student.create({
                    matricule: cleanMatricule,
                    firstName: cleanFirstName,
                    lastName: cleanLastName,
                    service: 'Scolarité',
                    createdBy: req.user._id
                });

                results.success.push({
                    line: lineNumber,
                    matricule: cleanMatricule,
                    name: `${cleanFirstName} ${cleanLastName}`
                });

            } catch (error) {
                console.error(`Erreur ligne ${lineNumber}:`, error);
                results.errors.push({
                    line: lineNumber,
                    matricule: row.Matricule || row.matricule || 'N/A',
                    error: error.message
                });
            }
        }

        console.log('✅ Résultats import:', {
            success: results.success.length,
            duplicates: results.duplicates.length,
            errors: results.errors.length
        });

        res.json({
            success: true,
            message: 'Import terminé',
            data: {
                total: data.length,
                imported: results.success.length,
                duplicates: results.duplicates.length,
                errors: results.errors.length,
                details: results
            }
        });

    } catch (error) {
        console.error('Erreur importStudents:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'import',
            error: error.message
        });
    }
};

/**
 * @route   GET /api/students/stats
 * @desc    Obtenir les statistiques des étudiants
 * @access  Private (Scolarité uniquement)
 */
export const getStudentStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalDocuments = await StudentDocument.countDocuments();

        // Étudiants par année (basé sur matricule)
        const students = await Student.find({}, 'matricule');
        const byYear = {};

        students.forEach(student => {
            const matricule = student.matricule;
            let year;

            if (matricule.length === 5) {
                // Format 2009-2011: 90323 -> 09 -> 2009
                const prefix = matricule.substring(0, 2);
                year = `20${prefix}`;
            } else if (matricule.length === 7) {
                // Format 2012+: 2100245 -> 21 -> 2021
                const prefix = matricule.substring(0, 2);
                year = `20${prefix}`;
            }

            if (year) {
                byYear[year] = (byYear[year] || 0) + 1;
            }
        });

        res.json({
            success: true,
            data: {
                totalStudents,
                totalDocuments,
                studentsByYear: byYear
            }
        });
    } catch (error) {
        console.error('Erreur getStudentStats:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques',
            error: error.message
        });
    }
};


