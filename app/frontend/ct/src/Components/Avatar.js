import React, {useEffect} from 'react';
import './Avatar.css';
import axios from "axios";

const Avatar = ({ imageUrl, setImageUrl, averageRating, reviewCount }) => {
    // Запрашиваем аватар при загрузке компонента
    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await axios.get('https://card-trader.online/profile/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Используем токен для авторизации
                    },
                });

                // Выводим в консоль, чтобы увидеть, что возвращает сервер
                console.log('Response data:', response.data);

                // Предполагаем, что URL аватара находится в поле response.data.avatar (измените это в зависимости от фактического поля)
                if (response.data && response.data.link) {
                    setImageUrl(response.data.link); // Устанавливаем URL аватара
                } else {
                    console.error('Аватар не найден в ответе');
                }
            } catch (error) {
                console.error('Ошибка при получении аватара:', error);
            }
        };

        fetchAvatar(); // Вызываем функцию для загрузки аватара
    }, [setImageUrl]); // useEffect выполнится только при первом рендере

    return (
        <div className="avatar-container">
            <div className="avatar-image-wrapper">
                {/* Если imageUrl пуст, выводим плейсхолдер */}
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
