import React, { useEffect, useState } from 'react';
import './Avatar.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Avatar = ({ login }) => {
    const [avatar_url, setImageUrl] = useState(''); // Состояние для URL аватара
    const [reviewCount, setReviewCount] = useState(0); // Состояние для количества отзывов
    const [username, setUsername] = useState(''); // Состояние для имени пользователя

    // Функция для получения аватара и количества отзывов
    const fetchUserDetails = async (username) => {
        try {
            const response = await axios.get(`https://card-trader.online/api/auth/user/login/${username}`);

            if (response.data) {
                setImageUrl(response.data.avatar_url); // Устанавливаем URL аватара
                setReviewCount(response.data.comment_count || 0); // Устанавливаем количество отзывов
                setUsername(username); // Устанавливаем имя пользователя
            } else {
                console.error('Данные пользователя не найдены по username:', username);
                setImageUrl(''); // Если аватар отсутствует
            }
        } catch (error) {
            console.error('Ошибка при получении деталей пользователя:', error);
            setImageUrl(''); // Устанавливаем пустую строку при ошибке
        }
    };

    useEffect(() => {
        // Проверяем, авторизован ли пользователь
        const token = localStorage.getItem('access_token');
        if (token) {
            // Если авторизован, получаем данные о пользователе
            fetchUserDetails(login);
        } else {
            // Если не авторизован, можем получить данные о пользователе по логину
            fetchUserDetails(login);
        }

        const intervalId = setInterval(() => {
            const token = localStorage.getItem('access_token');
            if (token) {
                fetchUserDetails(login); // Проверяем каждые 2000 мс
            }
        }, 2000);

        return () => clearInterval(intervalId);
    }, [login]);

    return (
        <div className="avatar-container">
            <div className="avatar-image-wrapper">
                <img
                    src={avatar_url || 'https://via.placeholder.com/120'}
                    alt="User Avatar"
                    className="avatar-image"
                />
            </div>
            <div className="avatar-info">
                {username && (
                    <Link to={`/user/${login}`} className="avatar-username">
                        {username}
                    </Link>
                )} {/* Имя пользователя как ссылка */}
                <div className="avatar-review-container">
                    <span className="avatar-reviews">Отзывов: {reviewCount}</span> {/* Количество отзывов без ссылки */}
                </div>
            </div>
        </div>
    );
};

export default Avatar;
