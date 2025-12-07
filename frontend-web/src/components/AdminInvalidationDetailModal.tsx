import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Hash, FileText, User, Clock, AlertCircle, CheckCircle, XCircle, MessageSquare, Check, X } from 'lucide-react';
import type { InvalidationRequestData } from '../types/invalidation';
import Toast from './Toast';
import '../css/Modal.css';

interface AdminInvalidationDetailModalProps {
    request: InvalidationRequestData | null;
    onClose: () => void;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
}

const AdminInvalidationDetailModal: React.FC<AdminInvalidationDetailModalProps> = ({
    request,
    onClose,
    onAccept,
    onReject,
}) => {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    if (!request) return null;

    const [isAccepting, setIsAccepting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    const isPending = request.stato === 'pending';

    const handleAccept = async () => {
        setIsAccepting(true);
        try {
            await onAccept(request.idRichiesta);
            setToast({ message: 'Richiesta accettata con successo', type: 'success' });
            setTimeout(() => onClose(), 1000);
        } catch (error) {
            console.error('Failed to accept invalidation request', error);
            setToast({ message: 'Errore durante l\'accettazione della richiesta', type: 'error' });
        } finally {
            setIsAccepting(false);
        }
    };

    const handleReject = async () => {
        setIsRejecting(true);
        try {
            await onReject(request.idRichiesta);
            setToast({ message: 'Richiesta rifiutata con successo', type: 'success' });
            setTimeout(() => onClose(), 1000);
        } catch (error) {
            console.error('Failed to reject invalidation request', error);
            setToast({ message: 'Errore durante il rifiuto della richiesta', type: 'error' });
        } finally {
            setIsRejecting(false);
        }
    };

    const getStatusInfo = (stato: string) => {
        switch (stato) {
            case 'pending':
                return { text: 'IN ATTESA', color: '#FFA726', icon: <Clock size={16} /> };
            case 'approved':
                return { text: 'APPROVATA', color: '#7FB77E', icon: <CheckCircle size={16} /> };
            case 'rejected':
                return { text: 'RIFIUTATA', color: '#E57373', icon: <XCircle size={16} /> };
            default:
                return { text: stato.toUpperCase(), color: '#999', icon: <AlertCircle size={16} /> };
        }
    };

    const statusInfo = getStatusInfo(request.stato);

    return ReactDOM.createPortal(
        <div className="modal-overlay-blur" onClick={onClose}>
            <div
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '1100px' }}
            >
                {/* Modern Header with Gradient */}
                <div className="modal-header-gradient">
                    <div className="modal-header-content">
                        <div className="modal-header-text">
                            <h2 className="modal-header-title">
                                Dettagli Richiesta Invalidazione
                            </h2>
                            <p className="modal-header-subtitle">
                                {request.nomeQuestionario}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="modal-close-btn-rounded"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Body with Modern Cards */}
                <div className="modal-body-gray modal-body-scrollable">
                    <div className="modal-info-grid">
                        {/* ID Questionario Card */}
                        <InfoCard
                            icon={<Hash size={16} />}
                            label="ID Questionario"
                            value={request.idQuestionario}
                            iconColor="#0D475D"
                        />

                        {/* Tipologia Card */}
                        <InfoCard
                            icon={<FileText size={16} />}
                            label="Tipologia"
                            value={request.nomeQuestionario}
                            iconColor="#83B9C1"
                        />

                        {/* Richiedente Card */}
                        <InfoCard
                            icon={<User size={16} />}
                            label="Richiedente"
                            value={request.nomePsicologoRichiedente}
                            iconColor="#5a9aa5"
                        />

                        {/* ID Psicologo Card */}
                        <InfoCard
                            icon={<User size={16} />}
                            label="ID Psicologo"
                            value={request.idPsicologoRichiedente}
                            iconColor="#7FB77E"
                        />

                        {/* Stato Richiesta Card */}
                        <InfoCard
                            icon={statusInfo.icon}
                            label="Stato Richiesta"
                            value={statusInfo.text}
                            iconColor={statusInfo.color}
                            valueColor={statusInfo.color}
                        />
                    </div>

                    {/* Note section */}
                    {request.note && (
                        <div className="modal-info-card" style={{ marginTop: '24px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #83B9C1 0%, #5a9aa5 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <MessageSquare size={20} />
                                </div>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    color: '#1a1a1a'
                                }}>Note Richiesta</h3>
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: '#666',
                                lineHeight: '1.6',
                                background: '#f8f9fa',
                                padding: '16px',
                                borderRadius: '12px',
                                borderLeft: '3px solid #83B9C1'
                            }}>
                                {request.note}
                            </div>
                        </div>
                    )}

                    {/* Action section for pending requests */}
                    {isPending && (
                        <div className="modal-info-card">
                            <h3 style={{
                                margin: '0 0 16px 0',
                                fontSize: '18px',
                                fontWeight: '700',
                                color: '#1a1a1a'
                            }}>Gestione Richiesta</h3>
                            <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
                                Questa richiesta è in attesa di approvazione. Puoi accettare o rifiutare la richiesta.
                            </p>
                            <div className="modal-footer-actions">
                                <button
                                    onClick={handleAccept}
                                    disabled={isAccepting || isRejecting}
                                    className="btn-modal-success"
                                    style={{
                                        flex: 1,
                                        opacity: (isAccepting || isRejecting) ? 0.6 : 1,
                                        cursor: (isAccepting || isRejecting) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <Check size={18} />
                                    {isAccepting ? 'Accettazione...' : 'Accetta'}
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={isAccepting || isRejecting}
                                    className="btn-modal-danger"
                                    style={{
                                        flex: 1,
                                        opacity: (isAccepting || isRejecting) ? 0.6 : 1,
                                        cursor: (isAccepting || isRejecting) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <X size={18} />
                                    {isRejecting ? 'Rifiuto...' : 'Rifiuta'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Message for already processed requests */}
                    {!isPending && (
                        <div className="modal-info-card">
                            <h3 style={{
                                margin: '0 0 16px 0',
                                fontSize: '18px',
                                fontWeight: '700',
                                color: '#1a1a1a'
                            }}>Stato Richiesta</h3>
                            <p style={{ marginBottom: '0', color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                                {request.stato === 'approved'
                                    ? 'Questa richiesta è stata approvata e il questionario è stato invalidato.'
                                    : 'Questa richiesta è stata rifiutata.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Modern Footer */}
                <div style={{
                    padding: '24px 32px',
                    background: 'white',
                    borderTop: '1px solid #e8e8e8'
                }}>
                    {/* Footer vuoto - chiusura solo tramite X in alto */}
                </div>
            </div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>,
        document.body
    );
};

// Info Card Component
const InfoCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    iconColor: string;
    valueColor?: string;
}> = ({ icon, label, value, iconColor, valueColor }) => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '14px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e8e8e8',
            transition: 'all 0.3s ease'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${iconColor} 0%, ${iconColor}dd 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    {icon}
                </div>
                <span style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {label}
                </span>
            </div>
            <p style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: '600',
                color: valueColor || '#1a1a1a'
            }}>
                {value}
            </p>
        </div>
    );
};

export default AdminInvalidationDetailModal;
