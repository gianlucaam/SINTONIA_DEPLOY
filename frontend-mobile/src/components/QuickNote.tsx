import React from 'react';
import '../css/QuickNote.css';
import noteIcon from '../assets/icons/sintonia-mockup-monotone.svg';
import editIcon from '../assets/icons/edit-pen.svg';

const QuickNote: React.FC = () => {
    return (
        <div className="quick-note-container">
            <div className="quick-note-card">
                <div className="note-icon">
                    <img src={noteIcon} alt="Note" />
                </div>
                <input
                    type="text"
                    placeholder="Vuoi inserire una nota rapida?"
                    className="note-input"
                />
                <button className="edit-button">
                    <img src={editIcon} alt="Edit" />
                </button>
            </div>


        </div>
    );
};

export default QuickNote;
