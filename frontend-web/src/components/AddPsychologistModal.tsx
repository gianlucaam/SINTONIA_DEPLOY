import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import '../css/AddPsychologistModal.css';

interface PsychologistFormData {
    codiceFiscale: string;
    nome: string;
    cognome: string;
    aslAppartenenza: string;
    stato: 'Attivo' | 'Disattivato';
}

interface AddPsychologistModalProps {
    onClose: () => void;
    onAdd: (psychologist: PsychologistFormData) => void;
}

const AddPsychologistModal: React.FC<AddPsychologistModalProps> = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState<PsychologistFormData>({
        codiceFiscale: '',
        nome: '',
        cognome: '',
        aslAppartenenza: '',
        stato: 'Attivo'
    });

    const [errors, setErrors] = useState<Partial<Record<keyof PsychologistFormData, string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name as keyof PsychologistFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof PsychologistFormData, string>> = {};

        if (!formData.codiceFiscale.trim()) {
            newErrors.codiceFiscale = 'Il codice fiscale è obbligatorio';
        } else if (formData.codiceFiscale.length !== 16) {
            newErrors.codiceFiscale = 'Il codice fiscale deve essere di 16 caratteri';
        }

        if (!formData.nome.trim()) {
            newErrors.nome = 'Il nome è obbligatorio';
        }

        if (!formData.cognome.trim()) {
            newErrors.cognome = 'Il cognome è obbligatorio';
        }

        if (!formData.aslAppartenenza.trim()) {
            newErrors.aslAppartenenza = 'L\'ASL di appartenenza è obbligatoria';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onAdd(formData);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="add-psychologist-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-section">
                        <UserPlus size={24} className="modal-icon" />
                        <h2>Aggiungi Nuovo Psicologo</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="psychologist-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nome">
                                Nome <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Inserisci il nome"
                                className={errors.nome ? 'error' : ''}
                            />
                            {errors.nome && (
                                <span className="error-message">{errors.nome}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="cognome">
                                Cognome <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="cognome"
                                name="cognome"
                                value={formData.cognome}
                                onChange={handleChange}
                                placeholder="Inserisci il cognome"
                                className={errors.cognome ? 'error' : ''}
                            />
                            {errors.cognome && (
                                <span className="error-message">{errors.cognome}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="codiceFiscale">
                                Codice Fiscale <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="codiceFiscale"
                                name="codiceFiscale"
                                value={formData.codiceFiscale}
                                onChange={handleChange}
                                maxLength={16}
                                placeholder="16 caratteri"
                                className={errors.codiceFiscale ? 'error' : ''}
                            />
                            {errors.codiceFiscale && (
                                <span className="error-message">{errors.codiceFiscale}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="aslAppartenenza">
                                ASL di Appartenenza <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="aslAppartenenza"
                                name="aslAppartenenza"
                                value={formData.aslAppartenenza}
                                onChange={handleChange}
                                placeholder="Es: ASL Roma 1"
                                className={errors.aslAppartenenza ? 'error' : ''}
                            />
                            {errors.aslAppartenenza && (
                                <span className="error-message">{errors.aslAppartenenza}</span>
                            )}
                        </div>
                    </div>



                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Annulla
                        </button>
                        <button type="submit" className="submit-btn">
                            <UserPlus size={18} />
                            Aggiungi Psicologo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPsychologistModal;
