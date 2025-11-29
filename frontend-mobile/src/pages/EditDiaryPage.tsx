import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LeftArrow from '../assets/icons/LeftArrow.svg';
import '../css/EditDiaryPage.css';

interface LocationState {
    page: {
        id: string;
        title: string;
        content: string;
    };
}

const EditDiaryPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const maxContentLength = 2000;

    useEffect(() => {
        if (state?.page) {
            setTitle(state.page.title);
            setContent(state.page.content);
        } else {
            // Se non ci sono dati, torna al diario
            navigate('/diary');
        }
    }, [state, navigate]);

    const handleBack = () => {
        navigate('/diary');
    };

    const handleSubmit = () => {
        // TODO: Implementare salvataggio con backend
        // Per ora usa dati mock
        console.log('Updating diary page:', { id: state.page.id, title, content });

        // Mock: simula salvataggio e torna al diario
        alert('Pagina modificata con successo!');
        navigate('/diary');
    };

    const isFormValid = title.trim().length > 0 && content.trim().length > 0;

    return (
        <div className="edit-diary-page">
            <div className="edit-diary-header">
                <button className="back-button" onClick={handleBack} aria-label="Indietro">
                    <img src={LeftArrow} alt="" />
                </button>
                <h1 className="page-subtitle">Indietro</h1>
            </div>

            <div className="edit-diary-content">
                <h2 className="main-title">Modifica contenuto diario</h2>

                <div className="form-section">
                    <label className="form-label">Titolo pagina</label>
                    <div className="title-input-container">
                        <span className="input-icon">📄</span>
                        <input
                            type="text"
                            className="title-input"
                            placeholder="Mi sento triste"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={50}
                        />
                        <button className="edit-icon" aria-label="Modifica">
                            ✏️
                        </button>
                    </div>
                </div>

                <div className="form-section">
                    <div className="textarea-container">
                        <textarea
                            className="content-textarea"
                            placeholder="Scrivi qui i tuoi pensieri..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            maxLength={maxContentLength}
                        />
                        <div className="char-counter">
                            <span className="counter-icon">📝</span>
                            <span className="counter-text">
                                {content.length}/{maxContentLength}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                >
                    Continua →
                </button>
            </div>
        </div>
    );
};

export default EditDiaryPage;
