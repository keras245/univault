import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Download, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { studentsAPI } from '../../config/api';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import '../../components/super-admin/AdminModal.css';
import './ImportExcelModal.css';

const ImportExcelModal = ({ isOpen, onClose, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls')) {
                setFile(droppedFile);
                setImportResult(null);
            } else {
                toast.error('Format invalide. Seulement .xlsx ou .xls acceptés');
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setImportResult(null);
        }
    };

    const handleDownloadTemplate = () => {
        // Créer un template Excel avec tabulations (plus compatible)
        const csvContent = 'Matricule\tNom\tPrénom\n2100245\tDUPONT\tJean\n2200156\tMARTIN\tMarie\n1400244\tBERNARD\tSophie';
        const blob = new Blob([csvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'template_import_etudiants.txt';
        link.click();
        toast.success('Template téléchargé ! Ouvrez-le avec Excel, il reconnaîtra automatiquement les colonnes.');
    };

    const handleImport = async () => {
        if (!file) {
            toast.error('Veuillez sélectionner un fichier');
            return;
        }

        setLoading(true);
        setImportResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await studentsAPI.importExcel(formData);
            setImportResult(response.data.data);
            
            if (response.data.data.imported > 0) {
                toast.success(`${response.data.data.imported} étudiant(s) importé(s) avec succès`);
            }

            if (response.data.data.errors > 0 || response.data.data.duplicates > 0) {
                toast('Import terminé avec des avertissements', { icon: '⚠️' });
            }

        } catch (error) {
            console.error('Erreur:', error);
            toast.error(error.message || 'Erreur lors de l\'import');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setImportResult(null);
        setDragActive(false);
        
        if (importResult && importResult.imported > 0) {
            onSuccess();
        } else {
            onClose();
        }
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
                    className="modal-container modal-container--large"
                >
                    <div className="modal-header" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                        <div className="modal-header-content">
                            <div className="modal-header-icon">
                                <Upload size={24} />
                            </div>
                            <div className="modal-header-text">
                                <h2 className="modal-title">Importer des étudiants</h2>
                                <p className="modal-subtitle">
                                    Importer depuis un fichier Excel (.xlsx, .xls)
                                </p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="modal-close-btn">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="modal-form">
                        {!importResult ? (
                            <>
                                {/* Zone de téléchargement template */}
                                <div className="import-template">
                                    <p className="import-template-text">
                                        <strong>Instructions importantes :</strong>
                                    </p>
                                    <ul className="import-instructions">
                                        <li>1. Téléchargez le template</li>
                                        <li>2. Ouvrez-le avec <strong>Excel</strong> (il reconnaîtra les 3 colonnes automatiquement)</li>
                                        <li>3. <strong>NE TOUCHEZ PAS</strong> aux noms des colonnes : Matricule, Nom, Prénom</li>
                                        <li>4. Remplissez vos données (matricule = 5 ou 7 chiffres)</li>
                                        <li>5. <strong>Sauvegardez en Excel (.xlsx)</strong> puis importez</li>
                                    </ul>
                                    <Button
                                        variant="secondary"
                                        size="medium"
                                        onClick={handleDownloadTemplate}
                                        leftIcon={<Download size={18} />}
                                    >
                                        Télécharger le template
                                    </Button>
                                </div>

                                {/* Zone de drop */}
                                <div
                                    className={`import-dropzone ${dragActive ? 'import-dropzone--active' : ''}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <FileText size={48} className="import-dropzone-icon" />
                                    {file ? (
                                        <div className="import-file-selected">
                                            <p className="import-file-name">{file.name}</p>
                                            <p className="import-file-size">
                                                {(file.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="import-dropzone-text">
                                                Glissez-déposez votre fichier ici
                                            </p>
                                            <p className="import-dropzone-subtext">
                                                Format accepté : Excel (.xlsx, .xls) ou CSV
                                            </p>
                                            <p className="import-dropzone-subtext">ou</p>
                                            <label className="import-file-label">
                                                <input
                                                    type="file"
                                                    accept=".xlsx,.xls,.csv,.txt"
                                                    onChange={handleFileChange}
                                                    className="import-file-input"
                                                />
                                                <span>Parcourir les fichiers</span>
                                            </label>
                                        </>
                                    )}
                                </div>

                                {/* Actions */}
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
                                        type="button"
                                        variant="primary"
                                        size="medium"
                                        onClick={handleImport}
                                        isLoading={loading}
                                        disabled={!file}
                                        fullWidth
                                        leftIcon={<Upload size={16} />}
                                    >
                                        Importer
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Résultats d'import */}
                                <div className="import-results">
                                    <div className="import-result-summary">
                                        <div className="import-result-item import-result-item--success">
                                            <CheckCircle size={20} />
                                            <span>{importResult.imported} importé(s)</span>
                                        </div>
                                        {importResult.duplicates > 0 && (
                                            <div className="import-result-item import-result-item--warning">
                                                <AlertCircle size={20} />
                                                <span>{importResult.duplicates} doublon(s)</span>
                                            </div>
                                        )}
                                        {importResult.errors > 0 && (
                                            <div className="import-result-item import-result-item--error">
                                                <XCircle size={20} />
                                                <span>{importResult.errors} erreur(s)</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Détails */}
                                    {importResult.details && (
                                        <div className="import-details">
                                            {importResult.details.duplicates.length > 0 && (
                                                <div className="import-detail-section">
                                                    <h3>Doublons ignorés</h3>
                                                    <ul>
                                                        {importResult.details.duplicates.map((dup, i) => (
                                                            <li key={i}>
                                                                Ligne {dup.line}: {dup.matricule} - {dup.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {importResult.details.errors.length > 0 && (
                                                <div className="import-detail-section import-detail-section--error">
                                                    <h3>Erreurs</h3>
                                                    <ul>
                                                        {importResult.details.errors.map((err, i) => (
                                                            <li key={i}>
                                                                Ligne {err.line}: {err.matricule} - {err.error}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="modal-actions">
                                    <Button
                                        type="button"
                                        variant="primary"
                                        size="medium"
                                        onClick={handleClose}
                                        fullWidth
                                    >
                                        Fermer
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ImportExcelModal;
