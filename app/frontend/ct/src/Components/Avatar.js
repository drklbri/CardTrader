import React from 'react';
import './Avatar.css';

const Avatar = ({imageUrl, setImageUrl, averageRating, reviewCount}) => {
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

    return (
        <div className="avatar-container">
            <div className="avatar-image-wrapper">
                <img src={imageUrl || 'https://via.placeholder.com/120'} alt="User Avatar" className="avatar-image"/>
            </div>
            <div className="avatar-info">
                <div className="avatar-review-container">
                    <span className="avatar-reviews">{reviewCount} reviews</span>
                    <span className="avatar-rating">Рейтинг: {averageRating.toFixed(1)} / 5</span>
                </div>
            </div>
        </div>
    );
};

export default Avatar;
