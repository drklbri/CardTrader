import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link для создания ссылки
import axios from 'axios';
import './CommentsContainer.css'; // Подключаем CSS файл

const CommentsContainer = ({ comments }) => {
    const [avatars, setAvatars] = useState({}); // Хранение URL аватарок

    useEffect(() => {
        // Функция для получения аватара по логину
        const fetchAvatars = async () => {
            const newAvatars = {};
            for (const comment of comments) {
                try {
                    const response = await axios.get(`api/auth/user/login/${comment.name}`);
                    newAvatars[comment.name] = response.data.avatar_url || 'https://via.placeholder.com/40';
                } catch (error) {
                    console.error(`Ошибка при загрузке аватара для ${comment.name}:`, error);
                    newAvatars[comment.name] = 'https://via.placeholder.com/40'; // Заглушка в случае ошибки
                }
            }
            setAvatars(newAvatars);
        };

        fetchAvatars();
    }, [comments]);

    return (
        <div className="comments-container">
            <h4>Последние комментарии:</h4>
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.id} className="comment">
                        <div className="comment-avatar">
                            <img
                                src={avatars[comment.name] || 'https://via.placeholder.com/40'}
                                alt={comment.name}
                            />
                        </div>
                        <div className="comment-content">
                            {/* Делаем логин пользователя ссылкой на его профиль */}
                            <Link to={`/user/${comment.name}`} className="comment-author">
                                {comment.name}
                            </Link>
                            <p className="comment-text">{comment.comment}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>Комментариев нет.</p>
            )}
        </div>
    );
};

export default CommentsContainer;
