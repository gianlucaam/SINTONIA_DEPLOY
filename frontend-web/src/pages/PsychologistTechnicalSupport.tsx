import React, { useState } from 'react';
import { Send, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Toast from '../components/Toast';
import '../css/PsychologistTechnicalSupport.css';

interface SupportTicket {
    id: string;
    subject: string;
    date: string;
    status: 'aperto' | 'in-lavorazione' | 'risolto' | 'chiuso';
}

// Mock history data
const MOCK_HISTORY: SupportTicket[] = [
    {
        id: 'TKT-2024-001',
        subject: 'Problema visualizzazione questionari',
        date: '2024-12-01',
        status: 'in-lavorazione'
    },
    {
        id: 'TKT-2024-005',
        subject: 'Richiesta informazioni su export dati',
        date: '2024-11-28',
        status: 'risolto'
    }
];

const PsychologistTechnicalSupport: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [history, setHistory] = useState<SupportTicket[]>(MOCK_HISTORY);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !description.trim()) return;

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            const newTicket: SupportTicket = {
                id: `TKT-2024-${Math.floor(Math.random() * 1000)}`,
                subject: subject,
                date: new Date().toISOString().split('T')[0],
                status: 'aperto'
            };

            setHistory([newTicket, ...history]);
            setSubject('');
            setDescription('');
            setIsSubmitting(false);
            setToast({
                message: 'Richiesta di supporto inviata con successo!',
                type: 'success'
            });
        }, 1500);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'aperto': return <AlertCircle size={16} />;
            case 'in-lavorazione': return <Clock size={16} />;
            case 'risolto': return <CheckCircle size={16} />;
            default: return <MessageSquare size={16} />;
        }
    };

    return (
        <div className="content-panel">
            <div className="support-page-header" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', color: 'var(--color-teal-dark)', marginBottom: '8px' }}>
                    Supporto Tecnico
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px' }}>
                    Hai riscontrato un problema? Invia una richiesta al nostro team di supporto.
                </p>
            </div>

            <div className="psychologist-support-container">
                <div className="support-form-card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Oggetto della richiesta</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Es. Errore nel caricamento pazienti..."
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Descrizione dettagliata</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Descrivi il problema riscontrato, includendo eventuali messaggi di errore..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isSubmitting || !subject || !description}
                            >
                                <Send size={18} />
                                {isSubmitting ? 'Invio in corso...' : 'Invia Richiesta'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="support-history">
                    <div className="history-title">
                        <MessageSquare size={24} color="var(--color-teal-medium)" />
                        Le tue richieste recenti
                    </div>

                    <div className="history-list">
                        {history.map((ticket) => (
                            <div key={ticket.id} className="ticket-card">
                                <div className="ticket-info">
                                    <h4>{ticket.subject}</h4>
                                    <div className="ticket-meta">
                                        <span>ID: {ticket.id}</span>
                                        <span>•</span>
                                        <span>{ticket.date}</span>
                                    </div>
                                </div>
                                <div className={`ticket-status status-${ticket.status}`}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {getStatusIcon(ticket.status)}
                                        {ticket.status.replace('-', ' ')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default PsychologistTechnicalSupport;
