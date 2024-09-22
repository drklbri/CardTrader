import React, {useEffect} from 'react';
import './Avatar.css';
import axios from "axios";

const Avatar = ({ imageUrl, setImageUrl, averageRating, reviewCount }) => {
    const fetchAvatar = async () => {
        try {
            const response = await axios.get('https://card-trader.online/profile/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            console.log('Response data:', response.data);

            if (response.data && response.data.link) {
                setImageUrl(response.data.link);
            } else {
                console.error('Аватар не найден в ответе');
                setImageUrl(''); // Устанавливаем пустую строку, если аватар отсутствует
            }
        } catch (error) {
            console.error('Ошибка при получении аватара:', error);
            setImageUrl(''); // Устанавливаем пустую строку при ошибке
        }
    };

    useEffect(() => {
        fetchAvatar(); // Загружаем аватар при первом рендере

        const intervalId = setInterval(() => {
            fetchAvatar();
        }, 1000); // Проверяем каждые 5 секунд

        return () => clearInterval(intervalId);
    }, [setImageUrl]);

    return (
        <div className="avatar-container">
            <div className="avatar-image-wrapper">
                <img
                    src={imageUrl || 'https://via.placeholder.com/120'}
                    alt="User Avatar"
                    className="avatar-image"
                />
            </div>
            <div className="avatar-info">
                <div className="avatar-review-container">
                    <span className="avatar-reviews">{reviewCount} отзывов</span>
                    <span className="avatar-rating">Рейтинг: {averageRating.toFixed(1)} / 10</span>
                </div>
            </div>
        </div>
    );
};

export default Avatar;
