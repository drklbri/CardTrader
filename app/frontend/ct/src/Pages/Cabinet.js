import React, { useState, useEffect } from 'react';
import Avatar from '../Components/Avatar';
import ProfileActions from '../Components/ProfileAction';
import Preview from '../Components/Preview'; // Импорт компонента Preview
import axios from 'axios';
import './Cabinet.css'; // Импорт стилей
/* global ym */

const Cabinet = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [averageRating] = useState(0);
    const [reviewCount] = useState(0);
    const [announcements, setAnnouncements] = useState([]); // Все объявления
    const [visibleAnnouncements, setVisibleAnnouncements] = useState([]); // Видимые объявления
    const [visibleCount, setVisibleCount] = useState(8); // Количество отображаемых объявлений

    const YandexMetrika = () => {
        useEffect(() => {
            // Инициализация Яндекс.Метрики
            (function (m, e, t, r, i, k, a) {
                m[i] = m[i] || function () {
                    (m[i].a = m[i].a || []).push(arguments)
                };
                m[i].l = 1 * new Date();
                for (var j = 0; j < document.scripts.length; j++) {
                    if (document.scripts[j].src === r) {
                        return;
                    }
                }
                k = e.createElement(t);
                a = e.getElementsByTagName(t)[0];
                k.async = 1;
                k.src = r;
                a.parentNode.insertBefore(k, a);
            })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(98526521, "init", {
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true,
            });
        }, []);
    }

    // Эффект для загрузки данных объявлений при заходе на страницу
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get('https://card-trader.online/api/announcements', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                setAnnouncements(response.data); // Сохраняем все объявления
                setVisibleAnnouncements(response.data.slice(0, visibleCount)); // Отображаем первые 8 объявлений
            } catch (error) {
                console.error('Ошибка при загрузке объявлений:', error);
            }
        };

        fetchAnnouncements();
    }, [visibleCount]);

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

    // Обработчик для показа больше объявлений
    const handleShowMore = () => {
        const nextCount = visibleCount + 8;
        setVisibleCount(nextCount > announcements.length ? announcements.length : nextCount);
        setVisibleAnnouncements(announcements.slice(0, nextCount));
    };

    return (
        <div className="cabinet-container">
            {/* Левая колонка с аватаром и действиями профиля */}
            <div className="left-column">
                <Avatar
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    averageRating={averageRating}
                    reviewCount={reviewCount}
                />
                <ProfileActions onChangeAvatar={triggerAvatarChange} />
                <input
                    type="file"
                    accept="image/*"
                    id="avatar-upload"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                />
            </div>

            {/* Правая колонка с объявлениями */}
            <div className="right-column">
                <div className="announcements-container">
                    {visibleAnnouncements.map((announcement) => (
                        <Preview
                            key={announcement.id}
                            name={announcement.name}
                            user={announcement.user}
                            images={['https://via.placeholder.com/150']} // Заглушка для изображений
                            tags={['Tag1', 'Tag2']} // Заглушка для тэгов
                        />
                    ))}
                </div>

                {/* Кнопка "Показать больше" */}
                {visibleAnnouncements.length < announcements.length && (
                    <button className="show-more-button" onClick={handleShowMore}>
                        Показать больше
                    </button>
                )}
            </div>
        </div>
    );
};

export default Cabinet;
