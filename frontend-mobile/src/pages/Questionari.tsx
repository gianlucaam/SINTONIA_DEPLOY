import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import '../css/Questionari.css';

// Mock data per i questionari - da sostituire con chiamate API in futuro
interface Questionario {
    id: number;
    titolo: string;
    descrizione: string;
    scadenza?: string;
    dataCompletamento?: string;
}

const questionariDaCompilare: Questionario[] = [
    {
        id: 1,
        titolo: "WHO-5",
        descrizione: "Inserito il 15/12/2025. Clicca per Compilare!",
        scadenza: "31 Nov 2025"
    },
    {
        id: 2,
        titolo: "GAD-7",
        descrizione: "Inserito il 10/12/2025. Clicca per Compilare!",
        scadenza: "3 Dic 2025"
    }
];

const questionariCompletati: Questionario[] = [
    {
        id: 3,
        titolo: "PHQ-9",
        descrizione: "Compilato il 15/12/2025.",
        dataCompletamento: "15/12/2025"
    },
    {
        id: 4,
        titolo: "K10",
        descrizione: "Compilato il 10/12/2025.",
        dataCompletamento: "10/12/2025"
    }
];

const Questionari: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="questionari-page">
            <div className="questionari-header">
                <button className="back-button" onClick={() => navigate('/home')}>
                    <ArrowLeft size={20} />
                </button>
                <h1>Questionari</h1>
            </div>

            <div className="questionari-content">
                {/* Sezione Questionari da Compilare */}
                {questionariDaCompilare.length > 0 && (
                    <section className="questionari-section">
                        <div className="questionari-divider">
                            <span className="divider-text">Da Compilare</span>
                        </div>
                        <div className="questionari-list">
                            {questionariDaCompilare.map((q) => (
                                <div key={q.id} className="questionario-card">
                                    <div className="card-header">
                                        <h3>{q.titolo}</h3>
                                    </div>
                                    <p className="descrizione">{q.descrizione}</p>
                                    <div className="card-footer">
                                        <button className="compila-button">Compila ora</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Sezione Questionari Completati */}
                {questionariCompletati.length > 0 && (
                    <section className="questionari-section">
                        <div className="questionari-divider">
                            <span className="divider-text">Completati</span>
                        </div>
                        <div className="questionari-list">
                            {questionariCompletati.map((q) => (
                                <div key={q.id} className="questionario-card completato">
                                    <div className="card-header">
                                        <h3>{q.titolo}</h3>
                                    </div>
                                    <p className="descrizione">{q.descrizione}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <BottomNavigation />
        </div>
    );
};

export default Questionari;
