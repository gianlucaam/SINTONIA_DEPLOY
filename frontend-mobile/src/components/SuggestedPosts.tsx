import React from 'react';
import type { SuggestedPost } from '../types/home';

interface SuggestedPostsProps {
    posts: SuggestedPost[];
}

const SuggestedPosts: React.FC<SuggestedPostsProps> = ({ posts }) => {
    return (
        <div className="suggested-posts-section">
            <div className="section-header">
                <h3>Post che potrebbero interessarti</h3>
                <button className="more-options">•••</button>
            </div>

            <div className="posts-container no-scrollbar">
                {posts.map((post) => (
                    <div key={post.id} className="post-card">
                        <div className="post-category-tag">
                            {post.category}
                        </div>
                        <h4 className="post-title">{post.title}</h4>
                        <p className="post-snippet">{post.contentSnippet}</p>
                    </div>
                ))}
            </div>

            <style>{`
                .suggested-posts-section {
                    margin-bottom: 100px; /* Space for bottom nav */
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px;
                    margin-bottom: 15px;
                }

                .section-header h3 {
                    font-size: 1.1rem;
                    font-weight: 800;
                }

                .more-options {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    color: var(--primary-light);
                    cursor: pointer;
                    letter-spacing: 2px;
                }

                .posts-container {
                    display: flex;
                    gap: 15px;
                    overflow-x: auto;
                    padding: 0 20px 20px; /* Bottom padding for shadow */
                }

                .post-card {
                    min-width: 260px;
                    background-color: var(--white);
                    border-radius: 20px;
                    padding: 20px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .post-category-tag {
                    align-self: flex-start;
                    background-color: #e0f2f1; /* Light teal bg */
                    color: var(--primary-dark);
                    font-size: 0.7rem;
                    font-weight: 700;
                    padding: 5px 10px;
                    border-radius: 8px;
                    text-transform: uppercase;
                }

                .post-title {
                    font-size: 0.95rem;
                    font-weight: 700;
                    line-height: 1.4;
                }

                .post-snippet {
                    font-size: 0.85rem;
                    color: var(--text-gray);
                    line-height: 1.4;
                }
            `}</style>
        </div>
    );
};

export default SuggestedPosts;
