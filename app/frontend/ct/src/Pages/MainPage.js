import React, { useState, useEffect } from 'react';
import Filters from '../Components/Filters';
import axios from 'axios';
import Preview from '../Components/Preview';
import "./MainPage.css";
import { Link } from 'react-router-dom';

const MainPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [visibleAnnouncements, setVisibleAnnouncements] = useState(18);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get('https://card-trader.online/announcements');
                setAnnouncements(response.data);
                setFilteredAnnouncements(response.data); // Изначально показываем все объявления
            } catch (error) {
                console.error('Ошибка при загрузке объявлений:', error);
            }
        };

        fetchAnnouncements();
    }, []);

    const showMoreAnnouncements = () => {
        setVisibleAnnouncements((prev) => prev + 21);
    };

    const handleFilterToggle = (isOpen) => {
        setIsFilterOpen(isOpen);
    };

    const applyFilters = async (filterData) => {
        setFilters(filterData);

        const filtered = await filterAnnouncements(filterData);
        setFilteredAnnouncements(filtered);
    };

    const filterAnnouncements = async (filterData) => {
        const { tags, condition, rarity } = filterData;

        let filtered = announcements;

        // Фильтрация по тегам
        if (tags && tags.length > 0) {
            filtered = filtered.filter(announcement =>
                tags.every(tag => announcement.tags.includes(tag))
            );
        }

        // Фильтрация по картам
        if (condition || rarity) {
            const filteredWithCards = [];
            for (const announcement of filtered) {
                if (announcement.cards.length === 0) {continue}
                const cardId = announcement.cards[0]; // Берем первую карту
                const cardResponse = await axios.get(`/cards/${cardId}`);
                const card = cardResponse.data;
                console.log(condition, card.condition)
                const isConditionMatch = !condition || card.condition === condition;
                const isRarityMatch = !rarity || card.rarity === rarity;

                if (isConditionMatch && isRarityMatch) {
                    filteredWithCards.push(announcement);
                }
            }
            filtered = filteredWithCards;
        }

        return filtered;
    };

    return (
        <div>
            <Filters applyFilters={applyFilters} onToggle={handleFilterToggle} />

            {/* Контейнер с объявлениями */}
            <div className={`announcements-grid ${isFilterOpen ? 'filter-open' : ''}`}>
                {filteredAnnouncements.slice(0, visibleAnnouncements).map((announcement) => (
                    <Preview
                        key={announcement.id}
                        name={
                            <Link to={`/announcement/${announcement.id}`} className="link">
                                {announcement.name}
                            </Link>
                        }
                        user={
                            <Link to={`/user/${announcement.user_login}`} className="link">
                                {announcement.user_login}
                            </Link>
                        }
                        images={announcement.card_images || ['https://via.placeholder.com/150']}
                        tags={announcement.tags || ['No tags']}
                    />
                ))}
            </div>

            {visibleAnnouncements < filteredAnnouncements.length && (
                <button className="show-more-button" onClick={showMoreAnnouncements}>
                    Показать больше
                </button>
            )}
        </div>
    );
};

export default MainPage;
