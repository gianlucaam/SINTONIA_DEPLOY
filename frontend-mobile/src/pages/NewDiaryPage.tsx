import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftArrow from '../assets/icons/LeftArrow.svg';
import { createDiaryPage } from '../services/diary.service';
import '../css/NewDiaryPage.css';

const NewDiaryPage: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const maxContentLength = 2000;

    const handleBack = () => {
        navigate('/diary');
    };

    const handleSubmit = async () => {
        if (!isFormValid || isLoading) return;

        setIsLoading(true);
        try {
            await createDiaryPage({ title, content });
            alert('Pagina salvata con successo!');
            navigate('/diary');
        } catch (error) {
            console.error('Error saving diary page:', error);
            alert('Errore durante il salvataggio. Riprova.');
        } finally {
            setIsLoading(false);
        }
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
                    disabled={!isFormValid || isLoading}
                >
                    {isLoading ? 'Salvataggio...' : 'Continua →'}
                </button>
            </div>
        </div>
    );
};

export default NewDiaryPage;
