import React, { useState } from 'react';
import './Preview.css';

const Preview = ({ name, user, images, tags }) => {
    // Используем состояние для отслеживания текущей картинки
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Функция для перехода к следующему изображению
    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // Функция для перехода к предыдущему изображению
    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    // Отделяем тэг "Реклама" от остальных тэгов
    const regularTags = tags.filter(tag => tag !== 'Реклама');
    const adTag = tags.includes('Реклама') ? 'Реклама' : null;

    return (
        <div className="preview-container">
            {/* Контейнер с аватаром */}
            <div className="preview-image-wrapper">
                <img
                    src={images[currentImageIndex]} // Показ текущей картинки
                    alt="Announcement Preview"
                    className="preview-image"
                />
                {/* Показываем элементы перелистывания, только если больше одной картинки */}
                {images.length > 1 && (
                    <>
                        <button className="preview-arrow left" onClick={prevImage}>
                            &lt;
                        </button>
                        <button className="preview-arrow right" onClick={nextImage}>
                            &gt;
                        </button>
                    </>
                )}
            </div>

            {/* Имя пользователя */}
            <h3 className="preview-name">{name}</h3>

            {/* Логин пользователя */}
            <p className="preview-user">Создано пользователем {user}</p>

            {/* Тэги объявления */}
            <div className="preview-tags">
                {regularTags.length > 0
                    ? regularTags.map((tag, index) => <span key={index} className="preview-tag">{tag}</span>)
                    : <span className="preview-tag">No tags</span>}
            </div>

            {/* Тэг "Реклама" отдельно */}
            {adTag && (
                <div className="ad-tag">
                    {adTag}
                </div>
            )}
        </div>
    );
};

export default Preview;
