import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, File } from 'lucide-react';
import { documentsAPI, documentTypesAPI } from '../../config/api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import '../../components/super-admin/AdminModal.css';
import '../../components/scolarite/UploadDocumentModal.css';

const UploadGenericDocumentModal = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
    });

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await documentTypesAPI.getAll();
                const types = response.data.data || [];
                setDocumentTypes(types);
                if (types.length > 0) {
                    setFormData(prev => ({ ...prev, category: types[0].name }));
                }
            } catch (error) {
                console.error('Erreur chargement types:', error);
            }
        };
        if (isOpen) fetchTypes();
    }, [isOpen]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (selectedFile.size > 10 * 1024 * 1024) {
            toast.error('Fichier trop volumineux (max 10 MB)');
            return;
        }

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(selectedFile.type)) {
            toast.error('Format non autorisé. Seulement PDF, JPG, PNG');
            return;
        }

        setFile(selectedFile);
        // Auto-remplir le titre avec le nom du fichier si vide
        if (!formData.title) {
            setFormData(prev => ({
                ...prev,
                title: selectedFile.name.replace(/\.[^/.]+$/, '')
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) return toast.error('Veuillez sélectionner un fichier');
        if (!formData.title.trim()) return toast.error('Le titre est requis');
        if (!formData.category) return toast.error('Le type de document est requis');

        setLoading(true);
        try {
            const uploadData = new FormData();
            uploadData.append('file', file);
            uploadData.append('title', formData.title.trim());
            uploadData.append('category', formData.category);
            uploadData.append('description', formData.description);
            uploadData.append('service', user.service);
            uploadData.append('status', 'draft');

            await documentsAPI.upload(uploadData);
            toast.success('Document uploadé avec succès');
            handleClose();
            onSuccess();
        } catch (error) {
            console.error('Erreur:', error);
            if (error.code === 'ERR_CONNECTION_REFUSED' || error.message?.includes('timeout')) {
                toast.error('Fichier trop volumineux ou connexion trop lente. Réessayez avec un fichier plus léger.');
            } else {
                toast.error(error.message || 'Erreur lors de l\'upload');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setFormData({ title: '', category: '', description: '' });
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
                    <div className="modal-header" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}>
                        <div className="modal-header-content">
                            <div className="modal-header-icon">
                                <Upload size={24} />
                            </div>
                            <div className="modal-header-text">
                                <h2 className="modal-title">Ajouter un document</h2>
                                <p className="modal-subtitle">Service : {user?.service}</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="modal-close-btn">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="modal-form">
                        <div className="modal-section">

                            {/* Titre */}
                            <div className="input-wrapper">
                                <label className="input-label">
                                    Titre <span className="input-required">*</span>
                                </label>
                                <div className="input-container">
                                    <span className="input-icon input-icon--left">
                                        <FileText size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Titre du document"
                                        className="input input--with-left-icon"
                                    />
                                </div>
                            </div>

                            {/* Type de document */}
                            <div className="input-wrapper">
                                <label className="input-label">
                                    Type de document <span className="input-required">*</span>
                                </label>
                                <div className="input-container">
                                    <span className="input-icon input-icon--left">
                                        <FileText size={18} />
                                    </span>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        className="input input--with-left-icon modal-select"
                                    >
                                        {documentTypes.length === 0 ? (
                                            <option value="">Aucun type disponible</option>
                                        ) : (
                                            documentTypes.map(type => (
                                                <option key={type._id} value={type.name}>
                                                    {type.name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                                {documentTypes.length === 0 && (
                                    <p style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                                        Aucun type configuré. Contactez votre administrateur.
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="input-wrapper">
                                <label className="input-label">Description (optionnelle)</label>
                                <div className="input-container">
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="input service-textarea"
                                        placeholder="Description du document..."
                                        rows="2"
                                        style={{ paddingLeft: '1rem' }}
                                    />
                                </div>
                            </div>

                            {/* Upload fichier */}
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
                                                <p className="upload-file-subtext">PDF, JPG, PNG (max 10 MB)</p>
                                            </div>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <Button type="button" variant="secondary" size="medium" onClick={handleClose} fullWidth>
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="medium"
                                isLoading={loading}
                                disabled={!file || documentTypes.length === 0}
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

export default UploadGenericDocumentModal;