import React, {useEffect, useState} from 'react';
import './Avatar.css';
import axios from "axios";

const Avatar = ({login}) => {
    const [avatar_url, setImageUrl] = useState(''); // Состояние для URL аватара
    const [reviewCount, setReviewCount] = useState(0); // Состояние для количества отзывов
    const [username, setUsername] = useState(''); // Состояние для имени пользователя

    // Функция для получения данных пользователя
    const fetchUserData = async () => {
        try {
            const response = await axios.get('https://card-trader.online/auth/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (response.data && response.data.username) {
                setUsername(login); // Устанавливаем имя пользователя
                fetchUserDetails(login); // Запрашиваем детали пользователя по имени
            } else {
                console.error('Данные пользователя не найдены');
            }
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
        }
    };

    // Функция для получения аватара и количества отзывов
    const fetchUserDetails = async (username) => {
        try {
            const response = await axios.get(`https://card-trader.online/auth/user/login/${username}`);

            if (response.data) {
                setImageUrl(response.data.avatar_url); // Устанавливаем URL аватара
                setReviewCount(response.data.reviewCount || 0); // Устанавливаем количество отзывов
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
        fetchUserData(); // Загружаем данные пользователя при первом рендере

        const intervalId = setInterval(() => {
            fetchUserData(); // Проверяем каждые 100 секунд
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

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
                {username && <h3 className="avatar-username">{username}</h3>} {/* Имя пользователя */}
                <div className="avatar-review-container">
                    <span className="avatar-reviews">{reviewCount} отзывов</span>
                </div>
            </div>
        </div>
    );
};

export default Avatar;