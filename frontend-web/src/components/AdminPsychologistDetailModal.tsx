import React, { useState } from 'react';
import '../css/QuestionnaireDetailModal.css'; // Reuse existing styles

interface PsychologistData {
    codiceFiscale: string;
    nome: string;
    cognome: string;
    aslAppartenenza: string;
    stato: 'Attivo' | 'Disattivato';
}

interface AdminPsychologistDetailModalProps {
    psychologist: PsychologistData | null;
    onClose: () => void;
    onUpdate?: () => void; // Callback to refresh list after update
}

// Lista ASL disponibili (mock)
const ASL_OPTIONS = [
    'ASL Roma 1',
    'ASL Roma 2',
    'ASL Milano 1',
    'ASL Milano 2',
    'ASL Napoli 1',
    'ASL Napoli 2',
    'ASL Torino 1',
    'ASL Torino 2',
    'ASL Torino 3',
    'ASL Bologna',
    'ASL Firenze',
    'ASL Genova',
    'ASL Venezia',
    'ASL Verona',
    'ASL Palermo 1',
    'ASL Palermo 2',
    'ASL Bari',
    'ASL Catania',
];

const AdminPsychologistDetailModal: React.FC<AdminPsychologistDetailModalProps> = ({
    psychologist,
    onClose,
    onUpdate,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Editable fields
    const [editedStato, setEditedStato] = useState<'Attivo' | 'Disattivato'>(psychologist?.stato || 'Attivo');
    const [editedAsl, setEditedAsl] = useState(psychologist?.aslAppartenenza || '');

    React.useEffect(() => {
        if (psychologist) {
            setEditedStato(psychologist.stato);
            setEditedAsl(psychologist.aslAppartenenza);
        }
    }, [psychologist]);

    const handleSave = async () => {
        if (!psychologist) return;

        setIsSaving(true);

        // Simula salvataggio (in futuro sarà una chiamata API)
        setTimeout(() => {
            alert(`Psicologo aggiornato:\n- Stato: ${editedStato}\n- ASL: ${editedAsl}\n\n(Nota: Modifiche solo simulate, nessun backend)`);
            setIsSaving(false);
            setIsEditing(false);

            // Refresh list if callback provided
            if (onUpdate) {
                onUpdate();
            }
        }, 500);
    };

    const handleCancel = () => {
        // Reset to original values
        if (psychologist) {
            setEditedStato(psychologist.stato);
            setEditedAsl(psychologist.aslAppartenenza);
        }
        setIsEditing(false);
    };

    if (!psychologist) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-section">
                        <h2 className="modal-title">Dettagli Psicologo</h2>
                    </div>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Chiudi">
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    <div className="questionnaire-info">
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Codice Fiscale:</label>
                                <span>{psychologist.codiceFiscale}</span>
                            </div>
                            <div className="info-item">
                                <label>Nome:</label>
                                <span>{psychologist.nome}</span>
                            </div>
                            <div className="info-item">
                                <label>Cognome:</label>
                                <span>{psychologist.cognome}</span>
                            </div>
                            <div className="info-item">
                                <label>ASL Appartenenza:</label>
                                {isEditing ? (
                                    <select
                                        value={editedAsl}
                                        onChange={(e) => setEditedAsl(e.target.value)}
                                        style={{
                                            padding: '8px 12px',
                                            border: '2px solid #7FB77E',
                                            borderRadius: '4px',
                                            fontSize: '14px',
                                            width: '100%',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {ASL_OPTIONS.map(asl => (
                                            <option key={asl} value={asl}>{asl}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span>{psychologist.aslAppartenenza}</span>
                                )}
                            </div>
                            <div className="info-item">
                                <label>Stato:</label>
                                {isEditing ? (
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <label style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}>
                                            <input
                                                type="radio"
                                                value="Attivo"
                                                checked={editedStato === 'Attivo'}
                                                onChange={() => setEditedStato('Attivo')}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: '#d4edda',
                                                color: '#155724',
                                                fontWeight: 'bold'
                                            }}>
                                                Attivo
                                            </span>
                                        </label>
                                        <label style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                        }}>
                                            <input
                                                type="radio"
                                                value="Disattivato"
                                                checked={editedStato === 'Disattivato'}
                                                onChange={() => setEditedStato('Disattivato')}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                backgroundColor: '#f8d7da',
                                                color: '#721c24',
                                                fontWeight: 'bold'
                                            }}>
                                                Disattivato
                                            </span>
                                        </label>
                                    </div>
                                ) : (
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        backgroundColor: psychologist.stato === 'Attivo' ? '#d4edda' : '#f8d7da',
                                        color: psychologist.stato === 'Attivo' ? '#155724' : '#721c24'
                                    }}>
                                        {psychologist.stato}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
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
                </div>
            </div>
        </div>
    );
};

export default AdminPsychologistDetailModal;
