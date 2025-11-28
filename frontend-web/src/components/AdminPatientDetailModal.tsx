import React, { useState, useEffect } from 'react';
import type { PatientData } from '../types/patient';
import { getPatientDetails, updatePatient } from '../services/patient.service';
import '../css/QuestionnaireDetailModal.css'; // Reuse existing styles

interface AdminPatientDetailModalProps {
    patient: PatientData | null;
    onClose: () => void;
    onUpdate?: () => void; // Callback to refresh list after update
}

const AdminPatientDetailModal: React.FC<AdminPatientDetailModalProps> = ({
    patient,
    onClose,
    onUpdate,
}) => {
    const [patientDetails, setPatientDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Editable fields
    const [editedEmail, setEditedEmail] = useState('');
    const [editedResidenza, setEditedResidenza] = useState('');
    const [editedPsicologo, setEditedPsicologo] = useState('');

    useEffect(() => {
        if (patient) {
            loadPatientDetails();
        }
    }, [patient]);

    const loadPatientDetails = async () => {
        if (!patient) return;

        setLoading(true);
        try {
            const details = await getPatientDetails(patient.idPaziente);
            setPatientDetails(details);
            // Initialize editable fields
            setEditedEmail(details.email || '');
            setEditedResidenza(details.residenza || '');
            setEditedPsicologo(details.idPsicologo || '');
        } catch (error) {
            console.error('Error loading patient details:', error);
            alert('Errore nel caricamento dei dettagli del paziente');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!patient || !patientDetails) return;

        setIsSaving(true);
        try {
            await updatePatient(patient.idPaziente, {
                email: editedEmail,
                residenza: editedResidenza,
                idPsicologo: editedPsicologo,
            });
            alert('Paziente aggiornato con successo!');
            setIsEditing(false);
            // Reload details
            await loadPatientDetails();
            // Notify parent to refresh list
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Error updating patient:', error);
            alert('Errore nell\'aggiornamento del paziente');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Reset to original values
        if (patientDetails) {
            setEditedEmail(patientDetails.email || '');
            setEditedResidenza(patientDetails.residenza || '');
            setEditedPsicologo(patientDetails.idPsicologo || '');
        }
        setIsEditing(false);
    };

    if (!patient) return null;

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return dateString;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-section">
                        <h2 className="modal-title">Dettagli Paziente</h2>
                    </div>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Chiudi">
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            Caricamento dettagli...
                        </div>
                    ) : patientDetails ? (
                        <>
                            {/* Main Info Section */}
                            <div className="questionnaire-info">
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>ID Paziente:</label>
                                        <span title={patientDetails.idPaziente}>
                                            {patientDetails.idPaziente.substring(0, 16)}...
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <label>Nome Completo:</label>
                                        <span>{patientDetails.nome} {patientDetails.cognome}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Codice Fiscale:</label>
                                        <span>{patientDetails.codFiscale}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Email:</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editedEmail}
                                                onChange={(e) => setEditedEmail(e.target.value)}
                                                style={{
                                                    padding: '6px 10px',
                                                    border: '2px solid #7FB77E',
                                                    borderRadius: '4px',
                                                    fontSize: '14px',
                                                    width: '100%'
                                                }}
                                            />
                                        ) : (
                                            <span>{patientDetails.email}</span>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <label>Data di Nascita:</label>
                                        <span>{formatDate(patientDetails.dataNascita)}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Data Ingresso:</label>
                                        <span>{formatDate(patientDetails.dataIngresso)}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Residenza:</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedResidenza}
                                                onChange={(e) => setEditedResidenza(e.target.value)}
                                                style={{
                                                    padding: '6px 10px',
                                                    border: '2px solid #7FB77E',
                                                    borderRadius: '4px',
                                                    fontSize: '14px',
                                                    width: '100%'
                                                }}
                                            />
                                        ) : (
                                            <span>{patientDetails.residenza}</span>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <label>Sesso:</label>
                                        <span>{patientDetails.sesso}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Psicologo Assegnato:</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedPsicologo}
                                                onChange={(e) => setEditedPsicologo(e.target.value)}
                                                placeholder="Codice Fiscale Psicologo"
                                                style={{
                                                    padding: '6px 10px',
                                                    border: '2px solid #7FB77E',
                                                    borderRadius: '4px',
                                                    fontSize: '14px',
                                                    width: '100%'
                                                }}
                                            />
                                        ) : (
                                            <span>{patientDetails.nomePsicologo || 'Non assegnato'}</span>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <label>Score:</label>
                                        <span className="score-value">
                                            {patientDetails.score !== null ? patientDetails.score : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <label>Priorità:</label>
                                        <span>{patientDetails.idPriorita || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            Errore nel caricamento dei dettagli
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {!loading && patientDetails && (
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '6px',
                                            border: '1px solid #ddd',
                                            background: '#fff',
                                            cursor: isSaving ? 'not-allowed' : 'pointer',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Annulla
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        style={{
                                            padding: '10px 20px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: '#7FB77E',
                                            color: '#fff',
                                            cursor: isSaving ? 'not-allowed' : 'pointer',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {isSaving ? 'Salvataggio...' : 'Salva Modifiche'}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: '#83B9C1',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ✏️ Modifica
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPatientDetailModal;
