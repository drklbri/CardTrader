import React, { useState } from 'react';
import './CreateAnnouncement.css';

const CreateAnnouncement = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [cards, setCards] = useState([{ id: 1, tags: [], images: [] }]);
    const [announcementData, setAnnouncementData] = useState({ name: '', description: '', contactInfo: '' });
    const [selectedCondition, setSelectedCondition] = useState('minor_wear'); // Состояние
    const [selectedRarity, setSelectedRarity] = useState('common'); // Редкость
    const [selectedImage, setSelectedImage] = useState(null);
    const [announcementId, setAnnouncementId] = useState(null); // Состояние для хранения ID объявления

    const handleAddCard = () => {
        setCards([...cards, { id: cards.length + 1, tags: [], images: [] }]);
    };

    const handleRemoveCard = (id) => {
        setCards(cards.filter(card => card.id !== id));
    };

    const handleImageSelect = (image) => {
        setSelectedImage(image); // Устанавливаем выбранное изображение
    };

    const handleImageUpload = (event, id) => {
        const file = event.target.files[0]; // Get the file object
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCards(cards.map(card =>
                    card.id === id ? { ...card, images: [...card.images, file] } : card
                ));
            };
            reader.readAsDataURL(file); // Read the file and set the base64 URL
        }
    };


    const handleImageRemove = (cardId, imageIndex) => {
        setCards(cards.map(card =>
            card.id === cardId
                ? { ...card, images: card.images.filter((_, index) => index !== imageIndex) }
                : card
        ));
    };

    const handleTagInput = (event, id) => {
        if (event.key === 'Enter' || event.key === ',') {
            const newTag = event.target.value.trim();
            if (newTag) {
                setCards(cards.map(card =>
                    card.id === id ? { ...card, tags: [...card.tags, newTag] } : card
                ));
                event.target.value = ''; // Очищаем поле ввода
            }
            event.preventDefault(); // Отключаем стандартное поведение Enter
        }
    };

    const handleTagRemove = (cardId, tagIndex) => {
        setCards(cards.map(card =>
            card.id === cardId
                ? { ...card, tags: card.tags.filter((_, index) => index !== tagIndex) }
                : card
        ));
    };

    const handleAnnouncementChange = (e) => {
        setAnnouncementData({ ...announcementData, [e.target.name]: e.target.value });
    };

    // Функция для отправки объявления на сервер
    const handleSubmit = async () => {
        try {
            // Сначала отправляем запрос для создания объявления
            const response = await fetch('/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({
                    name: announcementData.name,
                    description: announcementData.description,
                    contact_info: announcementData.contactInfo,
                }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при создании объявления');
            }

            // Получаем последнее объявление
            const latestAnnouncementResponse = await fetchLatestAnnouncement();
            const announcementId = latestAnnouncementResponse[0].id;

            // Массив для хранения ID созданных карт
            const cardIds = [];

            // Отправляем запросы на создание карт для каждой вкладки
            for (const card of cards) {
                const cardResponse = await fetch('/cards', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                    body: JSON.stringify({
                        announcement: announcementId, // ID объявления
                        condition: selectedCondition, // Состояние
                        rarity: selectedRarity, // Редкость
                        tags: card.tags // Теги из текущей карты
                    }),
                });

            }

            const cardData = await fetchLatestAnnouncement()
            cardIds.push(cardData[0].cards); // Сохраняем ID созданной карты

            // Загружаем изображения для карт после создания всех карт
            for (let i = 0; i < cards.length; i++) {
                const cardId = cardIds[0][i]; // Получаем ID карты
                const images = cards[i].images; // Получаем изображения из текущей карты
                await uploadCardImages(cardId, images); // Загружаем изображения для этой карты
            }

        } catch (error) {
            console.error(error);
        }
    };

    const uploadCardImages = async (cardId, images) => {
        try {
            for (const image of images) {
                const formData = new FormData();
                formData.append('picture', image); // Append the file directly
                console.log(formData)
                const response = await fetch(`/cards/${cardId}/pictures/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Ошибка при загрузке изображения для карты ${cardId}`);
                }

                console.log(`Изображение успешно загружено для карты ${cardId}`);
            }
        } catch (error) {
            console.error(`Ошибка при отправке изображений для карты ${cardId}:`, error);
        }
    };


    // Функция для получения последнего объявления
    const fetchLatestAnnouncement = async () => {
        try {
            const response = await fetch('/announcements/latest/?limit=1');

            if (!response.ok) {
                throw new Error('Ошибка при получении последнего объявления');
            }

            const data = await response.json();
            console.log("Последнее объявление:", data);
            return data; // Возвращаем данные
        } catch (error) {
            console.error(error);
            throw error; // Пробрасываем ошибку дальше
        }
    };

    const allImages = cards.reduce((acc, card) => [...acc, ...card.images], []);

    return (
        <div className="create-announcement-container">
            <div className="tabs-container">
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        className={`tab ${currentTab === index ? 'active-tab' : ''}`}
                        onClick={() => setCurrentTab(index)}
                    >
                        {`Карта ${card.id}`}
                        {index > 0 && (
                            <button className="remove-card-button" onClick={() => handleRemoveCard(card.id)}>
                                ✖
                            </button>
                        )}
                    </div>
                ))}
                <button className="tab" onClick={handleAddCard}>
                    Добавить карту +
                </button>
                <button
                    className={`tab ${currentTab === cards.length ? 'active-tab' : ''}`} // Изменяем цвет активной вкладки
                    onClick={() => setCurrentTab(cards.length)}
                >
                    Объявление
                </button>
            </div>

            <div className="tab-content">
                {currentTab < cards.length && (
                    <div className="card-form">
                        <div className="image-upload-ad">
                            <label className="upload-button">
                                Загрузить изображение
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, cards[currentTab].id)}
                                />
                            </label>
                            <div className="image-preview-ad">
                                {cards[currentTab].images.map((image, index) => {
                                    const imageUrl = URL.createObjectURL(image); // Create a URL for the file for display
                                    return (
                                        <div key={index} className="image-container">
                                            <img src={imageUrl} alt={`Preview ${index}`}/>
                                            <button
                                                className="remove-image-button"
                                                onClick={() => handleImageRemove(cards[currentTab].id, index)}
                                            >
                                                ✖
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Новые фильтры */}
                        <div className="filters-section">
                            <div className="filter">
                                <label htmlFor="condition-select">Состояние:</label>
                                <select
                                    id="condition-select"
                                    value={selectedCondition}
                                    onChange={(e) => setSelectedCondition(e.target.value)}
                                >
                                    <option value="perfect">Идеальная</option>
                                    <option value="pack_fresh">Только открытая</option>
                                    <option value="minor_wear">Немного поигранная</option>
                                    <option value="visible_wear">Умеренно поигранная</option>
                                    <option value="severe_wear">Поигранная</option>
                                    <option value="damaged">Сильно поигранная</option>
                                    <option value="destroyed">Уничтоженная</option>
                                </select>
                            </div>
                            <div className="filter">
                                <label htmlFor="rarity-select">Редкость:</label>
                                <select
                                    id="rarity-select"
                                    value={selectedRarity}
                                    onChange={(e) => setSelectedRarity(e.target.value)}
                                >
                                    <option value="common">Обычная</option>
                                    <option value="uncommon">Необычная</option>
                                    <option value="rare">Редкая</option>
                                    <option value="mythic">Мифическая</option>
                                    <option value="epic">Эпическая</option>
                                    <option value="legendary">Легендарная</option>
                                </select>
                            </div>
                        </div>
                        <div className="tags-section" style={{ display: 'flex', flexDirection: 'column' }}>
                            <input
                                type="text"
                                placeholder="Введите теги"
                                onKeyDown={(e) => handleTagInput(e, cards[currentTab].id)}
                                style={{ marginBottom: '10px' }} // Optional: add some space below the input
                            />
                            <div className="tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {cards[currentTab].tags.map((tag, index) => (
                                    <div key={index} className="tag-item" style={{ display: 'flex', alignItems: 'center' }}>
                                        {tag}
                                        <span className="remove-tag" onClick={() => handleTagRemove(cards[currentTab].id, index)}> ✖ </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Объявление */}
                {currentTab === cards.length && (
                    <div className="announcement-form">
                        <div className="large-image-container">
                            {selectedImage ? (
                                <img src={URL.createObjectURL(selectedImage)} alt="Selected" className="large-image" />
                            ) : (
                                <p>Выберите изображение для просмотра</p>
                            )}
                        </div>
                        <div className="image-gallery-special">
                            {allImages.map((file, index) => (
                                <img
                                    key={index}
                                    src={URL.createObjectURL(file)} // Используем URL.createObjectURL для отображения файла
                                    alt={`Gallery ${index}`}
                                    className="thumbnail"
                                    onClick={() => handleImageSelect(file)} // Передаем файл в обработчик выбора изображения
                                />
                            ))}
                        </div>

                        <div className="announcement-details">
                            <input
                                type="text"
                                name="name"
                                placeholder="Название объявления"
                                value={announcementData.name}
                                onChange={handleAnnouncementChange}
                            />
                            <textarea
                                name="description"
                                placeholder="Описание"
                                value={announcementData.description}
                                onChange={handleAnnouncementChange}
                            />
                            <input
                                type="text"
                                name="contactInfo"
                                placeholder="Контактная информация"
                                value={announcementData.contactInfo}
                                onChange={handleAnnouncementChange}
                            />
                        </div>
                    </div>
                )}
            </div>

            {currentTab === cards.length && (
                <button className="create-button" onClick={handleSubmit}>Создать объявление</button>
            )}
        </div>
    );
};

export default CreateAnnouncement;
