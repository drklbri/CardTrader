import React, { useState } from 'react';
import Avatar from '../Components/Avatar';
import ProfileActions from '../Components/ProfileAction';

const Cabinet = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);

    // Обработчик для загрузки файла (аватара)
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result); // Устанавливаем локальный URL изображения
            };
            reader.readAsDataURL(file);
        }
    };

    // Триггер для открытия диалога выбора аватара
    const triggerAvatarChange = () => {
        document.getElementById('avatar-upload').click();
    };

    // Обработчик для обновления оценки
    const handleRatingChange = (event) => {
        setAverageRating(parseFloat(event.target.value));
    };

    // Обработчик для обновления количества отзывов
    const handleReviewCountChange = (event) => {
        setReviewCount(parseInt(event.target.value, 10));
    };

    return (
        <div>
            <Avatar
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                averageRating={averageRating}
                reviewCount={reviewCount}
            />

            {/* Включаем новый компонент с действиями профиля */}
            <ProfileActions onChangeAvatar={triggerAvatarChange} />

            {/* Скрытый input для загрузки аватара */}
            <input
                type="file"
                accept="image/*"
                id="avatar-upload"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
            />
        </div>
    );
};

export default Cabinet;
