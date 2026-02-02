import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, File, Search, User } from 'lucide-react';
import { studentDocumentsAPI, studentsAPI } from '../../config/api';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Input from '../ui/Input';
import '../../components/super-admin/AdminModal.css';
import './UploadDocumentModal.css';

const UploadDocumentModal = ({ isOpen, onClose, studentId, onSuccess, showSearch = false }) => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        type: 'Fiche d\'inscription',
        note: ''
    });
    const [matricule, setMatricule] = useState('');
    const [student, setStudent] = useState(null);
    const [searching, setSearching] = useState(false);

    const documentTypes = [
        'Fiche d\'inscription',
        'Fiche de réinscription',
        'Diplôme du bac',
        'Extrait de naissance',
        'Photo d\'identité',
        'Certificat de scolarité',
        'Attestation',
        'Autre'
    ];

    const handleSearchStudent = async () => {
        if (!matricule.trim()) {
            toast.error('Veuillez saisir un matricule');
            return;
        }

        try {
            setSearching(true);
            console.log('🔍 Recherche matricule:', matricule.trim());
            
            const response = await studentsAPI.getAll({ search: matricule.trim() });
            const students = response.data.data || [];
            
            const found = students.find(s => s.matricule.trim() === matricule.trim());
            
            if (found) {
                setStudent(found);
                toast.success(`Étudiant trouvé: ${found.firstName} ${found.lastName}`);
            } else {
                toast.error(`Aucun étudiant avec le matricule: ${matricule.trim()}`);
                setStudent(null);
            }
        } catch (error) {
            console.error('❌ Erreur recherche:', error);
            toast.error('Erreur lors de la recherche');
            setStudent(null);
        } finally {
            setSearching(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) {
                toast.error('Le fichier est trop volumineux (max 10 MB)');
                return;
            }

            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(selectedFile.type)) {
                toast.error('Format non autorisé. Seulement PDF, JPG, PNG');
                return;
            }

            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const targetStudentId = showSearch ? student?._id : studentId;

        if (!targetStudentId) {
            toast.error('Veuillez rechercher un étudiant');
            return;
        }

        if (!file) {
            toast.error('Veuillez sélectionner un fichier');
            return;
        }

        setLoading(true);

        try {
            const uploadData = new FormData();
            uploadData.append('file', file);
            uploadData.append('type', formData.type);
            uploadData.append('note', formData.note);

            await studentDocumentsAPI.upload(targetStudentId, uploadData);
            toast.success('Document uploadé avec succès');
            
            // Reset
            setFile(null);
            setFormData({ type: 'Fiche d\'inscription', note: '' });
            if (showSearch) {
                setStudent(null);
                setMatricule('');
            }
            
            onSuccess();
        } catch (error) {
            console.error('Erreur:', error);
            toast.error(error.message || 'Erreur lors de l\'upload');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setFile(null);
        setFormData({ type: 'Fiche d\'inscription', note: '' });
        setStudent(null);
        setMatricule('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-backdrop">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="modal-overlay"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="modal-container"
                >
                    <div className="modal-header" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                        <div className="modal-header-content">
                            <div className="modal-header-icon">
                                <Upload size={24} />
                            </div>
                            <div className="modal-header-text">
                                <h2 className="modal-title">Ajouter un document</h2>
                                <p className="modal-subtitle">
                                    {showSearch ? 'Recherchez un étudiant et uploadez un document' : 'Uploader un nouveau document pour cet étudiant'}
                                </p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="modal-close-btn">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="modal-form">
                        <div className="modal-section">
                            {/* Recherche étudiant (si showSearch) */}
                            {showSearch && !student && (
                                <div className="input-wrapper">
                                    <label className="input-label">
                                        Matricule de l'étudiant <span className="input-required">*</span>
                                    </label>
                                    <div className="input-with-button">
                                        <div className="input-container" style={{ flex: 1 }}>
                                            <span className="input-icon input-icon--left">
                                                <Search size={18} />
                                            </span>
                                            <input
                                                type="text"
                                                value={matricule}
                                                onChange={(e) => setMatricule(e.target.value)}
                                                placeholder="Ex: 2100015"
                                                className="input input--with-left-icon"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={handleSearchStudent}
                                            disabled={searching}
                                        >
                                            {searching ? 'Recherche...' : 'Rechercher'}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Affichage étudiant trouvé */}
                            {showSearch && student && (
                                <div className="student-info-box">
                                    <User size={20} />
                                    <div style={{ flex: 1 }}>
                                        <p className="student-name">
                                            {student.firstName} {student.lastName}
                                        </p>
                                        <p className="student-matricule">Matricule: {student.matricule}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-text"
                                        onClick={() => {
                                            setStudent(null);
                                            setMatricule('');
                                        }}
                                    >
                                        Changer
                                    </button>
                                </div>
                            )}

                            {/* Formulaire document (visible si pas de recherche OU si étudiant trouvé) */}
                            {(!showSearch || student) && (
                                <>
                                    <div className="input-wrapper">
                                        <label className="input-label">
                                            Type de document <span className="input-required">*</span>
                                        </label>
                                        <div className="input-container">
                                            <span className="input-icon input-icon--left">
                                                <FileText size={18} />
                                            </span>
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                className="input input--with-left-icon modal-select"
                                            >
                                                {documentTypes.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="input-wrapper">
                                        <label className="input-label">Note (optionnelle)</label>
                                        <div className="input-container">
                                            <span className="input-icon input-icon--left">
                                                <FileText size={18} />
                                            </span>
                                            <textarea
                                                name="note"
                                                value={formData.note}
                                                onChange={handleChange}
                                                className="input input--with-left-icon service-textarea"
                                                placeholder="Ajouter une note ou description..."
                                                rows="2"
                                            />
                                        </div>
                                    </div>

                                    <div className="upload-file-zone">
                                        <label className="upload-file-label">
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={handleFileChange}
                                                className="upload-file-input"
                                            />
                                            <div className="upload-file-content">
                                                <File size={32} />
                                                {file ? (
                                                    <div>
                                                        <p className="upload-file-name">{file.name}</p>
                                                        <p className="upload-file-size">
                                                            {(file.size / 1024).toFixed(2)} KB
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="upload-file-text">Cliquez pour sélectionner un fichier</p>
                                                        <p className="upload-file-subtext">
                                                            PDF, JPG, PNG (max 10 MB)
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="modal-actions">
                            <Button
                                type="button"
                                variant="secondary"
                                size="medium"
                                onClick={handleClose}
                                fullWidth
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="medium"
                                isLoading={loading}
                                disabled={!file || (showSearch && !student)}
                                fullWidth
                                leftIcon={<Upload size={16} />}
                            >
                                Uploader
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UploadDocumentModal;
