import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftArrow from '../assets/icons/LeftArrow.svg';
import '../css/NewDiaryPage.css';

const NewDiaryPage: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const maxContentLength = 250;

    const handleBack = () => {
        navigate('/diary');
    };

    const handleSubmit = () => {
        // TODO: Implementare salvataggio con backend
        // Per ora usa dati mock
        console.log('Saving diary page:', { title, content });

        // Mock: simula salvataggio e torna al diario
        alert('Pagina salvata con successo!');
        navigate('/diary');
    };

    const isFormValid = title.trim().length > 0 && content.trim().length > 0;

    return (
        <div className="new-diary-page">
            <div className="new-diary-header">
                <button className="back-button" onClick={handleBack} aria-label="Indietro">
                    <img src={LeftArrow} alt="" />
                </button>
                <h1 className="page-subtitle">Indietro</h1>
            </div>

            <div className="new-diary-content">
                <h2 className="main-title">Cosa succede oggi?</h2>

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

export default NewDiaryPage;
