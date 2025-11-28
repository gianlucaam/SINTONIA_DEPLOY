import React, { useEffect } from 'react';
import '../css/ConfirmDeleteModal.css';

interface ConfirmDeleteModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ onConfirm, onCancel }) => {
    // Blocca lo scroll quando il modal è aperto
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleCancel = () => {
        document.body.style.overflow = 'unset';
        onCancel();
    };

    const handleConfirm = () => {
        document.body.style.overflow = 'unset';
        onConfirm();
    };

    return (
        <div className="confirm-modal-overlay">
            <div className="confirm-modal-box">
                <div className="confirm-modal-buttons">
                    <button
                        className="confirm-modal-btn cancel-btn"
                        onClick={handleCancel}
                    >
                        Annulla
                    </button>
                    <button
                        className="confirm-modal-btn delete-btn"
                        onClick={handleConfirm}
                    >
                        Elimina
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
