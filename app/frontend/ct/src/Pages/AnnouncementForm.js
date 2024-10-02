import React, {useEffect} from 'react';
import YandexMetrika from "../Components/YandexMetrika";
/* global ym */

const AnnouncementForm = ({ announcementInfo, onAnnouncementChange, cards, onCreate }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onAnnouncementChange((prevState) => ({ ...prevState, [name]: value }));
    };

    return (
        <div className="announcement-form">
            <YandexMetrika />
            <div className="gallery">
                {cards.map((card, index) => (
                    <img key={index} src={card.image || 'https://via.placeholder.com/100'} alt={`Card ${index + 1}`} />
                ))}
            </div>

            <div className="announcement-details">
                <input
                    type="text"
                    name="name"
                    value={announcementInfo.name}
                    onChange={handleInputChange}
                    placeholder="Название объявления"
                />
                <textarea
                    name="description"
                    value={announcementInfo.description}
                    onChange={handleInputChange}
                    placeholder="Описание объявления"
                ></textarea>
                <input
                    type="text"
                    name="contactInfo"
                    value={announcementInfo.contactInfo}
                    onChange={handleInputChange}
                    placeholder="Контактная информация"
                />
                <button className="create-button" onClick={onCreate}>
                    Создать объявление
                </button>
            </div>
        </div>
    );
};

export default AnnouncementForm;
