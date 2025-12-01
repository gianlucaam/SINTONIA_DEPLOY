import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/InitialQuestionnairesModal.css';

interface InitialQuestionnairesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InitialQuestionnairesModal: React.FC<InitialQuestionnairesModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleGoToQuestionnaires = () => {
        onClose();
        navigate('/questionari');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>⚠️ Screening Iniziale Incompleto</h2>
                </div>
                <div className="modal-body">
                    <p>
                        Per permetterci di valutare correttamente la tua condizione e fornirti
                        il supporto più adeguato, è necessario completare i <strong>4 questionari
                            iniziali</strong>:
                    </p>
                    <ul className="questionnaire-list">
                        <li>
                            <span className="questionnaire-icon">📋</span>
                            <strong>PHQ-9</strong> - Valutazione della depressione
                        </li>
                        <li>
                            <span className="questionnaire-icon">😰</span>
                            <strong>GAD-7</strong> - Valutazione dell'ansia
                        </li>
                        <li>
                            <span className="questionnaire-icon">😊</span>
                            <strong>WHO-5</strong> - Indice di benessere
                        </li>
                        <li>
                            <span className="questionnaire-icon">💭</span>
                            <strong>PC-PTSD-5</strong> - Screening stress post-traumatico
                        </li>
                    </ul>
                    <div className="warning-box">
                        <strong>⚠️ Importante:</strong> Senza questa compilazione non possiamo
                        avere uno screening completo per valutare la tua situazione e fornirti
                        il supporto personalizzato di cui hai bisogno.
                    </div>
                </div>
                <div className="modal-actions">
                    <button onClick={handleGoToQuestionnaires} className="btn-primary">
                        Vai ai Questionari
                    </button>
                    <button onClick={onClose} className="btn-secondary">
                        Ricordamelo dopo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InitialQuestionnairesModal;
