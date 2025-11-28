import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ForumHeader from '../components/ForumHeader';
import CategoryFilters from '../components/CategoryFilters';
import ForumPostCard from '../components/ForumPostCard';
import BottomNavigation from '../components/BottomNavigation';
import { getForumPosts, deletePost } from '../services/forum.service';
import type { ForumPost, ForumCategory } from '../types/forum';
import '../css/Forum.css';

const Forum: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [myQuestions, setMyQuestions] = useState<ForumPost[]>([]);
    const [publicQuestions, setPublicQuestions] = useState<ForumPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<ForumCategory[]>([]);

    useEffect(() => {
        fetchPosts();
    }, [location.key]); // Ricarica quando la location cambia (es. tornando da CreatePost)

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await getForumPosts();
            setMyQuestions(data.myQuestions);
            setPublicQuestions(data.publicQuestions);
        } catch (error) {
            console.error('Error fetching forum posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPost = () => {
        navigate('/forum/create');
    };

    const handleEditPost = (id: string) => {
        navigate(`/forum/edit/${id}`);
    };

    const handleDeletePost = async (id: string) => {
        try {
            await deletePost(id);
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleCategoryChange = (categories: ForumCategory[]) => {
        setSelectedCategories(categories);
        // Funzionalità filtering rimandata - i bottoni sono visibili ma non funzionali
    };

    if (loading) {
        return <div className="loading-screen">Caricamento...</div>;
    }

    return (
        <div className="forum-page">
            <ForumHeader postCount={myQuestions.length + publicQuestions.length} onAddPost={handleAddPost} />
            <CategoryFilters
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
            />
            <div className="forum-content">
                {/* Sezione Le Mie Domande */}
                {myQuestions.length > 0 && (
                    <div className="forum-section">
                        <h2 className="section-title">Le Mie Domande</h2>
                        <div className="posts-list">
                            {myQuestions.map(post => (
                                <ForumPostCard
                                    key={post.id}
                                    post={post}
                                    isOwnPost={true}
                                    onEdit={handleEditPost}
                                    onDelete={handleDeletePost}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Sezione Domande Pubbliche */}
                {publicQuestions.length > 0 && (
                    <div className="forum-section">
                        <h2 className="section-title">Domande Pubbliche</h2>
                        <div className="posts-list">
                            {publicQuestions.map(post => (
                                <ForumPostCard
                                    key={post.id}
                                    post={post}
                                    isOwnPost={false}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Messaggio se non ci sono domande */}
                {myQuestions.length === 0 && publicQuestions.length === 0 && (
                    <div className="no-posts">
                        <p>Nessuna domanda trovata.</p>
                        <p className="no-posts-hint">Aggiungi la tua prima domanda!</p>
                    </div>
                )}
            </div>
            <BottomNavigation />
        </div>
    );
};

export default Forum;
