import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updatePost, getForumPosts } from '../services/forum.service';
import { categoryInfo } from '../services/forum.service';
import type { ForumCategory, UpdatePostDto, ForumPost } from '../types/forum';
import '../css/EditPost.css';

const EditPost: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<ForumCategory>('ansia');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPost();
    }, [id]);

    const loadPost = async () => {
        try {
            setIsLoading(true);
            const data = await getForumPosts();
            const post = [...data.myQuestions, ...data.publicQuestions].find(p => p.id === id);

            if (post) {
                setTitle(post.title);
                setContent(post.content);
                setCategory(post.category);
            } else {
                alert('Domanda non trovata');
                navigate('/forum');
            }
        } catch (error) {
            console.error('Error loading post:', error);
            alert('Errore nel caricamento della domanda');
            navigate('/forum');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert('Per favore compila tutti i campi');
            return;
        }

        if (!id) {
            alert('ID domanda mancante');
            return;
        }

        try {
            setIsSubmitting(true);
            const updateData: UpdatePostDto = {
                title: title.trim(),
                content: content.trim(),
                category,
            };
            await updatePost(id, updateData);
            navigate('/forum');
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Errore nella modifica del post');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/forum');
    };

    if (isLoading) {
        return <div className="loading-screen">Caricamento...</div>;
    }

    return (
        <div className="edit-post-page">
            <div className="edit-post-header">
                <button className="back-button" onClick={handleCancel} aria-label="Indietro">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <h1 className="edit-post-title">Modifica Domanda</h1>
            </div>

            <form className="edit-post-form" onSubmit={handleSubmit}>
                <div className="form-section">
                    <label className="form-label">Titolo</label>
                    <div className="input-with-icon">
                        <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Rottura recente..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={64}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div className="form-section">
                    <label className="form-label">Contenuto</label>
                    <div className="textarea-container">
                        <textarea
                            className="form-textarea"
                            placeholder="Come faccio a superare una rottura dopo una relazione durata 12 anni?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={8}
                            maxLength={300}
                            disabled={isSubmitting}
                        />
                        <div className="char-counter">
                            {content.length}/300
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <label className="form-label">Seleziona una categoria</label>
                    <div className="category-dropdown">
                        <select
                            className="category-select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as ForumCategory)}
                            disabled={isSubmitting}
                        >
                            {categoryInfo.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                        <svg className="dropdown-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                    </div>
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting || !title.trim() || !content.trim()}
                >
                    {isSubmitting ? 'Modifica in corso...' : 'Modifica Domanda'}
                </button>
            </form>
        </div>
    );
};

export default EditPost;
